// ManageOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); // For View modal

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/orders/${id}`);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      alert("Failed to delete order.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${id}`, { status });
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Filtered and searched orders safely
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.userId?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (order.orderId?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "Completed").length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Orders</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Completed</p>
          <p className="text-2xl font-bold">{completedOrders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Pending</p>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-1/4"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Customer</th>
              <th className="py-3 px-6 text-left">Items</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{order.orderId}</td>
                <td className="py-3 px-6">{order.userId || "N/A"}</td>
                <td className="py-3 px-6">
                  {order.items?.map(i => `${i.name} ($${i.price} x ${i.quantity})`).join(", ") || "N/A"}
                </td>
                <td className="py-3 px-6">${order.total || 0}</td>
                <td className="py-3 px-6">
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-6">{order.date || "N/A"}</td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
            <p><strong>Customer:</strong> {selectedOrder.userId || "N/A"}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Date:</strong> {selectedOrder.date || "N/A"}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Payment:</strong> {selectedOrder.payment}</p>
            <p className="mt-2 font-semibold">Items:</p>
            <ul className="list-disc list-inside">
              {selectedOrder.items?.map((item, idx) => (
                <li key={idx}>
                  {item.name} - ${item.price} x {item.quantity}
                </li>
              )) || <li>No items</li>}
            </ul>
            <p className="mt-2 font-bold">Total: ${selectedOrder.total || 0}</p>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
