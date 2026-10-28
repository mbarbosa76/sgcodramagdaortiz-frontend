
/*
 * ============================================================
 * USUARIOSERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de realizar las peticiones HTTP
 * relacionadas con el modulo de usuarios.
 *
 * RESPONSABILIDADES:
 *
 * - Consultar los usuarios registrados.
 * - Consultar un usuario por su identificador.
 * - Crear nuevos usuarios.
 * - Actualizar usuarios existentes.
 * - Eliminar usuarios cuando el backend lo permita.
 *
 * La comunicacion se realiza mediante Axios con el backend
 * desarrollado en Spring Boot.
 *
 * La URL base se obtiene desde src/config/api.js para
 * permitir el funcionamiento local y en la nube.
 *
 * Las operaciones protegidas utilizan el token JWT
 * almacenado durante el inicio de sesion.
 *
 * ============================================================
 */

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL DEL MODULO DE USUARIOS
 * ============================================================
 *
 * La ruta se construye a partir de la configuracion central.
 *
 * En desarrollo local utiliza la URL configurada en api.js.
 * En la nube utiliza la direccion publica definida mediante
 * la variable de entorno VITE_API_URL.
 */

const API = `${API_BASE_URL}/usuarios`;


/*
 * ============================================================
 * OBTENER TOKEN JWT
 * ============================================================
 */

/**
 * Obtiene el token JWT almacenado en el navegador.
 *
 * @returns {string|null} Token JWT o null si no existe.
 */
const obtenerToken = () => {

    return localStorage.getItem("token");

};


/*
 * ============================================================
 * CONFIGURACION DE AUTORIZACION
 * ============================================================
 *
 * Construye los encabezados HTTP para acceder a los
 * endpoints protegidos del modulo de usuarios.
 */

/**
 * Prepara la configuracion de autenticacion.
 *
 * @returns {Object} Encabezados HTTP con el token JWT.
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
 * LISTAR USUARIOS
 * ============================================================
 *
 * Endpoint:
 * GET /api/usuarios
 */

/**
 * Consulta los usuarios registrados en el sistema.
 *
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const getUsuarios = () => {

    return axios.get(
        API,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * OBTENER USUARIO POR IDENTIFICADOR
 * ============================================================
 *
 * Endpoint:
 * GET /api/usuarios/{idUsuario}
 */

/**
 * Consulta un usuario especifico.
 *
 * @param {number|string} idUsuario Identificador del usuario.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const getUsuarioPorId = (idUsuario) => {

    return axios.get(
        `${API}/${idUsuario}`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * CREAR USUARIO
 * ============================================================
 *
 * Endpoint:
 * POST /api/usuarios
 */

/**
 * Registra un nuevo usuario.
 *
 * @param {Object} usuario Datos del usuario que se desea crear.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const crearUsuario = (usuario) => {

    return axios.post(
        API,
        usuario,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * ACTUALIZAR USUARIO
 * ============================================================
 *
 * Endpoint:
 * PUT /api/usuarios/{idUsuario}
 */

/**
 * Actualiza los datos de un usuario existente.
 *
 * @param {number|string} idUsuario Identificador del usuario.
 * @param {Object} usuario Datos actualizados del usuario.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const actualizarUsuario = (
    idUsuario,
    usuario
) => {

    return axios.put(
        `${API}/${idUsuario}`,
        usuario,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * ELIMINAR USUARIO
 * ============================================================
 *
 * Endpoint:
 * DELETE /api/usuarios/{idUsuario}
 *
 * La operacion esta sujeta a las reglas de negocio
 * y los permisos definidos en el backend.
 */

/**
 * Solicita la eliminacion de un usuario.
 *
 * @param {number|string} idUsuario Identificador del usuario.
 * @returns {Promise} Respuesta HTTP de Axios.
 */
export const eliminarUsuario = (idUsuario) => {

    return axios.delete(
        `${API}/${idUsuario}`,
        obtenerConfigAuth()
    );

};
