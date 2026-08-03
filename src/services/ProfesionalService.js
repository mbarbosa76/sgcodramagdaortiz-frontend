/*
  ============================================================
  PROFESIONALSERVICE.JS
  SISTEMA DE GESTIÓN DE CITAS ODONTOLÓGICAS
  ============================================================

  Servicio encargado de realizar las peticiones HTTP
  relacionadas con el módulo Profesional.

  Utiliza Axios para comunicarse con Spring Boot.

  Sigue el mismo patrón que UsuarioService.js.
*/

// Importa Axios para realizar peticiones HTTP.
import axios from 'axios'


/*
  ============================================================
  URL BASE
  ============================================================
*/

const API = 'http://localhost:8765/api/profesionales'


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
  LISTAR PROFESIONALES
  ============================================================
*/

/**
 * Consulta todos los profesionales.
 *
 * @returns Respuesta HTTP de Axios.
 */
export const getProfesionales = () => {

  return axios.get(
    API,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  OBTENER PROFESIONAL POR ID
  ============================================================
*/

/**
 * Consulta un profesional específico.
 *
 * @param {number} idProfesional Identificador del profesional.
 * @returns Respuesta HTTP de Axios.
 */
export const getProfesionalPorId = (idProfesional) => {

  return axios.get(
    `${API}/${idProfesional}`,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  CREAR PROFESIONAL
  ============================================================
*/

/**
 * Crea un nuevo profesional.
 *
 * @param {Object} profesional Datos del profesional.
 * @returns Respuesta HTTP de Axios.
 */
export const crearProfesional = (profesional) => {

  return axios.post(
    API,
    profesional,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  ACTUALIZAR PROFESIONAL
  ============================================================
*/

/**
 * Actualiza un profesional existente.
 *
 * @param {number} idProfesional Identificador del profesional.
 * @param {Object} profesional Datos actualizados.
 * @returns Respuesta HTTP de Axios.
 */
export const actualizarProfesional = (
  idProfesional,
  profesional
) => {

  return axios.put(
    `${API}/${idProfesional}`,
    profesional,
    obtenerConfigAuth()
  )

}


/*
  ============================================================
  ELIMINAR PROFESIONAL
  ============================================================
*/

/**
 * Elimina un profesional.
 *
 * @param {number} idProfesional Identificador del profesional.
 * @returns Respuesta HTTP de Axios.
 */
export const eliminarProfesional = (idProfesional) => {

  return axios.delete(
    `${API}/${idProfesional}`,
    obtenerConfigAuth()
  )

}