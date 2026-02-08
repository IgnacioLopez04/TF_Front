import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import authRoutes from '@/modules/auth/routes';
import pacienteRoutes from '@/modules/paciente/routes';
import administracionRoutes from '@/modules/administracion/routes';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    ...authRoutes,
  },
  {
    ...pacienteRoutes,
  },
  {
    ...administracionRoutes,
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
