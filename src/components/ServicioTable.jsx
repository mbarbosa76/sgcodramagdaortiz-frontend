import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ModuleTableHeader from "./ModuleTableHeader";

function ServicioTable({ servicios, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const registrosFiltrados = (servicios || []).filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const formatearPrecio = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(valor));

  return (
    <div className="card table-card data-table-card">
      <ModuleTableHeader
        titulo="Servicios Registrados"
        descripcion="Información obtenida directamente desde la base de datos."
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        placeholder="Buscar por código, nombre o categoría..."
      />

      <div className="table-container data-table-scroll">
        <table className="servicio-table data-table">
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
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  No hay servicios registrados.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((servicio) => (
                <tr key={servicio.idServicio}>
                  <td>{servicio.codServicio}</td>
                  <td>{servicio.nombreServicio}</td>
                  <td>{servicio.categoria}</td>
                  <td>{servicio.duracionMin} min</td>
                  <td>{formatearPrecio(servicio.precio)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => onEditar(servicio)}
                      >
                        <Pencil size={15} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => onEliminar(servicio.idServicio)}
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

export default ServicioTable;
