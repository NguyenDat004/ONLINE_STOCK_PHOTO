//cartApi.js
import axios from "axios";

export const addToCartApi = (photoId, quantity) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return axios.post("/api/cart/add", { photoId, quantity }, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

export const getCartApi = (userId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return axios.get(`/api/cart/${userId}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
};

export const removeFromCartApi = (userId, photoId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return axios.delete(`/api/cart/${userId}/${photoId}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
};  


