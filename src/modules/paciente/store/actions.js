import { useAxios } from '@/composables/useAxios';
import { urlAbm } from '@/utils';

export const fetchPacientes = async () => {
  // Aquí iría la llamada a la API
  // const response = await api.get('/pacientes');
  // return response.data;
  return [];
};

export const createPaciente = async (pacienteData) => {
  // Aquí iría la llamada a la API
  // const response = await api.post('/pacientes', pacienteData);
  // return response.data;
  return { id: Date.now(), ...pacienteData };
};

export const updatePaciente = async (id, pacienteData) => {
  // Aquí iría la llamada a la API
  // const response = await api.put(`/pacientes/${id}`, pacienteData);
  // return response.data;
  return { id, ...pacienteData };
};

export const deletePaciente = async (id) => {
  // Aquí iría la llamada a la API
  // await api.delete(`/pacientes/${id}`);
  return true;
};

export const provincias = async () => {
  try {
    const response = await useAxios.get(`${urlAbm}/provincias`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const ciudades = async (id_provincia) => {
  try {
    const response = await useAxios.get(`${urlAbm}/ciudades/${id_provincia}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
