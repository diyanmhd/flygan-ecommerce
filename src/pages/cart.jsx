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

  //  Only total (no shipping / no subtotal logic)
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="prata-regular text-3xl md:text-4xl tracking-wide text-gray-900">
            Shopping Cart
          </h1>
          {/* <span className="ml-4 bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span> */}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Product Image and Info */}
                        <div className="flex items-start md:items-center md:w-5/12">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <Link
                              to={`/product/${item.id}`}
                              className="text-sm md:text-base font-medium text-gray-900 hover:text-amber-700 transition-colors duration-300"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-sm text-gray-500">
                              Size: {item.size || "M"}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex justify-between md:block md:w-2/12">
                          <span className="md:hidden text-sm font-medium text-gray-500">
                            Price
                          </span>
                          <span className="text-sm md:text-base font-medium text-gray-900">
                            ₹{item.price}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex justify-between items-center md:w-3/12">
                          <span className="md:hidden text-sm font-medium text-gray-500">
                            Quantity
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => decrease(item.id)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increase(item.id)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total and Actions */}
                        <div className="flex justify-between items-center md:w-2/12">
                          <span className="md:hidden text-sm font-medium text-gray-500">
                            Total
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm md:text-base font-medium text-gray-900">
                              ₹{item.price * item.quantity}
                            </span>
                            <button
                              onClick={() => remove(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                              aria-label="Remove item"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/collection"
                  className="inline-flex items-center text-amber-700 hover:text-amber-800 transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <Link
                  to="/order"
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-md font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  You won't be charged until the next step
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
