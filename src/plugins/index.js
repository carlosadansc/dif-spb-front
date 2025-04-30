
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
    .use(Vue3Toasity, {
      autoClose: 3000,
      position: "top-right",
      // Valor muy alto para asegurar que esté por encima de todo
      toastStyle: { zIndex: 10000 },
      // Para compatibilidad con otras configuraciones de z-index en la aplicación
      containerStyle: { zIndex: 10000 }
    })
    .component('EasyDataTable', Vue3EasyDataTable)
    .directive('maska', vMaska)
}
