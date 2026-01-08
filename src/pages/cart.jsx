import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cartService from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load cart from backend
  const loadCart = async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data.data || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ➕ Increase quantity
  const increase = async (productId, qty) => {
    await cartService.updateQuantity(productId, qty + 1);
    loadCart();
  };

  // ➖ Decrease quantity
  const decrease = async (productId, qty) => {
    if (qty <= 1) return;
    await cartService.updateQuantity(productId, qty - 1);
    loadCart();
  };

  // ❌ Remove item
  const remove = async (productId) => {
    await cartService.removeFromCart(productId);
    loadCart();
  };

  // 💰 Total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="prata-regular text-3xl mb-8 text-green-400">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 p-8 text-center">
            <h2 className="text-xl mb-4 text-gray-200">Your cart is empty</h2>
            <Link
              to="/collection"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors duration-300 shadow-lg shadow-green-900/50"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-6 flex gap-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors duration-300"
                >
                  {/* ✅ IMAGE */}
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded border border-gray-700"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-200">
                      {item.productName}
                    </h3>
                    <p className="text-gray-400">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          decrease(item.productId, item.quantity)
                        }
                        className="w-8 h-8 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-700 hover:border-green-600 hover:text-green-400 transition-all duration-300"
                      >
                        −
                      </button>
                      <span className="text-gray-200 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          increase(item.productId, item.quantity)
                        }
                        className="w-8 h-8 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:bg-gray-700 hover:border-green-600 hover:text-green-400 transition-all duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-green-500 font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      className="text-red-400 text-sm hover:text-red-300 transition-colors duration-300 mt-2"
                      onClick={() => remove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl shadow-black/50 sticky top-6">
                <h2 className="font-semibold mb-4 text-gray-200">
                  Order Summary
                </h2>
                <div className="flex justify-between font-semibold text-gray-200 pb-4 border-b border-gray-800">
                  <span>Total</span>
                  <span className="text-green-500">₹{total}</span>
                </div>

                <Link
                  to="/order"
                  className="block text-center bg-green-600 hover:bg-green-700 text-white mt-6 py-3 rounded transition-colors duration-300 shadow-lg shadow-green-900/50"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;