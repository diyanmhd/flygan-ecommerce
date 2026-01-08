import React, { useEffect, useState } from "react";
import productService from "../services/productService";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ADD PRODUCT
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
    image: null,
  });

  // EDIT PRODUCT
  const [showEdit, setShowEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productService.getAll();
      setProducts(res.data.data || []);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  /* ================= ADD ================= */

  const handleAddChange = (e) => {
    const { name, value, files } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: files ? files[0] : value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("categoryId", newProduct.categoryId);
      formData.append("stockQuantity", newProduct.stockQuantity);
      formData.append("image", newProduct.image);

      await productService.create(formData);
      fetchProducts();
      setShowAdd(false);
      setNewProduct({
        name: "",
        price: "",
        categoryId: "",
        stockQuantity: "",
        image: null,
      });
    } catch {
      alert("Failed to add product");
    }
  };

  /* ================= EDIT ================= */

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: files ? files[0] : value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", editProduct.id);
      formData.append("name", editProduct.name);
      formData.append("price", editProduct.price);
      formData.append("categoryId", editProduct.categoryId);
      formData.append("stockQuantity", editProduct.stockQuantity);

      if (editProduct.image) {
        formData.append("image", editProduct.image);
      }

      await productService.update(formData);
      fetchProducts();
      setShowEdit(false);
    } catch {
      alert("Failed to update product");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-2">
            Manage Products
          </h1>
          <p className="text-gray-400 text-sm">Add, edit, and manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-900/50"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </span>
        </button>
      </div>

      {/* Table Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800">
                  <th className="p-4 text-left text-sm font-semibold text-gray-300">Product</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Price</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Stock</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative group/img">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-0 group-hover/img:opacity-50 transition duration-300"></div>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="relative w-14 h-14 rounded-lg object-cover border border-gray-700"
                          />
                        </div>
                        <span className="text-gray-200 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-green-400 font-semibold">₹{p.price}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        p.stockQuantity > 50 ? 'bg-green-500/20 text-green-400' :
                        p.stockQuantity > 10 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="group/btn p-2 rounded-lg bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white border border-gray-700 hover:border-green-600 transition-all duration-300"
                          onClick={() => {
                            setEditProduct(p);
                            setShowEdit(true);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="group/btn p-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white border border-gray-700 hover:border-red-600 transition-all duration-300"
                          onClick={() => handleDelete(p.id)}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} title="Add New Product">
          <form onSubmit={handleAddSubmit}>
            <Input label="Product Name" name="name" onChange={handleAddChange} placeholder="Enter product name" />
            <Input label="Price" name="price" type="number" onChange={handleAddChange} placeholder="0.00" />
            <Input label="Category Id" name="categoryId" onChange={handleAddChange} placeholder="1, 2, 3..." />
            <Input label="Stock Quantity" name="stockQuantity" type="number" onChange={handleAddChange} placeholder="0" />
            <Input label="Product Image" name="image" type="file" onChange={handleAddChange} />
            <Submit />
          </form>
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEdit && editProduct && (
        <Modal onClose={() => setShowEdit(false)} title="Edit Product">
          <form onSubmit={handleEditSubmit}>
            <Input label="Product Name" name="name" value={editProduct.name} onChange={handleEditChange} />
            <Input label="Price" name="price" type="number" value={editProduct.price} onChange={handleEditChange} />
            <Input label="Category Id" name="categoryId" value={editProduct.categoryId} onChange={handleEditChange} />
            <Input label="Stock Quantity" name="stockQuantity" type="number" value={editProduct.stockQuantity} onChange={handleEditChange} />
            <Input label="Product Image (optional)" name="image" type="file" onChange={handleEditChange} />
            <Submit />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================= PREMIUM UI HELPERS ================= */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="relative group max-w-md w-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-400">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
      <input
        {...props}
        className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
      />
    </div>
  );
}

function Submit() {
  return (
    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-900/50 mt-6">
      Save Product
    </button>
  );
}

export default ManageProducts;