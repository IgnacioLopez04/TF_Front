import { showError } from '@/composables/useToast';
import { urlAuth } from '@/utils';
import { useAxios } from '@/composables/useAxios';

export const login = async (credential) => {
  try {
    const response = await useAxios.postUnauthenticated(`${urlAuth}/login`, {
      credential,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export function useLogin(usuario, accessToken, startTokenMonitoring) {
  return (userData, token) => {
    try {
      // Guardar token en sessionStorage
      sessionStorage.setItem('accessToken', token);

      // Actualizar el estado del usuario
      usuario.value = {
        id_usuario: userData.id_usuario,
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        email: userData.email || '',
        picture: userData.picture || '',
        id_sucursal: userData.id_sucursal || null,
        hashId: userData.hashId || '',
        id_tipo_usuario: userData.id_tipo_usuario || null,
      };

      // Actualizar el token
      accessToken.value = token;

      // Iniciar monitoreo del token
      if (startTokenMonitoring) {
        startTokenMonitoring();
      }
    } catch (error) {
      console.error('Error en login:', error);
      showError('Error al iniciar sesión');
      throw error;
    }
  };
}

export function useLogout(usuario, accessToken, stopTokenMonitoring) {
  return () => {
    try {
      // Remover token de sessionStorage
      sessionStorage.removeItem('accessToken');

      // Resetear el estado del usuario
      usuario.value = {
        id_usuario: null,
        nombre: '',
        apellido: '',
        email: '',
        picture: '',
        id_sucursal: null,
        hashId: '',
        id_tipo_usuario: null,
      };

      // Resetear el token
      accessToken.value = null;

      // Detener monitoreo del token
      if (stopTokenMonitoring) {
        stopTokenMonitoring();
      }
    } catch (error) {
      showError('Error al cerrar sesión');
    }
  };
}

export function useCheckAuth(accessToken, logout) {
  return () => {
    try {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        logout();
        showError('Inicie sesión para continuar');
        return { isAuthenticated: false };
      }

      accessToken.value = token;
      return { isAuthenticated: true };
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      logout();
      return { isAuthenticated: false };
    }
  };
}
