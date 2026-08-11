/*
============================================================
DashboardCharts.jsx

Sistema de Gestión de Citas Odontológicas

Componente encargado de mostrar gráficos
del Dashboard según el rol del usuario.

Gráficos disponibles:

ADMIN:

- Estado general de citas.
- Facturación mensual.


PROFESIONAL:

- Estado de sus propias citas.


RECEPCIONISTA:

- Estado operativo de citas.

============================================================
*/


import {

    useEffect,

    useState

} from "react";



import {

    PieChart,

    Pie,

    Cell,

    Tooltip,

    ResponsiveContainer,

    BarChart,

    Bar,

    XAxis,

    YAxis,

    CartesianGrid,

    Legend

} from "recharts";



import {

    obtenerCitasEstados,

    obtenerCitasEstadosProfesional,

    obtenerCitasEstadosRecepcionista,

    obtenerFacturacionMensual

} from "../services/DashboardChartService";



import "./DashboardCharts.css";








/*
============================================================
COLORES GRÁFICO CITAS

Orden esperado:

PROGRAMADA
CONFIRMADA
ASISTIDA
NO ASISTIDA
CANCELADA

============================================================
*/


const coloresEstados = [


    "#177c6b",


    "#3498db",


    "#16a085",


    "#f39c12",


    "#e74c3c"


];








function DashboardCharts({

    usuario

}) {





    /*
    ========================================================
    ESTADOS DE INFORMACIÓN

    ========================================================
    */


    const [citas, setCitas] =

        useState([]);



    const [facturacion, setFacturacion] =

        useState([]);








    /*
    ========================================================
    CARGAR GRÁFICOS SEGÚN ROL

    ADMIN:

    - Todas las citas.
    - Facturación mensual.


    PROFESIONAL:

    - Solo sus citas.


    RECEPCIONISTA:

    - Estados operativos.

    ========================================================
    */


    useEffect(() => {



        const cargarGraficos = async () => {



            try {



                let respuestaCitas;







                /*
                ================================================
                SELECCIÓN DE ENDPOINT SEGÚN ROL
                ================================================
                */


                if(usuario.rol === "Profesional"){



                    respuestaCitas =

                        await obtenerCitasEstadosProfesional();



                }

                else if(usuario.rol === "Recepcionista"){



                    respuestaCitas =

                        await obtenerCitasEstadosRecepcionista();



                }

                else{



                    respuestaCitas =

                        await obtenerCitasEstados();



                }







                setCitas(

                    respuestaCitas.data

                );








                /*
                ================================================
                FACTURACIÓN

                Solamente visible para administrador.

                ================================================
                */


                if(usuario.rol === "Admin"){



                    const respuestaFacturacion =

                        await obtenerFacturacionMensual();



                    setFacturacion(

                        respuestaFacturacion.data

                    );



                }

                else{


                    setFacturacion([]);


                }





            }

            catch(error){



                console.error(

                    "Error cargando gráficos:",

                    error

                );



            }



        };



        cargarGraficos();



    }, [usuario]);









    /*
    ========================================================
    FORMATEAR VALORES MONETARIOS

    ========================================================
    */


    const formatoMoneda = (

        valor

    ) => {



        return new Intl.NumberFormat(

            "es-CO",

            {

                style:"currency",

                currency:"COP"

            }

        ).format(valor);


    };









    return (



        <div className="dashboard-charts">





            <div className="chart-card">



                <h3>

                    Estado de citas

                </h3>






                <ResponsiveContainer

                    width="100%"

                    height={250}

                >



                    <PieChart>




                        <Pie

                            data={citas}

                            dataKey="cantidad"

                            nameKey="estado"

                            outerRadius={100}

                        >



                            {


                                citas.map(

                                    (item,index)=>(


                                        <Cell

                                            key={index}

                                            fill={

                                                coloresEstados[

                                                    index %

                                                    coloresEstados.length

                                                ]

                                            }

                                        />


                                    )

                                )


                            }



                        </Pie>




                        <Tooltip />



                        <Legend />




                    </PieChart>



                </ResponsiveContainer>



            </div>









            {


                usuario.rol === "Admin"

                &&



                <div className="chart-card">



                    <h3>

                        Facturación mensual

                    </h3>






                    <ResponsiveContainer

                        width="100%"

                        height={300}

                    >




                        <BarChart

                            data={facturacion}

                        >




                            <CartesianGrid />




                            <XAxis

                                dataKey="mes"

                            />





                            <YAxis

                                width={90}

                                tickFormatter={

                                    formatoMoneda

                                }

                            />





                            <Tooltip />





                            <Bar

                                dataKey="total"

                                fill="#177c6b"

                            />




                        </BarChart>





                    </ResponsiveContainer>



                </div>



            }



        </div>



    );


}



export default DashboardCharts;