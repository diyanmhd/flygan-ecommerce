import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../components/search";

function Collection() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [category, setCategory] = useState("all");
  const { search } = useContext(SearchContext); // 🔹 read global search

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const toggleWishlist = (id) => {
    const newWishlist = wishlist.includes(id)
      ? wishlist.filter((pid) => pid !== id)
      : [...wishlist, id];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  // filter by category first
  let filteredProducts =
    category === "all"
      ? products
      : products.filter((item) => item.category === category);

  // then filter by search from context
  if (search) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="p-6 select-none">
      <h1 className="prata-regular text-2xl md:text-3xl tracking-wide text-[#414141] mb-6">
        Our Premium Collection
      </h1>

      {/* Category buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "shirt", "pant", "tshirt", "other"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              category === cat
                ? "bg-black text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-black hover:text-white"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              className="relative border rounded-lg p-3 hover:shadow-lg transition cursor-pointer bg-white"
            >
              <button
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-3 right-3 text-lg"
              >
                {wishlist.includes(item.id) ? "❤️" : "🤍"}
              </button>

              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-44 object-cover rounded-md mb-3"
                />
                <h2 className="prata-regular text-base md:text-lg tracking-wide text-[#414141] mb-1">
                  {item.name}
                </h2>
                <p className="font-semibold text-sm md:text-base text-amber-700 mb-1">
                  ₹{item.price}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Collection;
