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
              Nombre Completo <span class="text-red-500">*</span>
            </label>
            <InputText
              id="nombre"
              v-model="formData.nombre"
              placeholder="Ingrese el nombre completo"
              :class="{ 'p-invalid': errors.nombre }"
              class="w-full"
            />
            <small v-if="errors.nombre" class="text-red-500 text-sm">{{ errors.nombre }}</small>
          </div>

          <div class="col-12 md:col-6 mb-3">
            <label for="dni" class="block text-sm font-medium text-gray-700 mb-2">
              DNI <span class="text-red-500">*</span>
            </label>
            <InputText
              id="dni"
              v-model="formData.dni"
              placeholder="Ingrese el DNI"
              :class="{ 'p-invalid': errors.dni }"
              class="w-full"
            />
            <small v-if="errors.dni" class="text-red-500 text-sm">{{ errors.dni }}</small>
          </div>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="prestacion" class="block text-sm font-medium text-gray-700 mb-2">
              Prestación <span class="text-red-500">*</span>
            </label>
            <Dropdown
              id="prestacion"
              v-model="formData.prestacion"
              :options="opcionesPrestacion"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione una prestación"
              :class="{ 'p-invalid': errors.prestacion }"
              class="w-full"
            />
            <small v-if="errors.prestacion" class="text-red-500 text-sm">{{ errors.prestacion }}</small>
          </div>

          <div class="col-12 md:col-6 mb-3">
            <label for="fechaNacimiento" class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento <span class="text-red-500">*</span>
            </label>
            <Calendar
              id="fechaNacimiento"
              v-model="formData.fechaNacimiento"
              placeholder="Seleccione fecha"
              :class="{ 'p-invalid': errors.fechaNacimiento }"
              dateFormat="dd/mm/yy"
              :showIcon="true"
              class="w-full"
            />
            <small v-if="errors.fechaNacimiento" class="text-red-500 text-sm">{{ errors.fechaNacimiento }}</small>
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
              v-model="formData.ocupacionActual"
              placeholder="Ingrese la ocupación actual"
              class="w-full"
            />
          </div>

          <div class="col-12 md:col-6 mb-3">
            <label for="ocupacionAnterior" class="block text-sm font-medium text-gray-700 mb-2">Anterior</label>
            <InputText
              id="ocupacionAnterior"
              v-model="formData.ocupacionAnterior"
              placeholder="Ingrese la ocupación anterior"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Sección de Domicilio Actual -->
      <div class="surface-card p-4 border-round-lg shadow-1 mb-3">
        <h3 class="text-xl font-semibold text-purple-600 mb-4">Domicilio Actual</h3>
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="calle" class="block text-sm font-medium text-gray-700 mb-2">
              Calle y Número <span class="text-red-500">*</span>
            </label>
            <InputText
              id="calle"
              v-model="formData.calle"
              placeholder="Ej: Calle Falsa"
              :class="{ 'p-invalid': errors.calle }"
              class="w-full"
            />
            <small v-if="errors.calle" class="text-red-500 text-sm">{{ errors.calle }}</small>
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="pisoDepto" class="block text-sm font-medium text-gray-700 mb-2">Piso / Departamento</label>
            <InputText
              id="pisoDepto"
              v-model="formData.pisoDepto"
              placeholder="Ej: 1A, etc"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid">

          <div class="col-12 md:col-6 mb-3">
            <label for="provincia" class="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
            <Select
              id="provincia"
              v-model="formData.provincia"
              :options="provincias"
              optionLabel="nombre"
              optionValue="id"
            />
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="localidad" class="block text-sm font-medium text-gray-700 mb-2">
              Localidad <span class="text-red-500">*</span>
            </label>
            <InputText
              id="localidad"
              v-model="formData.localidad"
              placeholder="Ej: Córdoba Capital"
              :class="{ 'p-invalid': errors.localidad }"
              class="w-full"
            />
            <small v-if="errors.localidad" class="text-red-500 text-sm">{{ errors.localidad }}</small>
          </div>
        </div>
        
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="barrio" class="block text-sm font-medium text-gray-700 mb-2">Barrio</label>
            <InputText
              id="barrio"
              v-model="formData.barrio"
              placeholder="Ej: Alta Córdoba"
              class="w-full"
            />
          </div>
          <div class="col-12 md:col-6 mb-3">
            <label for="conQuienVive" class="block text-sm font-medium text-gray-700 mb-2">Con quien vive</label>
            <InputText
              id="conQuienVive"
              v-model="formData.conQuienVive"
              placeholder="Ej: Madre, padre, etc"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Sección de Mutual -->
      <div class="surface-card p-4 border-round-lg shadow-1 mb-3">
        <h3 class="text-xl font-semibold text-purple-600 mb-4">Mutual / Obra Social</h3>
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <label for="mutual" class="block text-sm font-medium text-gray-700 mb-2">Mutual</label>
            <Dropdown
              id="mutual"
              v-model="formData.mutual"
              :options="opcionesMutual"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione una mutual"
              class="w-full"
            />
          </div>

          <div class="col-12 md:col-6 mb-3">
            <label for="numeroAfiliado" class="block text-sm font-medium text-gray-700 mb-2">Número de afiliado / beneficiario</label>
            <InputText
              id="numeroAfiliado"
              v-model="formData.numeroAfiliado"
              placeholder="Ej: 1234567890"
              class="w-full"
            />
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

        <div v-for="(tutor, index) in formData.tutores" :key="index" class="surface-ground p-4 border-round my-4">
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
                Nombre completo del tutor <span class="text-red-500">*</span>
              </label>
              <InputText
                :id="`nombreTutor${index}`"
                v-model="tutor.nombre"
                placeholder="Ej: Juan Pérez"
                :class="{ 'p-invalid': errors[`tutores.${index}.nombre`] }"
                class="w-full"
              />
              <small v-if="errors[`tutores.${index}.nombre`]" class="text-red-500 text-sm">{{ errors[`tutores.${index}.nombre`] }}</small>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <label :for="`dniTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                DNI del tutor <span class="text-red-500">*</span>
              </label>
              <InputText
                :id="`dniTutor${index}`"
                v-model="tutor.dni"
                placeholder="Ej: 1234567890"
                :class="{ 'p-invalid': errors[`tutores.${index}.dni`] }"
                class="w-full"
              />
              <small v-if="errors[`tutores.${index}.dni`]" class="text-red-500 text-sm">{{ errors[`tutores.${index}.dni`] }}</small>
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
            />
            </div>

            <div class="col-12 md:col-6 mb-3">
              <label :for="`ocupacionTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Ocupación <span class="text-red-500">*</span>
              </label>
              <InputText
                :id="`ocupacionTutor${index}`"
                v-model="tutor.ocupacion"
                placeholder="Ej: Profesor"
                :class="{ 'p-invalid': errors[`tutores.${index}.ocupacion`] }"
                class="w-full"
              />
              <small v-if="errors[`tutores.${index}.ocupacion`]" class="text-red-500 text-sm">{{ errors[`tutores.${index}.ocupacion`] }}</small>
            </div>
          </div>

          <div class="grid">
            <div class="col-12 md:col-6 mb-3">
              <label :for="`lugarNacimientoTutor${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                Lugar de nacimiento <span class="text-red-500">*</span>
              </label>
              <InputText
                :id="`lugarNacimientoTutor${index}`"
                v-model="tutor.lugarNacimiento"
                placeholder="Ej: Córdoba Capital"
                :class="{ 'p-invalid': errors[`tutores.${index}.lugarNacimiento`] }"
                class="w-full"
              />
              <small v-if="errors[`tutores.${index}.lugarNacimiento`]" class="text-red-500 text-sm">{{ errors[`tutores.${index}.lugarNacimiento`] }}</small>
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
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccess, showError } from '@/composables/useToast';
import { provincias as cargarProvincias, ciudades as cargarCiudades } from '../store/actions';

const provincias = ref([]);
const ciudades = ref([]);

const router = useRouter();
const isSubmitting = ref(false);
// Datos del formulario
const formData = reactive({
  nombre: '',
  dni: '',
  prestacion: null,
  fechaNacimiento: null,
  ocupacionActual: '',
  ocupacionAnterior: '',
  calle: '',
  numero: '',
  pisoDepto: '',
  barrio: '',
  localidad: '',
  provincia: '',
  conQuienVive: '',
  mutual: null,
  numeroAfiliado: '',
  tutores: []
});

// Errores de validación
const errors = reactive({
  nombre: '',
  dni: '',
  prestacion: '',
  fechaNacimiento: '',
  calle: '',
  numero: '',
  localidad: ''
});

onMounted(async () => {
  try{
    provincias.value = await cargarProvincias();
    console.log(provincias.value);
  }catch(error){ 
    console.error('Error al cargar las provincias:', error);
    showError('Hubo problemas al cargar las provincias');
  }
});

// Computed para determinar si es menor de edad (menos de 18 años)
const esMenorDeEdad = computed(() => {
  if (!formData.fechaNacimiento) return false;
  
  const fechaNacimiento = new Date(formData.fechaNacimiento);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    return edad - 1 < 18;
  }
  
  return edad < 18;
});

// Watcher para agregar automáticamente un tutor cuando se detecte que es menor de edad
watch(esMenorDeEdad, (nuevoValor) => {
  if (nuevoValor && formData.tutores.length === 0) {
    agregarTutor();
  }
});

// Métodos para manejar tutores
const agregarTutor = () => {
  formData.tutores.push({
    nombre: '',
    dni: '',
    fechaNacimiento: null,
    ocupacion: '',
    lugarNacimiento: ''
  });
};

const eliminarTutor = (index) => {
  formData.tutores.splice(index, 1);
};

// Opciones para los dropdowns
const opcionesPrestacion = [
  { label: 'Hogar', value: 'hogar' },
  { label: 'Centro de Día', value: 'centro-dia' },
  { label: 'Centro de Rehabilitación', value: 'centro-rehabilitacion' }
];

const opcionesMutual = [
  { label: 'OSDE', value: 'osde' },
  { label: 'Swiss Medical', value: 'swiss-medical' },
  { label: 'Medicus', value: 'medicus' },
  { label: 'Galeno', value: 'galeno' },
  { label: 'Otro', value: 'otro' }
];

// Validación del formulario
const validarFormulario = () => {
  let isValid = true;
  
  // Limpiar errores previos
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  // Validar campos requeridos
  if (!formData.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
    isValid = false;
  }

  if (!formData.dni.trim()) {
    errors.dni = 'El DNI es obligatorio';
    isValid = false;
  }

  if (!formData.prestacion) {
    errors.prestacion = 'Debe seleccionar una prestación';
    isValid = false;
  }

  if (!formData.fechaNacimiento) {
    errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    isValid = false;
  }

  if (!formData.calle.trim()) {
    errors.calle = 'La calle es obligatoria';
    isValid = false;
  }

  if (!formData.numero.trim()) {
    errors.numero = 'El número es obligatorio';
    isValid = false;
  }

  if (!formData.localidad.trim()) {
    errors.localidad = 'La localidad es obligatoria';
    isValid = false;
  }

  // Validar tutores si es menor de edad
  if (esMenorDeEdad.value && formData.tutores.length === 0) {
    showError('Para pacientes menores de edad, debe agregar al menos un tutor');
    isValid = false;
  }

  // Validar campos de tutores
  formData.tutores.forEach((tutor, index) => {
    if (!tutor.nombre.trim()) {
      errors[`tutores.${index}.nombre`] = 'El nombre del tutor es obligatorio';
      isValid = false;
    }
    if (!tutor.dni.trim()) {
      errors[`tutores.${index}.dni`] = 'El DNI del tutor es obligatorio';
      isValid = false;
    }
    if (!tutor.ocupacion.trim()) {
      errors[`tutores.${index}.ocupacion`] = 'La ocupación del tutor es obligatoria';
      isValid = false;
    }
    if (!tutor.lugarNacimiento.trim()) {
      errors[`tutores.${index}.lugarNacimiento`] = 'El lugar de nacimiento del tutor es obligatorio';
      isValid = false;
    }
  });

  return isValid;
};

// Guardar paciente
const guardarPaciente = async () => {
  if (!validarFormulario()) {
    showError('Por favor, complete todos los campos obligatorios');
    return;
  }

  isSubmitting.value = true;

  try {
    // Aquí iría la llamada a la API para guardar el paciente
    console.log('Datos del paciente a guardar:', formData);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showSuccess('Paciente guardado exitosamente');
    
    // Redirigir a la lista de pacientes
    router.push('/pacientes');
  } catch (error) {
    console.error('Error al guardar paciente:', error);
    showError('Error al guardar el paciente. Intente nuevamente.');
  } finally {
    isSubmitting.value = false;
  }
};

// Cancelar
const cancelar = () => {
  router.push('/pacientes');
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

:deep(.p-inputtext.p-invalid) {
  border-color: #ef4444 !important;
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
</style>
