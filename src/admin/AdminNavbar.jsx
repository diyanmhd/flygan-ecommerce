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
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* Company Name */}
      <h2 className="text-xl font-bold">Flygan </h2>

      {/* Right Side - Admin Info */}
      <div className="flex items-center gap-4">
        <span className="text-gray-200">
          Welcome, {user.name}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;
