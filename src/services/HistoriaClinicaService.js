
/*
 * ============================================================
 * HISTORIACLINICASERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de consumir la API REST del modulo
 * de historias clinicas.
 *
 * RESPONSABILIDADES:
 *
 * - Consultar las historias clinicas registradas.
 * - Crear una nueva historia clinica.
 * - Actualizar una historia clinica existente.
 * - Eliminar una historia clinica cuando el backend
 *   y las reglas del sistema lo permitan.
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
 * URL DEL MODULO DE HISTORIAS CLINICAS
 * ============================================================
 *
 * Se conserva la ruta original del backend:
 * /api/historias
 *
 * La direccion completa depende de la configuracion central
 * del proyecto y de la variable VITE_API_URL.
 */

const API_URL = `${API_BASE_URL}/historias`;


/*
 * ============================================================
 * CONFIGURACION DE AUTENTICACION JWT
 * ============================================================
 *
 * Obtiene el token almacenado en el navegador y lo incluye
 * en el encabezado Authorization de cada solicitud protegida.
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
 * LISTAR HISTORIAS CLINICAS
 * ============================================================
 *
 * Endpoint:
 * GET /api/historias
 */

/**
 * Consulta las historias clinicas registradas.
 *
 * @returns {Promise<Array>} Datos devueltos por el backend.
 */
const listarHistorias = async () => {

    const respuesta = await axios.get(
        API_URL,
        obtenerConfigAuth()
    );

    return respuesta.data;

};


/*
 * ============================================================
 * CREAR HISTORIA CLINICA
 * ============================================================
 *
 * Endpoint:
 * POST /api/historias
 *
 * El backend debe validar las reglas de negocio, incluyendo
 * las condiciones requeridas para registrar la atencion.
 */

/**
 * Registra una nueva historia clinica.
 *
 * @param {Object} historia Datos de la historia clinica.
 * @returns {Promise<Object>} Historia creada.
 */
const crearHistoria = async (historia) => {

    const respuesta = await axios.post(
        API_URL,
        historia,
        obtenerConfigAuth()
    );

    return respuesta.data;

};


/*
 * ============================================================
 * ACTUALIZAR HISTORIA CLINICA
 * ============================================================
 *
 * Endpoint:
 * PUT /api/historias/{idHistoria}
 */

/**
 * Actualiza una historia clinica existente.
 *
 * @param {number} idHistoria Identificador de la historia.
 * @param {Object} historia Datos que se desean actualizar.
 * @returns {Promise<Object>} Historia actualizada.
 */
const actualizarHistoria = async (
    idHistoria,
    historia
) => {

    const respuesta = await axios.put(
        `${API_URL}/${idHistoria}`,
        historia,
        obtenerConfigAuth()
    );

    return respuesta.data;

};


/*
 * ============================================================
 * ELIMINAR HISTORIA CLINICA
 * ============================================================
 *
 * Endpoint:
 * DELETE /api/historias/{idHistoria}
 *
 * La operacion esta sujeta a las reglas y permisos definidos
 * en el backend. No se debe asumir que la eliminacion fisica
 * esta permitida para todos los registros clinicos.
 */

/**
 * Solicita la eliminacion de una historia clinica.
 *
 * @param {number} idHistoria Identificador de la historia.
 * @returns {Promise<void>} Resultado de la solicitud.
 */
const eliminarHistoria = async (
    idHistoria
) => {

    await axios.delete(
        `${API_URL}/${idHistoria}`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * EXPORTAR FUNCIONES DEL SERVICIO
 * ============================================================
 *
 * Se conservan los nombres originales para mantener
 * la compatibilidad con los componentes que utilizan
 * este servicio.
 */

export {

    listarHistorias,

    crearHistoria,

    actualizarHistoria,

    eliminarHistoria

};
