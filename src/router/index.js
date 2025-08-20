import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import authRoutes from '@/modules/auth/routes';
import pacienteRoutes from '@/modules/paciente/routes';

const routes = [
  {
    path: '/',
    redirect: '/inicio',
  },
  {
    ...authRoutes,
  },
  {
    ...pacienteRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
];

const dev = window.location.hostname === 'localhost:8080';

const router = createRouter({
  history: dev ? createWebHashHistory() : createWebHistory('/'),
  routes,
});

export default router;
