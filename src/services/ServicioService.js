/*
============================================================
ServicioService.js
============================================================

Servicio encargado de la comunicación entre React y
Spring Boot para el módulo Servicios.

Todos los métodos utilizan JWT almacenado en
localStorage.

============================================================
*/

const API_URL = "http://localhost:8765/api/servicios";

/*
Obtiene el token almacenado.
*/
function obtenerHeaders() {

    const token = localStorage.getItem("token");

    return {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };

}

/*
Consulta todos los servicios.
*/
export async function listarServicios() {

    const response = await fetch(API_URL, {

        headers: obtenerHeaders()

    });

    return await response.json();

}

/*
Consulta un servicio.
*/
export async function obtenerServicio(id) {

    const response = await fetch(`${API_URL}/${id}`, {

        headers: obtenerHeaders()

    });

    return await response.json();

}

/*
Crear servicio.
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
Actualizar servicio.
*/
export async function actualizarServicio(id, servicio) {

    const response = await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: obtenerHeaders(),

        body: JSON.stringify(servicio)

    });

    return await response.json();

}

/*
Eliminar servicio.
*/
export async function eliminarServicio(id) {

    return await fetch(`${API_URL}/${id}`, {

        method: "DELETE",

        headers: obtenerHeaders()

    });

}