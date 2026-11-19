<template>
  <main class="grid min-h-[100dvh] bg-gray-100 lg:grid-cols-[minmax(22rem,0.8fr)_1.2fr]">
    <section class="hidden bg-red-950 p-10 text-white lg:flex lg:flex-col lg:justify-between" aria-label="Sistema de Padrón de Beneficiarios">
      <img src="@/assets/img/logo-dif.png" class="h-16 w-auto self-start rounded-xl bg-white p-2" alt="DIF La Paz" />
      <div class="max-w-md">
        <IconUsersGroup class="mb-5 h-10 w-10 text-red-200" aria-hidden="true" />
        <h1 class="text-3xl font-bold leading-tight">Sistema de Padrón de Beneficiarios</h1>
        <p class="mt-3 text-sm leading-6 text-red-100">Consulta expedientes y registra la entrega de apoyos del DIF Municipal de La Paz.</p>
      </div>
      <p class="text-xs text-red-200">Acceso exclusivo para personal autorizado</p>
    </section>

    <section class="flex items-center justify-center p-4 sm:p-8">
      <div class="w-full max-w-md">
        <div class="mb-6 flex items-center gap-3 lg:hidden">
          <img src="@/assets/img/logo-dif.png" class="h-12 w-auto" alt="DIF La Paz" />
          <span class="text-sm font-bold text-red-900">Padrón de beneficiarios</span>
        </div>
        <div class="surface-panel p-5 sm:p-7">
          <header class="mb-6">
            <div class="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-900">
              <IconLogin2 class="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 class="text-2xl font-bold text-gray-950">Iniciar sesión</h2>
            <p class="mt-1 text-sm text-gray-600">Ingresa tus credenciales para continuar.</p>
          </header>
      
      
      <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input 
            id="username"
            v-model.trim="credentials.username" 
            type="text" 
            placeholder="Ingrese su usuario"
            :class="['w-full input input-bordered', errors.username ? 'input-error' : '']"
            :disabled="loginBlocked"
            :aria-invalid="Boolean(errors.username)"
            :aria-describedby="errors.username ? 'username-error' : undefined"
            @input="clearError('username')"
          />
          <p v-if="errors.username" id="username-error" role="alert" class="mt-1 text-sm text-red-700">{{ errors.username }}</p>
        </div>
        
        <!-- Password Field -->
        <div>
          <div class="mb-1 flex items-center">
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          </div>
          <div class="relative">
            <input 
              id="password"
              :type="showPassword ? 'text' : 'password'" 
              v-model="credentials.password" 
              placeholder="Ingrese su contraseña"
              :class="['w-full input input-bordered pr-10', errors.password ? 'input-error' : '']"
              :disabled="loginBlocked"
              :aria-invalid="Boolean(errors.password)"
              :aria-describedby="errors.password ? 'password-error' : undefined"
              @input="clearError('password')"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              class="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-gray-600 hover:text-gray-800"
              :disabled="loginBlocked"
            >
              <IconEye class="w-5 h-5" v-if="showPassword" /> 
              <IconEyeOff class="w-5 h-5" v-else />
            </button>
          </div>
          <p v-if="errors.password" id="password-error" role="alert" class="mt-1 text-sm text-red-700">{{ errors.password }}</p>
        </div>
        
        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <div class="flex min-h-11 items-center">
            <input 
              id="remember_me" 
              v-model="rememberMe" 
              type="checkbox" 
              class="h-5 w-5 rounded border-gray-300 text-red-700 focus:ring-red-700"
              :disabled="loginBlocked"
            />
            <label for="remember_me" class="ml-2 block text-sm text-gray-700">
              Recordar mi sesión
            </label>
          </div>
          
        </div>
        
        <!-- Error Message -->
        <div v-if="formError" role="alert" aria-live="assertive" class="rounded-lg bg-red-100 p-3 text-sm text-red-800">
          {{ formError }}
        </div>
        
        <!-- Submit Button -->
        <div>
          <button 
            type="submit" 
            class="btn btn-brand min-h-12 w-full"
            :disabled="loading"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
          >
            <template v-if="loading">
              <span class="loading loading-spinner mr-2"></span>
              Iniciando sesión...
            </template>
            <template v-else>
              Iniciar sesión
            </template>
          </button>
        </div>
      </form>
        </div>
    </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { toast } from 'vue3-toastify';
import { IconEye, IconEyeOff, IconLogin2, IconUsersGroup } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import router from '../../router';
import userServices from '../../services/userServices';
import { useAuthStore } from "../../stores/authStore";
import { getTranslatedError } from '../../utils/errorManager';

// Store
const authStore = useAuthStore();
const { user, authToken } = storeToRefs(authStore);

// Refs
const credentials = ref({ 
  username: localStorage.getItem('rememberedUsername') || '', 
  password: '' 
});

const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(!!localStorage.getItem('rememberedUsername'));
const formError = ref('');
const errors = ref({});
const loginBlocked = ref(false);
const loginBlockUntil = ref(null);

// Check for login block on component mount
onMounted(() => {
  checkLoginBlock();
});

// Check if login is blocked
const checkLoginBlock = () => {
  const blockUntil = localStorage.getItem('loginBlockUntil');
  if (blockUntil) {
    const blockTime = new Date(blockUntil).getTime();
    const now = new Date().getTime();
    
    if (now < blockTime) {
      // Still blocked
      loginBlocked.value = true;
      loginBlockUntil.value = new Date(blockTime);
      
      // Update form error
      const remainingMinutes = Math.ceil((blockTime - now) / (60 * 1000));
      formError.value = `Demasiados intentos fallidos. Por favor espere ${remainingMinutes} minuto(s) e intente de nuevo.`;
      
      // Set timeout to unblock when time is up
      const timeout = blockTime - now;
      setTimeout(() => {
        loginBlocked.value = false;
        loginBlockUntil.value = null;
        formError.value = '';
        localStorage.removeItem('loginBlockUntil');
        localStorage.removeItem('failedLoginAttempts');
      }, timeout);
      
      return true;
    } else {
      // Block expired, clean up
      localStorage.removeItem('loginBlockUntil');
      localStorage.removeItem('failedLoginAttempts');
      loginBlocked.value = false;
      loginBlockUntil.value = null;
    }
  }
  return false;
};

// Methods
const validateForm = () => {
  let isValid = true;
  errors.value = {};
  
  if (!credentials.value.username.trim()) {
    errors.value.username = 'El nombre de usuario es requerido';
    isValid = false;
  }
  
  if (!credentials.value.password) {
    errors.value.password = 'La contraseña es requerida';
    isValid = false;
  } else if (credentials.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }
  
  return isValid;
};

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
  if (formError.value) {
    formError.value = '';
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  formError.value = '';
  
  try {
    // Normalize username (trim and lowercase)
    const normalizedCredentials = {
      username: credentials.value.username.trim().toLowerCase(),
      password: credentials.value.password
    };
    
    const data = await userServices.login(normalizedCredentials);
    
    if (data?.token && data?.user) {
      // Handle remember me
      if (rememberMe.value) {
        localStorage.setItem('rememberedUsername', normalizedCredentials.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      if (!data.token || !data.user) {
        throw new Error('Datos de autenticación incompletos');
      }
      
      // Set auth data
      authStore.setAuthToken(data.token);
      authStore.setUser(data.user);
      
      // Esperar que el DOM se actualice
      await nextTick();

      // Determinar la ruta de redirección
      const intendedRoute = router.currentRoute.value.query.redirect;

      // Definir rutas basadas en el tipo de usuario
      const userRoutes = {
        'admin': '/dashboard',
        'user': '/beneficiaries',
        // Agrega más tipos de usuario según sea necesario
      };
      
      // Usar la ruta específica del tipo de usuario o '/dashboard' por defecto
      const defaultRoute = userRoutes[data.user.userType] || '/dashboard';
      const targetRoute = intendedRoute || defaultRoute;

      // Mostrar mensaje de bienvenida
      toast.success(`Bienvenido, ${data.user.name}!`);

      // Navegar a la ruta de destino
      try {
        await router.push(targetRoute);
      } catch (error) {
        console.error('Error al redirigir:', error);
        // Si hay un error con la navegación, redirigir a la ruta por defecto
        router.push(defaultRoute);
      }
    } else {
      throw new Error('Respuesta de inicio de sesión inválida');
    }
  } catch (err) {
    handleLoginError(err);
  } finally {
    loading.value = false;
  }
};

const handleLoginError = (error) => {
  loading.value = false;
  const errorResponse = error.response?.data?.errors?.[0] || {};
  
  // Handle specific error codes
  if (errorResponse.code === 'ERR0016') {
    // Account locked
    formError.value = 'Su cuenta ha sido bloqueada temporalmente. Por favor intente más tarde o contacte al administrador.';
    loginBlocked.value = true;
  } else if (errorResponse.code === 'ERR0017' || 
             errorResponse.code === 'ERR0001') {
    // Invalid credentials - track failed attempts
    trackFailedLogin();
    formError.value = 'Credenciales inválidas. Por favor intente de nuevo.';
  } else {
    // Generic error
    const errorMessage = getTranslatedError(error) || 'Error al iniciar sesión. Por favor intente más tarde.';
    formError.value = errorMessage;
  }
  
  // Show error toast
  toast.error(formError.value);
};

// Track failed login attempts and block if too many
const trackFailedLogin = () => {
  // Get current failed attempts or initialize
  let failedAttempts = parseInt(localStorage.getItem('failedLoginAttempts') || '0');
  failedAttempts++;
  
  // Block after 3 failed attempts for 30 minutes
  if (failedAttempts >= 3) {
    const blockTime = new Date();
    blockTime.setMinutes(blockTime.getMinutes() + 30); // Block for 30 minutes
    
    localStorage.setItem('loginBlockUntil', blockTime.toISOString());
    localStorage.setItem('failedLoginAttempts', '0');
    
    // Update UI
    loginBlocked.value = true;
    loginBlockUntil.value = blockTime;
    
    // Update form error
    formError.value = 'Demasiados intentos fallidos. Por favor espere 30 minutos e intente de nuevo.';
    
    // Set timeout to unblock after 30 minutes
    setTimeout(() => {
      loginBlocked.value = false;
      loginBlockUntil.value = null;
      formError.value = '';
      localStorage.removeItem('loginBlockUntil');
      localStorage.removeItem('failedLoginAttempts');
    }, 30 * 60 * 1000);
  } else {
    // Update failed attempts count
    localStorage.setItem('failedLoginAttempts', failedAttempts.toString());
  }
};

</script>

<style scoped>
.input-error {
  @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

/* Smooth transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
