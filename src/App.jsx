/*
============================================================
App.jsx

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Componente raíz de la aplicación.

Responsabilidades:

- Validar la sesión mediante JWT.
- Controlar el usuario autenticado.
- Administrar la navegación interna por módulos.
- Mantener el periodo seleccionado del Dashboard.
- Integrar el Layout principal.
- Renderizar los módulos según la opción seleccionada.

Arquitectura:

Login
 |
App.jsx
 |
MainLayout
 |
Dashboard / Módulos

============================================================
*/

import {
    useEffect,
    useState
} from "react";

import "./App.css";

import {
    crearFiltroPeriodoInicial
} from "./utils/dashboardPeriodo";


/*
============================================================
LAYOUT PRINCIPAL
============================================================
*/

import MainLayout from "./layout/MainLayout";


/*
============================================================
MÓDULOS DEL SISTEMA
============================================================
*/

import Dashboard from "./pages/Dashboard";
import Paciente from "./pages/Paciente";
import Cita from "./pages/Cita";
import Usuario from "./pages/Usuario";
import Profesional from "./pages/Profesional";
import Servicio from "./pages/Servicio";
import HistoriaClinica from "./pages/HistoriaClinica";
import Factura from "./pages/Factura";
import Login from "./pages/Login";

/* Estándar visual único para todas las tablas. */
import "./styles/DataTable.css";


/*
============================================================
SERVICIO DE AUTENTICACIÓN
============================================================
*/

import {
    logout
} from "./services/AuthService";


function App() {


    /*
    ========================================================
    MÓDULO ACTIVO

    Controla la pantalla que se muestra dentro del Layout.
    El módulo inicial es Dashboard.
    ========================================================
    */

    const [moduloActivo, setModuloActivo] =
        useState("dashboard");


    /*
    ========================================================
    CONTEXTO DE NAVEGACIÓN

    Guarda un filtro opcional cuando el usuario llega a un
    módulo desde una interacción del Dashboard.

    Ejemplos:

    - Estado ASISTIDA -> módulo Citas.
    - Fecha 20/08/2026 -> módulo Citas.
    - Mayo/2026 -> módulo Facturación.
    - Paciente específico -> módulo Pacientes.

    El filtro se limpia automáticamente cuando la navegación
    se realiza desde Sidebar/Navbar de forma normal.
    ========================================================
    */

    const [filtroNavegacion, setFiltroNavegacion] =
        useState(null);


    /*
    ========================================================
    USUARIO AUTENTICADO

    Contiene los datos obtenidos durante el inicio de sesión.
    ========================================================
    */

    const [usuarioAutenticado, setUsuarioAutenticado] =
        useState(null);


    /*
    ========================================================
    VERIFICACIÓN DE SESIÓN

    Evita renderizar contenido antes de revisar localStorage.
    ========================================================
    */

    const [verificando, setVerificando] =
        useState(true);


    /*
    ========================================================
    PERIODO DEL DASHBOARD

    El filtro híbrido conserva en un solo estado:

    - El periodo rápido seleccionado.
    - La fecha inicial personalizada.
    - La fecha final personalizada.

    El estado se mantiene en App.jsx para compartirlo entre
    Navbar y Dashboard sin modificar la navegación existente.
    ========================================================
    */

    const [periodoDashboard, setPeriodoDashboard] =
        useState(() => crearFiltroPeriodoInicial());


    /*
    ========================================================
    RECUPERAR SESIÓN
    ========================================================
    */

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const usuario =
            localStorage.getItem("usuario");

        if(token && usuario){

            try {

                setUsuarioAutenticado(
                    JSON.parse(usuario)
                );

            }
            catch(error){

                console.error(
                    "No fue posible recuperar la sesión almacenada:",
                    error
                );

                logout();

            }

        }

        setVerificando(false);

    }, []);


    /*
    ========================================================
    LOGIN EXITOSO
    ========================================================
    */

    const manejarLoginExitoso = (
        usuario
    ) => {

        setUsuarioAutenticado(
            usuario
        );

        setModuloActivo(
            "dashboard"
        );

        setPeriodoDashboard(
            crearFiltroPeriodoInicial()
        );

        setFiltroNavegacion(
            null
        );

    };


    /*
    ========================================================
    CERRAR SESIÓN
    ========================================================
    */

    const manejarLogout = () => {

        logout();

        setUsuarioAutenticado(
            null
        );

        setModuloActivo(
            "dashboard"
        );

        setPeriodoDashboard(
            crearFiltroPeriodoInicial()
        );

        setFiltroNavegacion(
            null
        );

    };


    /*
    ========================================================
    NAVEGACIÓN CON CONTEXTO OPCIONAL

    Permite conservar la arquitectura existente sin React
    Router y, al mismo tiempo, transportar un filtro desde
    el Dashboard hasta el módulo de destino.

    La firma se mantiene compatible con las llamadas
    anteriores: manejarNavegacion("citas") sigue funcionando.
    ========================================================
    */

    const manejarNavegacion = (
        modulo,
        filtro = null
    ) => {

        setModuloActivo(
            modulo
        );

        setFiltroNavegacion(
            filtro
        );

    };


    /*
    ========================================================
    CARGA DINÁMICA DE MÓDULOS

    Se conserva el patrón de navegación interna existente.
    No se incorpora React Router para evitar alterar la
    arquitectura actual del proyecto.
    ========================================================
    */

    const renderizarModulo = () => {

        switch(moduloActivo){

            case "dashboard":

                return (
                    <Dashboard
                        usuario={usuarioAutenticado}
                        onNavegar={manejarNavegacion}
                        periodo={periodoDashboard}
                    />
                );

            case "pacientes":

                return (
                    <Paciente
                        filtroNavegacion={filtroNavegacion}
                        onLimpiarFiltro={() => setFiltroNavegacion(null)}
                        periodo={periodoDashboard}
                    />
                );

            case "citas":

                return (
                    <Cita
                        filtroNavegacion={filtroNavegacion}
                        onLimpiarFiltro={() => setFiltroNavegacion(null)}
                    periodo={periodoDashboard}
                    />
                );

            case "usuarios":

                return (
                    <Usuario
                        filtroNavegacion={filtroNavegacion}
                        onLimpiarFiltro={() => setFiltroNavegacion(null)}
                    />
                );

            case "profesionales":

                return <Profesional />;

            case "servicios":

                return <Servicio />;

            case "historias":

                return (
                    <HistoriaClinica
                        filtroNavegacion={filtroNavegacion}
                        onLimpiarFiltro={() => setFiltroNavegacion(null)}
                    />
                );

            case "facturas":

                return (
                    <Factura
                        filtroNavegacion={filtroNavegacion}
                        onLimpiarFiltro={() => setFiltroNavegacion(null)}
                    />
                );

            default:

                return (
                    <Dashboard
                        usuario={usuarioAutenticado}
                        onNavegar={manejarNavegacion}
                        periodo={periodoDashboard}
                    />
                );

        }

    };


    /*
    ========================================================
    VALIDACIÓN INICIAL
    ========================================================
    */

    if(verificando){

        return null;

    }


    /*
    ========================================================
    USUARIO NO AUTENTICADO
    ========================================================
    */

    if(!usuarioAutenticado){

        return (
            <Login
                onLoginExitoso={manejarLoginExitoso}
            />
        );

    }


    /*
    ========================================================
    APLICACIÓN PRINCIPAL
    ========================================================
    */

    return (
        <MainLayout
            usuario={usuarioAutenticado}
            moduloActivo={moduloActivo}
            cambiarModulo={manejarNavegacion}
            onLogout={manejarLogout}
            periodoDashboard={periodoDashboard}
            onCambiarPeriodo={setPeriodoDashboard}
        >

            {
                renderizarModulo()
            }

        </MainLayout>
    );

}

export default App;
