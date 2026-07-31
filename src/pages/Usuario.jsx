/*
  ============================================================
  USUARIO.JSX
  SISTEMA DE GESTIÓN DE CITAS ODONTOLÓGICAS
  ============================================================

  Componente principal del módulo Usuario.

  Se encarga de:

  - Consultar usuarios desde Spring Boot.
  - Mostrar los usuarios registrados.
  - Registrar nuevos usuarios.
  - Actualizar usuarios existentes.
  - Eliminar usuarios.
  - Manejar el formulario.
  - Trabajar con autenticación JWT.
*/


import { useEffect, useState } from 'react'

import './Usuario.css'

/*
  Importa la tabla de usuarios.
*/
import UsuarioTable from '../components/UsuarioTable'


/*
  Importa las funciones que realizan las peticiones
  HTTP al backend.
*/
import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../services/UsuarioService'


/*
  ============================================================
  FORMULARIO INICIAL
  ============================================================
*/

const formularioInicial = {

  username: '',

  /*
    En el formulario se utiliza passwordHash
    para coincidir con el nombre del atributo
    de la entidad Usuario.

    IMPORTANTE:
    El usuario escribirá aquí la contraseña normal.

    UsuarioServiceImpl será el encargado de
    convertirla a BCrypt.
  */
  passwordHash: '',

  nombre: '',

  apellido: '',

  correo: '',

  telefono: '',

  rol: ''

}


/*
  ============================================================
  COMPONENTE USUARIO
  ============================================================
*/

function Usuario() {

  /*
    Lista de usuarios recibidos desde Spring Boot.
  */
  const [usuarios, setUsuarios] = useState([])


  /*
    Información del formulario.
  */
  const [formulario, setFormulario] =
    useState(formularioInicial)


  /*
    Usuario actualmente seleccionado para edición.

    null = estamos registrando uno nuevo.
  */
  const [usuarioEditando, setUsuarioEditando] =
    useState(null)


  /*
    Mensaje que se mostrará en pantalla.
  */
  const [mensaje, setMensaje] = useState('')


  /*
    Estado de carga.
  */
  const [cargando, setCargando] = useState(false)


  /*
    ============================================================
    CONSULTAR USUARIOS
    ============================================================
    */

  const cargarUsuarios = async () => {

    try {

      setCargando(true)

      setMensaje('')


      /*
        Realiza:

        GET /api/usuarios

        utilizando el JWT almacenado en localStorage.
      */
      const respuesta = await getUsuarios()


      /*
        Guarda la lista recibida desde Spring Boot.
      */
      setUsuarios(respuesta.data)

    } catch (error) {

      console.error(
        'Error al consultar usuarios:',
        error
      )


      /*
        401 significa que no existe una
        autenticación válida.
      */
      if (error.response?.status === 401) {

        setMensaje(
          'Sesión no válida. Debe iniciar sesión nuevamente.'
        )

      } else {

        setMensaje(
          'No fue posible consultar los usuarios.'
        )

      }

    } finally {

      setCargando(false)

    }

  }


  /*
    ============================================================
    CARGAR USUARIOS AL ABRIR EL MÓDULO
    ============================================================
  */

  useEffect(() => {

    cargarUsuarios()

  }, [])


  /*
    ============================================================
    MANEJAR CAMBIOS DEL FORMULARIO
    ============================================================
  */

  const manejarCambio = (evento) => {

    const {
      name,
      value
    } = evento.target


    setFormulario({

      ...formulario,

      [name]: value

    })

  }


  /*
    ============================================================
    LIMPIAR FORMULARIO
    ============================================================
  */

  const limpiarFormulario = () => {

    setFormulario({
      ...formularioInicial
    })

    setUsuarioEditando(null)

    setMensaje('')

  }


  /*
    ============================================================
    GUARDAR USUARIO
    ============================================================
  */

  const manejarSubmit = async (evento) => {

    evento.preventDefault()

    try {

      setMensaje('')


      /*
        Si existe usuarioEditando estamos
        actualizando un registro.
      */
      if (usuarioEditando) {

        /*
          Actualiza:

          PUT /api/usuarios/{id}
        */
        await actualizarUsuario(
          usuarioEditando.idUsuario,
          formulario
        )


        setMensaje(
          'Usuario actualizado correctamente.'
        )

      } else {

        /*
          Registra:

          POST /api/usuarios
        */
        await crearUsuario(formulario)


        setMensaje(
          'Usuario registrado correctamente.'
        )

      }


      /*
        Actualiza la tabla.
      */
      await cargarUsuarios()


      /*
        Limpia el formulario.
      */
      limpiarFormulario()

    } catch (error) {

      console.error(
        'Error al guardar usuario:',
        error
      )


      /*
        Muestra información básica del error.
      */
      if (error.response?.status === 400) {

        setMensaje(
          'Los datos enviados no son válidos.'
        )

      } else if (error.response?.status === 401) {

        setMensaje(
          'La sesión no es válida.'
        )

      } else {

        setMensaje(
          'No fue posible guardar el usuario.'
        )

      }

    }

  }


  /*
    ============================================================
    EDITAR USUARIO
    ============================================================
  */

  const manejarEditar = (usuario) => {

    /*
      Guarda el usuario que será editado.
    */
    setUsuarioEditando(usuario)


    /*
      Carga los datos del usuario
      en el formulario.
    */
    setFormulario({

      username:
        usuario.username || '',

      /*
        IMPORTANTE:

        Nunca cargamos el hash BCrypt existente.

        Si se desea cambiar la contraseña,
        se escribe una nueva.

        Si se deja vacía, UsuarioServiceImpl
        conserva la contraseña actual.
      */
      passwordHash: '',

      nombre:
        usuario.nombre || '',

      apellido:
        usuario.apellido || '',

      correo:
        usuario.correo || '',

      telefono:
        usuario.telefono || '',

      rol:
        usuario.rol || ''

    })


    /*
      Desplaza la pantalla hacia el formulario.
    */
    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    })

  }


  /*
    ============================================================
    ELIMINAR USUARIO
    ============================================================
  */

  const manejarEliminar = async (idUsuario) => {

    /*
      Solicita confirmación.
    */
    const confirmar = window.confirm(
      '¿Está seguro de eliminar este usuario?'
    )


    if (!confirmar) {

      return

    }


    try {

      /*
        Ejecuta:

        DELETE /api/usuarios/{id}
      */
      await eliminarUsuario(idUsuario)


      setMensaje(
        'Usuario eliminado correctamente.'
      )


      /*
        Actualiza la tabla.
      */
      await cargarUsuarios()

    } catch (error) {

      console.error(
        'Error al eliminar usuario:',
        error
      )


      if (error.response?.status === 401) {

        setMensaje(
          'La sesión no es válida.'
        )

      } else {

        setMensaje(
          'No fue posible eliminar el usuario.'
        )

      }

    }

  }


  /*
    ============================================================
    RENDERIZADO
    ============================================================
  */

  return (

    <div className="usuario-container">


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div className="module-title">

        <h2>
          Gestión de Usuarios
        </h2>

        <p>
          Administración de los usuarios del sistema
        </p>

      </div>


      {/* ======================================================
          MENSAJE
          ====================================================== */}

      {mensaje && (

        <div className="message">

          {mensaje}

        </div>

      )}


      {/* ======================================================
          FORMULARIO
          ====================================================== */}

      <div className="form-container">

        <h3>

          {usuarioEditando
            ? 'Editar usuario'
            : 'Registrar usuario'}

        </h3>


        <form onSubmit={manejarSubmit}>


          {/* ==================================================
              NOMBRE DE USUARIO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="username">

              Nombre de usuario

            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formulario.username}
              onChange={manejarCambio}
              maxLength="100"
              required
            />

          </div>


          {/* ==================================================
              CONTRASEÑA
              ================================================== */}

          <div className="form-group">

            <label htmlFor="passwordHash">

              Contraseña

            </label>

            <input
              id="passwordHash"
              name="passwordHash"
              type="password"
              value={formulario.passwordHash}
              onChange={manejarCambio}
              placeholder={
                usuarioEditando
                  ? 'Dejar vacío para conservar la actual'
                  : 'Ingrese una contraseña'
              }
              required={!usuarioEditando}
            />

          </div>


          {/* ==================================================
              NOMBRE
              ================================================== */}

          <div className="form-group">

            <label htmlFor="nombre">

              Nombre

            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formulario.nombre}
              onChange={manejarCambio}
              maxLength="100"
              required
            />

          </div>


          {/* ==================================================
              APELLIDO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="apellido">

              Apellido

            </label>

            <input
              id="apellido"
              name="apellido"
              type="text"
              value={formulario.apellido}
              onChange={manejarCambio}
              maxLength="100"
              required
            />

          </div>


          {/* ==================================================
              CORREO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="correo">

              Correo electrónico

            </label>

            <input
              id="correo"
              name="correo"
              type="email"
              value={formulario.correo}
              onChange={manejarCambio}
              maxLength="150"
              required
            />

          </div>


          {/* ==================================================
              TELÉFONO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="telefono">

              Teléfono

            </label>

            <input
              id="telefono"
              name="telefono"
              type="text"
              value={formulario.telefono}
              onChange={manejarCambio}
              maxLength="25"
            />

          </div>


          {/* ==================================================
              ROL
              ================================================== */}

          <div className="form-group">

            <label htmlFor="rol">

              Rol

            </label>

            <select
              id="rol"
              name="rol"
              value={formulario.rol}
              onChange={manejarCambio}
              required
            >

              <option value="">

                Seleccione un rol

              </option>

              <option value="Admin">

                Administrador

              </option>

              <option value="Recepcionista">

                Recepcionista

              </option>

              <option value="Profesional">

                Profesional

              </option>

            </select>

          </div>


          {/* ==================================================
              BOTONES
              ================================================== */}

          <div className="form-buttons">

            <button
              type="submit"
              className="btn-primary"
            >

              {usuarioEditando
                ? 'Actualizar usuario'
                : 'Registrar usuario'}

            </button>


            {usuarioEditando && (

              <button
                type="button"
                className="btn-secondary"
                onClick={limpiarFormulario}
              >

                Cancelar edición

              </button>

            )}

          </div>

        </form>

      </div>


      {/* ======================================================
          TABLA
          ====================================================== */}

      <div className="list-container">

        <div className="list-header">

          <h3>

            Usuarios registrados

          </h3>


          <button
            type="button"
            onClick={cargarUsuarios}
          >

            Actualizar

          </button>

        </div>


        {cargando ? (

          <p>

            Cargando usuarios...

          </p>

        ) : (

          <UsuarioTable

            usuarios={usuarios}

            onEditar={manejarEditar}

            onEliminar={manejarEliminar}

          />

        )}

      </div>

    </div>

  )

}


/*
  ============================================================
  EXPORTACIÓN
  ============================================================
*/

export default Usuario