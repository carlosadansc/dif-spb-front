import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000",
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data?.errors?.[0];
    error.userMessage = apiError?.description || apiError?.detail || 'No fue posible completar la solicitud';

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('spb:unauthorized'));
    }

    return Promise.reject(error);
  },
);

export default instance
