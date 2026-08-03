/*
  ============================================================
  Servicio.jsx
  ============================================================

  Página principal del módulo de Servicios Odontológicos.

  Funcionalidades:

  - Consultar servicios registrados.
  - Registrar nuevos servicios.
  - Editar servicios existentes.
  - Eliminar servicios.
  - Validar información del formulario.
  - Consumir API REST desarrollada en Spring Boot.

  Endpoint utilizado:

  GET     /api/servicios
  POST    /api/servicios
  PUT     /api/servicios/{id}
  DELETE  /api/servicios/{id}

  ============================================================
*/


import { useEffect, useState } from "react";

import "./Servicio.css";


function Servicio() {


    /*
      Estado inicial del formulario.
    */
    const servicioInicial = {

        codServicio: "",
        nombreServicio: "",
        descripcion: "",
        categoria: "",
        duracionMin: "",
        precio: ""

    };



    /*
      Lista de servicios consultados
      desde la base de datos.
    */
    const [servicios, setServicios] = useState([]);



    /*
      Datos actuales del formulario.
    */
    const [servicio, setServicio] =
        useState(servicioInicial);



    /*
      Identificador del servicio
      que se está editando.
    */
    const [editando, setEditando] =
        useState(false);



    const [idEditar, setIdEditar] =
        useState(null);



    /*
      Mensaje informativo para el usuario.
    */
    const [mensaje, setMensaje] =
        useState("");





    /*
      URL base del backend.
    */
    const API_URL =
        "http://localhost:8765/api/servicios";





    /*
      Al cargar el componente consulta
      todos los servicios registrados.
    */
    useEffect(() => {


        cargarServicios();


    }, []);





    /*
      Consulta GET de servicios.
    */
    const cargarServicios = async () => {


        try {


            const token =
                localStorage.getItem("token");



            const respuesta =
                await fetch(API_URL, {


                    headers: {


                        "Authorization":
                        `Bearer ${token}`


                    }


                });



            if (respuesta.ok) {


                const datos =
                    await respuesta.json();



                setServicios(datos);


            }



        } catch(error) {


            console.error(
                "Error consultando servicios:",
                error
            );


        }


    };







    /*
      Captura cambios realizados
      en los campos del formulario.
    */
    const manejarCambio = (e) => {


        setServicio({

            ...servicio,

            [e.target.name]:
            e.target.value

        });


    };







    /*
      Guarda un nuevo servicio
      o actualiza uno existente.
    */
    const guardarServicio = async (e) => {


        e.preventDefault();



        try {



            const token =
                localStorage.getItem("token");



            const metodo =
                editando ? "PUT" : "POST";



            const url =
                editando

                ? `${API_URL}/${idEditar}`

                : API_URL;





            const respuesta =
                await fetch(url, {


                    method: metodo,


                    headers: {


                        "Content-Type":
                        "application/json",


                        "Authorization":
                        `Bearer ${token}`


                    },


                    body:
                    JSON.stringify(servicio)


                });





            if(respuesta.ok){


                setMensaje(

                    editando

                    ? "Servicio actualizado correctamente"

                    : "Servicio registrado correctamente"

                );



                limpiarFormulario();


                cargarServicios();


            }


        } catch(error){


            console.error(
                "Error guardando servicio:",
                error
            );


        }


    };







    /*
      Carga información del servicio
      seleccionado para editar.
    */
    const editarServicio = (servicioSeleccionado) => {


        setServicio(servicioSeleccionado);



        setIdEditar(
            servicioSeleccionado.idServicio
        );



        setEditando(true);



        window.scrollTo({

            top:0,

            behavior:"smooth"

        });


    };







    /*
      Elimina un servicio.
    */
    const eliminarServicio = async(id) => {


        const confirmar =
            window.confirm(
                "¿Desea eliminar este servicio?"
            );



        if(!confirmar){

            return;

        }



        try{


            const token =
                localStorage.getItem("token");



            const respuesta =
                await fetch(
                    `${API_URL}/${id}`,
                    {


                        method:"DELETE",


                        headers:{


                            "Authorization":
                            `Bearer ${token}`


                        }


                    }

                );



            if(respuesta.status === 204){



                setMensaje(
                    "Servicio eliminado correctamente"
                );



                cargarServicios();



            }



        }catch(error){


            console.error(
                "Error eliminando servicio:",
                error
            );


        }


    };







    /*
      Limpia formulario.
    */
    const limpiarFormulario = () => {


        setServicio(servicioInicial);


        setEditando(false);


        setIdEditar(null);


    };







    return (

        <div className="servicio-container">





            {/* =================================================
                ENCABEZADO DEL MÓDULO
                ================================================= */}


            <span className="module-label">

                Módulo Servicio

            </span>




            <h2>

                Gestión de Servicios Odontológicos

            </h2>



            <p className="module-description">

                Administra los servicios odontológicos
                disponibles en el consultorio.

            </p>







            {
                mensaje &&

                <div className="mensaje">

                    {mensaje}

                </div>

            }







            {/* =================================================
                FORMULARIO
                ================================================= */}



            <form
                className="servicio-form"
                onSubmit={guardarServicio}
            >



                <input

                    type="text"

                    name="codServicio"

                    placeholder="Código Servicio"

                    value={servicio.codServicio}

                    onChange={manejarCambio}

                    required

                />




                <input

                    type="text"

                    name="nombreServicio"

                    placeholder="Nombre Servicio"

                    value={servicio.nombreServicio}

                    onChange={manejarCambio}

                    required

                />





                <textarea

                    name="descripcion"

                    placeholder="Descripción"

                    value={servicio.descripcion}

                    onChange={manejarCambio}

                />





                <input

                    type="text"

                    name="categoria"

                    placeholder="Categoría"

                    value={servicio.categoria}

                    onChange={manejarCambio}

                />





                <input

                    type="number"

                    name="duracionMin"

                    placeholder="Duración minutos"

                    value={servicio.duracionMin}

                    onChange={manejarCambio}

                    required

                />





                <input

                    type="number"

                    name="precio"

                    placeholder="Precio"

                    value={servicio.precio}

                    onChange={manejarCambio}

                    required

                />






                <button type="submit">


                    {
                        editando

                        ? "Actualizar"

                        : "Guardar"

                    }


                </button>





                {
                    editando &&


                    <button

                        type="button"

                        onClick={limpiarFormulario}

                    >

                        Cancelar

                    </button>


                }




            </form>








            {/* =================================================
                TABLA DE SERVICIOS
                ================================================= */}



            <table className="servicio-table">


                <thead>


                    <tr>


                        <th>

                            Código

                        </th>


                        <th>

                            Nombre

                        </th>


                        <th>

                            Categoría

                        </th>


                        <th>

                            Duración

                        </th>


                        <th>

                            Precio

                        </th>


                        <th>

                            Acciones

                        </th>


                    </tr>


                </thead>





                <tbody>



                {
                    servicios.map(
                        (item)=>(


                        <tr key={item.idServicio}>


                            <td>

                                {item.codServicio}

                            </td>



                            <td>

                                {item.nombreServicio}

                            </td>



                            <td>

                                {item.categoria}

                            </td>



                            <td>

                                {item.duracionMin}
                                {" "}
                                min

                            </td>



                            <td>

                                ${item.precio}

                            </td>




                            <td>


                                <button

                                    onClick={() =>
                                        editarServicio(item)
                                    }

                                >

                                    Editar

                                </button>



                                <button

                                    onClick={() =>
                                        eliminarServicio(
                                            item.idServicio
                                        )
                                    }

                                >

                                    Eliminar

                                </button>



                            </td>



                        </tr>


                    ))

                }



                </tbody>



            </table>





        </div>

    );


}



export default Servicio;