
/*
 * ============================================================
 * AUTHSERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * ============================================================
 *
 * Servicio encargado de gestionar la autenticacion.
 *
 * Responsabilidades:
 *
 * - Enviar las credenciales al backend.
 * - Recibir el token JWT y los datos del usuario.
 * - Cerrar la sesion eliminando los datos almacenados.
 * - Recuperar la informacion del usuario autenticado.
 *
 * La URL del backend se obtiene desde la configuracion central
 * ubicada en src/config/api.js.
 *
 * ============================================================
 */

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * URL DEL LOGIN
 * ============================================================
 *
 * La ruta se construye utilizando la URL base de la API.
 * De esta forma funciona localmente y en la nube.
 */

const API_LOGIN = `${API_BASE_URL}/auth/login`;


/*
 * ============================================================
 * INICIAR SESION
 * ============================================================
 */

/**
 * Envia las credenciales del usuario al backend.
 *
 * @param {string} username Nombre de usuario.
 * @param {string} password Contrasena.
 * @returns {Promise} Respuesta con token JWT y datos del usuario.
 */
export const login = (username, password) => {

    return axios.post(
        API_LOGIN,
        {
            username,
            password
        }
    );

};


/*
 * ============================================================
 * CERRAR SESION
 * ============================================================
 */

/**
 * Elimina el token JWT y los datos del usuario almacenados
 * en el navegador al cerrar la sesion.
 */
export const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

};


/*
 * ============================================================
 * OBTENER USUARIO AUTENTICADO
 * ============================================================
 */

/**
 * Recupera los datos del usuario almacenados despues
 * de iniciar sesion.
 *
 * @returns {Object|null} Datos del usuario o null si no existe.
 */
export const obtenerUsuario = () => {

    const usuario = localStorage.getItem("usuario");

    if (!usuario) {

        return null;

    }

    try {

        return JSON.parse(usuario);

    } catch (error) {

        console.error(
            "No fue posible leer los datos del usuario almacenado.",
            error
        );

        return null;

    }

};
