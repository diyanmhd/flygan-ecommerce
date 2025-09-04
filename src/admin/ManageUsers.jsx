import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

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
     
    // If currentStatus is undefined or null, default to "Active"
    const actualStatus = currentStatus || "Active";
    const newStatus = actualStatus === "Active" ? "Blocked" : "Active";
    
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

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || (user.status || "Active") === statusFilter;
    
    const matchesRole = 
      roleFilter === "All" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => (user.status || "Active") === "Active").length;
  const blockedUsers = users.filter(user => user.status === "Blocked").length;
  const adminUsers = users.filter(user => user.role === "Admin").length;

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );

  if (error) return <div className="text-red-600 p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-white backdrop-blur-sm bg-opacity-90">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-2">Manage your user accounts</p>
          </div>
          <div className="relative mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-xl p-3">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-xl p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-xl p-3">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked Users</p>
              <p className="text-2xl font-bold text-gray-900">{blockedUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-xl p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-white backdrop-blur-sm bg-opacity-90">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          
          {/* <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
            <select
              id="role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
              <option value="All">All Roles</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-white backdrop-blur-sm bg-opacity-90">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-lg font-medium text-gray-800">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spend
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const userOrders = orders.filter((order) => order.userId === user.id);
                  const totalSpend = userOrders.reduce((sum, order) => {
                    const orderTotal = (order.items || []).reduce(
                      (itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1),
                      0
                    );
                    return sum + (orderTotal || 0);
                  }, 0);

                  return (
                    <React.Fragment key={user.id}>
                      <tr 
                        className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer" 
                        onClick={() => toggleExpand(user.id)}
                        role="button"
                        aria-expanded={expandedUser === user.id}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-semibold shadow-sm">
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{user.email || "-"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {user.role || "User"}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              (user.status || "Active") === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {user.status || "Active"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                          {userOrders.length}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${totalSpend.toFixed(2)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBlock(user.id, user.status);
                            }}
                            className={`mr-4 px-3 py-1.5 rounded-lg text-sm font-medium ${
                              (user.status || "Active") === "Active"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            } transition-colors duration-200`}
                          >
                            {(user.status || "Active") === "Active" ? "Block" : "Unblock"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user.id);
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedUser === user.id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-indigo-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3">Activity Summary</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-500 text-xs">Orders Placed</p>
                                    <p className="font-medium">{userOrders.length}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Total Value</p>
                                    <p className="font-medium">${totalSpend.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Status</p>
                                    <p className="font-medium">{user.status || "Active"}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Member Since</p>
                                    <p className="font-medium">{user.joinDate || "N/A"}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3">Recent Orders</h3>
                                {userOrders.slice(-5).reverse().length > 0 ? (
                                  <ul className="space-y-3">
                                    {userOrders.slice(-5).reverse().map((order) => {
                                      const orderTotal = (order.items || []).reduce(
                                        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                                        0
                                      );
                                      return (
                                        <li key={order.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                          <div className="flex justify-between">
                                            <p className="font-medium text-xs">Order #{order.id}</p>
                                            <p className="font-semibold text-xs">${orderTotal.toFixed(2)}</p>
                                          </div>
                                          <p className="text-gray-500 text-xs truncate">
                                            {(order.items || []).map((item) => item.name).join(", ") || "No items"}
                                          </p>
                                          <p className="text-gray-500 text-xs">{order.date || "No date"}</p>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 text-sm">No recent orders</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setRoleFilter("All");
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;