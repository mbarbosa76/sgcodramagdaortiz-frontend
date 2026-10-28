import { useState } from "react";
import { Pencil, UserCheck, UserX } from "lucide-react";
import ModuleTableHeader from "./ModuleTableHeader";

function ProfesionalTable({ profesionales, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const registrosFiltrados = (profesionales || []).filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="card table-card data-table-card">
      <ModuleTableHeader
        titulo="Profesionales Registrados"
        descripcion="Información obtenida directamente desde la base de datos."
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        placeholder="Buscar por identificación, nombre, especialidad, teléfono..."
      />

      <div className="table-container data-table-scroll">
        <table className="Profesional-table data-table">
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
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-table">
                  No hay profesionales registrados.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((profesional) => {
                const estaActivo = profesional.estado === "Activo";

                return (
                  <tr key={profesional.idProfesional}>
                    <td>{profesional.idProfesional}</td>
                    <td>{profesional.identificacion}</td>
                    <td>{profesional.nombre}</td>
                    <td>{profesional.apellido}</td>
                    <td>{profesional.especialidad}</td>
                    <td>{profesional.correo || "Sin correo"}</td>
                    <td>{profesional.departamento || "—"}</td>
                    <td>{profesional.municipio || "—"}</td>
                    <td>
                      <span className={estaActivo ? "estado-activo" : "estado-inactivo"}>
                        {profesional.estado}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => onEditar(profesional)}
                        >
                          <Pencil size={15} />
                          Editar
                        </button>

                        <button
                          type="button"
                          className={estaActivo ? "btn-delete" : "btn-activate"}
                          onClick={() => onEliminar(profesional)}
                        >
                          {estaActivo ? (
                            <>
                              <UserX size={15} />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck size={15} />
                              Activar
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfesionalTable;
