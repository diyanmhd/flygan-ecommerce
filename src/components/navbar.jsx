import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "./search";
import { UserContext } from "./UserContext";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
    const role = user?.role?.toLowerCase(); // ✅ FIX 1
  const { search, setSearch } = useContext(SearchContext);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setShow(false);
      if(role == "admin"){
        navigate("/login",{replace:true});
      }else{
        navigate("/",{replace:true});
      }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() !== "") {
      navigate(`/collection?search=${encodeURIComponent(e.target.value)}`);
    } else {
      navigate("/collection");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 select-none shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="text-xl font-serif font-semibold tracking-wide text-gray-900 cursor-pointer"
            onClick={() => navigate("/")}
          >
            FLYGANS
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/collection"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Collection
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearch}
                className="border border-gray-300 px-3 py-2 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 w-56"
              />
              <svg
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Right Side Links */}
          <div className="flex space-x-5 items-center relative">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>

            {/* User Dropdown */}
            <button
              onClick={() => setShow(!show)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {show && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-sm shadow-md w-48 text-sm py-1">
                {user ? (
                  <div className="flex flex-col">
                    <span className="px-4 py-2 text-gray-700 cursor-default border-b border-gray-100 text-xs uppercase tracking-wide font-medium">
                     {user.fullName}

                    </span>
                    <Link
                      to="/my-orders"
                      onClick={() => setShow(false)}
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      My Orders
                    </Link>

                    <button
                      onClick={logout}
                      className="text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors border-t border-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <Link
                      to="/login"
                      className="px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors border-t border-gray-100"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
