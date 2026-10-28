
/*
 * ============================================================
 * COLOMBIASERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de consultar los departamentos,
 * municipios y regiones de Colombia.
 *
 * Estos datos se utilizan en el formulario del modulo
 * de profesionales, donde se selecciona primero el
 * departamento y despues el municipio correspondiente.
 *
 * IMPORTANTE:
 *
 * Este servicio no consume directamente la API externa
 * de Colombia. Las solicitudes se realizan al backend
 * del SGCO, que actua como intermediario para consultar
 * la informacion geografica.
 *
 * Flujo de comunicacion:
 *
 * Frontend React
 *      |
 *      v
 * Backend Spring Boot
 * /api/publica/colombia/...
 *      |
 *      v
 * API externa de Colombia
 *
 * La URL del backend se obtiene desde la configuracion
 * central ubicada en src/config/api.js.
 *
 * Como las rutas utilizadas son publicas, este servicio
 * no necesita enviar un token JWT.
 *
 * ============================================================
 */

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL BASE DEL SERVICIO
 * ============================================================
 *
 * Se utiliza la configuracion central de la API.
 *
 * En desarrollo local, la URL corresponde al backend
 * que se ejecuta en el puerto 8765.
 *
 * En la nube, utiliza la URL publica configurada mediante
 * la variable de entorno VITE_API_URL.
 */

const API = `${API_BASE_URL}/publica/colombia`;


/*
 * ============================================================
 * OBTENER DEPARTAMENTOS
 * ============================================================
 */

/**
 * Consulta el listado de departamentos de Colombia.
 *
 * Endpoint:
 * GET /api/publica/colombia/departamentos
 *
 * La ruta es publica y no requiere token JWT.
 *
 * @returns {Promise} Respuesta HTTP de Axios con los
 * departamentos disponibles.
 */
export const getDepartamentos = () => {

    return axios.get(
        `${API}/departamentos`
    );

};


/*
 * ============================================================
 * OBTENER MUNICIPIOS POR DEPARTAMENTO
 * ============================================================
 */

/**
 * Consulta los municipios pertenecientes a un departamento.
 *
 * Endpoint:
 * GET /api/publica/colombia/departamentos/{idDepartamento}/municipios
 *
 * El identificador recibido debe corresponder al valor
 * devuelto por la consulta de departamentos.
 *
 * @param {number} idDepartamento Identificador del departamento.
 * @returns {Promise} Respuesta HTTP de Axios con los municipios.
 */
export const getMunicipiosPorDepartamento = (
    idDepartamento
) => {

    return axios.get(
        `${API}/departamentos/${idDepartamento}/municipios`
    );

};


/*
 * ============================================================
 * OBTENER REGIONES
 * ============================================================
 */

/**
 * Consulta el listado de regiones de Colombia.
 *
 * Endpoint:
 * GET /api/publica/colombia/regiones
 *
 * La ruta es publica y no requiere token JWT.
 *
 * @returns {Promise} Respuesta HTTP de Axios con las regiones.
 */
export const getRegiones = () => {

    return axios.get(
        `${API}/regiones`
    );

};
