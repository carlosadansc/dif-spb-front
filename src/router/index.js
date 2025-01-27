// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

//Components
import HomeView from "../views/HomeView.vue"
import LoginView from "../views/login/SignInView.vue"
import DashboardView from '../views/DashboardView.vue'
import BeneficiariesView from '../views/BeneficiariesView.vue'
import BeneficiaryView from '../views/BeneficiaryView.vue'

//Routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: '/beneficiaries',
        name: 'Beneficiaries',
        component: BeneficiariesView,
      },
      {
        path: '/beneficiaries/:id',
        name: 'Beneficiary',
        component: BeneficiaryView
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth()

  if ((to.name == 'Login' && isLoggedIn()) || (to.name == 'Home' && isLoggedIn())) {
    next({ path: '/dashboard' })
  }
  else if (to.meta.requiresAuth && !isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  else {
    next()
  }

})

export default router
