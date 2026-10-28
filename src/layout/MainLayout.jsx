/*
============================================================
MainLayout.jsx

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Layout principal del sistema autenticado.

Responsabilidades:

- Mostrar el menú lateral.
- Mostrar la barra superior.
- Mantener el área central de contenido.
- Compartir navegación y periodo del Dashboard.
- Permitir contraer y expandir el menú lateral.
- Garantizar que la información del usuario autenticado
  sea enviada correctamente al Navbar y Sidebar.

============================================================
*/

import {
    useState
} from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "./Layout.css";


function MainLayout({
    usuario,
    moduloActivo,
    cambiarModulo,
    onLogout,
    periodoDashboard,
    onCambiarPeriodo,
    children
}) {


    /*
    ========================================================
    CONTROL DEL ESTADO DEL MENÚ LATERAL

    Permite alternar entre:
    - Vista completa.
    - Vista compacta.

    ========================================================
    */
    const [sidebarContraido, setSidebarContraido] =
        useState(false);



    /*
    ========================================================
    USUARIO AUTENTICADO SEGURO

    Evita errores cuando la información del usuario todavía
    no se encuentra cargada después del login.

    Mantiene la estructura esperada por:
    - Navbar.
    - Sidebar.

    ========================================================
    */
    const usuarioSeguro = usuario || {
        nombre: "",
        apellido: "",
        username: "",
        rol: ""
    };



    return (

        <div
            className={
                sidebarContraido
                    ? "main-layout sidebar-compact"
                    : "main-layout"
            }
        >


            <Sidebar

                moduloActivo={moduloActivo}

                cambiarModulo={cambiarModulo}

                /*
                El Sidebar utiliza el rol para determinar
                qué módulos puede visualizar el usuario.
                */
                rol={usuarioSeguro.rol}

                contraido={sidebarContraido}

            />



            <div className="layout-main">


                <Navbar

                    /*
                    Se envía el usuario autenticado completo.

                    Navbar utiliza:
                    - nombre.
                    - apellido.
                    - rol.

                    Las iniciales del avatar se generan
                    dinámicamente en Navbar.jsx.
                    */
                    usuario={usuarioSeguro}

                    onLogout={onLogout}

                    onNavegar={cambiarModulo}

                    periodoDashboard={periodoDashboard}

                    onCambiarPeriodo={onCambiarPeriodo}


                    sidebarContraido={sidebarContraido}


                    onAlternarSidebar={() =>
                        setSidebarContraido(
                            valor => !valor
                        )
                    }

                />



                <main className="layout-content">

                    {children}

                </main>


            </div>


        </div>

    );

}


export default MainLayout;