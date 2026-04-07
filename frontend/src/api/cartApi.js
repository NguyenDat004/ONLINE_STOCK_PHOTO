//cartApi.js
import axiosClient from "./axiosClient";

export const addToCartApi = (photoId, quantity) => {
  return axiosClient.post("/cart/add", { photoId, quantity });
};

export const getCartApi = (userId) => {
  return axiosClient.get(`/cart/${userId}`);
};

export const removeFromCartApi = (userId, photoId) => {
  return axiosClient.delete(`/cart/${userId}/${photoId}`);
};

export const updateQuantityApi = (userId, photoId, quantity) => {
  return axiosClient.put(`/cart/${userId}/${photoId}`, { quantity });
};

export const clearCartApi = (userId) => {
  return axiosClient.delete(`/cart/clear/${userId}`);
};

