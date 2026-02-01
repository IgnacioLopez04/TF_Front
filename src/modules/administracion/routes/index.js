import { isAuthenticatedGuard } from '@/modules/auth/composable/authGuard';

const administracionRoutes = {
  path: '/administracion',
  component: () =>
    import('@/modules/administracion/Layout/AdministracionView.vue'),
  beforeEnter: [isAuthenticatedGuard],
  children: [
    {
      path: '',
      redirect: '/administracion/usuarios',
    },
    {
      path: 'usuarios',
      name: 'gestion-usuarios',
      component: () =>
        import('@/modules/administracion/views/GestionUsuariosView.vue'),
      meta: {
        requireAuth: true,
        requireLayout: true,
      },
    },
    {
      path: 'pacientes',
      name: 'gestion-pacientes',
      component: () =>
        import('@/modules/administracion/views/GestionPacientesView.vue'),
      meta: {
        requireAuth: true,
        requireLayout: true,
      },
    },
  ],
};

export default administracionRoutes;