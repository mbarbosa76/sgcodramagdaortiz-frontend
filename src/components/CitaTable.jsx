/*
  Componente encargado de mostrar
  la tabla de citas.
*/

function CitaTable({

  citas,

  servicios,

  onEditar,

  onEliminar

}) {


  /*
    Obtiene el nombre del servicio
    utilizando su ID.
  */
  const obtenerNombreServicio = (idServicio) => {

    const servicio =
      servicios.find(

        item =>
          item.idServicio ===
          Number(idServicio)

      )


    return servicio
      ? servicio.nombreServicio
      : 'Servicio no encontrado'

  }


  return (

    <div className="card table-card">


      <div className="table-title">

        <h3>
          Citas Registradas
        </h3>

        <p>
          Listado de citas obtenido
          directamente desde la base de datos.
        </p>

      </div>


      <div className="table-container">

        <table className="Cita-table">


          <thead>

            <tr>

              <th>ID</th>

              <th>Paciente</th>

              <th>Servicio</th>

              <th>Fecha</th>

              <th>Hora</th>

              <th>Duración</th>

              <th>Estado</th>

              <th>Observación</th>

              <th>Acciones</th>

            </tr>

          </thead>


          <tbody>


            {citas.length === 0 ? (

              <tr>

                <td
                  colSpan="9"
                  className="empty-table"
                >

                  No hay citas registradas.

                </td>

              </tr>

            ) : (


              citas.map((cita) => (

                <tr key={cita.idCita}>


                  {/* ID */}

                  <td>
                    {cita.idCita}
                  </td>


                  {/* PACIENTE */}

                  <td>

                    {cita.paciente
                      ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                      : 'Sin paciente'}

                  </td>


                  {/* SERVICIO */}

                  <td>

                    {obtenerNombreServicio(
                      cita.idServicio
                    )}

                  </td>


                  {/* FECHA */}

                  <td>
                    {cita.fecha}
                  </td>


                  {/* HORA */}

                  <td>
                    {cita.horaInicio}
                  </td>


                  {/* DURACIÓN */}

                  <td>
                    {cita.duracionMin} min
                  </td>


                  {/* ESTADO */}

                  <td>

                    <span
                      className={`estado estado-${String(
                        cita.estado || ''
                      )
                        .toLowerCase()
                        .replaceAll(' ', '-')}`}
                    >

                      {cita.estado || 'Sin estado'}

                    </span>

                  </td>


                  {/* OBSERVACIÓN */}

                  <td>

                    {cita.observacion
                      || 'Sin observación'}

                  </td>


                  {/* ACCIONES */}

                  <td>

                    <div className="action-buttons">


                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() =>
                          onEditar(cita)
                        }
                      >

                        Editar

                      </button>


                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() =>
                          onEliminar(
                            cita.idCita
                          )
                        }
                      >

                        Eliminar

                      </button>


                    </div>

                  </td>


                </tr>

              ))

            )}


          </tbody>

        </table>

      </div>

    </div>

  )

}


/*
  Exporta el componente.
*/
export default CitaTable