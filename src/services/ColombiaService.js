/*
  ============================================================
  COLOMBIASERVICE.JS
  SISTEMA DE GESTIÓN DE CITAS ODONTOLÓGICAS
  ============================================================

  Servicio encargado de consultar los departamentos y
  municipios de Colombia, usados en el selector en cascada
  (Departamento -> Municipio) del formulario de Profesional.

  IMPORTANTE:

  Este servicio NO llama directamente a la API externa
  "API Colombia" (https://api-colombia.com). En su lugar,
  llama al propio backend de este proyecto
  (ApiColombiaController.java), que actúa como intermediario
  ("proxy") y es quien realmente consume la API externa.

  Frontend (este archivo)
       -> Backend propio (/api/publica/colombia/...)
            -> API externa (https://api-colombia.com)

  Como esta ruta está dentro de "/api/publica/**", NO
  requiere token JWT.
*/

// Importa Axios para realizar peticiones HTTP.
import axios from 'axios'


/*
  ============================================================
  URL BASE
  ============================================================
*/

const API = 'http://localhost:8765/api/publica/colombia'


/*
  ============================================================
  OBTENER DEPARTAMENTOS
  ============================================================
*/

/**
 * Consulta el listado completo de departamentos de Colombia.
 *
 * GET /api/publica/colombia/departamentos
 *
 * @returns Respuesta HTTP de Axios (arreglo de { id, name }).
 */
export const getDepartamentos = () => {

  return axios.get(
    `${API}/departamentos`
  )

}


/*
  ============================================================
  OBTENER MUNICIPIOS POR DEPARTAMENTO
  ============================================================
*/

/**
 * Consulta los municipios/ciudades que pertenecen
 * a un departamento específico.
 *
 * GET /api/publica/colombia/departamentos/{idDepartamento}/municipios
 *
 * @param {number} idDepartamento Identificador del departamento
 * (el mismo "id" que devuelve getDepartamentos()).
 * @returns Respuesta HTTP de Axios (arreglo de { id, name }).
 */
export const getMunicipiosPorDepartamento = (idDepartamento) => {

  return axios.get(
    `${API}/departamentos/${idDepartamento}/municipios`
  )

}


/*
  ============================================================
  OBTENER REGIONES
  ============================================================
*/

/**
 * Consulta el listado de regiones de Colombia.
 *
 * GET /api/publica/colombia/regiones
 *
 * @returns Respuesta HTTP de Axios (arreglo de { id, name }).
 */
export const getRegiones = () => {

  return axios.get(
    `${API}/regiones`
  )

}