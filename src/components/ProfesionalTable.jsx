/*
  Componente encargado exclusivamente
  de mostrar la tabla de profesionales.
*/

function ProfesionalTable({
  profesionales,
  onEditar,
  onEliminar
}) {

  return (

    <div className="card table-card">

      <div className="table-title">

        <h3>
          Profesionales Registrados
        </h3>

        <p>
          Información obtenida directamente
          desde la base de datos.
        </p>

      </div>


      <div className="table-container">

        <table className="Profesional-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Identificación</th>

              <th>Nombres</th>

              <th>Apellidos</th>

              <th>Especialidad</th>

              <th>Correo</th>

              <th>Departamento</th>

              <th>Municipio</th>

              <th>Estado</th>

              <th>Acciones</th>

            </tr>

          </thead>


          <tbody>

            {profesionales.length === 0 ? (

              <tr>

                <td
                  colSpan="10"
                  className="empty-table"
                >
                  No hay profesionales registrados.
                </td>

              </tr>

            ) : (

              profesionales.map((profesional) => (

                <tr key={profesional.idProfesional}>

                  <td>
                    {profesional.idProfesional}
                  </td>

                  <td>
                    {profesional.identificacion}
                  </td>

                  <td>
                    {profesional.nombre}
                  </td>

                  <td>
                    {profesional.apellido}
                  </td>

                  <td>
                    {profesional.especialidad}
                  </td>

                  <td>
                    {profesional.correo || 'Sin correo'}
                  </td>

                  <td>
                    {profesional.departamento || '—'}
                  </td>

                  <td>
                    {profesional.municipio || '—'}
                  </td>

<td>

    <span

        className={
            profesional.estado === "Activo"
            ? "estado-activo"
            : "estado-inactivo"
        }

    >

        {
            profesional.estado
        }

    </span>

</td>

                  <td>

                    <div className="action-buttons">

                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() =>
                          onEditar(profesional)
                        }
                      >
                        Editar
                      </button>


                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() =>
                          onEliminar(
                            profesional.idProfesional
                          )
                        }
                      >
                        Desactivar
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
export default ProfesionalTable
