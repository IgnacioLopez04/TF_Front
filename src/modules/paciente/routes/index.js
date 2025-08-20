import { isAuthenticatedGuard } from '@/modules/auth/composable/authGuard';

const pacienteRoutes = {
  path: '/pacientes',
  beforeEnter: [isAuthenticatedGuard],
  children: [
    {
      path: '',
      name: 'lista-pacientes',
      component: () =>
        import('@/modules/paciente/views/ListaPacientesView.vue'),
      meta: {
        requireAuth: true,
        requireLayout: true,
      },
    },
    {
      path: 'nuevo',
      name: 'agregar-paciente',
      component: () =>
        import('@/modules/paciente/views/AgregarPacienteView.vue'),
      meta: {
        requireAuth: true,
        requireLayout: true,
      },
    },
    {
      path: ':id',
      name: 'detalle-paciente',
      component: () =>
        import('@/modules/paciente/views/DetallePacienteView.vue'),
      meta: {
        requireAuth: true,
        requireLayout: true,
      },
    },
    {
      path: ':id/nueva-historia',
      name: 'nueva-historia-fisiatica',
      component: () =>
        import('@/modules/paciente/views/NuevaHistoriaFisiaticaView.vue'),
      meta: {
        requireAuth: true,
        requireLayout: true,
      },
    },
  ],
};

export default pacienteRoutes;
