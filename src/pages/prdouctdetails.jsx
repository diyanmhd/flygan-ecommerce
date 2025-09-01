import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setIsLoading(false);
      });
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

    //  Show alert after adding to cart
    alert(`${product.name} has been added to your cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-4xl mx-auto p-6 w-full">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mt-8 animate-pulse"></div>
              <div className="pt-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/5 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex justify-center items-start">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-md h-96 object-cover rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute -inset-2 bg-gradient-to-br from-amber-100/20 to-transparent rounded-xl pointer-events-none"></div>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <div className="mb-2">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                  Premium Collection
                </span>
              </div>

              <h1 className="prata-regular text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="mb-6">
                <p className="font-semibold text-3xl text-amber-700">
                  ${product.price}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 border-l-4 border-amber-200 pl-4 py-1">
                This premium product features exceptional quality materials and
                craftsmanship. Designed for both style and comfort, it's perfect
                for any occasion.
              </p>

              <button
                onClick={addToCart}
                className="group relative px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add to Cart
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-amber-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </button>

              {/* Product Features */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                  Product Features:
                </h3>
                <ul className="text-gray-600 space-y-3">
                  <li>Premium quality materials for lasting durability</li>
                  <li>Perfect fit and exceptional comfort</li>
                  <li>Stylish and versatile design for any occasion</li>
                  <li>Easy care and maintenance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
