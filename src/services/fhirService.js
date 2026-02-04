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
      const response = await useAxios.post(
        `${urlFhirReport}/$create-historia`,
        fhirResource,
      );
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
    if (
      historiaData.derivadosPor &&
      historiaData.derivadosPor !== 'Sin información'
    ) {
      conclusion.push('DERIVADOS POR:');
      conclusion.push(historiaData.derivadosPor);
      conclusion.push('');
    }

    if (
      historiaData.antecedentesCuadro &&
      historiaData.antecedentesCuadro !== 'Sin información'
    ) {
      conclusion.push('ANTECEDENTES DEL CUADRO ACTUAL:');
      conclusion.push(historiaData.antecedentesCuadro);
      conclusion.push('');
    }

    if (
      historiaData.medicacionActual &&
      historiaData.medicacionActual !== 'Sin información'
    ) {
      conclusion.push('MEDICACIÓN ACTUAL:');
      conclusion.push(historiaData.medicacionActual);
      conclusion.push('');
    }

    if (
      historiaData.estudiosRealizados &&
      historiaData.estudiosRealizados !== 'Sin información'
    ) {
      conclusion.push('ESTUDIOS REALIZADOS:');
      conclusion.push(historiaData.estudiosRealizados);
      conclusion.push('');
    }

    return conclusion.join('\n');
  }

  /**
   * Normaliza valores considerados vacíos a string vacío (para persistir null/vacío y mostrar "No informado" en UI).
   */
  static normalizeEmpty(val) {
    if (val == null || val === '') return '';
    const s = String(val).trim();
    if (s === '' || s === 'Sin información' || s === 'No informado') return '';
    return s;
  }

  /**
   * Mapeo clave frontend (state) → sufijo URL de extensión FHIR (mismo que extractExtensionData en EhrResourceProvider).
   */
  static getExtensionMapping() {
    const BASE = 'http://mi-servidor.com/fhir/StructureDefinition/';
    return [
      { key: 'derivadosPor', suffix: 'derivados-por' },
      { key: 'antecedentesCuadro', suffix: 'antecedentes-cuadro' },
      { key: 'medicacionActual', suffix: 'medicacion-actual' },
      { key: 'estudiosRealizados', suffix: 'estudios-realizados' },
      { key: 'antecedentesHereditarios', suffix: 'antecedentes-hereditarios' },
      { key: 'antecedentesPatologicos', suffix: 'antecedentes-patologicos' },
      { key: 'antecedentesQuirurgicos', suffix: 'antecedentes-quirurgicos' },
      { key: 'antecedentesMetabolicos', suffix: 'antecedentes-metabolicos' },
      {
        key: 'antecedentesInmunologicos',
        suffix: 'antecedentes-inmunologicos',
      },
      { key: 'fisiologicosDormir', suffix: 'fisiologicos-dormir' },
      { key: 'fisiologicosAlimentacion', suffix: 'fisiologicos-alimentacion' },
      { key: 'fisiologicosCatarsis', suffix: 'fisiologicos-catarsis' },
      { key: 'fisiologicosDiuresis', suffix: 'fisiologicos-diuresis' },
      {
        key: 'fisiologicosPeriodoMenstrual',
        suffix: 'fisiologicos-periodo-menstrual',
      },
      { key: 'fisiologicosSexualidad', suffix: 'fisiologicos-sexualidad' },
      { key: 'anamnesisComunicacion', suffix: 'anamnesis-comunicacion' },
      { key: 'anamnesisMotricidad', suffix: 'anamnesis-motricidad' },
      { key: 'anamnesisVidaDiaria', suffix: 'anamnesis-vida-diaria' },
      { key: 'examenActitud', suffix: 'examen-actitud' },
      {
        key: 'examenComunicacionCodigos',
        suffix: 'examen-comunicacion-codigos',
      },
      { key: 'examenPielFaneras', suffix: 'examen-piel-faneras' },
      { key: 'examenCabeza', suffix: 'examen-cabeza' },
      { key: 'examenOjos', suffix: 'examen-ojos' },
      {
        key: 'examenMovimientosAnormales',
        suffix: 'examen-movimientos-anormales',
      },
      { key: 'examenEstrabismo', suffix: 'examen-estrabismo' },
      { key: 'examenOrejas', suffix: 'examen-orejas' },
      { key: 'examenAudicion', suffix: 'examen-audicion' },
      { key: 'examenBoca', suffix: 'examen-boca' },
      { key: 'examenLabios', suffix: 'examen-labios' },
      { key: 'examenLengua', suffix: 'examen-lengua' },
      { key: 'examenDenticion', suffix: 'examen-denticion' },
      { key: 'examenMordida', suffix: 'examen-mordida' },
      { key: 'examenPaladarVelo', suffix: 'examen-paladar-velo' },
      { key: 'examenMaxilares', suffix: 'examen-maxilares' },
      { key: 'examenTorax', suffix: 'examen-torax' },
      { key: 'examenAbdomen', suffix: 'examen-abdomen' },
      { key: 'examenColumnaVertebral', suffix: 'examen-columna-vertebral' },
      { key: 'examenPelvis', suffix: 'examen-pelvis' },
      { key: 'examenCaderas', suffix: 'examen-caderas' },
      { key: 'examenMmii', suffix: 'examen-mmii' },
      { key: 'examenPies', suffix: 'examen-pies' },
      { key: 'examenMmss', suffix: 'examen-mmss' },
      { key: 'examenManos', suffix: 'examen-manos' },
      { key: 'examenLateralidad', suffix: 'examen-lateralidad' },
      { key: 'examenApRespiratorio', suffix: 'examen-ap-respiratorio' },
      { key: 'examenApCardiovascular', suffix: 'examen-ap-cardiovascular' },
      { key: 'examenApDigestivo', suffix: 'examen-ap-digestivo' },
      { key: 'examenActividadRefleja', suffix: 'examen-actividad-refleja' },
      {
        key: 'examenActividadSensoperceptual',
        suffix: 'examen-actividad-sensoperceptual',
      },
      {
        key: 'examenReaccionesPosturales',
        suffix: 'examen-reacciones-posturales',
      },
      {
        key: 'examenDesplazamientoMarcha',
        suffix: 'examen-desplazamiento-marcha',
      },
      { key: 'examenEtapaDesarrollo', suffix: 'examen-etapa-desarrollo' },
      { key: 'diagnosticoFuncional', suffix: 'diagnostico-funcional' },
      { key: 'conductaSeguirObjetivos', suffix: 'conducta-objetivos' },
      { key: 'objetivosFamilia', suffix: 'objetivos-familia' },
    ].map(({ key, suffix }) => ({ key, url: BASE + suffix }));
  }

  /**
   * Construye las extensiones personalizadas del recurso FHIR (todas las que espera el backend).
   * Valores vacíos / "Sin información" / "No informado" se envían como ''.
   */
  static buildExtensions(historiaData) {
    const extensions = [];
    extensions.push({
      url: 'http://mi-servidor.com/fhir/StructureDefinition/historia-tipo',
      valueString: 'fisiatrica',
    });
    const mapping = this.getExtensionMapping();
    mapping.forEach(({ key, url }) => {
      const raw = historiaData[key];
      const value = this.normalizeEmpty(raw);
      extensions.push({ url, valueString: value });
    });
    return extensions;
  }
}

export default FhirService;
