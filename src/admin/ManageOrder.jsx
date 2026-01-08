// src/admin/ManageOrders.jsx
import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";

// ✅ BACKEND ENUM → UI LABEL MAP
const STATUS_LABELS = {
  PendingPayment: "Pending Payment",
  COD: "Cash on Delivery",
  Confirmed: "Confirmed",
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

const STATUS_COLORS = {
  PendingPayment: "bg-yellow-500/20 text-yellow-400",
  COD: "bg-purple-500/20 text-purple-400",
  Confirmed: "bg-blue-500/20 text-blue-400",
  Processing: "bg-indigo-500/20 text-indigo-400",
  Shipped: "bg-cyan-500/20 text-cyan-400",
  Delivered: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ FETCH + SORT (NEWEST FIRST)
  const fetchOrders = async () => {
    try {
      const res = await orderService.getAllOrders();
      const data = res.data.data || [];

      setOrders(
        [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ STATUS UPDATE (ENUM SAFE)
  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // ✅ DELETE ORDER
  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await orderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      alert("Failed to delete order");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-2">
            Manage Orders
          </h1>
          <p className="text-gray-400 text-sm">Track, update, and manage customer orders</p>
        </div>
        <div className="text-sm text-gray-400">
          Total Orders: <span className="text-green-400 font-bold text-lg">{orders.length}</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800">
                  <th className="p-4 text-left text-sm font-semibold text-gray-300">Order Details</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Items</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Total</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Status</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Date</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-gray-200 font-medium">#{order.orderNumber}</span>
                        <span className="text-xs text-gray-500 mt-1">ID: {order.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-gray-200">{order.userName}</span>
                        {order.userEmail && (
                          <span className="text-xs text-gray-500 mt-1">{order.userEmail}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-200 font-medium">{order.items.length}</span>
                        <span className="text-xs text-gray-500 mt-1">items</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-green-400 font-semibold text-lg">₹{order.totalAmount}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`w-full max-w-48 bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${STATUS_COLORS[order.status]} font-medium`}
                        >
                          {Object.keys(STATUS_LABELS).map((key) => (
                            <option key={key} value={key} className="bg-gray-800">
                              {STATUS_LABELS[key]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-gray-200 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="group/btn p-2 rounded-lg bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white border border-gray-700 hover:border-green-600 transition-all duration-300"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          className="group/btn p-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white border border-gray-700 hover:border-red-600 transition-all duration-300"
                          onClick={() => handleDelete(order.id)}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="relative group max-w-4xl w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-green-400">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">Customer Details</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300"><span className="text-gray-500">Name:</span> {selectedOrder.userName}</p>
                    {selectedOrder.userEmail && (
                      <p className="text-gray-300"><span className="text-gray-500">Email:</span> {selectedOrder.userEmail}</p>
                    )}
                    {selectedOrder.shippingAddress && (
                      <p className="text-gray-300"><span className="text-gray-500">Address:</span> {selectedOrder.shippingAddress}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[selectedOrder.status]}`}>
                        {STATUS_LABELS[selectedOrder.status]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-gray-300">{selectedOrder.paymentMethod || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-green-400 font-bold text-lg">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Order Items ({selectedOrder.items.length})</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="relative group/img">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-0 group-hover/img:opacity-50 transition duration-300"></div>
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="relative w-16 h-16 rounded-lg object-cover border border-gray-700"
                          />
                        </div>
                        <div>
                          <h4 className="text-gray-200 font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300">₹{item.unitPrice} each</p>
                        <p className="text-green-400 font-semibold">₹{item.unitPrice * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                <button
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium border border-gray-700 transition-all duration-300"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
                <div className="flex gap-3">
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-900/50"
                    onClick={() => {
                      // Add any additional action here if needed
                      setSelectedOrder(null);
                    }}
                  >
                    Update Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;