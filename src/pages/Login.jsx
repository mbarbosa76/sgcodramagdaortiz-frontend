/*
  ============================================================
  LOGIN.JSX
  SISTEMA DE GESTIÓN DE CITAS ODONTOLÓGICAS
  ============================================================

  Componente encargado de la pantalla de inicio de sesión.

  Se encarga de:

  - Solicitar usuario y contraseña.
  - Llamar a AuthService.login().
  - Guardar el token JWT y los datos del usuario en localStorage.
  - Notificar a App.jsx que el login fue exitoso.
*/

import { useState } from 'react'

import { login } from '../services/AuthService'


function Login({ onLoginExitoso }) {

  /*
    Datos del formulario de login.
  */
  const [credenciales, setCredenciales] = useState({
    username: '',
    password: ''
  })

  /*
    Mensaje de error a mostrar en pantalla.
  */
  const [mensaje, setMensaje] = useState('')

  /*
    Estado de carga mientras se valida el login.
  */
  const [cargando, setCargando] = useState(false)


  /*
    ============================================================
    MANEJAR CAMBIOS DEL FORMULARIO
    ============================================================
  */
  const manejarCambio = (evento) => {

    const { name, value } = evento.target

    setCredenciales({
      ...credenciales,
      [name]: value
    })

  }


  /*
    ============================================================
    ENVIAR FORMULARIO DE LOGIN
    ============================================================
  */
  const manejarSubmit = async (evento) => {

    evento.preventDefault()

    try {

      setCargando(true)
      setMensaje('')

      /*
        Llama a:

        POST /api/auth/login
      */
      const respuesta = await login(
        credenciales.username,
        credenciales.password
      )

      /*
        La respuesta contiene:

        token, username, nombre, apellido, rol
      */
      const { token, ...datosUsuario } = respuesta.data

      /*
        Guarda el token JWT.

        JwtAuthenticationFilter lo validará en
        cada petición protegida.
      */
      localStorage.setItem('token', token)

      /*
        Guarda los datos básicos del usuario autenticado.
      */
      localStorage.setItem(
        'usuario',
        JSON.stringify(datosUsuario)
      )

      /*
        Notifica a App.jsx que ya puede mostrar
        el resto de la aplicación.
      */
      onLoginExitoso(datosUsuario)

    } catch (error) {

      console.error('Error al iniciar sesión:', error)

      if (error.response?.status === 404) {

        /*
          AuthService lanza RecursoNoEncontradoException
          cuando el usuario o la contraseña son incorrectos.
        */
        setMensaje('Usuario o contraseña incorrectos.')

      } else {

        setMensaje('No fue posible iniciar sesión. Intente nuevamente.')

      }

    } finally {

      setCargando(false)

    }

  }


  /*
    ============================================================
    RENDERIZADO
    ============================================================
  */
  return (

    <div className="login-container">

      <div className="login-box">

        <div className="module-title">

          <h2>Iniciar sesión</h2>

          <p>Sistema de Gestión de Citas Odontológicas</p>

        </div>

        {mensaje && (
          <div className="message">
            {mensaje}
          </div>
        )}

        <form onSubmit={manejarSubmit}>

          <div className="form-group">

            <label htmlFor="username">Nombre de usuario</label>

            <input
              id="username"
              name="username"
              type="text"
              value={credenciales.username}
              onChange={manejarCambio}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">Contraseña</label>

            <input
              id="password"
              name="password"
              type="password"
              value={credenciales.password}
              onChange={manejarCambio}
              required
            />

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="btn-primary"
              disabled={cargando}
            >

              {cargando ? 'Ingresando...' : 'Ingresar'}

            </button>

          </div>

        </form>

      </div>

    </div>

  )

}

export default Login