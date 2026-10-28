/*
============================================================
dashboardPeriodo.js

Sistema de Gestion de Citas Odontologicas
Consultorio Odontologico Dra. Magda Ortiz

Utilidades compartidas para el filtro hibrido del Dashboard.

Objetivos:

- Centralizar los periodos rapidos disponibles.
- Construir rangos de fechas inclusivos.
- Mantener una unica regla de filtrado para Navbar,
  Dashboard y graficos.
- Evitar diferencias entre indicadores y visualizaciones.

============================================================
*/

export const OPCIONES_PERIODO_DASHBOARD = [
    { valor: "todo", etiqueta: "Sin filtro", etiquetaCorta: "Sin filtro" },
    { valor: "1m", etiqueta: "Último mes", etiquetaCorta: "1 mes" },
    { valor: "3m", etiqueta: "Últimos 3 meses", etiquetaCorta: "3 meses" },
    { valor: "6m", etiqueta: "Últimos 6 meses", etiquetaCorta: "6 meses" },
    { valor: "12m", etiqueta: "Últimos 12 meses", etiquetaCorta: "12 meses" },
    { valor: "anio", etiqueta: "Este año", etiquetaCorta: "Este año" },
    { valor: "anio-anterior", etiqueta: "Año anterior", etiquetaCorta: "Año anterior" },
    { valor: "personalizado", etiqueta: "Personalizado", etiquetaCorta: "Personalizado" }
];


export const convertirFechaDashboard = (
    valor
) => {

    if(!valor){
        return null;
    }

    if(valor instanceof Date){

        const copia =
            new Date(valor);

        return Number.isNaN(copia.getTime())
            ? null
            : copia;

    }

    const texto =
        String(valor);

    const fecha =
        /^\d{4}-\d{2}-\d{2}$/.test(texto)
            ? new Date(`${texto}T00:00:00`)
            : new Date(texto);

    return Number.isNaN(fecha.getTime())
        ? null
        : fecha;

};


export const fechaLocalISO = (
    fecha
) => {

    const anio =
        fecha.getFullYear();

    const mes =
        String(fecha.getMonth() + 1).padStart(2, "0");

    const dia =
        String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;

};


export const crearFiltroPeriodoInicial = (
    referencia = new Date()
) => {

    const inicioPersonalizado =
        new Date(
            referencia.getFullYear(),
            referencia.getMonth() - 2,
            1
        );

    return {
        tipo: "todo",
        inicio: "",
        fin: ""
    };

};


const inicioDelDia = (
    fecha
) => {

    const copia =
        new Date(fecha);

    copia.setHours(0, 0, 0, 0);

    return copia;

};


const finDelDia = (
    fecha
) => {

    const copia =
        new Date(fecha);

    copia.setHours(23, 59, 59, 999);

    return copia;

};


export const obtenerRangoPeriodo = (
    filtro,
    referencia = new Date()
) => {

    const configuracion =
        typeof filtro === "string"
            ? { tipo: filtro }
            : (filtro || {});

    const tipo =
        configuracion.tipo || "todo";

    const hoy =
        inicioDelDia(referencia);

    let inicio;
    let fin;

    if(tipo === "personalizado"){

        inicio =
            convertirFechaDashboard(configuracion.inicio);

        fin =
            convertirFechaDashboard(configuracion.fin);

        if(!inicio || !fin || inicio > fin){

            inicio =
                new Date(
                    hoy.getFullYear(),
                    hoy.getMonth() - 2,
                    1
                );

            fin =
                hoy;

        }

    }
    else if(tipo === "anio"){

        inicio =
            new Date(
                hoy.getFullYear(),
                0,
                1
            );

        fin =
            hoy;

    }
    else if(tipo === "anio-anterior"){

        inicio =
            new Date(
                hoy.getFullYear() - 1,
                0,
                1
            );

        fin =
            new Date(
                hoy.getFullYear() - 1,
                11,
                31
            );

    }
    else if(tipo === "todo"){

        return {
            tipo,
            inicio: null,
            fin: null,
            inicioISO: "",
            finISO: ""
        };

    }
    else{

        const cantidadMeses =
            Number.parseInt(tipo, 10);

        const meses =
            Number.isFinite(cantidadMeses) && cantidadMeses > 0
                ? cantidadMeses
                : 3;

        inicio =
            new Date(
                hoy.getFullYear(),
                hoy.getMonth() - (meses - 1),
                1
            );

        fin =
            hoy;

    }

    return {
        tipo,
        inicio: inicioDelDia(inicio),
        fin: finDelDia(fin),
        inicioISO: fechaLocalISO(inicio),
        finISO: fechaLocalISO(fin)
    };

};


export const estaFechaEnPeriodo = (
    valorFecha,
    filtro
) => {

    const fecha =
        convertirFechaDashboard(valorFecha);

    if(!fecha){
        return false;
    }

    const rango =
        obtenerRangoPeriodo(filtro);

    if(!rango.inicio || !rango.fin){
        return true;
    }

    return fecha >= rango.inicio && fecha <= rango.fin;

};


/*
============================================================
VALIDAR UNA FECHA CONTRA UN RANGO ISO EXPLICITO

Esta funcion se usa cuando el Dashboard navega a un modulo
con un rango ya resuelto (fechaInicio / fechaFin). De esta
manera la tabla de destino muestra exactamente los mismos
registros que originaron el valor de la tarjeta.
============================================================
*/
export const estaFechaEnRangoISO = (
    valorFecha,
    fechaInicio,
    fechaFin
) => {

    /* Sin limites de fecha no se aplica restriccion temporal. */
    if(!fechaInicio && !fechaFin){
        return true;
    }

    const fecha = convertirFechaDashboard(valorFecha);

    if(!fecha){
        return false;
    }

    const inicio = fechaInicio
        ? convertirFechaDashboard(fechaInicio)
        : null;

    const fin = fechaFin
        ? convertirFechaDashboard(fechaFin)
        : null;

    if(inicio){
        inicio.setHours(0, 0, 0, 0);
    }

    if(fin){
        fin.setHours(23, 59, 59, 999);
    }

    return (
        (!inicio || fecha >= inicio) &&
        (!fin || fecha <= fin)
    );

};


const formatearFechaCorta = (
    fecha
) => {

    return new Intl.DateTimeFormat(
        "es-CO",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    )
        .format(fecha)
        .replace(/\./g, "");

};


export const obtenerEtiquetaPeriodo = (
    filtro
) => {

    const configuracion =
        typeof filtro === "string"
            ? { tipo: filtro }
            : (filtro || {});

    const opcion =
        OPCIONES_PERIODO_DASHBOARD.find(
            item => item.valor === configuracion.tipo
        );

    if(configuracion.tipo !== "personalizado"){
        return opcion?.etiqueta || "Sin filtro";
    }

    const rango =
        obtenerRangoPeriodo(configuracion);

    return `${formatearFechaCorta(rango.inicio)} - ${formatearFechaCorta(rango.fin)}`;

};


export const construirMesesDelPeriodo = (
    filtro
) => {

    const rango =
        obtenerRangoPeriodo(filtro);

    if(!rango.inicio || !rango.fin){
        return [];
    }

    const cursor =
        new Date(
            rango.inicio.getFullYear(),
            rango.inicio.getMonth(),
            1
        );

    const limite =
        new Date(
            rango.fin.getFullYear(),
            rango.fin.getMonth(),
            1
        );

    const meses = [];

    while(cursor <= limite){

        meses.push(
            new Date(cursor)
        );

        cursor.setMonth(
            cursor.getMonth() + 1
        );

    }

    return meses;

};
