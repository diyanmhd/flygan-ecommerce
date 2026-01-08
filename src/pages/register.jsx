import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

// Reducer to manage form state
function reduce(prev, action) {
  switch (action.type) {
    case "name":
      return { ...prev, fullName: action.payload, error: "" };
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

function Register() {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reduce, {
    fullName: "",
    email: "",
    password: "",
    error: "",
  });

  async function handleRegister(e) {
    e.preventDefault();

    // Basic validation
    if (!state.fullName || !state.email || !state.password) {
      dispatch({
        type: "error",
        payload: "All fields are required",
      });
      return;
    }

    try {
      await authService.register({
        fullName: state.fullName,
        email: state.email,
        password: state.password,
      });

      alert("Registration successful. Please login.");

      navigate("/login");
    } catch (err) {
      dispatch({
        type: "error",
        payload:
          err.response?.data?.message ||
          "Registration failed. Try again.",
      });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-400 mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join us to start shopping</p>
        </div>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-sm mb-2 text-gray-300 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              onChange={(e) =>
                dispatch({
                  type: "name",
                  payload: e.target.value,
                })
              }
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm mb-2 text-gray-300 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              onChange={(e) =>
                dispatch({
                  type: "email",
                  payload: e.target.value,
                })
              }
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm mb-2 text-gray-300 font-medium">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              onChange={(e) =>
                dispatch({
                  type: "password",
                  payload: e.target.value,
                })
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
            Create Account
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

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            className="text-green-400 hover:text-green-300 font-medium cursor-pointer transition-colors duration-300"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;