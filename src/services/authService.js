import API from "./api";

const authService = {
  // REGISTER
  register: (data) => API.post("/Auth/register", data),

  // LOGIN
  login: (data) => API.post("/Auth/login", data),

  // REFRESH TOKEN
  refresh: (refreshToken) =>
    API.post("/Auth/refresh", { refreshToken }),

  // LOGOUT
  logout: (refreshToken) =>
    API.post("/Auth/logout", { refreshToken }),
};

export default authService;
