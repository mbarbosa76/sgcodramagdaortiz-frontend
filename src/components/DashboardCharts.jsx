/*
============================================================
DashboardCharts.jsx

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Componente encargado de presentar los gráficos principales
del Dashboard.

Responsabilidades:

- Mostrar distribución de citas por estado.
- Mostrar facturación mensual para roles autorizados.
- Trabajar con información real ya cargada por Dashboard.jsx.
- Evitar peticiones duplicadas al backend.
- Mantener colores consistentes por estado.

============================================================
*/

import {
    Bar,
    CartesianGrid,
    Cell,
    ComposedChart,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import {
    useMemo
} from "react";

import {
    construirMesesDelPeriodo,
    convertirFechaDashboard as convertirFecha,
    obtenerEtiquetaPeriodo
} from "../utils/dashboardPeriodo";

import "./DashboardCharts.css";


/*
============================================================
CONFIGURACIÓN DE ESTADOS
============================================================
*/

const ESTADOS = [
    {
        estado: "ASISTIDA",
        etiqueta: "Asistida",
        color: "#078c78"
    },
    {
        estado: "PROGRAMADA",
        etiqueta: "Programada",
        color: "#14a58f"
    },
    {
        estado: "CONFIRMADA",
        etiqueta: "Confirmada",
        color: "#4a9df0"
    },
    {
        estado: "NO ASISTIDA",
        etiqueta: "No asistida",
        color: "#f3a04a"
    },
    {
        estado: "CANCELADA",
        etiqueta: "Cancelada",
        color: "#ef5d5d"
    }
];


const formatoMoneda = (
    valor
) => {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(Number(valor || 0));

};


/*
============================================================
FACTURACIÓN AGRUPADA POR MES
============================================================
*/

const construirFacturacionMensual = (
    facturas,
    periodo
) => {

    const meses =
        construirMesesDelPeriodo(periodo);

    const mostrarAnio =
        meses.length > 12 ||
        new Set(
            meses.map(fecha => fecha.getFullYear())
        ).size > 1;

    const totales =
        meses.map(
            fechaMes => {

                const total =
                    facturas.reduce(
                        (acumulado, factura) => {

                            const fecha =
                                convertirFecha(factura.fecha);

                            if(
                                fecha &&
                                fecha.getFullYear() === fechaMes.getFullYear() &&
                                fecha.getMonth() === fechaMes.getMonth()
                            ){
                                return acumulado + Number(factura.total || 0);
                            }

                            return acumulado;

                        },
                        0
                    );

                const nombreMes =
                    new Intl.DateTimeFormat(
                        "es-CO",
                        { month: "short" }
                    ).format(fechaMes).replace(".", "");

                return {
                    clave: `${fechaMes.getFullYear()}-${fechaMes.getMonth() + 1}`,
                    anio: fechaMes.getFullYear(),
                    numeroMes: fechaMes.getMonth() + 1,
                    mes: mostrarAnio
                        ? `${nombreMes} ${String(fechaMes.getFullYear()).slice(-2)}`
                        : nombreMes,
                    total
                };

            }
        );

    const promedio =
        totales.length > 0
            ? totales.reduce((suma, item) => suma + item.total, 0) / totales.length
            : 0;

    const meta =
        Math.round(promedio * 1.15);

    return totales.map(
        item => ({
            ...item,
            meta
        })
    );

};


/*
============================================================
TOOLTIP DE FACTURACIÓN
============================================================
*/

function TooltipFacturacion({
    active,
    payload,
    label
}) {

    if(!active || !payload?.length){
        return null;
    }

    const datos =
        payload[0]?.payload;

    return (
        <div className="billing-tooltip">
            <strong>{label}</strong>
            <span>
                Facturación: {formatoMoneda(datos?.total)}
            </span>
            <span>
                Meta: {formatoMoneda(datos?.meta)}
            </span>
        </div>
    );

}


function DashboardCharts({
    usuario,
    citas = [],
    facturas = [],
    periodo = null,
    onFiltrarCitas,
    onFiltrarFacturacion
}) {


    /*
    ========================================================
    DISTRIBUCIÓN DE CITAS
    ========================================================
    */

    const datosEstados = useMemo(
        () => {

            return ESTADOS.map(
                configuracion => ({
                    ...configuracion,
                    cantidad: citas.filter(
                        cita => cita.estado === configuracion.estado
                    ).length
                })
            );

        },
        [citas]
    );

    const totalCitas =
        datosEstados.reduce(
            (suma, estado) => suma + estado.cantidad,
            0
        );


    /*
    ========================================================
    FACTURACIÓN MENSUAL
    ========================================================
    */

    const facturacionMensual = useMemo(
        () => construirFacturacionMensual(facturas, periodo),
        [facturas, periodo]
    );


    const mostrarFacturacion =
        ["Admin", "Recepcionista"].includes(usuario.rol);

    const etiquetaPeriodo =
        obtenerEtiquetaPeriodo(periodo);


    return (
        <div
            className={
                mostrarFacturacion
                    ? "dashboard-charts"
                    : "dashboard-charts single"
            }
        >


            {/*
            ====================================================
            ESTADO DE CITAS
            ====================================================
            */}

            <article className="chart-card appointment-chart-card">

                <div className="chart-card-header">
                    <h3>Estado de citas</h3>
                    <button
                        type="button"
                        aria-label="Opciones del gráfico"
                    >
                        ⋮
                    </button>
                </div>

                <div className="appointment-chart-content">

                    <div className="donut-wrapper">

                        {
                            totalCitas > 0
                                ? (
                                    <ResponsiveContainer width="100%" height={185}>
                                        <PieChart>
                                            <Pie
                                                data={datosEstados}
                                                dataKey="cantidad"
                                                nameKey="etiqueta"
                                                innerRadius={62}
                                                outerRadius={90}
                                                paddingAngle={1}
                                                stroke="#ffffff"
                                                strokeWidth={2}
                                            >
                                                {
                                                    datosEstados.map(
                                                        estado => (
                                                            <Cell
                                                                key={estado.estado}
                                                                fill={estado.color}
                                                                className="dashboard-donut-segment"
                                                                onClick={() =>
                                                                    onFiltrarCitas?.(estado)
                                                                }
                                                            />
                                                        )
                                                    )
                                                }
                                            </Pie>

                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )
                                : (
                                    <div className="chart-empty-donut" />
                                )
                        }

                        <div className="donut-center">
                            <strong>{totalCitas}</strong>
                            <span>Total</span>
                        </div>

                    </div>

                    <div className="appointment-legend">

                        {
                            datosEstados.map(
                                estado => {

                                    const porcentaje =
                                        totalCitas > 0
                                            ? (estado.cantidad / totalCitas) * 100
                                            : 0;

                                    return (
                                        <button
                                            type="button"
                                            key={estado.estado}
                                            className="appointment-legend-row"
                                            onClick={() =>
                                                onFiltrarCitas?.(estado)
                                            }
                                            title={`Ver únicamente las citas ${estado.etiqueta.toLowerCase()}`}
                                        >
                                            <span
                                                className="appointment-legend-dot"
                                                style={{ background: estado.color }}
                                            />

                                            <span className="appointment-legend-name">
                                                {estado.etiqueta}
                                            </span>

                                            <strong>{estado.cantidad}</strong>

                                            <small>
                                                {porcentaje.toFixed(1)}%
                                            </small>
                                        </button>
                                    );

                                }
                            )
                        }

                    </div>

                </div>

                <div className="chart-card-footer">
                    <span>▣</span>
                    Haz clic en un estado para filtrar las citas
                </div>

            </article>


            {/*
            ====================================================
            FACTURACIÓN MENSUAL
            ====================================================
            */}

            {
                mostrarFacturacion &&
                <article className="chart-card billing-chart-card">

                    <div className="chart-card-header">
                        <div>
                            <h3>Facturación mensual</h3>
                            <div className="billing-legend">
                                <span><i className="billing-bar-dot" /> Facturación</span>
                                <span><i className="billing-line-dot" /> Meta</span>
                            </div>
                        </div>

                        <span
                            className="chart-period-chip"
                            title={etiquetaPeriodo}
                        >
                            {etiquetaPeriodo}
                        </span>
                    </div>

                    <div className="billing-chart-container">

                        <ResponsiveContainer width="100%" height={185}>
                            <ComposedChart
                                data={facturacionMensual}
                                margin={{
                                    top: 12,
                                    right: 14,
                                    bottom: 0,
                                    left: 6
                                }}
                            >

                                <CartesianGrid
                                    stroke="#edf1f2"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="mes"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#7a8795",
                                        fontSize: 11
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={72}
                                    tick={{
                                        fill: "#7a8795",
                                        fontSize: 10
                                    }}
                                    tickFormatter={valor => {
                                        if(valor >= 1000000){
                                            return `$ ${(valor / 1000000).toFixed(1)}M`;
                                        }
                                        if(valor >= 1000){
                                            return `$ ${Math.round(valor / 1000)}k`;
                                        }
                                        return `$ ${valor}`;
                                    }}
                                />

                                <Tooltip
                                    content={<TooltipFacturacion />}
                                    cursor={{ fill: "rgba(0, 137, 123, 0.04)" }}
                                />

                                <Bar
                                    dataKey="total"
                                    fill="#078c78"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={54}
                                    className="dashboard-billing-bar"
                                    onClick={datos => {
                                        const mesSeleccionado =
                                            datos?.payload || datos;

                                        if(mesSeleccionado?.anio && mesSeleccionado?.numeroMes){
                                            onFiltrarFacturacion?.(mesSeleccionado);
                                        }
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="meta"
                                    stroke="#7cbab3"
                                    strokeWidth={1.5}
                                    strokeDasharray="4 4"
                                    dot={{
                                        r: 3,
                                        fill: "#ffffff",
                                        stroke: "#7cbab3",
                                        strokeWidth: 1.5
                                    }}
                                    activeDot={{ r: 4 }}
                                />

                            </ComposedChart>
                        </ResponsiveContainer>

                    </div>

                    <div className="chart-card-footer">
                        Cifras en COP · haz clic en una barra para ver el mes
                    </div>

                </article>
            }

        </div>
    );

}

export default DashboardCharts;
