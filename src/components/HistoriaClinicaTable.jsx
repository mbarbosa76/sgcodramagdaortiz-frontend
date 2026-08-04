import React from "react";


function HistoriaClinicaTable({
    historias,
    eliminarHistoria
}) {


    return (

        <table className="Historia-table">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Paciente</th>

                    <th>Profesional</th>

                    <th>Fecha</th>

                    <th>Diagnóstico</th>

                    <th>Acción</th>

                </tr>

            </thead>


            <tbody>


                {
                    historias.length === 0 ? (

                        <tr>

                            <td colSpan="6">

                                No hay historias clínicas registradas.

                            </td>

                        </tr>


                    ) : (


                        historias.map(
                            (historia) => (

                                <tr key={historia.idHistoria}>

                                    <td>
                                        {historia.idHistoria}
                                    </td>


                                    <td>

                                        {
                                            historia.paciente?.nombre
                                        }

                                        {" "}

                                        {
                                            historia.paciente?.apellido
                                        }

                                    </td>


                                    <td>

                                        {
                                            historia.profesional?.nombre
                                        }

                                        {" "}

                                        {
                                            historia.profesional?.apellido
                                        }

                                    </td>


                                    <td>

                                        {
                                            historia.fecha
                                        }

                                    </td>


                                    <td>

                                        {
                                            historia.diagnostico
                                        }

                                    </td>


                                    <td>

                                        <button

                                            onClick={() =>
                                                eliminarHistoria(
                                                    historia.idHistoria
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


export default HistoriaClinicaTable;