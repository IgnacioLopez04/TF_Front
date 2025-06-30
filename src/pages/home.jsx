import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
        

export function Home() {


  return (
    <>
      <Divider className='my-3' align='left'><p className='font-semibold text-causana-primary'>Pacientes</p></Divider>
      <section className="flex flex-col w-full">
        <div className='flex gap-2'>
          <Button label='Hogar' severity='secondary'></Button>
          <Button label='Centro de Día' severity='secondary'></Button>
          <Button label='Centro de Rehabilitación' severity='secondary'></Button>
        </div>
        <div className='flex justify-center w-full py-5 px-7 overflow-auto'>
          <Accordion className='w-3/4'>
            <AccordionTab header={`Juanito Paciente - DNI 12345678`}>
              <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </AccordionTab>
            <AccordionTab header={`Juanito Paciente - DNI 12345678`}>
              <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </AccordionTab>
            <AccordionTab header={`Juanito Paciente - DNI 12345678`}>
              <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </AccordionTab>
          </Accordion>
        </div>
      </section>
    </>
  );
}
