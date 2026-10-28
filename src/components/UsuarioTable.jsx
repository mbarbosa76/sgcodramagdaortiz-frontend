import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ModuleTableHeader from "./ModuleTableHeader";

function UsuarioTable({ usuarios, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const registrosFiltrados = (usuarios || []).filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="card table-card data-table-card">
      <ModuleTableHeader
        titulo="Usuarios Registrados"
        descripcion="Información obtenida directamente desde la base de datos."
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        placeholder="Buscar por usuario, nombre, correo, teléfono..."
      />

      <div className="table-container data-table-scroll">
        <table className="Usuario-table data-table">
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
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-table">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((usuario) => (
                <tr key={usuario.idUsuario}>
                  <td>{usuario.idUsuario}</td>
                  <td>{usuario.username}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.telefono || "Sin teléfono"}</td>
                  <td>
                    <span
                      className={`rol-badge rol-${(usuario.rol || "").toLowerCase()}`}
                    >
                      {usuario.rol}
                    </span>
                  </td>
                  <td>{usuario.fechaCreacion || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => onEditar(usuario)}
                      >
                        <Pencil size={15} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => onEliminar(usuario.idUsuario)}
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

export default UsuarioTable;
