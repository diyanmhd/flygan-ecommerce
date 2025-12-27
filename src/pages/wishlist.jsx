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
    return <p className="text-center py-10">Loading...</p>;
  }

  /* ---------- EMPTY ---------- */
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">
          Your wishlist is empty
        </h2>
        <Link
          to="/collection"
          className="px-6 py-2 bg-amber-700 text-white rounded"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ---------- MAIN UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Your Wishlist</h1>
        <p className="text-gray-600 mb-6">
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1 ? "item" : "items"}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="relative bg-white shadow rounded-lg overflow-hidden"
            >
              {/* Remove */}
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-2 right-2 text-xl"
              >
                ❤️
              </button>

              {/* Image */}
              <Link to={`/product/${item.product.id}`}>
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-60 object-cover"
                />
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-medium hover:underline">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-amber-700 font-semibold">
                  ₹{item.product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/collection"
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
