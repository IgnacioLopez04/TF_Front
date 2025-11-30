import { useAxios } from '@/composables/useAxios';
import { urlFhirPractitioner } from '@/utils';

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
};

