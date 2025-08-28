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
};
