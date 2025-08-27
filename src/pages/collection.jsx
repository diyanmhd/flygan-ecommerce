import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../components/search";
import { UserContext } from "../components/UserContext";

function Collection() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const { search } = useContext(SearchContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("⚠️ Please login to add items to wishlist");
      return;
    }

    const newWishlist = wishlist.includes(id)
      ? wishlist.filter((pid) => pid !== id)
      : [...wishlist, id];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  // Filter products by category
  let filteredProducts =
    category === "all"
      ? products
      : products.filter((item) => item.category === category);

  // Filter by search term
  if (search) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } 

  const categories = [
    { id: "all", name: "All Products" },
    { id: "shirt", name: "Shirts" },
    { id: "pant", name: "Pants" },
    { id: "tshirt", name: "T-Shirts" },
    { id: "other", name: "Others" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="prata-regular text-3xl md:text-4xl tracking-wide text-gray-900 mb-2">
              Our Premium Collection
            </h1>
            <p className="text-gray-600">
              Discover our handpicked selection of premium clothing
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                category === cat.id
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <Link to={`/product/${item.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => toggleWishlist(item.id, e)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        wishlist.includes(item.id)
                          ? "bg-red-100 text-red-500"
                          : "bg-white text-gray-400 opacity-0 group-hover:opacity-100 shadow-md hover:bg-red-100 hover:text-red-500"
                      }`}
                    >
                      {wishlist.includes(item.id) ? (
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                    {item.onSale && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h2 className="prata-regular text-base tracking-wide text-gray-900 mb-1 line-clamp-1">
                      {item.name}
                    </h2>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-amber-700">
                        ₹{item.price}
                      </p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">₹{item.originalPrice}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">
              {search 
                ? `No results found for "${search}". Try adjusting your search.`
                : `No products available in ${category === "all" ? "any category" : "this category"}.`
              }
            </p>
            <button
              onClick={() => {
                setCategory("all");
                setSortBy("default");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 transition-colors duration-300"
            >
              View All Products
            </button>
          </div>
        )}


      </div>
    </div>
  );
}

export default Collection;