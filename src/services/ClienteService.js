
/*
 * ============================================================
 * CLIENTESERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de realizar las peticiones HTTP
 * relacionadas con el modulo de pacientes.
 *
 * Responsabilidades:
 *
 * - Consultar los pacientes registrados.
 * - Crear nuevos pacientes.
 * - Actualizar la informacion de un paciente.
 * - Eliminar un paciente existente.
 *
 * La comunicacion se realiza mediante Axios con el backend
 * desarrollado en Spring Boot.
 *
 * La URL base se obtiene desde la configuracion central
 * ubicada en src/config/api.js.
 *
 * Las operaciones protegidas utilizan el token JWT
 * almacenado durante el inicio de sesion.
 *
 * ============================================================
 */

// Importa Axios para realizar peticiones HTTP al backend.
import axios from "axios";

// Importa la URL centralizada de la API.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL BASE DEL MODULO DE PACIENTES
 * ============================================================
 *
 * Se construye a partir de la configuracion central.
 *
 * En desarrollo local utiliza la URL configurada en api.js.
 * En la nube utiliza la URL publica definida en VITE_API_URL.
 */

const API = `${API_BASE_URL}/pacientes`;


/*
 * ============================================================
 * CONFIGURACION DE AUTENTICACION
 * ============================================================
 */

/**
 * Obtiene el token JWT almacenado en el navegador
 * y lo agrega a los encabezados de la peticion HTTP.
 *
 * @returns {Object} Configuracion de autorizacion.
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
 * CONSULTAR PACIENTES
 * ============================================================
 */

/**
 * Consulta todos los pacientes registrados en el sistema.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const getPacientes = () => {

    return axios.get(
        API,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * CREAR PACIENTE
 * ============================================================
 */

/**
 * Registra un nuevo paciente en el sistema.
 *
 * @param {Object} Paciente Datos del paciente que se desea crear.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const crearPaciente = (Paciente) => {

    return axios.post(
        API,
        Paciente,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * ACTUALIZAR PACIENTE
 * ============================================================
 */

/**
 * Actualiza la informacion de un paciente existente.
 *
 * @param {number} idPaciente Identificador del paciente.
 * @param {Object} Paciente Datos que se desean actualizar.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const actualizarPaciente = (
    idPaciente,
    Paciente
) => {

    return axios.put(
        `${API}/${idPaciente}`,
        Paciente,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * ELIMINAR PACIENTE
 * ============================================================
 */

/**
 * Solicita la eliminacion de un paciente por su identificador.
 *
 * La operacion y sus restricciones dependen del endpoint
 * implementado en el backend.
 *
 * @param {number} idPaciente Identificador del paciente.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const eliminarPaciente = (idPaciente) => {

    return axios.delete(
        `${API}/${idPaciente}`,
        obtenerConfigAuth()
    );

};
