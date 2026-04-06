import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Tự động gắn Firebase token vào header
axiosClient.interceptors.request.use(async (config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default axiosClient;
