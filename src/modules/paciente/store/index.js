import { defineStore } from 'pinia';
import {
  fetchPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from './actions';

export const usePacienteStore = defineStore('paciente', {
  state: () => ({
    pacientes: [],
    pacienteActual: null,
    loading: false,
    error: null,
  }),

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

    async createPaciente(pacienteData) {
      this.loading = true;
      try {
        const nuevoPaciente = await createPaciente(pacienteData);
        this.pacientes.push(nuevoPaciente);
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
      } catch (error) {
        this.error = error.message;
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
      } finally {
        this.loading = false;
      }
    },

    setPacienteActual(paciente) {
      this.pacienteActual = paciente;
    },

    clearError() {
      this.error = null;
    },
  },
});
