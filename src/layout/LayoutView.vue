<template>
  <div class="min-h-screen flex flex-column">
    <!-- Navbar -->
    <nav class="navbar p-3 flex justify-content-between align-items-center w-full border-bottom-1 border-200 shadow-1">
      <div class="flex align-items-center gap-4">
        <div class="flex align-items-center gap-2">
          <div class="logo-avatar flex align-items-center justify-content-center">TF</div>
          <span class="text-xl font-bold text-700">TF Causana</span>
        </div>
        <div class="flex align-items-center gap-3">
          <router-link 
            v-for="item in menuItems" 
            :key="item.to"
            :to="item.to" 
            class="nav-link text-600 hover:text-700 no-underline"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
      <div class="flex align-items-center gap-3">
        <Avatar 
          v-if="authStore.usuario.picture" 
          :image="authStore.usuario.picture" 
          shape="circle"
          size="large"
          v-tooltip.bottom="`${authStore.usuario.nombre} ${authStore.usuario.apellido}`"
        />
        <Avatar 
          v-else
          :label="getInitials(authStore.usuario.nombre, authStore.usuario.apellido)"
          shape="circle"
          size="large"
        />
        <Button @click="logout" text severity="secondary" class="p-button-text">
          <i class="pi pi-sign-out text-lg"></i>
        </Button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 p-4">
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white p-4 text-center">
      <div>
        <p class="m-0 text-sm opacity-80">&copy; 2025 Sistema de Historias Clínicas. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/modules/auth/store';
import { useRouter } from 'vue-router';
import { showSuccess } from '@/composables/useToast';
import { computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const allMenuItems = [
  {
    to: '/pacientes',
    name: 'Pacientes',
    hasAccess: () => true
  },
  {
    to: '/administracion',
    name: 'Administración',
    hasAccess: () => {
      return true;
    }
  }
];

const menuItems = computed(() => {
  return allMenuItems.filter(item => item.hasAccess());
});

const logout = () => {
  authStore.logout();
  showSuccess('Sesión cerrada correctamente');
  router.push('/login');
};

const getInitials = (nombre, apellido) => {
  const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : '';
  const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};
</script>

<style scoped>
/* Solo CSS personalizado cuando PrimeFlex no puede hacerlo */
.logo-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(139, 92, 246, 0.1);
}

.nav-link.text-primary {
  background-color: rgba(139, 92, 246, 0.1);
}
</style>
