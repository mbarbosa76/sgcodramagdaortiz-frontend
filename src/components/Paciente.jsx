// ==========================================================
// Paciente.jsx
// Módulo de gestión de pacientes
// ==========================================================

// Importa useState y useEffect desde React
import { useState, useEffect } from 'react'

// Importa Axios para realizar peticiones HTTP
import axios from 'axios'

// Importa los estilos del módulo Paciente
import './Paciente.css'


// ==========================================================
// COMPONENTE PACIENTE
// ==========================================================

function Paciente() {

  // ========================================================
  // ESTADO DEL FORMULARIO
  // ========================================================

  // Almacena los datos que el usuario escribe
  const [paciente, setPaciente] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    correo: ''
  })


  // ========================================================
  // ESTADO DE LA LISTA DE PACIENTES
  // ========================================================

  // Almacena los pacientes que vienen desde Spring Boot
  const [pacientes, setPacientes] = useState([])


  // ========================================================
  // MANEJAR CAMBIOS EN LOS CAMPOS DEL FORMULARIO
  // ========================================================

  const handleChange = (e) => {

    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    })

  }


  // ========================================================
  // LIMPIAR FORMULARIO
  // ========================================================

  const limpiarFormulario = () => {

    setPaciente({
      documento: '',
      nombre: '',
      apellido: '',
      correo: ''
    })

  }


  // ========================================================
  // CARGAR TODOS LOS PACIENTES
  // ========================================================

  const cargarPacientes = async () => {

    try {

      // Realiza petición GET a Spring Boot
      const respuesta = await axios.get(
        'http://localhost:8765/api/pacientes'
      )

      // Guarda los pacientes recibidos
      setPacientes(respuesta.data)

      // Muestra los datos en consola para verificar
      console.log(
        'Pacientes cargados:',
        respuesta.data
      )

    } catch (error) {

      console.error(
        'Error al cargar los pacientes:',
        error
      )

    }

  }


  // ========================================================
  // CARGAR PACIENTES AUTOMÁTICAMENTE
  // ========================================================

  // Se ejecuta automáticamente cuando se abre el módulo
  useEffect(() => {

    cargarPacientes()

  }, [])


  // ========================================================
  // GUARDAR PACIENTE
  // ========================================================

  const guardarPaciente = async () => {

    // Validación de campos obligatorios
    if (
      !paciente.documento ||
      !paciente.nombre ||
      !paciente.apellido
    ) {

      alert(
        'Por favor complete los campos obligatorios.'
      )

      return

    }


    try {

      // Envía el paciente al backend Spring Boot
      const respuesta = await axios.post(
        'http://localhost:8765/api/pacientes',
        paciente
      )


      // Muestra en consola la respuesta del backend
      console.log(
        'Paciente guardado:',
        respuesta.data
      )


      // Mensaje de confirmación
      alert(
        'Paciente guardado correctamente.'
      )


      // Limpia el formulario
      limpiarFormulario()


      // Vuelve a consultar la base de datos
      // para actualizar la tabla
      cargarPacientes()


    } catch (error) {

      // Muestra el error completo en consola
      console.error(
        'Error al guardar el paciente:',
        error
      )


      // Si Spring Boot respondió con un error
      if (error.response) {

        console.error(
          'Estado HTTP:',
          error.response.status
        )

        console.error(
          'Respuesta del servidor:',
          error.response.data
        )


        alert(
          'No se pudo guardar el paciente. ' +
          'Revise la consola del navegador.'
        )

      } else {

        // Si no se pudo establecer conexión
        alert(
          'No fue posible conectar con Spring Boot. ' +
          'Verifique que el servidor esté ejecutándose.'
        )

      }

    }

  }


  // ========================================================
  // INTERFAZ VISUAL
  // ========================================================

  return (

    <section className="Paciente-module">


      {/* ==================================================
          ENCABEZADO DEL MÓDULO
          ================================================== */}

      <div className="module-header">

        <div>

          <span className="module-tag">
            Módulo Paciente
          </span>

          <h2>
            Gestión de Pacientes
          </h2>

          <p>
            Registra, consulta y administra la información
            básica de los pacientes.
          </p>

        </div>

      </div>


      {/* ==================================================
          FORMULARIO
          ================================================== */}

      <div className="card form-card">

        <h3>
          Formulario Paciente
        </h3>


        <form className="Paciente-form">


          {/* ==============================================
              DOCUMENTO
              ============================================== */}

          <div className="form-group">

            <label>
              Documento
            </label>

            <input
              type="text"
              name="documento"
              value={paciente.documento}
              onChange={handleChange}
              placeholder="Ingrese el documento"
            />

          </div>


          {/* ==============================================
              NOMBRE
              ============================================== */}

          <div className="form-group">

            <label>
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              value={paciente.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
            />

          </div>


          {/* ==============================================
              APELLIDO
              ============================================== */}

          <div className="form-group">

            <label>
              Apellido
            </label>

            <input
              type="text"
              name="apellido"
              value={paciente.apellido}
              onChange={handleChange}
              placeholder="Ingrese el apellido"
            />

          </div>


          {/* ==============================================
              CORREO ELECTRÓNICO
              ============================================== */}

          <div className="form-group full">

            <label>
              Correo Electrónico
            </label>

            <input
              type="email"
              name="correo"
              value={paciente.correo}
              onChange={handleChange}
              placeholder="Ingrese el correo electrónico"
            />

          </div>


          {/* ==============================================
              BOTONES
              ============================================== */}

          <div className="form-buttons">


            {/* BOTÓN GUARDAR */}

            <button
              type="button"
              className="btn-primary"
              onClick={guardarPaciente}
            >
              Guardar
            </button>


            {/* BOTÓN LIMPIAR */}

            <button
              type="button"
              className="btn-secondary"
              onClick={limpiarFormulario}
            >
              Limpiar
            </button>

          </div>

        </form>

      </div>


      {/* ==================================================
          TABLA DE PACIENTES
          ================================================== */}

      <div className="card table-card">


        {/* TÍTULO DE LA TABLA */}

        <div className="table-title">

          <h3>
            Pacientes Registrados
          </h3>

          <p>
            Lista de pacientes registrados en la base de datos.
          </p>

        </div>


        {/* TABLA */}

        <table className="Paciente-table">


          {/* ==============================================
              ENCABEZADOS
              ============================================== */}

          <thead>

            <tr>

              <th>
                ID
              </th>

              <th>
                Documento
              </th>

              <th>
                Nombre
              </th>

              <th>
                Apellido
              </th>

              <th>
                Correo
              </th>

              <th>
                Acciones
              </th>

            </tr>

          </thead>


          {/* ==============================================
              CUERPO DE LA TABLA
              ============================================== */}

          <tbody>


            {/* Recorre todos los pacientes recibidos
                desde Spring Boot */}

            {pacientes.map((paciente) => (

              <tr
                key={paciente.idPaciente}
              >


                {/* ID */}

                <td>
                  {paciente.idPaciente}
                </td>


                {/* DOCUMENTO */}

                <td>
                  {paciente.documento}
                </td>


                {/* NOMBRE */}

                <td>
                  {paciente.nombre}
                </td>


                {/* APELLIDO */}

                <td>
                  {paciente.apellido}
                </td>


                {/* CORREO */}

                <td>
                  {paciente.correo}
                </td>


                {/* ACCIONES */}

                <td>


                  {/* BOTÓN EDITAR */}

                  <button
                    type="button"
                    className="btn-edit"
                  >
                    Editar
                  </button>


                  {/* BOTÓN ELIMINAR */}

                  <button
                    type="button"
                    className="btn-delete"
                  >
                    Eliminar
                  </button>


                </td>

              </tr>

            ))}


            {/* =================================================
                MENSAJE CUANDO NO HAY PACIENTES
                ================================================= */}

            {pacientes.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                >
                  No hay pacientes registrados.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>

  )

}


// ==========================================================
// EXPORTAR COMPONENTE
// ==========================================================

export default Paciente

