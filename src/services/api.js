
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { queryClient } from "../utils/queryClient";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token && !config.url?.includes("/auth/admin/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const isLoginRequest = error.config?.url?.includes(
      "/auth/admin/login"
    );

    if (error.response?.status === 401 && !isLoginRequest) {
      const { logout, token } = useAuthStore.getState();

      if (token) {
        logout();

        queryClient.clear();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;
