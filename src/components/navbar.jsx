import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SearchContext } from "./search";

function Navbar() {
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const { search, setSearch } = useContext(SearchContext);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(localStorage.getItem("userId")); // track userId

  // fetch user whenever userId changes
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3000/users/${userId}`)
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [userId]);

  const logout = () => {
    localStorage.removeItem("userId");
    setUserId(null); // trigger useEffect
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    navigate(`/collection?search=${e.target.value}`);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 select-none">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div className="prata-regular text-2xl tracking-wide text-[#414141] cursor-pointer" onClick={() => navigate("/")}>
            flygans
          </div>

          <div className="hidden sm:flex space-x-6 items-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-black transition">Home</Link>
            <Link to="/collection" className="text-sm text-gray-600 hover:text-black transition">Collection</Link>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              className="border px-2 py-1 rounded text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex space-x-4 items-center relative">
            <Link to="/wishlist" className="text-gray-500 hover:text-black text-lg transition">❤</Link>
            <Link to="/cart" className="text-gray-500 hover:text-black text-lg transition">🛒</Link>

            <button onClick={() => setShow(!show)} className="text-gray-500 hover:text-black text-xl transition">👤</button>

            {show && (
              <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-md w-40 text-sm">
                {user ? (
                  <div className="flex flex-col">
                    <span className="px-3 py-2 text-gray-700 cursor-default">Hi, {user.name}</span>
                    <button onClick={logout} className="text-left px-3 py-2 hover:bg-gray-100 text-red-500">Logout</button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <Link to="/login" className="px-3 py-2 hover:bg-gray-100 text-gray-700">Login</Link>
                    <Link to="/register" className="px-3 py-2 hover:bg-gray-100 text-gray-700">Register</Link>
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
