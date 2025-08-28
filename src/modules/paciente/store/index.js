import { defineStore } from 'pinia';
import state from './state';

export const usePacienteStore = defineStore('paciente', {
  state,

  getters: {
    getPacienteById: (state) => (id) => {
      return state.pacientes.find((paciente) => paciente.id === id);
    },
    pacientesActivos: (state) => {
      return state.pacientes.filter((paciente) => paciente.activo);
    },
  },

  actions: {
    async fetchPacientes() {
      this.loading = true;
      try {
        const pacientes = await fetchPacientes();
        this.pacientes = pacientes;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updatePaciente(id, pacienteData) {
      this.loading = true;
      try {
        const pacienteActualizado = await updatePaciente(id, pacienteData);
        const index = this.pacientes.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.pacientes[index] = pacienteActualizado;
        }
        this.error = null;
        return pacienteActualizado;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePaciente(id) {
      this.loading = true;
      try {
        await deletePaciente(id);
        this.pacientes = this.pacientes.filter((p) => p.id !== id);
        this.error = null;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setPaciente(paciente) {
      this.paciente = paciente;
    },

    // Agregar un tutor al paciente actual
    agregarTutor() {
      if (!this.paciente.tutores) {
        this.paciente.tutores = [];
      }
      const nuevoTutor = {
        nombre: '',
        dni: '',
        fechaNacimiento: null,
        ocupacion: '',
        lugarNacimiento: '',
      };
      this.paciente.tutores.push(nuevoTutor);
      return nuevoTutor;
    },

    // Eliminar un tutor del paciente actual
    eliminarTutor(index) {
      if (this.paciente.tutores && this.paciente.tutores[index]) {
        this.paciente.tutores.splice(index, 1);
      }
    },

    // Limpiar el paciente actual
    limpiarPaciente() {
      this.paciente = {
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
        tutores: [],
        activo: true,
        fechaCreacion: null,
        fechaModificacion: null,
      };
    },

    // Limpiar errores
    clearError() {
      this.error = null;
    },

    // Validar si un paciente es menor de edad
    esMenorDeEdad(fechaNacimiento) {
      if (!fechaNacimiento) return false;

      const fechaNac = new Date(fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        return edad - 1 < 18;
      }

      return edad < 18;
    },

    // Obtener edad del paciente
    obtenerEdad(fechaNacimiento) {
      if (!fechaNacimiento) return null;

      const fechaNac = new Date(fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        return edad - 1;
      }

      return edad;
    },
  },
});
