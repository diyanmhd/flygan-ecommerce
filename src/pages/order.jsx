import React, { useState, useEffect } from "react";

function Order() {
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [order, setOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart_" + userId)) || [];
    setCart(savedCart);
  }, [userId]);

  const placeOrder = async () => {
    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }

    const newOrder = {
      userId,
      items: cart,
      address,
      payment,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "Pending",
      date: new Date().toLocaleString(),
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
        alert("Order failed!");
      }
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  if (order) {
    return (
      <div className="p-4">
        <h2>✅ Order Placed</h2>
        <p>Thank you! Your order has been placed.</p>

        <h3>Items</h3>
        {order.items.map((item) => (
          <div key={item.id}>
            {item.name} × {item.quantity} = ₹{item.price * item.quantity}
          </div>
        ))}

        <p><b>Total:</b> ₹{order.total}</p>
        <p><b>Address:</b> {order.address}</p>
        <p><b>Payment:</b> {order.payment}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Date:</b> {order.date}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-3">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left side: items */}
        <div className="flex-1 border rounded p-3 bg-white">
          <h2 className="font-semibold mb-2">Your Items</h2>
          {cart.map((item) => (
            <div key={item.id} className="mb-2">
              <p>{item.name} × {item.quantity}</p>
              <p>₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Right side: summary + form */}
        <div className="w-full lg:w-1/3 border rounded p-3 bg-white">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <p>Total: ₹{cart.reduce((t, i) => t + i.price * i.quantity, 0)}</p>

          <label className="block mt-3 text-sm">Address</label>
          <textarea
            className="w-full border p-2 text-sm mb-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label className="block text-sm">Payment Method</label>
          <select
            className="w-full border p-2 text-sm mb-2"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>

          <button
            onClick={placeOrder}
            className="w-full bg-green-600 text-white py-2 rounded text-sm"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;
