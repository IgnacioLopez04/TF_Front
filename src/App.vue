
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
  import { showSuccess, showError, showWarning, showInfo } from '@/composables/useToast';
  import LayoutView from '@/layout/LayoutView.vue';

  const router = useRouter();
  const showLayout = computed(() => router.currentRoute?.value?.meta?.requireLayout !== false);
  
  onMounted(() => {
    const toast = useToast();
    setToast(toast);
  })
  
  const handleClick = () => {
    showSuccess('Exito!')
    showError('Error!')
    showWarning('Advertencia!')
    showInfo('Info!')
  }
</script>
