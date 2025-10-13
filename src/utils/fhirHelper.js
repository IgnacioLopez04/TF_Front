/**
 * Helper para procesar respuestas FHIR
 * Maneja tanto respuestas Bundle como respuestas simples
 */

/**
 * Extrae recursos de una respuesta FHIR
 * @param {Object|Array} data - Respuesta del servidor FHIR
 * @param {Object} options - Opciones de procesamiento
 * @returns {Array} Array de recursos FHIR
 */
export const extractFhirResources = (data, options = {}) => {
  const {
    resourceType = null, // Filtrar por tipo específico de recurso
    flatten = true, // Aplanar arrays anidados
    removeExtensions = false, // Remover extensiones personalizadas
    keepMetadata = false, // Mantener metadatos del Bundle
  } = options;

  // Si es null o undefined, devolver array vacío
  if (data == null) {
    console.warn('FHIR Helper: data es null o undefined');
    return [];
  }

  // Si ya es un array, procesar directamente
  if (Array.isArray(data)) {
    return processResourceArray(data, { resourceType, removeExtensions });
  }

  // Si es un Bundle, extraer recursos
  if (isBundle(data)) {
    return processBundle(data, {
      resourceType,
      removeExtensions,
      keepMetadata,
    });
  }

  // Si es un solo recurso, devolverlo en array
  if (isResource(data)) {
    const processed = processSingleResource(data, {
      resourceType,
      removeExtensions,
    });
    return processed ? [processed] : [];
  }

  // Si es un objeto pero no es recurso FHIR, devolver array vacío
  if (typeof data === 'object') {
    console.warn('FHIR Helper: data no es un recurso FHIR válido:', data);
    return [];
  }

  // Fallback: devolver array vacío
  console.warn('FHIR Helper: formato de data no reconocido:', typeof data);
  return [];
};

/**
 * Verifica si el data es un Bundle FHIR
 * @param {Object} data
 * @returns {boolean}
 */
const isBundle = (data) => {
  return (
    data &&
    data.resourceType === 'Bundle' &&
    (data.entry || data.total !== undefined)
  );
};

/**
 * Verifica si el data es un recurso FHIR
 * @param {Object} data
 * @returns {boolean}
 */
const isResource = (data) => {
  return data && data.resourceType && data.id !== undefined;
};

/**
 * Procesa un Bundle FHIR
 * @param {Object} bundle
 * @param {Object} options
 * @returns {Array}
 */
const processBundle = (bundle, options) => {
  const { resourceType, removeExtensions, keepMetadata } = options;
  const resources = [];

  // Si no hay entries, devolver array vacío
  if (!bundle.entry || !Array.isArray(bundle.entry)) {
    console.warn('FHIR Helper: Bundle sin entries válidas');
    return resources;
  }

  // Procesar cada entry
  bundle.entry.forEach((entry, index) => {
    if (entry.resource) {
      const processed = processSingleResource(entry.resource, {
        resourceType,
        removeExtensions,
      });
      if (processed) {
        // Agregar metadatos del Bundle si se solicitan
        if (keepMetadata && entry.search) {
          processed._bundleMetadata = {
            search: entry.search,
            index: index,
          };
        }
        resources.push(processed);
      }
    }
  });

  return resources;
};

/**
 * Procesa un array de recursos
 * @param {Array} resources
 * @param {Object} options
 * @returns {Array}
 */
const processResourceArray = (resources, options) => {
  const { resourceType, removeExtensions } = options;
  const processed = [];

  resources.forEach((resource) => {
    const processedResource = processSingleResource(resource, {
      resourceType,
      removeExtensions,
    });
    if (processedResource) {
      processed.push(processedResource);
    }
  });

  return processed;
};

/**
 * Procesa un recurso individual
 * @param {Object} resource
 * @param {Object} options
 * @returns {Object|null}
 */
const processSingleResource = (resource, options) => {
  const { resourceType, removeExtensions } = options;

  // Verificar que sea un recurso válido
  if (!isResource(resource)) {
    console.warn('FHIR Helper: Recurso inválido:', resource);
    return null;
  }

  // Filtrar por tipo de recurso si se especifica
  if (resourceType && resource.resourceType !== resourceType) {
    return null;
  }

  // Clonar el recurso para no modificar el original
  const processed = { ...resource };

  // Remover extensiones personalizadas si se solicita
  if (removeExtensions && processed.extension) {
    processed.extension = processed.extension.filter(
      (ext) => !ext.url || !ext.url.includes('custom'),
    );
  }

  return processed;
};

/**
 * Helper específico para extraer recursos por tipo
 * @param {Object|Array} data
 * @param {string} resourceType
 * @returns {Array}
 */
export const extractResourcesByType = (data, resourceType) => {
  return extractFhirResources(data, { resourceType });
};

/**
 * Helper para extraer solo el primer recurso
 * @param {Object|Array} data
 * @param {string} resourceType
 * @returns {Object|null}
 */
export const extractFirstResource = (data, resourceType = null) => {
  const resources = extractFhirResources(data, { resourceType });
  return resources.length > 0 ? resources[0] : null;
};

/**
 * Helper para extraer recursos con metadatos del Bundle
 * @param {Object|Array} data
 * @returns {Array}
 */
export const extractResourcesWithMetadata = (data) => {
  return extractFhirResources(data, { keepMetadata: true });
};

/**
 * Helper para limpiar recursos (remover extensiones personalizadas)
 * @param {Object|Array} data
 * @returns {Array}
 */
export const extractCleanResources = (data) => {
  return extractFhirResources(data, { removeExtensions: true });
};

/**
 * Verifica si la respuesta contiene recursos
 * @param {Object|Array} data
 * @returns {boolean}
 */
export const hasResources = (data) => {
  const resources = extractFhirResources(data);
  return resources.length > 0;
};

/**
 * Obtiene el conteo total de recursos
 * @param {Object|Array} data
 * @returns {number}
 */
export const getResourceCount = (data) => {
  if (isBundle(data) && data.total !== undefined) {
    return data.total;
  }
  const resources = extractFhirResources(data);
  return resources.length;
};

/**
 * Filtra recursos por una condición personalizada
 * @param {Object|Array} data
 * @param {Function} filterFn
 * @returns {Array}
 */
export const filterResources = (data, filterFn) => {
  const resources = extractFhirResources(data);
  return resources.filter(filterFn);
};

/**
 * Mapea recursos usando una función de transformación
 * @param {Object|Array} data
 * @param {Function} mapFn
 * @returns {Array}
 */
export const mapResources = (data, mapFn) => {
  const resources = extractFhirResources(data);
  return resources.map(mapFn);
};

/**
 * Busca un recurso por ID
 * @param {Object|Array} data
 * @param {string} id
 * @returns {Object|null}
 */
export const findResourceById = (data, id) => {
  const resources = extractFhirResources(data);
  return resources.find((resource) => resource.id === id) || null;
};

/**
 * Busca recursos por nombre (para Location y Organization)
 * @param {Object|Array} data
 * @param {string} name
 * @returns {Array}
 */
export const findResourcesByName = (data, name) => {
  const resources = extractFhirResources(data);
  const searchName = name.toLowerCase();
  return resources.filter(
    (resource) =>
      resource.name && resource.name.toLowerCase().includes(searchName),
  );
};

/**
 * Obtiene estadísticas de la respuesta
 * @param {Object|Array} data
 * @returns {Object}
 */
export const getResponseStats = (data) => {
  const resources = extractFhirResources(data);
  const stats = {
    total: resources.length,
    types: {},
    hasBundle: isBundle(data),
    hasResources: resources.length > 0,
  };

  // Contar por tipo de recurso
  resources.forEach((resource) => {
    const type = resource.resourceType;
    stats.types[type] = (stats.types[type] || 0) + 1;
  });

  return stats;
};

/**
 * Obtiene el valor de una extensión FHIR por su URL
 * @param {Array} extensions - Array de extensiones FHIR
 * @param {string} url - URL de la extensión a buscar
 * @returns {string|null} - Valor de la extensión o null si no se encuentra
 */
export const getExtensionValue = (extensions, url) => {
  if (!extensions || !Array.isArray(extensions)) {
    return null;
  }

  const extension = extensions.find((ext) => ext.url === url);
  return extension ? extension.valueString : null;
};

/**
 * Obtiene múltiples valores de extensiones por sus URLs
 * @param {Array} extensions - Array de extensiones FHIR
 * @param {Object} urlMap - Objeto con URLs como claves y nombres de propiedades como valores
 * @returns {Object} - Objeto con los valores de las extensiones
 *
 * @example
 * const extensions = resource.extension;
 * const values = getExtensionValues(extensions, {
 *   'http://mi-servidor/fhir/StructureDefinition/hash-id': 'hash_id',
 *   'http://mi-servidor/fhir/StructureDefinition/prestacion': 'prestacion'
 * });
 * // Resultado: { hash_id: 'abc123', prestacion: 'Hogar' }
 */
export const getExtensionValues = (extensions, urlMap) => {
  const result = {};

  if (!extensions || !Array.isArray(extensions) || !urlMap) {
    return result;
  }

  Object.entries(urlMap).forEach(([url, propertyName]) => {
    result[propertyName] = getExtensionValue(extensions, url);
  });

  return result;
};

/**
 * Obtiene el valor de un identificador FHIR por su sistema
 * @param {Array} identifiers - Array de identificadores FHIR
 * @param {string} system - Sistema del identificador a buscar
 * @returns {string|null} - Valor del identificador o null si no se encuentra
 */
export const getIdentifierValue = (identifiers, system) => {
  if (!identifiers || !Array.isArray(identifiers)) {
    return null;
  }

  const identifier = identifiers.find((id) => id.system === system);
  return identifier ? identifier.value : null;
};

/**
 * Transforma un DiagnosticReport FHIR a un formato más legible para el frontend
 * @param {Object} diagnosticReport - El recurso DiagnosticReport de FHIR
 * @returns {Object} Objeto con la información del informe en formato legible
 * Nota: Los anexos (presentedForm) se interpretan como comentarios del informe
 */
export function transformarDiagnosticReport(diagnosticReport) {
  // Extraer información básica
  const informe = {
    id: diagnosticReport.id || 'N/A',
    hashId: 'N/A', // Nuevo campo para el hashId del reporte
    titulo: diagnosticReport.code?.text || 'Sin título',
    contenido: diagnosticReport.conclusion || 'Sin contenido',
    fechaCreacion: diagnosticReport.effectiveDateTime || 'Fecha no disponible',
    estado: diagnosticReport.status || 'unknown',
    pacienteId:
      diagnosticReport.subject?.reference?.replace('Patient/', '') || 'N/A',

    // Información del profesional (desde extensiones)
    profesional: {
      nombre: 'No disponible',
      apellido: 'No disponible',
      dni: 'No disponible',
    },

    // Información del tipo de informe
    tipoInforme: {
      nombre: 'No disponible',
      id: 'N/A',
    },

    // Anexos (comentarios del informe)
    anexos: [],
  };

  // Extraer información de las extensiones
  if (diagnosticReport.extension && Array.isArray(diagnosticReport.extension)) {
    diagnosticReport.extension.forEach((extension) => {
      const url = extension.url;
      const value = extension.valueString || extension.value?.toString() || '';

      switch (url) {
        case 'http://example.org/fhir/StructureDefinition/report-hash-id':
          informe.hashId = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-name':
          informe.profesional.nombre = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-lastname':
          informe.profesional.apellido = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-dni':
          informe.profesional.dni = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/report-type-name':
          informe.tipoInforme.nombre = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/report-type-id':
          informe.tipoInforme.id = value;
          break;
      }
    });
  }

  // Extraer anexos (comentarios) de presentedForm
  if (
    diagnosticReport.presentedForm &&
    Array.isArray(diagnosticReport.presentedForm)
  ) {
    informe.anexos = diagnosticReport.presentedForm.map((anexo, index) => ({
      id: index + 1,
      titulo: anexo.title || `Comentario ${index + 1}`,
      contenido: anexo.data
        ? new TextDecoder().decode(anexo.data)
        : 'Sin contenido',
      tipoContenido: anexo.contentType || 'text/plain',
      fechaCreacion: anexo.creation || 'Fecha no disponible',
    }));
  }

  // Formatear fecha si es posible
  if (
    informe.fechaCreacion &&
    informe.fechaCreacion !== 'Fecha no disponible'
  ) {
    try {
      const fecha = new Date(informe.fechaCreacion);
      informe.fechaCreacion = fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.warn('Error al formatear fecha:', error);
    }
  }

  // Crear nombre completo del profesional
  informe.profesional.nombreCompleto =
    `${informe.profesional.nombre} ${informe.profesional.apellido}`.trim();

  return informe;
}

/**
 * Transforma un DiagnosticReport FHIR de anexo/comentario a un formato más legible para el frontend
 * @param {Object} diagnosticReport - El recurso DiagnosticReport de FHIR (anexo)
 * @returns {Object} Objeto con la información del comentario en formato legible
 */
export function transformarComentario(diagnosticReport) {
  // Extraer información básica del comentario
  const comentario = {
    id: diagnosticReport.id || 'N/A',
    hashId: 'N/A',
    titulo: diagnosticReport.code?.text || 'Comentario',
    contenido: diagnosticReport.conclusion || 'Sin contenido',
    fechaCreacion: diagnosticReport.effectiveDateTime || 'Fecha no disponible',
    estado: diagnosticReport.status || 'unknown',
    esComentario: true, // Marcar que es un comentario

    // Referencia al informe padre
    informePadre:
      diagnosticReport.subject?.reference?.replace('DiagnosticReport/', '') ||
      'N/A',

    // Información del profesional (desde extensiones)
    profesional: {
      nombre: 'No disponible',
      apellido: 'No disponible',
      dni: 'No disponible',
    },

    // Campos específicos del anexo
    idAnexo: 'N/A',
    idInforme: 'N/A',
    idUsuario: 'N/A',
  };

  // Extraer información de las extensiones
  if (diagnosticReport.extension && Array.isArray(diagnosticReport.extension)) {
    diagnosticReport.extension.forEach((extension) => {
      const url = extension.url;
      const value = extension.valueString || extension.value?.toString() || '';

      switch (url) {
        case 'http://example.org/fhir/StructureDefinition/report-hash-id':
          comentario.hashId = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-name':
          comentario.profesional.nombre = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-lastname':
          comentario.profesional.apellido = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-dni':
          comentario.profesional.dni = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/is-annex':
          // Confirmar que es un anexo
          comentario.esComentario = value === true || value === 'true';
          break;
        case 'http://example.org/fhir/StructureDefinition/user-id':
          comentario.idUsuario = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/report-type-id':
          comentario.idInforme = value;
          break;
      }
    });
  }

  // Formatear fecha si es posible
  if (
    comentario.fechaCreacion &&
    comentario.fechaCreacion !== 'Fecha no disponible'
  ) {
    try {
      const fecha = new Date(comentario.fechaCreacion);
      comentario.fechaCreacion = fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.warn('Error al formatear fecha del comentario:', error);
    }
  }

  // Crear nombre completo del profesional
  comentario.profesional.nombreCompleto =
    `${comentario.profesional.nombre} ${comentario.profesional.apellido}`.trim();

  return comentario;
}

/**
 * Transforma un DiagnosticReport FHIR de Historia Fisiatrica a un formato más legible para el frontend
 * @param {Object} diagnosticReport - El recurso DiagnosticReport de FHIR (Historia Fisiatrica)
 * @returns {Object} Objeto con la información de la historia fisiatrica en formato legible
 */
export function transformarHistoriaFisiatrica(diagnosticReport) {
  console.log('diagnosticReport', diagnosticReport);
  // Extraer información básica de la historia fisiatrica
  const historiaFisiatrica = {
    id: diagnosticReport.id || 'N/A',
    hashId: 'N/A',
    tipo: 'fisiatrica',
    titulo: diagnosticReport.code?.text || 'Historia Clínica Fisiátrica',
    contenido: diagnosticReport.conclusion || 'Sin contenido',
    fechaCreacion: diagnosticReport.effectiveDateTime || 'Fecha no disponible',
    estado: diagnosticReport.status || 'unknown',

    // Referencia al paciente
    pacienteId:
      diagnosticReport.subject?.reference?.replace('Patient/', '') || 'N/A',

    // Información del EHR
    ehrId: 'N/A',

    // Campos específicos de la historia fisiatrica
    antecedentes: '',
    medicacionActual: '',
    estudiosRealizados: '',
    fisiologico: {},
    anamnesisSistemica: {},
    examenFisico: {},
    diagnosticoFuncional: '',
    conductaSeguirObjetivos: '',
    objetivosFamilia: '',

    // Información del profesional (desde extensiones)
    profesional: {
      nombre: 'No disponible',
      apellido: 'No disponible',
      dni: 'No disponible',
    },
  };

  // Extraer información de las extensiones
  if (diagnosticReport.extension && Array.isArray(diagnosticReport.extension)) {
    diagnosticReport.extension.forEach((extension) => {
      const url = extension.url;
      const value = extension.valueString || extension.value?.toString() || '';

      switch (url) {
        case 'http://example.org/fhir/StructureDefinition/report-hash-id':
          historiaFisiatrica.hashId = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/ehr-id':
          historiaFisiatrica.ehrId = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/historia-tipo':
          historiaFisiatrica.tipo = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-name':
          historiaFisiatrica.profesional.nombre = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-lastname':
          historiaFisiatrica.profesional.apellido = value;
          break;
        case 'http://example.org/fhir/StructureDefinition/user-dni':
          historiaFisiatrica.profesional.dni = value;
          break;

        // Mapear extensiones de evaluación y consulta
        case 'http://mi-servidor.com/fhir/StructureDefinition/derivados-por':
          historiaFisiatrica.derivadosPor = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/medicacion-actual':
          historiaFisiatrica.medicacionActual = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/antecedentes-cuadro':
          historiaFisiatrica.antecedentesCuadro = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/estudios-realizados':
          historiaFisiatrica.estudiosRealizados = value;
          break;

        // Mapear extensiones de antecedentes
        case 'http://mi-servidor.com/fhir/StructureDefinition/antecedentes-hereditarios':
          historiaFisiatrica.antecedentesHereditarios = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/antecedentes-patologicos':
          historiaFisiatrica.antecedentesPatologicos = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/antecedentes-quirurgicos':
          historiaFisiatrica.antecedentesQuirurgicos = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/antecedentes-metabolicos':
          historiaFisiatrica.antecedentesMetabolicos = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/antecedentes-inmunologicos':
          historiaFisiatrica.antecedentesInmunologicos = value;
          break;

        // Mapear extensiones de fisiológicos
        case 'http://mi-servidor.com/fhir/StructureDefinition/fisiologicos-dormir':
          historiaFisiatrica.fisiologicosDormir = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/fisiologicos-alimentacion':
          historiaFisiatrica.fisiologicosAlimentacion = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/fisiologicos-catarsis':
          historiaFisiatrica.fisiologicosCatarsis = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/fisiologicos-diuresis':
          historiaFisiatrica.fisiologicosDiuresis = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/fisiologicos-periodo-menstrual':
          historiaFisiatrica.fisiologicosPeriodoMenstrual = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/fisiologicos-sexualidad':
          historiaFisiatrica.fisiologicosSexualidad = value;
          break;

        // Mapear extensiones de diagnóstico funcional
        case 'http://mi-servidor.com/fhir/StructureDefinition/diagnostico-funcional':
          historiaFisiatrica.diagnosticoFuncional = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/conducta-objetivos':
          historiaFisiatrica.conductaSeguirObjetivos = value;
          break;
        case 'http://mi-servidor.com/fhir/StructureDefinition/objetivos-familia':
          historiaFisiatrica.objetivosFamilia = value;
          break;
      }
    });
  }

  // Parsear el contenido de la conclusión para extraer los campos específicos
  if (
    historiaFisiatrica.contenido &&
    historiaFisiatrica.contenido !== 'Sin contenido'
  ) {
    parsearContenidoHistoria(historiaFisiatrica, diagnosticReport.conclusion);
  }

  // Formatear fecha si es posible
  if (
    historiaFisiatrica.fechaCreacion &&
    historiaFisiatrica.fechaCreacion !== 'Fecha no disponible'
  ) {
    try {
      const fecha = new Date(historiaFisiatrica.fechaCreacion);
      historiaFisiatrica.fechaCreacion = fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.warn(
        'Error al formatear fecha de la historia fisiatrica:',
        error,
      );
    }
  }

  // Crear nombre completo del profesional
  historiaFisiatrica.profesional.nombreCompleto =
    `${historiaFisiatrica.profesional.nombre} ${historiaFisiatrica.profesional.apellido}`.trim();

  return historiaFisiatrica;
}

/**
 * Parsea el contenido de la conclusión para extraer los campos específicos de la historia fisiatrica
 * @param {Object} historiaFisiatrica - Objeto de la historia fisiatrica a actualizar
 * @param {string} conclusion - Contenido de la conclusión del DiagnosticReport
 */
function parsearContenidoHistoria(historiaFisiatrica, conclusion) {
  if (!conclusion) return;

  const secciones = {
    'ANTECEDENTES:': 'antecedentes',
    'MEDICACIÓN ACTUAL:': 'medicacionActual',
    'ESTUDIOS REALIZADOS:': 'estudiosRealizados',
    'DATOS FISIOLÓGICOS:': 'fisiologico',
    'ANAMNESIS SISTÉMICA:': 'anamnesisSistemica',
    'EXAMEN FÍSICO:': 'examenFisico',
    'DIAGNÓSTICO FUNCIONAL:': 'diagnosticoFuncional',
    'CONDUCTA A SEGUIR:': 'conductaSeguir',
  };

  const lineas = conclusion.split('\n');
  let seccionActual = null;
  let contenidoSeccion = [];

  for (const linea of lineas) {
    const lineaTrim = linea.trim();

    // Verificar si es el inicio de una nueva sección
    if (secciones[lineaTrim]) {
      // Guardar la sección anterior si existe
      if (seccionActual && contenidoSeccion.length > 0) {
        guardarSeccion(historiaFisiatrica, seccionActual, contenidoSeccion);
      }

      // Iniciar nueva sección
      seccionActual = secciones[lineaTrim];
      contenidoSeccion = [];
    } else if (seccionActual && lineaTrim) {
      // Agregar línea al contenido de la sección actual
      contenidoSeccion.push(lineaTrim);
    }
  }

  // Guardar la última sección
  if (seccionActual && contenidoSeccion.length > 0) {
    guardarSeccion(historiaFisiatrica, seccionActual, contenidoSeccion);
  }
}

/**
 * Guarda el contenido de una sección en el objeto de historia fisiatrica
 * @param {Object} historiaFisiatrica - Objeto de la historia fisiatrica
 * @param {string} seccion - Nombre de la sección
 * @param {Array} contenido - Array de líneas de contenido
 */
function guardarSeccion(historiaFisiatrica, seccion, contenido) {
  const contenidoTexto = contenido.join('\n').trim();

  if (['fisiologico', 'anamnesisSistemica', 'examenFisico'].includes(seccion)) {
    // Para campos JSON, intentar parsear el contenido
    try {
      // Buscar patrones de clave-valor en el contenido
      const jsonData = {};
      contenido.forEach((linea) => {
        if (linea.startsWith('- ')) {
          const partes = linea.substring(2).split(': ');
          if (partes.length === 2) {
            const clave = partes[0].toLowerCase().replace(/\s+/g, '_');
            const valor = partes[1].trim();
            if (valor && valor !== '') {
              jsonData[clave] = valor;
            }
          }
        }
      });
      historiaFisiatrica[seccion] =
        Object.keys(jsonData).length > 0 ? jsonData : {};
    } catch (error) {
      console.warn(`Error al parsear JSON para ${seccion}:`, error);
      historiaFisiatrica[seccion] = {};
    }
  } else {
    // Para campos de texto simple
    historiaFisiatrica[seccion] = contenidoTexto;
  }
}

export default {
  extractFhirResources,
  extractResourcesByType,
  extractFirstResource,
  extractResourcesWithMetadata,
  extractCleanResources,
  hasResources,
  getResourceCount,
  filterResources,
  mapResources,
  findResourceById,
  findResourcesByName,
  getResponseStats,
  getExtensionValue,
  getExtensionValues,
  getIdentifierValue,
  transformarDiagnosticReport,
  transformarComentario,
  transformarHistoriaFisiatrica,
};
