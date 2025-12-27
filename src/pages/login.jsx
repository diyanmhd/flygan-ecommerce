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
      // 🔐 Call backend login
      const response = await authService.login({
        email: state.email,
        password: state.password,
      });

      // 🔥 Backend response
      const data = response.data;

      // 🔍 DEBUG (keep for now)
      console.log("LOGIN RESPONSE:", data);

      const token = data.accessToken;

      // 🔥 NORMALIZE ROLE (THIS FIXES EVERYTHING)
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-center text-xl font-bold mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
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

          {/* Password */}
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

          {/* Error */}
          {state.error && (
            <p className="text-red-500 text-sm mb-2">{state.error}</p>
          )}

          {/* Submit */}
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
