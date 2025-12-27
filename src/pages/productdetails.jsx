import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import cartService from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const res = await productService.getById(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await cartService.addToCart(product.id, 1);
      alert("Item added to cart successfully");
    } catch (err) {
      console.error("Add to cart failed", err);
      alert("Failed to add item to cart");
    } finally {
      setAdding(false);
    }
  };

  /* ---------------- LOADING UI (UNCHANGED) ---------------- */
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- PRODUCT NOT FOUND ---------------- */
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI (UNCHANGED DESIGN) ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex justify-center items-start">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full max-w-md h-96 object-cover rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mb-2">
                Premium Collection
              </span>

              <h1 className="prata-regular text-3xl md:text-4xl text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="font-semibold text-3xl text-amber-700 mb-6">
                ₹{product.price}
              </p>

              <p className="text-gray-600 leading-relaxed mb-8 border-l-4 border-amber-200 pl-4">
                {product.description || "Premium quality product"}
              </p>

              <button
                onClick={addToCart}
                disabled={adding}
                className="group relative px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium text-lg"
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                  Product Features
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>✔ Premium materials</li>
                  <li>✔ Long-lasting durability</li>
                  <li>✔ Modern design</li>
                  <li>✔ Easy maintenance</li>
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
