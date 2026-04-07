import axiosClient from "./axiosClient";

export const loginApi = (token) => {
  return axiosClient.post("/auth/login", { token });
};

export const registerApi = (token) => {
  return axiosClient.post("/auth/register", { token });
};

export const getUserDataApi = (userId) => {
  return axiosClient.get(`/auth/user/${userId}`);
};

export const logoutApi = () => {
  return axiosClient.post("/auth/logout");
};
