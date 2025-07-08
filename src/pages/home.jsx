import { useState } from 'react';
import { pacientes } from '../apis/pacientes';

export function Home() {
  const prestaciones = ['Todos', 'Hogar', 'Centro de Día', 'Centro de Rehabilitación'];
  const [prestacion, setPrestacion] = useState('Todos');

  const handleClickPrestacion = (opcion) => {
    setPrestacion(opcion);
  };

  // Filtrar y ordenar pacientes
  const pacientesFiltrados = prestacion === 'Todos'
    ? pacientes
    : pacientes.filter(paciente => paciente.prestacion === prestacion);
  const pacientesOrdenados = pacientesFiltrados.sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  );

  return (
    <div className="p-2 sm:p-4 bg-[#f5f2fa]">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row justify-end items-center mb-4 sm:mb-6 gap-2 w-full">
        <div className="flex flex-wrap gap-2 border-2 border-[#9575CD] rounded-2xl bg-causana-light p-2">
          {prestaciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => handleClickPrestacion(opcion)}
              className={`selector-button px-4 py-1 rounded-lg font-semibold transition-colors button-custom ${prestacion === opcion ? 'active' : 'bg-[#ede7f6] text-[#6d4bc1] border border-[#b39ddb]'}`}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pacientes en tarjetas */}
      <div className="flex flex-col items-center w-full gap-4">
        {pacientesOrdenados.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-2xl text-center text-gray-400">
            No hay pacientes para esta prestación.
          </div>
        )}
        {pacientesOrdenados.map((paciente, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4 w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar de paciente (iniciales) */}
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#ede7f6] flex items-center justify-center text-2xl font-bold text-[#6d4bc1]">
              {paciente.nombre.split(' ').map(n => n[0]).join('')}
            </div>
            {/* Info principal */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-semibold text-lg text-[#6d4bc1]">{paciente.nombre}</span>
                <span className="text-sm text-gray-500">DNI: {paciente.dni}</span>
                <span className="text-sm text-gray-500">Últ. Modificación: {paciente.fechaModificacion}</span>
              </div>
              <div className="text-sm text-[#9575CD] mt-1">{paciente.prestacion}</div>
            </div>
            {/* Botón Ver */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button className="selector-button button-custom border-2 mt-2 bg-[#b39ddb] text-white px-4 py-1 rounded" onClick={() => window.location.href = `/paciente/${paciente.dni}`}>Ver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
