import { defineStore } from 'pinia';
import state from './state';
import actions from './actions';

export const usePacienteStore = defineStore('paciente', {
  state,
  actions,

  getters: {
    getPacienteById: (state) => (id) => {
      return state.pacientes.find((paciente) => paciente.id === id);
    },
  },
});
