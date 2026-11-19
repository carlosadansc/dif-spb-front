<template>
  <div class="splash-screen">
    <div class="splash-content">
      <div class="spinner">
        <div v-if="!connectionError" class="double-bounce1"></div>
        <div v-if="!connectionError" class="double-bounce2"></div>
      </div>
      <h1 class="text-2xl font-semibold mt-6">Iniciando aplicación...</h1>
      <p v-if="!connectionError" class="mt-2 text-gray-700" role="status">Comprobando conexión con el servidor</p>

      <div v-else class="mt-4" role="alert">
        <p class="text-red-800">No fue posible conectar con el servidor.</p>
        <button type="button" class="btn mt-4 min-h-11 bg-red-800 text-white hover:bg-red-900" :disabled="checking" @click="checkServerStatus">
          <span v-if="checking" class="loading loading-spinner loading-sm"></span>
          {{ checking ? 'Conectando…' : 'Reintentar conexión' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const emit = defineEmits(['ready'])
const connectionError = ref(false);
const checking = ref(false)

const checkServerStatus = async () => {
  if (checking.value) return
  checking.value = true
  connectionError.value = false
  try {
    const response = await api.get('/');
    if (response.status === 200) {
      emit('ready')
    }
  } catch (error) {
    connectionError.value = true;
  } finally {
    checking.value = false
  }
};

onMounted(() => {
  checkServerStatus();
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

@media (prefers-reduced-motion: reduce) {
  .double-bounce1, .double-bounce2 {
    animation: none;
  }

  .double-bounce2 {
    opacity: 0.25;
    transform: scale(0.65);
  }
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
}
</style>
