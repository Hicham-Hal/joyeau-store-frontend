import axios from "axios";

// ---------------------------------------------------------------------------
// Central Axios instance.
//
// Mode is controlled by environment variables (see `.env.example`):
//   VITE_USE_MOCK=true   (default) -> localStorage demo data, no backend
//   VITE_USE_MOCK=false             -> real REST backend at VITE_API_URL
//
// Components never call Axios directly: they dispatch Redux thunks
// (src/store/slices/*), which call the service functions (src/services/*),
// which use this client.
// ---------------------------------------------------------------------------

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// The Redux store registers a callback here so an expired/invalid token logs
// the seller out. Kept as a callback to avoid a circular import with the store.
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jb_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isLoginCall = String(error?.config?.url || "").includes("/auth/login");
    if (status === 401 && !isLoginCall && localStorage.getItem("jb_token") && onUnauthorized) {
      onUnauthorized();
    }
    console.error("[API ERROR]", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
