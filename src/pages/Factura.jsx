/*
============================================================
Factura.jsx
Sistema de Gestión de Citas Odontológicas

Módulo:
Facturación

Funciones:

- Crear factura completa.
- Seleccionar paciente.
- Filtrar citas por paciente.
- Seleccionar servicios.
- Calcular total automático.
- Consultar facturas.
- Eliminar facturas.

============================================================
*/


import {
    useEffect,
    useState
} from "react";


import {
    listarFacturas,
    crearFacturaCompleta,
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



    const [citasFiltradas, setCitasFiltradas] =
        useState([]);




    const [servicios, setServicios] =
        useState([]);




    const [serviciosSeleccionados, setServiciosSeleccionados] =
        useState([]);





    const [factura, setFactura] =
        useState({


            estadoPago:
                "PENDIENTE",



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

        cargarServicios();


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


        try {


            const datos =
                await listarFacturas();



            setFacturas(datos);



        }
        catch(error) {


            console.error(
                "Error cargando facturas:",
                error
            );


        }


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








    const cargarServicios = async () => {


        const respuesta =
            await fetch(

                "http://localhost:8765/api/servicios",

                obtenerConfigAuth()

            );



        const datos =
            await respuesta.json();



        setServicios(datos);


    };

    



    const cambiarPaciente = (
        idPaciente
    ) => {



        const id =
            Number(idPaciente);



        setFactura({


            ...factura,


            paciente:{


                idPaciente:
                    idPaciente


            },


            cita:{


                idCita:
                    ""


            }


        });





        const citasDelPaciente =
            citas.filter(


                cita =>

                cita.paciente?.idPaciente
                ===
                id



            );




        setCitasFiltradas(
            citasDelPaciente
        );



    };








    const cambiarServicio = (
        idServicio
    ) => {



        if(
            serviciosSeleccionados.includes(
                idServicio
            )
        ) {



            setServiciosSeleccionados(

                serviciosSeleccionados.filter(

                    id =>
                    id !== idServicio

                )

            );



        }
        else {


            setServiciosSeleccionados([

                ...serviciosSeleccionados,

                idServicio

            ]);


        }


    };







    const calcularTotal = () => {


        return servicios

            .filter(

                servicio =>

                serviciosSeleccionados.includes(
                    servicio.idServicio
                )

            )

            .reduce(

                (total, servicio) =>

                total + servicio.precio,

                0

            );


    };







    const guardar = async () => {



        try {



            const datos = {


                idPaciente:

                    Number(
                        factura.paciente.idPaciente
                    ),



                idCita:

                    Number(
                        factura.cita.idCita
                    ),



                estadoPago:

                    factura.estadoPago,



                servicios:

                    serviciosSeleccionados


            };





            console.log(
                "FACTURA COMPLETA ENVIADA:",
                datos
            );





const nuevaFactura =
    await crearFacturaCompleta(
        datos
    );


console.log(
    "NUEVA FACTURA CREADA:",
    nuevaFactura
);


await cargarFacturas();




            setFactura({


                estadoPago:
                    "PENDIENTE",



                paciente:{

                    idPaciente:""

                },



                cita:{

                    idCita:""

                }


            });





            setCitasFiltradas([]);



            setServiciosSeleccionados([]);





        }
        catch(error) {



            console.error(

                "Error creando factura:",
                error.response?.data || error

            );



            alert(
                "No fue posible crear factura"
            );



        }


    };


const eliminar = async (
    idFactura
) => {


    await eliminarFactura(
        idFactura
    );


    await cargarFacturas();


};





const imprimirFactura = async (
    factura
) => {


    try {


        const token =
            localStorage.getItem("token");



        const respuesta =
            await fetch(

                `http://localhost:8765/api/detalles-factura/factura/${factura.idFactura}`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );



        const detalles =
            await respuesta.json();




        const ventana =
            window.open(
                "",
                "_blank",
                "width=900,height=700"
            );




        ventana.document.write(`

<html>

<head>

<title>
Factura ${factura.numeroFactura}
</title>


<style>

body{
font-family:Arial;
padding:40px;
}

h1,h2{
text-align:center;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th{
background:#007f73;
color:white;
padding:10px;
}

td{
padding:10px;
border-bottom:1px solid #ddd;
}

.total{
text-align:right;
font-size:22px;
font-weight:bold;
margin-top:30px;
}

button{
margin-top:30px;
padding:10px 20px;
}

@media print{
button{
display:none;
}
}

</style>

</head>


<body>


<h1>
🦷 Consultorio Odontológico
</h1>


<h2>
Dra. Magda Ortiz
</h2>


<h2>
FACTURA DE VENTA
</h2>


<p>
<strong>Número:</strong>
${factura.numeroFactura}
</p>


<p>
<strong>Fecha:</strong>
${factura.fecha}
</p>


<p>
<strong>Paciente:</strong>
${factura.paciente.nombre}
${factura.paciente.apellido}
</p>


<hr>


<h3>
Detalle de servicios
</h3>


<table>

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

${
    detalles.map(

        detalle => `

<tr>

<td>
${detalle.servicio.nombreServicio}
</td>

<td>
${detalle.cantidad}
</td>

<td>
$${detalle.subtotal.toLocaleString("es-CO")}
</td>

</tr>

`

    ).join("")
}

</tbody>

</table>


<div class="total">

TOTAL:
$${factura.total.toLocaleString("es-CO")}

</div>



<button onclick="window.print()">

Imprimir

</button>


</body>

</html>

        `);



        ventana.document.close();



    }
    catch(error) {


        console.error(
            "Error impresión:",
            error
        );


    }


};

    return (


        <section className="factura-container">



<div className="module-header">


    <span className="module-tag">

        Módulo Facturación

    </span>



    <h2>

        Gestión de Facturación

    </h2>



    <p>

        Administra la generación de facturas
        y los servicios asociados del consultorio.

    </p>


</div>




            <div className="factura-form">






                <select


                    value={
                        factura.paciente.idPaciente
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


                                    {
                                    paciente.nombre
                                    }

                                    {" "}

                                    {
                                    paciente.apellido
                                    }


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

                                    {
                                    cita.idCita
                                    }

                                    {" - "}

                                    {
                                    cita.fecha
                                    }



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







                <h3>

                    Servicios

                </h3>





                {


                    servicios.map(

                        servicio => (


                            <label


                                key={
                                    servicio.idServicio
                                }


                            >



                                <input


                                    type="checkbox"


                                    checked={

                                        serviciosSeleccionados.includes(

                                            servicio.idServicio

                                        )

                                    }



                                    onChange={

                                        () =>

                                        cambiarServicio(

                                            servicio.idServicio

                                        )

                                    }


                                />



                                {
                                servicio.nombreServicio
                                }


                                {" $"}



                                {
                                servicio.precio.toLocaleString()
                                }



                            </label>


                        )


                    )


                }






                <h3>


                    Total:

                    {" $"}


                    {
                    calcularTotal()
                    .toLocaleString()
                    }



                </h3>







                <button


                    onClick={
                        guardar
                    }


                >


                    Crear Factura


                </button>





            </div>



<FacturaTable


    facturas={
        facturas
    }


    eliminarFactura={
        eliminar
    }


    imprimirFactura={
        imprimirFactura
    }


/>






        </section>


    );



}



export default Factura;