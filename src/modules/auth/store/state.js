import { ref } from 'vue';

export function useAuthState() {
  const usuario = ref({
    id_usuario: null,
    nombre: '',
    apellido: '',
    email: '',
    picture: '',
    nivel: null,
    id_sucursal: null,
  });

  const accessToken = ref(null);

  return {
    usuario,
    accessToken,
  };
}
