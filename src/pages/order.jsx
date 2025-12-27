import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import orderService from "../services/orderService";

function Order() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cod");
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  // 🔹 Fetch cart from backend
  useEffect(() => {
    cartService
      .getCart()
      .then((res) => setCart(res.data.data || []))
      .catch((err) => console.error("Failed to load cart", err))
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

  const placeOrder = async () => {
    if (!validateForm()) return;

    const items = cart.map((item) => ({
      ProductId: item.productId,
      Quantity: item.quantity
    }));

    setIsLoading(true);
    try {
      const res = await orderService.checkout({
        DeliveryAddress: address,
        PaymentMethod: payment,
        Items: items
      });

      // ✅ ONLY FIX IS HERE
      navigate("/order-success", {
        state: { order: res.data.data }
      });

    } catch (err) {
      console.error("Order failed", err.response?.data || err);
      alert("Order failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Your cart is empty
      </div>
    );
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-xl mb-6">
              <h2 className="font-semibold mb-3">Delivery Address</h2>
              <textarea
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded p-3"
              />
              {formErrors.address && (
                <p className="text-red-600 text-sm">
                  {formErrors.address}
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl mb-6">
              <h2 className="font-semibold mb-3">Payment Method</h2>
              <label className="flex gap-2">
                <input
                  type="radio"
                  checked={payment === "Cod"}
                  onChange={() => setPayment("Cod")}
                />
                Cash on Delivery
              </label>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h2 className="font-semibold mb-4">Order Items</h2>
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between border-b py-2"
                >
                  <span>{item.productName}</span>
                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl sticky top-6">
              <h2 className="font-semibold mb-3">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={isLoading}
                className="w-full bg-amber-700 text-white py-3 rounded mt-4"
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
