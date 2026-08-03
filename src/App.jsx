import { useState, useEffect } from 'react'
import './App.css'

import Paciente from './pages/Paciente'
import Cita from './pages/Cita'
import Usuario from './pages/Usuario'
import Profesional from './pages/Profesional'
import Login from './pages/Login'

import { logout } from './services/AuthService'

function App() {

  const [moduloActivo, setModuloActivo] = useState('pacientes')

  /*
    Estado de autenticación.

    null = todavía no se ha verificado.
    objeto usuario = sesión activa.
  */
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null)

  const [verificando, setVerificando] = useState(true)

  /*
    Al cargar la aplicación, revisa si ya existe
    una sesión guardada en localStorage.
  */
  useEffect(() => {

    const token = localStorage.getItem('token')
    const usuario = localStorage.getItem('usuario')

    if (token && usuario) {
      setUsuarioAutenticado(JSON.parse(usuario))
    }

    setVerificando(false)

  }, [])

  const manejarLoginExitoso = (usuario) => {
    setUsuarioAutenticado(usuario)
  }

  const manejarLogout = () => {
    logout()
    setUsuarioAutenticado(null)
  }

  /*
    Mientras se verifica localStorage, no muestra nada
    para evitar parpadeo entre Login y la app.
  */
  if (verificando) {
    return null
  }

  /*
    Si no hay sesión activa, muestra únicamente
    la pantalla de login.
  */
  if (!usuarioAutenticado) {
    return <Login onLoginExitoso={manejarLoginExitoso} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-brand">
            <div className="app-logo">🦷</div>
            <div>
              <h1>Sistema de Gestión de Citas Odontológicas</h1>
              <p>Consultorio Odontológico Dra. Magda Ortiz</p>
            </div>
          </div>

          {/* Datos del usuario autenticado y botón de salir */}
          <div className="app-user-info">
            <span>{usuarioAutenticado.nombre} ({usuarioAutenticado.rol})</span>
            <button type="button" onClick={manejarLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="app-content">
        <nav className="module-navigation">
          <button
            type="button"
            className={moduloActivo === 'pacientes' ? 'module-tab active' : 'module-tab'}
            onClick={() => setModuloActivo('pacientes')}
          >
            <span className="tab-icon">👤</span>
            <span>Pacientes</span>
          </button>

          <button
            type="button"
            className={moduloActivo === 'citas' ? 'module-tab active' : 'module-tab'}
            onClick={() => setModuloActivo('citas')}
          >
            <span className="tab-icon">📅</span>
            <span>Citas</span>
          </button>

          <button
            type="button"
            className={moduloActivo === 'usuarios' ? 'module-tab active' : 'module-tab'}
            onClick={() => setModuloActivo('usuarios')}
          >
            <span className="tab-icon">🔐</span>
            <span>Usuarios</span>
          </button>

          <button
            type="button"
            className={moduloActivo === 'profesionales' ? 'module-tab active' : 'module-tab'}
            onClick={() => setModuloActivo('profesionales')}
          >
            <span className="tab-icon">🩺</span>
            <span>Profesionales</span>
          </button>
        </nav>

        <section className="module-content">
          {moduloActivo === 'pacientes' && <Paciente />}
          {moduloActivo === 'citas' && <Cita />}
          {moduloActivo === 'usuarios' && <Usuario />}
          {moduloActivo === 'profesionales' && <Profesional />}
        </section>
      </main>

      <footer className="app-footer">
        <p>Sistema de Gestión de Citas Odontológicas</p>
        <p>Consultorio Odontológico Dra. Magda Ortiz</p>
      </footer>
    </div>
  )
}

export default App