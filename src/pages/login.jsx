import React, { useEffect, useReducer, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext"; // import UserContext

function reduce(prev, action) {
  switch (action.type) {
    case "email":
      return { ...prev, error: "", email: action.payLoad };
    case "password":
      return { ...prev, error: "", password: action.payLoad };
    case "error":
      return { ...prev, error: action.payLoad };
    default:
      return prev;
  }
}

function Login() {
  const nav = useNavigate();
  const [cred, setCred] = useState([]);
  const { setUser } = useContext(UserContext); // get setUser from context

  useEffect(() => {
    async function Getcred() {
      const resp = await axios.get("http://localhost:3000/users");
      setCred(resp.data);
    }
    Getcred();
  }, []);

  const [state, dispatch] = useReducer(reduce, {
    email: "",
    password: "",
    error: "",
  });

  function validate(e) {
    e.preventDefault();

    if (!state.email || !state.password) {
      dispatch({ type: "error", payLoad: "Email and password required" });
      return;
    }

    const user = cred.find(
      (u) => u.email === state.email && u.password === state.password
    );

    if (!user) {
      dispatch({ type: "error", payLoad: "Invalid email or password" });
    } else {
      //  Update UserContext immediately
      setUser(user); 
      nav("/"); // go to home page
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
                dispatch({ type: "email", payLoad: e.target.value })
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
                dispatch({ type: "password", payLoad: e.target.value })
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
