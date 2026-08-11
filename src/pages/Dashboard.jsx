/*
============================================================
Dashboard.jsx

Sistema de Gestión de Citas Odontológicas

Dashboard principal del sistema.

Funciones:

- Identificar el rol del usuario autenticado.
- Consultar indicadores reales al backend.
- Mostrar información según permisos.

Roles:

ADMIN:
- Indicadores globales.

PROFESIONAL:
- Información propia.

RECEPCIONISTA:
- Información operativa.

============================================================
*/

import DashboardCharts from "../components/DashboardCharts";

import {
    useEffect,
    useState
} from "react";

import "./Dashboard.css";

import {

    Users,

    CalendarDays,

    Receipt,

    ClipboardPlus,

    UserCog,

    Stethoscope

} from "lucide-react";



import {

    obtenerDashboardAdmin,

    obtenerDashboardProfesional,

    obtenerDashboardRecepcionista

} from "../services/DashboardService";





function Dashboard({

    usuario

}) {



    /*
    ========================================================
    ESTADO DE INDICADORES

    Guarda la información recibida
    desde Spring Boot.

    ========================================================
    */


    const [datosDashboard, setDatosDashboard] =

        useState(null);





    /*
    ========================================================
    CARGAR DASHBOARD SEGÚN ROL

    Ejecuta una consulta diferente
    dependiendo del usuario autenticado.

    ========================================================
    */


    useEffect(() => {


        const cargarDashboard = async () => {


            try {



                let respuesta;



                if(usuario.rol === "Admin"){



                    respuesta =

                        await obtenerDashboardAdmin();



                }


                else if(usuario.rol === "Profesional"){



                    respuesta =

                        await obtenerDashboardProfesional();



                }


                else if(usuario.rol === "Recepcionista"){



                    respuesta =

                        await obtenerDashboardRecepcionista();



                }



                setDatosDashboard(

                    respuesta.data

                );



            }

            catch(error){


                console.error(

                    "Error cargando dashboard:",

                    error

                );


            }


        };



        cargarDashboard();



    },[usuario]);








    /*
    ========================================================
    MENSAJE DE CARGA

    ========================================================
    */


    if(!datosDashboard){


        return (

            <div className="dashboard-loading">

                Cargando información...

            </div>

        );


    }






    /*
    ========================================================
    TARJETAS ADMINISTRADOR

    ========================================================
    */


    const tarjetasAdmin = [



        {

            titulo:"Usuarios",

            valor:
            datosDashboard.usuarios,

            icono:<UserCog />

        },


        {

            titulo:"Pacientes",

            valor:
            datosDashboard.pacientes,

            icono:<Users />

        },


        {

            titulo:"Citas",

            valor:
            datosDashboard.citas,

            icono:<CalendarDays />

        },


        {

            titulo:"Facturación",

            valor:
            new Intl.NumberFormat(
                "es-CO",
                {
                    style:"currency",
                    currency:"COP"
                }
            ).format(
                datosDashboard.facturacion
),

            icono:<Receipt />

        }



    ];






    /*
    ========================================================
    TARJETAS PROFESIONAL

    ========================================================
    */


    const tarjetasProfesional = [



        {

            titulo:"Mis citas",

            valor:
            datosDashboard.misCitas,

            icono:<CalendarDays />

        },


        {

            titulo:"Pacientes atendidos",

            valor:
            datosDashboard.misPacientes,

            icono:<Users />

        },


        {

            titulo:"Historias clínicas",

            valor:
            datosDashboard.misHistorias,

            icono:<ClipboardPlus />

        }



    ];







    /*
    ========================================================
    TARJETAS RECEPCIONISTA

    ========================================================
    */


    const tarjetasRecepcion = [



        {

            titulo:"Pacientes",

            valor:
            datosDashboard.pacientes,

            icono:<Users />

        },


        {

            titulo:"Citas pendientes",

            valor:
            datosDashboard.citasPendientes,

            icono:<CalendarDays />

        },


        {

            titulo:"Facturas pendientes",

            valor:
            datosDashboard.facturasPendientes,

            icono:<Receipt />

        }



    ];






    let tarjetas = [];



    if(usuario.rol === "Admin"){


        tarjetas = tarjetasAdmin;


    }


    else if(usuario.rol === "Profesional"){


        tarjetas = tarjetasProfesional;


    }


    else{


        tarjetas = tarjetasRecepcion;


    }







    return (



        <section className="dashboard">





            <div className="dashboard-welcome">


                <h2>

                    Bienvenido,

                    {" "}

                    {usuario.nombre}

                </h2>



                <p>

                    Rol:

                    {" "}

                    <strong>

                        {usuario.rol}

                    </strong>

                </p>



            </div>








            <h3>

                Indicadores principales

            </h3>







            <div className="dashboard-indicators">



                {

                    tarjetas.map(

                        tarjeta => (



                            <div

                                className="indicator-card"

                                key={
                                    tarjeta.titulo
                                }

                            >



                                <div className="indicator-icon">


                                    {

                                        tarjeta.icono

                                    }


                                </div>



                                <div>


                                    <h4>

                                        {
                                            tarjeta.titulo
                                        }

                                    </h4>



                                    <p>

                                        {
                                            tarjeta.valor
                                        }

                                    </p>


                                </div>



                            </div>



                        )


                    )

                }



            </div>


        <DashboardCharts

        usuario={usuario}

        />


        </section>



    );


}



export default Dashboard;