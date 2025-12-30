import React, { useEffect, useState } from "react";
import userService from "../services/userService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      if (user.isBlocked) {
        await userService.unblockUser(user.id);
      } else {
        await userService.blockUser(user.id);
      }
      loadUsers();
    } catch {
      alert("Failed to update user status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Failed to delete user.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedUser(expandedUser === id ? null : id);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && !user.isBlocked) ||
      (statusFilter === "Blocked" && user.isBlocked);

    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBlocked).length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const adminUsers = users.filter((u) => u.role === "Admin").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  if (error) return <div className="text-red-600 p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          User Management
        </h1>
        <input
          type="text"
          placeholder="Search users..."
          className="mt-4 w-full px-4 py-3 border rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Stat title="Total Users" value={totalUsers} />
        <Stat title="Active Users" value={activeUsers} />
        <Stat title="Blocked Users" value={blockedUsers} />
        <Stat title="Admin Users" value={adminUsers} />
      </div>

      {/* Filter */}
      <select
        className="mb-6 px-4 py-3 rounded-xl border"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Blocked">Blocked</option>
      </select>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-indigo-50 cursor-pointer"
                onClick={() => toggleExpand(user.id)}
              >
                <td className="p-4">
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  {user.isBlocked ? "Blocked" : "Active"}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlockToggle(user);
                    }}
                    className="px-3 py-1 mr-2 rounded bg-indigo-100"
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                    }}
                    className="px-3 py-1 rounded bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Small reusable stat card */
function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default ManageUsers;
