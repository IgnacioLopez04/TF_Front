import { useAuth } from "./hooks";

export function NavBar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar flex justify-between items-center bg-gray-800 p-4 text-white">
      <div className="logo text-lg font-bold">Fundación Causana</div>
      <ul className="menu flex space-x-4">
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className="auth-buttons flex space-x-4">
        <button className="bg-blue-500 px-4 py-2 rounded cursor-pointer" onClick={()=>logout()}>Salir</button>
      </div>
    </nav>
  );
}