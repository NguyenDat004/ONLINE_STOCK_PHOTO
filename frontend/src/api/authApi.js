import axiosClient from "./axiosClient";

export const loginApi = (token) => {
  return axiosClient.post("/auth/login", { token });
};