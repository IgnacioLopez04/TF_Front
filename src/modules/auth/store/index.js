import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAuthState } from './state';
import { useLogin, useLogout, useCheckAuth } from './actions';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const { usuario, accessToken } = useAuthState();
  const tokenCheckInterval = ref(null);

  // Detener monitoreo del token
  const stopTokenMonitoring = () => {
    if (tokenCheckInterval.value) {
      clearInterval(tokenCheckInterval.value);
      tokenCheckInterval.value = null;
    }
  };

  // Iniciar monitoreo periódico del token
  const startTokenMonitoring = () => {
    // Limpiar intervalo anterior si existe
    if (tokenCheckInterval.value) {
      clearInterval(tokenCheckInterval.value);
    }

    // Verificar token cada 30 segundos
    tokenCheckInterval.value = setInterval(() => {
      const currentToken = sessionStorage.getItem('accessToken');

      if (!currentToken || currentToken !== accessToken.value) {
        // Token perdido o cambiado
        console.warn('Token perdido o inválido, cerrando sesión...');
        logout();
        stopTokenMonitoring();

        // Redirigir al login si no estamos ya ahí
        if (router.currentRoute.value.name !== 'login') {
          router.push({ name: 'login' });
        }
      }
    }, 30000); // 30 segundos
  };

  const login = useLogin(usuario, accessToken, startTokenMonitoring);
  const logout = useLogout(usuario, accessToken, stopTokenMonitoring);
  const checkAuth = useCheckAuth(accessToken, logout);

  const isAuthenticated = computed(() => !!accessToken.value);

  // Verificar autenticación al inicio
  const initializeAuth = () => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      accessToken.value = token;
      startTokenMonitoring();
    }
  };

  // Listener para cambios en sessionStorage desde otras pestañas
  const setupStorageListener = () => {
    window.addEventListener('storage', (e) => {
      if (e.key === 'accessToken') {
        if (!e.newValue) {
          // Token eliminado en otra pestaña
          console.warn('Token eliminado en otra pestaña, cerrando sesión...');
          logout();
          stopTokenMonitoring();

          if (router.currentRoute.value.name !== 'login') {
            router.push({ name: 'login' });
          }
        } else if (e.newValue !== accessToken.value) {
          // Token cambiado en otra pestaña
          console.warn('Token cambiado en otra pestaña, actualizando...');
          accessToken.value = e.newValue;
        }
      }
    });
  };

  // Inicializar al crear el store
  initializeAuth();
  setupStorageListener();

  return {
    usuario,
    accessToken,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    initializeAuth,
    startTokenMonitoring,
    stopTokenMonitoring,
  };
});
