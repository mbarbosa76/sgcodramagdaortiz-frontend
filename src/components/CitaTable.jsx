import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ModuleTableHeader from "./ModuleTableHeader";

function CitaTable({ citas, servicios, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const registrosFiltrados = (citas || []).filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const obtenerNombreServicio = (idServicio) => {
    const servicio = (servicios || []).find(
      (item) => item.idServicio === Number(idServicio)
    );

    return servicio ? servicio.nombreServicio : "Servicio no encontrado";
  };

  return (
    <div className="card table-card data-table-card">
      <ModuleTableHeader
        titulo="Citas Registradas"
        descripcion="Listado de citas almacenadas en el sistema."
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        placeholder="Buscar por paciente, servicio, fecha, estado..."
      />

      <div className="table-container data-table-scroll">
        <table className="Cita-table data-table">
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
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-table">
                  No hay citas registradas.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((cita) => (
                <tr key={cita.idCita}>
                  <td>{cita.idCita}</td>
                  <td>
                    {cita.paciente
                      ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                      : "Sin paciente"}
                  </td>
                  <td>{obtenerNombreServicio(cita.idServicio)}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.horaInicio}</td>
                  <td>{cita.duracionMin} min</td>
                  <td>
                    <span
                      className={`estado estado-${String(cita.estado || "")
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {cita.estado || "Sin estado"}
                    </span>
                  </td>
                  <td>{cita.observacion || "Sin observación"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => onEditar(cita)}
                      >
                        <Pencil size={15} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => onEliminar(cita.idCita)}
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
  );
}

export default CitaTable;
