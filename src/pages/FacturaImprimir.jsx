/*
============================================================
FacturaImprimir.jsx
Sistema de Gestión de Citas Odontológicas

Vista exclusiva de impresión de factura.

============================================================
*/


import {
    useEffect,
    useState
} from "react";


import axios from "axios";


import "./FacturaImprimir.css";



function FacturaImprimir({ factura }) {


    const [detalles, setDetalles] =
        useState([]);



    useEffect(() => {

        cargarDetalles();

    }, []);




    const cargarDetalles = async () => {


        try {


            const token =
                localStorage.getItem("token");



            const respuesta =
                await axios.get(

                    `http://localhost:8765/api/detalles-factura/factura/${factura.idFactura}`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );



            setDetalles(
                respuesta.data
            );



        } catch(error) {


            console.error(
                "Error cargando detalles de factura:",
                error
            );


        }


    };




    const imprimir = () => {

        window.print();

    };




    return (

        <div className="factura-documento">


            <div className="factura-encabezado">


                <h1>
                    🦷 Consultorio Odontológico
                </h1>


                <h2>
                    Dra. Magda Ortiz
                </h2>


                <p>
                    Sistema de Gestión de Citas Odontológicas
                </p>


            </div>



            <hr />



            <div className="factura-info">


                <h2>
                    FACTURA DE VENTA
                </h2>



                <p>

                    <strong>
                        Número:
                    </strong>

                    {" "}

                    {factura.numeroFactura}

                </p>



                <p>

                    <strong>
                        Fecha:
                    </strong>

                    {" "}

                    {factura.fecha}

                </p>



                <p>

                    <strong>
                        Estado:
                    </strong>

                    {" "}

                    {factura.estadoPago}

                </p>


            </div>




            <hr />




            <div className="cliente-info">


                <h3>
                    Datos del cliente
                </h3>



                <p>

                    <strong>
                        Paciente:
                    </strong>

                    {" "}

                    {factura.paciente?.nombre}

                    {" "}

                    {factura.paciente?.apellido}

                </p>



                <p>

                    <strong>
                        Documento:
                    </strong>

                    {" "}

                    {factura.paciente?.documento}

                </p>



                <p>

                    <strong>
                        Teléfono:
                    </strong>

                    {" "}

                    {factura.paciente?.telefono}

                </p>



                <p>

                    <strong>
                        Profesional:
                    </strong>

                    {" "}

                    {factura.cita?.profesional?.nombre}

                    {" "}

                    {factura.cita?.profesional?.apellido}

                </p>


            </div>




            <hr />




            <h3>
                Detalle de servicios
            </h3>




            <table className="tabla-factura">


                <thead>

                    <tr>

                        <th>
                            Servicio
                        </th>

                        <th>
                            Cantidad
                        </th>

                        <th>
                            Valor
                        </th>


                    </tr>


                </thead>



                <tbody>


                    {
                        detalles.length === 0 ? (


                            <tr>

                                <td colSpan="3">

                                    No hay detalles registrados.

                                </td>

                            </tr>


                        ) : (


                            detalles.map(

                                detalle => (


                                    <tr

                                        key={
                                            detalle.idDetalle
                                        }

                                    >

                                        <td>

                                            {
                                                detalle.servicio
                                                ?.nombreServicio
                                            }

                                        </td>



                                        <td>

                                            {
                                                detalle.cantidad
                                            }

                                        </td>



                                        <td>

                                            $

                                            {
                                                detalle.subtotal
                                                ?.toLocaleString()
                                            }

                                        </td>



                                    </tr>


                                )

                            )


                        )

                    }


                </tbody>


            </table>




            <div className="total-factura">


                <h2>

                    Total:

                    {" $"}

                    {
                        factura.total
                        ?.toLocaleString()
                    }


                </h2>


            </div>




            <p className="mensaje-final">

                Gracias por confiar en nosotros.

            </p>




            <button

                className="btn-imprimir"

                onClick={imprimir}

            >

                Imprimir factura

            </button>



        </div>


    );

}



export default FacturaImprimir;