import http from '../services/api';
import router from '../router';
import { useAuthStore } from '../stores/authStore';

let unauthorizedHandlerInstalled = false;

export default {
  install: (app) => {
    app.config.globalProperties.$http = http;
    app.provide('http', http);

    if (!unauthorizedHandlerInstalled) {
      window.addEventListener('spb:unauthorized', async () => {
        const authStore = useAuthStore();
        authStore.setAuthToken('');
        authStore.setUser({});
        if (router.currentRoute.value.name !== 'Login') {
          await router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
        }
      });
      unauthorizedHandlerInstalled = true;
    }
  }
};
