import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createShortLink = (targetUrl) =>
  api.post("/links", { targetUrl }).then(res => res.data);
