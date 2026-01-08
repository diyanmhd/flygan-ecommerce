import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-b-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative bg-gray-900 border-b border-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-2xl shadow-black/50">
        {/* Left Side - Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-50"></div>
            <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-2">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Flygan
            </h2>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>

        {/* Right Side - Admin Info */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>
            <div>
              <span className="text-gray-300 font-medium block">{user?.name || "Admin"}</span>
            </div>
          </div>
          
          <div className="relative group/btn">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-lg blur opacity-0 group-hover/btn:opacity-30 transition duration-300"></div>
            <button
              onClick={handleLogout}
              className="relative flex items-center gap-2 bg-red-600/90 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-900/50 border border-red-700/50 hover:border-red-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;