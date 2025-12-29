import API from "./api";

const paymentService = {
  initiatePayment: (data) => {
    // data = { orderId, amount }
    return API.post("/payments/initiate", data);
  },

  confirmPayment: (data) => {
    return API.post("/payments/confirm", data);
  },

  getByOrderNumber: (orderNumber) => {
    return API.get(`/payments/by-order-number/${orderNumber}`);
  }
};

export default paymentService;
