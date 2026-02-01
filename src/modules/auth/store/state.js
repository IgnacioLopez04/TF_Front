import { ref } from 'vue';

export function useAuthState() {
  const usuario = ref({
    id_usuario: null,
    nombre: '',
    apellido: '',
    email: '',
    picture: '',
    nivel: null,
    hashId: '',
    id_tipo_usuario: null,
  });

  const accessToken = ref(null);

  return {
    usuario,
    accessToken,
  };
}
