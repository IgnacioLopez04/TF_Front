import { GoogleLogin } from '@react-oauth/google';
// import { apiLogin } from "../apis/login.js";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/hooks.js';
import { Button } from '../components/Button';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = async (credentialResponse) => {
    // const { credential } = credentialResponse;
    try {
      // await login(credential);
      toast.success('Inicio de sesión exitoso');
      navigate('/home');
    } catch (err) {
      toast.error('No es posible iniciar sesión');
    }
  };

  return (
    <>
      <div className="login w-full flex flex-col justify-center items-center h-screen">
        <div className="border-2 border-gray-300 rounded-lg p-4 flex flex-col">
          <div className="">
            <h1 className="font-bold">Inicio Sesion</h1>
            <p>Bienvenido a Fundación Causana</p>
          </div>
          <div className="mt-2">
            <Button
              variant="primary"
              className="w-full"
              label="Iniciar Sesión"
              onClick={() => navigate('/home')}
            />
            {/* <GoogleLogin onSuccess={handleLoginSuccess}></GoogleLogin> */}
            <small className="text-sm">
              Inicia sesión con tu cuenta de Google para ingresar a la
              aplicación.
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
