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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-center text-xl font-bold mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border px-2 py-1 rounded"
              onChange={(e) =>
                dispatch({
                  type: "name",
                  payload: e.target.value,
                })
              }
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border px-2 py-1 rounded"
              onChange={(e) =>
                dispatch({
                  type: "email",
                  payload: e.target.value,
                })
              }
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border px-2 py-1 rounded"
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
            <p className="text-red-500 text-sm mb-2">
              {state.error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-indigo-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
