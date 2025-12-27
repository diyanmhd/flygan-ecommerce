import API from "./api";

const productService = {
  // ✅ GET ALL PRODUCTS
  getAll: () => API.get("/Products"),

  // ✅ GET PRODUCT BY ID
  getById: (id) => API.get(`/Products/${id}`),

  // ✅ GET PRODUCTS BY CATEGORY
  getByCategory: (categoryId) =>
    API.get(`/Products/category/${categoryId}`),

  // ✅ SEARCH PRODUCTS
  search: (keyword) =>
    API.get(`/Products/search`, {
      params: { keyword },
    }),

  // 🔒 ADMIN: CREATE PRODUCT (multipart/form-data)
  create: (formData) =>
    API.post("/Products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // 🔒 ADMIN: UPDATE PRODUCT (multipart/form-data)
  update: (formData) =>
    API.put("/Products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // 🔒 ADMIN: DELETE PRODUCT
  remove: (id) => API.delete(`/Products/${id}`),
};

export default productService;
