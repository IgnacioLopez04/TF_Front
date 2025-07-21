// Mockup de archivos multimedia
const imagenes = [
  {
    nombre: 'radiografia_lumbar_15062025.jpg',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&q=80',
    fecha: '15/06/2025',
  },
  {
    nombre: 'ejercicio_fisiatrico_18062025.png',
    url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&q=80',
    fecha: '18/06/2025',
  },
];

const videos = [
  {
    nombre: 'video_marcha_20062025.mp4',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    fecha: '20/06/2025',
  },
];

export function MultimediaPaciente() {
  return (
    <div className="space-y-8">
      {/* Botones para agregar multimedia */}
      <div className="flex gap-2 justify-end mb-2">
        <button
          className="bg-[#6d4bc1] hover:bg-[#5e35b1] text-white px-3 py-1 rounded font-semibold text-sm transition-colors"
          onClick={() =>
            alert('Funcionalidad para agregar imagen (a implementar)')
          }
        >
          <i className="pi pi-image mr-2"></i>Agregar Imagen
        </button>
        <button
          className="bg-[#6d4bc1] hover:bg-[#5e35b1] text-white px-3 py-1 rounded font-semibold text-sm transition-colors"
          onClick={() =>
            alert('Funcionalidad para agregar video (a implementar)')
          }
        >
          <i className="pi pi-video mr-2"></i>Agregar Video
        </button>
      </div>
      {/* Sección de Imágenes */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[#6d4bc1]">Imágenes</h3>
        {imagenes.length === 0 ? (
          <div className="text-gray-400 text-sm">No hay imágenes.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imagenes.map((img) => (
              <div
                key={img.nombre}
                className="bg-white rounded-lg shadow p-2 flex flex-col items-center"
              >
                <img
                  src={img.url}
                  alt={img.nombre}
                  className="rounded-lg object-cover w-full h-32 mb-2"
                />
                <div className="text-xs text-gray-600 font-mono break-all mb-1">
                  {img.nombre}
                </div>
                <div className="text-xs text-gray-400 mb-2">{img.fecha}</div>
                <a
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6d4bc1] hover:underline font-semibold"
                >
                  Ver imagen
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Videos */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[#6d4bc1]">Videos</h3>
        {videos.length === 0 ? (
          <div className="text-gray-400 text-sm">No hay videos.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((vid) => (
              <div
                key={vid.nombre}
                className="bg-white rounded-lg shadow p-2 flex flex-col items-center"
              >
                <div className="w-full flex flex-col items-center mb-2">
                  <span className="pi pi-video text-3xl text-[#6d4bc1] mb-2"></span>
                  <div className="text-xs text-gray-600 font-mono break-all mb-1">
                    {vid.nombre}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{vid.fecha}</div>
                </div>
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6d4bc1] hover:underline font-semibold"
                >
                  Ver video
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
