
import { useAuth } from "../components/hooks";

export function Home() {
  const { user } = useAuth();
  return (
    <>
      <div className="home">
        <h1>Home</h1>
        <p>Welcome to the home page!</p>
        <p>User: { user?.nombre } {user?.apellido}</p>
      </div>
    </>
  );
}