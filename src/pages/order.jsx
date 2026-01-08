import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";

function Order() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cod");
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  // Load cart
  useEffect(() => {
    cartService
      .getCart()
      .then((res) => setCart(res.data.data || []))
      .catch((err) => console.error("Cart load failed", err))
      .finally(() => setLoadingCart(false));
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!address.trim() || address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    const items = cart.map((item) => ({
      ProductId: item.productId,
      Quantity: item.quantity
    }));

    setIsLoading(true);

    try {
      // 1️ Create order
      const res = await orderService.checkout({
        DeliveryAddress: address,
        PaymentMethod: payment,
        Items: items
      });

      const order = res.data.data;

      //  COD FLOW
      if (payment === "Cod") {
        navigate("/order-success", { state: { order } });
        return;
      }

      //  RAZORPAY FLOW
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      // 2️ Initiate payment
      const paymentRes = await paymentService.initiatePayment({
        orderId: order.id
      });

      const paymentData = paymentRes.data.data;

      // 3️ Open Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, //  from .env
        amount: paymentData.amountInPaise,        // FIXED
        currency: "INR",
        name: "Flygans",
        description: "Order Payment",
        order_id: paymentData.razorpayOrderId,    // FIXED

        handler: async function (response) {
          // 4️ Confirm payment
          await paymentService.confirmPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          navigate("/order-success", { state: { order } });
        },

        prefill: {
          name: "Flygans Customer"
        },

        theme: {
          color: "#16a34a"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error("Checkout failed", err);
      alert("Order failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCart) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">Loading...</div>;
  }

  if (cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">Your cart is empty</div>;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-400">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl mb-6 shadow-xl shadow-black/50">
              <h2 className="font-semibold mb-3 text-gray-200">Delivery Address</h2>
              <textarea
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded p-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="Enter your complete delivery address..."
              />
              {formErrors.address && (
                <p className="text-red-400 text-sm mt-2">{formErrors.address}</p>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl mb-6 shadow-xl shadow-black/50">
              <h2 className="font-semibold mb-3 text-gray-200">Payment Method</h2>

              <label className="flex gap-2 mb-3 cursor-pointer group">
                <input
                  type="radio"
                  checked={payment === "Cod"}
                  onChange={() => setPayment("Cod")}
                  className="accent-green-600"
                />
                <span className="text-gray-300 group-hover:text-green-400 transition-colors duration-300">Cash on Delivery</span>
              </label>

              <label className="flex gap-2 cursor-pointer group">
                <input
                  type="radio"
                  checked={payment === "Razorpay"}
                  onChange={() => setPayment("Razorpay")}
                  className="accent-green-600"
                />
                <span className="text-gray-300 group-hover:text-green-400 transition-colors duration-300">Razorpay</span>
              </label>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl shadow-black/50">
              <h2 className="font-semibold mb-4 text-gray-200">Order Items</h2>
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between border-b border-gray-800 py-3 last:border-b-0"
                >
                  <span className="text-gray-300">{item.productName}</span>
                  <span className="text-gray-400">₹{item.price} × {item.quantity}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="lg:w-1/3">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl sticky top-6 shadow-xl shadow-black/50">
              <h2 className="font-semibold mb-3 text-gray-200">Summary</h2>
              <div className="flex justify-between mb-2 pb-4 border-b border-gray-800">
                <span className="text-gray-300">Total</span>
                <span className="text-green-500 font-semibold text-lg">₹{subtotal}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded mt-4 hover:bg-green-700 transition-colors duration-300 shadow-lg shadow-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Order;