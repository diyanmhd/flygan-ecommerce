import React from "react";
import { Link, Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div>
      {/* 🔹 Admin Navbar at top */}
      <AdminNavbar />

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "220px",
            background: "#222",
            color: "white",
            minHeight: "100vh",
            padding: "20px",
          }}
        >
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/products" style={{ color: "white", textDecoration: "none" }}>
                  Manage Products
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" style={{ color: "white", textDecoration: "none" }}>
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/users" style={{ color: "white", textDecoration: "none" }}>
                  Manage Users
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
