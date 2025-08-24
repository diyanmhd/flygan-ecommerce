import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart_" + userId)) || [];
    setCart(saved);
  }, [userId]);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart_" + userId, JSON.stringify(newCart));
  };

  const increase = (id) => {
    updateCart(
      cart.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrease = (id) => {
    updateCart(
      cart.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : 1 }
          : i
      )
    );
  };

  const remove = (id) => {
    updateCart(cart.filter((i) => i.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen select-none">
      <h1 className="prata-regular text-2xl md:text-3xl tracking-wide text-[#414141] mb-6">
        My Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-sm">No items in cart</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 bg-white hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h2 className="prata-regular text-base tracking-wide text-[#414141] mb-1">
                  {item.name}
                </h2>
                <p className="text-sm font-semibold text-amber-700 mb-2">
                  ₹{item.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => decrease(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    onClick={() => increase(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/product/${item.id}`}
                    className="flex-1 text-center px-3 py-1.5 bg-black text-white rounded-md text-xs hover:bg-gray-900 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 border rounded-lg p-5 bg-white shadow-md h-fit">
            <h2 className="prata-regular text-lg md:text-xl tracking-wide mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-gray-700"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <Link
              to="/order"
              className="block mt-5 w-full bg-black hover:bg-gray-900 text-white py-2 rounded-md text-sm text-center transition"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
