<template>
  <div>
    <div>
      <h1>¡Bienvenido al Sistema de Historias Clínicas!</h1>
      <p>Has iniciado sesión correctamente</p>
    </div>
    <div>
      <div>
        <Avatar 
          v-if="authStore.usuario.picture" 
          :image="authStore.usuario.picture" 
          size="xlarge" 
          shape="circle"
        />
        <Avatar 
          v-else
          :label="getInitials(authStore.usuario.nombre, authStore.usuario.apellido)"
          size="xlarge" 
          shape="circle"
        />
        <div>
          <h2>{{ authStore.usuario.nombre }} {{ authStore.usuario.apellido }}</h2>
          <p>{{ authStore.usuario.email }}</p>
        </div>
      </div>
    </div>
    <div>
      <Button @click="logout">
        Cerrar Sesión
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store';
import { showSuccess } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  showSuccess('Sesión cerrada correctamente');
  router.push('/login');
};

const getInitials = (nombre, apellido) => {
  const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : '';
  const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};
</script>

<style scoped>
</style>
