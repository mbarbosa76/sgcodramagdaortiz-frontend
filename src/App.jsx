/*
============================================================
App.jsx

Sistema de Gestión de Citas Odontológicas

Componente raíz de la aplicación.

Responsabilidades:

- Validar sesión mediante JWT.
- Controlar usuario autenticado.
- Mostrar Login cuando no existe sesión.
- Administrar navegación de módulos.
- Integrar Layout principal.
- Cargar Dashboard y módulos según selección.

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



/*
============================================================
LAYOUT PRINCIPAL

Contiene:

- Navbar.
- Sidebar.
- Área de contenido.

============================================================
*/

import MainLayout from "./layout/MainLayout";



/*
============================================================
PÁGINA DASHBOARD

Pantalla inicial después del login.

============================================================
*/

import Dashboard from "./pages/Dashboard";



/*
============================================================
MÓDULOS DEL SISTEMA

Cada módulo representa una funcionalidad
del consultorio odontológico.

============================================================
*/

import Paciente from "./pages/Paciente";

import Cita from "./pages/Cita";

import Usuario from "./pages/Usuario";

import Profesional from "./pages/Profesional";

import Servicio from "./pages/Servicio";

import HistoriaClinica from "./pages/HistoriaClinica";

import Factura from "./pages/Factura";

import Login from "./pages/Login";



/*
============================================================
SERVICIO DE AUTENTICACIÓN

Permite cerrar la sesión actual.

============================================================
*/

import {
    logout
} from "./services/AuthService";





function App() {



    /*
    ========================================================
    MÓDULO ACTIVO

    Controla qué pantalla se muestra
    dentro del Layout.

    Por defecto:
    Dashboard.

    ========================================================
    */

    const [moduloActivo, setModuloActivo] =
        useState("dashboard");





    /*
    ========================================================
    USUARIO AUTENTICADO

    Guarda la información recibida
    desde Login:

    - Nombre.
    - Apellido.
    - Rol.

    ========================================================
    */

    const [usuarioAutenticado, setUsuarioAutenticado] =
        useState(null);





    /*
    ========================================================
    ESTADO DE VERIFICACIÓN

    Evita mostrar pantallas mientras
    se revisa localStorage.

    ========================================================
    */

    const [verificando, setVerificando] =
        useState(true);





    /*
    ========================================================
    RECUPERAR SESIÓN

    Al iniciar la aplicación revisa:

    - Token JWT.
    - Usuario almacenado.

    ========================================================
    */

    useEffect(() => {


        const token =
            localStorage.getItem("token");


        const usuario =
            localStorage.getItem("usuario");



        if(token && usuario){


            setUsuarioAutenticado(

                JSON.parse(usuario)

            );


        }



        setVerificando(false);



    }, []);






    /*
    ========================================================
    LOGIN EXITOSO

    Recibe desde Login.jsx
    los datos del usuario.

    ========================================================
    */

    const manejarLoginExitoso = (
        usuario
    ) => {


        setUsuarioAutenticado(
            usuario
        );


        /*
        Después del login siempre inicia
        en Dashboard.
        */

        setModuloActivo(
            "dashboard"
        );


    };






    /*
    ========================================================
    CERRAR SESIÓN

    Elimina:

    - Token JWT.
    - Usuario almacenado.

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


    };







    /*
    ========================================================
    CARGA DINÁMICA DE MÓDULOS

    Según la opción seleccionada
    en Sidebar se renderiza
    el componente correspondiente.

    ========================================================
    */

    const renderizarModulo = () => {


        switch(moduloActivo){



            case "dashboard":

                return (

                    <Dashboard

                        usuario={
                            usuarioAutenticado
                        }

                    />

                );





            case "pacientes":

                return <Paciente />;





            case "citas":

                return <Cita />;





            case "usuarios":

                return <Usuario />;





            case "profesionales":

                return <Profesional />;





            case "servicios":

                return <Servicio />;





            case "historias":

                return <HistoriaClinica />;





            case "facturas":

                return <Factura />;





            default:

                return (

                    <Dashboard

                        usuario={
                            usuarioAutenticado
                        }

                    />

                );


        }


    };







    /*
    ========================================================
    VALIDACIÓN INICIAL

    Mientras revisa la sesión
    no muestra contenido.

    ========================================================
    */

    if(verificando){


        return null;


    }






    /*
    ========================================================
    USUARIO NO AUTENTICADO

    Muestra únicamente Login.

    ========================================================
    */

    if(!usuarioAutenticado){


        return (

            <Login

                onLoginExitoso={
                    manejarLoginExitoso
                }

            />

        );


    }






    /*
    ========================================================
    APLICACIÓN PRINCIPAL

    Cuando existe sesión:

    Renderiza Layout completo.

    ========================================================
    */

    return (


        <MainLayout


            usuario={
                usuarioAutenticado
            }


            moduloActivo={
                moduloActivo
            }


            cambiarModulo={
                setModuloActivo
            }


            onLogout={
                manejarLogout
            }


        >


            {
                renderizarModulo()
            }


        </MainLayout>


    );


}



export default App;