<template>
  <div class="page-container p-4 border-round">
    <!-- Header Section -->
    <div class="mb-4">
      <h1 class="text-4xl font-bold text-purple-600 m-0 mb-2">Agregar Nuevo Paciente</h1>
      <p class="text-lg text-gray-600">
        Complete los datos del paciente para dar de alta en el sistema y crear su historia clínica.
      </p>
    </div>

    <form @submit.prevent="guardarPaciente" class="space-y-6 px-3">
      <!-- Sección de Identificación del Paciente -->
      <div class="surface-card p-4 border-round-lg shadow-1 mb-3">
        <h3 class="text-xl font-semibold text-purple-600 mb-4">Identificación del Paciente</h3>
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre/s
            </label>
            <InputText
              id="nombre"
              v-model="pacienteStore.paciente.nombre"
              placeholder="Ingrese el nombre del paciente"
              class="w-full"
              :class="{ 'p-invalid': !isValid.nombre && errors.nombre }"
            />
            <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
              Apellido/s
            </label>
            <InputText
              id="apellido"
              v-model="pacienteStore.paciente.apellido"
              placeholder="Ingrese el apellido del paciente"
              class="w-full"
              :class="{ 'p-invalid': !isValid.apellido && errors.apellido }"
            />
            <small v-if="errors.apellido" class="p-error">{{ errors.apellido }}</small>
          </div>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="dni" class="block text-sm font-medium text-gray-700 mb-2">
              DNI
            </label>
            <InputText
              id="dni"
              v-model="pacienteStore.paciente.dni"
              placeholder="Ingrese el DNI"
              class="w-full"
              maxlength="8"
              @keypress="(e) => soloNumeros(e)"
              :class="{ 'p-invalid': !isValid.dni && errors.dni }"
            />
            <small v-if="errors.dni" class="p-error">{{ errors.dni }}</small>
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="prestacion" class="block text-sm font-medium text-gray-700 mb-2">
              Prestación
            </label>
            <Dropdown
              id="prestacion"
              v-model="pacienteStore.paciente.prestacion"
              :options="prestaciones"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione una prestación"
              class="w-full"
              :loading="isLoading.prestaciones"
              :disabled="isLoading.prestaciones"
              :class="{ 'p-invalid': !isValid.prestacion && errors.prestacion }"
            />
            <small v-if="errors.prestacion" class="p-error">{{ errors.prestacion }}</small>
            <small v-if="isLoading.prestaciones" class="text-blue-600">Cargando prestaciones...</small>
          </div>
        </div>
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="fechaNacimiento" class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento
            </label>
            <Calendar
              id="fechaNacimiento"
              v-model="pacienteStore.paciente.fechaNacimiento"
              placeholder="Seleccione fecha"
              dateFormat="dd/mm/yy"
              :showIcon="true"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Sección de Ocupación -->
      <div class="surface-card p-4 border-round-lg shadow-1 mb-3">
        <h3 class="text-xl font-semibold text-purple-600 mb-4">Ocupación</h3>
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="ocupacionActual" class="block text-sm font-medium text-gray-700 mb-2">Actual</label>
            <InputText
              id="ocupacionActual"
              v-model="pacienteStore.paciente.ocupacionActual"
              placeholder="Ingrese la ocupación actual"
              class="w-full"
              :class="{ 'p-invalid': !isValid.ocupacionActual && errors.ocupacionActual }"
            />
            <small v-if="errors.ocupacionActual" class="p-error">{{ errors.ocupacionActual }}</small>
          </div>

          <div class="col-12 md:col-6 mb-3">
            <label for="ocupacionAnterior" class="block text-sm font-medium text-gray-700 mb-2">Anterior</label>
            <InputText
              id="ocupacionAnterior"
              v-model="pacienteStore.paciente.ocupacionAnterior"
              placeholder="Ingrese la ocupación anterior"
              class="w-full"
              :class="{ 'p-invalid': !isValid.ocupacionAnterior && errors.ocupacionAnterior }"
            />
            <small v-if="errors.ocupacionAnterior" class="p-error">{{ errors.ocupacionAnterior }}</small>
          </div>
        </div>
      </div>

      <!-- Sección de Domicilio Actual -->
      <div class="surface-card p-4 border-round-lg shadow-1 mb-3">
        <h3 class="text-xl font-semibold text-purple-600 mb-4">Domicilio Actual</h3>
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="calle" class="block text-sm font-medium text-gray-700 mb-2">
              Calle
            </label>
            <InputText
              id="calle"
              v-model="pacienteStore.paciente.calle"
              placeholder="Ej: Calle Falsa"
              class="w-full"
              :class="{ 'p-invalid': !isValid.calle && errors.calle }"
            />
            <small v-if="errors.calle" class="p-error">{{ errors.calle }}</small>
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="numero" class="block text-sm font-medium text-gray-700 mb-2">
              Número
            </label>
            <InputText
              id="numero"
              v-model="pacienteStore.paciente.numero"
              placeholder="Ej: 123"
              class="w-full"
              :class="{ 'p-invalid': !isValid.numero && errors.numero }"
            />
            <small v-if="errors.numero" class="p-error">{{ errors.numero }}</small>
          </div>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="pisoDepto" class="block text-sm font-medium text-gray-700 mb-2">Piso / Departamento</label>
            <InputText
              id="pisoDepto"
              v-model="pacienteStore.paciente.pisoDepto"
              placeholder="Ej: 1A, etc"
              class="w-full"
            />
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="barrio" class="block text-sm font-medium text-gray-700 mb-2">Barrio</label>
            <InputText
              id="barrio"
              v-model="pacienteStore.paciente.barrio"
              placeholder="Ej: Alta Córdoba"
              class="w-full"
              :class="{ 'p-invalid': !isValid.barrio && errors.barrio }"
            />
            <small v-if="errors.barrio" class="p-error">{{ errors.barrio }}</small>
          </div>
        </div>

        <div class="grid">

          <div class="col-12 md:col-6 mb-3">
            <label for="provincia" class="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
            <Select
              id="provincia"
              v-model="pacienteStore.paciente.provincia"
              :options="provincias"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione una provincia"
              class="w-full"
              @change="cargarCiudadesHandler(pacienteStore.paciente.provincia)"
              :showClear="true"
              :filter="true"
              :loading="isLoading.provincias"
              :disabled="isLoading.provincias"
              :class="{ 'p-invalid': !isValid.provincia && errors.provincia }"
            />
            <small v-if="errors.provincia" class="p-error">{{ errors.provincia }}</small>
            <small v-if="isLoading.provincias" class="text-blue-600">Cargando provincias...</small>
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="localidad" class="block text-sm font-medium text-gray-700 mb-2">
              Localidad
            </label>
            <Select
              id="localidad"
              v-model="pacienteStore.paciente.localidad"
              :options="ciudades"
              optionLabel="name"
              optionValue="id"
              placeholder="Ej: Córdoba Capital"
              class="w-full"
              :showClear="true"
              :filter="true"
              :disabled="!pacienteStore.paciente.provincia || isLoading.ciudades"
              :loading="isLoading.ciudades"
              :class="{ 'p-invalid': !isValid.localidad && errors.localidad }"
            />
            <small v-if="errors.localidad" class="p-error">{{ errors.localidad }}</small>
            <small v-if="isLoading.ciudades" class="text-blue-600">Cargando ciudades...</small>
          </div>
        </div>
        
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="conQuienVive" class="block text-sm font-medium text-gray-700 mb-2">Con quien vive</label>
            <InputText
              id="conQuienVive"
              v-model="pacienteStore.paciente.conQuienVive"
              placeholder="Ej: Madre, padre, etc"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Sección de Mutual -->
      <div class="surface-card p-4 border-round-lg shadow-1 mb-3">
        <h3 class="text-xl font-semibold text-purple-600 mb-4">Obra Social / Mutual</h3>
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="mutual" class="block text-sm font-medium text-gray-700 mb-2">Obra Social / Mutual</label>
            <Dropdown
              id="mutual"
              v-model="pacienteStore.paciente.mutual"
              :options="mutuales"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione la obra social / mutual"
              class="w-full"
              :loading="isLoading.mutuales"
              :disabled="isLoading.mutuales"
              :class="{ 'p-invalid': !isValid.mutual && errors.mutual }"
            />
            <small v-if="errors.mutual" class="p-error">{{ errors.mutual }}</small>
            <small v-if="isLoading.mutuales" class="text-blue-600">Cargando mutuales...</small>
          </div>

          <div class="col-12 md:col-6 mb-3">
            <label for="numeroAfiliado" class="block text-sm font-medium text-gray-700 mb-2">Número de afiliado / beneficiario</label>
            <InputText
              id="numeroAfiliado"
              v-model="pacienteStore.paciente.numeroAfiliado"
              placeholder="Ej: 1234567890"
              class="w-full"
              :class="{ 'p-invalid': !isValid.numeroAfiliado && errors.numeroAfiliado }"
            />
            <small v-if="errors.numeroAfiliado" class="p-error">{{ errors.numeroAfiliado }}</small>
          </div>
        </div>
      </div>

      <!-- Sección de Tutores (solo para menores de edad) -->
      <div v-if="esMenorDeEdad" class="surface-card p-4 border-round-lg shadow-1 mb-3">
        <div class="flex align-items-center justify-content-between">
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
        <div v-for="(tutor, index) in pacienteStore.tutores" :key="index" class="surface-ground p-4 border-round my-4">
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
          <div class="grid">
            <div class="col-12 md:col-6 mb-3">
              <label :for="`nombreTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo del tutor
              </label>
              <InputText
                :id="`nombreTutor${index}`"
                v-model="tutor.nombre"
                placeholder="Ej: Juan Pérez"
                class="w-full"
                :class="{ 'p-invalid': !isValid[`tutor${index}Name`] && errors[`tutor${index}Name`] }"
                @blur="validateTutorField(index, 'nombre', 'Name')"
              />
              <small v-if="errors[`tutor${index}Name`]" class="p-error">{{ errors[`tutor${index}Name`] }}</small>
            </div>
            <div class="col-12 md:col-6 mb-3">
              <label :for="`dniTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                DNI del tutor
              </label>
              <InputText
                :id="`dniTutor${index}`"
                v-model="tutor.dni"
                placeholder="Ej: 1234567890"
                class="w-full"
                maxlength="8"
                @keypress="(e) => soloNumeros(e)"
                :class="{ 'p-invalid': !isValid[`tutor${index}DNI`] && errors[`tutor${index}DNI`] }"
                @blur="validateTutorField(index, 'dni', 'DNI')"
              />
              <small v-if="errors[`tutor${index}DNI`]" class="p-error">{{ errors[`tutor${index}DNI`] }}</small>
            </div>
          </div>

          <div class="grid">
            <div class="col-12 md:col-6 mb-3">
              <label :for="`fechaNacimientoTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de nacimiento
              </label>
              <Calendar
                :id="`fechaNacimientoTutor${index}`"
                v-model="tutor.fechaNacimiento"
                placeholder="Seleccione fecha"
                dateFormat="dd/mm/yy"
                :showIcon="true"
                class="w-full"
                :class="{ 'p-invalid': !isValid[`tutor${index}BirthDate`] && errors[`tutor${index}BirthDate`] }"
                @blur="validateTutorField(index, 'fechaNacimiento', 'BirthDate')"
            />
              <small v-if="errors[`tutor${index}BirthDate`]" class="p-error">{{ errors[`tutor${index}BirthDate`] }}</small>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <label :for="`ocupacionTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Ocupación
              </label>
              <InputText
                :id="`ocupacionTutor${index}`"
                v-model="tutor.ocupacion"
                placeholder="Ej: Profesor"
                class="w-full"
                :class="{ 'p-invalid': !isValid[`tutor${index}Occupation`] && errors[`tutor${index}Occupation`] }"
                @blur="validateTutorField(index, 'ocupacion', 'Occupation')"
              />
              <small v-if="errors[`tutor${index}Occupation`]" class="p-error">{{ errors[`tutor${index}Occupation`] }}</small>
            </div>
          </div>

          <div class="grid">
            <div class="col-12 md:col-6 mb-3">
              <label :for="`lugarNacimientoTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Lugar de nacimiento
              </label>
              <InputText
                :id="`lugarNacimientoTutor${index}`"
                v-model="tutor.lugarNacimiento"
                placeholder="Ej: Córdoba Capital"
                class="w-full"
                :class="{ 'p-invalid': !isValid[`tutor${index}BirthPlace`] && errors[`tutor${index}BirthPlace`] }"
                @blur="validateTutorField(index, 'lugarNacimiento', 'BirthPlace')"
              />
              <small v-if="errors[`tutor${index}BirthPlace`]" class="p-error">{{ errors[`tutor${index}BirthPlace`] }}</small>
            </div>
            <div class="col-12 md:col-6 mb-3">
              <label :for="`relacionTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Relación
              </label>
              <InputText
                :id="`relacionTutor${index}`"
                v-model="tutor.relacion"
                placeholder="Ej: Especifique la relación"
                class="w-full"
              />
            </div>
            <div class="col-12 md:col-6 mb-3">
              <label :for="`conviveTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Convive
              </label>
              <Select
                :id="`conviveTutor${index}`"
                v-model="tutor.convive"
                :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione si convive"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-column md:flex-row gap-3 justify-content-end">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          @click="cancelar"
          class="p-button-outlined p-button-secondary"
          :class="{ 'w-full md:w-auto': true }"
        />
        <Button
          type="submit"
          label="Guardar Paciente"
          icon="pi pi-check"
          class="p-button-primary"
          :loading="isSubmitting"
          :class="{ 'w-full md:w-auto': true }"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccess, showError } from '@/composables/useToast';
import { usePacienteStore } from '../store';
import { useValidations } from '@/composables/useValidations';

const router = useRouter();
const isSubmitting = ref(false);
const pacienteStore = usePacienteStore();

// Inicializar arrays vacíos para evitar errores de renderizado
const provincias = ref([]);
const ciudades = ref([]);
const prestaciones = ref([]);
const mutuales = ref([]);

// Estado de carga para cada tipo de dato
const isLoading = ref({
  provincias: false,
  ciudades: false,
  prestaciones: false,
  mutuales: false
});

const esMenorDeEdad = computed(() => {
  const fechaNacimiento = pacienteStore.paciente.fechaNacimiento;
  if (!fechaNacimiento) return false;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  if (edad < 18) return true;
  return false;
});


const { 
  errors, 
  isValid, 
  validatePatientForm, 
  clearErrors,
  validateTutorName,
  validateTutorDNI,
  validateTutorBirthDate,
  validateTutorOccupation,
  validateTutorBirthPlace
} = useValidations();

onMounted(async () => {
  try {
    await Promise.all([
      provincias.value = await pacienteStore.obtenerProvincias(),
      prestaciones.value = await pacienteStore.obtenerPrestaciones(),
      mutuales.value = await pacienteStore.obtenerMutuales()
    ]);
  } catch (error) {
    showError('Hubo problemas al cargar las opciones');
  }
});

watch(esMenorDeEdad, (nuevoValor) => {
  if (nuevoValor && pacienteStore.paciente && pacienteStore.paciente.tutores && pacienteStore.paciente.tutores.length === 0) {
    agregarTutor();
  }
});

const agregarTutor = () => {
  if (pacienteStore.paciente) {
    pacienteStore.tutores.push({
      nombre: '',
      dni: '',
      fechaNacimiento: null,
      ocupacion: '',
      lugarNacimiento: '',
      convive: true,
      relacion: '',
    });
  }
};

const eliminarTutor = (index) => {
  if (pacienteStore.tutores) {
    pacienteStore.tutores = pacienteStore.tutores.filter((_, i) => i !== index);
  }
};

const soloNumeros = (event) => {
  const isPrintable = event.key && event.key.length === 1;
  const isAllowed = /^\d+$/.test(event.key);
  if (!isPrintable || !isAllowed) {
    event.preventDefault();
  }
};

// Función para validar campos del tutor en tiempo real
const validateTutorField = (tutorIndex, fieldName, validationType) => {
  const tutor = pacienteStore.tutores[tutorIndex];
  if (!tutor) return;

  let isValid = false;
  
  switch (validationType) {
    case 'Name':
      isValid = validateTutorName(tutor[fieldName], tutorIndex);
      break;
    case 'DNI':
      isValid = validateTutorDNI(tutor[fieldName], tutorIndex);
      break;
    case 'BirthDate':
      isValid = validateTutorBirthDate(tutor[fieldName], tutorIndex);
      break;
    case 'Occupation':
      isValid = validateTutorOccupation(tutor[fieldName], tutorIndex);
      break;
    case 'BirthPlace':
      isValid = validateTutorBirthPlace(tutor[fieldName], tutorIndex);
      break;
  }
  
  return isValid;
};


const guardarPaciente = async () => {
  if (!pacienteStore.paciente) {
    showError('El formulario no está inicializado correctamente');
    return;
  }

  clearErrors();
  if (!validatePatientForm(pacienteStore.paciente)) {
    showError('Por favor, corrija los errores en el formulario antes de continuar');
    return;
  }

  isSubmitting.value = true;
  try {
    await pacienteStore.crearPaciente({ ...pacienteStore.paciente, tutores: pacienteStore.tutores });
    showSuccess('Paciente guardado exitosamente');

    pacienteStore.limpiarPaciente();
    pacienteStore.limpiarTutores();
    router.push('/pacientes');
  } catch (error) {
    showError('Error al guardar el paciente. Intente nuevamente.');
  } finally {
    isSubmitting.value = false;
  }
};

const cancelar = () => {
  if (pacienteStore.paciente) {
    pacienteStore.limpiarPaciente();
  }
  clearErrors();
  router.push('/pacientes');
};

const cargarCiudadesHandler = async (idProvincia) => {
  try {
    ciudades.value = [];
    if (pacienteStore.paciente) {
      pacienteStore.paciente.localidad = null;
    }
    
    if (idProvincia) {
      ciudades.value = await pacienteStore.obtenerCiudades(idProvincia);
    }
  } catch (error) {
    console.error('Error al cargar ciudades:', error);
    showError('Hubo problemas al cargar las ciudades');
    ciudades.value = [];
  }
};


</script>

<style scoped>
/* Colores personalizados para mantener consistencia con ListaPacientesView */
:deep(.p-button-primary) {
  background-color: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
  color: white !important;
}

:deep(.p-button-primary:hover) {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  transition: all 0.2s ease;
}

:deep(.p-button-outlined.p-button-secondary) {
  background-color: white !important;
  border-color: #8b5cf6 !important;
  color: #8b5cf6 !important;
}

:deep(.p-button-outlined.p-button-secondary:hover) {
  background-color: #d8b4fe !important;
  border-color: #7c3aed !important;
  color: #7c3aed !important;
  transition: all 0.2s ease;
}

:deep(.p-button-secondary) {
  background-color: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
  color: white !important;
}

:deep(.p-button-secondary:hover) {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  transition: all 0.2s ease;
}

/* Fondo de la página */
.page-container {
  background-color: #f8f7ff;
  min-height: 100vh;
  max-width: 70%; 
}

/* Tarjetas de formulario */
.surface-card {
  background: white !important;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

/* Fondo para sección de tutores */
.surface-ground {
  background-color: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
}

/* Estilos para inputs */
:deep(.p-inputtext) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

:deep(.p-inputtext:focus) {
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

/* Estilos para dropdowns */
:deep(.p-dropdown) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

:deep(.p-dropdown:focus) {
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

/* Estilos para calendario */
:deep(.p-calendar) {
  border-radius: 8px;
}

:deep(.p-calendar .p-inputtext) {
  border-radius: 8px;
}

/* Transiciones suaves */
* {
  transition: all 0.2s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .flex.flex-column.md\:flex-row {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .w-full.md\:w-auto {
    width: 100% !important;
  }
}

/* Estilos para campos con errores */
:deep(.p-invalid) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

:deep(.p-invalid:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

/* Estilos para mensajes de error */
.p-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

/* Animación para mensajes de error */
.p-error {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
