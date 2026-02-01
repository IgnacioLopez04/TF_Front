const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080';
export const FHIR_URL = import.meta.env.VITE_FHIR_URL || 'http://localhost:8080';

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo_client_id';

// Otras utilidades
export const APP_TITLE =
  import.meta.env.VITE_APP_TITLE || 'Sistema de Historias Clínicas';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const urlAuth = `${AUTH_URL}/auth`;
export const urlAbm = `${BACKEND_URL}/abm`;
export const urlPaciente = `${BACKEND_URL}/paciente`;
export const urlEhr = `${BACKEND_URL}/ehr`;
export const urlFile = `${BACKEND_URL}/file`;

// URLs para FHIR
export const urlFhir = `${FHIR_URL}/fhir`;
export const urlFhirLocation = `${urlFhir}/Location`;
export const urlFhirOrganization = `${urlFhir}/Organization`;
export const urlFhirPatient = `${urlFhir}/Patient`;
export const urlFhirReport = `${urlFhir}/DiagnosticReport`;
export const urlFhirDocumentReference = `${urlFhir}/DocumentReference`;
export const urlFhirAnnex = `${urlFhir}/Annex`;
export const urlFhirPractitioner = `${urlFhir}/Practitioner`;
