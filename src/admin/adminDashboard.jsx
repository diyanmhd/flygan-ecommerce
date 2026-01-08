import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const COLORS = ["#10B981", "#22C55E", "#34D399", "#F59E0B", "#EF4444", "#6B7280"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await dashboardService.getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return (
    <div className="p-10 bg-gray-950 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (!data) return (
    <div className="p-10 bg-gray-950 min-h-screen flex items-center justify-center">
      <p className="text-gray-400">No data available</p>
    </div>
  );

  const { stats, revenueLast7Days, recentUsers, recentProducts, recentOrders } = data;

  const orderStatusData = [
    { name: "Pending", value: stats.pendingOrders },
    { name: "Confirmed", value: stats.confirmedOrders },
    { name: "Processing", value: stats.processingOrders },
    { name: "Shipped", value: stats.shippedOrders },
    { name: "Delivered", value: stats.deliveredOrders },
    { name: "Cancelled", value: stats.cancelledOrders },
  ];

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      {/* Header with gradient */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* STATS with gradient cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          gradient="from-blue-500 to-cyan-600"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue}`}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          gradient="from-yellow-500 to-orange-600"
        />
      </div>

      {/* CHARTS with premium styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status */}
        <Card title="Order Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="value" innerRadius={70} outerRadius={110}>
                {orderStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {orderStatusData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-xs text-gray-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue */}
        <Card title="Revenue Trend (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueLast7Days}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Area dataKey="revenue" fill="url(#rev)" stroke="#10B981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* RECENT ACTIVITY with icons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ListCard 
          title="Recent Users" 
          items={recentUsers} 
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          render={(u) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                {u.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate">{u.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
            </div>
          )} 
        />

        <ListCard 
          title="Recent Products" 
          items={recentProducts}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          render={(p) => (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200 truncate flex-1">{p.name}</span>
              <span className="text-sm font-semibold text-green-400 ml-2">₹{p.price}</span>
            </div>
          )} 
        />

        <ListCard 
          title="Recent Orders" 
          items={recentOrders}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          render={(o) => (
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">#{o.orderNumber}</p>
                <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                  o.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                  o.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {o.status}
                </span>
              </div>
              <span className="text-sm font-semibold text-green-400 ml-2">₹{o.totalAmount}</span>
            </div>
          )} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ---------------- PREMIUM COMPONENTS ---------------- */

const Card = ({ title, children }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
    <div className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 p-6 hover:border-green-800/50 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-1 w-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
        <h3 className="font-semibold text-lg text-gray-200">{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

const StatCard = ({ title, value, icon, gradient }) => (
  <div className="relative group">
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500`}></div>
    <div className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 p-6 hover:border-green-800/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-200">{value}</p>
    </div>
  </div>
);

const ListCard = ({ title, items, render, icon }) => (
  <Card title={title}>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="p-3 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-green-800/50 hover:bg-gray-800 transition-all duration-300">
          {render(item)}
        </div>
      ))}
    </div>
  </Card>
);