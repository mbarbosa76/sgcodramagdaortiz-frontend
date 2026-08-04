/*
============================================================
Factura.jsx
Sistema de Gestión de Citas Odontológicas

Módulo:
Facturación

Funciones:
- Consultar facturas.
- Crear facturas.
- Relacionar paciente.
- Relacionar cita.
- Eliminar facturas.

============================================================
*/


import {
    useEffect,
    useState
} from "react";


import {
    listarFacturas,
    crearFactura,
    eliminarFactura
} from "../services/FacturaService";


import FacturaTable from "../components/FacturaTable";

import "./Factura.css";



function Factura() {


    const [facturas, setFacturas] =
        useState([]);



    const [pacientes, setPacientes] =
        useState([]);



    const [citas, setCitas] =
        useState([]);



    const [factura, setFactura] =
        useState({

            numeroFactura: "",

            fecha:
                new Date()
                .toISOString()
                .split("T")[0],

            estadoPago: "PENDIENTE",

            total: 0,

            paciente: {

                idPaciente: ""

            },

            cita: {

                idCita: ""

            }

        });



    useEffect(() => {

        cargarFacturas();

        cargarPacientes();

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





    const cargarFacturas = async () => {


        const datos =
            await listarFacturas();


        setFacturas(datos);

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





const guardar = async () => {


    try {


        const facturaEnviar = {


            fecha:
                factura.fecha,


            estadoPago:
                factura.estadoPago,


            total:
                Number(
                    factura.total
                ),


            paciente: {

                idPaciente:
                    Number(
                        factura.paciente.idPaciente
                    )

            },


            cita: {

                idCita:
                    Number(
                        factura.cita.idCita
                    )

            }


        };



        console.log(
            "FACTURA ENVIADA:",
            facturaEnviar
        );



        await crearFactura(
            facturaEnviar
        );



        await cargarFacturas();



        alert(
            "Factura creada correctamente"
        );



    } catch (error) {


        console.error(
            "ERROR CREANDO FACTURA:",
            error.response?.data || error
        );


        alert(
            "No fue posible crear la factura."
        );


    }


};




    const eliminar = async (idFactura) => {


        await eliminarFactura(
            idFactura
        );


        await cargarFacturas();

    };





    return (

        <section className="factura-container">


            <h2>

                Facturación

            </h2>



            <div className="factura-form">


                <input

                    placeholder="Número factura"

                    value={
                        factura.numeroFactura
                    }

                    onChange={
                        e =>
                        setFactura({

                            ...factura,

                            numeroFactura:
                                e.target.value

                        })
                    }

                />



                <select


                    value={
                        factura.paciente.idPaciente
                    }


                    onChange={
                        e =>
                        setFactura({

                            ...factura,

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
                        factura.cita.idCita
                    }


                    onChange={
                        e =>
                        setFactura({

                            ...factura,

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





                <select

                    value={
                        factura.estadoPago
                    }

                    onChange={
                        e =>
                        setFactura({

                            ...factura,

                            estadoPago:
                                e.target.value

                        })
                    }

                >

                    <option value="PENDIENTE">

                        PENDIENTE

                    </option>


                    <option value="PAGADA">

                        PAGADA

                    </option>


                    <option value="CANCELADA">

                        CANCELADA

                    </option>


                </select>





                <input

                    type="number"

                    placeholder="Total inicial"

                    value={
                        factura.total
                    }

                    onChange={
                        e =>
                        setFactura({

                            ...factura,

                            total:
                                e.target.value

                        })
                    }

                />





                <button

                    onClick={guardar}

                >

                    Crear Factura

                </button>


            </div>





            <FacturaTable

                facturas={facturas}

                eliminarFactura={eliminar}

            />


        </section>

    );

}


export default Factura;