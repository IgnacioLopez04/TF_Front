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

  historiaFisiatrica: getDefaultHistoriaFisiatrica(),
});

/** Objeto por defecto cuando el paciente no tiene historia fisiátrica (para reutilizar en store) */
export function getDefaultHistoriaFisiatrica() {
  return {
    // Evaluación y Consulta
    fechaEvaluacion: 'Sin información',
    derivadosPor: 'Sin información',
    antecedentesCuadro: 'Sin información',
    medicacionActual: 'Sin información',
    estudiosRealizados: 'Sin información',

    // Antecedentes
    antecedentesHereditarios: 'Sin información',
    antecedentesPatologicos: 'Sin información',
    antecedentesQuirurgicos: 'Sin información',
    antecedentesMetabolicos: 'Sin información',
    antecedentesInmunologicos: 'Sin información',

    // Fisiológicos
    fisiologicosDormir: 'Sin información',
    fisiologicosAlimentacion: 'Sin información',
    fisiologicosCatarsis: 'Sin información',
    fisiologicosDiuresis: 'Sin información',
    fisiologicosPeriodoMenstrual: 'Sin información',
    fisiologicosSexualidad: 'Sin información',

    // Anamnesis sistémica
    anamnesisComunicacion: 'Sin información',
    anamnesisMotricidad: 'Sin información',
    anamnesisVidaDiaria: 'Sin información',

    // Examen físico - General
    examenActitud: 'Sin información',
    examenComunicacionCodigos: 'Sin información',
    examenPielFaneras: 'Sin información',

    // Examen físico - Cabeza y sentidos
    examenCabeza: 'Sin información',
    examenOjos: 'Sin información',
    examenMovimientosAnormales: 'Sin información',
    examenEstrabismo: 'Sin información',
    examenOrejas: 'Sin información',
    examenAudicion: 'Sin información',
    examenLabios: 'Sin información',
    examenDenticion: 'Sin información',
    examenPaladarVelo: 'Sin información',
    examenMordida: 'Sin información',
    examenMaxilares: 'Sin información',
    examenBoca: 'Sin información',
    examenLengua: 'Sin información',

    // Examen físico - Tronco y extremidades
    examenTorax: 'Sin información',
    examenAbdomen: 'Sin información',
    examenColumnaVertebral: 'Sin información',
    examenPelvis: 'Sin información',
    examenCaderas: 'Sin información',
    examenMmii: 'Sin información',
    examenPies: 'Sin información',
    examenMmss: 'Sin información',
    examenManos: 'Sin información',
    examenLateralidad: 'Sin información',

    // Examen físico - Sistema y actividades
    examenApRespiratorio: 'Sin información',
    examenApCardiovascular: 'Sin información',
    examenApDigestivo: 'Sin información',
    examenActividadRefleja: 'Sin información',
    examenActividadSensoperceptual: 'Sin información',
    examenReaccionesPosturales: 'Sin información',
    examenDesplazamientoMarcha: 'Sin información',
    examenEtapaDesarrollo: 'Sin información',

    // Diagnóstico funcional
    diagnosticoFuncional: 'Sin información',
    conductaSeguirObjetivos: 'Sin información',
    objetivosFamilia: 'Sin información',
  };
}
