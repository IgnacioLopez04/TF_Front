const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080';

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo_client_id';

// Otras utilidades
export const APP_TITLE =
  import.meta.env.VITE_APP_TITLE || 'Sistema de Historias Clínicas';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const urlAbm = `${BACKEND_URL}/abm`;
export const urlAuth = `${AUTH_URL}/auth`;
