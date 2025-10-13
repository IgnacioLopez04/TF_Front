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
      <Button 
        label="Agregar Paciente" 
        icon="pi pi-user-plus"
        @click="agregarPaciente"
        class="active-filter-btn border-round"
      />
    </div>

    <div v-if="isLoadingPacientes" class="flex justify-content-center align-items-center" style="height: 60vh;">
      <ProgressSpinner />
    </div>
    <!-- Lista de pacientes -->
    <div v-else class="flex flex-column gap-3 px-3">
      <Card 
        v-for="paciente in pacientesFiltrados" 
        :key="paciente.dni"
        class="patient-card"
      >
        <template #content>
          <div class="flex justify-content-between align-items-center">
            <div class="flex align-items-center gap-3">
              <Avatar 
                :label="paciente.iniciales"
                size="large"
                shape="circle"
                class="patient-avatar"
              />
              <div class="flex flex-column gap-1">
                <h3 class="patient-name m-0">{{ paciente.nombre }} {{ paciente.apellido }}</h3>
                <div class="flex gap-4">
                  <p class="patient-info m-0">DNI: {{ paciente.dni }}</p>
                  <p class="patient-info m-0">Últ. Modificación: {{ paciente.ultimaModificacion ? formatearFecha(paciente.ultimaModificacion) : 'N/A' }}</p>
                </div>
                <p class="patient-location m-0">{{ paciente.prestacion }}</p>
              </div>
            </div>
            <Button 
              label="Ver" 
              @click="verPaciente(paciente.hash_id)"
              class="view-button border-round"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Mensaje cuando no hay pacientes -->
    <div v-if="pacientesFiltrados.length === 0" class="text-center p-6">
      <i class="pi pi-users" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
      <p>No se encontraron pacientes</p>
    </div>
  </div>
</template>

<script setup>
import { showError } from '@/composables/useToast';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePacienteStore } from '../store';


const pacienteStore = usePacienteStore();

const router = useRouter();
const filtroActivo = ref('todos');
const isLoadingPacientes = ref(false);
const pacientes = ref([]);
const filtros = ref([{ id: 'todos', label: 'Todos' }]);

// Computed para filtrar pacientes
const pacientesFiltrados = computed(() => {
  if (filtroActivo.value === 'todos') {
    return pacientes.value;
  }
  
  const filtroSeleccionado = filtros.value.find(filtro => filtro.id === filtroActivo.value);
  if (!filtroSeleccionado) return pacientes.value;
  
  return pacientes.value.filter(paciente => 
    paciente.prestacion === filtroSeleccionado.label
  );
});

// Métodos
const cambiarFiltro = (filtro) => {
  filtroActivo.value = filtro;
};

const agregarPaciente = () => {
  router.push('/pacientes/nuevo');
};

const verPaciente = (id) => {
  // Navegar a la vista detalle del paciente
  router.push(`/pacientes/${id}`);
};

const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

onMounted(async () => {
  isLoadingPacientes.value = true;
  try{
    await pacienteStore.obtenerPrestaciones();
    filtros.value.push(...pacienteStore.opcionesPrestacion.map((prestacion) => {
      return {
        id: prestacion.id,
        label: prestacion.name
      }
    }));
    await pacienteStore.obtenerPacientes();
    pacientes.value = pacienteStore.pacientes;
  }catch(error){
    showError('No es posible obtener los pacientes');
  }finally{
    isLoadingPacientes.value = false;
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

/* Tarjetas de pacientes */
.patient-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.patient-card :deep(.p-card-body) {
  padding: 1.5rem;
}

/* Avatar del paciente */
.patient-avatar :deep(.p-avatar) {
  background-color: #e9d5ff !important;
  color: #8b5cf6 !important;
  font-weight: bold;
  font-size: 1.5rem;
  width: 4rem;
  height: 4rem;
}

/* Nombre del paciente */
.patient-name {
  color: #8b5cf6;
  font-weight: bold;
  font-size: 1.25rem;
}

/* Información del paciente */
.patient-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.patient-location {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Botón Ver */
.view-button {
  background-color: #e9d5ff !important;
  border-color: #e9d5ff !important;
  color: #8b5cf6 !important;
  font-weight: 500;
}

.view-button:hover {
  background-color: #d8b4fe !important;
  border-color: #d8b4fe !important;
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
  
  .floating-action-btn {
    right: 1rem;
  }
}
</style>