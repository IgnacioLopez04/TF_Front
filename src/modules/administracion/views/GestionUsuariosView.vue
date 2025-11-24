<template>
  <div class="page-container p-4">
    <!-- Header con filtros -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div class="flex gap-2 p-3 surface-100 border-round">
        <Button 
          v-for="filtro in filtros"
          :key="filtro.id"
          :label="filtro.label" 
          :class="{ 'p-button-outlined': filtroActivo !== filtro.id, 'active-filter-btn': filtroActivo === filtro.id }"
          @click="cambiarFiltro(filtro.id)"
          class="border-round filter-btn"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="administracionStore.loading" class="flex justify-content-center align-items-center" style="height: 60vh;">
      <ProgressSpinner />
    </div>

    <!-- Error state -->
    <div v-else-if="administracionStore.error" class="p-4">
      <Message severity="error" :closable="false">
        {{ administracionStore.error }}
      </Message>
    </div>

    <!-- Lista de usuarios -->
    <div v-else class="flex flex-column gap-3 px-3">
      <Card 
        v-for="usuario in usuariosFiltrados" 
        :key="usuario.hashId"
        class="user-card"
      >
        <template #content>
          <div class="flex justify-content-between align-items-center">
            <div class="flex align-items-center gap-3">
              <Avatar 
                :label="getInitials(usuario.nombre, usuario.apellido)"
                size="large"
                shape="circle"
                class="user-avatar"
              />
              <div class="flex flex-column gap-1">
                <h3 class="user-name m-0">{{ usuario.nombre }} {{ usuario.apellido }}</h3>
                <div class="flex gap-4 flex-wrap">
                  <p class="user-info m-0" v-if="usuario.dni">DNI: {{ usuario.dni }}</p>
                  <p class="user-info m-0" v-if="usuario.email">Email: {{ usuario.email }}</p>
                  <p class="user-info m-0" v-if="usuario.fechaNacimiento">
                    Fecha Nacimiento: {{ formatearFecha(usuario.fechaNacimiento) }}
                  </p>
                </div>
                <div class="flex gap-3 align-items-center flex-wrap">
                  <span :class="getEstadoBadgeClass(usuario.activo)">
                    {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                  <p class="user-info m-0" v-if="usuario.idTipoUsuario">
                    Tipo: {{ usuario.idTipoUsuario }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Mensaje cuando no hay usuarios -->
    <div v-if="!administracionStore.loading && !administracionStore.error && usuariosFiltrados.length === 0" class="text-center p-6">
      <i class="pi pi-users" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
      <p>No se encontraron usuarios</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdministracionStore } from '../store';
import { showError } from '@/composables/useToast';

const administracionStore = useAdministracionStore();

const filtroActivo = ref('todos');
const filtros = ref([
  { id: 'todos', label: 'Todos' },
  { id: 'activos', label: 'Activos' },
  { id: 'inactivos', label: 'Inactivos' }
]);

// Computed para filtrar usuarios
const usuariosFiltrados = computed(() => {
  if (filtroActivo.value === 'todos') {
    return administracionStore.usuarios;
  }
  
  if (filtroActivo.value === 'activos') {
    return administracionStore.usuarios.filter(usuario => usuario.activo === true);
  }
  
  if (filtroActivo.value === 'inactivos') {
    return administracionStore.usuarios.filter(usuario => usuario.activo === false);
  }
  
  return administracionStore.usuarios;
});

// Métodos
const cambiarFiltro = (filtro) => {
  filtroActivo.value = filtro;
};

const getInitials = (nombre, apellido) => {
  const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : '';
  const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return fecha.toString();
  }
};

const getEstadoBadgeClass = (activo) => {
  return activo 
    ? 'status-badge status-active' 
    : 'status-badge status-inactive';
};

onMounted(async () => {
  try {
    await administracionStore.obtenerUsuarios();
  } catch (error) {
    showError('No es posible obtener los usuarios');
  }
});
</script>

<style scoped>
/* Colores personalizados */
:deep(.active-filter-btn) {
  background-color: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
  color: white !important;
}

:deep(.p-button-outlined) {
  background-color: white !important;
  border-color: #8b5cf6 !important;
  color: #8b5cf6 !important;
}

/* Efectos hover para botones de filtro */
:deep(.filter-btn.p-button-outlined:hover) {
  background-color: #d8b4fe !important;
  border-color: #7c3aed !important;
  color: #7c3aed !important;
  transition: all 0.2s ease;
}

:deep(.filter-btn.active-filter-btn:hover) {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  transition: all 0.2s ease;
}

/* Transición suave para todos los botones de filtro */
:deep(.filter-btn) {
  transition: all 0.2s ease;
}

/* Fondo de la página */
.page-container {
  background-color: #f8f7ff;
  min-height: 100vh;
}

/* Contenedor de filtros */
.surface-100 {
  background-color: white!important;
  border: 1px solid #e5e7eb !important;
}

/* Tarjetas de usuarios */
.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.user-card :deep(.p-card-body) {
  padding: 1.5rem;
}

/* Avatar del usuario */
.user-avatar :deep(.p-avatar) {
  background-color: #e9d5ff !important;
  color: #8b5cf6 !important;
  font-weight: bold;
  font-size: 1.5rem;
  width: 4rem;
  height: 4rem;
}

/* Nombre del usuario */
.user-name {
  color: #8b5cf6;
  font-weight: bold;
  font-size: 1.25rem;
}

/* Información del usuario */
.user-info {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Badge de estado */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Responsive */
@media (max-width: 768px) {
  .flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .surface-100 {
    justify-content: center;
  }
}
</style>
