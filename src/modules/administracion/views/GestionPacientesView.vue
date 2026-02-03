<template>
  <div class="page-container">
    <!-- Header con filtros -->
    <div class="header-container flex justify-content-between align-items-center mb-4">
      <div class="filters-container flex gap-2 align-items-center">
        <div class="flex gap-2 p-3 surface-100 border-round filters-wrapper">
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
      <div class="search-and-action flex gap-2 align-items-center">
        <span class="p-input-icon-left search-input-container">
          <i class="pi pi-search" />
          <InputText 
            v-model="terminoBusqueda"
            placeholder="Buscar por nombre, DNI, prestación..."
            class="search-input"
          />
        </span>
        <Button 
          icon="pi pi-plus"
          label="Nuevo Paciente"
          @click="nuevoPaciente"
          class="p-button-primary create-patient-btn"
          style="background-color: #8b5cf6; border-color: #8b5cf6;"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="administracionStore.loading" class="flex justify-content-center align-items-center" style="height: 60vh;">
      <ProgressSpinner />
    </div>

    <!-- Lista de pacientes -->
    <div v-else class="flex flex-column gap-3 px-3">
      <Card 
        v-for="paciente in pacientesPaginados" 
        :key="paciente.hashId"
        class="patient-card"
      >
        <template #content>
          <div class="patient-card-content flex justify-content-between align-items-center">
            <div class="patient-info-section flex align-items-center gap-3">
              <Avatar 
                :label="paciente.iniciales"
                size="large"
                shape="circle"
                class="patient-avatar"
              />
              <div class="flex flex-column gap-1 patient-details">
                <h3 class="patient-name m-0">{{ paciente.nombre }} {{ paciente.apellido }}</h3>
                <div class="flex gap-4 flex-wrap patient-info-row">
                  <p class="patient-info m-0" v-if="paciente.dni">DNI: {{ paciente.dni }}</p>
                  <p class="patient-info m-0" v-if="paciente.prestacion">Prestación: {{ getPrestacionNombre(paciente.prestacion) }}</p>
                  <p class="patient-info m-0" v-if="paciente.fechaNacimiento">
                    Fecha Nacimiento: {{ formatearFecha(paciente.fechaNacimiento) }}
                  </p>
                </div>
                <div class="flex gap-4 flex-wrap patient-info-row">
                  <p class="patient-info m-0" v-if="paciente.ocupacionActual">
                    Ocupación: {{ paciente.ocupacionActual }}
                  </p>
                  <p class="patient-info m-0" v-if="paciente.barrio || paciente.localidad">
                    Domicilio: {{ getDomicilioCompleto(paciente) }}
                  </p>
                  <p class="patient-info m-0" v-if="paciente.mutual">
                    Obra Social: {{ getMutualNombre(paciente.mutual) }}
                  </p>
                </div>
                <div class="flex gap-3 align-items-center flex-wrap patient-status-row">
                  <span :class="getEstadoBadgeClass(paciente.activo)">
                    {{ paciente.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 align-items-center action-buttons">
              <Button 
                icon="pi pi-pencil"
                class="p-button-text p-button-rounded action-btn edit-btn"
                @click="editarPaciente(paciente)"
                title="Editar paciente"
              />
              <Button 
                v-if="paciente.activo"
                icon="pi pi-times-circle"
                class="p-button-text p-button-rounded action-btn deactivate-btn"
                @click="toggleEstadoPacienteConfirmar(paciente)"
                title="Desactivar paciente"
              />
              <Button 
                v-else
                icon="pi pi-check-circle"
                class="p-button-text p-button-rounded action-btn activate-btn"
                @click="toggleEstadoPacienteConfirmar(paciente)"
                title="Reactivar paciente"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Paginación -->
    <div v-if="!administracionStore.loading && pacientesFiltrados.length > 0" class="flex justify-content-center mt-4">
      <Paginator
        :first="(paginaActual - 1) * elementosPorPagina"
        :rows="elementosPorPagina"
        :totalRecords="pacientesFiltrados.length"
        @page="onPageChange"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      />
    </div>

    <!-- Mensaje cuando no hay pacientes -->
    <div v-if="!administracionStore.loading && !administracionStore.error && pacientesFiltrados.length === 0" class="text-center p-6">
      <i class="pi pi-users" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
      <p>No se encontraron pacientes</p>
    </div>

    <!-- Dialog para editar paciente -->
    <Dialog 
      v-model:visible="modalEditarVisible" 
      header="Editar Paciente"
      :modal="true"
      class="p-fluid dialog-responsive"
      :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <div class="flex flex-column gap-4 form-container">
        <!-- Identificación del Paciente -->
        <div class="surface-card p-4 border-round-lg shadow-1">
          <h3 class="text-xl font-semibold text-purple-600 mb-4">Identificación del Paciente</h3>
          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="nombre" class="block text-900 font-medium mb-2 pt-2">Nombre/s</label>
              <InputText 
                id="nombre"
                v-model="formularioPaciente.nombre" 
                placeholder="Nombre"
                class="w-full"
                :class="{ 'p-invalid': erroresValidacion.nombre }"
                @keypress="(e)=> soloLetras(e)"
              />
              <small v-if="erroresValidacion.nombre" class="p-error">{{ erroresValidacion.nombre }}</small>
            </div>
            <div class="flex-1 form-field">
              <label for="apellido" class="block text-900 font-medium mb-2 pt-2">Apellido/s</label>
              <InputText 
                id="apellido"
                v-model="formularioPaciente.apellido" 
                placeholder="Apellido"
                class="w-full"
                :class="{ 'p-invalid': erroresValidacion.apellido }"
                @keypress="(e)=> soloLetras(e)"
              />
              <small v-if="erroresValidacion.apellido" class="p-error">{{ erroresValidacion.apellido }}</small>
            </div>
          </div>

          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="dni" class="block text-900 font-medium mb-2 pt-2">DNI</label>
              <InputText 
                id="dni"
                v-model="formularioPaciente.dni" 
                placeholder="DNI"
                class="w-full"
                :class="{ 'p-invalid': erroresValidacion.dni }"
                maxlength="8"
                @keypress="(e)=> soloNumeros(e)"
              />
              <small v-if="erroresValidacion.dni" class="p-error">{{ erroresValidacion.dni }}</small>
            </div>
            <div class="flex-1 form-field">
              <label for="prestacion" class="block text-900 font-medium mb-2 pt-2">Prestación</label>
              <Dropdown 
                id="prestacion"
                v-model="formularioPaciente.idPrestacion" 
                :options="prestacionesOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione una prestación"
                class="w-full"
                :filter="true"
                filterPlaceholder="Buscar prestación..."
                :class="{ 'p-invalid': erroresValidacion.prestacion }"
              />
              <small v-if="erroresValidacion.prestacion" class="p-error">{{ erroresValidacion.prestacion }}</small>
            </div>
          </div>

          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="fechaNacimiento" class="block text-900 font-medium mb-2 pt-2">Fecha de Nacimiento</label>
              <Calendar 
                id="fechaNacimiento"
                v-model="formularioPaciente.fechaNacimiento" 
                dateFormat="dd/mm/yy"
                placeholder="Seleccione una fecha"
                class="w-full"
                :showIcon="true"
                :maxDate="fechaMaxima"
              />
            </div>
          </div>
        </div>

        <!-- Ocupación -->
        <div class="surface-card p-4 border-round-lg shadow-1">
          <h3 class="text-xl font-semibold text-purple-600 mb-4">Ocupación</h3>
          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="ocupacionActual" class="block text-900 font-medium mb-2 pt-2">Actual</label>
              <InputText 
                id="ocupacionActual"
                v-model="formularioPaciente.ocupacionActual" 
                placeholder="Ocupación actual"
                class="w-full"
              />
            </div>
            <div class="flex-1 form-field">
              <label for="ocupacionAnterior" class="block text-900 font-medium mb-2 pt-2">Anterior</label>
              <InputText 
                id="ocupacionAnterior"
                v-model="formularioPaciente.ocupacionAnterior" 
                placeholder="Ocupación anterior"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Domicilio Actual -->
        <div class="surface-card p-4 border-round-lg shadow-1">
          <h3 class="text-xl font-semibold text-purple-600 mb-4">Domicilio Actual</h3>
          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="calle" class="block text-900 font-medium mb-2 pt-2">Calle</label>
              <InputText 
                id="calle"
                v-model="formularioPaciente.calle" 
                placeholder="Calle"
                class="w-full"
                :class="{ 'p-invalid': erroresValidacion.calle }"
              />
              <small v-if="erroresValidacion.calle" class="p-error">{{ erroresValidacion.calle }}</small>
            </div>
            <div class="flex-1 form-field">
              <label for="numero" class="block text-900 font-medium mb-2 pt-2">Número</label>
              <InputText 
                id="numero"
                v-model="formularioPaciente.numero" 
                placeholder="Número"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="pisoDepto" class="block text-900 font-medium mb-2 pt-2">Piso / Departamento</label>
              <InputText 
                id="pisoDepto"
                v-model="formularioPaciente.pisoDepto" 
                placeholder="Piso/Depto"
                class="w-full"
              />
            </div>
            <div class="flex-1 form-field">
              <label for="barrio" class="block text-900 font-medium mb-2 pt-2">Barrio</label>
              <InputText 
                id="barrio"
                v-model="formularioPaciente.barrio" 
                placeholder="Barrio"
                class="w-full"
                :class="{ 'p-invalid': erroresValidacion.barrio }"
              />
              <small v-if="erroresValidacion.barrio" class="p-error">{{ erroresValidacion.barrio }}</small>
            </div>
          </div>

          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="provincia" class="block text-900 font-medium mb-2 pt-2">Provincia</label>
              <Dropdown
                id="provincia"
                v-model="formularioPaciente.provincia"
                :options="provinciasOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione una provincia"
                class="w-full"
                @change="(e) => cargarCiudadesHandler(e.value)"
                :showClear="true"
                :filter="true"
                :class="{ 'p-invalid': erroresValidacion.provincia }"
              />
              <small v-if="erroresValidacion.provincia" class="p-error">{{ erroresValidacion.provincia }}</small>
            </div>
            <div class="flex-1 form-field">
              <label for="localidad" class="block text-900 font-medium mb-2 pt-2">Localidad</label>
              <Dropdown
                id="localidad"
                v-model="formularioPaciente.localidad"
                :options="ciudadesOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione una localidad"
                class="w-full"
                :showClear="true"
                :filter="true"
                :disabled="!formularioPaciente.provincia"
                :class="{ 'p-invalid': erroresValidacion.localidad }"
              />
              <small v-if="erroresValidacion.localidad" class="p-error">{{ erroresValidacion.localidad }}</small>
            </div>
          </div>

          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="conQuienVive" class="block text-900 font-medium mb-2 pt-2">Con quien vive</label>
              <InputText 
                id="conQuienVive"
                v-model="formularioPaciente.conQuienVive" 
                placeholder="Con quien vive"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Obra Social / Mutual -->
        <div class="surface-card p-4 border-round-lg shadow-1">
          <h3 class="text-xl font-semibold text-purple-600 mb-4">Obra Social / Mutual</h3>
          <div class="flex gap-3 form-row">
            <div class="flex-1 form-field">
              <label for="mutual" class="block text-900 font-medium mb-2 pt-2">Obra Social / Mutual</label>
              <Dropdown 
                id="mutual"
                v-model="formularioPaciente.mutual" 
                :options="mutualesOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione obra social/mutual"
                class="w-full"
                :filter="true"
                filterPlaceholder="Buscar obra social..."
                :class="{ 'p-invalid': erroresValidacion.mutual }"
              />
              <small v-if="erroresValidacion.mutual" class="p-error">{{ erroresValidacion.mutual }}</small>
            </div>
            <div class="flex-1 form-field">
              <label for="numeroAfiliado" class="block text-900 font-medium mb-2 pt-2">Número de afiliado</label>
              <InputText 
                id="numeroAfiliado"
                v-model="formularioPaciente.numeroAfiliado" 
                placeholder="Número de afiliado"
                class="w-full"
                :class="{ 'p-invalid': erroresValidacion.numeroAfiliado }"
              />
              <small v-if="erroresValidacion.numeroAfiliado" class="p-error">{{ erroresValidacion.numeroAfiliado }}</small>
            </div>
          </div>
        </div>

        <!-- Tutores (solo para menores de edad) -->
        <div v-if="esMenorDeEdad" class="surface-card p-4 border-round-lg shadow-1">
          <div class="flex align-items-center justify-content-between mb-3">
            <h3 class="text-xl font-semibold text-purple-600 m-0">Tutores del paciente menor de edad</h3>
            <Button
              type="button"
              @click="agregarTutor"
              class="p-button-sm"
              severity="secondary"
              label="Agregar Tutor"
              icon="pi pi-plus"
            />
          </div>
          <div v-for="(tutor, index) in formularioPaciente.tutores" :key="index" class="surface-ground p-4 border-round my-4">
            <div class="flex align-items-center justify-content-between mb-3">
              <h4 class="text-lg font-medium text-purple-600 m-0">Tutor {{ index + 1 }}</h4>
              <Button
                type="button"
                icon="pi pi-trash"
                @click="eliminarTutor(index)"
                class="p-button-sm"
                severity="danger"
                text
              />
            </div>
            <div class="flex gap-3 form-row">
              <div class="flex-1 form-field">
                <label :for="`nombreTutor${index}`" class="block text-900 font-medium mb-2 pt-2">Nombre completo</label>
                <InputText
                  :id="`nombreTutor${index}`"
                  v-model="tutor.nombre"
                  placeholder="Nombre completo del tutor"
                  class="w-full"
                />
              </div>
              <div class="flex-1 form-field">
                <label :for="`dniTutor${index}`" class="block text-900 font-medium mb-2 pt-2">DNI</label>
                <InputText
                  :id="`dniTutor${index}`"
                  v-model="tutor.dni"
                  placeholder="DNI del tutor"
                  class="w-full"
                />
              </div>
            </div>
            <div class="flex gap-3 form-row">
              <div class="flex-1 form-field">
                <label :for="`fechaNacimientoTutor${index}`" class="block text-900 font-medium mb-2 pt-2">Fecha de nacimiento</label>
                <Calendar
                  :id="`fechaNacimientoTutor${index}`"
                  v-model="tutor.fechaNacimiento"
                  placeholder="Seleccione fecha"
                  dateFormat="dd/mm/yy"
                  :showIcon="true"
                  class="w-full"
                />
              </div>
              <div class="flex-1 form-field">
                <label :for="`ocupacionTutor${index}`" class="block text-900 font-medium mb-2 pt-2">Ocupación</label>
                <InputText
                  :id="`ocupacionTutor${index}`"
                  v-model="tutor.ocupacion"
                  placeholder="Ocupación"
                  class="w-full"
                />
              </div>
            </div>
            <div class="flex gap-3 form-row">
              <div class="flex-1 form-field">
                <label :for="`lugarNacimientoTutor${index}`" class="block text-900 font-medium mb-2 pt-2">Lugar de nacimiento</label>
                <InputText
                  :id="`lugarNacimientoTutor${index}`"
                  v-model="tutor.lugarNacimiento"
                  placeholder="Lugar de nacimiento"
                  class="w-full"
                />
              </div>
              <div class="flex-1 form-field">
                <label :for="`relacionTutor${index}`" class="block text-900 font-medium mb-2 pt-2">Relación</label>
                <InputText
                  :id="`relacionTutor${index}`"
                  v-model="tutor.relacion"
                  placeholder="Relación"
                  class="w-full"
                />
              </div>
              <div class="flex-1 form-field">
                <label :for="`conviveTutor${index}`" class="block text-900 font-medium mb-2 pt-2">Convive</label>
                <Dropdown
                  :id="`conviveTutor${index}`"
                  v-model="tutor.convive"
                  :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button 
          label="Cancelar" 
          icon="pi pi-times"
          :disabled="guardandoPaciente"
          @click="cerrarModalEditar"
          class="p-button-text"
        />
        <Button 
          label="Guardar" 
          icon="pi pi-check"
          :loading="guardandoPaciente"
          :disabled="guardandoPaciente"
          @click="guardarPaciente"
          class="p-button-primary"
        />
      </template>
    </Dialog>

    <!-- Dialog de confirmación para activar/desactivar -->
    <Dialog
      v-model:visible="modalConfirmarVisible"
      :header="accionTexto ? 'Desactivar paciente' : 'Reactivar paciente'"
      :modal="true"
      class="p-fluid dialog-responsive"
    >
      <p>¿Está seguro que desea {{ accionTexto }} al paciente {{ identificadorPaciente }}?</p>
      <template #footer>
        <Button 
          label="Cancelar" 
          icon="pi pi-times"
          :disabled="actualizandoEstadoPaciente"
          @click="modalConfirmarVisible = false"
          class="p-button-text"
        />
        <Button 
          label="Confirmar" 
          icon="pi pi-check"
          :loading="actualizandoEstadoPaciente"
          :disabled="actualizandoEstadoPaciente"
          @click="toggleEstadoPaciente(pacienteSeleccionado)"
          class="p-button-primary"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAdministracionStore } from '../store';
import { showError, showSuccess } from '@/composables/useToast';
import { useValidations } from '@/composables/useValidations';

const router = useRouter();
const administracionStore = useAdministracionStore();

const modalConfirmarVisible = ref(false);
const accionTexto = ref('');
const identificadorPaciente = ref('');
const guardandoPaciente = ref(false);
const actualizandoEstadoPaciente = ref(false);

const filtroActivo = ref('todos');
const filtros = ref([
  { id: 'todos', label: 'Todos' },
  { id: 'activos', label: 'Activos' },
  { id: 'inactivos', label: 'Inactivos' }
]);

const terminoBusqueda = ref('');

// Estado para paginación
const paginaActual = ref(1);
const elementosPorPagina = ref(5);

const modalEditarVisible = ref(false);
const pacienteSeleccionado = ref(null);
const formularioPaciente = ref({
  nombre: '',
  apellido: '',
  dni: '',
  idPrestacion: null,
  prestacion: null,
  fechaNacimiento: null,
  ocupacionActual: '',
  ocupacionAnterior: '',
  calle: '',
  numero: '',
  pisoDepto: '',
  barrio: '',
  localidad: null,
  provincia: null,
  conQuienVive: '',
  mutual: null,
  numeroAfiliado: '',
  tutores: [],
  activo: true,
});

const erroresValidacion = ref({
  nombre: '',
  apellido: '',
  dni: '',
  prestacion: '',
  calle: '',
  barrio: '',
  provincia: '',
  localidad: '',
  mutual: '',
  numeroAfiliado: '',
});

const fechaMaxima = computed(() => {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() - 1);
  return hoy;
});

const prestacionesOptions = computed(() => administracionStore.prestaciones || []);
const mutualesOptions = computed(() => administracionStore.mutuales || []);
const provinciasOptions = computed(() => administracionStore.provincias || []);
const ciudadesOptions = computed(() => administracionStore.ciudades || []);

const esMenorDeEdad = computed(() => {
  const fechaNacimiento = formularioPaciente.value.fechaNacimiento;
  if (!fechaNacimiento) return false;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad < 18;
});

const pacientesFiltrados = computed(() => {
  let pacientes = administracionStore.pacientes;
  
  // Filtrar por estado
  if (filtroActivo.value === 'activos') {
    pacientes = pacientes.filter(paciente => paciente.activo === true);
  } else if (filtroActivo.value === 'inactivos') {
    pacientes = pacientes.filter(paciente => paciente.activo === false);
  }
  
  // Filtrar por término de búsqueda
  if (terminoBusqueda.value && terminoBusqueda.value.trim() !== '') {
    const termino = terminoBusqueda.value.trim().toLowerCase();
    pacientes = pacientes.filter(paciente => {
      const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase();
      const dni = paciente.dni ? paciente.dni.toString().toLowerCase() : '';
      const prestacion = getPrestacionNombre(paciente.prestacion).toLowerCase();
      
      return nombreCompleto.includes(termino) ||
             dni.includes(termino) ||
             prestacion.includes(termino);
    });
  }
  
  return pacientes;
});

// Computed para pacientes paginados
const pacientesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina.value;
  const fin = inicio + elementosPorPagina.value;
  return pacientesFiltrados.value.slice(inicio, fin);
});

const { validatePatientForm, clearErrors } = useValidations();

watch(esMenorDeEdad, (nuevoValor) => {
  if (nuevoValor && formularioPaciente.value.tutores && formularioPaciente.value.tutores.length === 0) {
    agregarTutor();
  }
});

// Resetear página cuando cambia el término de búsqueda
watch(terminoBusqueda, () => {
  paginaActual.value = 1;
});

const cambiarFiltro = (filtro) => {
  filtroActivo.value = filtro;
  paginaActual.value = 1; // Resetear a la primera página al cambiar filtro
};

const onPageChange = (event) => {
  paginaActual.value = Math.floor(event.first / elementosPorPagina.value) + 1;
  elementosPorPagina.value = event.rows;
  // Scroll al inicio de la lista
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

const getPrestacionNombre = (id) => {
  if (!id) return 'N/A';
  const prestacion = administracionStore.prestaciones.find(p => p.id === id);
  return prestacion ? prestacion.name : id;
};

const getMutualNombre = (id) => {
  if (!id) return 'N/A';
  if (!administracionStore.mutuales || !Array.isArray(administracionStore.mutuales)) {
    return id; // Retornar el ID si mutuales no está disponible todavía
  }
  const mutual = administracionStore.mutuales.find(m => m.id === id);
  return mutual ? mutual.name : id;
};

const getDomicilioCompleto = (paciente) => {
  const parts = [];
  if (paciente.calle) parts.push(paciente.calle);
  if (paciente.numero) parts.push(paciente.numero);
  if (paciente.barrio) parts.push(paciente.barrio);
  if (paciente.localidad) {
    const ciudad = administracionStore.ciudades.find(c => c.id === paciente.localidad);
    if (ciudad) parts.push(ciudad.name);
  }
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

const soloLetras = (event) => {
  const isPrintable = event.key && event.key.length === 1;
  const isAllowed = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(event.key);
  if (!isPrintable || !isAllowed) {
    event.preventDefault();
  }
};

const soloNumeros = (event) => {
  const isPrintable = event.key && event.key.length === 1;
  const isAllowed = /^\d+$/.test(event.key);
  if (!isPrintable || !isAllowed) {
    event.preventDefault();
  }
};

const nuevoPaciente = () => {
  router.push('/pacientes/nuevo');
};

const editarPaciente = async (paciente) => {
  try {
    // Cargar datos completos del paciente
    const pacienteCompleto = await administracionStore.obtenerPaciente(paciente.hashId);
    
    pacienteSeleccionado.value = pacienteCompleto;
    
    // Cargar ciudades si hay provincia
    if (pacienteCompleto.provincia) {
      await administracionStore.obtenerCiudades(pacienteCompleto.provincia);
    }
    
    formularioPaciente.value = {
      nombre: pacienteCompleto.nombre || '',
      apellido: pacienteCompleto.apellido || '',
      dni: pacienteCompleto.dni || '',
      idPrestacion: pacienteCompleto.idPrestacion != null ? pacienteCompleto.idPrestacion : null,
      prestacion: pacienteCompleto.prestacion || null,
      fechaNacimiento: pacienteCompleto.fechaNacimiento ? new Date(pacienteCompleto.fechaNacimiento) : null,
      ocupacionActual: pacienteCompleto.ocupacionActual || '',
      ocupacionAnterior: pacienteCompleto.ocupacionAnterior || '',
      calle: pacienteCompleto.calle || '',
      numero: pacienteCompleto.numero || '',
      pisoDepto: pacienteCompleto.pisoDepto || '',
      barrio: pacienteCompleto.barrio || '',
      localidad: pacienteCompleto.localidad != null ? String(pacienteCompleto.localidad) : null,
      provincia: pacienteCompleto.provincia != null ? String(pacienteCompleto.provincia) : null,
      conQuienVive: pacienteCompleto.conQuienVive || '',
      mutual: pacienteCompleto.mutual || null,
      numeroAfiliado: pacienteCompleto.numeroAfiliado || '',
      tutores: pacienteCompleto.tutores ? [...pacienteCompleto.tutores] : [],
      activo: pacienteCompleto.activo !== undefined ? pacienteCompleto.activo : true,
    };
    
    // Limpiar errores
    erroresValidacion.value = {
      nombre: '',
      apellido: '',
      dni: '',
      prestacion: '',
      calle: '',
      barrio: '',
      provincia: '',
      localidad: '',
      mutual: '',
      numeroAfiliado: '',
    };
    
    modalEditarVisible.value = true;
  } catch (error) {
    showError('Error al cargar los datos del paciente');
  }
};

const cerrarModalEditar = () => {
  modalEditarVisible.value = false;
  pacienteSeleccionado.value = null;
  formularioPaciente.value = {
    nombre: '',
    apellido: '',
    dni: '',
    idPrestacion: null,
    prestacion: null,
    fechaNacimiento: null,
    ocupacionActual: '',
    ocupacionAnterior: '',
    calle: '',
    numero: '',
    pisoDepto: '',
    barrio: '',
    localidad: null,
    provincia: null,
    conQuienVive: '',
    mutual: null,
    numeroAfiliado: '',
    tutores: [],
    activo: true,
  };
  erroresValidacion.value = {
    nombre: '',
    apellido: '',
    dni: '',
    prestacion: '',
    calle: '',
    barrio: '',
    provincia: '',
    localidad: '',
    mutual: '',
    numeroAfiliado: '',
  };
  administracionStore.ciudades = [];
};

const guardarPaciente = async () => {
  try {
    clearErrors();
    
    if (!validatePatientForm(formularioPaciente.value)) {
      showError('Por favor, corrija los errores en el formulario');
      return;
    }

    guardandoPaciente.value = true;

    // Preparar datos para enviar
    const datosPaciente = { ...formularioPaciente.value };
    
    // Formatear fecha solo como YYYY-MM-DD sin hora
    if (datosPaciente.fechaNacimiento) {
      const fecha = new Date(datosPaciente.fechaNacimiento);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      datosPaciente.fechaNacimiento = `${year}-${month}-${day}`;
    }

    await administracionStore.editarPaciente(pacienteSeleccionado.value.hashId, datosPaciente);
    showSuccess(`Paciente ${formularioPaciente.value.nombre} ${formularioPaciente.value.apellido} actualizado correctamente`);
    
    cerrarModalEditar();
  } catch (error) {
    if (error.response?.status === 400) {
      showError('Error al actualizar el paciente. Por favor, verifique los datos ingresados.');
      return;
    }
    showError('Error al editar el paciente');
  } finally {
    guardandoPaciente.value = false;
  }
};

const toggleEstadoPacienteConfirmar = (paciente) => {
  modalConfirmarVisible.value = true;
  pacienteSeleccionado.value = paciente;
  accionTexto.value = paciente.activo ? 'desactivar' : 'reactivar';
  identificadorPaciente.value = `${paciente.nombre} ${paciente.apellido}`;
};

const toggleEstadoPaciente = async (paciente) => {
  try {
    actualizandoEstadoPaciente.value = true;
    const nuevoEstado = !paciente.activo;
    await administracionStore.actualizarEstadoPaciente(paciente.hashId, nuevoEstado);
    const mensaje = nuevoEstado 
      ? `Paciente ${paciente.nombre} ${paciente.apellido} activado correctamente`
      : `Paciente ${paciente.nombre} ${paciente.apellido} desactivado correctamente`;
    showSuccess(mensaje);
    modalConfirmarVisible.value = false;
  } catch (error) {
    const mensaje = paciente.activo
      ? 'Error al desactivar el paciente'
      : 'Error al activar el paciente';
    showError(mensaje);
    modalConfirmarVisible.value = false;
  } finally {
    actualizandoEstadoPaciente.value = false;
  }
};

const agregarTutor = () => {
  if (!formularioPaciente.value.tutores) {
    formularioPaciente.value.tutores = [];
  }
  formularioPaciente.value.tutores.push({
    nombre: '',
    dni: '',
    fechaNacimiento: null,
    ocupacion: '',
    lugarNacimiento: '',
    convive: true,
    relacion: '',
  });
};

const eliminarTutor = (index) => {
  if (formularioPaciente.value.tutores) {
    formularioPaciente.value.tutores = formularioPaciente.value.tutores.filter((_, i) => i !== index);
  }
};

const cargarCiudadesHandler = async (idProvincia) => {
  try {
    administracionStore.ciudades = [];
    formularioPaciente.value.localidad = null;
    
    if (idProvincia) {
      await administracionStore.obtenerCiudades(idProvincia);
    }
  } catch (error) {
    console.error('Error al cargar ciudades:', error);
    showError('Hubo problemas al cargar las ciudades');
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      administracionStore.obtenerPacientes(),
      administracionStore.obtenerPrestaciones(),
      administracionStore.obtenerMutuales(),
      administracionStore.obtenerProvincias(),
    ]);
  } catch (error) {
    showError('No es posible obtener los datos de pacientes');
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
  max-width: 100%;
}

/* Contenedor de filtros */
.surface-100 {
  background-color: white!important;
  border: 1px solid #e5e7eb !important;
}

/* Campo de búsqueda */
.search-input-container {
  position: relative;
}

.search-input-container :deep(.p-inputtext) {
  width: 300px;
  padding-left: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.search-input-container :deep(.p-inputtext:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.2);
}

.search-input-container :deep(.pi-search) {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  z-index: 1;
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

/* Botones de acción */
.action-buttons {
  flex-shrink: 0;
}

.action-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn :deep(.p-button-icon) {
  font-size: 1.25rem;
}

.edit-btn {
  color: #8b5cf6 !important;
}

.edit-btn:hover {
  background-color: #e9d5ff !important;
  color: #7c3aed !important;
}

.activate-btn {
  color: #10b981 !important;
}

.activate-btn:hover {
  background-color: #d1fae5 !important;
  color: #059669 !important;
}

.deactivate-btn {
  color: #ef4444 !important;
}

.deactivate-btn:hover {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
}

/* Estilos para el Dialog de edición */
:deep(.p-dialog-header) {
  background-color: #f8f7ff;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog .p-dialog-header .p-dialog-title) {
  color: #8b5cf6;
  font-weight: bold;
}

/* Diálogos responsive - Desktop */
.dialog-responsive :deep(.p-dialog) {
  width: 90vw;
  max-width: 800px;
  margin: 0 auto;
}

.surface-card {
  background: white !important;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.surface-ground {
  background-color: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
}

/* Responsive */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  /* Header responsive */
  .header-container {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .filters-container {
    width: 100%;
    justify-content: center;
  }

  .filters-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .search-and-action {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .search-input-container {
    width: 100%;
  }

  .search-input-container :deep(.p-inputtext) {
    width: 100%;
  }

  .create-patient-btn {
    width: 100%;
  }

  /* Tarjetas de pacientes responsive */
  .patient-card :deep(.p-card-body) {
    padding: 1rem;
  }

  .patient-card-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .patient-info-section {
    width: 100%;
    flex-wrap: wrap;
  }

  .patient-details {
    flex: 1;
    min-width: 0;
  }

  .patient-name {
    font-size: 1.1rem;
  }

  .patient-info-row {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .patient-info {
    font-size: 0.8rem;
    word-break: break-word;
  }

  .patient-status-row {
    gap: 0.5rem;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-end;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .patient-avatar :deep(.p-avatar) {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }

  /* Diálogos responsive - Mobile */
  .dialog-responsive :deep(.p-dialog) {
    width: 95vw !important;
    max-width: 95vw !important;
    margin: 1rem auto;
  }

  .dialog-responsive :deep(.p-dialog-content) {
    padding: 1rem;
  }

  .dialog-responsive :deep(.p-dialog-header) {
    padding: 1rem;
  }

  .dialog-responsive :deep(.p-dialog-header .p-dialog-title) {
    font-size: 1.1rem;
  }

  .dialog-responsive :deep(.p-dialog-footer) {
    padding: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dialog-responsive :deep(.p-dialog-footer .p-button) {
    width: 100%;
    margin: 0;
  }

  /* Formularios responsive */
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .form-field {
    width: 100%;
  }
}
</style>

