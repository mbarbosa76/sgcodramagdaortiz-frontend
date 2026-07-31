/*
  Componente encargado exclusivamente
  de mostrar la tabla de usuarios.
*/

function UsuarioTable({
  usuarios,
  onEditar,
  onEliminar
}) {

  return (

    <div className="card table-card">

      <div className="table-title">

        <h3>
          Usuarios Registrados
        </h3>

        <p>
          Información obtenida directamente
          desde la base de datos.
        </p>

      </div>


      <div className="table-container">

        <table className="Usuario-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Usuario</th>

              <th>Nombre</th>

              <th>Apellido</th>

              <th>Correo</th>

              <th>Teléfono</th>

              <th>Rol</th>

              <th>Fecha creación</th>

              <th>Acciones</th>

            </tr>

          </thead>


          <tbody>

            {(!usuarios || usuarios.length === 0) ? (

              <tr>

                <td
                  colSpan="9"
                  className="empty-table"
                >
                  No hay usuarios registrados.
                </td>

              </tr>

            ) : (

              usuarios.map((usuario) => (

                <tr key={usuario.idUsuario}>

                  <td>
                    {usuario.idUsuario}
                  </td>

                  <td>
                    {usuario.username}
                  </td>

                  <td>
                    {usuario.nombre}
                  </td>

                  <td>
                    {usuario.apellido}
                  </td>

                  <td>
                    {usuario.correo}
                  </td>

                  <td>
                    {usuario.telefono || 'Sin teléfono'}
                  </td>

                  <td>
                    {usuario.rol}
                  </td>

                  <td>
                    {usuario.fechaCreacion || '-'}
                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() =>
                          onEditar(usuario)
                        }
                      >
                        Editar
                      </button>


                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() =>
                          onEliminar(
                            usuario.idUsuario
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
export default UsuarioTable