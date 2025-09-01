import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/"); // redirect to login after logout
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        background: "#1a1a1a",
        color: "white",
      }}
    >
      {/* Company Name */}
      <h2 style={{ margin: 0 }}>Flygan Admin</h2>

      {/* Right Side - Admin Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>
          {user ? `Welcome, ${user.name}` : "Admin"}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "#e74c3c",
            border: "none",
            padding: "8px 15px",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;
