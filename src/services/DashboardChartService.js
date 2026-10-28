
/*
 * ============================================================
 * DASHBOARDCHARTSERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de consultar los datos utilizados
 * para construir los graficos del Dashboard segun el rol.
 *
 * RESPONSABILIDADES:
 *
 * - Consultar la distribucion de citas por estado.
 * - Consultar los estados de las citas del profesional.
 * - Consultar los estados de las citas de recepcion.
 * - Consultar la facturacion mensual del consultorio.
 *
 * La comunicacion se realiza mediante Axios con el backend
 * desarrollado en Spring Boot.
 *
 * La URL base se obtiene desde src/config/api.js para
 * permitir el funcionamiento local y el despliegue en la nube.
 *
 * Las solicitudes protegidas utilizan el token JWT.
 *
 * ============================================================
 */

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL BASE DEL DASHBOARD
 * ============================================================
 *
 * Se conserva la ruta /dashboard del backend.
 * La URL principal se configura desde api.js.
 */

const API_URL = `${API_BASE_URL}/dashboard`;


/*
 * ============================================================
 * CONFIGURACION JWT
 * ============================================================
 *
 * Obtiene el token almacenado despues del inicio de sesion
 * y lo agrega al encabezado Authorization.
 */

/**
 * Construye la configuracion de autenticacion.
 *
 * @returns {Object} Configuracion HTTP con el token JWT.
 */
const obtenerConfigAuth = () => {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`

        }

    };

};


/*
 * ============================================================
 * GRAFICO GENERAL DE CITAS POR ESTADO
 * ============================================================
 *
 * Utilizado por el administrador.
 *
 * Endpoint:
 * GET /api/dashboard/citas-estados
 */

/**
 * Consulta las citas agrupadas por estado.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerCitasEstados = () => {

    return axios.get(
        `${API_URL}/citas-estados`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * GRAFICO DE CITAS DEL PROFESIONAL
 * ============================================================
 *
 * Utilizado por el profesional autenticado.
 *
 * Endpoint:
 * GET /api/dashboard/profesional/citas-estados
 */

/**
 * Consulta los estados de las citas del profesional.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerCitasEstadosProfesional = () => {

    return axios.get(
        `${API_URL}/profesional/citas-estados`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * GRAFICO DE CITAS PARA RECEPCIONISTA
 * ============================================================
 *
 * Endpoint:
 * GET /api/dashboard/recepcionista/citas-estados
 */

/**
 * Consulta los estados de las citas para recepcion.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerCitasEstadosRecepcionista = () => {

    return axios.get(
        `${API_URL}/recepcionista/citas-estados`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * GRAFICO DE FACTURACION MENSUAL
 * ============================================================
 *
 * Utilizado por el administrador.
 *
 * Endpoint:
 * GET /api/dashboard/facturacion-mensual
 */

/**
 * Consulta la facturacion mensual del consultorio.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerFacturacionMensual = () => {

    return axios.get(
        `${API_URL}/facturacion-mensual`,
        obtenerConfigAuth()
    );

};
