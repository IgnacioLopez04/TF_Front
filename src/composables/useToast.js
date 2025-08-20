// toastProvider.js
let toastInstance = null;

export const setToast = (toast) => {
  toastInstance = toast;
};

export const getToast = () => {
  if (!toastInstance) {
    throw new Error('Toast instance is not initialized. Call setToast first.');
  }
  return toastInstance;
};

export const showSuccess = (detail) => {
  const toast = getToast();
  toast.add({ severity: 'success', summary: 'Éxito', detail, life: 5000 });
};

export const showError = (detail) => {
  const toast = getToast();
  toast.add({ severity: 'error', summary: 'Ups!', detail, life: 5000 });
};

export const showWarning = (detail) => {
  const toast = getToast();
  toast.add({ severity: 'warn', summary: 'Advertencia', detail, life: 5000 });
};

export const showInfo = (detail) => {
  const toast = getToast();
  toast.add({ severity: 'info', summary: 'Info', detail, life: 2500 });
};
