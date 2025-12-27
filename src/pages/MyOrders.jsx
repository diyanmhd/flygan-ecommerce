// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data.data || []);
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
      <div className="min-h-screen flex items-center justify-center">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-4">
            You haven’t placed any orders.
          </p>
          <a
            href="/collection"
            className="bg-amber-700 text-white px-6 py-3 rounded"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow border"
            >
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order #</p>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm">
                    Payment:{" "}
                    <span className="font-medium">
                      {order.paymentMethod === "Cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </span>
                  </p>
                  <span className="inline-block mt-1 px-3 py-1 text-xs rounded bg-amber-100 text-amber-800">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 flex items-center gap-4"
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

                    <div className="text-right">
                      <p className="font-medium">
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
              <div className="p-4 border-t flex justify-between">
                <p className="text-sm text-gray-600">
                  {order.items.length} item
                  {order.items.length !== 1 && "s"}
                </p>
                <p className="font-semibold">
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
