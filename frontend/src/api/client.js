import axios from "axios";

// In production, set VITE_API_URL to your deployed backend's URL, e.g.
// https://support-crm-api.up.railway.app/api
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL });

export const getTickets = (params) => api.get("/tickets", { params });
export const getTicket = (ticketId) => api.get(`/tickets/${ticketId}`);
export const createTicket = (payload) => api.post("/tickets", payload);
export const updateTicket = (ticketId, payload) =>
  api.put(`/tickets/${ticketId}`, payload);

export default api;
