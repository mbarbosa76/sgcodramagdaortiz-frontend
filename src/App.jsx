/*
  ============================================================
  App.jsx
  ============================================================

  Componente principal del Sistema de Gestión de Citas
  Odontológicas.

  Funcionalidades:

  - Control de autenticación mediante JWT.
  - Manejo de sesión del usuario.
  - Navegación entre módulos.
  - Carga dinámica de componentes.

  Módulos disponibles:

  - Pacientes.
  - Citas.
  - Usuarios.
  - Profesionales.
  - Servicios.

  ============================================================
*/


import { useState, useEffect } from 'react'

import './App.css'


// ============================================================
// Importación de módulos del sistema
// ============================================================

import Paciente from './pages/Paciente'
import Cita from './pages/Cita'
import Usuario from './pages/Usuario'
import Profesional from './pages/Profesional'
import Servicio from './pages/Servicio'
import HistoriaClinica from './pages/HistoriaClinica'
import Login from './pages/Login'
import Factura from './pages/Factura'

// ============================================================
// Servicio de autenticación
// ============================================================

import { logout } from './services/AuthService'



function App() {


  /*
    Módulo que se encuentra seleccionado actualmente.

    Por defecto inicia mostrando Pacientes.
  */
  const [moduloActivo, setModuloActivo] =
    useState('pacientes')



  /*
    Información del usuario autenticado.

    null:
    No existe sesión activa.

    objeto:
    Usuario con sesión iniciada.
  */
  const [usuarioAutenticado, setUsuarioAutenticado] =
    useState(null)



  /*
    Controla la verificación inicial
    del almacenamiento local.
  */
  const [verificando, setVerificando] =
    useState(true)



  /*
    Al cargar la aplicación verifica
    si existe un token JWT almacenado.
  */
  useEffect(() => {


    const token =
      localStorage.getItem('token')


    const usuario =
      localStorage.getItem('usuario')



    if (token && usuario) {


      setUsuarioAutenticado(
        JSON.parse(usuario)
      )


    }



    setVerificando(false)


  }, [])



  /*
    Se ejecuta cuando Login devuelve
    los datos del usuario autenticado.
  */
  const manejarLoginExitoso = (usuario) => {


    setUsuarioAutenticado(usuario)


  }



  /*
    Cierra la sesión actual.
  */
  const manejarLogout = () => {


    logout()


    setUsuarioAutenticado(null)


  }



  /*
    Mientras se valida la sesión
    no muestra contenido.
  */
  if (verificando) {


    return null


  }



  /*
    Si no existe usuario autenticado,
    muestra solamente Login.
  */
  if (!usuarioAutenticado) {


    return (

      <Login
        onLoginExitoso={manejarLoginExitoso}
      />

    )


  }



  return (


    <div className="app">


      {/* =====================================================
          ENCABEZADO DEL SISTEMA
          ===================================================== */}


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




          <div className="app-user-info">


            <span>

              {usuarioAutenticado.nombre}
              {' '}
              ({usuarioAutenticado.rol})

            </span>



            <button
              type="button"
              onClick={manejarLogout}
            >

              Cerrar sesión

            </button>


          </div>



        </div>


      </header>





      {/* =====================================================
          CONTENIDO PRINCIPAL
          ===================================================== */}


      <main className="app-content">





        {/* ===================================================
            MENÚ DE MÓDULOS
            =================================================== */}


        <nav className="module-navigation">



          <button

            type="button"

            className={
              moduloActivo === 'pacientes'
              ? 'module-tab active'
              : 'module-tab'
            }

            onClick={() =>
              setModuloActivo('pacientes')
            }

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

            onClick={() =>
              setModuloActivo('citas')
            }

          >

            <span className="tab-icon">

              📅

            </span>


            <span>

              Citas

            </span>


          </button>





          <button

            type="button"

            className={
              moduloActivo === 'usuarios'
              ? 'module-tab active'
              : 'module-tab'
            }

            onClick={() =>
              setModuloActivo('usuarios')
            }

          >

            <span className="tab-icon">

              🔐

            </span>


            <span>

              Usuarios

            </span>


          </button>





          <button

            type="button"

            className={
              moduloActivo === 'profesionales'
              ? 'module-tab active'
              : 'module-tab'
            }

            onClick={() =>
              setModuloActivo('profesionales')
            }

          >

            <span className="tab-icon">

              🩺

            </span>


            <span>

              Profesionales

            </span>


          </button>





          <button

            type="button"

            className={
              moduloActivo === 'servicios'
              ? 'module-tab active'
              : 'module-tab'
            }

            onClick={() =>
              setModuloActivo('servicios')
            }

          >

            <span className="tab-icon">

              🦷

            </span>


            <span>

              Servicios

            </span>


          </button>

          <button

            type="button"

            className={
              moduloActivo === 'historias'
              ? 'module-tab active'
              : 'module-tab'
            }

            onClick={() =>
              setModuloActivo('historias')
            }

          >

            <span className="tab-icon">

              📋

            </span>


            <span>

              Historia Clínica

            </span>


          </button>

          <button

            type="button"

            className={
              moduloActivo === 'facturas'
              ? 'module-tab active'
              : 'module-tab'
            }

            onClick={() =>
              setModuloActivo('facturas')
            }

          >

            <span className="tab-icon">

              💰

            </span>


            <span>

              Facturación

            </span>


          </button>

        </nav>





        {/* ===================================================
            CARGA DINÁMICA DE MÓDULOS
            =================================================== */}


        <section className="module-content">


          {
            moduloActivo === 'pacientes'
            &&
            <Paciente />
          }



          {
            moduloActivo === 'citas'
            &&
            <Cita />
          }



          {
            moduloActivo === 'usuarios'
            &&
            <Usuario />
          }



          {
            moduloActivo === 'profesionales'
            &&
            <Profesional />
          }



          {
            moduloActivo === 'servicios'
            &&
            <Servicio />
          }

          {
            moduloActivo === 'historias'
            &&
            <HistoriaClinica />
          }

          {
            moduloActivo === 'facturas'
            &&
            <Factura />
          }

        </section>



      </main>





      {/* =====================================================
          PIE DE PÁGINA
          ===================================================== */}


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



export default App