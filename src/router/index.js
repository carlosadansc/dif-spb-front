// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

// Components
import HomeView from "../views/HomeView.vue"
import LoginView from "../views/login/SignInView.vue"
import DashboardView from '../views/DashboardView.vue'
import BeneficiariesView from '../views/BeneficiariesView.vue'
import BeneficiaryView from '../views/BeneficiaryView.vue'
import UsersView from '../views/UsersView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import AreasView from '../views/AreasView.vue'
import NotFoundView from '../views/NotFoundView.vue'

// Routes
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
        component: DashboardView,
        meta: {
          requiresExecutive: true // Accesible para ejecutivos y superiores
        }
      },
      {
        path: '/beneficiaries',
        name: 'Beneficiaries',
        component: BeneficiariesView,
        meta: {
          requiresStandardUser: true // Accesible para todos los usuarios autenticados
        }
      },
      {
        path: '/beneficiaries/:id',
        name: 'Beneficiary',
        component: BeneficiaryView,
        meta: {
          requiresStandardUser: true
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: UsersView,
        meta: {
          requiresAdmin: true // Solo administradores
        }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: CategoriesView,
        meta: {
          requiresAdmin: true // Solo administradores
        }
      },
      {
        path: '/areas',
        name: 'Areas',
        component: AreasView,
        meta: {
          requiresAdmin: true // Solo administradores
        }
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Función para obtener el nivel del usuario
const getUserLevel = (userType) => ({
  'admin': 3,
  'executive': 2,
  'user': 1
})[userType] || 0

router.beforeEach((to, from, next) => {
  const { isLoggedIn, user } = useAuth();
  const userLevel = isLoggedIn.value ? getUserLevel(user.value.userType) : 0;

  const requiresAuth = to.matched.some(record => 
    record.meta.requiresAdmin || record.meta.requiresExecutive || record.meta.requiresStandardUser
  );

  // --- Lógica de Redirección para Usuarios Autenticados ---
  if (isLoggedIn.value) {
    // Si intenta acceder a Login, redirigir a su dashboard
    if (to.name === 'Login') {
      const redirectPath = userLevel === 1 ? '/beneficiaries' : '/dashboard';
      return next({ path: redirectPath });
    }

    // Si intenta acceder a la ruta raíz, redirigir a su dashboard
    if (to.name === 'Home' && to.path === '/') {
        const redirectPath = userLevel === 1 ? '/beneficiaries' : '/dashboard';
        return next({ path: redirectPath });
    }

  } else { 
    // --- Lógica para Usuarios NO Autenticados ---
    // Si no está autenticado y la ruta requiere autenticación, redirigir a Login
    if (requiresAuth) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath },
      });
    }
  }

  // --- Lógica de Autorización (Permisos por Nivel) ---
  if (requiresAuth) {
    if ((to.meta.requiresAdmin && userLevel < 3) ||
        (to.meta.requiresExecutive && userLevel < 2) ||
        (to.meta.requiresStandardUser && userLevel < 1)) {
      // Si no tiene el nivel requerido, enviar a NotFound
      return next({ name: 'NotFound' });
    }
  }

  // Si pasa todas las validaciones, permitir el acceso
  next();
});

export default router
