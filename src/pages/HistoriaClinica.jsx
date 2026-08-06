/*
============================================================
HistoriaClinica.jsx
Sistema de Gestión de Citas Odontológicas

Módulo:
Historia Clínica

Funciones:
- Registrar atención odontológica.
- Relacionar paciente.
- Relacionar profesional.
- Relacionar cita.
- Consultar historias clínicas.

============================================================
*/


import {
    useEffect,
    useState
} from "react";


import {
    listarHistorias,
    crearHistoria,
    eliminarHistoria
} from "../services/HistoriaClinicaService";


import HistoriaClinicaTable from "../components/HistoriaClinicaTable";

import "./HistoriaClinica.css";



function HistoriaClinica() {


    const [historias, setHistorias] = useState([]);


    const [pacientes, setPacientes] = useState([]);


    const [profesionales, setProfesionales] = useState([]);

    const [profesionalesFiltrados, setProfesionalesFiltrados] =
    useState([]);


    const [citas, setCitas] = useState([]);

    const [idHistoriaEditando, setIdHistoriaEditando] = useState(null);

    const [citasFiltradas, setCitasFiltradas] = useState([]);

    const [historia, setHistoria] = useState({

        paciente: {
            idPaciente: ""
        },

        profesional: {
            idProfesional: ""
        },

        cita: {
            idCita: ""
        },

        fecha: new Date().toISOString().split("T")[0],

        motivoConsulta: "",

        diagnostico: "",

        tratamiento: "",

        observaciones: ""

    });



    useEffect(() => {

        cargarHistorias();

        cargarPacientes();

        cargarProfesionales();

        cargarCitas();

    }, []);




    const obtenerConfigAuth = () => {

        const token =
            localStorage.getItem("token");


        return {

            headers: {

                Authorization:
                    `Bearer ${token}`

            }

        };

    };




    const cargarHistorias = async () => {

        const datos =
            await listarHistorias();

        setHistorias(datos);

    };




    const cargarPacientes = async () => {


        const respuesta =
            await fetch(
                "http://localhost:8765/api/pacientes",
                obtenerConfigAuth()
            );


        const datos =
            await respuesta.json();


        setPacientes(datos);

    };




    const cargarProfesionales = async () => {


        const respuesta =
            await fetch(
                "http://localhost:8765/api/profesionales",
                obtenerConfigAuth()
            );


        const datos =
            await respuesta.json();


        setProfesionales(datos);

    };




const cargarCitas = async () => {


    try {


        const respuesta =
            await fetch(

                "http://localhost:8765/api/citas",

                obtenerConfigAuth()

            );


        const datos =
            await respuesta.json();



        console.log(
            "CITAS RECIBIDAS:",
            datos
        );



        setCitas(datos);


    }
    catch(error) {


        console.error(
            "Error cargando citas:",
            error
        );


    }


};




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




const guardar = async()=>{


    try {


        console.log(
            "DATOS HISTORIA ENVIADOS:",
            historia
        );


        const historiaEnviar = {

            ...historia,

            fecha:
                historia.fecha ||
                new Date().toISOString().split("T")[0]

        };



        /*
        ====================================================
        ACTUALIZAR HISTORIA CLÍNICA
        ====================================================
        */

        if (
            idHistoriaEditando !== null
        ) {


            await fetch(

                `http://localhost:8765/api/historias/${idHistoriaEditando}`,

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
        CREAR NUEVA HISTORIA CLÍNICA
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



        setIdHistoriaEditando(
            null
        );



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


    const eliminar = async (id) => {


    await eliminarHistoria(id);


    await cargarHistorias();


};

const editarHistoria = (

    historiaSeleccionada

) => {


    setIdHistoriaEditando(

        historiaSeleccionada.idHistoria

    );



    setHistoria({


        paciente:{

            idPaciente:
            historiaSeleccionada.paciente.idPaciente

        },


        profesional:{

            idProfesional:
            historiaSeleccionada.profesional.idProfesional

        },


        cita:{

            idCita:
            historiaSeleccionada.cita.idCita

        },


        fecha:

            historiaSeleccionada.fecha,


        motivoConsulta:

            historiaSeleccionada.motivoConsulta || "",


        diagnostico:

            historiaSeleccionada.diagnostico || "",


        tratamiento:

            historiaSeleccionada.tratamiento || "",


        observaciones:

            historiaSeleccionada.observaciones || ""


    });


};


const cambiarPaciente = (

    idPaciente

) => {


const citasPaciente =

    citas.filter(

        cita =>

        cita.paciente?.idPaciente
        ===
        Number(idPaciente)

        &&

        cita.estado === "ASISTIDA"

    );


    const profesionalesUnicos =

        citasPaciente

            .map(

                cita => cita.profesional

            )

            .filter(

                (profesional, index, array) =>

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


const cambiarCita = (

    idCita

) => {


    const citaSeleccionada =

        citas.find(

            cita =>

            cita.idCita === Number(idCita)

        );



    setHistoria({

        ...historia,


        cita:{

            idCita:idCita

        },


        profesional:{

            idProfesional:

            citaSeleccionada?.profesional?.idProfesional || ""

        }


    });


};
    
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

            Registra y consulta la información clínica
            de los pacientes del consultorio.

        </p>


    </div>  



            <div className="historia-form">


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

                        Seleccione paciente

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

        Seleccione cita

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

                    Cita #{cita.idCita}
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

    onClick={guardar}

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





            <HistoriaClinicaTable

                historias={historias}

                editarHistoria={editarHistoria}

                eliminarHistoria={eliminar}

            />


        </section>

    );

}


export default HistoriaClinica;