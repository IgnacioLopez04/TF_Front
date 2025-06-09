import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/hooks';
import { NavBar } from '../components/NavBar';

export function Home() {
  const { user, authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // if(!authenticated) {
    //   navigate('/login');
    // }
  });

  return (
    <>
      <NavBar></NavBar>
      <section>
        <div className="flex border m-5 ">
          <img src="" alt="foto medico" className="mr-5"></img>
          <div className="flex flex-col">
            <h3>Dr. Juanito Calvo</h3>
            <small>Médico Fisiatra</small>
            <div className="flex">
              <div className="flex items-center">
                <i className="pi pi-id-card mx-2 pt-1 text-sm"></i>
                <p className="flex text-sm py-1">1378454546</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="home">
        <h1>Home</h1>
        <p>Welcome to the home page!</p>
        <p>
          User: {user?.nombre} {user?.apellido}
        </p>
      </div>
    </>
  );
}
