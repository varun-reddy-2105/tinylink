import axios from "axios";

// Local backend API
const api = axios.create({
  baseURL: "https://tinylink-backend-z4fw.onrender.com",// FIXED!!!
});

// Create a short link
export const createShortLink = (targetUrl) =>
  api.post("/links", { targetUrl }).then(res => res.data);

// Get all links
export const listLinks = () =>
  api.get("/links").then(res => res.data);

// Delete a link
export const deleteLink = (id) =>
  api.delete(`/links/${id}`).then(res => res.data);

// Get stats for a short link
export const getStats = (code) =>
  api.get(`/links/${code}/stats`).then(res => res.data);
