import { useState } from "react";
import ModuleTableHeader from "./ModuleTableHeader";

/*
  Componente encargado exclusivamente
  de mostrar la tabla de pacientes.
*/

/*
  Iconos modernos para las acciones de la tabla.
  (lucide-react ya es una dependencia del proyecto)
*/
import { Pencil, Trash2, Phone } from 'lucide-react'

function PacienteTable({
  pacientes,
  onEditar,
  onEliminar
}) {

  const [busqueda, setBusqueda] = useState("");

  const registrosFiltrados = (pacientes)?.filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  ) || [];


  return (

    <div className="card table-card data-table-card">

<ModuleTableHeader

    titulo="Pacientes Registrados"

    descripcion="Información obtenida directamente desde la base de datos."

    busqueda={busqueda}

    setBusqueda={setBusqueda}

    placeholder="Buscar por documento, nombre, correo..."

/>


      <div className="table-container data-table-scroll">

        <table className="Paciente-table data-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Documento</th>

              <th>Nombres</th>

              <th>Apellidos</th>

              <th>Correo</th>

              <th>Teléfono</th>

              <th>Acciones</th>

            </tr>

          </thead>


          <tbody>

            {registrosFiltrados.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-table"
                >
                  No hay pacientes registrados.
                </td>

              </tr>

            ) : (

              registrosFiltrados.map((paciente) => (

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

                    <span className="telefono-cell">

                      <Phone size={13} />

                      {paciente.telefono || 'Sin teléfono'}

                    </span>

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
                        <Pencil size={15} />
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
                        <Trash2 size={15} />
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