import { useAxios } from '@/composables/useAxios';
import {
  urlFhirLocation,
  urlFhirOrganization,
  urlFhirPatient,
  urlFhirReport,
  urlFhirDocumentReference,
  urlFile,
} from '@/utils';
import { FHIR_URL } from '@/utils';
import {
  extractFhirResources,
  getExtensionValues,
  getIdentifierValue,
  transformarDiagnosticReport,
  transformarComentario,
  transformarHistoriaFisiatrica,
} from '@/utils/fhirHelper';
import FhirService from '@/services/fhirService';
import { useAuthStore } from '@/modules/auth/store';
const authStore = useAuthStore();

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
            url: 'http://mi-servidor.com/fhir/StructureDefinition/con_quien_vive',
            valueString: pacienteData.conQuienVive,
          },
          {
            url: 'http://mi-servidor.com/fhir/StructureDefinition/inactivo',
            valueBoolean: !pacienteData.activo,
          },
          ...(pacienteData.mutual != null && pacienteData.mutual !== ''
            ? [{ url: 'http://mi-servidor.com/fhir/StructureDefinition/id_mutual', valueString: String(pacienteData.mutual) }]
            : []),
          ...(pacienteData.numeroAfiliado
            ? [{ url: 'http://mi-servidor.com/fhir/StructureDefinition/numero_afiliado', valueString: pacienteData.numeroAfiliado }]
            : []),
          ...(pacienteData.ocupacionActual
            ? [{ url: 'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_actual', valueString: pacienteData.ocupacionActual }]
            : []),
          ...(pacienteData.ocupacionAnterior
            ? [{ url: 'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_anterior', valueString: pacienteData.ocupacionAnterior }]
            : []),
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
          'http://mi-servidor.com/fhir/StructureDefinition/hash-id': 'hash_id',
          'http://mi-servidor.com/fhir/StructureDefinition/prestacion':
            'prestacion',
          'http://mi-servidor.com/fhir/StructureDefinition/ultima-modificacion':
            'ultimaModificacion',
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
          ultimaModificacion: extensionValues.ultimaModificacion ?? null,
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
        'http://mi-servidor.com/fhir/StructureDefinition/hash-id': 'hash_id',
        'http://mi-servidor.com/fhir/StructureDefinition/prestacion':
          'prestacion',
        'http://mi-servidor.com/fhir/StructureDefinition/hash-id-ehr':
          'hash_id_EHR',
        'http://mi-servidor.com/fhir/StructureDefinition/ultima-modificacion':
          'ultimaModificacion',
      });

      const data = {
        hashId: resource[0].id,
        dni: dni,
        nombre: resource[0].name[0].given[0],
        apellido: resource[0].name[0].family,
        prestacion: extensionValues.prestacion,
        iniciales:
          resource[0].name[0].given[0][0] + resource[0].name[0].family[0],
        hashIdEHR: extensionValues.hash_id_EHR,
        ultimaModificacion: extensionValues.ultimaModificacion ?? null,
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
      hashId: '',
      hashIdEHR: '',
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

  inicializarHistoriaFisiatrica() {
    this.historiaFisiatrica = {
      // Evaluación y Consulta
      fechaEvaluacion: null,
      derivadosPor: '',
      antecedentesCuadro: '',
      medicacionActual: '',
      estudiosRealizados: '',

      // Antecedentes
      antecedentesHereditarios: '',
      antecedentesPatologicos: '',
      antecedentesQuirurgicos: '',
      antecedentesMetabolicos: '',
      antecedentesInmunologicos: '',

      // Fisiológicos
      fisiologicosDormir: '',
      fisiologicosAlimentacion: '',
      fisiologicosCatarsis: '',
      fisiologicosDiuresis: '',
      fisiologicosPeriodoMenstrual: '',
      fisiologicosSexualidad: '',

      // Anamnesis sistémica
      anamnesisComunicacion: '',
      anamnesisMotricidad: '',
      anamnesisVidaDiaria: '',

      // Examen físico - General
      examenActitud: '',
      examenComunicacionCodigos: '',
      examenPielFaneras: '',

      // Examen físico - Cabeza y sentidos
      examenCabeza: '',
      examenOjos: '',
      examenMovimientosAnormales: '',
      examenEstrabismo: '',
      examenOrejas: '',
      examenAudicion: '',
      examenLabios: '',
      examenDenticion: '',
      examenPaladarVelo: '',
      examenMordida: '',
      examenMaxilares: '',
      examenBoca: '',
      examenLengua: '',

      // Examen físico - Tronco y extremidades
      examenTorax: '',
      examenAbdomen: '',
      examenColumnaVertebral: '',
      examenPelvis: '',
      examenCaderas: '',
      examenMmii: '',
      examenPies: '',
      examenMmss: '',
      examenManos: '',
      examenLateralidad: '',

      // Examen físico - Sistema y actividades
      examenApRespiratorio: '',
      examenApCardiovascular: '',
      examenApDigestivo: '',
      examenActividadRefleja: '',
      examenActividadSensoperceptual: '',
      examenReaccionesPosturales: '',
      examenDesplazamientoMarcha: '',
      examenEtapaDesarrollo: '',

      // Diagnóstico funcional
      diagnosticoFuncional: '',
      conductaSeguirObjetivos: '',
      objetivosFamilia: '',
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

      if (informeData.hashIdEHR) {
        diagnosticReport.extension.push({
          url: 'http://example.org/fhir/StructureDefinition/ehr-id',
          valueString: informeData.hashIdEHR,
        });
      }

      if (informeData.tipoReporte) {
        diagnosticReport.extension.push({
          url: 'http://mi-servidor/fhir/StructureDefinition/report-type',
          valueString: informeData.tipoReporte,
        });
      }

      // Enviar al servidor FHIR (endpoint específico de creación de reportes)
      const response = await useAxios.post(
        `${urlFhirReport}/$create-report`,
        diagnosticReport,
      );
      return response.data;
    } catch (error) {
      console.error('Error en crearInforme:', error);
      throw error;
    }
  },

  async obtenerInformes(hashId) {
    try {
      const response = await useAxios.get(
        `${urlFhirReport}/$list-reports?patient=${hashId}`,
      );
      const resources = extractFhirResources(response.data);

      // Transformar los DiagnosticReports a formato legible
      const informesLegibles = resources.map((reporte) =>
        transformarDiagnosticReport(reporte),
      );

      this.informes = informesLegibles;

      return informesLegibles;
    } catch (error) {
      throw error;
    }
  },

  async crearComentario(comentarioData, reportHashId) {
    try {
      if (!reportHashId) {
        throw new Error(
          'El hashId del informe es requerido para crear un comentario',
        );
      }

      // Crear el recurso DiagnosticReport FHIR para el anexo
      const diagnosticReport = {
        resourceType: 'DiagnosticReport',
        status: 'final',
        code: {
          text: 'Comentario',
        },
        conclusion: comentarioData.texto || '',
        subject: {
          reference: `DiagnosticReport/${reportHashId}`,
        },
        extension: [
          {
            url: 'http://example.org/fhir/StructureDefinition/is-annex',
            valueBoolean: true,
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/user-id',
            valueString: comentarioData.idUsuario || '',
          },
        ],
      };

      // Enviar al servidor FHIR usando operación específica para anexos
      const response = await useAxios.post(
        `${urlFhirReport}/$create-annex`,
        diagnosticReport,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async obtenerComentarios(hashIdInforme) {
    try {
      const response = await useAxios.get(
        `${urlFhirReport}?annex=${hashIdInforme}`,
      );
      const resources = extractFhirResources(response.data);

      const comentariosLegibles = resources.map((anexo) =>
        transformarComentario(anexo),
      );

      return comentariosLegibles;
    } catch (error) {
      throw error;
    }
  },

  async crearHistoriaFisiatrica(historiaFisiatricaData) {
    try {
      // 1. Crear el recurso FHIR
      const fhirResource = FhirService.createDiagnosticReport(
        historiaFisiatricaData,
        this.paciente.hashId,
      );

      // 2. Enviar al servidor FHIR intermedio (que se encarga de enviar al backend)
      const result = await FhirService.sendToFhirServer(fhirResource);

      if (result.success) {
        // Actualizar el estado local
        this.historiaFisiatrica = historiaFisiatricaData;

        return {
          success: true,
          fhirId: result.fhirId,
          message: 'Historia fisiátrica creada exitosamente',
        };
      } else {
        throw new Error('Error al crear recurso FHIR');
      }
    } catch (error) {
      console.error('Error al crear historia fisiátrica:', error);
      throw error;
    }
  },

  async obtenerHistoriaFisiatrica(hashId) {
    try {
      // Buscar la historia fisiatrica usando operación específica
      const response = await useAxios.get(
        `${urlFhirReport}/$get-historia?patient=${hashId}`,
      );
      const resources = extractFhirResources(response.data);

      // Filtrar solo las historias fisiatricas (usando el código LOINC específico)
      const historiasFisiatricas = resources.filter((resource) =>
        resource.code?.coding?.some(
          (coding) =>
            coding.system === 'http://loinc.org' && coding.code === '11450-4',
        ),
      );

      // Si hay historias, mapear la primera al objeto del state
      if (historiasFisiatricas.length > 0) {
        const historiaFHIR = transformarHistoriaFisiatrica(
          historiasFisiatricas[0],
        );

        // Mapear los datos de FHIR al objeto del state
        this.historiaFisiatrica = {
          // Evaluación y Consulta
          fechaEvaluacion:
            historiaFHIR.fechaCreacion ||
            new Date().toISOString().split('T')[0],
          derivadosPor: historiaFHIR.derivadosPor || 'No informado',
          antecedentesCuadro: historiaFHIR.antecedentesCuadro || 'No informado',
          medicacionActual: historiaFHIR.medicacionActual || 'No informado',
          estudiosRealizados: historiaFHIR.estudiosRealizados || 'No informado',

          // Antecedentes
          antecedentesHereditarios:
            historiaFHIR.antecedentesHereditarios || 'No informado',
          antecedentesPatologicos:
            historiaFHIR.antecedentesPatologicos || 'No informado',
          antecedentesQuirurgicos:
            historiaFHIR.antecedentesQuirurgicos || 'No informado',
          antecedentesMetabolicos:
            historiaFHIR.antecedentesMetabolicos || 'No informado',
          antecedentesInmunologicos:
            historiaFHIR.antecedentesInmunologicos || 'No informado',

          // Fisiológicos - mapear desde las extensiones FHIR
          fisiologicosDormir: historiaFHIR.fisiologicosDormir || 'No informado',
          fisiologicosAlimentacion:
            historiaFHIR.fisiologicosAlimentacion || 'No informado',
          fisiologicosCatarsis:
            historiaFHIR.fisiologicosCatarsis || 'No informado',
          fisiologicosDiuresis:
            historiaFHIR.fisiologicosDiuresis || 'No informado',
          fisiologicosPeriodoMenstrual:
            historiaFHIR.fisiologicosPeriodoMenstrual || 'No informado',
          fisiologicosSexualidad:
            historiaFHIR.fisiologicosSexualidad || 'No informado',

          // Anamnesis sistémica
          anamnesisComunicacion:
            historiaFHIR.anamnesisSistemica?.anamnesis_comunicacion ||
            'No informado',
          anamnesisMotricidad:
            historiaFHIR.anamnesisSistemica?.anamnesis_motricidad ||
            'No informado',
          anamnesisVidaDiaria:
            historiaFHIR.anamnesisSistemica?.anamnesis_vida_diaria ||
            'No informado',

          // Examen físico - General
          examenActitud:
            historiaFHIR.examenFisico?.examen_actitud || 'No informado',
          examenComunicacionCodigos:
            historiaFHIR.examenFisico?.examen_comunicacion_codigos ||
            'No informado',
          examenPielFaneras:
            historiaFHIR.examenFisico?.examen_piel_faneras || 'No informado',

          // Examen físico - Cabeza y sentidos
          examenCabeza:
            historiaFHIR.examenFisico?.examen_cabeza || 'No informado',
          examenOjos: historiaFHIR.examenFisico?.examen_ojos || 'No informado',
          examenMovimientosAnormales:
            historiaFHIR.examenFisico?.examen_movimientos_anormales ||
            'No informado',
          examenEstrabismo:
            historiaFHIR.examenFisico?.examen_estrabismo || 'No informado',
          examenOrejas:
            historiaFHIR.examenFisico?.examen_orejas || 'No informado',
          examenAudicion:
            historiaFHIR.examenFisico?.examen_audicion || 'No informado',
          examenLabios:
            historiaFHIR.examenFisico?.examen_labios || 'No informado',
          examenDenticion:
            historiaFHIR.examenFisico?.examen_denticion || 'No informado',
          examenPaladarVelo:
            historiaFHIR.examenFisico?.examen_paladar_velo || 'No informado',
          examenMordida:
            historiaFHIR.examenFisico?.examen_mordida || 'No informado',
          examenMaxilares:
            historiaFHIR.examenFisico?.examen_maxilares || 'No informado',
          examenBoca: historiaFHIR.examenFisico?.examen_boca || 'No informado',
          examenLengua:
            historiaFHIR.examenFisico?.examen_lengua || 'No informado',

          // Examen físico - Tronco y extremidades
          examenTorax:
            historiaFHIR.examenFisico?.examen_torax || 'No informado',
          examenAbdomen:
            historiaFHIR.examenFisico?.examen_abdomen || 'No informado',
          examenColumnaVertebral:
            historiaFHIR.examenFisico?.examen_columna_vertebral ||
            'No informado',
          examenPelvis:
            historiaFHIR.examenFisico?.examen_pelvis || 'No informado',
          examenCaderas:
            historiaFHIR.examenFisico?.examen_caderas || 'No informado',
          examenMmii: historiaFHIR.examenFisico?.examen_mmii || 'No informado',
          examenPies: historiaFHIR.examenFisico?.examen_pies || 'No informado',
          examenMmss: historiaFHIR.examenFisico?.examen_mmss || 'No informado',
          examenManos:
            historiaFHIR.examenFisico?.examen_manos || 'No informado',
          examenLateralidad:
            historiaFHIR.examenFisico?.examen_lateralidad || 'No informado',

          // Examen físico - Sistema y actividades
          examenApRespiratorio:
            historiaFHIR.examenFisico?.examen_ap_respiratorio || 'No informado',
          examenApCardiovascular:
            historiaFHIR.examenFisico?.examen_ap_cardiovascular ||
            'No informado',
          examenApDigestivo:
            historiaFHIR.examenFisico?.examen_ap_digestivo || 'No informado',
          examenActividadRefleja:
            historiaFHIR.examenFisico?.examen_actividad_refleja ||
            'No informado',
          examenActividadSensoperceptual:
            historiaFHIR.examenFisico?.examen_actividad_sensoperceptual ||
            'No informado',
          examenReaccionesPosturales:
            historiaFHIR.examenFisico?.examen_reacciones_posturales ||
            'No informado',
          examenDesplazamientoMarcha:
            historiaFHIR.examenFisico?.examen_desplazamiento_marcha ||
            'No informado',
          examenEtapaDesarrollo:
            historiaFHIR.examenFisico?.examen_etapa_desarrollo ||
            'No informado',

          // Diagnóstico funcional
          diagnosticoFuncional:
            historiaFHIR.diagnosticoFuncional || 'No informado',
          conductaSeguirObjetivos:
            historiaFHIR.conductaSeguirObjetivos || 'No informado',
          objetivosFamilia: historiaFHIR.objetivosFamilia || 'No informado',
        };
        return this.historiaFisiatrica;
      }

      // Si no hay historias, limpiar el state y devolver null
      this.historiaFisiatrica = null;
      return null;
    } catch (error) {
      console.error('Error en obtenerHistoriaFisiatrica:', error);
      throw error;
    }
  },

  async agregarImagen(nuevoMultimedia) {
    try {
      // Crear FormData para enviar archivo + metadatos al FHIR Server
      const formData = new FormData();

      // Agregar el archivo
      formData.append('file', nuevoMultimedia.archivo);

      // Crear DocumentReference con extensiones
      const documentReference = {
        resourceType: 'DocumentReference',
        status: 'current',
        type: {
          text: nuevoMultimedia.tipo === 'imagen' ? 'Imagen' : 'Video',
        },
        subject: {
          reference: `Patient/${this.paciente.hashId}`,
        },
        extension: [
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/patient-hash-id',
            valueString: this.paciente.hashId,
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/user-id',
            valueString: authStore.usuario.id_usuario || '',
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/file-upload',
            valueBoolean: true,
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/file-title',
            valueString: nuevoMultimedia.titulo || '',
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/file-description',
            valueString: nuevoMultimedia.descripcion || '',
          },
        ],
      };

      // Agregar DocumentReference como JSON string
      formData.append('documentReference', JSON.stringify(documentReference));

      // Enviar archivo + metadatos al nuevo endpoint Spring Boot
      const response = await useAxios.post(
        `${FHIR_URL}/api/file/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async agregarVideo(nuevoMultimedia) {
    try {
      // Crear FormData para enviar archivo + metadatos al FHIR Server
      const formData = new FormData();

      // Agregar el archivo
      formData.append('file', nuevoMultimedia.archivo);

      // Crear DocumentReference con extensiones
      const documentReference = {
        resourceType: 'DocumentReference',
        status: 'current',
        type: {
          text: 'Video',
        },
        subject: {
          reference: `Patient/${this.paciente.hashId}`,
        },
        extension: [
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/patient-hash-id',
            valueString: this.paciente.hashId,
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/user-id',
            valueString: authStore.usuario.id_usuario || '',
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/file-upload',
            valueBoolean: true,
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/file-title',
            valueString: nuevoMultimedia.titulo || '',
          },
          {
            url: 'http://mi-servidor/fhir/StructureDefinition/file-description',
            valueString: nuevoMultimedia.descripcion || '',
          },
        ],
      };

      // Agregar DocumentReference como JSON string
      formData.append('documentReference', JSON.stringify(documentReference));

      // Enviar archivo + metadatos al nuevo endpoint Spring Boot
      const response = await useAxios.post(
        `${FHIR_URL}/api/file/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async obtenerArchivos(hashId) {
    try {
      const response = await useAxios.get(
        `${urlFhirDocumentReference}/$get-files?patient=${this.paciente.hashId}`,
      );
      const resources = extractFhirResources(response.data);

      // Transformar los DocumentReferences a formato legible
      const archivosLegibles = resources.map((archivo) => {
        const extensionValues = getExtensionValues(archivo.extension, {
          'http://example.org/fhir/StructureDefinition/file-type': 'tipo',
          'http://example.org/fhir/StructureDefinition/file-url': 'url',
          'http://example.org/fhir/StructureDefinition/file-name': 'nombre',
        });

        // Obtener URL del contenido del DocumentReference si está disponible
        let url = extensionValues.url || '';
        if (!url && archivo.content && archivo.content.length > 0) {
          url = archivo.content[0].attachment?.url || '';
        }

        // Obtener tipo MIME del contenido
        let tipoMime = extensionValues.tipo || '';
        if (!tipoMime && archivo.content && archivo.content.length > 0) {
          tipoMime = archivo.content[0].attachment?.contentType || '';
        }

        return {
          id: archivo.id,
          nombre: archivo.description || extensionValues.nombre || 'Archivo',
          tipo: tipoMime || extensionValues.tipo || 'Desconocido',
          url: url,
          thumbnail: url, // Por ahora usamos la misma URL para thumbnail
          fechaCreacion: archivo.date || new Date().toISOString(),
        };
      });

      this.archivos = archivosLegibles;
      return archivosLegibles;
    } catch (error) {
      throw error;
    }
  },

  async obtenerDocumentos(hashId) {
    try {
      // Llamar al endpoint FHIR que actúa como proxy al backend
      // El servidor FHIR obtiene los documentos desde la tabla documento y los transforma a DocumentReference
      const response = await useAxios.get(
        `${urlFhirDocumentReference}/$get-files?patient=${hashId}`,
      );

      // Extraer recursos del Bundle FHIR
      const resources = extractFhirResources(response.data);

      // Transformar los DocumentReferences a formato legible
      const documentosLegibles = resources.map((documento) => {
        const extensionValues = getExtensionValues(documento.extension, {
          'http://example.org/fhir/StructureDefinition/file-type': 'tipo',
          'http://example.org/fhir/StructureDefinition/file-url': 'url',
          'http://example.org/fhir/StructureDefinition/file-name': 'nombre',
          'http://example.org/fhir/StructureDefinition/file-title': 'titulo',
          'http://example.org/fhir/StructureDefinition/file-description':
            'descripcion',
        });

        // Obtener URL del contenido del DocumentReference si está disponible
        let url = extensionValues.url || '';
        if (!url && documento.content && documento.content.length > 0) {
          url = documento.content[0].attachment?.url || '';
        }

        // Validar que la URL sea válida
        const isValidUrl =
          url && (url.startsWith('http://') || url.startsWith('https://'));

        // Obtener tipo MIME del contenido
        let tipoMime = extensionValues.tipo || '';
        if (!tipoMime && documento.content && documento.content.length > 0) {
          tipoMime = documento.content[0].attachment?.contentType || '';
        }

        // Mapear al formato esperado por cargarMultimedia()
        return {
          id: documento.id,
          name: documento.description || extensionValues.nombre || 'Archivo',
          type: tipoMime || extensionValues.tipo || 'Desconocido',
          url: isValidUrl ? url : '',
          titulo: extensionValues.titulo || documento.description || '',
          descripcion: extensionValues.descripcion || '',
          fechaCreacion: documento.date || new Date().toISOString(),
        };
      });

      return documentosLegibles;
    } catch (error) {
      throw error;
    }
  },
};
