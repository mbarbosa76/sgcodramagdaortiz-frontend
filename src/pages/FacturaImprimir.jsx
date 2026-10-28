
/*
 * ============================================================
 * FACTURAIMPRIMIR.JSX
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Vista exclusiva para consultar y realizar la impresion
 * de una factura registrada en el sistema.
 *
 * RESPONSABILIDADES:
 *
 * - Mostrar la informacion general de la factura.
 * - Presentar los datos del paciente y del profesional.
 * - Consultar los detalles de los servicios facturados.
 * - Mostrar cantidades, valores y total de la factura.
 * - Permitir la impresion del documento.
 *
 * La informacion de los detalles se obtiene desde el backend
 * desarrollado con Spring Boot.
 *
 * La URL del backend se obtiene desde src/config/api.js
 * para permitir el funcionamiento local y en la nube.
 *
 * ============================================================
 */

// Importa los hooks necesarios de React.
import {
    useEffect,
    useState
} from "react";

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";

// Importa los estilos de la vista de impresion.
import "./FacturaImprimir.css";


/*
 * ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================
 *
 * Recibe como propiedad la factura seleccionada y consulta
 * los detalles asociados a su identificador.
 */

/**
 * Muestra la factura y permite imprimirla.
 *
 * @param {Object} factura Informacion de la factura seleccionada.
 * @returns {JSX.Element} Vista de impresion de la factura.
 */
function FacturaImprimir({ factura }) {


    /*
     * ========================================================
     * ESTADO DE LOS DETALLES DE FACTURA
     * ========================================================
     *
     * Almacena los servicios y valores que pertenecen
     * a la factura seleccionada.
     */

    const [detalles, setDetalles] = useState([]);


    /*
     * ========================================================
     * CARGAR DETALLES DE FACTURA
     * ========================================================
     *
     * Consulta los detalles asociados al identificador
     * de la factura recibida como propiedad.
     *
     * Endpoint:
     * GET /api/detalles-factura/factura/{idFactura}
     *
     * La solicitud incluye el token JWT almacenado
     * durante el inicio de sesion.
     */

    useEffect(() => {

        // Evita realizar la consulta si no existe una factura.
        if (!factura?.idFactura) {

            setDetalles([]);

            return;

        }

        cargarDetalles();

    }, [factura?.idFactura]);


    /*
     * ========================================================
     * CONSULTAR DETALLES DE FACTURA
     * ========================================================
     */

    /**
     * Obtiene desde el backend los servicios relacionados
     * con la factura seleccionada.
     */
    const cargarDetalles = async () => {

        try {

            /*
             * Recupera el token JWT almacenado en el navegador.
             */
            const token = localStorage.getItem("token");


            /*
             * Construye la solicitud utilizando la URL
             * centralizada del backend.
             *
             * En desarrollo utiliza la direccion local.
             * En produccion utiliza VITE_API_URL.
             */
            const respuesta = await axios.get(

                `${API_BASE_URL}/detalles-factura/factura/${factura.idFactura}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );


            /*
             * Guarda los detalles recibidos para mostrarlos
             * en la tabla de servicios facturados.
             */
            setDetalles(respuesta.data);


        } catch (error) {

            /*
             * Registra el error para facilitar el diagnostico
             * si la consulta no puede completarse.
             */
            console.error(
                "Error cargando detalles de factura:",
                error
            );

        }

    };


    /*
     * ========================================================
     * IMPRIMIR FACTURA
     * ========================================================
     *
     * Utiliza la funcion de impresion del navegador.
     * Los estilos de impresion se controlan mediante CSS.
     */

    const imprimir = () => {

        window.print();

    };


    /*
     * ========================================================
     * INTERFAZ DE LA FACTURA
     * ========================================================
     */

    return (

        <div className="factura-documento">


            {/* ==================================================
                ENCABEZADO DEL CONSULTORIO
                ================================================== */}

            <div className="factura-encabezado">

                <h1>
                    🦷 Consultorio Odontológico
                </h1>

                <h2>
                    Dra. Magda Ortiz
                </h2>

                <p>
                    Sistema de Gestión de Citas Odontológicas
                </p>

            </div>


            <hr />


            {/* ==================================================
                INFORMACION GENERAL DE LA FACTURA
                ================================================== */}

            <div className="factura-info">

                <h2>
                    FACTURA DE VENTA
                </h2>

                <p>

                    <strong>
                        Número:
                    </strong>

                    {" "}

                    {factura.numeroFactura}

                </p>

                <p>

                    <strong>
                        Fecha:
                    </strong>

                    {" "}

                    {factura.fecha}

                </p>

                <p>

                    <strong>
                        Estado:
                    </strong>

                    {" "}

                    {factura.estadoPago}

                </p>

            </div>


            <hr />


            {/* ==================================================
                DATOS DEL PACIENTE Y DEL PROFESIONAL
                ================================================== */}

            <div className="cliente-info">

                <h3>
                    Datos del cliente
                </h3>

                <p>

                    <strong>
                        Paciente:
                    </strong>

                    {" "}

                    {factura.paciente?.nombre}

                    {" "}

                    {factura.paciente?.apellido}

                </p>

                <p>

                    <strong>
                        Documento:
                    </strong>

                    {" "}

                    {factura.paciente?.documento}

                </p>

                <p>

                    <strong>
                        Teléfono:
                    </strong>

                    {" "}

                    {factura.paciente?.telefono}

                </p>

                <p>

                    <strong>
                        Profesional:
                    </strong>

                    {" "}

                    {factura.cita?.profesional?.nombre}

                    {" "}

                    {factura.cita?.profesional?.apellido}

                </p>

            </div>


            <hr />


            {/* ==================================================
                DETALLE DE LOS SERVICIOS FACTURADOS
                ================================================== */}

            <h3>
                Detalle de servicios
            </h3>


            <table className="tabla-factura">

                <thead>

                    <tr>

                        <th>
                            Servicio
                        </th>

                        <th>
                            Cantidad
                        </th>

                        <th>
                            Valor
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {detalles.length === 0 ? (

                        /*
                         * Si no existen detalles disponibles,
                         * se muestra un mensaje informativo.
                         */

                        <tr>

                            <td colSpan="3">

                                No hay detalles registrados.

                            </td>

                        </tr>

                    ) : (

                        /*
                         * Recorre los detalles recibidos desde
                         * el backend y presenta cada servicio.
                         */

                        detalles.map(detalle => (

                            <tr key={detalle.idDetalle}>

                                <td>

                                    {
                                        detalle.servicio
                                            ?.nombreServicio
                                    }

                                </td>

                                <td>

                                    {
                                        detalle.cantidad
                                    }

                                </td>

                                <td>

                                    $

                                    {
                                        detalle.subtotal
                                            ?.toLocaleString("es-CO")
                                    }

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>


            {/* ==================================================
                TOTAL DE LA FACTURA
                ================================================== */}

            <div className="total-factura">

                <h2>

                    Total:

                    {" $"}

                    {
                        factura.total
                            ?.toLocaleString("es-CO")
                    }

                </h2>

            </div>


            {/* ==================================================
                MENSAJE FINAL
                ================================================== */}

            <p className="mensaje-final">

                Gracias por confiar en nosotros.

            </p>


            {/* ==================================================
                BOTON DE IMPRESION
                ================================================== */}

            <button

                type="button"

                className="btn-imprimir"

                onClick={imprimir}

            >

                Imprimir factura

            </button>


        </div>

    );

}


/*
 * ============================================================
 * EXPORTACION DEL COMPONENTE
 * ============================================================
 *
 * Permite utilizar esta vista desde los demas componentes
 * del frontend.
 */

export default FacturaImprimir;
