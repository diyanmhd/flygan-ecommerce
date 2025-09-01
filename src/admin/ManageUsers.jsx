import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/orders"),
        ]);

        setUsers(usersRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Block/Unblock user
  const handleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    try {
      await axios.patch(`http://localhost:3000/users/${id}`, { status: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedUser(expandedUser === id ? null : id);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>

      <div className="space-y-4">
        {users.map((user) => {
          const userOrders = orders.filter((order) => order.userId === user.id);

          // Calculate total spend
          const totalSpend = userOrders.reduce((sum, order) => {
            const orderTotal = order.items?.reduce(
              (itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1),
              0
            );
            return sum + (orderTotal || 0);
          }, 0);

          const recentOrders = userOrders.slice(-5).reverse();

          return (
            <div
              key={user.id}
              className={`bg-white rounded-lg shadow p-4 border border-gray-200 ${
                user.status === "Blocked" ? "opacity-60" : ""
              }`}
            >
              {/* User Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(user.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name || "Unknown"}</p>
                    <p className="text-sm text-gray-500">{user.email || "-"}</p>
                    <p className="text-sm text-gray-500">Role: {user.role || "User"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold">
                    Total Spend: ${totalSpend.toFixed(2)}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlock(user.id, user.status);
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      user.status === "Active"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } transition-colors`}
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                    }}
                    className="px-3 py-1 rounded text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded Section */}
              {expandedUser === user.id && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-semibold mb-1">Activity Summary</h3>
                    <p>Orders Placed: {userOrders.length}</p>
                    <p>Status: {user.status}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-semibold mb-1">Recent Orders</h3>
                    {recentOrders.length > 0 ? (
                      <ul className="space-y-1">
                        {recentOrders.map((order) => {
                          const orderTotal = order.items?.reduce(
                            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                            0
                          );
                          return (
                            <li key={order.id} className="border-b border-gray-200 pb-1">
                              <p>Order ID: {order.id}</p>
                              <p>Total: ${orderTotal.toFixed(2)}</p>
                              <p>
                                Items: {order.items?.map((item) => item.name).join(", ")}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p>No recent orders</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ManageUsers;
