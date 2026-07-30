/*
  Componente encargado exclusivamente
  de mostrar la tabla de pacientes.
*/

function PacienteTable({
  pacientes,
  onEditar,
  onEliminar
}) {

  return (

    <div className="card table-card">

      <div className="table-title">

        <h3>
          Pacientes Registrados
        </h3>

        <p>
          Información obtenida directamente
          desde la base de datos.
        </p>

      </div>


      <div className="table-container">

        <table className="Paciente-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Documento</th>

              <th>Nombres</th>

              <th>Apellidos</th>

              <th>Correo</th>

              <th>Acciones</th>

            </tr>

          </thead>


          <tbody>

            {pacientes.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="empty-table"
                >
                  No hay pacientes registrados.
                </td>

              </tr>

            ) : (

              pacientes.map((paciente) => (

                <tr key={paciente.idPaciente}>

                  <td>
                    {paciente.idPaciente}
                  </td>

                  <td>
                    {paciente.documento}
                  </td>

                  <td>
                    {paciente.nombre}
                  </td>

                  <td>
                    {paciente.apellido}
                  </td>

                  <td>
                    {paciente.correo || 'Sin correo'}
                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() =>
                          onEditar(paciente)
                        }
                      >
                        Editar
                      </button>


                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() =>
                          onEliminar(
                            paciente.idPaciente
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
export default PacienteTable