import { useAxios } from '@/composables/useAxios';
import {
  urlAbm,
  urlFhirLocation,
  urlFhirOrganization,
  urlFhirPatient,
} from '@/utils';
import { extractFhirResources, getResponseStats } from '@/utils/fhirHelper';

export const crearPaciente = async (pacienteData) => {
  try {
    const fhirPatient = {
      resourceType: 'Patient',
      identifier: [
        {
          system: 'http://mi-servidor.com/fhir/dni',
          value: pacienteData.dni,
        },
      ],
      name: [
        {
          family: pacienteData.apellido,
          given: [pacienteData.nombre],
        },
      ],
      birthDate: pacienteData.fechaNacimiento,
      telecom: pacienteData.telefono
        ? [
            {
              system: 'phone',
              value: pacienteData.telefono,
            },
          ]
        : [],
      // Extensiones para campos personalizados
      extension: [
        {
          url: 'http://mi-servidor.com/fhir/StructureDefinition/id_ciudad',
          valueString: pacienteData.localidad,
        },
        {
          url: 'http://mi-servidor.com/fhir/StructureDefinition/barrio',
          valueString: pacienteData.barrio,
        },
        {
          url: 'http://mi-servidor.com/fhir/StructureDefinition/calle',
          valueString: pacienteData.calle,
        },
        {
          url: 'http://mi-servidor.com/fhir/StructureDefinition/id_prestacion',
          valueString: pacienteData.prestacion,
        },
        {
          url: 'http://mi-servidor.com/fhir/StructureDefinition/piso_departamento',
          valueString: pacienteData.pisoDepto,
        },
        {
          url: 'http://mi-servidor.com/fhir/StructureDefinition/inactivo',
          valueBoolean: !pacienteData.activo,
        },
      ].filter(
        (ext) =>
          (ext.valueString !== undefined &&
            ext.valueString !== null &&
            ext.valueString !== '') ||
          ext.valueBoolean !== undefined,
      ),
    };

    const response = await useAxios.post(`${urlFhirPatient}`, fhirPatient);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const obtenerProvincias = async () => {
  try {
    const response = await useAxios.get(`${urlFhirLocation}?_type=province`);
    const resources = extractFhirResources(response.data);

    return resources;
  } catch (error) {
    throw error;
  }
};

export const obtenerCiudades = async (id_provincia) => {
  try {
    // Usar el nuevo endpoint específico para ciudades por provincia
    const response = await useAxios.get(
      `${urlFhirLocation}?provincia=${id_provincia}`,
    );
    const resources = extractFhirResources(response.data);
    return resources;
  } catch (error) {
    throw error;
  }
};

export const obtenerMutuales = async () => {
  try {
    const response = await useAxios.get(
      `${urlFhirOrganization}?_type=insurance`,
    );
    const resources = extractFhirResources(response.data);
    console.log(resources);

    return resources;
  } catch (error) {
    throw error;
  }
};

export const obtenerPrestaciones = async () => {
  try {
    const response = await useAxios.get(`${urlFhirOrganization}?_type=program`);
    const resources = extractFhirResources(response.data);
    return resources;
  } catch (error) {
    throw error;
  }
};
