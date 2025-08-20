if (window.self !== window.top) {
  document.body.innerHTML = '<h1>Acceso no permitido</h1>';
  throw new Error('Bloqueo por clickjacking');
}

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';

import ToastService from 'primevue/toastservice';
import router from './router';
import pinia from './store';
import PrimeVueConfig from './helpers/primevue';
import './styles/style.css';

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: 'none',
    },
  },
});

app.use(ToastService);
app.use(PrimeVueConfig);
app.mount('#app');
