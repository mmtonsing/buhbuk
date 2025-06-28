import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true, // ✅ required to send cookies
});

// 👉 Dev-only: global 401 logging
if (import.meta.env.DEV) {
  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        console.info("⚠️ 401: Guest or expired session (expected)");
      }
      return Promise.reject(err);
    }
  );
}

export default axiosInstance;
