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
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="prata-regular text-3xl md:text-4xl tracking-wide text-green-400">
              Our Premium Collection
            </h1>
            <p className="text-gray-400 mt-1">
              Discover our handpicked selection of premium clothing
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-gray-200 rounded-md px-3 py-2 mt-4 md:mt-0 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                category === cat.id
                  ? "bg-green-600 text-white shadow-lg shadow-green-900/50"
                  : "bg-gray-900 border border-gray-700 text-gray-300 hover:border-green-600 hover:text-green-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products */}
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredProducts.map(item => (
              <div
                key={item.id}
                className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-green-900/20 hover:border-green-800 transition-all duration-300"
              >
                {user && (
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className={`absolute top-2 right-2 z-10 text-xl w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      wishlistIds.includes(item.id)
                        ? "bg-red-500/20 backdrop-blur-sm"
                        : "bg-gray-800/60 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {wishlistIds.includes(item.id) ? "❤️" : "🤍"}
                  </button>
                )}

                <Link to={`/product/${item.id}`}>
                  <div className="overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-medium text-gray-200 group-hover:text-green-400 transition-colors duration-300">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-green-500 font-semibold mt-1">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No products found</p>
        )}
      </div>
    </div>
  );
}

export default Collection;