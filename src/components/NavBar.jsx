import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useAuth } from './hooks';

export function NavBar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar flex justify-between items-center bg-gray-100 p-4 text-gray-500">
      <div className="flex items-center">
        <img src="" alt="icono" className="mr-4"></img>
        <ul className="menu flex space-x-4">
          <li className="px-2 py-1 rounded hover:bg-gray-200">
            <a href="/home">Inicio</a>
          </li>
          <li className="px-2 py-1 rounded hover:bg-gray-200">
            <a href="/about">Pacientes</a>
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-between">
        <Avatar label='JC'  style={{backgroundColor: '#EDE7F6', borderRadius: '15%', marginRight: '10px'}}></Avatar>
        <Button
          icon="pi pi-sign-out"
          className="px-4 py-2 rounded cursor-pointer hover:bg-gray-200"
          onClick={() => logout()}
          severity='secondary'
          text
        ></Button>
      </div>
    </nav>
  );
}
