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


    const [citas, setCitas] = useState([]);



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


        const respuesta =
            await fetch(
                "http://localhost:8765/api/citas",
                obtenerConfigAuth()
            );


        const datos =
            await respuesta.json();


        setCitas(datos);

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


await crearHistoria(historiaEnviar);


    await cargarHistorias();


    alert(
        "Historia clínica creada correctamente"
    );


};




    const eliminar = async (id) => {


        await eliminarHistoria(id);


        await cargarHistorias();


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
                        setHistoria({

                            ...historia,

                            paciente:{

                                idPaciente:
                                    e.target.value

                            }

                        })
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

                    onChange={
                        e =>
                        setHistoria({

                            ...historia,

                            profesional:{

                                idProfesional:
                                    e.target.value

                            }

                        })
                    }

                >

                    <option value="">

                        Seleccione profesional

                    </option>


                    {
                        profesionales.map(
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
                        setHistoria({

                            ...historia,

                            cita:{

                                idCita:
                                    e.target.value

                            }

                        })
                    }

                >

                    <option value="">

                        Seleccione cita

                    </option>


                    {
                        citas.map(
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
                                    -
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

                    Guardar Historia Clínica

                </button>


            </div>





            <HistoriaClinicaTable

                historias={historias}

                eliminarHistoria={eliminar}

            />


        </section>

    );

}


export default HistoriaClinica;