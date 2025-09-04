import { useAxios } from '@/composables/useAxios';
import {
  urlAbm,
  urlFhirLocation,
  urlFhirOrganization,
  urlFhirPatient,
} from '@/utils';
import { extractFhirResources } from '@/utils/fhirHelper';

export default {
  async crearPaciente(pacienteData) {
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
          // Extensión para tutores si existen
          ...(pacienteData.tutores && pacienteData.tutores.length > 0
            ? [
                {
                  url: 'http://mi-servidor.com/fhir/StructureDefinition/tutores',
                  valueString: JSON.stringify(pacienteData.tutores),
                },
              ]
            : []),
        ].filter(
          (ext) =>
            (ext.valueString !== undefined &&
              ext.valueString !== null &&
              ext.valueString !== '') ||
            ext.valueBoolean !== undefined,
        ),
      };

      console.log(
        'Objeto FHIR a enviar:',
        JSON.stringify(fhirPatient, null, 2),
      );

      const response = await useAxios.post(`${urlFhirPatient}`, fhirPatient);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async obtenerProvincias() {
    try {
      const response = await useAxios.get(`${urlFhirLocation}?_type=province`);
      const resources = extractFhirResources(response.data);

      return resources;
    } catch (error) {
      throw error;
    }
  },

  async obtenerCiudades(id_provincia) {
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
  },

  async obtenerMutuales() {
    try {
      const response = await useAxios.get(
        `${urlFhirOrganization}?_type=insurance`,
      );
      const resources = extractFhirResources(response.data);

      this.opcionesMutual = resources;
      return resources;
    } catch (error) {
      throw error;
    }
  },

  async obtenerPrestaciones() {
    try {
      const response = await useAxios.get(
        `${urlFhirOrganization}?_type=program`,
      );
      const resources = extractFhirResources(response.data);
      this.opcionesPrestacion = resources;
      return resources;
    } catch (error) {
      throw error;
    }
  },

  async obtenerPacientes() {
    try {
      const response = await useAxios.get(`${urlFhirPatient}?_type=patient`);
      const resources = extractFhirResources(response.data);

      const pacientes = resources.map((resource) => {
        return {
          dni: resource.id,
          nombre: resource.name[0].given[0],
          apellido: resource.name[0].family,
          prestacion: resource.extension[0].valueString,
          iniciales: resource.name[0].given[0][0] + resource.name[0].family[0],
        };
      });

      this.pacientes = pacientes;
    } catch (error) {
      throw error;
    }
  },

  async limpiarPaciente() {
    this.paciente = {
      nombre: '',
      apellido: '',
      dni: '',
      prestacion: null,
      fechaNacimiento: null,
      ocupacionActual: '',
      ocupacionAnterior: '',
      calle: '',
      numero: '',
      pisoDepto: '',
      barrio: '',
      localidad: '',
      provincia: '',
      conQuienVive: '',
      mutual: null,
      numeroAfiliado: '',
      tutores: [],
      activo: true,
      fechaCreacion: null,
      fechaModificacion: null,
    };
  },

  async limpiarTutores() {
    this.tutores = [];
    this.tutor = {
      nombre: '',
      dni: '',
      fechaNacimiento: null,
      ocupacion: '',
      lugarNacimiento: '',
    };
  },
};
