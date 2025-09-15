import { useAxios } from '@/composables/useAxios';
import {
  urlAbm,
  urlFhirLocation,
  urlFhirOrganization,
  urlFhirPatient,
  urlFhirReport,
} from '@/utils';
import {
  extractFhirResources,
  getExtensionValues,
  getIdentifierValue,
} from '@/utils/fhirHelper';

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
        // Obtener extensiones usando la función helper
        const extensionValues = getExtensionValues(resource.extension, {
          'http://mi-servidor/fhir/StructureDefinition/hash-id': 'hash_id',
          'http://mi-servidor/fhir/StructureDefinition/prestacion':
            'prestacion',
        });

        // Obtener DNI del identificador FHIR
        const dni = getIdentifierValue(
          resource.identifier,
          'http://mi-servidor.com/fhir/dni',
        );
        return {
          dni: dni, // Obtener DNI del identificador FHIR
          hash_id: extensionValues.hash_id || resource.id, // Usar hash_id como ID principal
          nombre: resource.name[0].given[0],
          apellido: resource.name[0].family,
          prestacion: extensionValues.prestacion,
          iniciales: resource.name[0].given[0][0] + resource.name[0].family[0],
        };
      });

      this.pacientes = pacientes;
    } catch (error) {
      throw error;
    }
  },

  async obtenerPaciente(hash_id) {
    try {
      const response = await useAxios.get(`${urlFhirPatient}/${hash_id}`);
      const resource = extractFhirResources(response.data);

      const dni = getIdentifierValue(
        resource[0].identifier,
        'http://mi-servidor.com/fhir/dni',
      );

      const extensionValues = getExtensionValues(resource[0].extension, {
        'http://mi-servidor/fhir/StructureDefinition/hash-id': 'hash_id',
        'http://mi-servidor/fhir/StructureDefinition/prestacion': 'prestacion',
      });

      const data = {
        hashId: resource[0].id,
        dni: dni,
        nombre: resource[0].name[0].given[0],
        apellido: resource[0].name[0].family,
        prestacion: extensionValues.prestacion,
        iniciales:
          resource[0].name[0].given[0][0] + resource[0].name[0].family[0],
      };
      return data;
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

  async crearInforme(informeData) {
    try {
      // Crear el recurso DiagnosticReport FHIR
      const diagnosticReport = {
        resourceType: 'DiagnosticReport',
        status: 'final',
        code: {
          text: informeData.titulo || 'Reporte de Diagnóstico',
        },
        conclusion: informeData.contenido || '',
        subject: {
          reference: `Patient/${informeData.dniPaciente}`,
        },
        extension: [
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/patient-dni',
            valueString: informeData.dniPaciente,
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/user-id',
            valueString: informeData.idUsuario,
          },
        ],
      };

      // Agregar extensiones opcionales si están presentes
      if (informeData.idEspecialidad) {
        diagnosticReport.extension.push({
          url: 'http://mi-servidor/fhir/StructureDefinition/speciality-id',
          valueString: informeData.idEspecialidad,
        });
      }

      if (informeData.idHistoriaClinica) {
        diagnosticReport.extension.push({
          url: 'http://mi-servidor/fhir/StructureDefinition/ehr-id',
          valueString: informeData.idHistoriaClinica,
        });
      }

      if (informeData.tipoReporte) {
        diagnosticReport.extension.push({
          url: 'http://mi-servidor/fhir/StructureDefinition/report-type',
          valueString: informeData.tipoReporte,
        });
      }

      // Enviar al servidor FHIR
      const response = await useAxios.post(urlFhirReport, diagnosticReport);
      return response.data;
    } catch (error) {
      console.error('Error en crearInforme:', error);
      throw error;
    }
  },
};
