import { useAuthStore } from '../store';

export const isAuthenticatedGuard = (to, from, next) => {
  const authStore = useAuthStore();

  // Verificar si hay token en sessionStorage
  const token = sessionStorage.getItem('accessToken');

  if (token && authStore.isAuthenticated) {
    next(); // Permitir acceso si está autenticado
  } else {
    next({ name: 'login' }); // Redirigir al login si no está autenticado
  }
};
