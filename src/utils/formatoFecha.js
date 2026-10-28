/*
============================================================
FORMATOFECHA.JS

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Utilidades para el formato de fechas en la interfaz.

El backend entrega las fechas en formato ISO
(yyyy-MM-dd). Para el usuario se muestran en
formato dd-mmm-aaaa, por ejemplo:

    2026-08-21  ->  21-ago-2026
============================================================
*/


/*
========================================================
NOMBRES DE MESES EN ESPAÑOL (ABREVIADOS)

Índice 0 = enero ... índice 11 = diciembre.
Se usa "sep" (4 letras) porque es la abreviatura
estándar del mes septiembre en español.
========================================================
*/

const MESES = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic"
];


/*
========================================================
FORMATEAR FECHA

Convierte una fecha (ISO yyyy-MM-dd o objeto Date)
al formato legible dd-mmm-aaaa.

Ejemplos:

    formatearFecha("2026-08-21")   -> "21-ago-2026"
    formatearFecha(new Date())     -> fecha de hoy

Si la fecha no es válida se devuelve
una cadena vacía para no romper la tabla.
========================================================
*/

export function formatearFecha(valor) {

    /*
    Si no llega ningún valor se devuelve vacío.
    */

    if (!valor) {

        return "";

    }


    /*
    Se construye un objeto Date. Al agregar la hora
    T00:00:00 se evita que JavaScript desplace la
    fecha por diferencias de zona horaria.
    */

    const fecha =
        valor instanceof Date
            ? valor
            : new Date(`${valor}T00:00:00`);


    /*
    Validación: si la fecha es inválida
    se devuelve cadena vacía.
    */

    if (Number.isNaN(fecha.getTime())) {

        return "";

    }


    /*
    Se extraen día, mes y año para armar el texto.
    */

    const dia = String(fecha.getDate()).padStart(2, "0");

    const mes = MESES[fecha.getMonth()];

    const anio = fecha.getFullYear();


    return `${dia}-${mes}-${anio}`;

}
