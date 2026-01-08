import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="bg-gray-900 border border-gray-800 max-w-2xl w-full rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        
        {/* Success Header with Animation */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
              <span className="text-5xl animate-bounce">🎉</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-green-100 text-lg">
              Thank you for shopping with us
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8">
          
          {/* Order Number Highlight */}
          <div className="bg-gray-800 border border-green-600/30 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-400 text-sm mb-1">Order Number</p>
            <p className="text-2xl font-bold text-green-400 tracking-wide">
              #{order.orderNumber}
            </p>
          </div>

          {/* Order Information Grid */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Order Date</p>
                <p className="text-gray-200 font-medium text-sm">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(order.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Payment Method</p>
                <p className="text-gray-200 font-medium text-sm">
                  {order.paymentMethod === "Cod"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </p>
                <p className="text-green-400 text-xs mt-1">✓ Confirmed</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Order Status</p>
                <p className="text-gray-200 font-medium">
                  {order.status}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 shadow-lg shadow-green-900/50">
                <p className="text-green-100 text-xs mb-1">Total Amount</p>
                <p className="text-white font-bold text-2xl">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">Delivery Address</p>
                <p className="text-gray-200 leading-relaxed">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline/Progress */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm mb-3">Order Journey</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-700 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-700 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-green-400">Ordered</span>
              <span className="text-gray-500">Processing</span>
              <span className="text-gray-500">Shipped</span>
              <span className="text-gray-500">Delivered</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-900/50"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/collection")}
              className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-800 hover:border-green-600 hover:text-green-400 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              We've sent a confirmation email with your order details.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Need help? Contact our support team
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;