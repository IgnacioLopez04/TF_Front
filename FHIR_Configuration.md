# Configuración FHIR - Frontend Vue.js

## Problema Resuelto

El error anterior:
```
ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException: HAPI-0302: Unknown resource type 'abm'
```

Se debía a que estabas usando URLs de API REST (`/abm/*`) en lugar de URLs FHIR estándar.

## URLs Configuradas

### **Antes (Incorrecto):**
```javascript
// ❌ Estaba apuntando a la API REST
const urlAbm = 'http://localhost:3000/abm';

// URLs incorrectas
`${urlAbm}/Location?_type=province`  // → http://localhost:3000/abm/Location?_type=province
`${urlAbm}/Organization?_type=insurance`  // → http://localhost:3000/abm/Organization?_type=insurance
```

### **Después (Correcto):**
```javascript
// ✅ Ahora apunta al servidor FHIR
const urlFhir = 'http://localhost:8080/fhir';
const urlFhirLocation = 'http://localhost:8080/fhir/Location';
const urlFhirOrganization = 'http://localhost:8080/fhir/Organization';

// URLs correctas
`${urlFhirLocation}?_type=province`  // → http://localhost:8080/fhir/Location?_type=province
`${urlFhirOrganization}?_type=insurance`  // → http://localhost:8080/fhir/Organization?_type=insurance
```

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```bash
# Backend API URLs
VITE_BACKEND_URL=http://localhost:3000
VITE_AUTH_URL=http://localhost:8080
VITE_FHIR_URL=http://localhost:8080

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Application Configuration
VITE_APP_TITLE=Sistema de Historias Clínicas
VITE_APP_VERSION=1.0.0
```

## Endpoints FHIR Disponibles

### **Location (Ubicaciones)**
- **Provincias**: `GET /fhir/Location?_type=province`
- **Ciudades**: `GET /fhir/Location?_type=city`
- **Ciudades por Provincia**: `GET /fhir/Location?_type=city&partof=Location/{id_provincia}`

### **Organization (Organizaciones)**
- **Mutuales**: `GET /fhir/Organization?_type=insurance`
- **Prestaciones**: `GET /fhir/Organization?_type=program`

### **Patient (Pacientes)**
- **Obtener Paciente**: `GET /fhir/Patient/{dni}`
- **Crear Paciente**: `POST /fhir/Patient`

## Cambios Realizados

### **1. Archivo `utils/index.js`**
```javascript
// Agregadas nuevas URLs FHIR
export const urlFhir = `${FHIR_URL}/fhir`;
export const urlFhirLocation = `${urlFhir}/Location`;
export const urlFhirOrganization = `${urlFhir}/Organization`;
export const urlFhirPatient = `${urlFhir}/Patient`;
```

### **2. Archivo `store/actions.js`**
```javascript
// Cambiadas las URLs de ABM a FHIR
export const obtenerProvincias = async () => {
  const response = await useAxios.get(`${urlFhirLocation}?_type=province`);
  return response.data;
};

export const obtenerCiudades = async (id_provincia) => {
  const response = await useAxios.get(
    `${urlFhirLocation}?_type=city&partof=Location/${id_provincia}`
  );
  return response.data;
};
```

## Verificación

### **1. Test con curl**
```bash
# Provincias
curl -H "Authorization: Bearer {token}" \
     "http://localhost:8080/fhir/Location?_type=province"

# Ciudades
curl -H "Authorization: Bearer {token}" \
     "http://localhost:8080/fhir/Location?_type=city"

# Mutuales
curl -H "Authorization: Bearer {token}" \
     "http://localhost:8080/fhir/Organization?_type=insurance"
```

### **2. Test en el Frontend**
- Las funciones `obtenerProvincias()`, `obtenerCiudades()`, etc. ahora deberían funcionar
- Verifica en la consola del navegador que las URLs sean correctas
- Los datos deberían venir en formato FHIR estándar

## Estructura de Respuesta FHIR

### **Location (Provincia)**
```json
{
  "resourceType": "Bundle",
  "entry": [
    {
      "resource": {
        "resourceType": "Location",
        "id": "1",
        "name": "Buenos Aires",
        "status": "active",
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                "code": "PROV",
                "display": "Provincia"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### **Organization (Mutual)**
```json
{
  "resourceType": "Bundle",
  "entry": [
    {
      "resource": {
        "resourceType": "Organization",
        "id": "1",
        "name": "Mutual Ejemplo",
        "active": true,
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/organization-type",
                "code": "INS",
                "display": "Insurance Company"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## Notas Importantes

- **Autenticación**: Todos los endpoints FHIR requieren token JWT válido
- **CORS**: Configurado para permitir `localhost:8081` y `localhost:3000`
- **Formato**: Las respuestas vienen en formato FHIR estándar (Bundle)
- **Filtros**: Usa los parámetros FHIR estándar como `_type`, `partof`, etc.
