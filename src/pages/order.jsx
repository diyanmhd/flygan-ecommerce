import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Order() {
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [order, setOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart_" + userId)) || [];
    setCart(savedCart);
  }, [userId]);

  const validateForm = () => {
    const errors = {};
    if (!address.trim()) {
      errors.address = "Please enter your delivery address";
    } else if (address.trim().length < 10) {
      errors.address = "Address should be at least 10 characters long";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const newOrder = {
      userId,
      items: cart,
      address,
      payment,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // only subtotal
      status: "Pending",
      date: new Date().toLocaleString(),
      orderId: "ORD" + Date.now(),
    };

    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        const savedOrder = await res.json();
        localStorage.setItem("cart_" + userId, JSON.stringify([]));
        setOrder(savedOrder);
      } else {
        alert("Order failed! Please try again.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("An error occurred while placing your order.");
    } finally {
      setIsLoading(false);
    }
  };

  if (order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            <p className="text-sm text-gray-500 mt-2">Order ID: {order.orderId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Order Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Order Date:</span> {order.date}</p>
                <p><span className="font-medium">Payment Method:</span> {order.payment === "cod" ? "Cash on Delivery" : order.payment === "card" ? "Credit/Debit Card" : "UPI"}</p>
                <p><span className="font-medium">Status:</span> <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{order.status}</span></p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Delivery Address</h3>
              <p className="text-gray-700">{order.address}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Order Items</h3>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-6">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{order.total}</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/collection" className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-sm text-gray-600">Add some items to your cart before checkout</p>
          </div>
          <div>
            <Link to="/collection" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // no shipping charge

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side: items and form */}
          <div className="w-full lg:w-2/3">
            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${formErrors.address ? "border-red-500" : "border-gray-300"}`}
                  rows="4"
                  value={address}
                  placeholder="Enter your complete delivery address"
                  onChange={(e) => setAddress(e.target.value)}
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${payment === "cod" ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-gray-400"}`}
                  onClick={() => setPayment("cod")}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${payment === "cod" ? "border-amber-500 bg-amber-500" : "border-gray-400"}`}>
                      {payment === "cod" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500">Pay when you receive your order</p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${payment === "card" ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-gray-400"}`}
                  onClick={() => setPayment("card")}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${payment === "card" ? "border-amber-500 bg-amber-500" : "border-gray-400"}`}>
                      {payment === "card" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                  <p className="text-xs text-gray-500">Pay securely with your card</p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${payment === "upi" ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-gray-400"}`}
                  onClick={() => setPayment("upi")}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${payment === "upi" ? "border-amber-500 bg-amber-500" : "border-gray-400"}`}>
                      {payment === "upi" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="font-medium">UPI</span>
                  </div>
                  <p className="text-xs text-gray-500">Pay using UPI apps</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">Size: {item.size || "M"}, Qty: {item.quantity}</p>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={isLoading}
                className="w-full bg-amber-700 text-white py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Place Order • ₹${total}`
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By completing your purchase you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
