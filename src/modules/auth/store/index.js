import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useAuthState } from './state';
import { useLogin, useLogout, useCheckAuth, refreshSession } from './actions';
import router from '@/router';

const REFRESH_THRESHOLD_MS = 30 * 1000;

export const useAuthStore = defineStore('auth', () => {
  const { usuario, accessToken, tokenExpiresAt } = useAuthState();
  const tokenCheckInterval = ref(null);
  const refreshing = ref(false);

  const handleLogoutAndRedirect = () => {
    logout();
    stopTokenMonitoring();
    if (router.currentRoute.value.name !== 'login') {
      router.push({ name: 'login' });
    }
  };

  const stopTokenMonitoring = () => {
    if (tokenCheckInterval.value) {
      clearInterval(tokenCheckInterval.value);
      tokenCheckInterval.value = null;
    }
  };

  const startTokenMonitoring = () => {
    if (tokenCheckInterval.value) {
      clearInterval(tokenCheckInterval.value);
    }

    tokenCheckInterval.value = setInterval(async () => {
      if (!accessToken.value) {
        console.warn('Token perdido o inválido, cerrando sesión...');
        handleLogoutAndRedirect();
        return;
      }

      const expiresAt = tokenExpiresAt.value;
      if (!expiresAt) {
        return;
      }

      const now = Date.now();
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        console.warn('Token expirado, intentando refresh...');
      }

      if (remaining <= REFRESH_THRESHOLD_MS && !refreshing.value) {
        try {
          refreshing.value = true;
          const data = await refreshSession();
          if (data && data.access_token && data.user) {
            login(
              {
                id_usuario: data.user.id_usuario,
                nombre: data.user.nombre || '',
                apellido: data.user.apellido || '',
                email: data.user.email || '',
                picture: data.user.picture || '',
                id_sucursal: data.user.id_sucursal || null,
                hashId: data.user.hash_id || '',
                id_tipo_usuario: data.user.id_tipo_usuario || null,
              },
              data.access_token,
            );
          } else {
            console.warn('Respuesta inválida al refrescar token, cerrando sesión.');
            handleLogoutAndRedirect();
          }
        } catch (error) {
          console.error('Error al refrescar el token de acceso:', error);
          handleLogoutAndRedirect();
        } finally {
          refreshing.value = false;
        }
      }
    }, 10000);
  };

  const login = useLogin(usuario, accessToken, tokenExpiresAt, startTokenMonitoring);
  const logout = useLogout(usuario, accessToken, tokenExpiresAt, stopTokenMonitoring);
  const checkAuth = useCheckAuth(accessToken, logout);

  const isAuthenticated = computed(() => !!accessToken.value);

  const initializeAuth = () => {};

  initializeAuth();

  watch(
    () => ({ token: accessToken.value, userId: usuario.value?.id_usuario }),
    ({ token, userId }) => {
      const isLoggedOut = !token || userId === null || userId === '';
      if (isLoggedOut && router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' });
      }
    },
    { deep: false, immediate: true },
  );

  return {
    usuario,
    accessToken,
    tokenExpiresAt,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    initializeAuth,
    startTokenMonitoring,
    stopTokenMonitoring,
  };
});
