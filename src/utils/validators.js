/**
 * Validación de DNI compartida (Argentina: 7-8 dígitos, solo números).
 * @param {string|number} value - Valor a validar
 * @param {Object} options - Opciones de validación
 * @param {boolean} [options.required=true] - Si el DNI es obligatorio
 * @param {number} [options.minLength=7] - Cantidad mínima de dígitos
 * @param {number} [options.maxLength=8] - Cantidad máxima de dígitos
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateDni(value, options = {}) {
  const {
    required = true,
    minLength = 7,
    maxLength = 8,
  } = options;

  const str = value != null ? String(value).trim() : '';

  if (!str) {
    if (required) {
      return { valid: false, message: 'El DNI es obligatorio' };
    }
    return { valid: true };
  }

  if (!/^\d+$/.test(str)) {
    return { valid: false, message: 'El DNI solo puede contener números' };
  }

  if (str.length < minLength) {
    return {
      valid: false,
      message: minLength === maxLength
        ? `El DNI debe tener ${minLength} dígitos`
        : `El DNI debe tener entre ${minLength} y ${maxLength} dígitos`,
    };
  }

  if (str.length > maxLength) {
    return { valid: false, message: `El DNI no puede tener más de ${maxLength} dígitos` };
  }

  return { valid: true };
}
