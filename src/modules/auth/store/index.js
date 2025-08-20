import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useAuthState } from './state';
import { useLogin, useLogout, useCheckAuth } from './actions';

export const useAuthStore = defineStore('auth', () => {
  const { usuario, accessToken } = useAuthState();

  const login = useLogin(usuario, accessToken);
  const logout = useLogout(usuario, accessToken);
  const checkAuth = useCheckAuth(accessToken, logout);

  const isAuthenticated = computed(() => !!accessToken.value);

  // Verificar autenticación al inicio
  const initializeAuth = () => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      accessToken.value = token;
    }
  };

  // Inicializar al crear el store
  initializeAuth();

  return {
    usuario,
    accessToken,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    initializeAuth,
  };
});
