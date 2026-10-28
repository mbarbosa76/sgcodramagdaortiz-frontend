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
    useMemo,
    useRef,
    useState
} from "react";

// Importa la URL centralizada del backend para desarrollo y despliegue.
import { API_BASE_URL } from "../config/api";


import {
    listarFacturas,
    crearFacturaCompleta,
    actualizarFactura,
    eliminarFactura
} from "../services/FacturaService";


import FacturaTable from "../components/FacturaTable";
import { estaFechaEnRangoISO } from "../utils/dashboardPeriodo";


import "./Factura.css";



function Factura({
    filtroNavegacion = null,
    onLimpiarFiltro
}) {

    /*
    ============================================================
    REFERENCIA A LA TABLA DE FACTURACIÓN
    ============================================================
    Permite ubicar el resultado solicitado desde el Dashboard.
    */
    const tablaFacturasRef = useRef(null);


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


    /*
      ============================================================
      EDICIÓN DE UNA FACTURA EXISTENTE
      ============================================================
      La edición NO recrea la factura desde cero (paciente, cita
      y servicios quedan fijos, como corresponde a un documento
      ya emitido). Solo permite corregir:

      - El estado de pago (PENDIENTE / PAGADA / CANCELADA).
      - La fecha, por si se registró mal (nunca hacia el futuro).
    */
    const [facturaEditando, setFacturaEditando] =
        useState(null);

    const [edicion, setEdicion] =
        useState({
            fecha: "",
            estadoPago: "PENDIENTE"
        });

    /*
      Fecha de hoy en formato "yyyy-MM-dd", usada como tope
      máximo del campo de fecha (atributo "max" del input) para
      que el navegador ya impida elegir una fecha futura.
    */
    const hoyISO = (() => {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    })();







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

                `${API_BASE_URL}/pacientes`,

                obtenerConfigAuth()

            );



        const datos =
            await respuesta.json();



        setPacientes(datos);


    };








    const cargarCitas = async () => {


        const respuesta =
            await fetch(

                `${API_BASE_URL}/citas`,

                obtenerConfigAuth()

            );



        const datos =
            await respuesta.json();



        setCitas(datos);


    };








    const cargarServicios = async () => {


        const respuesta =
            await fetch(

                `${API_BASE_URL}/servicios`,

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




/*
  ============================================================
  INICIAR EDICIÓN
  ============================================================
  Abre el panel de edición precargado con los valores
  actuales de la factura seleccionada.
*/
const iniciarEdicion = (
    facturaSeleccionada
) => {

    setFacturaEditando(
        facturaSeleccionada
    );

    setEdicion({
        fecha:
            facturaSeleccionada.fecha || "",
        estadoPago:
            facturaSeleccionada.estadoPago || "PENDIENTE"
    });

};




/*
  ============================================================
  CANCELAR EDICIÓN
  ============================================================
*/
const cancelarEdicion = () => {

    setFacturaEditando(null);

};




/*
  ============================================================
  GUARDAR EDICIÓN
  ============================================================
  Envía solo lo que se puede corregir (fecha y estado de
  pago). El backend valida que la fecha no sea futura y
  rechaza la operación si lo es.
*/
const guardarEdicion = async () => {

    try {

        await actualizarFactura(
            facturaEditando.idFactura,
            {
                estadoPago:
                    edicion.estadoPago,
                total:
                    facturaEditando.total,
                fecha:
                    edicion.fecha
            }
        );

        await cargarFacturas();

        setFacturaEditando(null);

    } catch(error) {

        alert(
            error.response?.data ||
            "No fue posible actualizar la factura."
        );

    }

};





const imprimirFactura = async (
    factura
) => {


    try {


        const token =
            localStorage.getItem("token");



        const respuesta =
            await fetch(

                `${API_BASE_URL}/detalles-factura/factura/${factura.idFactura}`,

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

    /*
    ============================================================
    FILTRO RECIBIDO DESDE EL DASHBOARD
    ============================================================
    Soporta una factura específica o la facturación de un mes.
    El filtrado se hace sobre los registros ya cargados desde
    Spring Boot, por lo que no cambia los endpoints existentes.
    */
    const facturasFiltradasDashboard = useMemo(
        () => {
            if(!filtroNavegacion) return facturas;

            if(filtroNavegacion.tipo === "idFactura"){
                return facturas.filter(
                    facturaActual => Number(facturaActual.idFactura) === Number(filtroNavegacion.valor)
                );
            }

            if(filtroNavegacion.tipo === "idPaciente"){
                return facturas.filter(
                    facturaActual => Number(facturaActual.paciente?.idPaciente) === Number(filtroNavegacion.valor)
                );
            }

            if(filtroNavegacion.tipo === "mes"){
                return facturas.filter(
                    facturaActual => {
                        if(!facturaActual.fecha) return false;

                        const [anio, mes] = String(facturaActual.fecha)
                            .slice(0, 10)
                            .split("-")
                            .map(Number);

                        return (
                            anio === Number(filtroNavegacion.anio) &&
                            mes === Number(filtroNavegacion.mes)
                        );
                    }
                );
            }

            if(filtroNavegacion.tipo === "periodo"){
                return facturas.filter(
                    facturaActual => estaFechaEnRangoISO(
                        facturaActual.fecha,
                        filtroNavegacion.fechaInicio,
                        filtroNavegacion.fechaFin
                    )
                );
            }

            if(filtroNavegacion.tipo === "estadoPago"){
                return facturas.filter(
                    facturaActual => (
                        facturaActual.estadoPago === filtroNavegacion.valor &&
                        estaFechaEnRangoISO(
                            facturaActual.fecha,
                            filtroNavegacion.fechaInicio,
                            filtroNavegacion.fechaFin
                        )
                    )
                );
            }

            return facturas;
        },
        [facturas, filtroNavegacion]
    );

    useEffect(() => {
        if(!filtroNavegacion || facturas.length === 0) return;

        const idAnimacion = window.requestAnimationFrame(() => {
            tablaFacturasRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        return () => window.cancelAnimationFrame(idAnimacion);
    }, [filtroNavegacion, facturas.length]);


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



<div ref={tablaFacturasRef}>

{filtroNavegacion && (
    <div className="module-context-filter">
        <div>
            <strong>Filtro desde Dashboard</strong>
            <span>{filtroNavegacion.etiqueta || "Facturación filtrada"}</span>
        </div>
        <button type="button" onClick={onLimpiarFiltro}>
            Quitar filtro
        </button>
    </div>
)}

{facturaEditando && (
    <div className="card table-card">

        <div className="table-title">
            <h3>
                Editar factura {facturaEditando.numeroFactura}
            </h3>
            <p>
                Solo se puede corregir la fecha y el estado de pago.
                El paciente, la cita y los servicios facturados no
                se modifican aquí.
            </p>
        </div>

        <div className="form-group">
            <label htmlFor="fechaEdicion">
                Fecha
            </label>
            <input
                id="fechaEdicion"
                type="date"
                value={edicion.fecha}
                max={hoyISO}
                onChange={(e) =>
                    setEdicion({
                        ...edicion,
                        fecha: e.target.value
                    })
                }
            />
            <small>
                No se permite una fecha posterior a hoy.
            </small>
        </div>

        <div className="form-group">
            <label htmlFor="estadoPagoEdicion">
                Estado de pago
            </label>
            <select
                id="estadoPagoEdicion"
                value={edicion.estadoPago}
                onChange={(e) =>
                    setEdicion({
                        ...edicion,
                        estadoPago: e.target.value
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
        </div>

        <div className="form-buttons">
            <button
                type="button"
                className="btn-primary"
                onClick={guardarEdicion}
            >
                Guardar cambios
            </button>
            <button
                type="button"
                className="btn-secondary"
                onClick={cancelarEdicion}
            >
                Cancelar
            </button>
        </div>

    </div>
)}

<FacturaTable


    facturas={
        facturasFiltradasDashboard
    }


    onEditar={
        iniciarEdicion
    }


    eliminarFactura={
        eliminar
    }


    imprimirFactura={
        imprimirFactura
    }


/>

</div>




        </section>


    );



}



export default Factura;