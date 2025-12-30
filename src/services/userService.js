import API from "./api";

const userService = {
  getAllUsers: () => API.get("/admin/users"),

  blockUser: (id) => API.patch(`/admin/users/${id}/block`),

  unblockUser: (id) => API.patch(`/admin/users/${id}/unblock`),

  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export default userService;
