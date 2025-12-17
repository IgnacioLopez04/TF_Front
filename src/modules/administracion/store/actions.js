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
};

