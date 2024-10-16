import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL; // Replace with your API base URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const TokenState = localStorage.getItem("token");

  const token = TokenState ? JSON.parse(TokenState).state.token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});