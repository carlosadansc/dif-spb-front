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
import NewContributionView from '../views/NewContributionView.vue'
import NotFoundView from '../views/NotFoundView.vue'

// Routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/',
    name: 'Root',
    component: HomeView,
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: {
          requiresStandardUser: true, // Accesible para todos los usuarios autenticados
          title: 'Dashboard'
        }
      },
      {
        path: 'beneficiaries',
        name: 'Beneficiaries',
        component: BeneficiariesView,
        meta: {
          requiresStandardUser: true,
          title: 'Beneficiarios'
        }
      },
      {
        path: 'beneficiaries/:id/new-contribution',
        name: 'NewContribution',
        component: NewContributionView,
        meta: {
          requiresStandardUser: true,
          title: 'Nuevo Apoyo'
        },
        props: true
      },
      {
        path: 'massive-contributions',
        name: 'MassiveContributions',
        component: () => import('../views/MassiveContributionsView.vue'),
        meta: {
          requiresStandardUser: true,
          title: 'Historial de Jornadas'
        }
      },
      {
        path: 'massive-contribution',
        name: 'NewMassiveContribution',
        component: () => import('../views/NewMassiveContributionView.vue'),
        meta: {
          requiresStandardUser: true,
          title: 'Nuevo Apoyo Masivo'
        }
      },
      {
        path: 'beneficiaries/:id',
        name: 'Beneficiary',
        component: BeneficiaryView,
        meta: {
          requiresStandardUser: true,
          title: 'Detalle de Beneficiario'
        },
        props: true
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersView,
        meta: {
          requiresAdmin: true,
          title: 'Usuarios'
        }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: CategoriesView,
        meta: {
          requiresAdmin: true,
          title: 'Categorías'
        }
      },
      {
        path: 'areas',
        name: 'Areas',
        component: AreasView,
        meta: {
          requiresAdmin: true,
          title: 'Áreas'
        }
      }
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
  const userLevel = isLoggedIn.value ? getUserLevel(user.value?.userType) : 0;

  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some(record => 
    record.meta.requiresAdmin || record.meta.requiresExecutive || record.meta.requiresStandardUser
  );

  // Establecer título de la página
  if (to.meta.title) {
    document.title = `${to.meta.title} | DIF SIPA`;
  }

  // Usuario autenticado
  if (isLoggedIn.value) {
    // Redirigir al dashboard si intenta acceder al login
    if (to.name === 'Login') {
      return next({ name: 'Dashboard' });
    }
  } 
  // Usuario no autenticado
  else if (requiresAuth) {
    return next({
      name: 'Login',
      query: { redirect: to.fullPath },
    });
  }

  // Verificar permisos de la ruta
  if (requiresAuth) {
    const hasAccess = !(
      (to.meta.requiresAdmin && userLevel < 3) ||
      (to.meta.requiresExecutive && userLevel < 2) ||
      (to.meta.requiresStandardUser && userLevel < 1)
    );

    if (!hasAccess) {
      return next({ name: 'NotFound' });
    }
  }

  next();
});

export default router
