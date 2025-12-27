import React from "react";
import { useLocation, Link } from "react-router-dom";

function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid order</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="text-center mb-8">
          <div className="text-green-600 text-5xl mb-4">✔</div>
          <h1 className="text-2xl font-semibold">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mt-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Order ID: <b>{order.orderNumber}</b>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Order Details</h3>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Payment: {order.paymentMethod}</p>
            <p>Status: {order.status}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <p>{order.deliveryAddress}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Order Items</h3>
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 mb-4"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>
              <p>₹{item.unitPrice * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/my-orders"
            className="bg-amber-700 text-white px-6 py-3 rounded"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
