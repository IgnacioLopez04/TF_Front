# FHIR Helper - Guía de Uso

## 🎯 **Propósito**

El `fhirHelper` es una utilidad robusta que procesa respuestas FHIR del servidor, manejando tanto respuestas **Bundle** como respuestas **simples**, asegurando que siempre obtengas los recursos que necesitas.

## 🚀 **Funciones Principales**

### **1. `extractFhirResources(data, options)`**
Función principal que extrae recursos de cualquier respuesta FHIR.

```javascript
import { extractFhirResources } from '@/utils/fhirHelper';

// Uso básico
const resources = extractFhirResources(response.data);

// Con opciones
const resources = extractFhirResources(response.data, {
  resourceType: 'Location',        // Solo recursos Location
  removeExtensions: true,          // Remover extensiones personalizadas
  keepMetadata: true               // Mantener metadatos del Bundle
});
```

### **2. `extractResourcesByType(data, resourceType)`**
Extrae solo recursos de un tipo específico.

```javascript
import { extractResourcesByType } from '@/utils/fhirHelper';

// Solo provincias (Location)
const provincias = extractResourcesByType(response.data, 'Location');

// Solo mutuales (Organization)
const mutuales = extractResourcesByType(response.data, 'Organization');
```

### **3. `extractFirstResource(data, resourceType)`**
Obtiene solo el primer recurso encontrado.

```javascript
import { extractFirstResource } from '@/utils/fhirHelper';

// Primer paciente
const paciente = extractFirstResource(response.data, 'Patient');

// Primer recurso de cualquier tipo
const primerRecurso = extractFirstResource(response.data);
```

## 📋 **Casos de Uso Comunes**

### **Procesar Respuesta de Provincias**
```javascript
export const obtenerProvincias = async () => {
  try {
    const response = await useAxios.get(`${urlFhirLocation}?_type=province`);
    const resources = extractFhirResources(response.data);

    return resources;
  } catch (error) {
    console.error('Error obteniendo provincias:', error);
    throw error;
  }
};
```

### **Filtrar por Tipo de Recurso**
```javascript
// Solo provincias activas
const provinciasActivas = extractFhirResources(response.data, {
  resourceType: 'Location'
}).filter(provincia => provincia.status === 'active');
```

### **Buscar Recurso por ID**
```javascript
import { findResourceById } from '@/utils/fhirHelper';

const provincia = findResourceById(response.data, '1');
if (provincia) {
  // usar provincia.name
}
```

### **Buscar por Nombre**
```javascript
import { findResourcesByName } from '@/utils/fhirHelper';

const provinciasBuenosAires = findResourcesByName(response.data, 'Buenos Aires');
```

## 🔧 **Opciones de Configuración**

### **Opciones de `extractFhirResources`**

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `resourceType` | `string` | `null` | Filtrar por tipo específico de recurso |
| `removeExtensions` | `boolean` | `false` | Remover extensiones personalizadas |
| `keepMetadata` | `boolean` | `false` | Mantener metadatos del Bundle |
| `flatten` | `boolean` | `true` | Aplanar arrays anidados |

### **Ejemplos de Uso con Opciones**

```javascript
// Solo recursos Location, sin extensiones
const locations = extractFhirResources(response.data, {
  resourceType: 'Location',
  removeExtensions: true
});

// Recursos con metadatos del Bundle
const resourcesWithMeta = extractFhirResources(response.data, {
  keepMetadata: true
});

// Solo el primer tipo de recurso encontrado
const firstType = extractFhirResources(response.data, {
  resourceType: 'Organization'
});
```

## 📊 **Funciones de Análisis**

### **Estadísticas de Respuesta**
```javascript
import { getResponseStats } from '@/utils/fhirHelper';

const stats = getResponseStats(response.data);
// stats.total, stats.types, stats.hasBundle
```

### **Conteo de Recursos**
```javascript
import { getResourceCount } from '@/utils/fhirHelper';

const total = getResourceCount(response.data);
```

### **Verificar si Hay Recursos**
```javascript
import { hasResources } from '@/utils/fhirHelper';

if (hasResources(response.data)) {
  // la respuesta contiene recursos
} else {
  // no se encontraron recursos
}
```

## 🔍 **Funciones de Búsqueda y Filtrado**

### **Filtrado Personalizado**
```javascript
import { filterResources } from '@/utils/fhirHelper';

// Solo provincias con más de 1000 habitantes
const provinciasGrandes = filterResources(response.data, provincia => 
  provincia.population > 1000
);

// Solo mutuales activas
const mutualesActivas = filterResources(response.data, mutual => 
  mutual.active === true
);
```

### **Transformación de Recursos**
```javascript
import { mapResources } from '@/utils/fhirHelper';

// Convertir a formato simple
const nombresProvincias = mapResources(response.data, provincia => ({
  id: provincia.id,
  nombre: provincia.name,
  estado: provincia.status
}));
```

## 🛡️ **Manejo de Errores**

El helper maneja automáticamente casos problemáticos:

```javascript
// Si la respuesta es null/undefined
const resources = extractFhirResources(null); // Retorna []

// Si la respuesta no es FHIR válida
const resources = extractFhirResources({ invalid: 'data' }); // Retorna []

// Si es un Bundle sin entries
const resources = extractFhirResources({ resourceType: 'Bundle' }); // Retorna []
```

## 📝 **Logs y Debug**

El helper proporciona logs informativos:

```javascript
// En consola verás:
// "FHIR Helper: Bundle procesado, 5 recursos extraídos"
// "FHIR Helper: data no es un recurso FHIR válido: {...}"
// "FHIR Helper: formato de data no reconocido: string"
```

## 🎯 **Casos de Uso Avanzados**

### **Procesar Respuesta con Metadatos**
```javascript
const resourcesWithMeta = extractFhirResources(response.data, {
  keepMetadata: true
});

resourcesWithMeta.forEach(resource => {
  if (resource._bundleMetadata) {
    // resource._bundleMetadata.index, resource._bundleMetadata.search
  }
});
```

### **Combinar Múltiples Respuestas**
```javascript
const todasLasProvincias = [];

// Respuesta 1
const resp1 = extractFhirResources(response1.data, { resourceType: 'Location' });
todasLasProvincias.push(...resp1);

// Respuesta 2
const resp2 = extractFhirResources(response2.data, { resourceType: 'Location' });
todasLasProvincias.push(...resp2);

// Eliminar duplicados
const unicas = [...new Map(todasLasProvincias.map(p => [p.id, p])).values()];
```

## ✅ **Ventajas del Helper**

1. **Robusto**: Maneja cualquier formato de respuesta FHIR
2. **Flexible**: Múltiples opciones de configuración
3. **Seguro**: Manejo automático de errores y casos edge
4. **Informativo**: Logs detallados para debugging
5. **Eficiente**: Procesamiento optimizado de recursos
6. **Estándar**: Compatible con FHIR R5

## 🔄 **Migración desde el Helper Anterior**

### **Antes:**
```javascript
const processFhirResponse = (data) => {
  if (data.resourceType === 'Bundle' && data.entry) {
    return data.entry.map(entry => entry.resource);
  }
  return data;
};
```

### **Después:**
```javascript
import { extractFhirResources } from '@/utils/fhirHelper';

const resources = extractFhirResources(response.data);
```

El nuevo helper es **completamente compatible** con el anterior pero mucho más robusto y funcional.
