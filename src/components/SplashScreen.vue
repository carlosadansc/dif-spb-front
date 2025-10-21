<template>
  <div class="splash-screen">
    <div class="splash-content">
      <div class="spinner">
        <div v-if="!conectionError" class="double-bounce1"></div>
        <div v-if="!conectionError" class="double-bounce2"></div>
      </div>
      <h1 class="text-2xl font-semibold mt-6">Iniciando aplicación...</h1>
      <p class="mt-2 text-gray-600">Por favor espere un momento</p>

      <p v-if="conectionError" class="mt-2 text-red-600">Error al conectar con el servidor</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const conectionError = ref(false);

const checkServerStatus = async () => {
  try {
    const response = await api.get('/');
    if (response.status === 200) {
      console.log('Servidor listo');
      // Redirigir al dashboard o a la ruta inicial
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    conectionError.value = true;
    // Reintentar después de un tiempo
    setTimeout(checkServerStatus, 3000);
  }
};

onMounted(() => {
  checkServerStatus();
});

onBeforeUnmount(() => {
  // Limpiar cualquier temporizador pendiente
  clearTimeout();
});
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.splash-content {
  text-align: center;
}

.spinner {
  width: 5rem;
  height: 5rem;
  position: relative;
  margin: 0 auto;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #7b0707; /* blue-600 */
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  animation-delay: -1.0s;
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
}
</style>
