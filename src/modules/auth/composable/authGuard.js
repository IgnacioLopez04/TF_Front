import { useAuthStore } from '../store';
import { showError } from '@/composables/useToast';

export const isAuthenticatedGuard = (to, from, next) => {
  const authStore = useAuthStore();
  const authCheck = authStore.checkAuth();

  if (authCheck.isAuthenticated) {
    next();
  } else {
    authStore.logout();
    showError('Sesión expirada. Por favor, inicie sesión nuevamente.');
    next({ name: 'login' });
  }
};
