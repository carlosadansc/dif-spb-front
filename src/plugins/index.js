
// Plugins
import router from '../router'
import { createPinia } from 'pinia'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'vue3-easy-data-table/dist/style.css'; 
import { vMaska } from "maska/vue" 

const pinia = createPinia()

export function registerPlugins (app) {
  app
    .use(pinia)
    .use(router)
    .use(Vue3Toasity, { autoClose: 3000})
    .component('EasyDataTable', Vue3EasyDataTable)
    .directive('maska', vMaska)
}
