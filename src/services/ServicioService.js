
/*
 * ============================================================
 * SERVICIOSERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de la comunicacion entre React y
 * Spring Boot para administrar el modulo de servicios.
 *
 * RESPONSABILIDADES:
 *
 * - Consultar todos los servicios odontologicos.
 * - Consultar un servicio por su identificador.
 * - Crear un nuevo servicio.
 * - Actualizar un servicio existente.
 * - Eliminar un servicio cuando el backend lo permita.
 *
 * Las solicitudes se realizan mediante fetch y utilizan
 * el token JWT almacenado durante el inicio de sesion.
 *
 * La URL base del backend se obtiene desde src/config/api.js.
 * Esto permite utilizar el servicio en el entorno local
 * y en el despliegue en la nube.
 *
 * ============================================================
 */

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL DEL MODULO DE SERVICIOS
 * ============================================================
 *
 * La URL se construye utilizando la configuracion central.
 *
 * En desarrollo local utiliza la direccion definida en api.js.
 * En la nube utiliza la direccion publica configurada
 * mediante la variable de entorno VITE_API_URL.
 */

const API_URL = `${API_BASE_URL}/servicios`;


/*
 * ============================================================
 * OBTENER ENCABEZADOS DE AUTENTICACION
 * ============================================================
 *
 * Obtiene el token JWT almacenado en el navegador.
 *
 * El encabezado Authorization permite que Spring Security
 * identifique al usuario y compruebe sus permisos.
 *
 * Content-Type indica que las solicitudes que envian datos
 * utilizan contenido en formato JSON.
 */

/**
 * Construye los encabezados HTTP necesarios para las peticiones.
 *
 * @returns {Object} Encabezados de autenticacion y contenido.
 */
function obtenerHeaders() {

    const token = localStorage.getItem("token");

    return {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };

}


/*
 * ============================================================
 * CONSULTAR TODOS LOS SERVICIOS
 * ============================================================
 *
 * Endpoint:
 * GET /api/servicios
 */

/**
 * Consulta los servicios odontologicos registrados.
 *
 * @returns {Promise<Array>} Lista de servicios recibida del backend.
 */
export async function listarServicios() {

    const response = await fetch(API_URL, {

        headers: obtenerHeaders()

    });

    return await response.json();

}


/*
 * ============================================================
 * CONSULTAR UN SERVICIO POR IDENTIFICADOR
 * ============================================================
 *
 * Endpoint:
 * GET /api/servicios/{id}
 */

/**
 * Consulta la informacion de un servicio especifico.
 *
 * @param {number|string} id Identificador del servicio.
 * @returns {Promise<Object>} Datos del servicio consultado.
 */
export async function obtenerServicio(id) {

    const response = await fetch(
        `${API_URL}/${id}`,
        {
            headers: obtenerHeaders()
        }
    );

    return await response.json();

}


/*
 * ============================================================
 * CREAR SERVICIO
 * ============================================================
 *
 * Endpoint:
 * POST /api/servicios
 *
 * El objeto recibido debe contener los campos que exige
 * el backend para registrar un servicio odontologico.
 */

/**
 * Registra un nuevo servicio.
 *
 * @param {Object} servicio Datos del servicio que se desea crear.
 * @returns {Promise<Object>} Respuesta del backend.
 */
export async function crearServicio(servicio) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: obtenerHeaders(),

        body: JSON.stringify(servicio)

    });

    return await response.json();

}


/*
 * ============================================================
 * ACTUALIZAR SERVICIO
 * ============================================================
 *
 * Endpoint:
 * PUT /api/servicios/{id}
 */

/**
 * Actualiza la informacion de un servicio existente.
 *
 * @param {number|string} id Identificador del servicio.
 * @param {Object} servicio Datos que se desean actualizar.
 * @returns {Promise<Object>} Respuesta del backend.
 */
export async function actualizarServicio(id, servicio) {

    const response = await fetch(
        `${API_URL}/${id}`,
        {

            method: "PUT",

            headers: obtenerHeaders(),

            body: JSON.stringify(servicio)

        }
    );

    return await response.json();

}


/*
 * ============================================================
 * ELIMINAR SERVICIO
 * ============================================================
 *
 * Endpoint:
 * DELETE /api/servicios/{id}
 *
 * El resultado depende de las reglas y permisos definidos
 * en el backend.
 *
 * Se devuelve el objeto Response para conservar el
 * comportamiento que utilizaban los componentes actuales.
 */

/**
 * Solicita la eliminacion de un servicio por su identificador.
 *
 * @param {number|string} id Identificador del servicio.
 * @returns {Promise<Response>} Respuesta HTTP del backend.
 */
export async function eliminarServicio(id) {

    return await fetch(
        `${API_URL}/${id}`,
        {

            method: "DELETE",

            headers: obtenerHeaders()

        }
    );

}
