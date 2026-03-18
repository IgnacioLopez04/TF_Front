
<template>
  <Toast />
  <LayoutView v-if="showLayout" />
  <router-view v-else />
</template>

<script setup>
  import Toast from 'primevue/toast';
  import { useToast } from 'primevue/usetoast';
  import { setToast } from '@/composables/useToast';
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import LayoutView from '@/layout/LayoutView.vue';
  
  const router = useRouter();
  const showLayout = computed(() => router.currentRoute?.value?.meta?.requireLayout !== false);
  
  onMounted(() => {
    const toast = useToast();
    setToast(toast);
  })
</script>

<style>
.back-button {
  background-color: white !important;
  border-color: #8b5cf6 !important;
  color: #8b5cf6 !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  color: #ffffff !important;
}

.button-primary-custom {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  color: white !important;
}

.button-primary-custom:hover {
  background-color:  #ffffff!important;
  border-color: #6d28d9 !important;
  color: #6d28d9 !important;
}
</style>
