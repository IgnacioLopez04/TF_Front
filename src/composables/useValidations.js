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
  };
};
