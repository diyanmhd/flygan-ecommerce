import React, { useReducer, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import authService from "../services/authService";

// Reducer to handle form state
function reduce(prev, action) {
  switch (action.type) {
    case "email":
      return { ...prev, email: action.payload, error: "" };
    case "password":
      return { ...prev, password: action.payload, error: "" };
    case "error":
      return { ...prev, error: action.payload };
    default:
      return prev;
  }
}

function Login() {
  const [state, dispatch] = useReducer(reduce, {
    email: "",
    password: "",
    error: "",
  });

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!state.email || !state.password) {
      dispatch({
        type: "error",
        payload: "Email and password are required",
      });
      return;
    }

    try {
      //  Call backend login
      const response = await authService.login({
        email: state.email,
        password: state.password,
      });

      //  Backend response
      const data = response.data;

      //  DEBUG (keep for now)
      console.log("LOGIN RESPONSE:", data);

      const token = data.accessToken;

      //  NORMALIZE ROLE (THIS FIXES EVERYTHING)
      const role = data.role?.trim().toLowerCase();

      const user = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: role,
      };

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update context
      setUser(user);

      // 🔁 ROLE BASED REDIRECT (FIXED)
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      dispatch({
        type: "error",
        payload:
          err.response?.data?.message || "Invalid email or password",
      });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-400 mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm mb-2 text-gray-300 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              onChange={(e) =>
                dispatch({ type: "email", payload: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm mb-2 text-gray-300 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              onChange={(e) =>
                dispatch({ type: "password", payload: e.target.value })
              }
            />
          </div>

          {/* Error */}
          {state.error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-900/50"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-500">or</span>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400 hover:text-green-300 font-medium transition-colors duration-300">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;