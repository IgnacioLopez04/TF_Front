<template>
  <div class="admin-layout flex min-h-screen">
    <!-- Botón hamburguesa (solo visible en móvil) -->
    <Button 
      icon="pi pi-bars"
      class="mobile-menu-btn p-button-text p-button-rounded"
      @click="toggleSidebar"
      aria-label="Abrir menú"
    />
    
    <!-- Overlay oscuro (solo visible en móvil cuando sidebar está abierto) -->
    <div 
      v-if="sidebarVisible && isMobile"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      class="admin-sidebar bg-white border-right-1 border-200"
      :class="{ 'sidebar-mobile-hidden': !sidebarVisible && isMobile }"
    >
      <div class="sidebar-header p-4 border-bottom-1 border-200">
        <div class="flex justify-content-between align-items-center">
          <h2 class="text-2xl font-bold text-color-primary m-0">Administración</h2>
          <Button 
            icon="pi pi-times"
            class="p-button-text p-button-rounded p-button-sm sidebar-close-btn"
            @click="closeSidebar"
            aria-label="Cerrar menú"
          />
        </div>
      </div>
      <nav class="sidebar-menu p-3">
        <router-link 
          v-for="item in adminMenuItems" 
          :key="item.to"
          :to="item.to"
          class="menu-item flex align-items-center gap-2 p-3 mb-2 border-round text-600 no-underline"
          active-class="menu-item-active"
          @click="handleMenuClick"
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
import { computed, ref, onMounted, onUnmounted } from 'vue';
import Button from 'primevue/button';

// Estado para controlar visibilidad del sidebar en móvil
const sidebarVisible = ref(false);
const isMobile = ref(false);

// Función para detectar si estamos en móvil
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  // En desktop, el sidebar siempre debe estar visible
  if (!isMobile.value) {
    sidebarVisible.value = true;
  }
};

// Función para abrir/cerrar sidebar
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

// Función para cerrar sidebar
const closeSidebar = () => {
  sidebarVisible.value = false;
};

// Cerrar sidebar al hacer click en un item del menú (solo en móvil)
const handleMenuClick = () => {
  if (isMobile.value) {
    closeSidebar();
  }
};

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

// Inicializar y escuchar cambios de tamaño de ventana
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.admin-layout {
  min-height: calc(100vh - 0px);
  position: relative;
}

/* Botón hamburguesa (solo visible en móvil) */
.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background-color: #8b5cf6 !important;
  color: white !important;
  width: 3rem;
  height: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.mobile-menu-btn:hover {
  background-color: #7c3aed !important;
}

/* Overlay oscuro */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.admin-sidebar {
  width: 280px;
  min-height: 100%;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.sidebar-header {
  background-color: #f8f7ff;
}

.sidebar-close-btn {
  display: none;
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
  transition: margin-left 0.3s ease;
}

/* Estilos responsive para móvil */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(0);
  }

  .admin-sidebar.sidebar-mobile-hidden {
    transform: translateX(-100%);
  }

  .sidebar-close-btn {
    display: block;
  }

  .admin-content {
    margin-left: 0;
    width: 100%;
  }
}

/* Estilos para desktop */
@media (min-width: 769px) {
  .admin-sidebar {
    position: relative;
    transform: translateX(0) !important;
  }

  .admin-content {
    margin-left: 0;
  }
}
</style>

