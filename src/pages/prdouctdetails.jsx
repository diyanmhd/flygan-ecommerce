import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log("Error:", err));
  }, [id]);

  const addToCart = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart_" + userId)) || [];

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart_" + userId, JSON.stringify(cart));
    alert("Added to cart!");
  };

  if (!product)
    return <p className="p-6 cursor-default select-none">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 select-none">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="prata-regular text-xl md:text-2xl tracking-wide text-[#414141] mb-3">
            {product.name}
          </h1>
          <p className="font-semibold text-lg md:text-xl text-amber-700 mb-4">
            ₹{product.price}
          </p>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            This is a premium product from our collection. Perfect fit, high
            quality, and stylish design.
          </p>
          <button
            onClick={addToCart}
            className="px-6 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-900 transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
