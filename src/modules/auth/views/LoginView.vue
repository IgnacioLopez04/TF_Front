<template>
  <div class="min-h-screen flex align-items-center justify-content-center p-4 bg-gradient-primary">
    <div class="login-card bg-white border-round-2xl shadow-3 p-5 w-50 max-w-md">
      <!-- Header del login -->
      <div class="text-center mb-5">
        <div class="logo-container mb-4">
          <div class="logo-icon flex align-items-center justify-content-center">🏥</div>
        </div>
        <h1 class="text-3xl font-bold text-900 mb-2">Bienvenido</h1>
        <p class="text-600 text-lg m-0">Inicia sesión para acceder a tu cuenta</p>
      </div>

      <!-- Formulario de login -->
      <div class="login-section mb-5">
        <GoogleLogin 
          :onSuccess="handleLoginSuccess" 
          :onError="handleLoginError"
          @login-success="handleLoginSuccess"
        />
        <div v-if="loading" class="loading-container flex flex-column align-items-center gap-3 mt-4">
          <ProgressSpinner style="width: 50px; height: 50px" />
          <p class="text-600 m-0">Iniciando sesión...</p>
        </div>
        
        <Message v-if="error" severity="error" :closable="false" class="mt-3">
          {{ error }}
        </Message>
      </div>

      <!-- Footer con términos -->
      <div class="footer-section text-center">
        <p class="terms-text text-500 text-sm m-0 leading-4">
          Al continuar, aceptas nuestros 
          <a href="#" class="link-text text-primary hover:text-primary-600 no-underline">Términos de Servicio</a> y 
          <a href="#" class="link-text text-primary hover:text-primary-600 no-underline">Política de Privacidad</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GoogleLogin from '@/components/GoogleLogin.vue';
import { useAuthStore } from '../store';
import { showSuccess, showError } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref('');

const handleLoginSuccess = async (response) => {
  try {
    loading.value = true;
    error.value = '';
    
    // Ahora response contiene la respuesta del API con user y access_token
    if (response.user && response.access_token) {
      const userData = {
        id_usuario: response.user.id_usuario,
        nombre: response.user.nombre || '',
        apellido: response.user.apellido || '',
        email: response.user.email || '',
        nivel: response.user.nivel || null,
      };
      
      // Llamar al store para hacer login
      authStore.login(userData, response.access_token);
      
      showSuccess('¡Bienvenido! Has iniciado sesión correctamente');
      
      // Redirigir a la página de inicio
      router.push('/pacientes');
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
    
  } catch (err) {
    error.value = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
    showError('Error al iniciar sesión');
  } finally {
    loading.value = false;
  }
};

const handleLoginError = (errorResponse) => {
  console.error('Error de Google Login:', errorResponse);
  error.value = 'Error al conectar con Google. Por favor, intenta de nuevo.';
  showError('Error de autenticación');
};
</script>

<style scoped>
/* Solo CSS personalizado cuando PrimeFlex no puede hacerlo */

.bg-gradient-primary {
  background: #764ba2;
}

.logo-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.link-text {
  transition: color 0.2s ease;
}

.link-text:hover {
  text-decoration: underline;
}

/* Estilos específicos para el componente GoogleLogin */
:deep(.g_id_signin) {
  width: 100% !important;
  margin: 0 auto !important;
}

:deep(.g_id_signin > div) {
  width: 100% !important;
}

:deep(.g_id_signin iframe) {
  width: 100% !important;
}
</style>