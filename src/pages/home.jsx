import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const slides = [
    {
      id: 1,
      image:
        "https://cdn.mos.cms.futurecdn.net/whowhatwear/posts/305052/new-zara-arrivals-305052-1686254778434-main.jpg",
      title: "Summer Collection 2023",
    },
    {
      id: 2,
      image:
        "https://i.pinimg.com/736x/bc/bc/ed/bcbced2f45fd1e9ccd57e82bca836cd8.jpg",
      title: "Casual & Comfortable",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  // slider auto change
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // fetch first 4 products
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((err) => console.log("Error:", err));
  }, []);

  // toggle wishlist
  const toggleWishlist = (id) => {
    let newWishlist = wishlist.includes(id)
      ? wishlist.filter((pid) => pid !== id)
      : [...wishlist, id];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  return (
    <div className="min-h-screen bg-gray-50 select-none">
      {/* Image Slider */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
              <h2 className="prata-regular text-2xl md:text-3xl font-semibold text-white tracking-wide">
                {slide.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <div className="p-6">
        <h2 className="prata-regular text-2xl md:text-3xl tracking-wide text-[#414141] mb-6 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {products.map((item) => (
            <div
              key={item.id}
              className="relative border rounded-lg p-3 hover:shadow-lg transition cursor-pointer bg-white"
            >
              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-3 right-3 text-lg"
              >
                {wishlist.includes(item.id) ? "❤️" : "🤍"}
              </button>

              {/* Product */}
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-44 object-cover rounded-md mb-3"
                />
                <h3 className="prata-regular text-base md:text-lg tracking-wide text-[#414141] mb-1">
                  {item.name}
                </h3>
                <p className="font-semibold text-sm md:text-base text-amber-700 mb-1">
                  ₹{item.price}
                </p>
                {item.description && (
                  <p className="text-xs text-gray-500">
                    {item.description.slice(0, 40)}...
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* Link to Collection */}
        <div className="text-center mt-8">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 group justify-center px-6 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-900 transition-all duration-300"
          >
            <span className="font-medium text-sm md:text-base tracking-wider group-hover:underline">
              View Full Collection
            </span>
            <span className="w-6 md:w-8 h-[2px] bg-white transition-all duration-300 group-hover:w-12"></span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 px-4 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm prata-regular tracking-wide text-white">
            Quality Shirts, Premium Look
          </p>
          <p className="text-xs mt-1 tracking-wider">
            Email: <span className="text-white">contact@shirtstore.com</span> | Phone: (123) 456-7890
          </p>
          <p className="mt-4 text-gray-500 text-xs tracking-wide">
            © 2023 Shirt Store. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
