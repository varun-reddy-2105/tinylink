// src/api/client.js

const BASE_URL = "https://tinylink-backend-z4fw.onrender.com"; // Local backend URL

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export const api = {
  listLinks() {
    return request("/links");
  },
  createLink(payload) {
    return request("/links", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteLink(id) {
    return request(`/links/${id}`, { method: "DELETE" });
  },
  getStats(code) {
    return request(`/links/${code}/stats`);
  },
  healthz() {
    return request("/healthz");
  },
};
