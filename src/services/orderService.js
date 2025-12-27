import API from "./api";

const orderService = {
  // 🛒 Place order (Checkout)
  checkout: (data) => {
    // data = { deliveryAddress, paymentMethod }
    return API.post("/Orders/checkout", data);
  },

  // 👤 Get logged-in user's orders
  getMyOrders: () => {
    return API.get("/Orders/my-orders");
  },

  // 📦 Get single order by id (optional – for order details page)
  getOrderById: (orderId) => {
    return API.get(`/Orders/${orderId}`);
  },

  // 🛠 ADMIN – Get all orders
  getAllOrders: () => {
    return API.get("/Orders/all");
  },

  // 🛠 ADMIN – Delete order
  deleteOrder: (orderId) => {
    return API.delete(`/Orders/${orderId}`);
  },

  // 🛠 ADMIN – Update order status
  updateOrderStatus: (orderId, status) => {
    // status = "Pending" | "Confirmed" | "Shipped" | etc.
    return API.patch(`/Orders/${orderId}/status`, status);
  },
};

export default orderService;
