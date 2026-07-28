import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/api.php",
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(new Error(error.response?.data?.message || "서버와 통신하지 못했습니다.")),
);

export const api = {
  health: () => client.get("?action=health"),
  createInquiry: (data) => client.post("?action=inquiries", data),
  inquiries: (params = {}) => client.get("?action=inquiries", { params }),
  inquiry: (id) => client.get("?action=inquiry", { params: { id } }),
  updateInquiry: (data) => client.put("?action=inquiry", data),
  addNote: (data) => client.post("?action=note", data),
  customers: () => client.get("?action=customers"),
  createService: (data) => client.post("?action=services", data),
  services: () => client.get("?action=services"),
  updateService: (data) => client.put("?action=services", data),
  login: (data) => client.post("?action=login", data),
  logout: () => client.post("?action=logout"),
  me: () => client.get("?action=me"),
  dashboard: () => client.get("?action=dashboard"),
};
