import { isAuthenticatedGuard } from '@/modules/auth/composable/authGuard';

export default {
  path: '/',
  name: 'auth',
  children: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/views/LoginView.vue'),
      meta: { requireLayout: false },
    },
    {
      path: '/inicio',
      name: 'inicio',
      component: () => import('@/modules/auth/views/InicioView.vue'),
      meta: { requireLayout: true },
      beforeEnter: [isAuthenticatedGuard],
    },
  ],
};
