
/*
 * ============================================================
 * FACTURASERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * ============================================================
 *
 * Servicio encargado de consumir la API REST del modulo
 * de facturacion.
 *
 * Responsabilidades:
 *
 * - Consultar facturas.
 * - Crear facturas tradicionales.
 * - Crear facturas completas.
 * - Actualizar facturas.
 * - Eliminar facturas.
 *
 * La autenticacion se realiza mediante el token JWT
 * almacenado durante el inicio de sesion.
 *
 * ============================================================
 */

import axios from "axios";

// URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL DEL MODULO DE FACTURACION
 * ============================================================
 */

const API_URL = `${API_BASE_URL}/facturas`;


/*
 * ============================================================
 * CONFIGURACION DE AUTENTICACION
 * ============================================================
 */

/**
 * Obtiene el token JWT y prepara los encabezados HTTP.
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
 * LISTAR FACTURAS
 * ============================================================
 */

/**
 * Consulta las facturas registradas.
 *
 * @returns {Promise<Array>} Lista de facturas.
 */
const listarFacturas = async () => {

    const respuesta = await axios.get(
        API_URL,
        obtenerConfigAuth()
    );

    return respuesta.data;

};


/*
 * ============================================================
 * CREAR FACTURA TRADICIONAL
 * ============================================================
 *
 * Se conserva esta operacion por compatibilidad con los
 * componentes que utilizan el flujo tradicional.
 */

/**
 * Crea una factura con los datos recibidos.
 *
 * @param {Object} factura Datos de la factura.
 * @returns {Promise<Object>} Factura creada.
 */
const crearFactura = async (factura) => {

    const respuesta = await axios.post(
        API_URL,
        factura,
        obtenerConfigAuth()
    );

    return respuesta.data;

};


/*
 * ============================================================
 * CREAR FACTURA COMPLETA
 * ============================================================
 *
 * Este flujo permite enviar la informacion de la factura
 * con sus relaciones y servicios, segun el contrato del API.
 *
 * Endpoint:
 * POST /api/facturas/completa
 */

/**
 * Crea una factura completa.
 *
 * @param {Object} facturaRequest Datos requeridos para crearla.
 * @returns {Promise<Object>} Factura creada.
 */
const crearFacturaCompleta = async (facturaRequest) => {

    const respuesta = await axios.post(
        `${API_URL}/completa`,
        facturaRequest,
        obtenerConfigAuth()
    );

    return respuesta.data;

};


/*
 * ============================================================
 * ELIMINAR FACTURA
 * ============================================================
 */

/**
 * Elimina una factura por su identificador.
 *
 * @param {number} idFactura Identificador de la factura.
 * @returns {Promise<void>} Resultado de la solicitud.
 */
const eliminarFactura = async (idFactura) => {

    await axios.delete(
        `${API_URL}/${idFactura}`,
        obtenerConfigAuth()
    );

};


/*
 * ============================================================
 * ACTUALIZAR FACTURA
 * ============================================================
 *
 * Permite enviar los campos de actualizacion admitidos
 * por el backend, como estado de pago o fecha.
 *
 * Endpoint:
 * PUT /api/facturas/{idFactura}
 */

/**
 * Actualiza una factura existente.
 *
 * @param {number} idFactura Identificador de la factura.
 * @param {Object} datos Datos que se desean actualizar.
 * @returns {Promise<Object>} Factura actualizada.
 */
const actualizarFactura = async (idFactura, datos) => {

    const respuesta = await axios.put(
        `${API_URL}/${idFactura}`,
        datos,
        obtenerConfigAuth()
    );

    return respuesta.data;

};


/*
 * ============================================================
 * EXPORTAR FUNCIONES DEL SERVICIO
 * ============================================================
 *
 * Se conservan los nombres utilizados por los componentes
 * que consumen este servicio.
 */

export {
    listarFacturas,
    crearFactura,
    crearFacturaCompleta,
    actualizarFactura,
    eliminarFactura
};
