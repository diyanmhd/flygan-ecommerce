import React from "react";
import { Link, Outlet } from "react-router-dom";
import AdminNavbar from "./adminnavbar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar at top */}
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-5">
          <nav>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/admin" 
                  className="block py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white no-underline"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/products" 
                  className="block py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white no-underline"
                >
                   Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/orders" 
                  className="block py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white no-underline"
                >
                   Orders
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/users" 
                  className="block py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white no-underline"
                >
                   Users
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;