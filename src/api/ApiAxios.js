import axios from "axios";
import toast from "react-hot-toast";
import { clearPaginatedCache } from "../hooks/usePaginatedData";

// Logout function with optional delay
const performLogout = (delayMs = 0) => {
  setTimeout(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearPaginatedCache();
    window.location.href = "/login";
  }, delayMs);
};

const apiAxios = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiAxios.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("token");

    const token = userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("logging error from interceptor:", error);

    const userToken = localStorage.getItem("token");
    const backendMessage = error.response?.data?.message || error.message;

    const isAuthError =
      error.response?.status === 401 &&
      (error.response?.data?.message
        ?.toLowerCase()
        .includes("unauthenticated") ||
        error.response?.data?.message?.toLowerCase().includes("token") ||
        error.response?.data?.error === "Unauthenticated");

    const isAuthException =
      error.response?.status === 500 &&
      error.response?.data?.error === "AuthenticationException";

    // Handle 403 Forbidden (IP change, access denied, etc.)
    const isForbiddenError = error.response?.status === 403;

    if (isAuthError || isAuthException) {
      if (userToken) {
        console.log("Authentication failed - logging out");
        performLogout(0);
      }
    } else if (isForbiddenError && userToken) {
      // Show backend message only
      console.log("Access forbidden - showing error message");
      toast.error(backendMessage || "Access denied.");
    }

    return Promise.reject(error);
  }
);

export default apiAxios;
