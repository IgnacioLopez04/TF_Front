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
        icon="pi pi-plus"
        label="Nuevo Usuario"
        @click="abrirModalCrear"
        class="p-button-primary create-user-btn"
        style="background-color: #8b5cf6; border-color: #8b5cf6;"
      />
    </div>

    <!-- Loading state -->
    <div v-if="administracionStore.loading" class="flex justify-content-center align-items-center" style="height: 60vh;">
      <ProgressSpinner />
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
            <div class="flex gap-2 align-items-center action-buttons">
              <Button 
                icon="pi pi-pencil"
                class="p-button-text p-button-rounded action-btn edit-btn"
                @click="editarUsuario(usuario)"
                title="Editar usuario"
              />
              <Button 
                v-if="usuario.activo"
                icon="pi pi-times-circle"
                class="p-button-text p-button-rounded action-btn deactivate-btn"
                @click="toggleEstadoUsuarioConfirmar(usuario)"
                title="Desactivar usuario"
              />
              <Button 
                v-else
                icon="pi pi-check-circle"
                class="p-button-text p-button-rounded action-btn activate-btn"
                @click="toggleEstadoUsuarioConfirmar(usuario)"
                title="Reactivar usuario"
              />
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

    <!-- Dialog para crear/editar usuario -->
    <Dialog 
      v-model:visible="modalEditarVisible" 
      :header="modoCrear ? 'Crear Usuario' : 'Editar Usuario'"
      :style="{ width: '50vw' }" 
      :modal="true"
      class="p-fluid"
    >
      <div class="flex flex-column gap-4">
        <div class="flex gap-3">
          <div class="flex-1">
            <label for="nombre" class="block text-900 font-medium mb-2">Nombre</label>
            <InputText 
              id="nombre"
              v-model="formularioUsuario.nombre" 
              placeholder="Nombre"
              class="w-full"
              :class="{ 'p-invalid': erroresValidacion.nombre }"
              @keypress="(e)=> soloLetras(e)"
              @input="(event) => filtrarSoloLetras(event, 'nombre')"
            />
            <small v-if="erroresValidacion.nombre" class="p-error">{{ erroresValidacion.nombre }}</small>
          </div>
          <div class="flex-1">
            <label for="apellido" class="block text-900 font-medium mb-2">Apellido</label>
            <InputText 
              id="apellido"
              v-model="formularioUsuario.apellido" 
              placeholder="Apellido"
              class="w-full"
              :class="{ 'p-invalid': erroresValidacion.apellido }"
              @keypress="(e)=> soloLetras(e)"
            />
            <small v-if="erroresValidacion.apellido" class="p-error">{{ erroresValidacion.apellido }}</small>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label for="dni" class="block text-900 font-medium mb-2">DNI</label>
            <InputText 
              id="dni"
              v-model="formularioUsuario.dni" 
              placeholder="DNI"
              class="w-full"
              :class="{ 'p-invalid': erroresValidacion.dni }"
              maxlength="8"
              @keypress="(e)=> soloNumeros(e)"
            />
            <small v-if="erroresValidacion.dni" class="p-error">{{ erroresValidacion.dni }}</small>
          </div>
          <div class="flex-1">
            <label for="email" class="block text-900 font-medium mb-2">Email</label>
            <InputText 
              id="email"
              v-model="formularioUsuario.email" 
              placeholder="Email"
              type="email"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label for="fechaNacimiento" class="block text-900 font-medium mb-2">Fecha de Nacimiento</label>
            <Calendar 
              id="fechaNacimiento"
              v-model="formularioUsuario.fechaNacimiento" 
              dateFormat="dd/mm/yy"
              placeholder="Seleccione una fecha"
              class="w-full"
              :class="{ 'p-invalid': erroresValidacion.fechaNacimiento }"
              :showIcon="true"
              :maxDate="fechaMaxima"
              @date-select="() => validarFechaNacimiento(formularioUsuario.fechaNacimiento)"
            />
            <small v-if="erroresValidacion.fechaNacimiento" class="p-error">{{ erroresValidacion.fechaNacimiento }}</small>
          </div>
          <div class="flex-1">
            <label for="idTipoUsuario" class="block text-900 font-medium mb-2">Tipo de Usuario</label>
            <InputText 
              id="idTipoUsuario"
              v-model="formularioUsuario.idTipoUsuario" 
              placeholder="Tipo de Usuario"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button 
          label="Cancelar" 
          icon="pi pi-times"
          @click="cerrarModalEditar"
          class="p-button-text"
        />
        <Button 
          label="Guardar" 
          icon="pi pi-check"
          @click="guardarUsuario"
          class="p-button-primary"
        />
      </template>
    </Dialog>
  </div>
  <Dialog
    v-model:visible="modalConfirmarVisible"
    :header="accionTexto ? 'Desactivar usuario' : 'Reactivar usuario'"
    :style="{ width: '50vw' }"
    :modal="true"
    class="p-fluid"
  >
    <p>¿Está seguro que desea {{ accionTexto }} al usuario {{ identificadorUsuario }}?</p>
    <template #footer>
      <Button 
        label="Cancelar" 
        icon="pi pi-times"
        @click="modalConfirmarVisible = false"
        class="p-button-text"
      />
      <Button 
        label="Confirmar" 
        icon="pi pi-check"
        @click="toggleEstadoUsuario(usuarioSeleccionado)"
        class="p-button-primary"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdministracionStore } from '../store';
import { showError, showSuccess } from '@/composables/useToast';
import { useAuthStore } from '@/modules/auth/store';

const administracionStore = useAdministracionStore();
const authStore = useAuthStore();

const modalConfirmarVisible = ref(false);
const accionTexto = ref('');
const identificadorUsuario = ref('');

const filtroActivo = ref('todos');
const filtros = ref([
  { id: 'todos', label: 'Todos' },
  { id: 'activos', label: 'Activos' },
  { id: 'inactivos', label: 'Inactivos' }
]);

// Estado para el modal de edición/creación
const modalEditarVisible = ref(false);
const modoCrear = ref(false);
const usuarioSeleccionado = ref(null);
const formularioUsuario = ref({
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  fechaNacimiento: null,
  idTipoUsuario: ''
});

// Estado para errores de validación
const erroresValidacion = ref({
  nombre: '',
  apellido: '',
  dni: '',
  fechaNacimiento: ''
});

// Fecha máxima para el calendario (ayer)
const fechaMaxima = computed(() => {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() - 1);
  return hoy;
});

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

// Funciones de validación y filtrado
const soloLetras = (event) => {
  const isPrintable = event.key && event.key.length === 1 
  const isAllowed = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(event.key);
  if(!isPrintable || !isAllowed) {
    event.preventDefault();
  }
};

const soloNumeros = (event) => {
  const isPrintable = event.key && event.key.length === 1 
  const isAllowed = /^\d+$/.test(event.key);
  if(!isPrintable || !isAllowed) {
    event.preventDefault();
  }
};

const validarNombre = (valor, campo) => {
  if (!valor || valor.trim() === '') {
    erroresValidacion.value[campo] = `El ${campo} es obligatorio`;
    return false;
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim())) {
    erroresValidacion.value[campo] = `El ${campo} solo puede contener letras y acentos`;
    return false;
  }
  erroresValidacion.value[campo] = '';
  return true;
};

const validarDNI = (valor) => {
  if (valor && valor.trim() !== '') {
    if (!/^\d+$/.test(valor.trim())) {
      erroresValidacion.value.dni = 'El DNI solo puede contener números';
      return false;
    }
    if (valor.trim().length > 8) {
      erroresValidacion.value.dni = 'El DNI no puede tener más de 8 dígitos';
      return false;
    }
  }
  erroresValidacion.value.dni = '';
  return true;
};

const validarFechaNacimiento = (fecha) => {
  if (!fecha) {
    erroresValidacion.value.fechaNacimiento = '';
    return true; // La fecha es opcional
  }
  
  const fechaSeleccionada = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaSeleccionada.setHours(0, 0, 0, 0);
  
  if (fechaSeleccionada >= hoy) {
    erroresValidacion.value.fechaNacimiento = 'La fecha de nacimiento debe ser anterior al día de hoy';
    return false;
  }
  
  erroresValidacion.value.fechaNacimiento = '';
  return true;
};

const abrirModalCrear = () => {
  modoCrear.value = true;
  usuarioSeleccionado.value = null;
  formularioUsuario.value = {
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    fechaNacimiento: null,
    idTipoUsuario: ''
  };
  // Limpiar errores de validación
  erroresValidacion.value = {
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: ''
  };
  modalEditarVisible.value = true;
};

const editarUsuario = (usuario) => {
  modoCrear.value = false;
  usuarioSeleccionado.value = usuario;
  // Cargar datos del usuario en el formulario
  formularioUsuario.value = {
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    dni: usuario.dni || '',
    email: usuario.email || '',
    fechaNacimiento: usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento) : null,
    idTipoUsuario: usuario.idTipoUsuario || ''
  };
  modalEditarVisible.value = true;
};

const cerrarModalEditar = () => {
  modalEditarVisible.value = false;
  modoCrear.value = false;
  usuarioSeleccionado.value = null;
  formularioUsuario.value = {
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    fechaNacimiento: null,
    idTipoUsuario: ''
  };
  // Limpiar errores de validación
  erroresValidacion.value = {
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: ''
  };
};

const guardarUsuario = async () => {
  try {
    // Validaciones completas
    let esValido = true;
    
    // Validar nombre
    if (!validarNombre(formularioUsuario.value.nombre, 'nombre')) {
      esValido = false;
    }
    
    // Validar apellido
    if (!validarNombre(formularioUsuario.value.apellido, 'apellido')) {
      esValido = false;
    }
    
    // Validar DNI (opcional pero si se ingresa debe ser válido)
    if (formularioUsuario.value.dni && formularioUsuario.value.dni.trim() !== '') {
      if (!validarDNI(formularioUsuario.value.dni)) {
        esValido = false;
      }
    }
    
    // Validar fecha de nacimiento
    if (!validarFechaNacimiento(formularioUsuario.value.fechaNacimiento)) {
      esValido = false;
    }
    
    if (!esValido) {
      showError('Por favor, corrija los errores en el formulario');
      return;
    }

    // Preparar datos para enviar
    const datosUsuario = { ...formularioUsuario.value };
    
    // Formatear fecha solo como YYYY-MM-DD sin hora
    if (datosUsuario.fechaNacimiento) {
      const fecha = new Date(datosUsuario.fechaNacimiento);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      datosUsuario.fechaNacimiento = `${year}-${month}-${day}`;
    }

    if (modoCrear.value) {
      // Crear nuevo usuario
      await administracionStore.crearUsuario(datosUsuario);
      showSuccess(`Usuario ${formularioUsuario.value.nombre} ${formularioUsuario.value.apellido} creado correctamente`);
    } else {
      // Editar usuario existente
      // TODO: Implementar edición de usuario
      console.log('Editar usuario:', datosUsuario);
      showError('La funcionalidad de edición aún no está implementada');
    }
    
    cerrarModalEditar();
  } catch (error) {
    const mensaje = modoCrear.value 
      ? 'Error al crear el usuario'
      : 'Error al editar el usuario';
    showError(mensaje);
  }
};

const toggleEstadoUsuarioConfirmar = (usuario) => {
  modalConfirmarVisible.value = true;
  usuarioSeleccionado.value = usuario;
  accionTexto.value = usuario.activo ? 'desactivar' : 'reactivar';
  identificadorUsuario.value = `${usuario.nombre} ${usuario.apellido}`;
};

const toggleEstadoUsuario = async (usuario) => {
  try {
    console.log(usuario.activo)
    if(authStore.usuario.hashId === usuario.hashId && usuario.activo) {
      showError('No es posible desactivar el usuario logeado. Cambie de usuario para realizar esta acción.');
      modalConfirmarVisible.value = false;
      return;
    }
    
    const nuevoEstado = !usuario.activo;
    await administracionStore.actualizarEstadoUsuario(usuario.hashId, nuevoEstado);
    const mensaje = nuevoEstado 
      ? `Usuario ${usuario.nombre} ${usuario.apellido} activado correctamente`
      : `Usuario ${usuario.nombre} ${usuario.apellido} desactivado correctamente`;
    showSuccess(mensaje);
    modalConfirmarVisible.value = false;
  } catch (error) {
    const mensaje = usuario.activo
      ? 'Error al desactivar el usuario'
      : 'Error al activar el usuario';
    showError(mensaje);
    modalConfirmarVisible.value = false;
  }
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
