import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

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

  if (loading) return <div className="p-10">Loading dashboard...</div>;
  if (!data) return <div className="p-10">No data</div>;

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Users" value={stats.totalUsers} />
        <StatCard title="Products" value={stats.totalProducts} />
        <StatCard title="Orders" value={stats.totalOrders} />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Order Status */}
        <Card title="Order Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="value" innerRadius={60}>
                {orderStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue */}
        <Card title="Revenue (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueLast7Days}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area dataKey="revenue" fill="url(#rev)" stroke="#6366F1" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <ListCard title="Recent Users" items={recentUsers} render={(u) => (
          <span>{u.fullName} – {u.email}</span>
        )} />

        <ListCard title="Recent Products" items={recentProducts} render={(p) => (
          <span>{p.name} – ₹{p.price}</span>
        )} />

        <ListCard title="Recent Orders" items={recentOrders} render={(o) => (
          <span>{o.orderNumber} – ₹{o.totalAmount} ({o.status})</span>
        )} />
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ---------------- COMPONENTS ---------------- */

const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const ListCard = ({ title, items, render }) => (
  <Card title={title}>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm">{render(item)}</li>
      ))}
    </ul>
  </Card>
);
