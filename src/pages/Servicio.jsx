/*
  ============================================================
  Servicio.jsx
  ============================================================

  PÃ¡gina principal del mÃ³dulo de Servicios OdontolÃ³gicos.

  Funcionalidades:

  - Consultar servicios registrados.
  - Registrar nuevos servicios.
  - Editar servicios existentes.
  - Eliminar servicios.
  - Validar informaciÃ³n del formulario.
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

import ServicioTable from "../components/ServicioTable";

/*
  Importa la URL centralizada del backend para desarrollo local
  y para el despliegue en la nube.
*/
import { API_BASE_URL } from "../config/api";

/*
  ------------------------------------------------------------
  ICONOS DEL MÃ“DULO (lucide-react)
  ------------------------------------------------------------

  "lucide-react" ya estÃ¡ instalado como dependencia del
  proyecto (ver package.json), asÃ que no requiere
  instalaciÃ³n adicional. Se importan solo los Ãconos que se
  usan en este archivo para que el empaquetador (Vite) no
  incluya en el build final Ãconos que no se usan.
*/
import { Save, Loader2, X } from "lucide-react";


function Servicio() {


    /*
      Estado inicial del formulario.
    */
    const servicioInicial = {

        codServicio: "",
        nombreServicio: "",
        descripcion: "",
        categoria: "",
        /*
          Se inicia en 15 (el valor mÃ¡s bajo del select)
          para que el campo nunca quede vacÃo y el usuario
          no tenga que abrir el desplegable solo para ver
          quÃ© opciones hay disponibles.
        */
        duracionMin: 15,
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
      que se estÃ¡ editando.
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
      Indica si hay una peticiÃ³n al backend en curso
      (guardar/actualizar). Se usa para deshabilitar el
      botÃ³n de guardar y mostrar un Ãcono de "cargando",
      evitando asÃ que el usuario haga doble clic y se
      registre el mismo servicio dos veces.
    */
    const [cargando, setCargando] =
        useState(false);



    /*
      ------------------------------------------------------------
      CATEGORÃAS DE SERVICIO (lista fija)
      ------------------------------------------------------------

      Antes este campo era de texto libre, lo que permitÃa que
      dos servicios quedaran con la misma categorÃa escrita de
      formas distintas (por ejemplo "Cirugia", "cirugÃa",
      "CirugÃa Oral"), lo cual iba a impedir mÃ¡s adelante que el
      mÃ³dulo de Citas pudiera filtrar correctamente los
      servicios segÃºn la especialidad del profesional
      seleccionado.

      Por eso se reemplaza el campo de texto libre por una
      lista desplegable con las categorÃas estÃ¡ndar de un
      consultorio odontolÃ³gico. Esta MISMA lista se reutilizarÃ¡
      cuando ajustemos el mÃ³dulo de Profesionales, para que la
      "especialidad" de cada profesional use exactamente los
      mismos nombres y asÃ el filtro Profesional -> Servicio
      funcione por coincidencia exacta.
    */
    const CATEGORIAS_SERVICIO = [

        "OdontologÃa General",
        "Preventiva",
        "Restaurativa / Operatoria",
        "Endodoncia",
        "Periodoncia",
        "CirugÃa Oral",
        "Ortodoncia",
        "PrÃ³tesis",
        "OdontopediatrÃa",
        "EstÃ©tica Dental"

    ];



    /*
      ------------------------------------------------------------
      DURACIONES DISPONIBLES (lista fija, en minutos)
      ------------------------------------------------------------

      Se definiÃ³ un rango de 15 a 60 minutos, en pasos de 15,
      porque cubre la gran mayorÃa de procedimientos
      odontolÃ³gicos comunes (desde una valoraciÃ³n rÃ¡pida hasta
      un procedimiento mÃ¡s largo como una endodoncia). Si en el
      futuro se necesitan procedimientos de mayor duraciÃ³n
      (por ejemplo cirugÃas mÃ¡s complejas), basta con agregar
      los valores que falten a este arreglo; el resto del
      formulario no necesita cambios.
    */
    const DURACIONES_DISPONIBLES = [
        15, 30, 45, 60
    ];





    /*
       URL base del backend.

       Se obtiene desde la configuracion central del frontend:
       - En desarrollo local utiliza la URL definida en api.js.
       - En produccion utiliza la variable VITE_API_URL.

       Se conserva la ruta /servicios utilizada por este modulo.
    */
    const API_URL = `${API_BASE_URL}/servicios`;





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


        /*
          Activa el estado de carga ANTES de iniciar la
          peticiÃ³n, para que el botÃ³n se deshabilite y
          muestre el Ãcono giratorio de inmediato, sin
          esperar a que la peticiÃ³n HTTP responda.
        */
        setCargando(true);


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


        } finally {

            /*
              Se desactiva el estado de carga sin importar si
              la peticiÃ³n tuvo Ã©xito o fallÃ³, para que el botÃ³n
              siempre vuelva a estar disponible y el usuario no
              quede "atascado" con el formulario deshabilitado
              ante, por ejemplo, un error de red.
            */
            setCargando(false);

        }


    };







    /*
      Carga informaciÃ³n del servicio
      seleccionado para editar.
    */
    const editarServicio = (servicioSeleccionado) => {


        /*
          NormalizaciÃ³n de datos para ediciÃ³n.
          El backend puede devolver la categorÃa como:
          - categoria: "Preventiva"
          - categoria: { idCategoria, nombre }
          - categoria: { id, nombre }
          TambiÃ©n se soporta idCategoria directo.
          Esto evita que el select quede en
          "Seleccione una categorÃa" al editar.
        */
        const categoriaOriginal =
            typeof servicioSeleccionado.categoria === "object"
                ? (
                    servicioSeleccionado.categoria.nombre ||
                    servicioSeleccionado.categoria.descripcion ||
                    ""
                  )
                : (
                    servicioSeleccionado.categoria ||
                    servicioSeleccionado.nombreCategoria ||
                    ""
                  );


        setServicio({

            ...servicioSeleccionado,

            categoria: categoriaOriginal

        });



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
                "Â¿Desea eliminar este servicio?"
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
                ENCABEZADO DEL MÃ“DULO
                ================================================= */}


<div className="module-header">


    <span className="module-tag">

        MÃ³dulo Servicio

    </span>



    <h2>

        GestiÃ³n de Servicios OdontolÃ³gicos

    </h2>



    <p>

        Administra los servicios odontolÃ³gicos
        disponibles en el consultorio.

    </p>


</div>







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

                    placeholder="CÃ³digo Servicio"

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

                    placeholder="DescripciÃ³n"

                    value={servicio.descripcion}

                    onChange={manejarCambio}

                />





                {/*
                  Antes era un <input type="text"> de texto
                  libre. Se cambia a <select> con una lista
                  fija (CATEGORIAS_SERVICIO, definida al
                  inicio del componente) para evitar que la
                  misma categorÃa quede escrita de formas
                  distintas entre servicios, lo cual romperÃa
                  el filtro Profesional -> Servicio que se
                  implementarÃ¡ en el mÃ³dulo de Citas.
                */}
                <select

                    name="categoria"

                    value={servicio.categoria}

                    onChange={manejarCambio}

                    required

                >

                    <option value="">

                        Seleccione una categorÃa

                    </option>

                    {CATEGORIAS_SERVICIO.map(

                        (cat) => (

                            <option
                                key={cat}
                                value={cat}
                            >
                                {cat}
                            </option>

                        )

                    )}

                </select>





                {/*
                  Se cambia de <input type="number"> libre a
                  <select> con valores fijos (15, 30, 45, 60
                  minutos, definidos en DURACIONES_DISPONIBLES),
                  segÃºn lo solicitado: iniciar en 15 minutos y
                  permitir pasos de 15 hasta un mÃ¡ximo de 60.
                  Esto evita valores invÃ¡lidos (por ejemplo 7
                  minutos, o -10) que un campo numÃ©rico libre sÃ
                  permitirÃa.
                */}
                <select

                    name="duracionMin"

                    value={servicio.duracionMin}

                    onChange={manejarCambio}

                    required

                >

                    {DURACIONES_DISPONIBLES.map(

                        (min) => (

                            <option
                                key={min}
                                value={min}
                            >
                                {min} minutos
                            </option>

                        )

                    )}

                </select>





                <input

                    type="number"

                    name="precio"

                    placeholder="Precio"

                    value={servicio.precio}

                    onChange={manejarCambio}

                    required

                />






                <button
                    type="submit"
                    className="btn-primary"
                    disabled={cargando}
                >


                    {cargando ? (
                        <>
                            <Loader2 size={17} className="spin-icon" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Save size={17} />
                            {editando ? "Actualizar" : "Guardar"}
                        </>
                    )}


                </button>





                {
                    editando &&


                    <button

                        type="button"

                        className="btn-secondary"

                        onClick={limpiarFormulario}

                        disabled={cargando}

                    >

                        <X size={17} />
                        Cancelar

                    </button>


                }




            </form>








            {/* =================================================
                TABLA DE SERVICIOS
                ================================================= */}



            <ServicioTable
                servicios={servicios}
                onEditar={editarServicio}
                onEliminar={eliminarServicio}
            />



        </div>

    );


}



export default Servicio;
