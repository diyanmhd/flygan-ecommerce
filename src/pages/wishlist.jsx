import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.log);
  }, []);

  const removeWishlist = (id) => {
    const updated = wishlist.filter(pid => pid !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const wishlistItems = products.filter(item => wishlist.includes(item.id));

  if (wishlistItems.length === 0) return <p className="text-center mt-20">Your wishlist is empty. <Link to="/collection" className="text-indigo-600 underline">Add some</Link></p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Your Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {wishlistItems.map(item => (
          <div key={item.id} className="relative border rounded-lg p-3 hover:shadow-lg transition bg-white">
            <button onClick={() => removeWishlist(item.id)} className="absolute top-3 right-3 text-red-500">❤️</button>
            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.name} className="w-full h-44 object-cover rounded-md mb-3"/>
              <h3 className="text-base md:text-lg font-medium text-[#414141] mb-1">{item.name}</h3>
              <p className="font-semibold text-sm md:text-base text-amber-700">₹{item.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
