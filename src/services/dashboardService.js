import API from "./api";

const dashboardService = {
  getStats: () => API.get("/admin/users/dashboard"),
};

export default dashboardService;
