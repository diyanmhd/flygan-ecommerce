import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../components/search";
import { UserContext } from "../components/UserContext";
import productService from "../services/productService";
import wishlistService from "../services/wishlistService";

function Collection() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [category, setCategory] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);

  const { search } = useContext(SearchContext);
  const { user } = useContext(UserContext);

  const categories = [
    { id: 0, name: "All Products" },
    { id: 1, name: "Shirts" },
    { id: 2, name: "Pants" },
    { id: 3, name: "T-Shirts" },
    { id: 4, name: "Others" },
  ];

  // 🔹 Fetch products from DB
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const res = await productService.getAll();
        setProducts(res.data.data ?? res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // 🔹 Fetch wishlist from DB
  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    async function fetchWishlist() {
      try {
        const res = await wishlistService.getWishlist();
        const ids = (res.data.data ?? []).map(w => w.productId);
        setWishlistIds(ids);
      } catch (err) {
        console.error("Wishlist fetch failed", err);
      }
    }

    fetchWishlist();
  }, [user]);

  // 🔹 ADD / REMOVE wishlist (CONNECTED & SAFE)
  const toggleWishlist = async (productId) => {
    try {
      if (wishlistIds.includes(productId)) {
        await wishlistService.removeFromWishlist(productId);
        setWishlistIds(prev =>
          prev.filter(id => id !== productId)
        );
      } else {
        await wishlistService.addToWishlist(productId);
        setWishlistIds(prev => [...prev, productId]);
      }
    } catch (err) {
      // 🔥 IMPORTANT FIX
      if (err.response?.status === 400) {
        // already in wishlist → sync UI
        setWishlistIds(prev =>
          prev.includes(productId) ? prev : [...prev, productId]
        );
      } else {
        console.error("Wishlist toggle failed", err);
      }
    }
  };

  // 🔹 Filtering
  let filteredProducts =
    category === 0
      ? products
      : products.filter(p => p.categoryId === category);

  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="prata-regular text-3xl md:text-4xl tracking-wide">
              Our Premium Collection
            </h1>
            <p className="text-gray-600">
              Discover our handpicked selection of premium clothing
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2 mt-4 md:mt-0"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm ${
                category === cat.id
                  ? "bg-amber-700 text-white"
                  : "bg-white border"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products */}
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredProducts.map(item => (
              <div
                key={item.id}
                className="relative bg-white shadow rounded-lg overflow-hidden"
              >
                {user && (
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-2 right-2 z-10 text-xl"
                  >
                    {wishlistIds.includes(item.id) ? "❤️" : "🤍"}
                  </button>
                )}

                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-60 object-cover"
                  />
                </Link>

                <div className="p-4">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-medium hover:underline">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-amber-700 font-semibold">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No products found</p>
        )}
      </div>
    </div>
  );
}

export default Collection;
