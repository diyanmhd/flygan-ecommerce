// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/150?text=No+Image";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to load orders", err);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2 text-gray-200">No orders yet</h2>
          <p className="text-gray-400 mb-4">
            You haven't placed any orders.
          </p>
          <a
            href="/collection"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors duration-300 shadow-lg shadow-green-900/50"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-green-400">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl shadow-black/50 overflow-hidden hover:border-green-800 transition-all duration-300"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                <div>
                  <p className="text-sm text-gray-500">Order #</p>
                  <p className="font-medium text-green-400">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    Payment:{" "}
                    <span className="font-medium text-gray-200">
                      {order.paymentMethod === "Cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </span>
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-xs rounded bg-green-600/20 text-green-400 border border-green-600/30">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-800">
                {order.items?.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors duration-300"
                  >
                    <img
                      src={item.imageUrl || FALLBACK_IMAGE}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded border border-gray-700"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div className="flex-1">
                      <p className="font-medium text-gray-200">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-green-500">
                        ₹{item.unitPrice * item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{item.unitPrice} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 flex justify-between bg-gray-800/30">
                <p className="text-sm text-gray-400">
                  {order.items?.length} item
                  {order.items?.length !== 1 && "s"}
                </p>
                <p className="font-semibold text-green-500">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;