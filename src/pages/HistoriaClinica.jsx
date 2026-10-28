/*
============================================================
HistoriaClinica.jsx

Sistema de Gestión de Citas Odontológicas

Módulo:
Historia Clínica

Regla de negocio:

Solo pacientes con citas ASISTIDAS
pueden generar una Historia Clínica.

============================================================
*/


import {

    useEffect,

    useMemo,

    useState

} from "react";



import {

    listarHistorias,

    crearHistoria,

    eliminarHistoria

} from "../services/HistoriaClinicaService";


/*
 * Importa la URL centralizada del backend para permitir
 * el funcionamiento local y el despliegue en la nube.
 */
import { API_BASE_URL } from "../config/api";



import HistoriaClinicaTable from "../components/HistoriaClinicaTable";
import { estaFechaEnRangoISO } from "../utils/dashboardPeriodo";


import "./HistoriaClinica.css";








function HistoriaClinica({
    filtroNavegacion = null,
    onLimpiarFiltro
}) {





    /*
    ========================================================
    ESTADOS PRINCIPALES
    ========================================================
    */





    const [historias, setHistorias] =

        useState([]);




    /*
    Pacientes disponibles para Historia Clínica.

    IMPORTANTE:

    Ya no contiene todos los pacientes.

    Solo pacientes con cita ASISTIDA.

    */

    const [pacientes, setPacientes] =

        useState([]);





    const [profesionales, setProfesionales] =

        useState([]);





    const [profesionalesFiltrados, setProfesionalesFiltrados] =

        useState([]);





    const [citas, setCitas] =

        useState([]);





    const [citasFiltradas, setCitasFiltradas] =

        useState([]);





    const [idHistoriaEditando, setIdHistoriaEditando] =

        useState(null);









    /*
    ========================================================
    OBJETO HISTORIA CLÍNICA
    ========================================================
    */


    const [historia, setHistoria] =

        useState({



            paciente:{

                idPaciente:""

            },



            profesional:{

                idProfesional:""

            },



            cita:{

                idCita:""

            },



            fecha:

                new Date()
                .toISOString()
                .split("T")[0],



            motivoConsulta:"",



            diagnostico:"",



            tratamiento:"",



            observaciones:""



        });









    /*
    ========================================================
    CARGA INICIAL
    ========================================================
    */


    useEffect(() => {


        cargarHistorias();


        cargarPacientesAtendidos();


        cargarProfesionales();


        cargarCitas();



    }, []);









    /*
    ========================================================
    CONFIGURACIÓN JWT
    ========================================================
    */


    const obtenerConfigAuth = () => {


        const token =

            localStorage.getItem("token");



        return {


            headers:{


                Authorization:

                    `Bearer ${token}`


            }


        };


    };









    /*
    ========================================================
    CARGAR HISTORIAS
    ========================================================
    */


    const cargarHistorias = async () => {


        const datos =

            await listarHistorias();



        setHistorias(datos);


    };









    /*
    ========================================================
    CARGAR PACIENTES ATENDIDOS

    NUEVA LÓGICA

    Solo devuelve pacientes con:

    Cita.estado = ASISTIDA

    Endpoint:

    GET /api/historias/pacientes-atendidos

    ========================================================
    */


    const cargarPacientesAtendidos = async () => {


        try {



            const respuesta =

                await fetch(

                    `${API_BASE_URL}/historias/pacientes-atendidos`,

                    obtenerConfigAuth()

                );





            const datos =

                await respuesta.json();





            setPacientes(datos);





        }

        catch(error){



            console.error(

                "Error cargando pacientes atendidos:",

                error

            );


        }


    };









    /*
    ========================================================
    CARGAR PROFESIONALES

    Se mantienen para mostrar
    profesionales relacionados.

    ========================================================
    */


    const cargarProfesionales = async () => {


        try {



            const respuesta =

                await fetch(

                    `${API_BASE_URL}/profesionales`,

                    obtenerConfigAuth()

                );





            const datos =

                await respuesta.json();





            setProfesionales(datos);



        }

        catch(error){



            console.error(

                "Error cargando profesionales:",

                error

            );


        }


    };









    /*
    ========================================================
    CARGAR CITAS

    Luego se filtran por paciente
    y estado ASISTIDA.

    ========================================================
    */


    const cargarCitas = async () => {


        try {



            const respuesta =

                await fetch(

                    `${API_BASE_URL}/citas`,

                    obtenerConfigAuth()

                );





            const datos =

                await respuesta.json();





            setCitas(datos);



        }

        catch(error){



            console.error(

                "Error cargando citas:",

                error

            );


        }


    };

    /*
    ========================================================
    MANEJAR CAMBIOS GENERALES
    ========================================================
    */


    const manejarCambio = (e) => {


        const {

            name,

            value

        } = e.target;




        setHistoria({

            ...historia,

            [name]: value


        });


    };









    /*
    ========================================================
    GUARDAR HISTORIA CLÍNICA
    ========================================================
    */


    const guardar = async () => {


        try {



            const historiaEnviar = {


                ...historia,


                fecha:

                    historia.fecha ||

                    new Date()
                    .toISOString()
                    .split("T")[0]


            };







            /*
            ====================================================
            ACTUALIZAR
            ====================================================
            */


            if(idHistoriaEditando !== null){



                await fetch(

                    `${API_BASE_URL}/historias/${idHistoriaEditando}`,

                    {


                        method:"PUT",


                        headers:{


                            ...obtenerConfigAuth().headers,


                            "Content-Type":

                                "application/json"


                        },


                        body:

                            JSON.stringify(

                                historiaEnviar

                            )


                    }


                );



                alert(

                    "Historia clínica actualizada correctamente"

                );



            }







            /*
            ====================================================
            CREAR
            ====================================================
            */


            else {



                await crearHistoria(

                    historiaEnviar

                );



                alert(

                    "Historia clínica creada correctamente"

                );



            }







            await cargarHistorias();




            setIdHistoriaEditando(null);



        }

        catch(error){



            console.error(

                "Error guardando historia clínica:",

                error

            );



            alert(

                "No fue posible guardar la historia clínica"

            );



        }


    };









    /*
    ========================================================
    ELIMINAR HISTORIA
    ========================================================
    */


    const eliminar = async(id)=>{


        await eliminarHistoria(id);


        await cargarHistorias();


    };









    /*
    ========================================================
    EDITAR HISTORIA
    ========================================================
    */


    const editarHistoria = (

        historiaSeleccionada

    ) => {



        setIdHistoriaEditando(

            historiaSeleccionada.idHistoria

        );







        setHistoria({



            paciente:{

                idPaciente:

                    historiaSeleccionada
                    .paciente
                    .idPaciente

            },





            profesional:{

                idProfesional:

                    historiaSeleccionada
                    .profesional
                    .idProfesional

            },





            cita:{

                idCita:

                    historiaSeleccionada
                    .cita
                    .idCita

            },





            fecha:

                historiaSeleccionada.fecha,





            motivoConsulta:

                historiaSeleccionada
                .motivoConsulta || "",





            diagnostico:

                historiaSeleccionada
                .diagnostico || "",





            tratamiento:

                historiaSeleccionada
                .tratamiento || "",





            observaciones:

                historiaSeleccionada
                .observaciones || ""



        });



    };









    /*
    ========================================================
    CAMBIAR PACIENTE

    NUEVA REGLA:

    Solo se buscan citas ASISTIDAS.

    ========================================================
    */


    const cambiarPaciente = (

        idPaciente

    ) => {



        const citasPaciente =


            citas.filter(


                cita =>



                    cita.paciente?.idPaciente ===

                    Number(idPaciente)



                    &&



                    cita.estado === "ASISTIDA"



            );









        const profesionalesUnicos =


            citasPaciente

            .map(

                cita =>

                    cita.profesional

            )

            .filter(


                (profesional,index,array) =>



                    profesional &&



                    array.findIndex(


                        item =>


                            item.idProfesional ===

                            profesional.idProfesional


                    ) === index



            );









        setCitasFiltradas(

            citasPaciente

        );





        setProfesionalesFiltrados(

            profesionalesUnicos

        );









        setHistoria({


            ...historia,



            paciente:{


                idPaciente:idPaciente


            },



            profesional:{


                idProfesional:""


            },



            cita:{


                idCita:""


            }



        });




    };









    /*
    ========================================================
    CAMBIAR CITA

    Al seleccionar una cita asistida:

    - Guarda la cita.
    - Asigna profesional automáticamente.

    ========================================================
    */


    const cambiarCita = (

        idCita

    ) => {



        const citaSeleccionada =


            citas.find(


                cita =>


                    cita.idCita ===

                    Number(idCita)



            );







        setHistoria({



            ...historia,



            cita:{


                idCita:idCita


            },





            profesional:{



                idProfesional:


                    citaSeleccionada
                    ?.profesional
                    ?.idProfesional || ""



            }



        });



    };

    /*
    ========================================================
    FILTRO RECIBIDO DESDE EL DASHBOARD

    Mantiene sincronizada la tarjeta de Historias clinicas
    con la tabla del modulo usando el mismo rango de fechas.
    ========================================================
    */
    const historiasFiltradasDashboard = useMemo(() => {

        if(!filtroNavegacion) return historias;

        if(filtroNavegacion.tipo === "periodo"){
            return historias.filter(historiaActual => estaFechaEnRangoISO(
                historiaActual.fecha,
                filtroNavegacion.fechaInicio,
                filtroNavegacion.fechaFin
            ));
        }

        if(filtroNavegacion.tipo === "idHistoria"){
            return historias.filter(
                historiaActual => Number(historiaActual.idHistoria) === Number(filtroNavegacion.valor)
            );
        }

        if(filtroNavegacion.tipo === "idPaciente"){
            return historias.filter(
                historiaActual => Number(historiaActual.paciente?.idPaciente) === Number(filtroNavegacion.valor)
            );
        }

        return historias;

    }, [historias, filtroNavegacion]);


    return (

        <section className="historia-container">





            <div className="module-header">


                <span className="module-tag">

                    Módulo Historia Clínica

                </span>



                <h2>

                    Gestión de Historias Clínicas

                </h2>



                <p>

                    Registra la atención clínica de pacientes
                    que ya fueron atendidos en consulta.

                </p>


            </div>









            <div className="historia-form">







                {/* ==================================================
                    PACIENTE

                    SOLO PACIENTES CON CITA ASISTIDA

                    ================================================== */}



                <select


                    value={

                        historia.paciente.idPaciente

                    }



                    onChange={

                        e =>

                        cambiarPaciente(

                            e.target.value

                        )

                    }



                >



                    <option value="">


                        Seleccione paciente atendido


                    </option>





                    {


                        pacientes.map(

                            paciente => (



                                <option


                                    key={

                                        paciente.idPaciente

                                    }



                                    value={

                                        paciente.idPaciente

                                    }



                                >



                                    {paciente.nombre}

                                    {" "}

                                    {paciente.apellido}



                                </option>


                            )


                        )


                    }



                </select>









                {/* ==================================================
                    PROFESIONAL

                    Se carga automáticamente
                    según la cita asistida.

                    ================================================== */}



                <select


                    value={

                        historia.profesional.idProfesional

                    }



                    disabled



                >



                    <option value="">


                        Profesional asignado


                    </option>





                    {


                        profesionalesFiltrados.map(



                            profesional => (



                                <option


                                    key={

                                        profesional.idProfesional

                                    }



                                    value={

                                        profesional.idProfesional

                                    }



                                >



                                    {profesional.nombre}

                                    {" "}

                                    {profesional.apellido}



                                </option>



                            )


                        )


                    }



                </select>









                {/* ==================================================
                    CITA

                    SOLO CITAS ASISTIDAS DEL PACIENTE

                    ================================================== */}



                <select



                    value={

                        historia.cita.idCita

                    }



                    onChange={


                        e =>

                        cambiarCita(

                            e.target.value

                        )


                    }



                >



                    <option value="">


                        Seleccione cita atendida


                    </option>





                    {


                        citasFiltradas.map(



                            cita => (



                                <option


                                    key={

                                        cita.idCita

                                    }



                                    value={

                                        cita.idCita

                                    }



                                >



                                    Cita #

                                    {cita.idCita}



                                    {" - "}



                                    {cita.fecha}



                                </option>



                            )


                        )


                    }



                </select>









                <input


                    name="motivoConsulta"



                    placeholder="Motivo consulta"



                    value={

                        historia.motivoConsulta

                    }



                    onChange={

                        manejarCambio

                    }



                />









                <input


                    name="diagnostico"



                    placeholder="Diagnóstico"



                    value={

                        historia.diagnostico

                    }



                    onChange={

                        manejarCambio

                    }



                />









                <input


                    name="tratamiento"



                    placeholder="Tratamiento"



                    value={

                        historia.tratamiento

                    }



                    onChange={

                        manejarCambio

                    }



                />









                <textarea


                    name="observaciones"



                    placeholder="Observaciones"



                    value={

                        historia.observaciones

                    }



                    onChange={

                        manejarCambio

                    }



                />









                <button


                    onClick={

                        guardar

                    }



                >



                    {


                        idHistoriaEditando !== null



                        ?



                        "Actualizar Historia Clínica"



                        :



                        "Guardar Historia Clínica"



                    }



                </button>







            </div>









            {filtroNavegacion && (
                <div className="module-context-filter">
                    <div>
                        <strong>Filtro desde Dashboard</strong>
                        <span>{filtroNavegacion.etiqueta || "Historias filtradas"}</span>
                    </div>
                    <button type="button" onClick={onLimpiarFiltro}>
                        Quitar filtro
                    </button>
                </div>
            )}


            <HistoriaClinicaTable



                historias={historiasFiltradasDashboard}



                editarHistoria={editarHistoria}



                eliminarHistoria={eliminar}



            />






        </section>


    );

}




export default HistoriaClinica;