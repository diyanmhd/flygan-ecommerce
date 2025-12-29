import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow p-6 text-center">

        <h1 className="text-2xl font-semibold text-green-700 mb-2">
          🎉 Order Placed Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with us!
        </p>

        <div className="text-left space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Number</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Order Date</span>
            <span>
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium">
              {order.paymentMethod === "Cod"
                ? "Cash on Delivery"
                : order.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Order Status</span>
            <span className="font-medium">{order.status}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-semibold">
              ₹{order.totalAmount}
            </span>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Delivery Address</p>
            <p className="border rounded p-2 text-gray-700">
              {order.deliveryAddress}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-amber-700 text-white py-2 rounded"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/collection")}
            className="flex-1 border border-amber-700 text-amber-700 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;
