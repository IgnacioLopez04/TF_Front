export default () => ({
  // Lista de pacientes
  pacientes: [],

  paciente: {
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
  },

  loading: false,
  error: null,
  provincias: [],
  ciudades: [],

  // Opciones para dropdowns
  opcionesPrestacion: [],

  opcionesMutual: [],

  // Estructura por defecto para un tutor
  tutor: {
    nombre: '',
    dni: '',
    fechaNacimiento: null,
    ocupacion: '',
    lugarNacimiento: '',
    convive: true,
    relacion: '',
  },

  tutores: [],
  informes: [],

  historiaFisiatrica: null,
});
