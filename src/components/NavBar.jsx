import { Button } from './Button';
import { Avatar } from 'primereact/avatar';
import { useAuth } from './hooks';

export function NavBar() {
  const { logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow rounded-b-xl px-2 sm:px-6 py-2 flex flex-row items-center justify-between gap-2">
      {/* Logo e ícono */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#ede7f6] flex items-center justify-center text-2xl font-bold text-[#6d4bc1]">
            <span>TF</span>
          </div>
          <span className="text-xl font-bold text-[#6d4bc1] hidden sm:inline">
            Causana
          </span>
        </div>
        {/* Menú */}
        <ul className="flex gap-2 sm:gap-4 ml-4">
          <li>
            <a
              href="/home"
              className="px-3 py-1 rounded-lg font-semibold text-[#6d4bc1] hover:bg-[#ede7f6] transition-colors"
            >
              Inicio
            </a>
          </li>
          {/* <li>
            <a href="/about" className="px-3 py-1 rounded-lg font-semibold text-[#6d4bc1] hover:bg-[#ede7f6] transition-colors">Pacientes</a>
          </li> */}
        </ul>
      </div>
      {/* Botón Agregar Paciente */}
      <div className="flex items-center gap-2">
        <Button
          icon="pi pi-plus"
          label="Agregar Paciente"
          variant="primary"
          onClick={() => (window.location.href = '/nuevo-paciente')}
        />
      </div>
      {/* Avatar y logout */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Avatar
          label="JC"
          style={{
            backgroundColor: '#EDE7F6',
            borderRadius: '15%',
            marginRight: '10px',
            color: '#6d4bc1',
          }}
        ></Avatar>
        <Button
          icon="pi pi-sign-out"
          variant="ghost"
          onClick={() => logout()}
        />
      </div>
    </nav>
  );
}
