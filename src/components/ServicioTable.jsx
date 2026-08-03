/*
============================================================
ServicioTable.jsx
============================================================

Tabla reutilizable para mostrar los servicios
odontológicos registrados.

============================================================
*/

function ServicioTable({

    servicios,

    onEditar,

    onEliminar

}) {

    return (

        <table className="servicio-table">

            <thead>

                <tr>

                    <th>Código</th>

                    <th>Nombre</th>

                    <th>Categoría</th>

                    <th>Duración</th>

                    <th>Precio</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                {servicios.map((servicio) => (

                    <tr key={servicio.idServicio}>

                        <td>

                            {servicio.codServicio}

                        </td>

                        <td>

                            {servicio.nombreServicio}

                        </td>

                        <td>

                            {servicio.categoria}

                        </td>

                        <td>

                            {servicio.duracionMin} min

                        </td>

                        <td>

                            ${Number(servicio.precio).toLocaleString("es-CO")}

                        </td>

                        <td>

                            <button

                                type="button"

                                onClick={() => onEditar(servicio)}

                            >

                                Editar

                            </button>

                            <button

                                type="button"

                                onClick={() =>

                                    onEliminar(servicio.idServicio)

                                }

                            >

                                Eliminar

                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}

export default ServicioTable;