/*
============================================================
Sidebar.jsx

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Componente:
Menú lateral principal del sistema.

Responsabilidades:

- Mostrar identidad visual del consultorio.
- Mostrar módulos disponibles.
- Filtrar opciones según el rol autenticado.
- Controlar la navegación interna.
- Mantener la arquitectura de permisos existente.

Roles soportados:

- Admin.
- Profesional.
- Recepcionista.

============================================================
*/

import {
    CalendarDays,
    ClipboardPlus,
    LayoutDashboard,
    Receipt,
    Stethoscope,
    UserCog,
    Users,
    Wrench
} from "lucide-react";


function Sidebar({
    moduloActivo,
    cambiarModulo,
    rol,
    contraido = false
}) {


    /*
    ========================================================
    CONFIGURACIÓN DE MÓDULOS

    Se conserva la misma matriz de permisos utilizada por
    el Sidebar original para no alterar el comportamiento
    funcional del sistema.
    ========================================================
    */

    const opciones = [
        {
            id: "dashboard",
            nombre: "Dashboard",
            icono: <LayoutDashboard />,
            roles: ["Admin", "Profesional", "Recepcionista"]
        },
        {
            id: "pacientes",
            nombre: "Pacientes",
            icono: <Users />,
            roles: ["Admin", "Profesional", "Recepcionista"]
        },
        {
            id: "citas",
            nombre: "Citas",
            icono: <CalendarDays />,
            roles: ["Admin", "Profesional", "Recepcionista"]
        },
        {
            id: "usuarios",
            nombre: "Usuarios",
            icono: <UserCog />,
            roles: ["Admin"]
        },
        {
            id: "profesionales",
            nombre: "Profesionales",
            icono: <Stethoscope />,
            roles: ["Admin"]
        },
        {
            id: "historias",
            nombre: "Historia Clínica",
            icono: <ClipboardPlus />,
            roles: ["Admin", "Profesional"]
        },
        {
            id: "servicios",
            nombre: "Servicios",
            icono: <Wrench />,
            roles: ["Admin", "Profesional"]
        },
        {
            id: "facturas",
            nombre: "Facturación",
            icono: <Receipt />,
            roles: ["Admin", "Recepcionista"]
        }
    ];


    /*
    ========================================================
    FILTRADO POR ROL
    ========================================================
    */

    const opcionesPermitidas =
        opciones.filter(
            opcion => opcion.roles.includes(rol)
        );


    /*
    ========================================================
    ACCESO DESTACADO INFERIOR

    El diseño anterior apuntaba a "Reportes", módulo que no
    existe todavía. Para no mostrar una acción sin destino real:

    - Admin y Recepcionista acceden a Facturación.
    - Profesional accede directamente a su Agenda de citas.
    ========================================================
    */
    const accesoDestacado =
        ["Admin", "Recepcionista"].includes(rol)
            ? {
                modulo: "facturas",
                titulo: "¡Controla tu facturación!",
                descripcion: "Consulta las facturas registradas y su información.",
                boton: "Ver facturas",
                icono: <Receipt size={20} />
            }
            : {
                modulo: "citas",
                titulo: "¡Revisa tu agenda!",
                descripcion: "Consulta las citas programadas y su estado actual.",
                boton: "Ver agenda",
                icono: <CalendarDays size={20} />
            };


    return (
        <aside
            className={
                contraido
                    ? "sidebar compact"
                    : "sidebar"
            }
        >

            <div className="sidebar-brand">

                <div className="sidebar-brand-icon" aria-hidden="true">
                    🦷
                </div>

                <div className="sidebar-brand-copy">
                    <strong>
                        Sistema de Gestión
                        <br />
                        de Citas Odontológicas
                    </strong>

                    <span>
                        Consultorio Odontológico
                        <br />
                        Dra. Magda Ortiz
                    </span>
                </div>

            </div>

            <nav className="sidebar-navigation" aria-label="Menú principal">

                {
                    opcionesPermitidas.map(
                        opcion => (
                            <button
                                key={opcion.id}
                                type="button"
                                className={
                                    moduloActivo === opcion.id
                                        ? "sidebar-item active"
                                        : "sidebar-item"
                                }
                                onClick={() => cambiarModulo(opcion.id)}
                                title={opcion.nombre}
                            >

                                <span className="sidebar-item-icon">
                                    {opcion.icono}
                                </span>

                                <span className="sidebar-item-text">
                                    {opcion.nombre}
                                </span>

                            </button>
                        )
                    )
                }

            </nav>

            <div className="sidebar-spacer" />

            <div className="sidebar-decoration" aria-hidden="true">
                <span>✦</span>
                <span className="sidebar-decoration-tooth">🦷</span>
                <span>✦</span>
            </div>

            <div className="sidebar-insight">

                <div className="sidebar-insight-icon">
                    {accesoDestacado.icono}
                </div>

                <div className="sidebar-insight-copy">
                    <strong>{accesoDestacado.titulo}</strong>
                    <span>{accesoDestacado.descripcion}</span>
                </div>

                <button
                    type="button"
                    onClick={() => cambiarModulo(accesoDestacado.modulo)}
                >
                    {accesoDestacado.icono}
                    {accesoDestacado.boton}
                </button>

            </div>

        </aside>
    );

}

export default Sidebar;
