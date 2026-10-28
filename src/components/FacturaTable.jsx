import { useState } from "react";
import { Pencil, Printer, Trash2 } from "lucide-react";
import ModuleTableHeader from "./ModuleTableHeader";

function FacturaTable({
  facturas,
  onEditar,
  eliminarFactura,
  imprimirFactura,
}) {
  const [busqueda, setBusqueda] = useState("");

  const facturasFiltradas = (facturas || []).filter((factura) =>
    JSON.stringify(factura)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="card table-card data-table-card">
      <ModuleTableHeader
        titulo="Facturas Registradas"
        descripcion="Información financiera generada directamente desde el sistema."
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        placeholder="Buscar por número, paciente, cédula, estado..."
      />

      <div className="table-container data-table-scroll">
        <table className="Factura-table data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {facturasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table">
                  No hay facturas registradas.
                </td>
              </tr>
            ) : (
              facturasFiltradas.map((factura) => (
                <tr key={factura.idFactura}>
                  <td>{factura.idFactura}</td>
                  <td>{factura.numeroFactura}</td>
                  <td>
                    {factura.paciente?.nombre} {factura.paciente?.apellido}
                  </td>
                  <td>{factura.fecha}</td>
                  <td>
                    <span
                      className={
                        factura.estadoPago === "PAGADA"
                          ? "estado-pagada"
                          : factura.estadoPago === "CANCELADA"
                            ? "estado-cancelada"
                            : "estado-pendiente"
                      }
                    >
                      {factura.estadoPago}
                    </span>
                  </td>
                  <td>
                    ${Number(factura.total || 0).toLocaleString("es-CO")}
                  </td>
                  <td>
                    <div className="factura-actions">
                      <button
                        type="button"
                        className="btn-edit"
                        title="Editar factura"
                        onClick={() => onEditar(factura)}
                      >
                        <Pencil size={15} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        title="Eliminar factura"
                        onClick={() => eliminarFactura(factura.idFactura)}
                      >
                        <Trash2 size={15} />
                        Eliminar
                      </button>

                      <button
                        type="button"
                        className="btn-print"
                        title="Imprimir factura"
                        onClick={() => imprimirFactura(factura)}
                      >
                        <Printer size={15} />
                        Imprimir
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

export default FacturaTable;
