import { showError } from '@/composables/useToast';

export function useLogin(usuario, accessToken) {
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
        nivel: userData.nivel || null,
        id_sucursal: userData.id_sucursal || null,
      };

      // Actualizar el token
      accessToken.value = token;

      console.log('Login exitoso:', usuario.value);
    } catch (error) {
      console.error('Error en login:', error);
      showError('Error al iniciar sesión');
      throw error;
    }
  };
}

export function useLogout(usuario, accessToken) {
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
        nivel: null,
        id_sucursal: null,
      };

      // Resetear el token
      accessToken.value = null;

      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
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
