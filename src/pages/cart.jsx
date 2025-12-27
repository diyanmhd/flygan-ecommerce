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
      <div className="min-h-screen flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="prata-regular text-3xl mb-8">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl mb-4">Your cart is empty</h2>
            <Link
              to="/collection"
              className="bg-amber-700 text-white px-6 py-3 rounded"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3 bg-white rounded-xl shadow">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-6 flex gap-4 border-b"
                >
                  {/* ✅ IMAGE */}
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {item.productName}
                    </h3>
                    <p className="text-gray-500">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          decrease(item.productId, item.quantity)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          increase(item.productId, item.quantity)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p>
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      className="text-red-500 text-sm"
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
              <div className="bg-white p-6 rounded-xl shadow sticky top-6">
                <h2 className="font-semibold mb-4">
                  Order Summary
                </h2>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <Link
                  to="/order"
                  className="block text-center bg-amber-700 hover:bg-amber-800 text-white mt-6 py-3 rounded"
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
