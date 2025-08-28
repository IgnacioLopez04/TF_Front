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
  },

  loading: false,
  error: null,
  provincias: [],
  ciudades: [],

  // Opciones para dropdowns
  opcionesPrestacion: [
    { label: 'Hogar', value: 'hogar' },
    { label: 'Centro de Día', value: 'centro-dia' },
    { label: 'Centro de Rehabilitación', value: 'centro-rehabilitacion' },
  ],

  opcionesMutual: [
    { label: 'OSDE', value: 'osde' },
    { label: 'Swiss Medical', value: 'swiss-medical' },
    { label: 'Medicus', value: 'medicus' },
    { label: 'Galeno', value: 'galeno' },
    { label: 'Otro', value: 'otro' },
  ],

  // Estructura por defecto para un tutor
  tutor: {
    nombre: '',
    dni: '',
    fechaNacimiento: null,
    ocupacion: '',
    lugarNacimiento: '',
  },

  tutores: [],
});
