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


import { useEffect, useMemo, useRef, useState } from 'react'

import axios from 'axios'

// Importa la URL centralizada del backend para desarrollo y despliegue.
import { API_BASE_URL } from '../config/api'

import { filtrarServiciosPorEspecialidad } from '../utils/serviciosPorEspecialidad'
import { estaFechaEnRangoISO, obtenerRangoPeriodo } from '../utils/dashboardPeriodo'
import ModuleTableHeader from '../components/ModuleTableHeader'
import { Pencil, Trash2 } from 'lucide-react'

import './Cita.css'


/*
  ============================================================
  CONFIGURACIÓN DE LA API
  ============================================================
*/

/*
  URL base de la API.

  Se obtiene desde la configuracion central del frontend:
  - En desarrollo utiliza http://localhost:8765/api.
  - En produccion utiliza la variable VITE_API_URL configurada
    en la plataforma de despliegue.

  Las rutas especificas de cada modulo se agregan a esta URL.
*/
const API_URL = API_BASE_URL

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

  180 minutos (3 horas) se conserva como tope superior:
  cubre incluso los procedimientos odontológicos más
  largos en consultorio, como cirugías de terceros
  molares (cordales) múltiples, tratamientos de
  endodoncia complejos en molares con varios conductos,
  o cirugías de implantes con injerto óseo. Un
  procedimiento que exceda ese tiempo normalmente se
  divide en más de una cita, en vez de registrarse como
  una sola sesión continua.
*/

const DURACION_MINIMA = 15

const DURACION_MAXIMA = 180


/*
  Opciones fijas de duración que se ofrecen en el
  formulario de citas. Reemplazan la entrada manual en
  minutos por una lista desplegable, evitando valores
  fuera de lo habitual en consulta (ej. "37 minutos").

  Se incluyen bloques de 15 minutos hasta la hora, y
  luego bloques más amplios (90/120/180) para los
  procedimientos más extensos (cirugía oral, endodoncia
  en molares, implantes, etc.).
*/

const OPCIONES_DURACION = [
  { valor: 15, etiqueta: '15 minutos' },
  { valor: 20, etiqueta: '20 minutos' },
  { valor: 30, etiqueta: '30 minutos' },
  { valor: 45, etiqueta: '45 minutos' },
  { valor: 60, etiqueta: '60 minutos (1 hora)' },
  { valor: 90, etiqueta: '90 minutos (1 hora 30 min)' },
  { valor: 120, etiqueta: '120 minutos (2 horas)' },
  { valor: 180, etiqueta: '180 minutos (3 horas)' }
]


/*
  Consultorios disponibles en la clínica. Se fija la
  lista a estas 4 opciones para evitar texto libre
  (errores de tipeo, nombres inconsistentes como
  "consultorio1" vs "Consultorio 1", etc.).

  Si en el futuro se habilita un quinto consultorio,
  basta con agregar un elemento aquí.
*/

const OPCIONES_SALA = [
  'Consultorio 1',
  'Consultorio 2',
  'Consultorio 3',
  'Consultorio 4'
]


/*
  ============================================================
  COMPONENTE PRINCIPAL
  ============================================================
*/

function Cita({
  filtroNavegacion = null,
  onLimpiarFiltro,
  periodo = null
}) {

console.log("FILTRO RECIBIDO EN CITA:", filtroNavegacion);
console.log("PERIODO RECIBIDO EN CITA:", periodo);

  /*
    ============================================================
    REFERENCIA AL ENCABEZADO
    ============================================================

    Permite desplazar automáticamente la pantalla
    al encabezado cuando se selecciona "Editar".
  */

  const encabezadoCitaRef = useRef(null)

  /*
    Referencia a la tabla. Se usa cuando el usuario llega desde
    el Dashboard con un filtro específico para ubicar de forma
    inmediata los resultados solicitados.
  */
  const tablaCitasRef = useRef(null)


  /*
    ============================================================
    ESTADOS
    ============================================================
  */

  /*
    Lista de citas obtenidas desde Spring Boot.
  */

  const [citas, setCitas] = useState([])

  // Búsqueda local de la tabla, con el mismo patrón visual de Pacientes.
  const [busquedaTabla, setBusquedaTabla] = useState('')

  /*
  ============================================================
  ORDENAMIENTO DE TABLA
  ============================================================

  Guarda:
  - columna seleccionada.
  - dirección del orden.

  Ejemplo:

  {
    columna: "fecha",
    direccion: "asc"
  }

  Permite ordenar las citas haciendo clic
  sobre los encabezados de la tabla.
*/
const [ordenamiento, setOrdenamiento] = useState({
  columna: null,
  direccion: "asc"
})

  /*
    Lista de pacientes obtenidos desde Spring Boot.
  */

  const [pacientes, setPacientes] = useState([])


  /*
    Lista de servicios obtenidos desde Spring Boot.
  */

  const [servicios, setServicios] = useState([])

  const [profesionales, setProfesionales] = useState([])
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

      cargarProfesionales()

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
    CARGAR PROFESIONALES
    ============================================================
  */
      const cargarProfesionales = async () => {

        try {

          const respuesta = await axios.get(
            `${API_URL}/profesionales`,
            obtenerConfigAuth()
          )

          setProfesionales(respuesta.data)

        } catch (error) {

          console.error(
            "Error al cargar profesionales:",
            error
          )

          mostrarMensaje(
            "No fue posible cargar los profesionales.",
            "error"
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
CAMBIAR ORDENAMIENTO DE TABLA
============================================================

Permite ordenar las citas al hacer clic
sobre los encabezados de la tabla.

Ejemplo:

Primer clic:
Fecha ▲
(ascendente)

Segundo clic:
Fecha ▼
(descendente)

============================================================
*/
const cambiarOrdenamiento = (columna) => {


  setOrdenamiento((actual) => {


    /*
      Si el usuario vuelve a seleccionar
      la misma columna, se invierte
      la dirección.
    */
    if(actual.columna === columna){


      return {

        columna,

        direccion:
          actual.direccion === "asc"
            ? "desc"
            : "asc"

      }

    }



    /*
      Si selecciona una nueva columna,
      comienza ordenando ascendente.
    */
    return {

      columna,

      direccion:"asc"

    }


  })


}


  /*
    ============================================================
    MANEJAR CAMBIOS DEL FORMULARIO
    ============================================================
  */

  const handleChange = (e) => {

    const { name, value } = e.target


    setCita(citaPrevia => {

      const citaActualizada = {
        ...citaPrevia,
        [name]: value
      }

      /*
        Si el campo modificado es el profesional, se valida si
        el servicio ya elegido sigue perteneciendo a la nueva
        especialidad. Si ya no aplica, se limpia el servicio
        para evitar que quede guardada una combinación
        profesional/servicio incompatible.
      */

      if (name === 'idProfesional') {

        const nuevoProfesional = profesionales.find(
          profesional =>
            Number(profesional.idProfesional) === Number(value)
        )

        const serviciosPermitidos = filtrarServiciosPorEspecialidad(
          servicios,
          nuevoProfesional?.especialidad
        )

        const servicioSigueSiendoValido = serviciosPermitidos.some(
          servicio =>
            Number(servicio.idServicio) === Number(citaPrevia.idServicio)
        )

        if (!servicioSigueSiendoValido) {

          citaActualizada.idServicio = ''

        }

      }

      return citaActualizada

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

    idPaciente: Number(cita.idPaciente)

  },

  profesional: {

    idProfesional: Number(cita.idProfesional)

  },

  servicio: {

    idServicio: Number(cita.idServicio)

  },

  fecha: cita.fecha,

  horaInicio: cita.horaInicio,

  duracionMin: Number(cita.duracionMin),

  sala: cita.sala.trim(),

  estado: cita.estado,

  observacion: cita.observacion.trim()

}


console.log(
  "DATOS QUE SE ENVÍAN AL BACKEND:",
  datosCita
)
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

    // Normaliza relaciones que pueden venir anidadas desde el backend.
    // En edición debemos conservar profesional y servicio originales aunque
    // el usuario solo quiera cambiar fecha u hora.
    if (!citaSeleccionada.idProfesional && citaSeleccionada.profesional) {
      citaSeleccionada.idProfesional =
        citaSeleccionada.profesional.idProfesional ||
        citaSeleccionada.profesional.id
    }

    if (!citaSeleccionada.idServicio && citaSeleccionada.servicio) {
      citaSeleccionada.idServicio =
        citaSeleccionada.servicio.idServicio ||
        citaSeleccionada.servicio.id
    }


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

        citaSeleccionada.idProfesional ||
        citaSeleccionada.profesional?.idProfesional ||
        citaSeleccionada.profesional?.id ||
        '',


      idServicio:

        citaSeleccionada.idServicio ||
        citaSeleccionada.servicio?.idServicio ||
        citaSeleccionada.servicio?.id ||
        '',


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
    citaActual
  ) => {

    const idServicio = citaActual?.idServicio || citaActual?.servicio?.idServicio || citaActual?.servicioId

    if (citaActual?.servicio && typeof citaActual.servicio === "string") {
      return citaActual.servicio
    }

    if (citaActual?.servicio?.nombreServicio) {
      return citaActual.servicio.nombreServicio
    }

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
    SERVICIOS DISPONIBLES SEGÚN EL PROFESIONAL SELECCIONADO
    ============================================================

    Cada profesional tiene una especialidad (Odontología General,
    Higiene Dental, Endodoncia, etc.). El selector de "Servicio"
    solo debe ofrecer los servicios cuya categoría corresponde a
    esa especialidad, en lugar de listar siempre el catálogo
    completo.

    La relación especialidad -> categorías de servicio vive en
    utils/serviciosPorEspecialidad.js, así que aquí solo se
    resuelve cuál es el profesional elegido y se delega el
    filtrado a esa utilidad.
  */

  const profesionalSeleccionado = useMemo(
    () =>
      profesionales.find(
        profesional =>
          Number(profesional.idProfesional) === Number(cita.idProfesional)
      ) || null,
    [profesionales, cita.idProfesional]
  )

  const serviciosDisponibles = useMemo(
    () =>
      filtrarServiciosPorEspecialidad(
        servicios,
        profesionalSeleccionado?.especialidad
      ),
    [servicios, profesionalSeleccionado]
  )

  /*
    ============================================================
    FILTRO RECIBIDO DESDE EL DASHBOARD
    ============================================================

    El Dashboard puede abrir este módulo con contexto. Ejemplos:

    - estado = ASISTIDA.
    - fecha = 2026-08-20.
    - idCita = 35.

    El filtrado se realiza sobre los datos ya obtenidos del
    backend, por lo que no altera los endpoints ni el CRUD actual.
  */

  const citasFiltradasDashboard = useMemo(
    () => {
      if (!filtroNavegacion) return citas

      switch (filtroNavegacion.tipo) {
        case 'estado': {
          const rangoActivo = obtenerRangoPeriodo(periodo)
          const fechaInicio = filtroNavegacion.fechaInicio || rangoActivo.inicioISO
          const fechaFin = filtroNavegacion.fechaFin || rangoActivo.finISO

          return citas.filter(citaActual => (
            citaActual.estado === filtroNavegacion.valor &&
            estaFechaEnRangoISO(citaActual.fecha, fechaInicio, fechaFin)
          ))
        }
        case 'periodo':
          return citas.filter(citaActual => estaFechaEnRangoISO(
            citaActual.fecha,
            filtroNavegacion.fechaInicio,
            filtroNavegacion.fechaFin
          ))
        case 'fecha':
          return citas.filter(citaActual => citaActual.fecha === filtroNavegacion.valor)
        case 'idCita':
          return citas.filter(citaActual => Number(citaActual.idCita) === Number(filtroNavegacion.valor))
        case 'idPaciente':
          return citas.filter(citaActual => Number(citaActual.paciente?.idPaciente) === Number(filtroNavegacion.valor))
        default:
          return citas
      }
    },
    [citas, filtroNavegacion, periodo]
  )

  /*
    ============================================================
    BÚSQUEDA DE LA TABLA
    ============================================================
    Se aplica después del filtro recibido desde el Dashboard y
    antes del ordenamiento. Incluye los datos visibles derivados
    de paciente y servicio.
  */
  const citasFiltradasBusqueda = useMemo(() => {
    const texto = busquedaTabla.trim().toLowerCase()

    if (!texto) return citasFiltradasDashboard

    return citasFiltradasDashboard.filter((citaActual) => {
      const contenido = [
        citaActual.idCita,
        obtenerNombrePaciente(citaActual),
        obtenerNombreServicio(citaActual),
        citaActual.fecha,
        citaActual.horaInicio,
        citaActual.duracionMin,
        citaActual.sala,
        citaActual.estado,
        citaActual.observacion
      ]
        .filter(valor => valor !== null && valor !== undefined)
        .join(' ')
        .toLowerCase()

      return contenido.includes(texto)
    })
  }, [citasFiltradasDashboard, busquedaTabla])

  /*
  ============================================================
  CITAS ORDENADAS
  ============================================================

  Se aplica después de los filtros del Dashboard.

  Orden de procesamiento:

  Backend
      ↓
  Filtro Dashboard
      ↓
  Ordenamiento tabla
      ↓
  Renderizado
*/
const citasOrdenadas = useMemo(()=>{


  const lista = [
    ...citasFiltradasBusqueda
  ]


  if(!ordenamiento.columna){

    return lista

  }



  return lista.sort((a,b)=>{


    let valorA

    let valorB



    switch(ordenamiento.columna){


      case "id":

        valorA = a.idCita

        valorB = b.idCita

        break



      case "paciente":

        valorA =
          obtenerNombrePaciente(a)
          .toLowerCase()

        valorB =
          obtenerNombrePaciente(b)
          .toLowerCase()

        break

case "servicio":

 valorA = obtenerNombreServicio(a).toLowerCase()

 valorB = obtenerNombreServicio(b).toLowerCase()

break

      case "fecha":

        valorA =
          new Date(a.fecha)

        valorB =
          new Date(b.fecha)

        break



      case "hora":

        valorA =
          a.horaInicio || ""

        valorB =
          b.horaInicio || ""

        break



      case "duracion":

        valorA =
          a.duracionMin || 0

        valorB =
          b.duracionMin || 0

        break



      case "sala":

        valorA =
          a.sala || ""

        valorB =
          b.sala || ""

        break



      case "estado":

        valorA =
          a.estado || ""

        valorB =
          b.estado || ""

        break



      default:

        return 0

    }



    if(valorA < valorB){

      return ordenamiento.direccion === "asc"
        ? -1
        : 1

    }


    if(valorA > valorB){

      return ordenamiento.direccion === "asc"
        ? 1
        : -1

    }


    return 0


  })


},[
  citasFiltradasBusqueda,
  ordenamiento
])

  /*
    Lleva la vista a la tabla cuando el filtro proviene del
    Dashboard, evitando que el usuario tenga que buscar manualmente.
  */
  useEffect(() => {
    if (!filtroNavegacion || citas.length === 0) return

    const idAnimacion = window.requestAnimationFrame(() => {
      tablaCitasRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })

    return () => window.cancelAnimationFrame(idAnimacion)
  }, [filtroNavegacion, citas.length])

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

              Profesional *

            </label>


            <select

              id="idProfesional"

              name="idProfesional"

              value={cita.idProfesional}

              onChange={handleChange}

              required

            >

              <option value="">

                Seleccione un profesional

              </option>


              {profesionales.map(

                (profesional) => (

                  <option

                    key={profesional.idProfesional}

                    value={profesional.idProfesional}

                  >

                    {profesional.nombre}{' '}

                    {profesional.apellido}

                    {' - '}

                    {profesional.especialidad}

                  </option>

                )

              )}

            </select>


            <small>

              Seleccione el profesional que atenderá la cita.

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


              {serviciosDisponibles.map(
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


            <small>

              {profesionalSeleccionado
                ? `Servicios disponibles para ${profesionalSeleccionado.especialidad}.`
                : 'Seleccione primero un profesional para ver sus servicios.'}

            </small>

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


            <select

              id="duracionMin"

              name="duracionMin"

              value={cita.duracionMin}

              onChange={handleChange}

              required

            >

              <option value="">

                Seleccione la duración

              </option>


              {OPCIONES_DURACION.map(

                (opcion) => (

                  <option

                    key={opcion.valor}

                    value={opcion.valor}

                  >

                    {opcion.etiqueta}

                  </option>

                )

              )}

            </select>


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


            <select

              id="sala"

              name="sala"

              value={cita.sala}

              onChange={handleChange}

            >

              <option value="">

                Seleccione un consultorio

              </option>


              {OPCIONES_SALA.map(

                (opcionSala) => (

                  <option

                    key={opcionSala}

                    value={opcionSala}

                  >

                    {opcionSala}

                  </option>

                )

              )}

            </select>


            <small>

              Consultorios disponibles en el consultorio odontológico.

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

      <div
        className="card table-card data-table-card"
        ref={tablaCitasRef}
      >

        {filtroNavegacion && (
          <div className="module-context-filter">
            <div>
              <strong>Filtro desde Dashboard</strong>
              <span>{filtroNavegacion.etiqueta || 'Resultado filtrado'}</span>
            </div>
            <button type="button" onClick={onLimpiarFiltro}>
              Quitar filtro
            </button>
          </div>
        )}

        <ModuleTableHeader
          titulo="Citas Registradas"
          descripcion="Listado de citas almacenadas en el sistema."
          busqueda={busquedaTabla}
          setBusqueda={setBusquedaTabla}
          placeholder="Buscar por paciente, servicio, fecha, estado..."
        />


        <div className="table-responsive data-table-scroll">

          <table className="Cita-table data-table">

<thead>

  <tr>


    {/* ==================================================
        ID
        Permite ordenar de menor a mayor o viceversa.
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("id")}
    >
      ID

      {ordenamiento.columna === "id" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        PACIENTE
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("paciente")}
    >
      Paciente

      {ordenamiento.columna === "paciente" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        SERVICIO
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("servicio")}
    >
      Servicio

      {ordenamiento.columna === "servicio" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        FECHA
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("fecha")}
    >
      Fecha

      {ordenamiento.columna === "fecha" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        HORA
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("hora")}
    >
      Hora

      {ordenamiento.columna === "hora" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        DURACIÓN
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("duracion")}
    >
      Duración

      {ordenamiento.columna === "duracion" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        SALA
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("sala")}
    >
      Sala

      {ordenamiento.columna === "sala" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        ESTADO
    ================================================== */}
    <th
      className="sortable"
      onClick={() => cambiarOrdenamiento("estado")}
    >
      Estado

      {ordenamiento.columna === "estado" &&
        (
          ordenamiento.direccion === "asc"
            ? " ▲"
            : " ▼"
        )
      }

    </th>




    {/* ==================================================
        OBSERVACIÓN
        No se ordena porque es texto libre.
    ================================================== */}
    <th>
      Observación
    </th>




    {/* ==================================================
        ACCIONES
        No se ordena porque contiene botones.
    ================================================== */}
    <th>
      Acciones
    </th>


  </tr>

</thead>


            <tbody>

              {citasOrdenadas.length === 0 ? (

                <tr>

                  <td

                    colSpan="10"

                    className="empty-message"

                  >

                    {busquedaTabla.trim()
                      ? 'No hay citas que coincidan con la búsqueda.'
                      : filtroNavegacion
                        ? 'No hay citas que coincidan con el filtro seleccionado.'
                        : 'No hay citas registradas.'}

                  </td>

                </tr>

              ) : (

                citasOrdenadas.map(
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
                          citaActual
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
                            <Pencil size={15} />
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
                            <Trash2 size={15} />
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