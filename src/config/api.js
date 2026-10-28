
/*
 * ============================================================
 * API.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Archivo encargado de centralizar la URL base del backend.
 *
 * Permite que el frontend se comunique con Spring Boot
 * tanto en el entorno local como en el despliegue en la nube.
 *
 * DESARROLLO LOCAL:
 * http://localhost:8765/api
 *
 * DESPLIEGUE:
 * La direccion publica se configura mediante la variable
 * de entorno VITE_API_URL en la plataforma de alojamiento.
 *
 * IMPORTANTE:
 * Esta variable contiene la URL base del backend incluyendo
 * el segmento /api, pero sin la ruta especifica del modulo.
 *
 * Ejemplo de produccion:
 * https://tu-backend.onrender.com/api
 *
 * ============================================================
 */

/*
 * ============================================================
 * URL BASE DE LA API
 * ============================================================
 *
 * VITE_API_URL:
 * Variable de entorno que se configurara en Vercel.
 *
 * Si la variable no existe, se utiliza la URL local
 * para mantener el funcionamiento durante el desarrollo.
 *
 * Se eliminan las barras finales para evitar construir
 * direcciones con barras duplicadas.
 */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:8765/api"
).replace(/\/+$/, "");


/*
 * ============================================================
 * EXPORTAR CONFIGURACION
 * ============================================================
 *
 * Los servicios y componentes del frontend importaran esta
 * constante para construir las rutas de la API.
 */

export { API_BASE_URL };

export default API_BASE_URL;
