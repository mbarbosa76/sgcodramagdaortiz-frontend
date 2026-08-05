/*
============================================================
FacturaTable.jsx
Sistema de Gestión de Citas Odontológicas

Componente encargado de mostrar las facturas registradas.

============================================================
*/


function FacturaTable({

    facturas,

    eliminarFactura,

    imprimirFactura

}) {


    return (


        <table className="Factura-table">


            <thead>


                <tr>


                    <th>ID</th>

                    <th>Número</th>

                    <th>Paciente</th>

                    <th>Fecha</th>

                    <th>Estado</th>

                    <th>Total</th>

                    <th>Acciones</th>


                </tr>


            </thead>





            <tbody>



                {

                    facturas.length === 0 ? (


                        <tr>


                            <td
                                colSpan="7"
                            >

                                No hay facturas registradas.


                            </td>


                        </tr>


                    ) : (



                        facturas.map(


                            (factura) => (


                                <tr

                                    key={
                                        factura.idFactura
                                    }

                                >



                                    <td>

                                        {
                                            factura.idFactura
                                        }

                                    </td>




                                    <td>

                                        {
                                            factura.numeroFactura
                                        }

                                    </td>




                                    <td>

                                        {
                                            factura.paciente?.nombre
                                        }

                                        {" "}

                                        {
                                            factura.paciente?.apellido
                                        }

                                    </td>




                                    <td>

                                        {
                                            factura.fecha
                                        }

                                    </td>




<td>


    <span

        className={

            factura.estadoPago === "PAGADA"

            ? "estado-pagada"

            : factura.estadoPago === "CANCELADA"

            ? "estado-cancelada"

            : "estado-pendiente"

        }

    >

        {
            factura.estadoPago
        }


    </span>


</td>




                                    <td>

                                        $

                                        {
                                            factura.total?.toLocaleString("es-CO")
                                        }

                                    </td>




                                    <td>


                                        <div className="factura-actions">



                                            <button

                                                type="button"

                                                className="btn-delete"

                                                title="Eliminar factura"

                                                onClick={() =>
                                                    eliminarFactura(
                                                        factura.idFactura
                                                    )
                                                }

                                            >

                                                Eliminar


                                            </button>





                                            <button

                                                type="button"

                                                className="btn-print"

                                                title="Imprimir factura"

                                                onClick={() =>
                                                    imprimirFactura(
                                                        factura
                                                    )
                                                }

                                            >

                                                Imprimir


                                            </button>



                                        </div>



                                    </td>




                                </tr>


                            )


                        )


                    )


                }



            </tbody>



        </table>


    );


}



export default FacturaTable;