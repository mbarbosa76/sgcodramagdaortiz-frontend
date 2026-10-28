import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ModuleTableHeader from "./ModuleTableHeader";

function HistoriaClinicaTable({ historias, editarHistoria, eliminarHistoria }) {
  const [busqueda, setBusqueda] = useState("");

  const registrosFiltrados = (historias || []).filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="card table-card data-table-card">
      <ModuleTableHeader
        titulo="Historias Clínicas Registradas"
        descripcion="Información obtenida directamente desde la base de datos."
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        placeholder="Buscar por paciente, cédula, profesional, diagnóstico..."
      />

      <div className="table-container data-table-scroll">
        <table className="Historia-table data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Profesional</th>
              <th>Fecha</th>
              <th>Diagnóstico</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  No hay historias clínicas registradas.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((historia) => (
                <tr key={historia.idHistoria}>
                  <td>{historia.idHistoria}</td>
                  <td>
                    {historia.paciente?.nombre} {historia.paciente?.apellido}
                  </td>
                  <td>
                    {historia.profesional?.nombre} {historia.profesional?.apellido}
                  </td>
                  <td>{historia.fecha}</td>
                  <td>{historia.diagnostico || "Sin diagnóstico"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => editarHistoria(historia)}
                      >
                        <Pencil size={15} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => eliminarHistoria(historia.idHistoria)}
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

export default HistoriaClinicaTable;
