/*
  ============================================================
  USUARIOSERVICE.JS
  SISTEMA DE GESTIÓN DE CITAS ODONTOLÓGICAS
  ============================================================

  Servicio encargado de realizar las peticiones HTTP
  relacionadas con el módulo Usuario.

  Utiliza Axios para comunicarse con Spring Boot.
*/

// Importa Axios para realizar peticiones HTTP.
import axios from 'axios'


/*
  ============================================================
  URL BASE
  ============================================================
*/

const API = 'http://localhost:8765/api/usuarios'


/*
  ============================================================
  OBTENER TOKEN JWT
  ============================================================
*/

/**
 * Obtiene el token JWT almacenado en el navegador.
 *
 * @returns {string|null} Token JWT.
 */
const obtenerToken = () => {

  return localStorage.getItem('token')

}


/*
  ============================================================
  CONFIGURACIÓN DE AUTORIZACIÓN
  ============================================================
*/

/**
 * Crea los encabezados necesarios para acceder
 * a endpoints protegidos.
 *
 * @returns {Object} Encabezados HTTP.
 */
const obtenerConfigAuth = () => {

  const token = obtenerToken()

  return {

    headers: {

      Authorization: `Bearer ${token}`

    }

  }

}


/*
  ============================================================
  LISTAR USUARIOS
  ============================================================
*/

/**
 * Consulta todos los usuarios.
 *
 * @returns Respuesta HTTP de Axios.
 */
export const getUsuarios = () => {

  return axios.get(
    API,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  OBTENER USUARIO POR ID
  ============================================================
*/

/**
 * Consulta un usuario específico.
 *
 * @param {number} idUsuario Identificador del usuario.
 * @returns Respuesta HTTP de Axios.
 */
export const getUsuarioPorId = (idUsuario) => {

  return axios.get(
    `${API}/${idUsuario}`,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  CREAR USUARIO
  ============================================================
*/

/**
 * Crea un nuevo usuario.
 *
 * @param {Object} usuario Datos del usuario.
 * @returns Respuesta HTTP de Axios.
 */
export const crearUsuario = (usuario) => {

  return axios.post(
    API,
    usuario,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  ACTUALIZAR USUARIO
  ============================================================
*/

/**
 * Actualiza un usuario existente.
 *
 * @param {number} idUsuario Identificador del usuario.
 * @param {Object} usuario Datos actualizados.
 * @returns Respuesta HTTP de Axios.
 */
export const actualizarUsuario = (
  idUsuario,
  usuario
) => {

  return axios.put(
    `${API}/${idUsuario}`,
    usuario,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  ELIMINAR USUARIO
  ============================================================
*/

/**
 * Elimina un usuario.
 *
 * @param {number} idUsuario Identificador del usuario.
 * @returns Respuesta HTTP de Axios.
 */
export const eliminarUsuario = (idUsuario) => {

  return axios.delete(
    `${API}/${idUsuario}`,
    obtenerConfigAuth()
  )

}