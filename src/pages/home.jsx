import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Home() {
  const { user, authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!authenticated) {
      toast.error('No tienes acceso a esta página. Por favor inicia sesión.');
      navigate('/login');
    }
  })

  return (
    <div className="home">
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}