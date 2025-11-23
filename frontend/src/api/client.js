// src/api/client.js

const BASE_URL = "http://localhost:5000"; // change if your backend lives elsewhere

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // returns [] or throws
  async listLinks() {
    try {
      const data = await request("/links");
      // backend: [] (Option A)
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Failed to list links:", e);
      return [];
    }
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

  resolveCode(code) {
    return request(`/resolve/${code}`);
  },

  async healthz() {
    try {
      const data = await request("/healthz");
      // if backend returns null, normalize
      if (data === null || typeof data !== "object") {
        return { status: "down", raw: data };
      }
      return data;
    } catch (e) {
      console.error("Health check failed:", e);
      return { status: "down", error: e.message };
    }
  },
};
