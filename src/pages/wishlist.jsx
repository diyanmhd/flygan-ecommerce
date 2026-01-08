import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import wishlistService from "../services/wishlistService";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await wishlistService.getWishlist();
        setWishlistItems(res.data.data || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems(prev =>
        prev.filter(item => item.productId !== productId)
      );
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return <p className="text-center py-10 text-gray-400">Loading...</p>;
  }

  /* ---------- EMPTY ---------- */
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">
          Your wishlist is empty
        </h2>
        <Link
          to="/collection"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300 shadow-lg shadow-green-900/50"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ---------- MAIN UI ---------- */
  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1 text-green-400">Your Wishlist</h1>
        <p className="text-gray-400 mb-6">
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1 ? "item" : "items"}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-green-900/20 hover:border-green-800 transition-all duration-300"
            >
              {/* Remove */}
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-2 right-2 text-xl w-9 h-9 rounded-full flex items-center justify-center bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 transition-all duration-300 z-10"
              >
                ❤️
              </button>

              {/* Image */}
              <Link to={`/product/${item.product.id}`}>
                <div className="overflow-hidden">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-medium text-gray-200 group-hover:text-green-400 transition-colors duration-300">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-green-500 font-semibold mt-1">
                  ₹{item.product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/collection"
            className="px-6 py-2 border border-gray-700 text-gray-300 rounded hover:bg-gray-900 hover:border-green-600 hover:text-green-400 transition-all duration-300 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;