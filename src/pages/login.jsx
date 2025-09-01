// src/pages/Login.jsx
import React, { useEffect, useReducer, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";

// Reducer to handle form state
function reduce(prev, action) {
  switch (action.type) {
    case "email":
      return { ...prev, error: "", email: action.payload };
    case "password":
      return { ...prev, error: "", password: action.payload };
    case "error":
      return { ...prev, error: action.payload };
    default:
      return prev;
  }
}

function Login() {
  const [cred, setCred] = useState([]);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch all users on mount
  useEffect(() => {
    async function Getcred() {
      try {
        const resp = await axios.get("http://localhost:3000/users");
        setCred(resp.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    }
    Getcred();
  }, []);

  const [state, dispatch] = useReducer(reduce, {
    email: "",
    password: "",
    error: "",
  });

  // Handle form submission
  function validate(e) {
    e.preventDefault();

    if (!state.email || !state.password) {
      dispatch({ type: "error", payload: "Email and password required" });
      return;
    }

    const user = cred.find(
      (u) => u.email === state.email && u.password === state.password
    );

    if (!user) {
      dispatch({ type: "error", payload: "Invalid email or password" });
    } else if (user.status === "Blocked") {
      // Prevent login for blocked users
      dispatch({ type: "error", payload: "Your account is blocked. Contact admin." });
    } else {
      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", String(user.id));

      // Update context
      setUser(user);

      // Redirect to home
      navigate("/");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-center text-xl font-bold mb-6">Login</h2>

        <form onSubmit={validate}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border px-2 py-1 rounded"
              onChange={(e) =>
                dispatch({ type: "email", payload: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border px-2 py-1 rounded"
              onChange={(e) =>
                dispatch({ type: "password", payload: e.target.value })
              }
            />
          </div>

          {state.error && (
            <p className="text-red-500 text-sm mb-2">{state.error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Not a member?{" "}
          <Link to="/register" className="text-indigo-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
