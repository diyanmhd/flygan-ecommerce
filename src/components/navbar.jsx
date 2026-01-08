import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "./search";
import { UserContext } from "./UserContext";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const role = user?.role?.toLowerCase();
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
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-green-500/20 sticky top-0 z-50 select-none shadow-2xl shadow-green-900/20 backdrop-blur-xl">
      {/* Animated glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20 items-center">
          {/* Logo with glow effect */}
          <div
            className="relative group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative text-2xl font-serif font-bold tracking-widest">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                FLYGANS
              </span>
            </div>
          </div>

          {/* Navigation Links with hover effects */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="relative group text-sm text-gray-300 hover:text-green-400 transition-all duration-300 font-medium py-2"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/collection"
              className="relative group text-sm text-gray-300 hover:text-green-400 transition-all duration-300 font-medium py-2"
            >
              <span className="relative z-10">Collection</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* Premium Search Bar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={handleSearch}
                  className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-200 placeholder-gray-500 pl-4 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-gray-800 w-64 transition-all duration-300"
                />
                <svg
                  className="absolute right-3 top-3 h-4 w-4 text-gray-500 group-hover:text-green-400 transition-colors duration-300"
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
          </div>

          {/* Right Side Icons with glow effects */}
          <div className="flex space-x-6 items-center relative">
            {/* Wishlist with badge */}
            <Link
              to="/wishlist"
              className="relative group"
            >
              <div className="absolute -inset-2 bg-green-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
              <svg
                className="relative h-6 w-6 text-gray-400 group-hover:text-green-400 group-hover:scale-110 transition-all duration-300"
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

            {/* Cart with badge */}
            <Link
              to="/cart"
              className="relative group"
            >
              <div className="absolute -inset-2 bg-green-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
              <svg
                className="relative h-6 w-6 text-gray-400 group-hover:text-green-400 group-hover:scale-110 transition-all duration-300"
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

            {/* User Dropdown with avatar circle */}
            <button
              onClick={() => setShow(!show)}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-green-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center border-2 border-gray-700 group-hover:border-green-400 transition-all duration-300 group-hover:scale-110">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </button>

            {/* Premium Dropdown Menu */}
            {show && (
              <div className="absolute right-0 top-full mt-3 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  {/* Gradient top border */}
                  <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"></div>
                  
                  {user ? (
                    <div className="flex flex-col py-2">
                      <div className="px-4 py-3 border-b border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                            {user.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-green-400 font-semibold text-sm">{user.fullName}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to="/my-orders"
                        onClick={() => setShow(false)}
                        className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 text-gray-300 hover:text-green-400 transition-all duration-300"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>My Orders</span>
                      </Link>

                      <button
                        onClick={logout}
                        className="group flex items-center gap-3 text-left px-4 py-3 hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all duration-300 border-t border-gray-700/50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col py-2">
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 text-gray-300 hover:text-green-400 transition-all duration-300"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 text-gray-300 hover:text-green-400 transition-all duration-300 border-t border-gray-700/50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Create Account</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;