<template>
  <div class="admin-layout flex min-h-screen">
    <!-- Sidebar -->
    <aside class="admin-sidebar bg-white border-right-1 border-200">
      <div class="sidebar-header p-4 border-bottom-1 border-200">
        <h2 class="text-2xl font-bold text-color-primary m-0">Administración</h2>
      </div>
      <nav class="sidebar-menu p-3">
        <router-link 
          v-for="item in adminMenuItems" 
          :key="item.to"
          :to="item.to"
          class="menu-item flex align-items-center gap-2 p-3 mb-2 border-round text-600 no-underline"
          active-class="menu-item-active"
        >
          <i v-if="item.icon" :class="item.icon" class="text-lg"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>
    </aside>
    
    <!-- Contenido -->
    <main class="admin-content flex-1 p-4" style="background-color: #f8f7ff;">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Items del menú de administración
const allAdminMenuItems = [
  {
    to: '/administracion/usuarios',
    name: 'Gestión de Usuarios',
    icon: 'pi pi-users',
    hasAccess: () => true
  }
];

// Filtrar items según permisos
const adminMenuItems = computed(() => {
  return allAdminMenuItems.filter(item => item.hasAccess());
});
</script>

<style scoped>
.admin-layout {
  min-height: calc(100vh - 0px);
}

.admin-sidebar {
  width: 280px;
  min-height: 100%;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  background-color: #f8f7ff;
}

.menu-item {
  transition: all 0.2s ease;
  color: #6b7280;
}

.menu-item:hover {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.menu-item-active {
  background-color: rgba(139, 92, 246, 0.15) !important;
  color: #8b5cf6 !important;
  font-weight: 600;
  border-left: 3px solid #8b5cf6;
}

.admin-content {
  min-height: calc(100vh - 0px);
  overflow-y: auto;
}
</style>

