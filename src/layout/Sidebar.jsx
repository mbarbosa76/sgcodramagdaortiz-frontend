/*
============================================================
Sidebar.jsx

Sistema de Gestión de Citas Odontológicas

Componente:
Menú lateral principal del sistema.

Responsabilidades:

- Mostrar módulos disponibles.
- Filtrar opciones según rol autenticado.
- Controlar navegación interna.

Roles soportados:

- Admin.
- Profesional.
- Recepcionista.

============================================================
*/


import {

    LayoutDashboard,

    Users,

    CalendarDays,

    UserCog,

    Stethoscope,

    Wrench,

    ClipboardPlus,

    Receipt

} from "lucide-react";






/*
============================================================
COMPONENTE SIDEBAR

Props:

moduloActivo:
Módulo actualmente seleccionado.

cambiarModulo:
Función para cambiar la vista.

rol:
Rol del usuario autenticado.

============================================================
*/


function Sidebar({

    moduloActivo,

    cambiarModulo,

    rol

}) {





    /*
    ========================================================
    CONFIGURACIÓN DE MÓDULOS

    Cada módulo define:

    id:
    Identificador interno.

    nombre:
    Texto mostrado.

    icono:
    Representación visual.

    roles:
    Usuarios autorizados para verlo.

    ========================================================
    */


    const opciones = [



        {

            id:"dashboard",

            nombre:"Dashboard",

            icono:<LayoutDashboard />,

            roles:[

                "Admin",

                "Profesional",

                "Recepcionista"

            ]

        },





        {

            id:"pacientes",

            nombre:"Pacientes",

            icono:<Users />,

            roles:[

                "Admin",

                "Profesional",

                "Recepcionista"

            ]

        },





        {

            id:"citas",

            nombre:"Citas",

            icono:<CalendarDays />,

            roles:[

                "Admin",

                "Profesional",

                "Recepcionista"

            ]

        },





        {

            id:"usuarios",

            nombre:"Usuarios",

            icono:<UserCog />,

            roles:[

                "Admin"

            ]

        },





        {

            id:"profesionales",

            nombre:"Profesionales",

            icono:<Stethoscope />,

            roles:[

                "Admin"

            ]

        },





        {

            id:"historias",

            nombre:"Historia Clínica",

            icono:<ClipboardPlus />,

            roles:[

                "Admin",

                "Profesional"

            ]

        },





        {

            id:"servicios",

            nombre:"Servicios",

            icono:<Wrench />,

            roles:[

                "Admin",

                "Profesional"

            ]

        },





        {

            id:"facturas",

            nombre:"Facturación",

            icono:<Receipt />,

            roles:[

                "Admin",

                "Recepcionista"

            ]

        }



    ];







    /*
    ========================================================
    FILTRADO POR ROL

    Solo aparecen módulos permitidos
    para el usuario autenticado.

    Ejemplo:

    Admin:
    Todos los módulos.

    Profesional:
    Módulos clínicos.

    Recepcionista:
    Módulos administrativos operativos.

    ========================================================
    */


    const opcionesPermitidas =

        opciones.filter(

            opcion =>

                opcion.roles.includes(rol)

        );







    return (


        <aside className="sidebar">



            <div className="sidebar-title">

                MENÚ PRINCIPAL

            </div>






            {

                opcionesPermitidas.map(


                    opcion => (



                        <button


                            key={opcion.id}



                            className={


                                moduloActivo === opcion.id

                                ?

                                "sidebar-item active"

                                :

                                "sidebar-item"


                            }





                            onClick={

                                () =>

                                cambiarModulo(

                                    opcion.id

                                )

                            }



                        >



                            {

                                opcion.icono

                            }



                            <span>

                                {

                                    opcion.nombre

                                }

                            </span>



                        </button>


                    )


                )


            }




        </aside>


    );


}



export default Sidebar;