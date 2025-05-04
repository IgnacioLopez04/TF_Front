import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/hooks";
import { NavBar } from "../components/NavBar";

export function Home() {
  const { user, authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!authenticated) {
      navigate('/login');
    }
  })

  return (
    <>
      <NavBar></NavBar>
      <div className="home">
        <h1>Home</h1>
        <p>Welcome to the home page!</p>
        <p>User: { user?.nombre } {user?.apellido}</p>
      </div>
    </>
  );
}