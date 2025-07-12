import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { pacientes } from '../apis/pacientes';

export function NuevaHistoria() {
  const { dni } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [fechaEvaluacion, setFechaEvaluacion] = useState(new Date());
  const [pasoActual, setPasoActual] = useState(1);


  // Buscar paciente por DNI
  const paciente = pacientes.find(p => p.dni === dni);

  const pasos = [
    { numero: 1, titulo: 'Evaluación y Consulta' },
    { numero: 2, titulo: 'Antecedentes' },
    { numero: 3, titulo: 'Anamnesis Sistémica' },
    { numero: 4, titulo: 'Examen Físico' },
    { numero: 5, titulo: 'Diagnóstico Funcional' }
  ];

  const siguientePaso = () => {
    if (pasoActual < 5) {
      setPasoActual(pasoActual + 1);
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const onSubmit = (data) => {
    const datosCompletos = {
      ...data,
      fechaEvaluacion: fechaEvaluacion,
      dniPaciente: dni
    };
    
    console.log('Nueva historia fisiátrica:', datosCompletos);
    // Redirigir de vuelta a la página del paciente
    window.location.href = `/paciente/${dni}`;
  };

  const handleCancel = () => {
    window.location.href = `/paciente/${dni}`;
  };



  if (!paciente) {
    return (
      <div className="p-4 bg-[#f5f2fa] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Paciente no encontrado</h2>
          <p className="text-gray-500">No se encontró un paciente con el DNI: {dni}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 bg-[#f5f2fa] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#6d4bc1] mb-2">Nueva Historia Fisiátrica</h1>
          <p className="text-gray-600">Paciente: <strong>{paciente.nombre}</strong> (DNI: {paciente.dni})</p>
        </div>

        {/* Indicador de pasos */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {pasos.map((paso, index) => (
              <div key={paso.numero} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  paso.numero <= pasoActual 
                    ? 'bg-[#6d4bc1] text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {paso.numero}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                  paso.numero <= pasoActual ? 'text-[#6d4bc1]' : 'text-gray-500'
                }`}>
                  {paso.titulo}
                </span>
                {index < pasos.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 hidden sm:block ${
                    paso.numero < pasoActual ? 'bg-[#6d4bc1]' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Paso 1: Evaluación y Consulta */}
            {pasoActual === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#6d4bc1] mb-4">Información de la Evaluación</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Evaluación *
                    </label>
                    <Calendar
                      value={fechaEvaluacion}
                      onChange={(e) => {
                        setFechaEvaluacion(e.value);
                        setValue('fechaEvaluacion', e.value);
                      }}
                      className="w-full"
                      placeholder="Seleccione fecha"
                      maxDate={new Date()}
                    />
                  </div>
                </div>

                <Divider></Divider>

                <h2 className="text-xl font-semibold text-[#6d4bc1] mb-4">Consulta</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Derivados por *
                    </label>
                    <InputTextarea
                      {...register('derivadosPor', { required: 'El motivo de consulta es requerido' })}
                      className={`w-full ${errors.derivadosPor ? 'p-invalid' : ''}`}
                      rows={4}
                      placeholder="Describa el motivo principal de la consulta..."
                    />
                    {errors.derivadosPor && <small className="p-error">{errors.derivadosPor.message}</small>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Antecedentes del cuadro actual
                    </label>
                    <InputTextarea
                      {...register('antecedentes')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa los antecedentes relevantes..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicación actual
                    </label>
                    <InputTextarea
                      {...register('medicacionActual')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa la medicación que toma actualmente..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estudios realizados
                    </label>
                    <InputTextarea
                      {...register('estudiosRealizados')}
                      className="w-full"
                      rows={3}
                      placeholder="Liste los estudios realizados..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Antecedentes */}
            {pasoActual === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#6d4bc1] mb-4">Antecedentes</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hereditarios
                    </label>
                    <InputTextarea
                      {...register('hereditario')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa los antecedentes hereditarios relevantes..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patológico
                    </label>
                    <InputTextarea
                      {...register('patologico')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa los antecedentes patológicos relevantes..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quirúrgicos
                    </label>
                    <InputTextarea
                      {...register('quirurgico')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa los antecedentes quirúrgicos relevantes..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Metabólicos
                    </label>
                    <InputTextarea
                      {...register('metabolico')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa los antecedentes metabólicos relevantes..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inmunológicos
                    </label>
                    <InputTextarea
                      {...register('inmunologico')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa los antecedentes inmunológicos relevantes..."
                    />
                  </div>
                </div>

                <Divider></Divider>

                <h3 className="font-semibold text-gray-700 mb-3">Fisiológicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dormir
                    </label>
                    <InputTextarea
                      {...register('dormir')}
                      className="w-full"
                      rows={2}
                      placeholder="Describa el patrón de sueño..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alimentación
                    </label>
                    <InputTextarea
                      {...register('alimentacion')}
                      className="w-full"
                      rows={2}
                      placeholder="Describa los hábitos alimentarios..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catarsis
                    </label>
                    <InputTextarea
                      {...register('catarsis')}
                      className="w-full"
                      rows={2}
                      placeholder="Describa el patrón intestinal..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diuresis
                    </label>
                    <InputTextarea
                      {...register('diuresis')}
                      className="w-full"
                      rows={2}
                      placeholder="Describa el patrón urinario..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Periodo menstrual
                    </label>
                    <InputTextarea
                      {...register('periodoMenstrual')}
                      className="w-full"
                      rows={2}
                      placeholder="Describa el patrón menstrual..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sexualidad
                    </label>
                    <InputTextarea
                      {...register('sexualidad')}
                      className="w-full"
                      rows={2}
                      placeholder="Describa aspectos relevantes..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Anamnesis Sistémica */}
            {pasoActual === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#6d4bc1] mb-4">Anamnesis Sistémica</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidades de comunicacion
                    </label>
                    <InputTextarea
                      {...register('capacidadesDeComunicacion')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa las capacidades de comunicación..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidades en motricidad
                    </label>
                    <InputTextarea
                      {...register('capacidadesEnMotricidad')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa las capacidades en motricidad..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidades de la vida diaria
                    </label>
                    <InputTextarea
                      {...register('capacidadesDeVidaDiaria')}
                      className="w-full"
                      rows={3}
                      placeholder="Describa las capacidades de la vida diaria..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 4: Examen Físico */}
            {pasoActual === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#6d4bc1] mb-4">Examen Físico</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actitud</label>
                    <InputText {...register('actitud')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comunicación, códigos</label>
                    <InputText {...register('comunicacionCodigos')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Piel y faneras</label>
                    <InputText {...register('pielFaneras')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cabeza</label>
                    <InputText {...register('cabeza')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ojos</label>
                    <InputText {...register('ojos')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Movimientos anormales</label>
                    <InputTextarea {...register('movimientosAnormales')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estrabismo</label>
                    <InputText {...register('estrabismo')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Orejas</label>
                    <InputText {...register('orejas')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audición</label>
                    <InputText {...register('audicion')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Complejo orofacial</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Boca</label>
                        <InputText {...register('boca')} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Labios</label>
                        <InputText {...register('labios')} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lengua</label>
                        <InputText {...register('lengua')} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dentición</label>
                        <InputText {...register('denticion')} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mordida</label>
                        <InputText {...register('mordida')} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paladar, velo</label>
                        <InputText {...register('paladarVelo')} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maxilares</label>
                        <InputText {...register('maxilares')} className="w-full" />
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tórax</label>
                    <InputText {...register('torax')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Abdomen</label>
                    <InputText {...register('abdomen')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Columna vertebral</label>
                    <InputText {...register('columnaVertebral')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pelvis</label>
                    <InputText {...register('pelvis')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caderas</label>
                    <InputText {...register('caderas')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">M.M.I.I.</label>
                    <InputText {...register('mmii')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pies</label>
                    <InputText {...register('pies')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">M.M.S.S.</label>
                    <InputText {...register('mmss')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manos</label>
                    <InputText {...register('manos')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lateralidad</label>
                    <InputText {...register('lateralidad')} className="w-full" />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ap. Respiratorio</label>
                    <InputTextarea {...register('apRespiratorio')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ap. Cardiovascular</label>
                    <InputTextarea {...register('apCardiovascular')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ap. Digestivo</label>
                    <InputTextarea {...register('apDigestivo')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actividad refleja</label>
                    <InputTextarea {...register('actividadRefleja')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actividad sensoperceptual</label>
                    <InputTextarea {...register('actividadSensoperceptual')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reacciones posturales</label>
                    <InputTextarea {...register('reaccionesPosturales')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Desplazamiento-marcha</label>
                    <InputTextarea {...register('desplazamientoMarcha')} className="w-full" rows={2} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Etapa del desarrollo</label>
                    <InputTextarea {...register('etapaDesarrollo')} className="w-full" rows={2} />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 5: Diagnóstico Funcional */}
            {pasoActual === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#6d4bc1] mb-4">Diagnóstico Funcional</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnóstico Funcional</label>
                  <InputTextarea
                    {...register('diagnosticoFuncional', { required: 'El diagnóstico funcional es requerido' })}
                    className={`w-full ${errors.diagnosticoFuncional ? 'p-invalid' : ''}`}
                    rows={7}
                    placeholder="Describa el diagnóstico funcional..."
                  />
                  {errors.diagnosticoFuncional && <small className="p-error">{errors.diagnosticoFuncional.message}</small>}
                </div>
                <Divider />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 italic">Conducta a seguir, objetivos</label>
                  <InputTextarea
                    {...register('conductaObjetivos', { required: 'Este campo es requerido' })}
                    className={`w-full ${errors.conductaObjetivos ? 'p-invalid' : ''}`}
                    rows={7}
                    placeholder="Describa la conducta a seguir y los objetivos..."
                  />
                  {errors.conductaObjetivos && <small className="p-error">{errors.conductaObjetivos.message}</small>}
                </div>
                <Divider />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 italic">Objetivos de la familia</label>
                  <InputTextarea
                    {...register('objetivosFamilia', { required: 'Este campo es requerido' })}
                    className={`w-full ${errors.objetivosFamilia ? 'p-invalid' : ''}`}
                    rows={7}
                    placeholder="Describa los objetivos de la familia..."
                  />
                  {errors.objetivosFamilia && <small className="p-error">{errors.objetivosFamilia.message}</small>}
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                severity="secondary"
                onClick={handleCancel}
                className="flex-1"
              />
              {pasoActual > 1 && (
                <Button
                  type="button"
                  label="Anterior"
                  icon="pi pi-chevron-left"
                  severity="primary"
                  onClick={pasoAnterior}
                  className="flex-1"
                />
              )}
              
              {pasoActual < 5 ? (
                <Button
                  type="button"
                  label="Siguiente"
                  icon="pi pi-chevron-right"
                  iconPos="right"
                  onClick={siguientePaso}
                  className="flex-1 bg-[#6d4bc1] hover:bg-[#5e35b1]"
                />
              ) : (
                <Button
                  type="submit"
                  label="Guardar Historia Fisiátrica"
                  icon="pi pi-check"
                  className="flex-1 bg-[#6d4bc1] hover:bg-[#5e35b1]"
                />
              )}
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 