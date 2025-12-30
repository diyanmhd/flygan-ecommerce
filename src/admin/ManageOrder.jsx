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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-6">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Items</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4 font-medium">
                  #{order.orderNumber}
                </td>

                <td className="p-4">
                  {order.userName}
                </td>

                <td className="p-4 text-sm text-gray-600">
                  {order.items
                    .map(
                      (i) => `${i.productName} × ${i.quantity}`
                    )
                    .join(", ")}
                </td>

                <td className="p-4 font-semibold">
                  ₹{order.totalAmount}
                </td>

                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    {Object.keys(STATUS_LABELS).map((key) => (
                      <option key={key} value={key}>
                        {STATUS_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-indigo-600 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ ORDER DETAILS MODAL (DESIGN SAME) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-4">
              Order #{selectedOrder.orderNumber}
            </h2>

            {selectedOrder.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded"
                  />
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                </div>
                <span>
                  ₹{item.unitPrice * item.quantity}
                </span>
              </div>
            ))}

            <div className="mt-4 text-right font-semibold">
              Total: ₹{selectedOrder.totalAmount}
            </div>

            <button
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
