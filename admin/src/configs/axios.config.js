import axios from "axios";
import { baseUrl } from "../constants/env";
import useAuth from "../hooks/useAuth";
const { logout } = useAuth;

const axiosClient = axios.create({
  baseURL: baseUrl,
  // Remove default Content-Type to allow automatic detection
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Remove Content-Type header for FormData to allow automatic detection
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosClient.post("/refresh");
        console.log(res);
        const newAccessToken = res?.data?.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
