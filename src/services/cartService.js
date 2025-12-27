import API from "./api";

const cartService = {
  // 🛒 Get cart items
  getCart: () => API.get("/Cart"),

  // ➕ Add item to cart
  addToCart: (productId, quantity = 1) =>
    API.post(`/Cart/${productId}?quantity=${quantity}`),

  // 🔄 Update quantity
  updateQuantity: (productId, quantity) =>
    API.put(`/Cart/${productId}?quantity=${quantity}`),

  // ❌ Remove item
  removeFromCart: (productId) =>
    API.delete(`/Cart/${productId}`),

  // 🧹 Clear cart
  clearCart: () => API.delete("/Cart"),
};

export default cartService;
