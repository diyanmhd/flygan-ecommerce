// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    trends: {
      users: 5,
      products: -2,
      orders: 8,
      revenue: 12,
    },
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/products"),
          axios.get("http://localhost:3000/orders"),
        ]);

        const orders = ordersRes.data;

        // ----- Map userId to userName -----
        const usersMap = {};
        usersRes.data.forEach(user => {
          usersMap[user.id] = user.name;
        });
        const ordersWithUserName = orders.map(order => ({
          ...order,
          userName: usersMap[order.userId] || 'Unknown User'
        }));

        // ----- Order Status Distribution -----
        const statusCount = {
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0
        };

        orders.forEach(order => {
          const status = order.status ? order.status.toLowerCase() : "pending";
          if (statusCount.hasOwnProperty(status)) {
            statusCount[status] += 1;
          }
        });

        const totalOrders = orders.length;
        const orderStatusChartData = [
          { name: 'Pending', value: Math.round((statusCount.pending / totalOrders) * 100) },
          { name: 'Processing', value: Math.round((statusCount.processing / totalOrders) * 100) },
          { name: 'Completed', value: Math.round((statusCount.completed / totalOrders) * 100) },
          { name: 'Cancelled', value: Math.round((statusCount.cancelled / totalOrders) * 100) },
        ];

        setOrderStatusData(orderStatusChartData);

        // ----- Revenue Calculation -----
        const today = new Date();
        const revenueByDay = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

          const revenue = orders
            .filter(order => order.date && new Date(order.date).toISOString().split('T')[0] === dateString)
            .reduce((sum, order) => {
              const orderTotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
              return sum + orderTotal;
            }, 0);

          revenueByDay.push({
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue
          });
        }

        setRevenueData(revenueByDay);

        // Total revenue across all orders
        const totalRevenue = orders.reduce((sum, order) => {
          const orderTotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
          return sum + orderTotal;
        }, 0);

        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: orders.length,
          revenue: totalRevenue,
          trends: {
            users: 5,
            products: -2,
            orders: 8,
            revenue: 12,
          },
        });

        // Recent items (last 5)
        setRecentUsers(usersRes.data.slice(-5).reverse());
        setRecentProducts(productsRes.data.slice(-5).reverse());
        setRecentOrders(ordersWithUserName.slice(-5).reverse());

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardData = [
    {
      title: "Total Users",
      count: stats.users,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      trend: stats.trends.users,
    },
    {
      title: "Total Products",
      count: stats.products,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
        </svg>
      ),
      color: "from-green-500 to-green-600",
      trend: stats.trends.products,
    },
    {
      title: "Total Orders",
      count: stats.orders,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      trend: stats.trends.orders,
    },
    {
      title: "Total Revenue",
      count: `$${stats.revenue.toLocaleString()}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: "from-yellow-500 to-yellow-600",
      trend: stats.trends.revenue,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">


      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cardData.map((card) => (
              <div key={card.title} className={`bg-gradient-to-r ${card.color} overflow-hidden shadow rounded-lg text-white`}>
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{card.icon}</div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium truncate">{card.title}</dt>
                        <dd><div className="text-lg font-bold">{card.count}</div></dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-black bg-opacity-10 px-5 py-3">
                  <div className="text-sm">
                    <span className={`font-medium ${card.trend >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                      {card.trend >= 0 ? '▲' : '▼'} {Math.abs(card.trend)}% from last month
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Order Status Pie Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Status Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Revenue (Last 7 Days)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 px-4 sm:px-0">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Recent Users */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Users</h3>
                <div className="mt-4 flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentUsers.map((user, index) => (
                      <li key={index} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                            <p className="truncate text-sm text-gray-500">{user.email || 'No email provided'}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Products</h3>
                <div className="mt-4 flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentProducts.map((product, index) => (
                      <li key={index} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{product.name || 'Unnamed Product'}</p>
                            <p className="truncate text-sm text-gray-500">{product.category || 'No category'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">${product.price || '0.00'}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
                <div className="mt-4 flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentOrders.map((order, index) => (
                      <li key={index} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                              #{order.id || '0'}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {order.userName}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
