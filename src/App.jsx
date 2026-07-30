/*
  ============================================================
  APP.JSX
  SISTEMA DE GESTIÓN DE CITAS ODONTOLÓGICAS
  ============================================================

  Componente principal de la aplicación React.

  Se encarga de:
  - Mostrar el encabezado general del sistema.
  - Mostrar las pestañas de navegación.
  - Permitir cambiar entre Pacientes y Citas.
  - Mostrar únicamente el módulo seleccionado.
*/

import { useState } from 'react'

/*
  Importa los estilos principales de la aplicación.
*/
import './App.css'

/*
  Importa los módulos principales.
*/
import Paciente from './pages/Paciente'
import Cita from './pages/Cita'


/*
  ============================================================
  COMPONENTE PRINCIPAL
  ============================================================
*/

function App() {

  /*
    Estado que determina cuál módulo está activo.

    "pacientes" = módulo Paciente
    "citas"     = módulo Cita
  */
  const [moduloActivo, setModuloActivo] = useState('pacientes')


  /*
    ============================================================
    RENDERIZADO
    ============================================================
  */

  return (

    <div className="app">

      {/* ======================================================
          ENCABEZADO GENERAL DEL SISTEMA
          ====================================================== */}

      <header className="app-header">

        <div className="app-header-content">

          <div className="app-brand">

            <div className="app-logo">
              🦷
            </div>

            <div>

              <h1>
                Sistema de Gestión de Citas Odontológicas
              </h1>

              <p>
                Consultorio Odontológico Dra. Magda Ortiz
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* ======================================================
          CONTENIDO PRINCIPAL
          ====================================================== */}

      <main className="app-content">


        {/* ====================================================
            MENÚ DE MÓDULOS
            ==================================================== */}

        <nav className="module-navigation">

          <button
            type="button"
            className={
              moduloActivo === 'pacientes'
                ? 'module-tab active'
                : 'module-tab'
            }
            onClick={() => setModuloActivo('pacientes')}
          >

            <span className="tab-icon">
              👤
            </span>

            <span>
              Pacientes
            </span>

          </button>


          <button
            type="button"
            className={
              moduloActivo === 'citas'
                ? 'module-tab active'
                : 'module-tab'
            }
            onClick={() => setModuloActivo('citas')}
          >

            <span className="tab-icon">
              📅
            </span>

            <span>
              Citas
            </span>

          </button>

        </nav>


        {/* ====================================================
            CONTENEDOR DEL MÓDULO ACTIVO
            ==================================================== */}

        <section className="module-content">

          {moduloActivo === 'pacientes' && (

            <Paciente />

          )}


          {moduloActivo === 'citas' && (

            <Cita />

          )}

        </section>


      </main>


      {/* ======================================================
          PIE DE PÁGINA
          ====================================================== */}

      <footer className="app-footer">

        <p>
          Sistema de Gestión de Citas Odontológicas
        </p>

        <p>
          Consultorio Odontológico Dra. Magda Ortiz
        </p>

      </footer>

    </div>

  )
}


/*
  ============================================================
  EXPORTACIÓN
  ============================================================
*/

export default App