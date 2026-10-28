
/*
 * ============================================================
 * PROFESIONALSERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * ============================================================
 *
 * Servicio encargado de realizar las peticiones HTTP
 * relacionadas con el modulo de profesionales.
 *
 * Utiliza Axios para comunicarse con Spring Boot.
 *
 * Responsabilidades:
 *
 * - Consultar profesionales.
 * - Consultar un profesional por identificador.
 * - Crear profesionales.
 * - Actualizar profesionales.
 * - Desactivar profesionales mediante el endpoint existente.
 * - Reactivar profesionales.
 *
 * Las operaciones protegidas utilizan el token JWT.
 *
 * ============================================================
 */

import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL DEL MODULO DE PROFESIONALES
 * ============================================================
 */

const API = `${API_BASE_URL}/profesionales`;


/*
 * ============================================================
 * OBTENER TOKEN JWT
 * ============================================================
 */

/**
 * Obtiene el token almacenado en el navegador.
 *
 * @returns {string|null} Token JWT.
 */
const obtenerToken = () => {

    return localStorage.getItem("token");

};


/*
 * ============================================================
 * CONFIGURACION DE AUTORIZACION
 * ============================================================
 */

/**
 * Construye los encabezados de autenticacion.
 *
 * @returns {Object} Configuracion HTTP con Bearer Token.
 */
const obtenerConfigAuth = () => {

    const token = obtenerToken();

    return {

        headers: {

            Authorization: `Bearer ${token}`

        }

    };

};


/*
 * ============================================================
 * LISTAR PROFESIONALES
 * ============================================================
 */

/**
 * Consulta los profesionales registrados.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const getProfesionales = () => {

    return axios.get(
        API,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * OBTENER PROFESIONAL POR ID
 * ============================================================
 */

/**
 * Consulta un profesional especifico.
 *
 * @param {number} idProfesional Identificador del profesional.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const getProfesionalPorId = (idProfesional) => {

    return axios.get(
        `${API}/${idProfesional}`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * CREAR PROFESIONAL
 * ============================================================
 */

/**
 * Registra un nuevo profesional.
 *
 * @param {Object} profesional Datos del profesional.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const crearProfesional = (profesional) => {

    return axios.post(
        API,
        profesional,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * ACTUALIZAR PROFESIONAL
 * ============================================================
 */

/**
 * Actualiza la informacion de un profesional.
 *
 * @param {number} idProfesional Identificador del profesional.
 * @param {Object} profesional Datos actualizados.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const actualizarProfesional = (
    idProfesional,
    profesional
) => {

    return axios.put(
        `${API}/${idProfesional}`,
        profesional,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * DESACTIVAR PROFESIONAL
 * ============================================================
 *
 * Se conserva el nombre utilizado por los componentes.
 * El comportamiento real depende del endpoint del backend,
 * que en este proyecto permite desactivar al profesional.
 */

/**
 * Desactiva un profesional mediante el endpoint existente.
 *
 * @param {number} idProfesional Identificador del profesional.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const eliminarProfesional = (idProfesional) => {

    return axios.delete(
        `${API}/${idProfesional}`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * REACTIVAR PROFESIONAL
 * ============================================================
 */

/**
 * Reactiva un profesional que se encuentra inactivo.
 *
 * @param {number} idProfesional Identificador del profesional.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const reactivarProfesional = (idProfesional) => {

    return axios.patch(
        `${API}/${idProfesional}/reactivar`,
        null,
        obtenerConfigAuth()
    );

};
