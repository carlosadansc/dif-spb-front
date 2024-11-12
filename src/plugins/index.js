
// Plugins
import router from '../router'
import { createPinia } from 'pinia'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css'; 

const pinia = createPinia()

export function registerPlugins (app) {
  app
    .use(pinia)
    .use(router)
    .component('EasyDataTable', Vue3EasyDataTable)
}
