/**
 * Helper específico para manejar reportes FHIR (DiagnosticReport)
 * Proporciona funciones para crear y procesar reportes usando el servidor FHIR
 */

import { useAxios } from '../composables/useAxios.js';

/**
 * Crea un recurso DiagnosticReport FHIR para enviar al servidor
 * @param {Object} reportData - Datos del reporte
 * @param {string} reportData.titulo - Título del reporte
 * @param {string} reportData.contenido - Contenido del reporte
 * @param {string} reportData.dniPaciente - DNI del paciente
 * @param {string} reportData.idUsuario - ID del usuario que crea el reporte
 * @param {string} reportData.idEspecialidad - ID de la especialidad (opcional)
 * @param {string} reportData.idHistoriaClinica - ID de la historia clínica (opcional)
 * @param {string} reportData.tipoReporte - Tipo de reporte (opcional, default: "1")
 * @returns {Object} Recurso DiagnosticReport FHIR
 */
export const createDiagnosticReportResource = (reportData) => {
  const {
    titulo,
    contenido,
    dniPaciente,
    idUsuario,
    idEspecialidad = null,
    idHistoriaClinica = null,
    tipoReporte = "1"
  } = reportData;

  // Crear el recurso DiagnosticReport
  const diagnosticReport = {
    resourceType: "DiagnosticReport",
    status: "final",
    code: {
      text: titulo || "Reporte de Diagnóstico"
    },
    conclusion: contenido || "",
    subject: {
      reference: `Patient/${dniPaciente}`
    },
    extension: []
  };

  // Agregar extensiones personalizadas para los datos adicionales
  if (dniPaciente) {
    diagnosticReport.extension.push({
      url: "http://mi-servidor/fhir/StructureDefinition/patient-dni",
      valueString: dniPaciente
    });
  }

  if (idUsuario) {
    diagnosticReport.extension.push({
      url: "http://mi-servidor/fhir/StructureDefinition/user-id",
      valueString: idUsuario
    });
  }

  if (idEspecialidad) {
    diagnosticReport.extension.push({
      url: "http://mi-servidor/fhir/StructureDefinition/speciality-id",
      valueString: idEspecialidad
    });
  }

  if (idHistoriaClinica) {
    diagnosticReport.extension.push({
      url: "http://mi-servidor/fhir/StructureDefinition/ehr-id",
      valueString: idHistoriaClinica
    });
  }

  if (tipoReporte) {
    diagnosticReport.extension.push({
      url: "http://mi-servidor/fhir/StructureDefinition/report-type",
      valueString: tipoReporte
    });
  }

  return diagnosticReport;
};

/**
 * Envía un reporte al servidor FHIR
 * @param {Object} reportData - Datos del reporte
 * @returns {Promise<Object>} Respuesta del servidor FHIR
 */
export const createReportViaFhir = async (reportData) => {
  const { axiosInstance } = useAxios();
  
  try {
    // Crear el recurso DiagnosticReport
    const diagnosticReport = createDiagnosticReportResource(reportData);
    
    // Enviar al servidor FHIR
    const response = await axiosInstance.post('/fhir/DiagnosticReport', diagnosticReport);
    
    return {
      success: true,
      data: response.data,
      reportId: response.data.id
    };
  } catch (error) {
    console.error('Error al crear reporte via FHIR:', error);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Busca reportes de un paciente específico
 * @param {string} patientDni - DNI del paciente
 * @returns {Promise<Array>} Lista de reportes del paciente
 */
export const searchReportsByPatient = async (patientDni) => {
  const { axiosInstance } = useAxios();
  
  try {
    const response = await axiosInstance.get(`/fhir/DiagnosticReport?subject=Patient/${patientDni}`);
    return response.data.entry || [];
  } catch (error) {
    console.error('Error al buscar reportes del paciente:', error);
    return [];
  }
};

/**
 * Obtiene un reporte específico por ID
 * @param {string} reportId - ID del reporte
 * @returns {Promise<Object|null>} Reporte encontrado o null
 */
export const getReportById = async (reportId) => {
  const { axiosInstance } = useAxios();
  
  try {
    const response = await axiosInstance.get(`/fhir/DiagnosticReport/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    return null;
  }
};

/**
 * Procesa la respuesta de un reporte FHIR para extraer datos útiles
 * @param {Object} fhirReport - Reporte FHIR
 * @returns {Object} Datos procesados del reporte
 */
export const processFhirReport = (fhirReport) => {
  if (!fhirReport || fhirReport.resourceType !== 'DiagnosticReport') {
    return null;
  }

  const processed = {
    id: fhirReport.id,
    titulo: fhirReport.code?.text || 'Sin título',
    contenido: fhirReport.conclusion || '',
    status: fhirReport.status,
    fecha: fhirReport.effectiveDateTime || new Date().toISOString(),
    paciente: null,
    extensiones: {}
  };

  // Extraer DNI del paciente de las extensiones
  if (fhirReport.extension) {
    fhirReport.extension.forEach(ext => {
      if (ext.url.includes('patient-dni')) {
        processed.paciente = ext.valueString;
      }
      // Mapear otras extensiones útiles
      if (ext.url.includes('user-id')) {
        processed.extensiones.idUsuario = ext.valueString;
      }
      if (ext.url.includes('speciality-id')) {
        processed.extensiones.idEspecialidad = ext.valueString;
      }
      if (ext.url.includes('ehr-id')) {
        processed.extensiones.idHistoriaClinica = ext.valueString;
      }
      if (ext.url.includes('report-type')) {
        processed.extensiones.tipoReporte = ext.valueString;
      }
    });
  }

  return processed;
};

/**
 * Procesa una lista de reportes FHIR
 * @param {Array} fhirReports - Lista de reportes FHIR
 * @returns {Array} Lista de reportes procesados
 */
export const processFhirReports = (fhirReports) => {
  if (!Array.isArray(fhirReports)) {
    return [];
  }

  return fhirReports
    .map(report => processFhirReport(report))
    .filter(report => report !== null);
};

/**
 * Función de conveniencia para crear un reporte simple
 * @param {Object} reportData - Datos básicos del reporte
 * @returns {Promise<Object>} Resultado de la creación
 */
export const createSimpleReport = async (reportData) => {
  const {
    titulo,
    contenido,
    dniPaciente,
    idUsuario
  } = reportData;

  if (!titulo || !contenido || !dniPaciente || !idUsuario) {
    return {
      success: false,
      error: 'Faltan datos obligatorios: titulo, contenido, dniPaciente, idUsuario'
    };
  }

  return await createReportViaFhir(reportData);
};

export default {
  createDiagnosticReportResource,
  createReportViaFhir,
  searchReportsByPatient,
  getReportById,
  processFhirReport,
  processFhirReports,
  createSimpleReport
};
