
/*
 * ============================================================
 * DASHBOARDSERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de consultar la informacion principal
 * utilizada por los diferentes dashboards del sistema.
 *
 * RESPONSABILIDADES:
 *
 * - Consultar el Dashboard del administrador.
 * - Consultar el Dashboard del profesional.
 * - Consultar el Dashboard del recepcionista.
 * - Obtener citas para los indicadores.
 * - Obtener pacientes para los indicadores.
 * - Obtener facturas para los indicadores.
 * - Obtener usuarios para los indicadores.
 * - Obtener historias clinicas para los indicadores.
 *
 * La comunicacion se realiza mediante Axios con el backend
 * desarrollado con Spring Boot.
 *
 * La URL base se obtiene desde src/config/api.js para permitir
 * el funcionamiento local y el despliegue en la nube.
 *
 * Las solicitudes protegidas utilizan el token JWT guardado
 * durante el inicio de sesion.
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
 * Se utiliza la URL centralizada para construir las rutas
 * correspondientes a los diferentes roles del sistema.
 */

const API_URL = `${API_BASE_URL}/dashboard`;


/*
 * ============================================================
 * CONFIGURACION JWT
 * ============================================================
 *
 * Obtiene el token almacenado en el navegador y lo incluye
 * en el encabezado Authorization de las peticiones protegidas.
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
 * DASHBOARD DEL ADMINISTRADOR
 * ============================================================
 *
 * Endpoint:
 * GET /api/dashboard/admin
 *
 * Permite consultar los indicadores generales del consultorio.
 */

/**
 * Consulta los indicadores del administrador.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerDashboardAdmin = () => {

    return axios.get(
        `${API_URL}/admin`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * DASHBOARD DEL PROFESIONAL
 * ============================================================
 *
 * Endpoint:
 * GET /api/dashboard/profesional
 *
 * Consulta la informacion permitida para el profesional.
 */

/**
 * Consulta los indicadores del profesional autenticado.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerDashboardProfesional = () => {

    return axios.get(
        `${API_URL}/profesional`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * DASHBOARD DEL RECEPCIONISTA
 * ============================================================
 *
 * Endpoint:
 * GET /api/dashboard/recepcionista
 *
 * Consulta los indicadores operativos de recepcion.
 */

/**
 * Consulta los indicadores del recepcionista.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerDashboardRecepcionista = () => {

    return axios.get(
        `${API_URL}/recepcionista`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * INFORMACION COMPLEMENTARIA DEL DASHBOARD
 * ============================================================
 *
 * Estas funciones consultan los endpoints de los modulos
 * existentes para obtener informacion complementaria.
 *
 * Se conserva la estructura utilizada anteriormente por
 * Dashboard.jsx y los demas componentes del frontend.
 */


/*
 * ============================================================
 * OBTENER CITAS
 * ============================================================
 */

/**
 * Consulta las citas registradas.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerCitasDashboard = () => {

    return axios.get(
        `${API_BASE_URL}/citas`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * OBTENER PACIENTES
 * ============================================================
 */

/**
 * Consulta los pacientes registrados.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerPacientesDashboard = () => {

    return axios.get(
        `${API_BASE_URL}/pacientes`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * OBTENER FACTURAS
 * ============================================================
 */

/**
 * Consulta las facturas registradas.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerFacturasDashboard = () => {

    return axios.get(
        `${API_BASE_URL}/facturas`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * OBTENER USUARIOS
 * ============================================================
 */

/**
 * Consulta los usuarios del sistema.
 *
 * El acceso a este endpoint depende de los permisos
 * configurados en Spring Security.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerUsuariosDashboard = () => {

    return axios.get(
        `${API_BASE_URL}/usuarios`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * OBTENER HISTORIAS CLINICAS
 * ============================================================
 */

/**
 * Consulta las historias clinicas registradas.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const obtenerHistoriasDashboard = () => {

    return axios.get(
        `${API_BASE_URL}/historias`,
        obtenerConfigAuth()
    );

};
