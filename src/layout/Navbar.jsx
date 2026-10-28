/*
============================================================
Navbar.jsx

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Barra superior del sistema autenticado.

Responsabilidades:

- Facilitar acceso rápido a los módulos.
- Permitir cambiar el periodo del Dashboard.
- Gestionar el filtro híbrido de periodos rápidos y rango
  personalizado.
- Mostrar notificaciones informativas.
- Mostrar datos del usuario autenticado.
- Permitir cerrar la sesión.

============================================================
*/

import {
    Bell,
    CalendarDays,
    ChevronDown,
    LogOut,
    Menu,
    Search,
    SlidersHorizontal
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    OPCIONES_PERIODO_DASHBOARD,
    obtenerEtiquetaPeriodo
} from "../utils/dashboardPeriodo";

import { buscarGlobal } from "../services/BusquedaGlobalService";


function Navbar({
    usuario,
    onLogout,
    onNavegar,
    periodoDashboard,
    onCambiarPeriodo,
    sidebarContraido,
    onAlternarSidebar
}) {

    const [busqueda, setBusqueda] =
        useState("");

    const [resultadosGlobales, setResultadosGlobales] =
        useState([]);

    const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] =
        useState(false);

    const [mostrarNotificaciones, setMostrarNotificaciones] =
        useState(false);

    const [mostrarPerfil, setMostrarPerfil] =
        useState(false);

    const [mostrarFiltros, setMostrarFiltros] =
        useState(false);

    const [rangoTemporal, setRangoTemporal] =
        useState({
            inicio: periodoDashboard?.inicio || "",
            fin: periodoDashboard?.fin || ""
        });

    const [errorRango, setErrorRango] =
        useState("");


    /*
    ========================================================
    SINCRONIZAR RANGO PERSONALIZADO

    Conserva en el formulario las últimas fechas elegidas,
    incluso cuando el usuario cambia temporalmente a un
    periodo rápido.
    ========================================================
    */

    useEffect(() => {

        setRangoTemporal({
            inicio: periodoDashboard?.inicio || "",
            fin: periodoDashboard?.fin || ""
        });

    }, [periodoDashboard?.inicio, periodoDashboard?.fin]);


    /*
    ========================================================
    MÓDULOS BUSCABLES
    ========================================================
    */

    const modulos = useMemo(
        () => [
            { id: "dashboard", nombre: "Dashboard", roles: ["Admin", "Profesional", "Recepcionista"] },
            { id: "pacientes", nombre: "Pacientes", roles: ["Admin", "Profesional", "Recepcionista"] },
            { id: "citas", nombre: "Citas", roles: ["Admin", "Profesional", "Recepcionista"] },
            { id: "usuarios", nombre: "Usuarios", roles: ["Admin"] },
            { id: "profesionales", nombre: "Profesionales", roles: ["Admin"] },
            { id: "historias", nombre: "Historia Clínica", roles: ["Admin", "Profesional"] },
            { id: "servicios", nombre: "Servicios", roles: ["Admin", "Profesional"] },
            { id: "facturas", nombre: "Facturación", roles: ["Admin", "Recepcionista"] }
        ],
        []
    );


    const modulosPermitidos =
        modulos.filter(
            modulo => modulo.roles.includes(usuario.rol)
        );


    /*
    ========================================================
    NAVEGACIÓN MEDIANTE BÚSQUEDA
    ========================================================
    */

    const manejarBusqueda = async (event) => {

        event.preventDefault();

        if (!busqueda.trim()) return;

        const resultados = await buscarGlobal(busqueda);
        setResultadosGlobales(resultados);
        setMostrarResultadosBusqueda(true);
    };


    /*
    ========================================================
    FILTRO HÍBRIDO DEL DASHBOARD
    ========================================================
    */

    const tipoPeriodo =
        periodoDashboard?.tipo || "todo";

    const textoPeriodo =
        obtenerEtiquetaPeriodo(periodoDashboard);


    const eliminarFiltroPeriodo = () => {
        onCambiarPeriodo({
            tipo: "todo",
            inicio: "",
            fin: ""
        });
        setMostrarFiltros(false);
    };


    const seleccionarPeriodoRapido = (
        valor,
        cerrarPopover = true
    ) => {

        setErrorRango("");

        if(valor === "personalizado"){

            onCambiarPeriodo({
                ...periodoDashboard,
                tipo: "personalizado"
            });

            setMostrarFiltros(true);
            return;

        }

        onCambiarPeriodo({
            ...periodoDashboard,
            tipo: valor
        });

        if(cerrarPopover){
            setMostrarFiltros(false);
        }

    };


    const aplicarRangoPersonalizado = () => {

        if(!rangoTemporal.inicio || !rangoTemporal.fin){
            setErrorRango("Selecciona la fecha inicial y la fecha final.");
            return;
        }

        if(rangoTemporal.inicio > rangoTemporal.fin){
            setErrorRango("La fecha inicial no puede ser posterior a la fecha final.");
            return;
        }

        onCambiarPeriodo({
            tipo: "personalizado",
            inicio: rangoTemporal.inicio,
            fin: rangoTemporal.fin
        });

        setErrorRango("");
        setMostrarFiltros(false);

    };


    /*
    ========================================================
    INICIALES DEL USUARIO AUTENTICADO

    Genera las iniciales mostradas en el avatar del perfil.

    Ejemplo:
    Miguel Ángel Barbosa

    Resultado:
    MB

    La generación se realiza directamente con los datos del
    usuario autenticado para evitar mostrar valores antiguos
    almacenados en el navegador.
    ========================================================
    */
    const iniciales =
        usuario
            ? `${usuario.nombre?.charAt(0) || "U"}${usuario.apellido?.charAt(0) || ""}`
                .toUpperCase()
            : "U";


    return (
        <header className="navbar">

            <div className="navbar-left">

                <button
                    type="button"
                    className="navbar-icon-button navbar-menu-button"
                    onClick={onAlternarSidebar}
                    aria-label={
                        sidebarContraido
                            ? "Expandir menú lateral"
                            : "Contraer menú lateral"
                    }
                    aria-expanded={!sidebarContraido}
                >
                    <Menu size={21} />
                </button>

                <form
                    className="navbar-search"
                    onSubmit={manejarBusqueda}
                >

                    <Search size={18} />

                    <input
                        type="search"
                        value={busqueda}
                        onChange={async event => {
                            const valor = event.target.value;
                            setBusqueda(valor);
                            if (valor.trim().length >= 3) {
                                setResultadosGlobales(await buscarGlobal(valor));
                                setMostrarResultadosBusqueda(true);
                            } else {
                                setMostrarResultadosBusqueda(false);
                            }
                        }}
                        placeholder="Buscar en todo el sistema..."
                        aria-label="Buscar global"
                    />

                    {mostrarResultadosBusqueda && resultadosGlobales.length > 0 && (
                        <div className="navbar-search-results">
                            {resultadosGlobales.map((resultado, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        const destino = resultado.tipo;
                                        const mapa = {
                                            pacientes: 'pacientes',
                                            citas: 'citas',
                                            profesionales: 'profesionales',
                                            servicios: 'servicios',
                                            usuarios: 'usuarios',
                                            historias: 'historias'
                                        };
                                        if (mapa[destino]) onNavegar(mapa[destino]);
                                        setMostrarResultadosBusqueda(false);
                                    }}
                                >
                                    <strong>{resultado.tipo}</strong> - {Object.values(resultado.item).slice(0,2).join(' ')}
                                </button>
                            ))}
                        </div>
                    )}

                </form>

            </div>

            <div className="navbar-actions">

                <div className="navbar-period-wrapper">

                    <label className="navbar-period-control">
                        <CalendarDays size={18} />

                        <select
                            value={tipoPeriodo}
                            onChange={event =>
                                seleccionarPeriodoRapido(
                                    event.target.value,
                                    event.target.value !== "personalizado"
                                )
                            }
                            aria-label="Periodo del Dashboard"
                        >
                            {
                                OPCIONES_PERIODO_DASHBOARD.map(
                                    opcion => (
                                        <option
                                            key={opcion.valor}
                                            value={opcion.valor}
                                        >
                                            {opcion.etiqueta}
                                        </option>
                                    )
                                )
                            }
                        </select>

                        <ChevronDown size={16} />
                    </label>

                </div>

                <div className="navbar-popover-wrapper">

                    <button
                        type="button"
                        className={
                            mostrarFiltros
                                ? "navbar-filter-button active"
                                : "navbar-filter-button"
                        }
                        onClick={() => setMostrarFiltros(valor => !valor)}
                    >
                        <SlidersHorizontal size={17} />
                        Filtros
                    </button>

                    {
                        mostrarFiltros &&
                        <div className="navbar-popover navbar-filter-popover">

                            <div className="navbar-filter-heading">
                                <strong>Periodo de análisis</strong>
                                <span>Actualmente: {textoPeriodo}</span>
                            </div>

                            <div className="navbar-filter-options">
                                {
                                    OPCIONES_PERIODO_DASHBOARD
                                        .filter(opcion => opcion.valor !== "personalizado")
                                        .map(
                                            opcion => (
                                                <button
                                                    key={opcion.valor}
                                                    type="button"
                                                    className={
                                                        tipoPeriodo === opcion.valor
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        seleccionarPeriodoRapido(opcion.valor)
                                                    }
                                                >
                                                    {opcion.etiquetaCorta}
                                                </button>
                                            )
                                        )
                                }
                            </div>

                            <div className="navbar-custom-period">

                                <div className="navbar-custom-period-title">
                                    <CalendarDays size={15} />
                                    <strong>Personalizado</strong>
                                </div>

                                <div className="navbar-custom-period-grid">
                                    <label>
                                        <span>Desde</span>
                                        <input
                                            type="date"
                                            value={rangoTemporal.inicio}
                                            onChange={event => {
                                                setRangoTemporal(valor => ({
                                                    ...valor,
                                                    inicio: event.target.value
                                                }));
                                                setErrorRango("");
                                            }}
                                        />
                                    </label>

                                    <label>
                                        <span>Hasta</span>
                                        <input
                                            type="date"
                                            value={rangoTemporal.fin}
                                            onChange={event => {
                                                setRangoTemporal(valor => ({
                                                    ...valor,
                                                    fin: event.target.value
                                                }));
                                                setErrorRango("");
                                            }}
                                        />
                                    </label>
                                </div>

                                {
                                    errorRango &&
                                    <span className="navbar-custom-period-error">
                                        {errorRango}
                                    </span>
                                }

                                <button
                                    type="button"
                                    className={
                                        tipoPeriodo === "personalizado"
                                            ? "navbar-apply-period active"
                                            : "navbar-apply-period"
                                    }
                                    onClick={aplicarRangoPersonalizado}
                                >
                                    Aplicar rango
                                </button>

                            </div>

                        </div>
                    }

                </div>

                <div className="navbar-popover-wrapper">

                    <button
                        type="button"
                        className="navbar-icon-button notification-button"
                        onClick={() => setMostrarNotificaciones(valor => !valor)}
                        aria-label="Notificaciones"
                    >
                        <Bell size={20} />
                        <span className="notification-dot" />
                    </button>

                    {
                        mostrarNotificaciones &&
                        <div className="navbar-popover notification-popover">
                            <strong>Centro de notificaciones</strong>
                            <span>
                                Revisa las próximas citas y novedades desde el Dashboard.
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    onNavegar("dashboard");
                                    setMostrarNotificaciones(false);
                                }}
                            >
                                Ir al Dashboard
                            </button>
                        </div>
                    }

                </div>

                <div className="navbar-profile-wrapper">

                    <button
                        type="button"
                        className="navbar-profile"
                        onClick={() => setMostrarPerfil(valor => !valor)}
                    >

                        <span className="navbar-avatar">
                            {iniciales}
                        </span>

                        <span className="navbar-profile-copy">
                            <strong>
                                {usuario.nombre}
                                {usuario.apellido ? ` ${usuario.apellido}` : ""}
                            </strong>
                            <small>{usuario.rol}</small>
                        </span>

                        <ChevronDown size={16} />

                    </button>

                    {
                        mostrarPerfil &&
                        <div className="navbar-popover profile-popover">

                            <div>
                                <strong>
                                    {usuario.nombre}
                                    {usuario.apellido ? ` ${usuario.apellido}` : ""}
                                </strong>
                                <span>{usuario.rol}</span>
                            </div>

                            <button
                                type="button"
                                onClick={onLogout}
                            >
                                <LogOut size={17} />
                                Cerrar sesión
                            </button>

                        </div>
                    }

                </div>

            </div>

        </header>
    );

}

export default Navbar;
