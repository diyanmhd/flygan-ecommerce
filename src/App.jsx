// src/App.jsx
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Collection from "./pages/collection";
import ProductDetails from "./pages/productdetails";
import Wishlist from "./pages/wishlist";
import Cart from "./pages/cart";
import Order from "./pages/order";
import MyOrders from "./pages/MyOrders";
import OrderSuccess from "./pages/OrderSuccess"; // ✅ ADD
import Login from "./pages/login";
import Register from "./pages/register";
import { SearchProvider } from "./components/search";
import { UserContext } from "./components/UserContext";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrder";
import ManageUsers from "./admin/ManageUsers";

function App() {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const role = user?.role?.toLowerCase();

  // Hide navbar on admin/login/register pages
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  // 🔐 Protected route (USER only)
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
    return children;
  };

  // 🔐 Login/Register route
  const AuthRoute = ({ children }) => {
    if (!user) return children;
    return role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/" replace />;
  };

  // 🔐 Admin-only route
  const AdminRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  // 🌍 Public route (block admin)
  const PublicRoute = ({ children }) => {
    if (role === "admin") return <Navigate to="/admin" replace />;
    return children;
  };

  return (
    <SearchProvider>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/collection" element={<PublicRoute><Collection /></PublicRoute>} />
        <Route path="/product/:id" element={<PublicRoute><ProductDetails /></PublicRoute>} />

        {/* 🔑 Auth Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

        {/* 👤 User Routes */}
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />

        {/* ✅ NEW: Order Success Page */}
        <Route
          path="/order-success"
          element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}
        />

        {/* ✅ FIXED PATH */}
        <Route
          path="/my-orders"
          element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
        />

        {/* 🛠 Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SearchProvider>
  );
}

export default App;
