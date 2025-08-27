import React, { useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext"; // import UserContext

function reduce(prev, action) {
  switch (action.type) {
    case "get-name":
      return { ...prev, name: action.payLoad };
    case "get-email":
      return { ...prev, email: action.payLoad };
    case "get-password":
      return { ...prev, password: action.payLoad };
    default:
      return prev;
  }
}

function Register() {
  const nav = useNavigate();
  const { setUser } = useContext(UserContext); // get setUser from context
  const [state, dispatch] = useReducer(reduce, {});

  async function registerUser() {
    try {
      const response = await axios.post("http://localhost:3000/users", {
        name: state.name,
        email: state.email,
        password: state.password,
        role: "user",
        cart: [],
        wishlist: [],
        order: [],
      });

      alert("User registered successfully");

      //  Log in automatically by updating UserContext
      // setUser(response.data);

      nav("/login"); // go to home page
    } catch (error) {
      alert("Registration failed");
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-center text-xl font-bold mb-6">Create Account</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerUser();
          }}
        >
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border px-2 py-1 rounded"
              onChange={(e) =>
                dispatch({ type: "get-name", payLoad: e.target.value })
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
                dispatch({ type: "get-email", payLoad: e.target.value })
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
                dispatch({ type: "get-password", payLoad: e.target.value })
              }
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a
            href="#"
            className="text-indigo-500"
            onClick={() => nav("/login")}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
