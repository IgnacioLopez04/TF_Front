import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { pacientes } from '../apis/pacientes';
import { Button } from '../components/Button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { HistoriaFisiatica } from '../components/HistoriaFisiatica';
import { MultimediaPaciente } from '../components/MultimediaPaciente';

// Mockup de informes con comentarios
const informesMock = [
  {
    id: 1,
    titulo: 'Avance en la terapia',
    autor: 'Dr. Juan Manuel Belgrano',
    fecha: '26/06/2025',
    contenido:
      'Paciente muestra una mejoría significativa en la movilidad del miembro superior derecho. Se recomienda continuar con el plan de ejercicios actuales y reevaluar en dos semanas.\n\nNo se reportan efectos adversos.\n\nSe sugiere aumentar la intensidad de los ejercicios de estiramiento.',
    comentarios: [
      {
        autor: 'Lic. Ana Pérez',
        texto: 'Muy buen avance, felicidades al paciente!',
        fecha: '27/06/2025',
      },
      {
        autor: 'Dr. Juan Manuel Belgrano',
        texto: 'Continuar con el mismo plan y monitorear dolor.',
        fecha: '28/06/2025',
      },
    ],
  },
  {
    id: 2,
    titulo: 'Evaluación inicial',
    autor: 'Lic. Ana Pérez',
    fecha: '15/06/2025',
    contenido:
      'Se realiza evaluación inicial. Paciente refiere dolor moderado en la zona lumbar. Se inicia tratamiento fisiátrico con sesiones de 45 minutos, 3 veces por semana.',
    comentarios: [
      {
        autor: 'Dr. Juan Manuel Belgrano',
        texto: 'Revisar evolución del dolor en próxima consulta.',
        fecha: '16/06/2025',
      },
    ],
  },
];

export function Paciente() {
  const { dni } = useParams();
  const [tab, setTab] = useState('informes');
  const [visibleInforme, setVisibleInforme] = useState(false);
  const [informeSeleccionado, setInformeSeleccionado] = useState(null);
  const [visibleComentario, setVisibleComentario] = useState(false);
  const [comentario, setComentario] = useState('');
  // Buscar paciente por DNI
  const paciente = pacientes.find((p) => p.dni === dni);

  if (!paciente) {
    return (
      <div className="p-4 bg-[#f5f2fa] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Paciente no encontrado
          </h2>
          <p className="text-gray-500">
            No se encontró un paciente con el DNI: {dni}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 bg-[#f5f2fa] min-h-screen">
      {/* Header responsive: flex-col en mobile, row en desktop */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
        {/* Avatar de paciente (iniciales) */}
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-[#ede7f6] flex items-center justify-center text-4xl sm:text-5xl font-bold text-[#6d4bc1]">
          {paciente.nombre
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        {/* Datos principales */}
        <div className="flex-1 flex flex-col justify-center w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6d4bc1] text-center md:text-left">
            {paciente.nombre}
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-6 mt-2 text-base sm:text-lg items-center md:items-start text-center md:text-left">
            <span>
              <b>DNI:</b> {paciente.dni}
            </span>
            <span>
              <b>Prestación:</b> {paciente.prestacion}
            </span>
            <span>
              <b>Últ. Modificación:</b> {paciente.fechaModificacion}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs responsive */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6 w-full">
        <button
          onClick={() => setTab('informes')}
          className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-t-lg font-semibold focus:outline-none ${
            tab === 'informes'
              ? 'bg-[#b39ddb] text-white'
              : 'bg-[#ede7f6] text-[#6d4bc1]'
          }`}
        >
          Informes
        </button>
        <button
          onClick={() => setTab('historia')}
          className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-t-lg font-semibold focus:outline-none ${
            tab === 'historia'
              ? 'bg-[#b39ddb] text-white'
              : 'bg-[#ede7f6] text-[#6d4bc1]'
          }`}
        >
          Historia Fisiátrica
        </button>
        <button
          onClick={() => setTab('multimedia')}
          className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-t-lg font-semibold focus:outline-none ${
            tab === 'multimedia'
              ? 'bg-[#b39ddb] text-white'
              : 'bg-[#ede7f6] text-[#6d4bc1]'
          }`}
        >
          Multimedia
        </button>
      </div>

      {/* Contenido de cada tab */}
      <div className="bg-white rounded-b-xl shadow p-2 sm:p-6 mt-0 sm:mt-0">
        {tab === 'informes' && (
          <div>
            {/* Listado de informes mockup */}
            {informesMock.map((informe) => (
              <div
                key={informe.id}
                className="mb-4 sm:mb-6 border rounded-lg p-2 sm:p-4 bg-[#f5f2fa]"
              >
                <div className="flex flex-col sm:flex-row justify-between mb-2 gap-1 sm:gap-0">
                  <span className="font-semibold">{informe.titulo}</span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {informe.autor} &nbsp; Fecha: {informe.fecha}
                  </span>
                </div>
                <textarea
                  className="w-full bg-white border rounded p-2 mb-2 text-xs sm:text-base"
                  rows={4}
                  value={
                    informe.contenido.length > 120
                      ? informe.contenido.slice(0, 120) + '...'
                      : informe.contenido
                  }
                  readOnly
                />
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <Button
                    variant="action"
                    label="Ver"
                    size="sm"
                    onClick={() => {
                      setInformeSeleccionado(informe);
                      setVisibleInforme(true);
                    }}
                  />
                  <Button
                    variant="secondary"
                    label="Agregar comentario"
                    size="sm"
                    onClick={() => {
                      setVisibleComentario(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'historia' && <HistoriaFisiatica dni={dni} />}
        {tab === 'multimedia' && <MultimediaPaciente />}
      </div>
      <Dialog
        header={informeSeleccionado ? informeSeleccionado.titulo : 'Informe'}
        visible={visibleInforme}
        onHide={() => {
          setVisibleInforme(false);
          setInformeSeleccionado(null);
        }}
        className="w-full max-w-screen-md"
      >
        {informeSeleccionado && (
          <div>
            <div className="mb-2">
              <b>Autor:</b> {informeSeleccionado.autor} <br />
              <b>Fecha:</b> {informeSeleccionado.fecha}
            </div>
            <div className="mb-4 whitespace-pre-line">
              {informeSeleccionado.contenido}
            </div>
            <div>
              <b>Comentarios:</b>
              <ul className="mt-2">
                {informeSeleccionado.comentarios.length === 0 && (
                  <li className="text-gray-400 text-sm">Sin comentarios.</li>
                )}
                {informeSeleccionado.comentarios.map((comentario, idx) => (
                  <li key={idx} className="mb-2 border-b pb-2">
                    <div className="text-sm">{comentario.texto}</div>
                    <div className="text-xs text-gray-500">
                      {comentario.autor} - {comentario.fecha}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        header={`Agregar Comentario`}
        visible={visibleComentario}
        onHide={() => {
          setVisibleComentario(false);
          setComentario('');
        }}
        className="w-full max-w-screen-md"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="comentario" className="text-sm font-medium">
            Comentario
          </label>
          <InputTextarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={5}
            cols={30}
          />
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              onClick={() => {
                setVisibleComentario(false);
                setComentario('');
              }}
            />
            <Button
              label="Agregar"
              onClick={() => {
                setVisibleComentario(false);
                setComentario('');
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
