import axios from 'axios';
import router from '../router';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor de solicitud para agregar el token de autenticación
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores globales
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // No autorizado - redirigir al login
        console.error('No autorizado:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        await router.push({ 
          name: 'Login',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      } else if (error.response.status === 403) {
        // Acceso denegado
        console.error('Acceso denegado:', error);
        await router.push({ name: 'Dashboard' });
      } else if (error.response.status >= 500) {
        // Error del servidor - solo mostramos en consola
        console.error('Error del servidor:', error);
      }
    } else {
      // Error de red o servidor no disponible - solo mostramos en consola
      console.error('Error de red o servidor no disponible:', error);
    }
    
    return Promise.reject(error);
  }
);

export default {
  install: (app) => {
    app.config.globalProperties.$http = http;
    app.provide('http', http);
  }
};
