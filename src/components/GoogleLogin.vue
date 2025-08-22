<template>
  <div class="google-login-container">
    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p>Iniciando sesión...</p>
      </div>
    </div>
    
    <!-- Botón de Google que se renderiza automáticamente -->
    <div 
      id="g_id_onload"
      :data-client_id="clientId"
      data-context="signin"
      data-ux_mode="popup"
      data-callback="handleCredentialResponse"
      data-auto_prompt="false">
    </div>
    
    <div 
      class="g_id_signin"
      data-type="standard"
      data-shape="rectangular"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left">
    </div>

    <!-- Fallback si Google no se carga -->
    <div v-if="!googleLoaded" class="google-fallback mt-3">
      <Button 
        label="Iniciar sesión con Google" 
        icon="pi pi-google" 
        class="w-full p-button-outlined"
        @click="handleFallbackClick"
        :loading="fallbackLoading"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { GOOGLE_CLIENT_ID } from '@/utils';
import { login } from '@/modules/auth/store/actions';

const props = defineProps({
  onSuccess: {
    type: Function,
    required: true
  },
  onError: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['login-success']);

const clientId = GOOGLE_CLIENT_ID;
const googleLoaded = ref(false);
const fallbackLoading = ref(false);
const isLoading = ref(false);

// Función global que será llamada por Google
window.handleCredentialResponse = async (response) => {
  try {
    isLoading.value = true;
    
    // Extraer el credential del response de Google
    const credential = response.credential;
    
    if (!credential) {
      throw new Error('No se recibió el credential de Google');
    }
    
    // Llamar al API de login con el credential
    const loginResponse = await login(credential);
    
    // Si el login es exitoso, llamar al callback de éxito
    if (loginResponse && loginResponse.access_token) {
      props.onSuccess(loginResponse);
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
    
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Error al iniciar sesión';
    props.onError(errorMessage);
  } finally {
    isLoading.value = false;
  }
};

// Función fallback si Google no se carga
const handleFallbackClick = () => {
  fallbackLoading.value = true;
  props.onError('Google Sign-In no está disponible. Por favor, recarga la página.');
  setTimeout(() => {
    fallbackLoading.value = false;
  }, 2000);
};

onMounted(() => {
  // Cargar el script de Google
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    googleLoaded.value = true;
  };
  
  script.onerror = () => {
    console.error('Error al cargar Google Sign-In');
    googleLoaded.value = false;
  };
  
  document.head.appendChild(script);
  
  // Timeout para detectar si Google no se carga
  setTimeout(() => {
    if (!googleLoaded.value) {
      console.warn('Google Sign-In no se cargó en el tiempo esperado');
    }
  }, 5000);
});

onUnmounted(() => {
  // Limpiar la función global
  delete window.handleCredentialResponse;
});
</script>

<style scoped>
.google-login-container {
  width: 100%;
  position: relative;
}

.google-fallback {
  opacity: 0.8;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 8px;
}

.loading-content {
  text-align: center;
  color: #666;
}

.loading-content p {
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Asegurar que el botón de Google tenga el ancho completo */
:deep(.g_id_signin) {
  width: 100% !important;
}

:deep(.g_id_signin > div) {
  width: 100% !important;
}

:deep(.g_id_signin iframe) {
  width: 100% !important;
}
</style>
