/*
  ============================================================
  Cita.jsx
  ============================================================

  Página principal del módulo de gestión de citas.

  Funcionalidades:

  - Consultar citas desde Spring Boot.
  - Registrar nuevas citas.
  - Editar citas existentes.
  - Eliminar citas.
  - Cargar pacientes desde el backend.
  - Cargar servicios desde el backend.
  - Relacionar una cita con un paciente.
  - Relacionar una cita con un servicio.
  - Validar los datos antes de enviarlos.
  - Validar fechas y horarios.
  - Mostrar mensajes informativos al usuario.
  - Desplazarse automáticamente al formulario al editar.
  - Mantener una interfaz organizada y responsiva.

  Arquitectura:

  React
      ↓
  Axios
      ↓
  Spring Boot
      ↓
  MySQL
*/


import { useEffect, useRef, useState } from 'react'

import axios from 'axios'

import './Cita.css'


/*
  ============================================================
  CONFIGURACIÓN DE LA API
  ============================================================
*/

const API_URL = 'http://localhost:8765/api'

// Obtiene los encabezados con el token JWT
// almacenado en el navegador tras iniciar sesión.
const obtenerConfigAuth = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

/*
  ============================================================
  CONSTANTES DE VALIDACIÓN
  ============================================================
*/

/*
  Horario de atención del consultorio.

  Se establece como horario de ejemplo:

  Lunes a viernes:
  08:00 a 18:00

  Sábado:
  08:00 a 14:00

  Domingo:
  No se permiten citas.
*/

const HORA_INICIO_LUNES_VIERNES = '08:00'

const HORA_FIN_LUNES_VIERNES = '18:00'

const HORA_INICIO_SABADO = '08:00'

const HORA_FIN_SABADO = '14:00'


/*
  Duración mínima y máxima permitida
  para una cita.
*/

const DURACION_MINIMA = 15

const DURACION_MAXIMA = 180


/*
  ============================================================
  COMPONENTE PRINCIPAL
  ============================================================
*/

function Cita() {


  /*
    ============================================================
    REFERENCIA AL ENCABEZADO
    ============================================================

    Permite desplazar automáticamente la pantalla
    al encabezado cuando se selecciona "Editar".
  */

  const encabezadoCitaRef = useRef(null)


  /*
    ============================================================
    ESTADOS
    ============================================================
  */

  /*
    Lista de citas obtenidas desde Spring Boot.
  */

  const [citas, setCitas] = useState([])


  /*
    Lista de pacientes obtenidos desde Spring Boot.
  */

  const [pacientes, setPacientes] = useState([])


  /*
    Lista de servicios obtenidos desde Spring Boot.
  */

  const [servicios, setServicios] = useState([])


  /*
    ID de la cita que se está editando.

    null = nueva cita.

    número = edición.
  */

  const [idCitaEditando, setIdCitaEditando] = useState(null)


  /*
    Datos del formulario.
  */

  const [cita, setCita] = useState({

    idPaciente: '',

    idProfesional: '',

    idServicio: '',

    fecha: '',

    horaInicio: '',

    duracionMin: '',

    sala: '',

    estado: 'PROGRAMADA',

    observacion: ''

  })


  /*
    Mensaje general mostrado al usuario.
  */

  const [mensaje, setMensaje] = useState('')


  /*
    Tipo del mensaje:

    exito
    error
    advertencia
  */

  const [tipoMensaje, setTipoMensaje] = useState('')


  /*
    ============================================================
    CARGA INICIAL
    ============================================================
  */

  useEffect(() => {

    cargarCitas()

    cargarPacientes()

    cargarServicios()

  }, [])


  /*
    ============================================================
    CARGAR CITAS
    ============================================================
  */

  const cargarCitas = async () => {

    try {

      const respuesta = await axios.get(
        `${API_URL}/citas`,
        obtenerConfigAuth()
      )

      setCitas(respuesta.data)

    } catch (error) {

      console.error(
        'Error al cargar las citas:',
        error
      )

      mostrarMensaje(
        'No fue posible cargar las citas registradas.',
        'error'
      )

    }

  }


  /*
    ============================================================
    CARGAR PACIENTES
    ============================================================
  */

  const cargarPacientes = async () => {

    try {

      const respuesta = await axios.get(
        `${API_URL}/pacientes`,
        obtenerConfigAuth()
      )

      setPacientes(respuesta.data)

    } catch (error) {

      console.error(
        'Error al cargar los pacientes:',
        error
      )

      mostrarMensaje(
        'No fue posible cargar los pacientes.',
        'error'
      )

    }

  }


  /*
    ============================================================
    CARGAR SERVICIOS
    ============================================================
  */

  const cargarServicios = async () => {

    try {

      const respuesta = await axios.get(
        `${API_URL}/servicios`,
        obtenerConfigAuth()
      )

      setServicios(respuesta.data)

    } catch (error) {

      console.error(
        'Error al cargar los servicios:',
        error
      )

      mostrarMensaje(
        'No fue posible cargar los servicios.',
        'error'
      )

    }

  }


  /*
    ============================================================
    MOSTRAR MENSAJE
    ============================================================
  */

  const mostrarMensaje = (texto, tipo) => {

    setMensaje(texto)

    setTipoMensaje(tipo)

  }


  /*
    ============================================================
    MANEJAR CAMBIOS DEL FORMULARIO
    ============================================================
  */

  const handleChange = (e) => {

    const { name, value } = e.target


    setCita({

      ...cita,

      [name]: value

    })


    /*
      Si el usuario modifica el formulario,
      eliminamos el mensaje anterior para evitar
      confusión.
    */

    if (mensaje) {

      setMensaje('')

      setTipoMensaje('')

    }

  }


  /*
    ============================================================
    OBTENER FECHA ACTUAL
    ============================================================
  */

  const obtenerFechaActual = () => {

    const fecha = new Date()

    const anio = fecha.getFullYear()

    const mes = String(
      fecha.getMonth() + 1
    ).padStart(2, '0')

    const dia = String(
      fecha.getDate()
    ).padStart(2, '0')

    return `${anio}-${mes}-${dia}`

  }


  /*
    ============================================================
    VALIDAR FECHA
    ============================================================
  */

  const validarFecha = () => {

    if (!cita.fecha) {

      return 'Debe seleccionar la fecha de la cita.'

    }


    const fechaSeleccionada = new Date(
      `${cita.fecha}T00:00:00`
    )

    const fechaActual = new Date(
      `${obtenerFechaActual()}T00:00:00`
    )


    /*
      No se permiten citas en fechas anteriores
      al día actual.
    */

    if (fechaSeleccionada < fechaActual) {

      return 'La fecha de la cita no puede ser anterior a la fecha actual.'

    }


    /*
      JavaScript:

      0 = domingo
      1 = lunes
      ...
      6 = sábado
    */

    const diaSemana =
      fechaSeleccionada.getDay()


    /*
      Domingo no disponible.
    */

    if (diaSemana === 0) {

      return 'El consultorio no tiene atención los domingos.'

    }


    return ''

  }


  /*
    ============================================================
    VALIDAR HORARIO
    ============================================================
  */

  const validarHorario = () => {

    if (!cita.horaInicio) {

      return 'Debe seleccionar la hora de inicio de la cita.'

    }


    const fechaSeleccionada = new Date(
      `${cita.fecha}T00:00:00`
    )


    const diaSemana =
      fechaSeleccionada.getDay()


    /*
      Para sábado:

      08:00 - 14:00
    */

    if (diaSemana === 6) {

      if (
        cita.horaInicio < HORA_INICIO_SABADO ||
        cita.horaInicio >= HORA_FIN_SABADO
      ) {

        return 'Los sábados las citas deben programarse entre las 08:00 y las 14:00.'

      }

    }


    /*
      Para lunes a viernes:

      08:00 - 18:00
    */

    else {

      if (
        cita.horaInicio < HORA_INICIO_LUNES_VIERNES ||
        cita.horaInicio >= HORA_FIN_LUNES_VIERNES
      ) {

        return 'Las citas de lunes a viernes deben programarse entre las 08:00 y las 18:00.'

      }

    }


    return ''

  }


  /*
    ============================================================
    VALIDAR DURACIÓN
    ============================================================
  */

  const validarDuracion = () => {

    /*
      La duración es obligatoria.
    */

    if (
      cita.duracionMin === '' ||
      cita.duracionMin === null
    ) {

      return 'Debe indicar la duración de la cita.'

    }


    const duracion =
      Number(cita.duracionMin)


    /*
      Debe ser un número válido.
    */

    if (
      Number.isNaN(duracion)
    ) {

      return 'La duración debe ser un número válido.'

    }


    /*
      Mínimo permitido.
    */

    if (
      duracion < DURACION_MINIMA
    ) {

      return `La duración mínima de una cita es de ${DURACION_MINIMA} minutos.`

    }


    /*
      Máximo permitido.
    */

    if (
      duracion > DURACION_MAXIMA
    ) {

      return `La duración máxima de una cita es de ${DURACION_MAXIMA} minutos.`

    }


    return ''

  }


  /*
    ============================================================
    VALIDAR CAMPOS DE TEXTO
    ============================================================
  */

  const validarCamposTexto = () => {

    /*
      Sala / consultorio.
    */

    if (
      cita.sala &&
      cita.sala.trim().length > 50
    ) {

      return 'La sala o consultorio no puede superar los 50 caracteres.'

    }


    /*
      Observación.
    */

    if (
      cita.observacion &&
      cita.observacion.trim().length > 500
    ) {

      return 'La observación no puede superar los 500 caracteres.'

    }


    return ''

  }


  /*
    ============================================================
    VALIDAR PROFESIONAL
    ============================================================
  */

  const validarProfesional = () => {

    /*
      Si el campo está vacío se permite continuar
      porque actualmente el backend lo maneja como
      un campo opcional.
    */

    if (
      cita.idProfesional === ''
    ) {

      return ''

    }


    const profesional =
      Number(cita.idProfesional)


    if (
      Number.isNaN(profesional) ||
      profesional <= 0
    ) {

      return 'El ID del profesional debe ser un número válido mayor que cero.'

    }


    return ''

  }


  /*
    ============================================================
    VALIDAR FORMULARIO COMPLETO
    ============================================================
  */

  const validarFormulario = () => {

    /*
      Paciente obligatorio.
    */

    if (
      !cita.idPaciente
    ) {

      return 'Debe seleccionar un paciente.'

    }


    /*
      Servicio obligatorio.
    */

    if (
      !cita.idServicio
    ) {

      return 'Debe seleccionar un servicio.'

    }


    /*
      Fecha.
    */

    const errorFecha =
      validarFecha()

    if (errorFecha) {

      return errorFecha

    }


    /*
      Hora.
    */

    const errorHora =
      validarHorario()

    if (errorHora) {

      return errorHora

    }


    /*
      Duración.
    */

    const errorDuracion =
      validarDuracion()

    if (errorDuracion) {

      return errorDuracion

    }


    /*
      Profesional.
    */

    const errorProfesional =
      validarProfesional()

    if (errorProfesional) {

      return errorProfesional

    }


    /*
      Campos de texto.
    */

    const errorTexto =
      validarCamposTexto()

    if (errorTexto) {

      return errorTexto

    }


    return ''

  }


  /*
    ============================================================
    LIMPIAR FORMULARIO
    ============================================================
  */

  const limpiarFormulario = () => {

    setCita({

      idPaciente: '',

      idProfesional: '',

      idServicio: '',

      fecha: '',

      horaInicio: '',

      duracionMin: '',

      sala: '',

      estado: 'PROGRAMADA',

      observacion: ''

    })


    setIdCitaEditando(null)

    setMensaje('')

    setTipoMensaje('')

  }


  /*
    ============================================================
    GUARDAR CITA
    ============================================================
  */

  const guardarCita = async () => {

    /*
      Primero validamos toda la información.
    */

    const errorValidacion =
      validarFormulario()


    if (errorValidacion) {

      mostrarMensaje(
        errorValidacion,
        'error'
      )

      return

    }


    try {

      /*
        Transformamos los datos del formulario
        al formato esperado por Spring Boot.
      */

      const datosCita = {

        paciente: {

          idPaciente:
            Number(cita.idPaciente)

        },

        idProfesional:
          cita.idProfesional
            ? Number(cita.idProfesional)
            : null,

        idServicio:
          cita.idServicio
            ? Number(cita.idServicio)
            : null,

        fecha:
          cita.fecha,

        horaInicio:
          cita.horaInicio,

        duracionMin:
          Number(cita.duracionMin),

        sala:
          cita.sala.trim(),

        estado:
          cita.estado,

        observacion:
          cita.observacion.trim()

      }


      /*
        ========================================================
        ACTUALIZAR CITA
        ========================================================
      */

      if (
        idCitaEditando !== null
      ) {

        await axios.post(
          `${API_URL}/citas`,
          datosCita,
          obtenerConfigAuth()
        )


        mostrarMensaje(

          'La cita fue actualizada correctamente.',

          'exito'

        )

      }


      /*
        ========================================================
        REGISTRAR CITA
        ========================================================
      */

      else {

        await axios.post(
          `${API_URL}/citas`,
          datosCita,
          obtenerConfigAuth()
        )


        mostrarMensaje(

          'La cita fue registrada correctamente.',

          'exito'

        )

      }


      /*
        Actualizamos la tabla con la información
        más reciente de MySQL.
      */

      await cargarCitas()


      /*
        Limpiamos los campos.
      */

      setCita({

        idPaciente: '',

        idProfesional: '',

        idServicio: '',

        fecha: '',

        horaInicio: '',

        duracionMin: '',

        sala: '',

        estado: 'PROGRAMADA',

        observacion: ''

      })


      setIdCitaEditando(null)


    } catch (error) {

      console.error(
        'Error al guardar la cita:',
        error
      )


      console.error(
        'Respuesta del servidor:',
        error.response?.data
      )


      /*
        Intentamos mostrar un mensaje
        más específico cuando Spring Boot
        devuelve información.
      */

      let mensajeError =
        'No fue posible registrar o actualizar la cita. Revise los datos.'


      if (
        error.response?.status === 400
      ) {

        mensajeError =
          'El servidor rechazó los datos de la cita. Revise los campos obligatorios y los valores ingresados.'

      }


      if (
        error.response?.status === 500
      ) {

        mensajeError =
          'Se produjo un error en el servidor. Revise la conexión con Spring Boot y la base de datos.'

      }


      mostrarMensaje(
        mensajeError,
        'error'
      )

    }

  }


  /*
    ============================================================
    EDITAR CITA
    ============================================================
  */

  const editarCita = (citaSeleccionada) => {

    /*
      Validamos que exista el ID.
    */

    if (
      !citaSeleccionada.idCita
    ) {

      mostrarMensaje(
        'No fue posible identificar el ID de la cita.',
        'error'
      )

      return

    }


    /*
      Guardamos el ID que estamos editando.
    */

    setIdCitaEditando(
      citaSeleccionada.idCita
    )


    /*
      Cargamos la información de la cita
      en el formulario.
    */

    setCita({

      idPaciente:

        citaSeleccionada.paciente?.idPaciente

          ? String(
              citaSeleccionada.paciente.idPaciente
            )

          : '',


      idProfesional:

        citaSeleccionada.idProfesional

          ? String(
              citaSeleccionada.idProfesional
            )

          : '',


      idServicio:

        citaSeleccionada.idServicio

          ? String(
              citaSeleccionada.idServicio
            )

          : '',


      fecha:
        citaSeleccionada.fecha || '',


      horaInicio:

        citaSeleccionada.horaInicio

          ? citaSeleccionada.horaInicio.substring(
              0,
              5
            )

          : '',


      duracionMin:

        citaSeleccionada.duracionMin

          ? String(
              citaSeleccionada.duracionMin
            )

          : '',


      sala:
        citaSeleccionada.sala || '',


      estado:
        citaSeleccionada.estado || 'PROGRAMADA',


      observacion:
        citaSeleccionada.observacion || ''

    })


    /*
      Mostramos mensaje informativo.
    */

    mostrarMensaje(
      `Editando la cita #${citaSeleccionada.idCita}. Modifique los datos y seleccione "Actualizar".`,
      'advertencia'
    )


    /*
      Desplazamos la pantalla al encabezado.
    */

    setTimeout(() => {

      encabezadoCitaRef.current?.scrollIntoView({

        behavior: 'smooth',

        block: 'start'

      })

    }, 100)

  }


  /*
    ============================================================
    ELIMINAR CITA
    ============================================================
  */

  const eliminarCita = async (idCita) => {

    /*
      Solicita confirmación antes de eliminar.
    */

    const confirmar =
      window.confirm(
        `¿Está seguro de que desea eliminar la cita #${idCita}? Esta acción no se puede deshacer.`
      )


    if (!confirmar) {

      return

    }


    try {

      await axios.delete(
        `${API_URL}/citas/${idCita}`,
        obtenerConfigAuth()
      )


      mostrarMensaje(
        'La cita fue eliminada correctamente.',
        'exito'
      )


      /*
        Actualizamos la tabla.
      */

      await cargarCitas()


      /*
        Si se eliminó la cita que estaba
        siendo editada, limpiamos el formulario.
      */

      if (
        idCitaEditando === idCita
      ) {

        limpiarFormulario()

      }

    } catch (error) {

      console.error(
        'Error al eliminar la cita:',
        error
      )


      /*
        Manejo específico de errores.
      */

      if (
        error.response?.status === 409
      ) {

        mostrarMensaje(
          'No se puede eliminar la cita porque está relacionada con otros registros.',
          'error'
        )

      }

      else {

        mostrarMensaje(
          'No fue posible eliminar la cita.',
          'error'
        )

      }

    }

  }


  /*
    ============================================================
    OBTENER NOMBRE DEL PACIENTE
    ============================================================
  */

  const obtenerNombrePaciente = (
    citaActual
  ) => {

    if (
      citaActual.paciente
    ) {

      return (

        `${citaActual.paciente.nombre || ''} ` +

        `${citaActual.paciente.apellido || ''}`

      ).trim()

    }


    return 'Sin paciente'

  }


  /*
    ============================================================
    OBTENER NOMBRE DEL SERVICIO
    ============================================================
  */

  const obtenerNombreServicio = (
    idServicio
  ) => {

    const servicioEncontrado =
      servicios.find(

        servicio =>

          Number(servicio.idServicio) ===
          Number(idServicio)

      )


    if (
      servicioEncontrado
    ) {

      return (
        servicioEncontrado.nombreServicio
      )

    }


    return (
      idServicio ||
      'Sin servicio'
    )

  }


  /*
    ============================================================
    DETERMINAR CLASE VISUAL DEL ESTADO
    ============================================================
  */

  const obtenerClaseEstado = (
    estado
  ) => {

    switch (estado) {

      case 'PROGRAMADA':

        return 'estado-programada'


      case 'CONFIRMADA':

        return 'estado-confirmada'


      case 'ASISTIDA':

        return 'estado-asistida'


      case 'CANCELADA':

        return 'estado-cancelada'


      case 'NO ASISTIDA':

        return 'estado-no-asistida'


      default:

        return 'estado-badge'

    }

  }


  /*
    ============================================================
    INTERFAZ
    ============================================================
  */

  return (

    <section className="Cita-module">


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div
        className="module-header"
        ref={encabezadoCitaRef}
      >

        <div>

          <span className="module-tag">

            Módulo Cita

          </span>


          <h2>

            Gestión de Citas

          </h2>


          <p>

            Registra, consulta y administra las citas odontológicas.

          </p>

        </div>

      </div>


      {/* ======================================================
          MENSAJE INFORMATIVO
          ====================================================== */}

      {mensaje && (

        <div
          className={`mensaje ${tipoMensaje}`}
          role="alert"
        >

          {mensaje}

        </div>

      )}


      {/* ======================================================
          FORMULARIO
          ====================================================== */}

      <div className="card form-card">

        <h3>

          {idCitaEditando !== null

            ? 'Editar Cita'

            : 'Formulario Cita'

          }

        </h3>


        <form

          className="Cita-form"

          onSubmit={(e) => {

            e.preventDefault()

            guardarCita()

          }}

          noValidate
        >


          {/* ==================================================
              PACIENTE
              ================================================== */}

          <div className="form-group">

            <label htmlFor="idPaciente">

              Paciente *

            </label>


            <select

              id="idPaciente"

              name="idPaciente"

              value={cita.idPaciente}

              onChange={handleChange}

              required

            >

              <option value="">

                Seleccione un paciente

              </option>


              {pacientes.map(
                (paciente) => (

                  <option

                    key={
                      paciente.idPaciente
                    }

                    value={
                      paciente.idPaciente
                    }

                  >

                    {paciente.nombre}{' '}

                    {paciente.apellido}

                  </option>

                )
              )}

            </select>

          </div>


          {/* ==================================================
              PROFESIONAL
              ================================================== */}

          <div className="form-group">

            <label htmlFor="idProfesional">

              Profesional

            </label>


            <input

              id="idProfesional"

              type="number"

              name="idProfesional"

              value={cita.idProfesional}

              onChange={handleChange}

              placeholder="ID del profesional"

              min="1"

            />


            <small>

              Campo opcional. Ingrese el ID del profesional.

            </small>

          </div>


          {/* ==================================================
              SERVICIO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="idServicio">

              Servicio *

            </label>


            <select

              id="idServicio"

              name="idServicio"

              value={cita.idServicio}

              onChange={handleChange}

              required

            >

              <option value="">

                Seleccione un servicio

              </option>


              {servicios.map(
                (servicio) => (

                  <option

                    key={
                      servicio.idServicio
                    }

                    value={
                      servicio.idServicio
                    }

                  >

                    {servicio.nombreServicio}

                  </option>

                )
              )}

            </select>

          </div>


          {/* ==================================================
              FECHA
              ================================================== */}

          <div className="form-group">

            <label htmlFor="fecha">

              Fecha *

            </label>


            <input

              id="fecha"

              type="date"

              name="fecha"

              value={cita.fecha}

              onChange={handleChange}

              min={obtenerFechaActual()}

              required

            />


            <small>

              No se permiten fechas anteriores a hoy.

            </small>

          </div>


          {/* ==================================================
              HORA
              ================================================== */}

          <div className="form-group">

            <label htmlFor="horaInicio">

              Hora de inicio *

            </label>


            <input

              id="horaInicio"

              type="time"

              name="horaInicio"

              value={cita.horaInicio}

              onChange={handleChange}

              required

            />


            <small>

              Lunes a viernes: 08:00 - 18:00.

              Sábados: 08:00 - 14:00.

            </small>

          </div>


          {/* ==================================================
              DURACIÓN
              ================================================== */}

          <div className="form-group">

            <label htmlFor="duracionMin">

              Duración (minutos) *

            </label>


            <input

              id="duracionMin"

              type="number"

              name="duracionMin"

              value={cita.duracionMin}

              onChange={handleChange}

              placeholder="Ej. 45"

              min={DURACION_MINIMA}

              max={DURACION_MAXIMA}

              step="15"

              required

            />


            <small>

              Mínimo {DURACION_MINIMA} y máximo{' '}

              {DURACION_MAXIMA} minutos.

            </small>

          </div>


          {/* ==================================================
              SALA
              ================================================== */}

          <div className="form-group">

            <label htmlFor="sala">

              Sala / Consultorio

            </label>


            <input

              id="sala"

              type="text"

              name="sala"

              value={cita.sala}

              onChange={handleChange}

              placeholder="Ej. Consultorio 1"

              maxLength="50"

            />


            <small>

              Máximo 50 caracteres.

            </small>

          </div>


          {/* ==================================================
              ESTADO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="estado">

              Estado *

            </label>


            <select

              id="estado"

              name="estado"

              value={cita.estado}

              onChange={handleChange}

              required

            >

              <option value="PROGRAMADA">

                PROGRAMADA

              </option>


              <option value="CONFIRMADA">

                CONFIRMADA

              </option>


              <option value="ASISTIDA">

                ASISTIDA

              </option>


              <option value="CANCELADA">

                CANCELADA

              </option>


              <option value="NO ASISTIDA">

                NO ASISTIDA

              </option>

            </select>

          </div>


          {/* ==================================================
              OBSERVACIÓN
              ================================================== */}

          <div className="form-group full">

            <label htmlFor="observacion">

              Observación

            </label>


            <textarea

              id="observacion"

              name="observacion"

              value={cita.observacion}

              onChange={handleChange}

              placeholder="Ingrese observaciones de la cita"

              rows="3"

              maxLength="500"

            />


            <small>

              Máximo 500 caracteres.

            </small>

          </div>


          {/* ==================================================
              BOTONES
              ================================================== */}

          <div className="form-buttons">

            <button

              type="submit"

              className="btn-primary"

            >

              {idCitaEditando !== null

                ? 'Actualizar'

                : 'Guardar'

              }

            </button>


            <button

              type="button"

              className="btn-secondary"

              onClick={limpiarFormulario}

            >

              {idCitaEditando !== null

                ? 'Cancelar edición'

                : 'Limpiar'

              }

            </button>

          </div>

        </form>

      </div>


      {/* ======================================================
          TABLA DE CITAS
          ====================================================== */}

      <div className="card table-card">

        <div className="table-title">

          <h3>

            Citas Registradas

          </h3>


          <p>

            Listado de citas almacenadas en el sistema.

          </p>

        </div>


        <div className="table-responsive">

          <table className="Cita-table">

            <thead>

              <tr>

                <th>ID</th>

                <th>Paciente</th>

                <th>Servicio</th>

                <th>Fecha</th>

                <th>Hora</th>

                <th>Duración</th>

                <th>Sala</th>

                <th>Estado</th>

                <th>Observación</th>

                <th>Acciones</th>

              </tr>

            </thead>


            <tbody>

              {citas.length === 0 ? (

                <tr>

                  <td

                    colSpan="10"

                    className="empty-message"

                  >

                    No hay citas registradas.

                  </td>

                </tr>

              ) : (

                citas.map(
                  (citaActual) => (

                    <tr

                      key={
                        citaActual.idCita
                      }

                    >

                      <td>

                        {citaActual.idCita}

                      </td>


                      <td>

                        {obtenerNombrePaciente(
                          citaActual
                        )}

                      </td>


                      <td>

                        {obtenerNombreServicio(
                          citaActual.idServicio
                        )}

                      </td>


                      <td>

                        {citaActual.fecha}

                      </td>


                      <td>

                        {citaActual.horaInicio

                          ? citaActual.horaInicio.substring(
                              0,
                              5
                            )

                          : ''

                        }

                      </td>


                      <td>

                        {citaActual.duracionMin

                          ? `${citaActual.duracionMin} min`

                          : 'Sin duración'

                        }

                      </td>


                      <td>

                        {citaActual.sala ||

                          'Sin sala'

                        }

                      </td>


                      <td>

                        <span

                          className={`estado-badge ${obtenerClaseEstado(
                            citaActual.estado
                          )}`}

                        >

                          {citaActual.estado ||

                            'Sin estado'

                          }

                        </span>

                      </td>


                      <td>

                        {citaActual.observacion ||

                          'Sin observación'

                        }

                      </td>


                      {/* ==================================================
                          ACCIONES
                          ================================================== */}

                      <td>

                        <div className="action-buttons">

                          <button

                            type="button"

                            className="btn-edit"

                            onClick={() =>

                              editarCita(
                                citaActual
                              )

                            }

                          >

                            Editar

                          </button>


                          <button

                            type="button"

                            className="btn-delete"

                            onClick={() =>

                              eliminarCita(
                                citaActual.idCita
                              )

                            }

                          >

                            Eliminar

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </section>

  )

}


/*
  ============================================================
  EXPORTACIÓN
  ============================================================
*/

export default Cita