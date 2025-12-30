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
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-6">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left">Product</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-4 flex items-center gap-3">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-12 h-12 rounded object-cover"
                />
                {p.name}
              </td>
              <td className="p-4 text-center">₹{p.price}</td>
              <td className="p-4 text-center">{p.stockQuantity}</td>
              <td className="p-4 text-right">
                <button
                  className="text-indigo-600 mr-3"
                  onClick={() => {
                    setEditProduct(p);
                    setShowEdit(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD MODAL ================= */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} title="Add Product">
          <form onSubmit={handleAddSubmit}>
            <Input label="Name" name="name" onChange={handleAddChange} />
            <Input label="Price" name="price" type="number" onChange={handleAddChange} />
            <Input label="Category Id" name="categoryId" onChange={handleAddChange} />
            <Input label="Stock" name="stockQuantity" type="number" onChange={handleAddChange} />
            <Input label="Image" name="image" type="file" onChange={handleAddChange} />
            <Submit />
          </form>
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEdit && editProduct && (
        <Modal onClose={() => setShowEdit(false)} title="Edit Product">
          <form onSubmit={handleEditSubmit}>
            <Input label="Name" name="name" value={editProduct.name} onChange={handleEditChange} />
            <Input label="Price" name="price" type="number" value={editProduct.price} onChange={handleEditChange} />
            <Input label="Category Id" name="categoryId" value={editProduct.categoryId} onChange={handleEditChange} />
            <Input label="Stock" name="stockQuantity" type="number" value={editProduct.stockQuantity} onChange={handleEditChange} />
            <Input label="Image" name="image" type="file" onChange={handleEditChange} />
            <Submit />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================= SMALL UI HELPERS ================= */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button
          className="mt-4 text-sm text-gray-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}

function Submit() {
  return (
    <button className="w-full bg-indigo-600 text-white py-2 rounded mt-4">
      Save
    </button>
  );
}

export default ManageProducts;
