import { NavBar } from '../components/NavBar';

export function Home() {
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
    </>
  );
}
