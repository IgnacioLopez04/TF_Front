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

export const refreshSession = async () => {
  try {
    const response = await useAxios.postUnauthenticated(`${urlAuth}/refresh`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const backendLogout = async () => {
  try {
    await useAxios.postUnauthenticated(`${urlAuth}/logout`, {});
  } catch (_error) {
  }
};

const decodeJwtExpiration = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    if (!json.exp) return null;
    return json.exp * 1000;
  } catch (e) {
    console.warn('No se pudo decodificar la expiración del JWT', e);
    return null;
  }
};

export function useLogin(usuario, accessToken, tokenExpiresAt, startTokenMonitoring) {
  return (userData, token) => {
    try {
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

      accessToken.value = token;
      tokenExpiresAt.value = token ? decodeJwtExpiration(token) : null;

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

export function useLogout(usuario, accessToken, tokenExpiresAt, stopTokenMonitoring) {
  return async () => {
    try {
      sessionStorage.removeItem('accessToken');

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

      accessToken.value = null;
      tokenExpiresAt.value = null;

      if (stopTokenMonitoring) {
        stopTokenMonitoring();
      }

      await backendLogout();
    } catch (error) {
      showError('Error al cerrar sesión');
    }
  };
}

export function useCheckAuth(accessToken, logout) {
  return () => {
    try {
      if (!accessToken.value) {
        logout();
        return { isAuthenticated: false };
      }
      return { isAuthenticated: true };
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      logout();
      return { isAuthenticated: false };
    }
  };
}
