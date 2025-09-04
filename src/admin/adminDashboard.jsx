// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, AreaChart, Area 
} from 'recharts';

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

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-50",
      textColor: "text-blue-700",
      trend: stats.trends.users,
    },
    {
      title: "Total Products",
      count: stats.products,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
        </svg>
      ),
      color: "from-green-500 to-green-600",
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      textColor: "text-green-700",
      trend: stats.trends.products,
    },
    {
      title: "Total Orders",
      count: stats.orders,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-50",
      textColor: "text-purple-700",
      trend: stats.trends.orders,
    },
    {
      title: "Total Revenue",
      count: `$${stats.revenue.toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-gradient-to-br from-amber-100 to-amber-50",
      textColor: "text-amber-700",
      trend: stats.trends.revenue,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-800">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cardData.map((card) => (
              <div key={card.title} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur transition-all duration-300 group-hover:opacity-100 group-hover:inset-0.5"></div>
                <div className={`relative ${card.bgColor} overflow-hidden shadow-sm rounded-2xl p-5 transform transition-all duration-300 group-hover:-translate-y-1 border border-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <p className={`text-2xl font-bold mt-1 ${card.textColor}`}>{card.count}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-xs font-medium ${card.trend >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                          {card.trend >= 0 ? (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          )}
                          {Math.abs(card.trend)}%
                        </span>
                        <span className="text-xs text-gray-500 ml-2">from last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-br ${card.color} text-white shadow-md`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Order Status Pie Chart */}
            <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-white backdrop-blur-sm bg-opacity-90">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Order Status Distribution</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#FFF" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '12px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-white backdrop-blur-sm bg-opacity-90">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Revenue (Last 7 Days)</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '12px'
                      }} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Users */}
            <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-white backdrop-blur-sm bg-opacity-90">
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Users</h3>
                <ul className="divide-y divide-gray-100">
                  {recentUsers.map((user) => (
                    <li key={user.id} className="py-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-white backdrop-blur-sm bg-opacity-90">
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Products</h3>
                <ul className="divide-y divide-gray-100">
                  {recentProducts.map((product) => (
                    <li key={product.id} className="py-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-medium">
                        {product.name ? product.name.charAt(0) : 'P'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate">Category: {product.category}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        ${product.price || '0.00'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-white backdrop-blur-sm bg-opacity-90">
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h3>
                <ul className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <li key={order.id} className="py-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-medium">
                        {order.userName ? order.userName.charAt(0) : 'O'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Order #{order.id}</p>
                        <p className="text-sm text-gray-500 truncate">Customer: {order.userName}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${order.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
  