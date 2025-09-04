import { useAuthStore } from '../store';
import { showError } from '@/composables/useToast';

export const isAuthenticatedGuard = (to, from, next) => {
  const authStore = useAuthStore();

  // Verificar si hay token en sessionStorage
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    // No hay token, limpiar estado y redirigir
    authStore.logout();
    showError('Sesión expirada. Por favor, inicie sesión nuevamente.');
    next({ name: 'login' });
    return;
  }

  // Verificar si el token en sessionStorage coincide con el del store
  if (token !== authStore.accessToken) {
    // Token desincronizado, actualizar store
    authStore.accessToken = token;
  }

  // Verificar autenticación usando el método del store
  const authCheck = authStore.checkAuth();

  if (authCheck.isAuthenticated) {
    next(); // Permitir acceso si está autenticado
  } else {
    // Token inválido o expirado
    showError('Sesión expirada. Por favor, inicie sesión nuevamente.');
    next({ name: 'login' });
  }
};
