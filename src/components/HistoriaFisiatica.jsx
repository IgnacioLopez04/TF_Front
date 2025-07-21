import { TabView, TabPanel } from 'primereact/tabview';

// Mockup de historia fisiátrica
const historiaFisiaticaMock = {
  fechaEvaluacion: '15/06/2025',
  derivadosPor:
    'Dolor lumbar crónico, limitación funcional en actividades de la vida diaria. Derivado por traumatólogo Dr. García.',
  antecedentes:
    'Paciente refiere dolor lumbar de 6 meses de evolución, que se agrava con la bipedestación prolongada y la flexión del tronco.',
  medicacionActual:
    'Ibuprofeno 600mg cada 8 horas, Paracetamol 500mg según necesidad.',
  estudiosRealizados:
    'Radiografía de columna lumbosacra: leve escoliosis. Resonancia magnética: protrusión discal L4-L5.',
  hereditario: 'Padre con antecedentes de lumbalgia crónica.',
  patologico: 'Hipertensión arterial controlada con medicación.',
  quirurgico: 'Apendicectomía a los 25 años.',
  metabolico: 'Diabetes tipo 2 controlada con dieta y medicación.',
  inmunologico: 'Sin antecedentes relevantes.',
  dormir: 'Patrón de sueño alterado por el dolor, duerme 5-6 horas por noche.',
  alimentacion: 'Dieta balanceada, sin restricciones especiales.',
  catarsis: 'Función intestinal normal.',
  diuresis: 'Función urinaria normal.',
  periodoMenstrual: 'No aplica.',
  sexualidad: 'Sin alteraciones reportadas.',
  capacidadesDeComunicacion:
    'Comunicación verbal normal, sin alteraciones del lenguaje.',
  capacidadesEnMotricidad:
    'Limitación en la flexión del tronco, dolor al levantar objetos pesados.',
  capacidadesDeVidaDiaria:
    'Dificultad para vestirse, calzarse y realizar tareas domésticas que requieren flexión.',
  // Examen físico
  actitud: 'Paciente colaborador, se queja de dolor lumbar.',
  comunicacionCodigos: 'Comunicación verbal clara y coherente.',
  pielFaneras: 'Piel y faneras normales.',
  cabeza: 'Cabeza normocéfala, sin alteraciones.',
  ojos: 'Ojos normales, movimientos oculares conservados.',
  movimientosAnormales: 'Sin movimientos anormales.',
  estrabismo: 'Sin estrabismo.',
  orejas: 'Orejas normales.',
  audicion: 'Audición normal.',
  boca: 'Boca normal.',
  labios: 'Labios normales.',
  lengua: 'Lengua normal.',
  denticion: 'Dentición completa.',
  mordida: 'Mordida normal.',
  paladarVelo: 'Paladar y velo normales.',
  maxilares: 'Maxilares normales.',
  torax: 'Tórax normal.',
  abdomen: 'Abdomen blando, no doloroso.',
  columnaVertebral:
    'Dolor a la palpación en región lumbar, limitación de movimientos.',
  pelvis: 'Pelvis normal.',
  caderas: 'Caderas normales.',
  mmii: 'Miembros inferiores normales.',
  pies: 'Pies normales.',
  mmss: 'Miembros superiores normales.',
  manos: 'Manos normales.',
  lateralidad: 'Diestro.',
  apRespiratorio: 'Aparato respiratorio normal.',
  apCardiovascular: 'Aparato cardiovascular normal.',
  apDigestivo: 'Aparato digestivo normal.',
  actividadRefleja: 'Reflejos osteotendinosos normales.',
  actividadSensoperceptual: 'Sensibilidad normal.',
  reaccionesPosturales: 'Reacciones posturales normales.',
  desplazamientoMarcha: 'Marcha normal, sin alteraciones.',
  etapaDesarrollo: 'Desarrollo normal para la edad.',
  // Diagnóstico funcional
  diagnosticoFuncional:
    'Lumbalgia crónica mecánica con limitación funcional moderada. Dolor lumbar de origen discal (protrusión L4-L5) con irradiación a miembro inferior derecho.',
  conductaObjetivos:
    'Tratamiento fisiátrico con ejercicios de fortalecimiento de la musculatura lumbar y abdominal. Educación en higiene postural. Control del dolor con técnicas de fisioterapia.',
  objetivosFamilia:
    'Apoyo en la realización de ejercicios domiciliarios. Modificación del entorno para evitar posturas que agraven el dolor.',
};

export function HistoriaFisiatica({ dni }) {
  return (
    <div>
      {/* Botón para crear nueva historia */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => (window.location.href = `/nueva-historia/${dni}`)}
          className="bg-[#6d4bc1] hover:bg-[#5e35b1] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <i className="pi pi-plus"></i>
          Crear Nueva Historia Fisiátrica
        </button>
      </div>

      {/* Contenido de la historia usando TabView */}
      <TabView
        className="custom-tabs"
        style={{
          '--primary-color': '#6d4bc1',
          '--primary-hover': '#5e35b1',
        }}
      >
        {/* Evaluación y Consulta */}
        <TabPanel header="Evaluación y Consulta">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Evaluación
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {historiaFisiaticaMock.fechaEvaluacion}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Derivados por
              </label>
              <div className="p-3 bg-gray-50 rounded border whitespace-pre-line">
                {historiaFisiaticaMock.derivadosPor}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Antecedentes del cuadro actual
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.antecedentes}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicación actual
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.medicacionActual}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estudios realizados
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.estudiosRealizados}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Antecedentes */}
        <TabPanel header="Antecedentes">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hereditarios
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.hereditario}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patológico
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.patologico}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quirúrgicos
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.quirurgico}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metabólicos
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.metabolico}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inmunológicos
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.inmunologico}
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 mb-3">Fisiológicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dormir
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {historiaFisiaticaMock.dormir}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alimentación
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {historiaFisiaticaMock.alimentacion}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catarsis
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {historiaFisiaticaMock.catarsis}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diuresis
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {historiaFisiaticaMock.diuresis}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periodo menstrual
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {historiaFisiaticaMock.periodoMenstrual}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexualidad
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {historiaFisiaticaMock.sexualidad}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Anamnesis Sistémica */}
        <TabPanel header="Anamnesis Sistémica">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidades de comunicación
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.capacidadesDeComunicacion}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidades en motricidad
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.capacidadesEnMotricidad}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidades de la vida diaria
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.capacidadesDeVidaDiaria}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Examen Físico */}
        <TabPanel header="Examen Físico">
          <TabView>
            {/* General */}
            <TabPanel header="General">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actitud
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {historiaFisiaticaMock.actitud}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comunicación y códigos
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {historiaFisiaticaMock.comunicacionCodigos}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Piel y faneras
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {historiaFisiaticaMock.pielFaneras}
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Cabeza y sentidos */}
            <TabPanel header="Cabeza y sentidos">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cabeza
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.cabeza}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ojos
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.ojos}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Movimientos anormales
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.movimientosAnormales}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estrabismo
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.estrabismo}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orejas
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.orejas}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audición
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.audicion}
                    </div>
                  </div>
                </div>

                {/* Sub-tab para Complejo orofacial */}
                <TabView>
                  <TabPanel header="Complejo orofacial">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Boca
                          </label>
                          <div className="p-3 bg-gray-50 rounded border">
                            {historiaFisiaticaMock.boca}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Labios
                          </label>
                          <div className="p-3 bg-gray-50 rounded border">
                            {historiaFisiaticaMock.labios}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lengua
                          </label>
                          <div className="p-3 bg-gray-50 rounded border">
                            {historiaFisiaticaMock.lengua}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dentición
                          </label>
                          <div className="p-3 bg-gray-50 rounded border">
                            {historiaFisiaticaMock.denticion}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mordida
                          </label>
                          <div className="p-3 bg-gray-50 rounded border">
                            {historiaFisiaticaMock.mordida}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Paladar y velo
                          </label>
                          <div className="p-3 bg-gray-50 rounded border">
                            {historiaFisiaticaMock.paladarVelo}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maxilares
                        </label>
                        <div className="p-3 bg-gray-50 rounded border">
                          {historiaFisiaticaMock.maxilares}
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </TabPanel>

            {/* Tronco y extremidades */}
            <TabPanel header="Tronco y extremidades">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tórax
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.torax}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abdomen
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.abdomen}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Columna vertebral
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.columnaVertebral}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pelvis
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.pelvis}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caderas
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.caderas}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      M.M.I.I.
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.mmii}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pies
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.pies}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      M.M.S.S.
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.mmss}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manos
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.manos}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lateralidad
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.lateralidad}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Sistema y actividades */}
            <TabPanel header="Sistema y actividades">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ap. Respiratorio
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.apRespiratorio}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ap. Cardiovascular
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.apCardiovascular}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ap. Digestivo
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.apDigestivo}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actividad refleja
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.actividadRefleja}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actividad sensoperceptual
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.actividadSensoperceptual}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reacciones posturales
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.reaccionesPosturales}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desplazamiento-marcha
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.desplazamientoMarcha}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etapa del desarrollo
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {historiaFisiaticaMock.etapaDesarrollo}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </TabPanel>

        {/* Diagnóstico Funcional */}
        <TabPanel header="Diagnóstico Funcional">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnóstico Funcional
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.diagnosticoFuncional}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                Conducta a seguir, objetivos
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.conductaObjetivos}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                Objetivos de la familia
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {historiaFisiaticaMock.objetivosFamilia}
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
}
