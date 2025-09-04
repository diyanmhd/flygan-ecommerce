// src/App.jsx
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Collection from "./pages/collection";
import ProductDetails from "./pages/prdouctdetails"; // 
import Wishlist from "./pages/wishlist";
import Cart from "./pages/cart";
import Order from "./pages/order";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/login";
import Register from "./pages/register";
import { SearchProvider } from "./components/search";
import { UserProvider, UserContext } from "./components/UserContext";

// Admin Components
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import ManageUsers from "./admin/ManageUsers";

function App() {
  const location = useLocation();

  // Hide navbar on login/register/admin pages
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Protected routes for normal users
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return children;
  };

  // Auth route for login/register pages
  const AuthRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    if (user) {
      return user.role === "admin"
        ? <Navigate to="/admin" replace />
        : <Navigate to="/" replace />;
    }
    return children;
  };

  // Admin protected route
  const AdminRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  // Public route (block for admins)
  const PublicRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    return children;
  };

  return (
    <UserProvider>
      <SearchProvider>
        {!hideNavbar && <Navbar />}
        <Routes>
          {/* Public Routes (Admins blocked) */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/collection" element={<PublicRoute><Collection /></PublicRoute>} />
          <Route path="/product/:id" element={<PublicRoute><ProductDetails /></PublicRoute>} />

          {/* Auth Routes (Admins blocked) */}
          <Route path="/login" element={<PublicRoute><AuthRoute><Login /></AuthRoute></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><AuthRoute><Register /></AuthRoute></PublicRoute>} />

          {/* User Protected Routes (Admins blocked) */}
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
          <Route path="/myorders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* Catch all - redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SearchProvider>
    </UserProvider>
  );
}

export default App;
