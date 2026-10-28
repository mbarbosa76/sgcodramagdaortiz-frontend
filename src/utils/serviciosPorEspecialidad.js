/*
============================================================
SERVICIOSPORESPECIALIDAD.JS

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Utilidad para relacionar la especialidad del profesional
con las categorías de los servicios.

Al crear o editar una cita, el selector de servicios
solo debe mostrar los servicios relacionados con el
tipo de profesional seleccionado.

Relación aplicada:

    Especialidad              Categorías de servicio
    --------------------------------------------------
    Odontología General       Todas
    Higiene Dental            Preventivo, Estético
    Endodoncia                Restaurativo
    Periodoncia               Preventivo
    Cirugía Oral              Cirugía
    Odontopediatría           Preventivo, Restaurativo
    Ortodoncia                Todas (sin categoría propia)

Si una especialidad no tiene categorías asociadas,
o si ninguna categoría produce resultados,
se muestran todos los servicios para no bloquear
el registro de la cita.
============================================================
*/


/*
========================================================
NORMALIZAR TEXTO

Convierte un texto a minúsculas y le quita las tildes
para hacer comparaciones confiables:

    "Cirugía Oral" -> "cirugia oral"
========================================================
*/

function normalizar(texto) {

    return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


/*
========================================================
MAPA ESPECIALIDAD -> CATEGORÍAS

La clave es la especialidad normalizada (sin tildes).
Un arreglo vacío significa "sin categorías propias"
y se interpreta como todas.
========================================================
*/

const ESPECIALIDAD_CATEGORIAS = {

    "odontologia general": [
        "Preventivo",
        "Restaurativo",
        "Estético",
        "Cirugía"
    ],

    "higiene dental": [
        "Preventivo",
        "Estético"
    ],

    "endodoncia": [
        "Restaurativo"
    ],

    "periodoncia": [
        "Preventivo"
    ],

    "cirugia oral": [
        "Cirugía"
    ],

    "odontopediatria": [
        "Preventivo",
        "Restaurativo"
    ],

    /*
    La ortodoncia no tiene una categoría propia
    en el catálogo actual de servicios,
    por eso se permiten todas.
    */

    "ortodoncia": []

};


/*
========================================================
FILTRAR SERVICIOS POR ESPECIALIDAD

Recibe:

- servicios:   lista completa de servicios del backend.
- especialidad especialidad seleccionada del profesional.

Devuelve la lista de servicios permitidos para
esa especialidad.
========================================================
*/

export function filtrarServiciosPorEspecialidad(
    servicios,
    especialidad
) {

    /*
    Si no hay datos suficientes se devuelve
    la lista completa.
    */

    if (!Array.isArray(servicios) || !especialidad) {

        return servicios || [];

    }


    const categorias =
        ESPECIALIDAD_CATEGORIAS[normalizar(especialidad)];


    /*
    Especialidad desconocida o sin categorías propias:
    se muestran todos los servicios.
    */

    if (!categorias || categorias.length === 0) {

        return servicios;

    }


    /*
    Se comparan las categorías normalizadas
    (sin tildes) para evitar fallos por acentos.
    */

    const categoriasNormalizadas =
        categorias.map(normalizar);


    const filtrados = servicios.filter(
        (servicio) =>
            categoriasNormalizadas.includes(
                normalizar(servicio.categoria)
            )
    );


    /*
    Si el filtro no produjo ningún servicio
    se devuelve la lista completa como respaldo.
    */

    return filtrados.length > 0 ? filtrados : servicios;

}
