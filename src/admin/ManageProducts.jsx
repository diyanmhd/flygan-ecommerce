// src/admin/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Edit states
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Add states
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    image: "",
    rating: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:3000/products/${editingProduct.id}`,
        editingProduct
      );

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? response.data : p))
      );

      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new product
  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/products",
        newProduct
      );

      setProducts([...products, response.data]);
      setShowAddModal(false);

      // Reset form
      setNewProduct({
        name: "",
        price: 0,
        category: "",
        stock: 0,
        image: "",
        rating: 0,
      });
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input handler
  const handleInputChange = (e, isEdit = true) => {
    const { name, value } = e.target;
    const finalValue =
      name === "price" || name === "stock" || name === "rating"
        ? Number(value)
        : value;

    if (isEdit) {
      setEditingProduct({ ...editingProduct, [name]: finalValue });
    } else {
      setNewProduct({ ...newProduct, [name]: finalValue });
    }
  };

  // Filtering & sorting
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name?.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock") return a.stock - b.stock;
      return 0;
    });

  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold">Manage Products</h1>
      </header>

      <main className="max-w-7xl mx-auto py-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
        </div>

        {/* Products List */}
        <div className="bg-white p-6 shadow rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              {filteredProducts.length} Products
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add New Product
            </button>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    <img
                      src={product.image || "/api/placeholder/100/100"}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.category}</td>
                  <td className="p-2 border">${product.price}</td>
                  <td className="p-2 border">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct({ ...product });
                        setShowEditModal(true);
                      }}
                      className="px-3 py-1 border rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          title="Edit Product"
          product={editingProduct}
          handleInputChange={(e) => handleInputChange(e, true)}
          onSubmit={handleUpdate}
          onClose={() => setShowEditModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          title="Add Product"
          product={newProduct}
          handleInputChange={(e) => handleInputChange(e, false)}
          onSubmit={handleAdd}
          onClose={() => setShowAddModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

// Reusable Modal Component
function Modal({
  title,
  product,
  handleInputChange,
  onSubmit,
  onClose,
  isSubmitting,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-lg font-bold">{title}</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter product name (e.g. Nike Shoes)"
          value={product?.name || ""}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Enter price (e.g. 1200)"
          value={product?.price || ""}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Enter category (e.g. Shoes, Electronics)"
          value={product?.category || ""}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Enter stock quantity (e.g. 50)"
          value={product?.stock || ""}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Enter image URL (e.g. https://...jpg)"
          value={product?.image || ""}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManageProducts;
