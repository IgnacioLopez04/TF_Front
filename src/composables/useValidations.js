import { ref } from 'vue';

export const useValidations = () => {
  const errors = ref({});
  const isValid = ref({});

  // Limpiar todos los errores
  const clearErrors = () => {
    errors.value = {};
    isValid.value = {};
  };

  // Limpiar error de un campo específico
  const clearError = (fieldName) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName];
      isValid.value[fieldName] = true;
    }
  };

  // Obtener error de un campo
  const getError = (fieldName) => {
    return errors.value[fieldName] || '';
  };

  // Verificar si hay errores
  const hasErrors = () => {
    return Object.keys(errors.value).length > 0;
  };

  // Validar nombre y apellido (solo letras y espacios)
  const validateName = (value, fieldName) => {
    if (!value || value.trim() === '') {
      errors.value[fieldName] = `El ${fieldName} es obligatorio`;
      isValid.value[fieldName] = false;
      return false;
    }

    // Solo letras, espacios y algunos caracteres especiales comunes en nombres
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(value.trim())) {
      errors.value[
        fieldName
      ] = `El ${fieldName} solo puede contener letras y espacios`;
      isValid.value[fieldName] = false;
      return false;
    }

    // Limpiar error si es válido
    clearError(fieldName);
    return true;
  };

  // Validar DNI (solo números)
  const validateDNI = (value) => {
    if (!value || value.trim() === '') {
      errors.value.dni = 'El DNI es obligatorio';
      isValid.value.dni = false;
      return false;
    }

    const dniRegex = /^\d+$/;
    if (!dniRegex.test(value.trim())) {
      errors.value.dni = 'El DNI solo puede contener números';
      isValid.value.dni = false;
      return false;
    }

    clearError('dni');
    return true;
  };

  // Validar ocupación
  const validateOccupation = (value, fieldName) => {
    if (!value || value.trim() === '') {
      errors.value[fieldName] = `La ${fieldName} es obligatoria`;
      isValid.value[fieldName] = false;
      return false;
    }

    clearError(fieldName);
    return true;
  };

  // Validar dirección (calle, barrio)
  const validateAddress = (value, fieldName) => {
    if (!value || value.trim() === '') {
      const fieldLabel = fieldName === 'calle' ? 'la calle' : 'el barrio';
      errors.value[fieldName] = `${
        fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)
      } es obligatorio`;
      isValid.value[fieldName] = false;
      return false;
    }

    clearError(fieldName);
    return true;
  };

  // Validar número de calle
  const validateStreetNumber = (value) => {
    if (!value || value.trim() === '') {
      errors.value.numero = 'El número de calle es obligatorio';
      isValid.value.numero = false;
      return false;
    }

    clearError('numero');
    return true;
  };

  // Validar selección requerida (provincia, ciudad, prestación, mutual)
  const validateRequiredSelection = (value, fieldName, label) => {
    if (!value) {
      errors.value[fieldName] = `Debe seleccionar ${label}`;
      isValid.value[fieldName] = false;
      return false;
    }

    clearError(fieldName);
    return true;
  };

  // Validar número de afiliado (solo números)
  const validateAffiliateNumber = (value) => {
    if (!value || value.trim() === '') {
      errors.value.numeroAfiliado = 'El número de afiliado es obligatorio';
      isValid.value.numeroAfiliado = false;
      return false;
    }

    const affiliateRegex = /^\d+$/;
    if (!affiliateRegex.test(value.trim())) {
      errors.value.numeroAfiliado =
        'El número de afiliado solo puede contener números';
      isValid.value.numeroAfiliado = false;
      return false;
    }

    clearError('numeroAfiliado');
    return true;
  };

  // Validar DNI del tutor (mínimo 7 dígitos, solo números)
  const validateTutorDNI = (value, tutorIndex) => {
    const fieldName = `tutor${tutorIndex}DNI`;

    if (!value || value.toString().trim() === '') {
      errors.value[fieldName] = 'El DNI del tutor es obligatorio';
      isValid.value[fieldName] = false;
      return false;
    }

    const dniString = value.toString().trim();
    const dniRegex = /^\d+$/;

    if (!dniRegex.test(dniString)) {
      errors.value[fieldName] = 'El DNI del tutor solo puede contener números';
      isValid.value[fieldName] = false;
      return false;
    }

    if (dniString.length < 7) {
      errors.value[fieldName] =
        'El DNI del tutor debe tener al menos 7 dígitos';
      isValid.value[fieldName] = false;
      return false;
    }

    clearError(fieldName);
    return true;
  };

  // Validar fecha de nacimiento del tutor (debe ser mayor de edad)
  const validateTutorBirthDate = (value, tutorIndex) => {
    const fieldName = `tutor${tutorIndex}BirthDate`;

    if (!value) {
      errors.value[fieldName] =
        'La fecha de nacimiento del tutor es obligatoria';
      isValid.value[fieldName] = false;
      return false;
    }

    const hoy = new Date();
    const nacimiento = new Date(value);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      errors.value[fieldName] =
        'El tutor debe ser mayor de edad (mínimo 18 años)';
      isValid.value[fieldName] = false;
      return false;
    }

    clearError(fieldName);
    return true;
  };

  // Validar nombre del tutor
  const validateTutorName = (value, tutorIndex) => {
    const fieldName = `tutor${tutorIndex}Name`;
    return validateName(value, fieldName);
  };

  // Validar ocupación del tutor
  const validateTutorOccupation = (value, tutorIndex) => {
    const fieldName = `tutor${tutorIndex}Occupation`;
    return validateOccupation(value, fieldName);
  };

  // Validar lugar de nacimiento del tutor
  const validateTutorBirthPlace = (value, tutorIndex) => {
    const fieldName = `tutor${tutorIndex}BirthPlace`;

    if (!value || value.trim() === '') {
      errors.value[fieldName] =
        'El lugar de nacimiento del tutor es obligatorio';
      isValid.value[fieldName] = false;
      return false;
    }

    clearError(fieldName);
    return true;
  };

  // Validar todos los tutores
  const validateTutors = (tutores) => {
    if (!tutores || tutores.length === 0) {
      return true; // No hay tutores para validar
    }

    let isValidTutors = true;

    tutores.forEach((tutor, index) => {
      if (!validateTutorName(tutor.nombre, index)) isValidTutors = false;
      if (!validateTutorDNI(tutor.dni, index)) isValidTutors = false;
      if (!validateTutorBirthDate(tutor.fechaNacimiento, index))
        isValidTutors = false;
      if (!validateTutorOccupation(tutor.ocupacion, index))
        isValidTutors = false;
      if (!validateTutorBirthPlace(tutor.lugarNacimiento, index))
        isValidTutors = false;
    });

    return isValidTutors;
  };

  // Validar todo el formulario
  const validatePatientForm = (paciente) => {
    let isValidForm = true;

    // Validar nombre y apellido
    if (!validateName(paciente.nombre, 'nombre')) isValidForm = false;
    if (!validateName(paciente.apellido, 'apellido')) isValidForm = false;

    // Validar DNI
    if (!validateDNI(paciente.dni)) isValidForm = false;

    // Validar ocupaciones
    if (!validateOccupation(paciente.ocupacionActual, 'ocupacionActual'))
      isValidForm = false;
    // Validar dirección
    if (!validateAddress(paciente.calle, 'calle')) isValidForm = false;
    if (!validateStreetNumber(paciente.numero)) isValidForm = false;
    if (!validateAddress(paciente.barrio, 'barrio')) isValidForm = false;

    // Validar provincia y ciudad
    if (
      !validateRequiredSelection(
        paciente.provincia,
        'provincia',
        'una provincia',
      )
    )
      isValidForm = false;
    if (
      !validateRequiredSelection(
        paciente.localidad,
        'localidad',
        'una localidad',
      )
    )
      isValidForm = false;

    // Validar prestación
    if (
      !validateRequiredSelection(
        paciente.prestacion,
        'prestacion',
        'una prestación',
      )
    )
      isValidForm = false;

    // Validar obra social y número de afiliado
    if (
      !validateRequiredSelection(
        paciente.mutual,
        'mutual',
        'una obra social o mutual',
      )
    )
      isValidForm = false;
    if (!validateAffiliateNumber(paciente.numeroAfiliado)) isValidForm = false;

    // Validar tutores si es menor de edad
    if (paciente.tutores && paciente.tutores.length > 0) {
      if (!validateTutors(paciente.tutores)) isValidForm = false;
    }

    return isValidForm;
  };

  return {
    errors,
    isValid,
    clearErrors,
    clearError,
    getError,
    hasErrors,
    validatePatientForm,
    validateName,
    validateDNI,
    validateOccupation,
    validateAddress,
    validateStreetNumber,
    validateRequiredSelection,
    validateAffiliateNumber,
    validateTutorDNI,
    validateTutorBirthDate,
    validateTutorName,
    validateTutorOccupation,
    validateTutorBirthPlace,
    validateTutors,
  };
};
