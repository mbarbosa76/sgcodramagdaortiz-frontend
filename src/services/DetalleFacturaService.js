
/*
 * ============================================================
 * DETALLEFACTURASERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de consultar los detalles asociados
 * a las facturas registradas en el sistema.
 *
 * RESPONSABILIDADES:
 *
 * - Consultar los detalles de facturacion.
 * - Enviar el token JWT en las solicitudes protegidas.
 * - Retornar la informacion recibida desde el backend.
 *
 * La comunicacion se realiza mediante Axios con Spring Boot.
 *
 * La URL base del backend se obtiene desde la configuracion
 * central ubicada en src/config/api.js.
 *
 * ============================================================
 */

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL DEL MODULO DE DETALLES DE FACTURA
 * ============================================================
 *
 * Se construye utilizando la URL base de la API.
 *
 * En desarrollo local utiliza la direccion configurada
 * en api.js.
 *
 * En la nube utiliza la direccion publica definida mediante
 * la variable de entorno VITE_API_URL.
 */

const API_URL = `${API_BASE_URL}/detalles-factura`;


/*
 * ============================================================
 * CONFIGURACION DE AUTENTICACION JWT
 * ============================================================
 *
 * Obtiene el token almacenado en el navegador y lo incluye
 * en el encabezado Authorization.
 *
 * El backend utiliza este token para comprobar si el usuario
 * tiene una sesion valida y los permisos necesarios.
 */

/**
 * Construye los encabezados de autenticacion.
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
 * LISTAR DETALLES DE FACTURACION
 * ============================================================
 *
 * Consulta los detalles de factura disponibles mediante
 * el endpoint configurado en el backend.
 *
 * Endpoint:
 * GET /api/detalles-factura
 */

/**
 * Consulta los detalles de facturacion.
 *
 * @returns {Promise<Array>} Datos devueltos por el backend.
 */
const listarDetalles = async () => {

    const respuesta = await axios.get(

        API_URL,

        obtenerConfigAuth()

    );

    return respuesta.data;

};


/*
 * ============================================================
 * EXPORTAR FUNCIONES DEL SERVICIO
 * ============================================================
 *
 * Se conserva el nombre listarDetalles para mantener
 * la compatibilidad con los componentes que lo utilizan.
 */

export {

    listarDetalles

};
