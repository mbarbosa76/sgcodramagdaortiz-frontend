/*
============================================================
Dashboard.jsx

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Dashboard principal del sistema.

Objetivos de la nueva versión:

- Conservar la lógica real de roles existente.
- Reutilizar los endpoints actuales del backend.
- Presentar indicadores, tendencias y accesos rápidos.
- Mostrar próximas citas, actividad reciente y calendario.
- Mantener navegación interna sin incorporar React Router.
- Aplicar un diseño visual cercano al prototipo aprobado.

Roles:

ADMIN:
- Indicadores globales.
- Facturación.
- Actividad administrativa.

PROFESIONAL:
- Información clínica propia.
- Citas asignadas.

RECEPCIONISTA:
- Información operativa.
- Agenda y facturación permitida.

============================================================
*/

import {
    CalendarDays,
    CalendarPlus,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    ClipboardPlus,
    FileText,
    MoreVertical,
    Receipt,
    UserCog,
    UserPlus,
    Users
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import DashboardCharts from "../components/DashboardCharts";

import logoConsultorio from "../assets/logo-consultorio.png";

import {
    obtenerCitasDashboard,
    obtenerDashboardAdmin,
    obtenerDashboardProfesional,
    obtenerDashboardRecepcionista,
    obtenerFacturasDashboard,
    obtenerHistoriasDashboard,
    obtenerPacientesDashboard,
    obtenerUsuariosDashboard
} from "../services/DashboardService";

import {
    construirMesesDelPeriodo,
    convertirFechaDashboard as convertirFecha,
    estaFechaEnPeriodo,
    fechaLocalISO,
    obtenerEtiquetaPeriodo,
    obtenerRangoPeriodo
} from "../utils/dashboardPeriodo";

import "./Dashboard.css";


/*
============================================================
CONFIGURACIÓN DE ESTADOS DE CITA
============================================================
*/

const CONFIG_ESTADOS = {
    "ASISTIDA": {
        etiqueta: "Asistida",
        clase: "asistida"
    },
    "PROGRAMADA": {
        etiqueta: "Programada",
        clase: "programada"
    },
    "CONFIRMADA": {
        etiqueta: "Confirmada",
        clase: "confirmada"
    },
    "NO ASISTIDA": {
        etiqueta: "No asistida",
        clase: "no-asistida"
    },
    "CANCELADA": {
        etiqueta: "Cancelada",
        clase: "cancelada"
    }
};


/*
============================================================
FUNCIONES AUXILIARES DE INDICADORES POR PERIODO

La tendencia compara el rango activo contra el bloque de
tiempo inmediatamente anterior con la misma duración. De
esta forma el porcentaje mantiene sentido para 1, 3, 6, 12
meses, año anterior y rangos personalizados.
============================================================
*/

const sumarEnRango = (
    lista,
    campoFecha,
    inicio,
    fin,
    obtenerValor = () => 1
) => {

    return lista.reduce(
        (acumulado, item) => {

            const fecha =
                convertirFecha(item?.[campoFecha]);

            if(
                fecha &&
                fecha >= inicio &&
                fecha <= fin
            ){
                return acumulado + Number(obtenerValor(item) || 0);
            }

            return acumulado;

        },
        0
    );

};


const calcularTendenciaPeriodo = (
    lista,
    campoFecha,
    periodo,
    obtenerValor = () => 1
) => {

    const rango =
        obtenerRangoPeriodo(periodo);

    if(!rango.inicio || !rango.fin){
        return 0;
    }

    const duracion =
        rango.fin.getTime() - rango.inicio.getTime() + 1;

    const finAnterior =
        new Date(rango.inicio.getTime() - 1);

    const inicioAnterior =
        new Date(finAnterior.getTime() - duracion + 1);

    const totalActual =
        sumarEnRango(
            lista,
            campoFecha,
            rango.inicio,
            rango.fin,
            obtenerValor
        );

    const totalAnterior =
        sumarEnRango(
            lista,
            campoFecha,
            inicioAnterior,
            finAnterior,
            obtenerValor
        );

    if(totalAnterior === 0){

        return totalActual > 0
            ? 100
            : 0;

    }

    return Number(
        (
            (
                (totalActual - totalAnterior) /
                totalAnterior
            ) * 100
        ).toFixed(1)
    );

};


const construirSeriePeriodo = (
    lista,
    campoFecha,
    periodo,
    obtenerValor = () => 1
) => {

    const rango =
        obtenerRangoPeriodo(periodo);

    const meses =
        construirMesesDelPeriodo(periodo);

    if(!rango.inicio || !rango.fin || meses.length === 0){
        return [0];
    }

    return meses.map(
        fechaMes => {

            const inicioMes =
                new Date(
                    fechaMes.getFullYear(),
                    fechaMes.getMonth(),
                    1
                );

            const finMes =
                new Date(
                    fechaMes.getFullYear(),
                    fechaMes.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                );

            const inicio =
                inicioMes > rango.inicio
                    ? inicioMes
                    : rango.inicio;

            const fin =
                finMes < rango.fin
                    ? finMes
                    : rango.fin;

            return sumarEnRango(
                lista,
                campoFecha,
                inicio,
                fin,
                obtenerValor
            );

        }
    );

};


const formatoMoneda = (
    valor
) => {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(Number(valor || 0));

};


const formatearHora = (
    valor
) => {

    if(!valor){
        return "--:--";
    }

    const [horaTexto, minutoTexto] =
        valor.split(":");

    const hora =
        Number(horaTexto);

    const periodo =
        hora >= 12 ? "p. m." : "a. m.";

    const hora12 =
        hora % 12 || 12;

    return `${String(hora12).padStart(2, "0")}:${minutoTexto} ${periodo}`;

};


const formatearActividad = (
    valorFecha
) => {

    const fecha =
        convertirFecha(valorFecha);

    if(!fecha){
        return "Sin fecha";
    }

    const hoy =
        new Date();

    const hoyISO =
        fechaLocalISO(hoy);

    const ayer =
        new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate() - 1
        );

    if(fechaLocalISO(fecha) === hoyISO){
        return "Hoy";
    }

    if(fechaLocalISO(fecha) === fechaLocalISO(ayer)){
        return "Ayer";
    }

    return new Intl.DateTimeFormat(
        "es-CO",
        {
            day: "2-digit",
            month: "short"
        }
    ).format(fecha);

};


const obtenerNombrePaciente = (
    paciente
) => {

    if(!paciente){
        return "Paciente";
    }

    return [
        paciente.nombre,
        paciente.apellido
    ]
        .filter(Boolean)
        .join(" ") || "Paciente";

};


const obtenerNombreEstado = (
    estado
) => {

    return CONFIG_ESTADOS[estado]?.etiqueta || estado || "Sin estado";

};


/*
============================================================
MINI GRÁFICA PARA TARJETAS KPI
============================================================
*/

function MiniTendencia({
    valores,
    variante = "verde"
}) {

    const ancho = 92;
    const alto = 34;
    const margen = 3;

    const maximo =
        Math.max(...valores, 1);

    const minimo =
        Math.min(...valores, 0);

    const rango =
        Math.max(maximo - minimo, 1);

    const puntos =
        valores.map(
            (valor, indice) => {

                const x =
                    margen +
                    (
                        indice /
                        Math.max(valores.length - 1, 1)
                    ) *
                    (ancho - margen * 2);

                const y =
                    alto -
                    margen -
                    (
                        (valor - minimo) /
                        rango
                    ) *
                    (alto - margen * 2);

                return `${x},${y}`;

            }
        ).join(" ");

    return (
        <svg
            className={`kpi-sparkline ${variante}`}
            viewBox={`0 0 ${ancho} ${alto}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline
                points={puntos}
                fill="none"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );

}


/*
============================================================
TARJETA DE INDICADOR
============================================================
*/

function TarjetaIndicador({
    titulo,
    valor,
    icono,
    tendencia,
    serie,
    modulo,
    filtroNavegacion = null,
    onNavegar,
    variante = "verde",
    textoTendencia = "vs. período anterior"
}) {

    const tendenciaPositiva =
        tendencia >= 0;

    return (
        <article
            className={`dashboard-kpi-card ${variante}`}
            onClick={() => modulo && onNavegar?.(modulo, filtroNavegacion)}
            role={modulo ? "button" : undefined}
            tabIndex={modulo ? 0 : undefined}
            onKeyDown={event => {
                if(
                    modulo &&
                    (event.key === "Enter" || event.key === " ")
                ){
                    onNavegar?.(modulo, filtroNavegacion);
                }
            }}
        >

            <button
                type="button"
                className="dashboard-card-menu"
                aria-label={`Opciones de ${titulo}`}
                onClick={event => event.stopPropagation()}
            >
                <MoreVertical size={17} />
            </button>

            <div className="dashboard-kpi-top">

                <div className="dashboard-kpi-icon">
                    {icono}
                </div>

                <div className="dashboard-kpi-copy">
                    <span>{titulo}</span>
                    <strong>{valor}</strong>
                </div>

                <MiniTendencia
                    valores={serie}
                    variante={variante}
                />

            </div>

            <div className="dashboard-kpi-trend">
                <span className={tendenciaPositiva ? "positive" : "negative"}>
                    {tendenciaPositiva ? "▲" : "▼"}
                    {" "}
                    {Math.abs(tendencia).toFixed(1)}%
                </span>
                <small>{textoTendencia}</small>
            </div>

        </article>
    );

}


/*
============================================================
PRÓXIMAS CITAS
============================================================
*/

function ProximasCitas({
    citas,
    onNavegar
}) {

    return (
        <article className="dashboard-panel upcoming-panel">

            <div className="dashboard-panel-header">
                <h3>Próximas citas</h3>

                <button
                    type="button"
                    className="dashboard-link-button"
                    onClick={() => onNavegar?.("citas")}
                >
                    Ver agenda
                </button>
            </div>

            <div className="upcoming-list">

                {
                    citas.length === 0
                        ? (
                            <div className="dashboard-empty-state compact">
                                <CalendarDays size={28} />
                                <span>No hay próximas citas registradas.</span>
                            </div>
                        )
                        : citas.map(
                            cita => {

                                const estado =
                                    CONFIG_ESTADOS[cita.estado] || {
                                        etiqueta: cita.estado,
                                        clase: "programada"
                                    };

                                return (
                                    <div
                                        className="upcoming-item"
                                        key={cita.idCita}
                                    >

                                        <div className="upcoming-time">
                                            <strong>
                                                {formatearHora(cita.horaInicio).split(" ").slice(0, 1)}
                                            </strong>
                                            <span>
                                                {formatearHora(cita.horaInicio).split(" ").slice(1).join(" ")}
                                            </span>
                                        </div>

                                        <div className="upcoming-copy">
                                            <button
                                                type="button"
                                                className="upcoming-patient-link"
                                                onClick={() => {
                                                    const idPaciente =
                                                        cita.paciente?.idPaciente;

                                                    if(idPaciente){
                                                        onNavegar?.(
                                                            "pacientes",
                                                            {
                                                                tipo: "idPaciente",
                                                                valor: idPaciente,
                                                                etiqueta: `Paciente: ${obtenerNombrePaciente(cita.paciente)}`
                                                            }
                                                        );
                                                    }
                                                }}
                                                title="Abrir ficha del paciente"
                                            >
                                                {obtenerNombrePaciente(cita.paciente)}
                                            </button>
                                            <span>
                                                {cita.servicio?.nombreServicio || "Servicio odontológico"}
                                            </span>
                                        </div>

                                        <span className={`appointment-status ${estado.clase}`}>
                                            {estado.etiqueta}
                                        </span>

                                        <button
                                            type="button"
                                            className="upcoming-options"
                                            aria-label={`Abrir cita ${cita.idCita}`}
                                            title="Ver detalle de la cita"
                                            onClick={() =>
                                                onNavegar?.(
                                                    "citas",
                                                    {
                                                        tipo: "idCita",
                                                        valor: cita.idCita,
                                                        etiqueta: `Cita #${cita.idCita}`
                                                    }
                                                )
                                            }
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                    </div>
                                );

                            }
                        )
                }

            </div>

            <button
                type="button"
                className="upcoming-footer-button"
                onClick={() => onNavegar?.("citas")}
            >
                <CalendarDays size={15} />
                Ver todas las citas
            </button>

        </article>
    );

}


/*
============================================================
ACTIVIDAD RECIENTE
============================================================
*/

function ActividadReciente({
    actividades,
    onNavegar
}) {

    const ICONOS = {
        cita: <CalendarPlus size={17} />,
        paciente: <UserPlus size={17} />,
        factura: <CircleDollarSign size={17} />
    };

    return (
        <article className="dashboard-panel activity-panel">

            <div className="dashboard-panel-header">
                <h3>Actividad reciente</h3>
                <MoreVertical size={17} />
            </div>

            <div className="activity-list">

                {
                    actividades.length === 0
                        ? (
                            <div className="dashboard-empty-state compact">
                                <CheckCircle2 size={28} />
                                <span>Sin actividad reciente para mostrar.</span>
                            </div>
                        )
                        : actividades.map(
                            actividad => (
                                <button
                                    type="button"
                                    className="activity-item"
                                    key={actividad.id}
                                    onClick={() =>
                                        onNavegar?.(
                                            actividad.modulo,
                                            actividad.filtro
                                        )
                                    }
                                    title="Abrir registro"
                                >

                                    <div className={`activity-icon ${actividad.tipo}`}>
                                        {ICONOS[actividad.tipo]}
                                    </div>

                                    <div className="activity-copy">
                                        <strong>{actividad.titulo}</strong>
                                        <span>{actividad.detalle}</span>
                                    </div>

                                    <time>
                                        {formatearActividad(actividad.fecha)}
                                    </time>

                                </button>
                            )
                        )
                }

            </div>

        </article>
    );

}


/*
============================================================
ACCIONES RÁPIDAS
============================================================
*/

function AccionesRapidas({
    usuario,
    onNavegar
}) {

    const acciones = [
        {
            titulo: "Nueva cita",
            icono: <CalendarPlus />,
            ejecutar: () => onNavegar?.("citas"),
            mostrar: true
        },
        {
            titulo: "Nuevo paciente",
            icono: <UserPlus />,
            ejecutar: () => onNavegar?.("pacientes"),
            mostrar: true
        },
        {
            titulo: "Nueva factura",
            icono: <Receipt />,
            ejecutar: () => onNavegar?.("facturas"),
            mostrar: ["Admin", "Recepcionista"].includes(usuario.rol)
        },
        {
            titulo: "Ver facturas",
            icono: <FileText />,
            ejecutar: () => onNavegar?.("facturas"),
            mostrar: ["Admin", "Recepcionista"].includes(usuario.rol)
        },
        {
            titulo: "Historias clínicas",
            icono: <ClipboardPlus />,
            ejecutar: () => onNavegar?.("historias"),
            mostrar: usuario.rol === "Profesional"
        }
    ].filter(accion => accion.mostrar);

    return (
        <article className="dashboard-panel quick-actions-panel">

            <div className="dashboard-panel-header">
                <h3>Acciones rápidas</h3>
            </div>

            <div className="quick-actions-grid">

                {
                    acciones.map(
                        accion => (
                            <button
                                type="button"
                                key={accion.titulo}
                                onClick={accion.ejecutar}
                            >
                                <span>{accion.icono}</span>
                                <strong>{accion.titulo}</strong>
                            </button>
                        )
                    )
                }

            </div>

        </article>
    );

}


/*
============================================================
CALENDARIO RESUMIDO
============================================================
*/

function CalendarioDashboard({
    citas,
    onNavegar
}) {

    const hoy =
        new Date();

    const [mesVisible, setMesVisible] =
        useState(
            new Date(
                hoy.getFullYear(),
                hoy.getMonth(),
                1
            )
        );


    /*
    ========================================================
    CAMBIO DE MES
    ========================================================
    */

    const moverMes = (
        desplazamiento
    ) => {

        setMesVisible(
            actual =>
                new Date(
                    actual.getFullYear(),
                    actual.getMonth() + desplazamiento,
                    1
                )
        );

    };


    const primerDia =
        new Date(
            mesVisible.getFullYear(),
            mesVisible.getMonth(),
            1
        );

    const inicioCalendario =
        new Date(primerDia);

    const desplazamiento =
        (primerDia.getDay() + 6) % 7;

    inicioCalendario.setDate(
        primerDia.getDate() - desplazamiento
    );

    const dias =
        Array.from(
            { length: 42 },
            (_, indice) => {

                const fecha =
                    new Date(inicioCalendario);

                fecha.setDate(
                    inicioCalendario.getDate() + indice
                );

                return fecha;

            }
        );

    const citasPorFecha =
        citas.reduce(
            (mapa, cita) => {

                if(!cita.fecha){
                    return mapa;
                }

                if(!mapa[cita.fecha]){
                    mapa[cita.fecha] = [];
                }

                mapa[cita.fecha].push(cita);

                return mapa;

            },
            {}
        );

    const nombreMes =
        new Intl.DateTimeFormat(
            "es-CO",
            {
                month: "long",
                year: "numeric"
            }
        ).format(mesVisible);

    return (
        <article className="dashboard-panel calendar-panel">

            <div className="dashboard-panel-header calendar-heading">
                <h3>Calendario</h3>

                <div className="calendar-heading-controls">

                    <strong>{nombreMes}</strong>

                    <button
                        type="button"
                        onClick={() => moverMes(-1)}
                        aria-label="Mes anterior"
                    >
                        <ChevronLeft size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={() => moverMes(1)}
                        aria-label="Mes siguiente"
                    >
                        <ChevronRight size={14} />
                    </button>

                </div>
            </div>

            <div className="calendar-layout">

                <div className="calendar-grid-wrapper">

                    <div className="calendar-weekdays">
                        {
                            ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
                                .map(dia => <span key={dia}>{dia}</span>)
                        }
                    </div>

                    <div className="calendar-days">

                        {
                            dias.map(
                                fecha => {

                                    const fechaISO =
                                        fechaLocalISO(fecha);

                                    const esMesActual =
                                        fecha.getMonth() === mesVisible.getMonth() &&
                                        fecha.getFullYear() === mesVisible.getFullYear();

                                    const esHoy =
                                        fechaISO === fechaLocalISO(hoy);

                                    const citasDia =
                                        citasPorFecha[fechaISO] || [];

                                    return (
                                        <button
                                            type="button"
                                            key={fechaISO}
                                            className={[
                                                "calendar-day",
                                                !esMesActual ? "outside" : "",
                                                esHoy ? "today" : "",
                                                citasDia.length ? "has-appointments" : ""
                                            ].filter(Boolean).join(" ")}
                                            title={
                                                citasDia.length
                                                    ? `${citasDia.length} cita(s)`
                                                    : `Sin citas el ${fechaISO}`
                                            }
                                            onClick={() => {
                                                if(!esMesActual){
                                                    return;
                                                }

                                                const etiquetaFecha =
                                                    new Intl.DateTimeFormat(
                                                        "es-CO",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        }
                                                    ).format(fecha);

                                                onNavegar?.(
                                                    "citas",
                                                    {
                                                        tipo: "fecha",
                                                        valor: fechaISO,
                                                        etiqueta: `Citas del ${etiquetaFecha}`
                                                    }
                                                );
                                            }}
                                        >
                                            <span>{fecha.getDate()}</span>
                                            {
                                                citasDia.length > 0 &&
                                                <i />
                                            }
                                        </button>
                                    );

                                }
                            )
                        }

                    </div>

                </div>

                <div className="calendar-legend">
                    <span><i className="asistida" /> Asistidas</span>
                    <span><i className="programada" /> Programadas</span>
                    <span><i className="confirmada" /> Confirmadas</span>
                    <span><i className="cancelada" /> Canceladas</span>
                </div>

            </div>

        </article>
    );

}



/*
============================================================
COMPONENTE PRINCIPAL
============================================================
*/

function Dashboard({
    usuario,
    onNavegar,
    periodo = null
}) {

    const [datosDashboard, setDatosDashboard] =
        useState(null);

    const [citas, setCitas] =
        useState([]);

    const [pacientes, setPacientes] =
        useState([]);

    const [facturas, setFacturas] =
        useState([]);

    const [usuarios, setUsuarios] =
        useState([]);

    const [historias, setHistorias] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
    ========================================================
    CARGA DE INFORMACIÓN

    Primero consulta el resumen según rol y posteriormente
    consume fuentes complementarias ya disponibles.
    ========================================================
    */

    useEffect(() => {

        const cargarDashboard = async () => {

            setCargando(true);
            setError("");

            try {

                let respuestaResumen;

                if(usuario.rol === "Admin"){
                    respuestaResumen = await obtenerDashboardAdmin();
                }
                else if(usuario.rol === "Profesional"){
                    respuestaResumen = await obtenerDashboardProfesional();
                }
                else{
                    respuestaResumen = await obtenerDashboardRecepcionista();
                }

                setDatosDashboard(
                    respuestaResumen.data
                );


                const peticiones = {
                    citas: obtenerCitasDashboard(),
                    pacientes: obtenerPacientesDashboard()
                };

                if(["Admin", "Recepcionista"].includes(usuario.rol)){
                    peticiones.facturas = obtenerFacturasDashboard();
                }

                if(usuario.rol === "Admin"){
                    peticiones.usuarios = obtenerUsuariosDashboard();
                }

                if(usuario.rol === "Profesional"){
                    peticiones.historias = obtenerHistoriasDashboard();
                }

                const claves =
                    Object.keys(peticiones);

                const resultados =
                    await Promise.allSettled(
                        Object.values(peticiones)
                    );

                const obtenerResultado = (
                    clave
                ) => {

                    const indice =
                        claves.indexOf(clave);

                    if(indice < 0){
                        return [];
                    }

                    const resultado =
                        resultados[indice];

                    if(resultado?.status !== "fulfilled"){
                        return [];
                    }

                    /*
                    ====================================================
                    NORMALIZACIÓN DE RESPUESTAS DEL BACKEND

                    Algunos endpoints del sistema devuelven directamente
                    un arreglo, mientras que otros pueden devolver una
                    respuesta paginada de Spring Boot con la propiedad
                    "content". El Dashboard debe trabajar siempre con
                    listas completas para que los indicadores coincidan
                    con los módulos.
                    ====================================================
                    */
                    const datos = resultado.value.data;

                    if(Array.isArray(datos)){
                        return datos;
                    }

                    if(Array.isArray(datos?.content)){
                        return datos.content;
                    }

                    if(Array.isArray(datos?.data)){
                        return datos.data;
                    }

                    return [];

                };

                setCitas(
                    obtenerResultado("citas")
                );

                setPacientes(
                    obtenerResultado("pacientes")
                );

                setFacturas(
                    obtenerResultado("facturas")
                );

                setUsuarios(
                    obtenerResultado("usuarios")
                );

                setHistorias(
                    obtenerResultado("historias")
                );


            }
            catch(errorCarga){

                console.error(
                    "Error cargando dashboard:",
                    errorCarga
                );

                setError(
                    "No fue posible cargar el resumen del Dashboard. Verifica la conexión con el backend."
                );

            }
            finally{
                setCargando(false);
            }

        };

        cargarDashboard();

    }, [usuario]);


    /*
    ========================================================
    INFORMACIÓN FILTRADA POR PERIODO
    ========================================================
    */

    const etiquetaPeriodo = useMemo(
        () => obtenerEtiquetaPeriodo(periodo),
        [periodo]
    );

    const citasPeriodo = useMemo(
        () => !periodo
            ? citas
            : citas.filter(
                cita => estaFechaEnPeriodo(cita.fecha, periodo)
            ),
        [citas, periodo]
    );

    const pacientesPeriodo = useMemo(
        () => !periodo
            ? pacientes
            : pacientes.filter(
                paciente => estaFechaEnPeriodo(paciente.fechaRegistro, periodo)
            ),
        [pacientes, periodo]
    );

    const facturasPeriodo = useMemo(
        () => !periodo
            ? facturas
            : facturas.filter(
                factura => estaFechaEnPeriodo(factura.fecha, periodo)
            ),
        [facturas, periodo]
    );

    const usuariosPeriodo = useMemo(
        () => !periodo
            ? usuarios
            : usuarios.filter(
                usuarioItem => estaFechaEnPeriodo(usuarioItem.fechaCreacion, periodo)
            ),
        [usuarios, periodo]
    );

    const idProfesionalActual = useMemo(
        () =>
            citas.find(
                cita => cita.profesional?.idProfesional
            )?.profesional?.idProfesional || null,
        [citas]
    );

    const historiasProfesional = useMemo(
        () => {

            if(usuario.rol !== "Profesional"){
                return historias;
            }

            if(!idProfesionalActual){
                return [];
            }

            return historias.filter(
                historia =>
                    historia.profesional?.idProfesional === idProfesionalActual
            );

        },
        [historias, idProfesionalActual, usuario.rol]
    );

    const historiasPeriodo = useMemo(
        () => historiasProfesional.filter(
            historia => estaFechaEnPeriodo(historia.fecha, periodo)
        ),
        [historiasProfesional, periodo]
    );


    /*
    ========================================================
    PRÓXIMAS CITAS
    ========================================================
    */

    const proximasCitas = useMemo(
        () => {

            const hoyISO =
                fechaLocalISO(new Date());

            return citas
                .filter(
                    cita =>
                        cita.fecha &&
                        cita.fecha >= hoyISO &&
                        !["CANCELADA", "NO ASISTIDA", "ASISTIDA"].includes(cita.estado)
                )
                .sort(
                    (a, b) =>
                        `${a.fecha} ${a.horaInicio || "00:00"}`
                            .localeCompare(`${b.fecha} ${b.horaInicio || "00:00"}`)
                )
                .slice(0, 4);

        },
        [citas]
    );


    /*
    ========================================================
    ACTIVIDAD RECIENTE
    ========================================================
    */

    const actividadReciente = useMemo(
        () => {

            const actividades = [
                ...citas.map(
                    cita => ({
                        id: `cita-${cita.idCita}`,
                        tipo: "cita",
                        titulo: "Nueva cita registrada",
                        detalle: `${obtenerNombrePaciente(cita.paciente)} · ${cita.servicio?.nombreServicio || "Servicio odontológico"}`,
                        fecha: cita.fechaCreacion || cita.fecha,
                        modulo: "citas",
                        filtro: {
                            tipo: "idCita",
                            valor: cita.idCita,
                            etiqueta: `Cita #${cita.idCita}`
                        }
                    })
                ),
                ...pacientes.map(
                    paciente => ({
                        id: `paciente-${paciente.idPaciente}`,
                        tipo: "paciente",
                        titulo: "Nuevo paciente registrado",
                        detalle: obtenerNombrePaciente(paciente),
                        fecha: paciente.fechaRegistro,
                        modulo: "pacientes",
                        filtro: {
                            tipo: "idPaciente",
                            valor: paciente.idPaciente,
                            etiqueta: `Paciente: ${obtenerNombrePaciente(paciente)}`
                        }
                    })
                ),
                ...facturas.map(
                    factura => ({
                        id: `factura-${factura.idFactura}`,
                        tipo: "factura",
                        titulo: "Factura registrada",
                        detalle: `${factura.numeroFactura || "Factura"} por ${formatoMoneda(factura.total)}`,
                        fecha: factura.fecha,
                        modulo: "facturas",
                        filtro: {
                            tipo: "idFactura",
                            valor: factura.idFactura,
                            etiqueta: factura.numeroFactura
                                ? `Factura ${factura.numeroFactura}`
                                : `Factura #${factura.idFactura}`
                        }
                    })
                )
            ];

            return actividades
                .filter(
                    actividad =>
                        actividad.fecha &&
                        estaFechaEnPeriodo(actividad.fecha, periodo)
                )
                .sort(
                    (a, b) =>
                        String(b.fecha).localeCompare(String(a.fecha))
                )
                .slice(0, 3);

        },
        [citas, pacientes, facturas, periodo]
    );


    /*
    ========================================================
    TARJETAS SEGÚN ROL
    ========================================================
    */

    const tarjetas = useMemo(
        () => {

            if(!datosDashboard){
                return [];
            }

            const hoyISO =
                fechaLocalISO(new Date());

            /*
            ====================================================
            RANGO EFECTIVO PARA NAVEGACION DESDE LAS TARJETAS

            Los periodos rapidos (1m, 3m, 6m, etc.) no guardan
            fechas en periodo.inicio / periodo.fin. Por eso se
            resuelve aqui el rango real y se envia a la tabla de
            destino. Asi tarjeta y tabla usan exactamente el
            mismo intervalo.
            ====================================================
            */
            const rangoPeriodo =
                obtenerRangoPeriodo(periodo);

            const filtroPeriodo =
                rangoPeriodo.inicio && rangoPeriodo.fin
                    ? {
                        fechaInicio: rangoPeriodo.inicioISO,
                        fechaFin: rangoPeriodo.finISO
                    }
                    : null;

            const etiquetaPeriodoTarjetas =
                obtenerEtiquetaPeriodo(periodo);

            const citasHoy =
                citas.filter(cita => cita.fecha === hoyISO).length;

            const facturacionPeriodo =
                facturasPeriodo.reduce(
                    (total, factura) =>
                        total + Number(factura.total || 0),
                    0
                );

            if(usuario.rol === "Admin"){

                return [
                    {
                        titulo: "Usuarios",
                        valor: usuariosPeriodo.length,
                        icono: <UserCog />,
                        modulo: "usuarios",
                        filtroNavegacion: filtroPeriodo
                            ? {
                                tipo: "periodo",
                                ...filtroPeriodo,
                                etiqueta: `Usuarios · ${etiquetaPeriodoTarjetas}`
                            }
                            : null,
                        tendencia: calcularTendenciaPeriodo(
                            usuarios,
                            "fechaCreacion",
                            periodo
                        ),
                        serie: construirSeriePeriodo(
                            usuarios,
                            "fechaCreacion",
                            periodo
                        ),
                        variante: "verde"
                    },
                    {
                        titulo: "Pacientes",
                        valor: pacientesPeriodo.length,
                        icono: <Users />,
                        modulo: "pacientes",
                        filtroNavegacion: filtroPeriodo
                            ? {
                                tipo: "periodo",
                                ...filtroPeriodo,
                                etiqueta: `Pacientes · ${etiquetaPeriodoTarjetas}`
                            }
                            : null,
                        tendencia: calcularTendenciaPeriodo(
                            pacientes,
                            "fechaRegistro",
                            periodo
                        ),
                        serie: construirSeriePeriodo(
                            pacientes,
                            "fechaRegistro",
                            periodo
                        ),
                        variante: "azul"
                    },
                    {
                        titulo: "Citas",
                        valor: citasPeriodo.length,
                        icono: <CalendarDays />,
                        modulo: "citas",
                        filtroNavegacion: filtroPeriodo
                            ? {
                                tipo: "periodo",
                                ...filtroPeriodo,
                                etiqueta: `Citas · ${etiquetaPeriodoTarjetas}`
                            }
                            : null,
                        tendencia: calcularTendenciaPeriodo(
                            citas,
                            "fecha",
                            periodo
                        ),
                        serie: construirSeriePeriodo(
                            citas,
                            "fecha",
                            periodo
                        ),
                        variante: "verde"
                    },
                    {
                        titulo: "Facturación",
                        valor: formatoMoneda(facturacionPeriodo),
                        icono: <Receipt />,
                        modulo: "facturas",
                        filtroNavegacion: filtroPeriodo
                            ? {
                                tipo: "periodo",
                                ...filtroPeriodo,
                                etiqueta: `Facturación · ${etiquetaPeriodoTarjetas}`
                            }
                            : null,
                        tendencia: calcularTendenciaPeriodo(
                            facturas,
                            "fecha",
                            periodo,
                            factura => factura.total
                        ),
                        serie: construirSeriePeriodo(
                            facturas,
                            "fecha",
                            periodo,
                            factura => factura.total
                        ),
                        variante: "verde"
                    }
                ];

            }

            if(usuario.rol === "Profesional"){

                const citasAtendidas =
                    citas.filter(
                        cita => cita.estado === "ASISTIDA"
                    );

                const idsPacientesAtendidosPeriodo =
                    [
                        ...new Set(
                            citasPeriodo
                                .filter(cita => cita.estado === "ASISTIDA")
                                .map(cita => cita.paciente?.idPaciente)
                                .filter(Boolean)
                        )
                    ];

                const pacientesAtendidosPeriodo =
                    idsPacientesAtendidosPeriodo.length;

                return [
                    {
                        titulo: "Mis citas",
                        valor: citasPeriodo.length,
                        icono: <CalendarDays />,
                        modulo: "citas",
                        filtroNavegacion: filtroPeriodo
                            ? {
                                tipo: "periodo",
                                ...filtroPeriodo,
                                etiqueta: `Mis citas · ${etiquetaPeriodoTarjetas}`
                            }
                            : null,
                        tendencia: calcularTendenciaPeriodo(
                            citas,
                            "fecha",
                            periodo
                        ),
                        serie: construirSeriePeriodo(
                            citas,
                            "fecha",
                            periodo
                        ),
                        variante: "verde"
                    },
                    {
                        titulo: "Pacientes atendidos",
                        valor: pacientesAtendidosPeriodo,
                        icono: <Users />,
                        modulo: "pacientes",
                        filtroNavegacion: {
                            tipo: "idsPacientes",
                            valores: idsPacientesAtendidosPeriodo,
                            etiqueta: `Pacientes atendidos · ${etiquetaPeriodoTarjetas}`
                        },
                        tendencia: calcularTendenciaPeriodo(
                            citasAtendidas,
                            "fecha",
                            periodo
                        ),
                        serie: construirSeriePeriodo(
                            citasAtendidas,
                            "fecha",
                            periodo
                        ),
                        variante: "azul"
                    },
                    {
                        titulo: "Historias clínicas",
                        valor: historiasPeriodo.length,
                        icono: <ClipboardPlus />,
                        modulo: "historias",
                        filtroNavegacion: filtroPeriodo
                            ? {
                                tipo: "periodo",
                                ...filtroPeriodo,
                                etiqueta: `Historias clínicas · ${etiquetaPeriodoTarjetas}`
                            }
                            : null,
                        tendencia: calcularTendenciaPeriodo(
                            historiasProfesional,
                            "fecha",
                            periodo
                        ),
                        serie: construirSeriePeriodo(
                            historiasProfesional,
                            "fecha",
                            periodo
                        ),
                        variante: "verde"
                    },
                    {
                        titulo: "Citas hoy",
                        valor: citasHoy,
                        icono: <CheckCircle2 />,
                        modulo: "citas",
                        filtroNavegacion: {
                            tipo: "fecha",
                            valor: hoyISO,
                            etiqueta: "Citas de hoy"
                        },
                        tendencia: 0,
                        serie: [citasHoy],
                        variante: "verde",
                        textoTendencia: "dato operativo de hoy"
                    }
                ];

            }

            const citasPendientesPeriodo =
                citasPeriodo.filter(
                    cita => cita.estado === "PROGRAMADA"
                );

            const facturasPendientesPeriodo =
                facturasPeriodo.filter(
                    factura => factura.estadoPago === "PENDIENTE"
                );

            return [
                {
                    titulo: "Pacientes",
                    valor: pacientesPeriodo.length,
                    icono: <Users />,
                    modulo: "pacientes",
                    filtroNavegacion: filtroPeriodo
                        ? {
                            tipo: "periodo",
                            ...filtroPeriodo,
                            etiqueta: `Pacientes · ${etiquetaPeriodoTarjetas}`
                        }
                        : null,
                    tendencia: calcularTendenciaPeriodo(
                        pacientes,
                        "fechaRegistro",
                        periodo
                    ),
                    serie: construirSeriePeriodo(
                        pacientes,
                        "fechaRegistro",
                        periodo
                    ),
                    variante: "azul"
                },
                {
                    titulo: "Citas pendientes",
                    valor: citasPendientesPeriodo.length,
                    icono: <CalendarDays />,
                    modulo: "citas",
                    filtroNavegacion: {
                        tipo: "estado",
                        valor: "PROGRAMADA",
                        ...(filtroPeriodo || {}),
                        etiqueta: `Citas pendientes · ${etiquetaPeriodoTarjetas}`
                    },
                    tendencia: calcularTendenciaPeriodo(
                        citas.filter(cita => cita.estado === "PROGRAMADA"),
                        "fecha",
                        periodo
                    ),
                    serie: construirSeriePeriodo(
                        citas.filter(cita => cita.estado === "PROGRAMADA"),
                        "fecha",
                        periodo
                    ),
                    variante: "verde"
                },
                {
                    titulo: "Facturas pendientes",
                    valor: facturasPendientesPeriodo.length,
                    icono: <FileText />,
                    modulo: "facturas",
                    filtroNavegacion: {
                        tipo: "estadoPago",
                        valor: "PENDIENTE",
                        ...(filtroPeriodo || {}),
                        etiqueta: `Facturas pendientes · ${etiquetaPeriodoTarjetas}`
                    },
                    tendencia: calcularTendenciaPeriodo(
                        facturas.filter(factura => factura.estadoPago === "PENDIENTE"),
                        "fecha",
                        periodo
                    ),
                    serie: construirSeriePeriodo(
                        facturas.filter(factura => factura.estadoPago === "PENDIENTE"),
                        "fecha",
                        periodo
                    ),
                    variante: "verde"
                },
                {
                    titulo: "Citas hoy",
                    valor: citasHoy,
                    icono: <CheckCircle2 />,
                    modulo: "citas",
                    filtroNavegacion: {
                        tipo: "fecha",
                        valor: hoyISO,
                        etiqueta: "Citas de hoy"
                    },
                    tendencia: 0,
                    serie: [citasHoy],
                    variante: "verde",
                    textoTendencia: "dato operativo de hoy"
                }
            ];

        },
        [
            datosDashboard,
            usuario.rol,
            periodo,
            citas,
            citasPeriodo,
            pacientes,
            pacientesPeriodo,
            facturas,
            facturasPeriodo,
            usuarios,
            usuariosPeriodo,
            historiasProfesional,
            historiasPeriodo
        ]
    );

    /*
    ========================================================
    ESTADO DE CARGA
    ========================================================
    */

    if(cargando){

        return (
            <section className="dashboard dashboard-loading-shell">
                <div className="dashboard-loading-card">
                    <span className="dashboard-loader" />
                    <strong>Cargando información del consultorio...</strong>
                </div>
            </section>
        );

    }


    if(error || !datosDashboard){

        return (
            <section className="dashboard">
                <div className="dashboard-error-card">
                    <strong>No fue posible cargar el Dashboard</strong>
                    <span>{error}</span>
                </div>
            </section>
        );

    }


    return (
        <section className="dashboard">


            {/*
            ====================================================
            HERO DE BIENVENIDA
            ====================================================
            */}

            <div className="dashboard-hero">

                <div className="dashboard-hero-content">
                    <h1>
                        Bienvenido, {usuario.nombre}
                        <span aria-hidden="true">👋</span>
                    </h1>

                    <p>
                        Resumen del periodo: <strong>{etiquetaPeriodo}</strong>.
                    </p>
                </div>

                <div className="dashboard-hero-actions">

                    <button
                        type="button"
                        className="dashboard-primary-action"
                        onClick={() => onNavegar?.("citas")}
                    >
                        <CalendarPlus size={18} />
                        Nueva cita
                    </button>

                    <button
                        type="button"
                        className="dashboard-secondary-action"
                        onClick={() => onNavegar?.("pacientes")}
                    >
                        <UserPlus size={18} />
                        Nuevo paciente
                    </button>

                </div>

                <img
                    src={logoConsultorio}
                    alt=""
                    className="dashboard-hero-logo"
                    aria-hidden="true"
                />

            </div>


            {/*
            ====================================================
            INDICADORES PRINCIPALES
            ====================================================
            */}

            <div className="dashboard-kpi-grid">
                {
                    tarjetas.map(
                        tarjeta => (
                            <TarjetaIndicador
                                key={tarjeta.titulo}
                                {...tarjeta}
                                onNavegar={onNavegar}
                            />
                        )
                    )
                }
            </div>


            {/*
            ====================================================
            GRÁFICOS Y PRÓXIMAS CITAS
            ====================================================
            */}

            <div
                className="dashboard-main-grid"
                id="dashboard-reportes"
            >

                <DashboardCharts
                    usuario={usuario}
                    citas={citasPeriodo}
                    facturas={facturasPeriodo}
                    periodo={periodo}
                    onFiltrarCitas={estado =>
                        onNavegar?.(
                            "citas",
                            {
                                tipo: "estado",
                                valor: estado.estado,
                                etiqueta: `Citas ${estado.etiqueta.toLowerCase()}`,
                                /*
                                    Los periodos rápidos guardan principalmente
                                    el tipo (1m, 3m, 6m, etc.). Se resuelve el
                                    rango efectivo antes de navegar para que el
                                    gráfico y la tabla de Citas usen exactamente
                                    las mismas fechas.
                                */
                                fechaInicio: obtenerRangoPeriodo(periodo).inicioISO,
                                fechaFin: obtenerRangoPeriodo(periodo).finISO
                            }
                        )
                    }
                    onFiltrarFacturacion={mes =>
                        onNavegar?.(
                            "facturas",
                            {
                                tipo: "mes",
                                anio: mes.anio,
                                mes: mes.numeroMes,
                                etiqueta: `Facturación de ${mes.mes} ${mes.anio}`
                            }
                        )
                    }
                />

                <ProximasCitas
                    citas={proximasCitas}
                    onNavegar={onNavegar}
                />

            </div>


            {/*
            ====================================================
            INFORMACIÓN COMPLEMENTARIA
            ====================================================
            */}

            <div className="dashboard-bottom-grid">

                <ActividadReciente
                    actividades={actividadReciente}
                    onNavegar={onNavegar}
                />

                <AccionesRapidas
                    usuario={usuario}
                    onNavegar={onNavegar}
                />

                <CalendarioDashboard
                    citas={citas}
                    onNavegar={onNavegar}
                />

            </div>


            <button
                type="button"
                className="dashboard-mobile-next"
                onClick={() => onNavegar?.("citas")}
            >
                Ver agenda completa
                <ChevronRight size={17} />
            </button>

        </section>
    );

}

export {
    CONFIG_ESTADOS,
    formatoMoneda,
    obtenerNombreEstado
};

export default Dashboard;
