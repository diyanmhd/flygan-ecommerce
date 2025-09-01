// src/pages/MyOrders.jsx
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../components/UserContext";

function MyOrders() {
  const { user } = useContext(UserContext); // get logged-in user
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3000/orders?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data || []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders with us yet.</p>
          <a
            href="/collection"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600 text-sm">View your order history and track shipments</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Order #</span>
                    <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Placed on {order.date}</div>
                </div>

                <div className="flex items-center justify-between sm:justify-end">
                  <div className="mr-4">
                    <span className="text-xs text-gray-500">Payment: </span>
                    <span className="text-xs font-medium text-gray-900">
                      {order.payment === "cod"
                        ? "Cash on Delivery"
                        : order.payment === "card"
                        ? "Credit/Debit Card"
                        : "UPI"}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-sm ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${item.price * item.quantity}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">${item.price} each</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-baseline">
                  <span className="text-sm font-medium text-gray-600 mr-2">Total:</span>
                  <span className="text-lg font-medium text-gray-900">${order.total || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
