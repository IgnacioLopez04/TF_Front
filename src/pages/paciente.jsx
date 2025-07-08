import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { pacientes } from '../apis/pacientes';

export function Paciente() {
  const { dni } = useParams();
  const [tab, setTab] = useState('informes');

  // Buscar paciente por DNI
  const paciente = pacientes.find(p => p.dni === dni);

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
      {/* Header responsive: flex-col en mobile, row en desktop */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
        {/* Avatar de paciente (iniciales) */}
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-[#ede7f6] flex items-center justify-center text-4xl sm:text-5xl font-bold text-[#6d4bc1]">
          {paciente.nombre.split(' ').map(n => n[0]).join('')}
        </div>
        {/* Datos principales */}
        <div className="flex-1 flex flex-col justify-center w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6d4bc1] text-center md:text-left">{paciente.nombre}</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-6 mt-2 text-base sm:text-lg items-center md:items-start text-center md:text-left">
            <span><b>DNI:</b> {paciente.dni}</span>
            <span><b>Prestación:</b> {paciente.prestacion}</span>
            <span><b>Últ. Modificación:</b> {paciente.fechaModificacion}</span>
          </div>
        </div>
      </div>

      {/* Tabs responsive */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6 w-full">
        <button onClick={() => setTab('informes')} className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-t-lg font-semibold focus:outline-none ${tab === 'informes' ? 'bg-[#b39ddb] text-white' : 'bg-[#ede7f6] text-[#6d4bc1]'}`}>Informes</button>
        <button onClick={() => setTab('historia')} className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-t-lg font-semibold focus:outline-none ${tab === 'historia' ? 'bg-[#b39ddb] text-white' : 'bg-[#ede7f6] text-[#6d4bc1]'}`}>Historia Fisiátrica</button>
        <button onClick={() => setTab('multimedia')} className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-t-lg font-semibold focus:outline-none ${tab === 'multimedia' ? 'bg-[#b39ddb] text-white' : 'bg-[#ede7f6] text-[#6d4bc1]'}`}>Multimedia</button>
      </div>

      {/* Contenido de cada tab */}
      <div className="bg-white rounded-b-xl shadow p-2 sm:p-6 mt-0 sm:mt-0">
        {tab === 'informes' && (
          <div>
            {/* Tarjeta de informe */}
            <div className="mb-4 sm:mb-6 border rounded-lg p-2 sm:p-4 bg-[#f5f2fa]">
              <div className="flex flex-col sm:flex-row justify-between mb-2 gap-1 sm:gap-0">
                <span className="font-semibold">Avance en la terapia</span>
                <span className="text-xs sm:text-sm text-gray-500">Dr. Juan Manuel Belgrano &nbsp; Fecha: 26/06/2025</span>
              </div>
              <textarea className="w-full bg-white border rounded p-2 mb-2 text-xs sm:text-base" rows={4} value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." readOnly />
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button className="bg-[#b39ddb] text-white px-4 py-1 rounded">Ver</button>
                <button className="bg-[#ede7f6] text-[#6d4bc1] px-4 py-1 rounded border">Agregar comentario</button>
              </div>
            </div>
            {/* Otro informe de ejemplo */}
            <div className="border rounded-lg p-2 sm:p-4 bg-[#f5f2fa]">
              <div className="flex flex-col sm:flex-row justify-between mb-2 gap-1 sm:gap-0">
                <span className="font-semibold">Avance en la terapia</span>
                <span className="text-xs sm:text-sm text-gray-500">Dr. Juan Manuel Belgrano &nbsp; Fecha: 26/06/2025</span>
              </div>
              <textarea className="w-full bg-white border rounded p-2 mb-2 text-xs sm:text-base" rows={2} value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." readOnly />
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button className="bg-[#b39ddb] text-white px-4 py-1 rounded">Ver</button>
                <button className="bg-[#ede7f6] text-[#6d4bc1] px-4 py-1 rounded border">Agregar comentario</button>
              </div>
            </div>
          </div>
        )}
        {tab === 'historia' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="border rounded-lg p-2 sm:p-4 bg-[#f5f2fa]">
              <div className="font-semibold mb-2">Historia Fisiátrica</div>
              <div className="text-xs sm:text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna .</div>
              <ul className="list-disc ml-6 text-xs sm:text-base">
                <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
                <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
              </ul>
            </div>
            <div className="border rounded-lg p-2 sm:p-4 bg-[#f5f2fa]">
              <div className="font-semibold mb-2">Examen Físico</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ul className="list-disc ml-6 text-xs sm:text-base">
                  <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
                  <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
                  <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
                </ul>
                <ul className="list-disc ml-6 text-xs sm:text-base">
                  <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
                  <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
                  <li>Onsectetur adipiscing elit, ut labore et dolore magna .</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {tab === 'multimedia' && (
          <div>
            <div className="text-center text-gray-400 text-sm sm:text-base">Sin archivos multimedia.</div>
          </div>
        )}
      </div>
    </div>
  );
} 