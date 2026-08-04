/*
============================================================
FacturaTable.jsx
Sistema de Gestión de Citas Odontológicas

Componente encargado de mostrar las facturas registradas.

============================================================
*/


function FacturaTable({
    facturas,
    eliminarFactura
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

                            <td colSpan="7">

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

                                        {
                                            factura.estadoPago
                                        }

                                    </td>


                                    <td>

                                        $

                                        {
                                            factura.total?.toLocaleString()
                                        }

                                    </td>


                                    <td>


                                        <button

                                            onClick={() =>
                                                eliminarFactura(
                                                    factura.idFactura
                                                )
                                            }

                                        >

                                            Eliminar

                                        </button>


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