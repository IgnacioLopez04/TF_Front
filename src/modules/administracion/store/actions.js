import { useAxios } from '@/composables/useAxios';
import {
  urlFhirPractitioner,
  urlFhirPatient,
  urlFhirLocation,
  urlFhirOrganization,
} from '@/utils';
import {
  extractFhirResources,
  getExtensionValues,
  getIdentifierValue,
  getExtensionValue,
} from '@/utils/fhirHelper';

export default {
  async obtenerUsuarios() {
    this.loading = true;
    this.error = null;

    try {
      const response = await useAxios.get(urlFhirPractitioner);

      // Extraer recursos FHIR (puede venir como array o como objeto)
      let practitioners = [];
      if (Array.isArray(response.data)) {
        practitioners = response.data;
      } else if (response.data?.entry) {
        // Si viene como Bundle
        practitioners = response.data.entry
          .map((entry) => entry.resource)
          .filter(Boolean);
      } else if (response.data?.resourceType === 'Practitioner') {
        // Si viene como un solo recurso
        practitioners = [response.data];
      }

      // Transformar recursos FHIR Practitioner a formato simplificado
      this.usuarios = practitioners.map((practitioner) => {
        const usuario = {
          hashId: practitioner.id || null,
          dni: null,
          nombre: null,
          apellido: null,
          email: null,
          fechaNacimiento: null,
          activo:
            practitioner.active !== undefined ? practitioner.active : true,
          idTipoUsuario: null,
        };

        // Extraer DNI de identifiers
        if (practitioner.identifier && Array.isArray(practitioner.identifier)) {
          const dniIdentifier = practitioner.identifier.find(
            (id) => id.system === 'http://mi-servidor.com/fhir/dni',
          );
          if (dniIdentifier) {
            usuario.dni = dniIdentifier.value;
          }
        }

        // Extraer nombre y apellido
        if (practitioner.name && practitioner.name.length > 0) {
          const name = practitioner.name[0];
          if (name.given && name.given.length > 0) {
            usuario.nombre = name.given[0];
          }
          if (name.family) {
            usuario.apellido = name.family;
          }
        }

        // Extraer email de telecom
        if (practitioner.telecom && Array.isArray(practitioner.telecom)) {
          const emailContact = practitioner.telecom.find(
            (contact) => contact.system === 'email',
          );
          if (emailContact) {
            usuario.email = emailContact.value;
          }
        }

        // Extraer fecha de nacimiento
        if (practitioner.birthDate) {
          usuario.fechaNacimiento = practitioner.birthDate;
        }

        // Extraer id_tipo_usuario de extensiones
        if (practitioner.extension && Array.isArray(practitioner.extension)) {
          const tipoUsuarioExt = practitioner.extension.find(
            (ext) =>
              ext.url ===
              'http://mi-servidor/fhir/StructureDefinition/id-tipo-usuario',
          );
          if (tipoUsuarioExt) {
            // Puede venir como valueString o value
            usuario.idTipoUsuario =
              tipoUsuarioExt.valueString ||
              tipoUsuarioExt.value?.toString() ||
              null;
          }
        }

        return usuario;
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener los usuarios';
      throw error;
    } finally {
      this.loading = false;
    }
  },
  async actualizarEstadoUsuario(hashId, activo) {
    try {
      // Buscar el usuario en la lista actual para obtener todos sus datos
      const usuario = this.usuarios.find((u) => u.hashId === hashId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Construir recurso Practitioner completo según estándar FHIR
      const practitioner = {
        resourceType: 'Practitioner',
        id: hashId,
        active: activo,
      };

      // Agregar identifier con DNI si existe
      if (usuario.dni) {
        practitioner.identifier = [
          {
            system: 'http://mi-servidor.com/fhir/dni',
            value: usuario.dni,
          },
        ];
      }

      // Agregar name si existe
      if (usuario.nombre || usuario.apellido) {
        practitioner.name = [
          {
            family: usuario.apellido || '',
            given: usuario.nombre ? [usuario.nombre] : [],
          },
        ];
      }

      // Agregar telecom con email si existe
      if (usuario.email) {
        practitioner.telecom = [
          {
            system: 'email',
            value: usuario.email,
          },
        ];
      }

      // Agregar fecha de nacimiento si existe
      if (usuario.fechaNacimiento) {
        practitioner.birthDate = usuario.fechaNacimiento;
      }

      // Agregar extensiones si existen
      const extensions = [];
      if (usuario.idTipoUsuario) {
        extensions.push({
          url: 'http://mi-servidor/fhir/StructureDefinition/id-tipo-usuario',
          valueString: usuario.idTipoUsuario.toString(),
        });
      }

      if (extensions.length > 0) {
        practitioner.extension = extensions;
      }

      const response = await useAxios.put(
        `${urlFhirPractitioner}/${hashId}`,
        practitioner,
      );
      await this.obtenerUsuarios();
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar el estado del usuario';
      throw error;
    }
  },
  async crearUsuario(usuarioData) {
    try {
      // Construir recurso Practitioner completo según estándar FHIR
      const practitioner = {
        resourceType: 'Practitioner',
        active: true, // Nuevos usuarios activos por defecto
      };

      // Agregar identifier con DNI si existe
      if (usuarioData.dni) {
        practitioner.identifier = [
          {
            system: 'http://mi-servidor.com/fhir/dni',
            value: usuarioData.dni,
          },
        ];
      }

      // Agregar name si existe
      if (usuarioData.nombre || usuarioData.apellido) {
        practitioner.name = [
          {
            family: usuarioData.apellido || '',
            given: usuarioData.nombre ? [usuarioData.nombre] : [],
          },
        ];
      }

      // Agregar telecom con email si existe
      if (usuarioData.email) {
        practitioner.telecom = [
          {
            system: 'email',
            value: usuarioData.email,
          },
        ];
      }

      // Agregar fecha de nacimiento si existe
      if (usuarioData.fechaNacimiento) {
        // Formatear fecha solo como YYYY-MM-DD sin hora
        let birthDate = usuarioData.fechaNacimiento;
        if (birthDate instanceof Date) {
          // Formato YYYY-MM-DD para FHIR
          const year = birthDate.getFullYear();
          const month = String(birthDate.getMonth() + 1).padStart(2, '0');
          const day = String(birthDate.getDate()).padStart(2, '0');
          birthDate = `${year}-${month}-${day}`;
        } else if (typeof birthDate === 'string') {
          // Si ya viene como string, asegurar que solo tenga la fecha (sin hora)
          // Si tiene hora, extraer solo la parte de la fecha
          if (birthDate.includes('T')) {
            birthDate = birthDate.split('T')[0];
          } else if (birthDate.includes(' ')) {
            birthDate = birthDate.split(' ')[0];
          }
          // Verificar que tenga el formato correcto YYYY-MM-DD
          if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
            // Si no tiene el formato correcto, intentar parsearlo
            const dateObj = new Date(birthDate);
            if (!isNaN(dateObj.getTime())) {
              const year = dateObj.getFullYear();
              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
              const day = String(dateObj.getDate()).padStart(2, '0');
              birthDate = `${year}-${month}-${day}`;
            }
          }
        }
        practitioner.birthDate = birthDate;
      }

      // Agregar extensiones si existen
      const extensions = [];
      if (usuarioData.idTipoUsuario) {
        extensions.push({
          url: 'http://mi-servidor/fhir/StructureDefinition/id-tipo-usuario',
          valueString: usuarioData.idTipoUsuario.toString(),
        });
      }

      if (extensions.length > 0) {
        practitioner.extension = extensions;
      }

      const response = await useAxios.post(urlFhirPractitioner, practitioner);
      await this.obtenerUsuarios();
      return response.data;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al crear el usuario';
      throw error;
    }
  },
  async editarUsuario(hashId, usuarioData) {
    try {
      // Buscar el usuario en la lista actual para obtener todos sus datos, especialmente el estado activo
      const usuario = this.usuarios.find((u) => u.hashId === hashId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Construir recurso Practitioner completo según estándar FHIR
      const practitioner = {
        resourceType: 'Practitioner',
        id: hashId,
        active: usuario.activo !== undefined ? usuario.activo : true, // Mantener el estado actual
      };

      // Agregar identifier con DNI si existe
      if (usuarioData.dni) {
        practitioner.identifier = [
          {
            system: 'http://mi-servidor.com/fhir/dni',
            value: usuarioData.dni,
          },
        ];
      }

      // Agregar name si existe
      if (usuarioData.nombre || usuarioData.apellido) {
        practitioner.name = [
          {
            family: usuarioData.apellido || '',
            given: usuarioData.nombre ? [usuarioData.nombre] : [],
          },
        ];
      }

      // Agregar telecom con email si existe
      if (usuarioData.email) {
        practitioner.telecom = [
          {
            system: 'email',
            value: usuarioData.email,
          },
        ];
      }

      // Agregar fecha de nacimiento si existe
      if (usuarioData.fechaNacimiento) {
        // Formatear fecha solo como YYYY-MM-DD sin hora
        let birthDate = usuarioData.fechaNacimiento;
        if (birthDate instanceof Date) {
          // Formato YYYY-MM-DD para FHIR
          const year = birthDate.getFullYear();
          const month = String(birthDate.getMonth() + 1).padStart(2, '0');
          const day = String(birthDate.getDate()).padStart(2, '0');
          birthDate = `${year}-${month}-${day}`;
        } else if (typeof birthDate === 'string') {
          // Si ya viene como string, asegurar que solo tenga la fecha (sin hora)
          // Si tiene hora, extraer solo la parte de la fecha
          if (birthDate.includes('T')) {
            birthDate = birthDate.split('T')[0];
          } else if (birthDate.includes(' ')) {
            birthDate = birthDate.split(' ')[0];
          }
          // Verificar que tenga el formato correcto YYYY-MM-DD
          if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
            // Si no tiene el formato correcto, intentar parsearlo
            const dateObj = new Date(birthDate);
            if (!isNaN(dateObj.getTime())) {
              const year = dateObj.getFullYear();
              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
              const day = String(dateObj.getDate()).padStart(2, '0');
              birthDate = `${year}-${month}-${day}`;
            }
          }
        }
        practitioner.birthDate = birthDate;
      }

      // Agregar extensiones si existen
      const extensions = [];
      if (usuarioData.idTipoUsuario) {
        extensions.push({
          url: 'http://mi-servidor/fhir/StructureDefinition/id-tipo-usuario',
          valueString: usuarioData.idTipoUsuario.toString(),
        });
      }

      if (extensions.length > 0) {
        practitioner.extension = extensions;
      }

      const response = await useAxios.put(
        `${urlFhirPractitioner}/${hashId}`,
        practitioner,
      );
      await this.obtenerUsuarios();
      return response.data;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al editar el usuario';
      throw error;
    }
  },
  async obtenerTiposUsuario() {
    try {
      const response = await useAxios.get(
        `${urlFhirPractitioner}/$get-user-types`,
      );

      // Procesar el ValueSet FHIR y extraer los conceptos
      const valueSet = response.data;
      const tipos = [];

      if (valueSet && valueSet.compose && valueSet.compose.include) {
        // Recorrer todos los includes del ValueSet
        for (const include of valueSet.compose.include) {
          if (include.concept && Array.isArray(include.concept)) {
            // Extraer cada concepto y transformarlo a formato { code, display }
            for (const concept of include.concept) {
              tipos.push({
                code: concept.code || '',
                display: concept.display || concept.code || 'Sin nombre',
              });
            }
          }
        }
      }

      // Guardar los tipos en el state
      this.tiposUsuario = tipos;

      return tipos;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener los tipos de usuario';
      throw error;
    }
  },
  async obtenerPacientes() {
    this.loading = true;
    this.error = null;

    try {
      const response = await useAxios.get(`${urlFhirPatient}?_type=patient`);
      const resources = extractFhirResources(response.data);

      this.pacientes = resources.map((resource) => {
        const dni = getIdentifierValue(
          resource.identifier,
          'http://mi-servidor.com/fhir/dni',
        );

        // Extraer todas las extensiones
        const extensionValues = getExtensionValues(resource.extension || [], {
          'http://mi-servidor/fhir/StructureDefinition/hash-id': 'hash_id',
          'http://mi-servidor.com/fhir/StructureDefinition/id_ciudad':
            'localidad',
          'http://mi-servidor.com/fhir/StructureDefinition/barrio': 'barrio',
          'http://mi-servidor.com/fhir/StructureDefinition/calle': 'calle',
          'http://mi-servidor.com/fhir/StructureDefinition/id_prestacion':
            'prestacion',
          'http://mi-servidor.com/fhir/StructureDefinition/piso_departamento':
            'pisoDepto',
          'http://mi-servidor.com/fhir/StructureDefinition/tutores': 'tutores',
        });

        // Extraer inactivo (valueBoolean)
        let inactivo = false;
        if (resource.extension && Array.isArray(resource.extension)) {
          const inactivoExt = resource.extension.find(
            (ext) =>
              ext.url ===
              'http://mi-servidor.com/fhir/StructureDefinition/inactivo',
          );
          if (inactivoExt && inactivoExt.valueBoolean !== undefined) {
            inactivo = inactivoExt.valueBoolean;
          }
        }

        // Extraer ocupación (puede estar en extensiones adicionales)
        const ocupacionActual = getExtensionValue(
          resource.extension || [],
          'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_actual',
        );
        const ocupacionAnterior = getExtensionValue(
          resource.extension || [],
          'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_anterior',
        );

        // Extraer número de domicilio
        const numero = getExtensionValue(
          resource.extension || [],
          'http://mi-servidor.com/fhir/StructureDefinition/numero',
        );

        // Extraer provincia
        const provincia = getExtensionValue(
          resource.extension || [],
          'http://mi-servidor.com/fhir/StructureDefinition/id_provincia',
        );

        // Extraer con quien vive
        const conQuienVive = getExtensionValue(
          resource.extension || [],
          'http://mi-servidor.com/fhir/StructureDefinition/con_quien_vive',
        );

        // Extraer mutual y número de afiliado
        const mutual = getExtensionValue(
          resource.extension || [],
          'http://mi-servidor.com/fhir/StructureDefinition/id_mutual',
        );
        const numeroAfiliado = getExtensionValue(
          resource.extension || [],
          'http://mi-servidor.com/fhir/StructureDefinition/numero_afiliado',
        );

        // Parsear tutores si existen
        let tutores = [];
        if (extensionValues.tutores) {
          try {
            tutores = JSON.parse(extensionValues.tutores);
          } catch (e) {
            console.warn('Error al parsear tutores:', e);
          }
        }

        const nombre =
          resource.name && resource.name[0] && resource.name[0].given
            ? resource.name[0].given[0]
            : '';
        const apellido =
          resource.name && resource.name[0] && resource.name[0].family
            ? resource.name[0].family
            : '';

        return {
          hashId: extensionValues.hash_id || resource.id || null,
          dni: dni,
          nombre: nombre,
          apellido: apellido,
          fechaNacimiento: resource.birthDate || null,
          prestacion: extensionValues.prestacion || null,
          ocupacionActual: ocupacionActual || '',
          ocupacionAnterior: ocupacionAnterior || '',
          calle: extensionValues.calle || '',
          numero: numero || '',
          pisoDepto: extensionValues.pisoDepto || '',
          barrio: extensionValues.barrio || '',
          localidad: extensionValues.localidad || null,
          provincia: provincia || null,
          conQuienVive: conQuienVive || '',
          mutual: mutual || null,
          numeroAfiliado: numeroAfiliado || '',
          tutores: tutores || [],
          activo: !inactivo,
          iniciales:
            nombre && apellido
              ? `${nombre[0]}${apellido[0]}`.toUpperCase()
              : '??',
        };
      });
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener los pacientes';
      throw error;
    } finally {
      this.loading = false;
    }
  },
  async obtenerPaciente(hashId) {
    try {
      // Validar y limpiar el hashId
      if (!hashId || typeof hashId !== 'string') {
        throw new Error('HashId inválido');
      }

      // Limpiar el hashId de caracteres no válidos (solo alfanuméricos y guiones)
      const hashIdLimpio = hashId.trim().replace(/[^a-zA-Z0-9\-]/g, '');

      if (!hashIdLimpio || hashIdLimpio.length === 0) {
        throw new Error('HashId inválido después de limpiar');
      }

      const response = await useAxios.get(`${urlFhirPatient}/${hashIdLimpio}`);
      const resources = extractFhirResources(response.data);

      if (!resources || resources.length === 0) {
        throw new Error('Paciente no encontrado');
      }

      const resource = resources[0];
      const dni = getIdentifierValue(
        resource.identifier,
        'http://mi-servidor.com/fhir/dni',
      );

      // Extraer todas las extensiones
      const extensionValues = getExtensionValues(resource.extension || [], {
        'http://mi-servidor/fhir/StructureDefinition/hash-id': 'hash_id',
        'http://mi-servidor.com/fhir/StructureDefinition/id_ciudad':
          'localidad',
        'http://mi-servidor.com/fhir/StructureDefinition/barrio': 'barrio',
        'http://mi-servidor.com/fhir/StructureDefinition/calle': 'calle',
        'http://mi-servidor.com/fhir/StructureDefinition/id_prestacion':
          'prestacion',
        'http://mi-servidor.com/fhir/StructureDefinition/piso_departamento':
          'pisoDepto',
        'http://mi-servidor.com/fhir/StructureDefinition/tutores': 'tutores',
      });

      // Extraer inactivo (valueBoolean)
      let inactivo = false;
      if (resource.extension && Array.isArray(resource.extension)) {
        const inactivoExt = resource.extension.find(
          (ext) =>
            ext.url ===
            'http://mi-servidor.com/fhir/StructureDefinition/inactivo',
        );
        if (inactivoExt && inactivoExt.valueBoolean !== undefined) {
          inactivo = inactivoExt.valueBoolean;
        }
      }

      // Extraer otros campos de extensiones
      const ocupacionActual = getExtensionValue(
        resource.extension || [],
        'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_actual',
      );
      const ocupacionAnterior = getExtensionValue(
        resource.extension || [],
        'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_anterior',
      );
      const numero = getExtensionValue(
        resource.extension || [],
        'http://mi-servidor.com/fhir/StructureDefinition/numero',
      );
      const provincia = getExtensionValue(
        resource.extension || [],
        'http://mi-servidor.com/fhir/StructureDefinition/id_provincia',
      );
      const conQuienVive = getExtensionValue(
        resource.extension || [],
        'http://mi-servidor.com/fhir/StructureDefinition/con_quien_vive',
      );
      const mutual = getExtensionValue(
        resource.extension || [],
        'http://mi-servidor.com/fhir/StructureDefinition/id_mutual',
      );
      const numeroAfiliado = getExtensionValue(
        resource.extension || [],
        'http://mi-servidor.com/fhir/StructureDefinition/numero_afiliado',
      );

      // Parsear tutores si existen
      let tutores = [];
      if (extensionValues.tutores) {
        try {
          tutores = JSON.parse(extensionValues.tutores);
        } catch (e) {
          console.warn('Error al parsear tutores:', e);
        }
      }

      const nombre =
        resource.name && resource.name[0] && resource.name[0].given
          ? resource.name[0].given[0]
          : '';
      const apellido =
        resource.name && resource.name[0] && resource.name[0].family
          ? resource.name[0].family
          : '';

      return {
        hashId: extensionValues.hash_id || resource.id || null,
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        fechaNacimiento: resource.birthDate || null,
        prestacion: extensionValues.prestacion || null,
        ocupacionActual: ocupacionActual || '',
        ocupacionAnterior: ocupacionAnterior || '',
        calle: extensionValues.calle || '',
        numero: numero || '',
        pisoDepto: extensionValues.pisoDepto || '',
        barrio: extensionValues.barrio || '',
        localidad: extensionValues.localidad || null,
        provincia: provincia || null,
        conQuienVive: conQuienVive || '',
        mutual: mutual || null,
        numeroAfiliado: numeroAfiliado || '',
        tutores: tutores || [],
        activo: !inactivo,
        iniciales:
          nombre && apellido
            ? `${nombre[0]}${apellido[0]}`.toUpperCase()
            : '??',
      };
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener el paciente';
      throw error;
    }
  },
  async editarPaciente(hashId, pacienteData) {
    try {
      // Buscar el paciente en la lista actual para obtener todos sus datos
      const paciente = this.pacientes.find((p) => p.hashId === hashId);

      if (!paciente) {
        throw new Error('Paciente no encontrado');
      }

      // Construir recurso Patient completo según estándar FHIR
      const fhirPatient = {
        resourceType: 'Patient',
        id: hashId,
        identifier: [
          {
            system: 'http://mi-servidor.com/fhir/dni',
            value: pacienteData.dni || '',
          },
        ],
        name: [
          {
            family: pacienteData.apellido || '',
            given: pacienteData.nombre ? [pacienteData.nombre] : [],
          },
        ],
        birthDate: pacienteData.fechaNacimiento
          ? typeof pacienteData.fechaNacimiento === 'string'
            ? pacienteData.fechaNacimiento.split('T')[0]
            : new Date(pacienteData.fechaNacimiento).toISOString().split('T')[0]
          : undefined,
        active: pacienteData.activo !== undefined ? pacienteData.activo : true,
        extension: [],
      };

      // Agregar extensiones
      if (pacienteData.localidad) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/id_ciudad',
          valueString: pacienteData.localidad.toString(),
        });
      }
      if (pacienteData.barrio) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/barrio',
          valueString: pacienteData.barrio,
        });
      }
      if (pacienteData.calle) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/calle',
          valueString: pacienteData.calle,
        });
      }
      if (pacienteData.prestacion) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/id_prestacion',
          valueString: pacienteData.prestacion.toString(),
        });
      }
      if (pacienteData.pisoDepto) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/piso_departamento',
          valueString: pacienteData.pisoDepto,
        });
      }
      if (pacienteData.numero) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/numero',
          valueString: pacienteData.numero,
        });
      }
      if (pacienteData.provincia) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/id_provincia',
          valueString: pacienteData.provincia.toString(),
        });
      }
      if (pacienteData.conQuienVive) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/con_quien_vive',
          valueString: pacienteData.conQuienVive,
        });
      }
      if (pacienteData.mutual) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/id_mutual',
          valueString: pacienteData.mutual.toString(),
        });
      }
      if (pacienteData.numeroAfiliado) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/numero_afiliado',
          valueString: pacienteData.numeroAfiliado,
        });
      }
      if (pacienteData.ocupacionActual) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_actual',
          valueString: pacienteData.ocupacionActual,
        });
      }
      if (pacienteData.ocupacionAnterior) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/ocupacion_anterior',
          valueString: pacienteData.ocupacionAnterior,
        });
      }
      fhirPatient.extension.push({
        url: 'http://mi-servidor.com/fhir/StructureDefinition/inactivo',
        valueBoolean: !pacienteData.activo,
      });
      if (pacienteData.tutores && pacienteData.tutores.length > 0) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/tutores',
          valueString: JSON.stringify(pacienteData.tutores),
        });
      }

      const response = await useAxios.put(
        `${urlFhirPatient}/${hashId}`,
        fhirPatient,
      );
      await this.obtenerPacientes();
      return response.data;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al editar el paciente';
      throw error;
    }
  },
  async actualizarEstadoPaciente(hashId, activo) {
    try {
      const paciente = this.pacientes.find((p) => p.hashId === hashId);

      if (!paciente) {
        throw new Error('Paciente no encontrado');
      }

      // Construir recurso Patient con solo el cambio de estado
      const fhirPatient = {
        resourceType: 'Patient',
        id: hashId,
        identifier: [
          {
            system: 'http://mi-servidor.com/fhir/dni',
            value: paciente.dni || '',
          },
        ],
        name: [
          {
            family: paciente.apellido || '',
            given: paciente.nombre ? [paciente.nombre] : [],
          },
        ],
        active: activo,
        extension: [
          {
            url: 'http://mi-servidor.com/fhir/StructureDefinition/inactivo',
            valueBoolean: !activo,
          },
        ],
      };

      // Agregar otras extensiones existentes si las hay
      if (paciente.prestacion) {
        fhirPatient.extension.push({
          url: 'http://mi-servidor.com/fhir/StructureDefinition/id_prestacion',
          valueString: paciente.prestacion.toString(),
        });
      }

      const response = await useAxios.put(
        `${urlFhirPatient}/${hashId}`,
        fhirPatient,
      );
      await this.obtenerPacientes();
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar el estado del paciente';
      throw error;
    }
  },
  async obtenerPrestaciones() {
    try {
      const response = await useAxios.get(
        `${urlFhirOrganization}?_type=program`,
      );
      const resources = extractFhirResources(response.data);
      this.prestaciones = resources;
      return resources;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener las prestaciones';
      throw error;
    }
  },
  async obtenerMutuales() {
    try {
      const response = await useAxios.get(
        `${urlFhirOrganization}?_type=insurance`,
      );
      const resources = extractFhirResources(response.data);
      this.mutuales = resources;
      return resources;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener las mutuales';
      throw error;
    }
  },
  async obtenerProvincias() {
    try {
      const response = await useAxios.get(`${urlFhirLocation}?_type=province`);
      const resources = extractFhirResources(response.data);
      this.provincias = resources;
      return resources;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener las provincias';
      throw error;
    }
  },
  async obtenerCiudades(idProvincia) {
    try {
      const response = await useAxios.get(
        `${urlFhirLocation}?provincia=${idProvincia}`,
      );
      const resources = extractFhirResources(response.data);
      this.ciudades = resources;
      return resources;
    } catch (error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener las ciudades';
      throw error;
    }
  },
};

