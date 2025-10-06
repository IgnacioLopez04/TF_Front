import { useAxios } from '@/composables/useAxios';
import { urlFhirReport } from '@/utils';

/**
 * Servicio para manejar operaciones FHIR relacionadas con historias fisiátricas
 */
export class FhirService {
  
  /**
   * Crea un recurso DiagnosticReport FHIR para una historia fisiátrica
   * @param {Object} historiaData - Datos de la historia fisiátrica
   * @param {string} patientId - ID del paciente
   * @returns {Object} Recurso FHIR DiagnosticReport
   */
  static createDiagnosticReport(historiaData, patientId) {
    const fhirResource = {
      resourceType: 'DiagnosticReport',
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11450-4',
              display: 'Problem List Reported',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '11450-4',
            display: 'Problem List Reported',
          },
        ],
        text: 'Historia Clínica Fisiátrica',
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime: this.formatDateTime(historiaData.fechaEvaluacion),
      conclusion: this.buildConclusion(historiaData),
      extension: this.buildExtensions(historiaData),
    };

    return fhirResource;
  }

  /**
   * Envía un recurso FHIR al servidor FHIR intermedio
   * El servidor intermedio se encarga de transformar y enviar al backend
   * @param {Object} fhirResource - Recurso FHIR a enviar
   * @returns {Promise<Object>} Respuesta del servidor FHIR
   */
  static async sendToFhirServer(fhirResource) {
    try {
      const response = await useAxios.post(`${urlFhirReport}/$create-historia`, fhirResource);
      return {
        success: true,
        data: response.data,
        fhirId: response.data.id,
      };
    } catch (error) {
      console.error('Error enviando recurso FHIR:', error);
      throw new Error(`Error al enviar recurso FHIR: ${error.message}`);
    }
  }

  /**
   * Formatea la fecha para FHIR
   * @param {string} fecha - Fecha en formato string
   * @returns {string} Fecha en formato ISO 8601
   */
  static formatDateTime(fecha) {
    if (!fecha || fecha === 'Sin información') {
      return new Date().toISOString();
    }
    
    try {
      return new Date(fecha).toISOString();
    } catch (error) {
      console.warn('Error formateando fecha, usando fecha actual:', error);
      return new Date().toISOString();
    }
  }

  /**
   * Construye la conclusión del reporte FHIR
   * @param {Object} historiaData - Datos de la historia
   * @returns {string} Texto de conclusión formateado
   */
  static buildConclusion(historiaData) {
    const conclusion = [];
    
    conclusion.push('HISTORIA CLÍNICA FISIÁTRICA\n');
    
    // Evaluación y Consulta
    if (historiaData.derivadosPor && historiaData.derivadosPor !== 'Sin información') {
      conclusion.push('DERIVADOS POR:');
      conclusion.push(historiaData.derivadosPor);
      conclusion.push('');
    }
    
    if (historiaData.antecedentesCuadro && historiaData.antecedentesCuadro !== 'Sin información') {
      conclusion.push('ANTECEDENTES DEL CUADRO ACTUAL:');
      conclusion.push(historiaData.antecedentesCuadro);
      conclusion.push('');
    }
    
    if (historiaData.medicacionActual && historiaData.medicacionActual !== 'Sin información') {
      conclusion.push('MEDICACIÓN ACTUAL:');
      conclusion.push(historiaData.medicacionActual);
      conclusion.push('');
    }
    
    if (historiaData.estudiosRealizados && historiaData.estudiosRealizados !== 'Sin información') {
      conclusion.push('ESTUDIOS REALIZADOS:');
      conclusion.push(historiaData.estudiosRealizados);
      conclusion.push('');
    }
    
    return conclusion.join('\n');
  }

  /**
   * Construye las extensiones personalizadas del recurso FHIR
   */
  static buildExtensions(historiaData) {
    const extensions = [];
    
    // Extensión para el tipo de historia
    extensions.push({
      url: 'http://mi-servidor.com/fhir/StructureDefinition/historia-tipo',
      valueString: 'fisiatrica',
    });
    
    // Extensiones para datos principales
    const extensionFields = [
      { key: 'derivadosPor', url: 'http://mi-servidor.com/fhir/StructureDefinition/derivados-por' },
      { key: 'antecedentesCuadro', url: 'http://mi-servidor.com/fhir/StructureDefinition/antecedentes-cuadro' },
      { key: 'medicacionActual', url: 'http://mi-servidor.com/fhir/StructureDefinition/medicacion-actual' },
      { key: 'estudiosRealizados', url: 'http://mi-servidor.com/fhir/StructureDefinition/estudios-realizados' },
      { key: 'diagnosticoFuncional', url: 'http://mi-servidor.com/fhir/StructureDefinition/diagnostico-funcional' },
      { key: 'conductaSeguirObjetivos', url: 'http://mi-servidor.com/fhir/StructureDefinition/conducta-objetivos' },
      { key: 'objetivosFamilia', url: 'http://mi-servidor.com/fhir/StructureDefinition/objetivos-familia' },
    ];
    
    extensionFields.forEach(field => {
      // Siempre enviar el campo, incluso si está vacío
      const value = historiaData[field.key] || '';
      extensions.push({
        url: field.url,
        valueString: value,
      });
    });
    
    return extensions;
  }
}

export default FhirService;
