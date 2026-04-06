import axiosClient from "./axiosClient";

export const getAllPhotos = () => axiosClient.get("/photos");

export const getPhotoById = (id) => axiosClient.get(`/photos/${id}`);

export const checkPhotoStatus = (photoId) =>
  axiosClient.get(`/photos/status/${photoId}`);

export const getDownloadUrl = (photoId) =>
  axiosClient.get(`/photos/download/${photoId}`);