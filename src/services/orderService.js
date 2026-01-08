import API from "./api";

const orderService = {
  /* ================= USER ================= */

  checkout: (data) => {
    return API.post("/Orders/checkout", data);
  },

  getMyOrders: () => {
    return API.get("/Orders/my-orders");
  },

  getOrderById: (orderId) => {
    return API.get(`/Orders/${orderId}`);
  },

  /* ================= ADMIN ================= */

  //  ADMIN – Get all orders
  getAllOrders: () => {
    return API.get("/Orders/all");
  },

  //  ADMIN – Delete order
  deleteOrder: (orderId) => {
    return API.delete(`/Orders/${orderId}`);
  },

  //  ADMIN – Update order status
  updateOrderStatus: (orderId, status) => {
    return API.patch(`/Orders/${orderId}/status`, {
      status,
    });
  },
};

export default orderService;
