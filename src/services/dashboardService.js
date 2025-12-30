import API from "./api";

const dashboardService = {
  getAdminDashboard: async () => {
    const response = await API.get("/admin/users/dashboard");
    return response.data;
  },
};

export default dashboardService;
