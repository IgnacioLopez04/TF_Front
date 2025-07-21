import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
// import { Textarea } from 'primereact/textarea';

export function NuevoPaciente() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [prestacionSeleccionada, setPrestacionSeleccionada] = useState(null);
  const [mutualSeleccionada, setMutualSeleccionada] = useState(null);
  const [menorEdad, setMenorEdad] = useState(false);
  const [tutores, setTutores] = useState([]);

  const prestaciones = [
    { label: 'Hogar', value: 'Hogar' },
    { label: 'Centro de Día', value: 'Centro de Día' },
    { label: 'Centro de Rehabilitación', value: 'Centro de Rehabilitación' }
  ];

  const mutuales = [
    { label: 'Prevision', value: 'Prevision' },
    { label: 'OSDE', value: 'OSDE' },
    { label: 'PAMI', value: 'PAMI' },
    { label: 'Otros', value: 'Otros' }
  ];

  const agregarTutor = () => {
    const nuevoTutor = {
      id: Date.now(),
      nombreTutor: '',
      dniTutor: '',
      fechaNacimientoTutor: null,
      lugarNacimientoTutor: '',
      ocupacionTutor: ''
    };
    setTutores([...tutores, nuevoTutor]);
  };

  const eliminarTutor = (id) => {
    setTutores(tutores.filter(tutor => tutor.id !== id));
  };

  const actualizarTutor = (id, campo, valor) => {
    setTutores(tutores.map(tutor => 
      tutor.id === id ? { ...tutor, [campo]: valor } : tutor
    ));
  };

  const onSubmit = (data) => {
    // Combinar los datos del formulario con los valores de los componentes PrimeReact
    const datosCompletos = {
      ...data,
      fechaNacimiento: fechaNacimiento,
      prestacion: prestacionSeleccionada?.value,
      mutual: mutualSeleccionada?.value,
      tutores: tutores
    };
    
    console.log('Datos del nuevo paciente:', datosCompletos);
    
    // Aquí se implementaría la lógica para guardar el paciente en el backend
    // Por ahora simulamos que se guardó exitosamente y redirigimos a la pantalla del paciente
    // Usamos el DNI del paciente para la URL
    window.location.href = `/paciente/${data.dni}`;
  };

  const handleCancel = () => {
    window.location.href = '/home';
  };

  return (
    <div className="p-2 sm:p-4 bg-[#f5f2fa] min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#6d4bc1] mb-2">Agregar Nuevo Paciente</h1>
          <p className="text-gray-600">Complete los datos del paciente para registrarlo en el sistema y crear su historia clínica.</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Información básica */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <InputText
                  {...register('nombre', { required: 'El nombre es requerido' })}
                  className={`w-full ${errors.nombre ? 'p-invalid' : ''}`}
                  placeholder="Ingrese el nombre completo"
                />
                {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI *
                </label>
                <InputText
                  {...register('dni', { required: 'El DNI es requerido' })}
                  className={`w-full ${errors.dni ? 'p-invalid' : ''}`}
                  placeholder="Ingrese el DNI"
                />
                {errors.dni && <small className="p-error">{errors.dni.message}</small>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prestación *
                </label>
                <Dropdown
                  value={prestacionSeleccionada}
                  onChange={(e) => {
                    setPrestacionSeleccionada(e.value);
                    setValue('prestacion', e.value?.value);
                  }}
                  options={prestaciones}
                  className="w-full"
                  placeholder="Seleccione una prestación"
                />
                {errors.prestacion && <small className="p-error">{errors.prestacion.message}</small>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <Calendar
                  value={fechaNacimiento}
                  onChange={(e) => {
                    setFechaNacimiento(e.value);
                    setMenorEdad(e.value > new Date(new Date().getFullYear() - 18, 0, 1));
                    setValue('fechaNacimiento', e.value);
                  }}
                  className="w-full"
                  placeholder="Seleccione fecha"
                  maxDate={new Date()}
                />
                {errors.fechaNacimiento && <small className="p-error">{errors.fechaNacimiento.message}</small>}
              </div>
            </div>

            <Divider></Divider>
            <div className="grid grid-cols-1 gap-4">
              <div className="w-full">
                <label className="block text-xl font-medium text-gray-700 mb-2">Ocupación</label>
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual
                    </label>
                    <InputText
                      {...register('ocupacionActual', { required: 'La ocupación actual es requerida' })}
                      className={`w-full ${errors.ocupacionActual ? 'p-invalid' : ''}`}
                      placeholder="Ingrese la ocupación actual"
                    />
                    {errors.ocupacionActual && <small className="p-error">{errors.ocupacionActual.message}</small>}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anterior
                    </label>
                    <InputText
                      {...register('ocupacionAnterior', { required: 'La ocupación anterior es requerida' })}
                      className={`w-full ${errors.ocupacionAnterior ? 'p-invalid' : ''}`}
                      placeholder="Ingrese la ocupación anterior"
                    />
                    {errors.ocupacionAnterior && <small className="p-error">{errors.ocupacionAnterior.message}</small>}
                  </div>
                </div>
              </div>
            </div>

            <Divider></Divider>
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">
                Domicilio actual
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle *
                  </label>
                  <InputText
                    {...register('calle', { required: 'La calle es requerida' })}
                    className={`w-full ${errors.calle ? 'p-invalid' : ''}`}
                    placeholder="Ej: Calle Falsa"
                  />
                  {errors.calle && <small className="p-error">{errors.calle.message}</small>}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <InputText
                    {...register('numeroDomicilio', { required: 'El número es requerido' })}
                    className={`w-full ${errors.numeroDomicilio ? 'p-invalid' : ''}`}
                    placeholder="Ej: 123"
                  />
                  {errors.numeroDomicilio && <small className="p-error">{errors.numeroDomicilio.message}</small>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Piso / Departamento
                    </label>
                    <InputText
                      {...register('depto')}
                      className="w-full"
                      placeholder="Ej: 1A, etc"
                    />
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barrio
                    </label>
                    <InputText
                      {...register('barrio', { required: 'El barrio es requerido' })}
                      className={`w-full ${errors.barrio ? 'p-invalid' : ''}`}
                      placeholder="Ej: Alta Córdoba"
                    />
                    {errors.barrio && <small className="p-error">{errors.barrio.message}</small>}
                  </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localidad *
                  </label>
                  <InputText
                    {...register('localidad', { required: 'La localidad es requerida' })}
                    className={`w-full ${errors.localidad ? 'p-invalid' : ''}`}
                    placeholder="Ej: Córdoba Capital"
                  />
                  {errors.localidad && <small className="p-error">{errors.localidad.message}</small>}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia
                  </label>
                  <InputText
                    {...register('provincia', { required: 'La provincia es requerida' })}
                    className={`w-full ${errors.provincia ? 'p-invalid' : ''}`}
                    placeholder="Ej: Córdoba"
                  />
                  {errors.provincia && <small className="p-error">{errors.provincia.message}</small>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Con quien vive
                  </label>
                  <InputText
                    {...register('conQuienVive', { required: 'Este campo es requerido' })}
                    className={`w-full ${errors.conQuienVive ? 'p-invalid' : ''}`}
                    placeholder="Ej: Madre, padre, etc"
                  />
                  {errors.conQuienVive && <small className="p-error">{errors.conQuienVive.message}</small>}
                </div>
              </div>
            </div>
            <Divider></Divider>
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">Mutual</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mutual
                  </label>
                  <Dropdown
                    value={mutualSeleccionada}
                    onChange={(e) => {
                      setMutualSeleccionada(e.value);
                      setValue('mutual', e.value?.value);
                    }}
                    options={mutuales}
                    className="w-full"
                    placeholder="Seleccione una mutual"
                  />
                  {errors.mutual && <small className="p-error">{errors.mutual.message}</small>}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de afiliado / beneficiario
                  </label>
                  <InputText
                    {...register('numeroAfiliado', { required: 'El número de afiliado es requerido' })}
                    className={`w-full ${errors.numeroAfiliado ? 'p-invalid' : ''}`}
                    placeholder="Ej: 1234567890"
                  />
                  {errors.numeroAfiliado && <small className="p-error">{errors.numeroAfiliado.message}</small>}
                </div>
              </div>
            </div>
            {menorEdad && (
              <>
                <Divider></Divider>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-lg font-medium text-gray-700">
                      Tutores del paciente menor de edad
                    </label>
                    <Button
                      type="button"
                      icon="pi pi-plus"
                      label="Agregar Tutor"
                      variant="primary"
                      onClick={agregarTutor}
                    />
                  </div>
                  
                  {tutores.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No hay tutores agregados. Haga clic en &quot;Agregar Tutor&quot; para comenzar.
                    </div>
                  )}
                  
                  {tutores.map((tutor, index) => (
                    <div key={tutor.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Tutor {index + 1}</h4>
                        <Button
                          type="button"
                          icon="pi pi-trash"
                          variant="danger"
                          onClick={() => eliminarTutor(tutor.id)}
                          className="text-red-500 hover:text-red-700"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo del tutor *
                          </label>
                          <InputText
                            value={tutor.nombreTutor}
                            onChange={(e) => actualizarTutor(tutor.id, 'nombreTutor', e.target.value)}
                            className="w-full"
                            placeholder="Ej: Juan Pérez"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            DNI del tutor *
                          </label>
                          <InputText
                            value={tutor.dniTutor}
                            onChange={(e) => actualizarTutor(tutor.id, 'dniTutor', e.target.value)}
                            className="w-full"
                            placeholder="Ej: 1234567890"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha de nacimiento
                          </label>
                          <Calendar
                            value={tutor.fechaNacimientoTutor}
                            onChange={(e) => actualizarTutor(tutor.id, 'fechaNacimientoTutor', e.value)}
                            className="w-full"
                            placeholder="Seleccione fecha"
                            maxDate={new Date()}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lugar de nacimiento *
                          </label>
                          <InputText
                            value={tutor.lugarNacimientoTutor}
                            onChange={(e) => actualizarTutor(tutor.id, 'lugarNacimientoTutor', e.target.value)}
                            className="w-full"
                            placeholder="Ej: Córdoba Capital"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ocupación *
                        </label>
                        <InputText
                          value={tutor.ocupacionTutor}
                          onChange={(e) => actualizarTutor(tutor.id, 'ocupacionTutor', e.target.value)}
                          className="w-full"
                          placeholder="Ej: Profesor"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              />
              <Button
                type="submit"
                label="Guardar Paciente"
                icon="pi pi-check"
                variant="primary"
                className="flex-1"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 