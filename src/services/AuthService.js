/*
  ============================================================
  AUTHSERVICE.JS
  SISTEMA DE GESTIÓN DE CITAS ODONTOLÓGICAS
  ============================================================

  Servicio encargado del inicio de sesión.

  Se comunica con el endpoint:

  POST http://localhost:8765/api/auth/login
*/


// Importa Axios.
import axios from 'axios'


/*
  ============================================================
  URL DEL LOGIN
  ============================================================
*/

const API_LOGIN =
  'http://localhost:8765/api/auth/login'


/*
  ============================================================
  INICIAR SESIÓN
  ============================================================
*/

/**
 * Envía las credenciales al backend.
 *
 * @param {string} username Nombre de usuario.
 * @param {string} password Contraseña.
 * @returns Respuesta con token JWT y datos del usuario.
 */
export const login = (
  username,
  password
) => {

  return axios.post(
    API_LOGIN,
    {
      username,
      password
    }
  )

}


/*
  ============================================================
  CERRAR SESIÓN
  ============================================================
*/

/**
 * Elimina la información de autenticación
 * almacenada en el navegador.
 */
export const logout = () => {

  localStorage.removeItem('token')

  localStorage.removeItem('usuario')

}


/*
  ============================================================
  OBTENER USUARIO AUTENTICADO
  ============================================================
*/

/**
 * Obtiene los datos del usuario almacenados
 * después del inicio de sesión.
 *
 * @returns {Object|null} Datos del usuario.
 */
export const obtenerUsuario = () => {

  const usuario =
    localStorage.getItem('usuario')

  if (!usuario) {

    return null

  }

  return JSON.parse(usuario)

}