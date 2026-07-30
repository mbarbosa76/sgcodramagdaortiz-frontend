/*
  ============================================================
  Paciente.jsx
  ============================================================

  Página principal del módulo de gestión de pacientes.

  Este componente permite:

  - Consultar pacientes registrados en MySQL.
  - Registrar nuevos pacientes.
  - Editar pacientes existentes.
  - Eliminar pacientes.
  - Validar la información antes de enviarla.
  - Mostrar mensajes informativos al usuario.
  - Cargar los datos de un paciente en el formulario al editar.
  - Desplazarse automáticamente hasta el formulario al editar.

  Arquitectura utilizada:

  React
      ↓
  Axios
      ↓
  Spring Boot
      ↓
  PacienteController
      ↓
  PacienteService
      ↓
  PacienteRepository
      ↓
  MySQL
*/

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

/*
  Importa los estilos propios del módulo Paciente.
*/
import './Paciente.css'

/*
  Importa el componente encargado de mostrar
  la tabla de pacientes.
*/
import PacienteTable from '../components/PacienteTable'


/*
  ============================================================
  CONFIGURACIÓN DE LA API
  ============================================================
*/

/*
  URL base del backend Spring Boot.
*/
const API_URL = 'http://localhost:8765/api'


/*
  ============================================================
  ESTADO INICIAL DEL FORMULARIO
  ============================================================
*/

/*
  Se define una función para generar un formulario
  completamente limpio.

  Se utiliza una función en lugar de un objeto fijo
  para evitar referencias compartidas entre estados.
*/
const formularioInicial = () => ({
  documento: '',
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: ''
})


/*
  ============================================================
  COMPONENTE PACIENTE
  ============================================================
*/

function Paciente() {

  /*
    ==========================================================
    REFERENCIA AL ENCABEZADO
    ==========================================================

    Permite desplazar automáticamente la pantalla hasta
    el módulo cuando se selecciona "Editar".
  */

  const encabezadoPacienteRef = useRef(null)


  /*
    ==========================================================
    ESTADOS
    ==========================================================
  */

  /*
    Lista de pacientes obtenidos desde Spring Boot.
  */
  const [pacientes, setPacientes] = useState([])


  /*
    Datos actuales del formulario.
  */
  const [paciente, setPaciente] = useState(
    formularioInicial()
  )


  /*
    Guarda el ID del paciente que se está editando.

    null = registro nuevo.

    número = edición de paciente existente.
  */
  const [idPacienteEditando, setIdPacienteEditando] =
    useState(null)


  /*
    Mensaje informativo que se muestra al usuario.
  */
  const [mensaje, setMensaje] = useState('')


  /*
    Tipo de mensaje:

    success = operación correcta.

    error = error o validación.

    info = información general.
  */
  const [tipoMensaje, setTipoMensaje] =
    useState('info')


  /*
    Guarda los errores específicos encontrados
    en cada campo del formulario.
  */
  const [errores, setErrores] = useState({})


  /*
    Indica si se está realizando una operación
    contra el backend.
  */
  const [cargando, setCargando] = useState(false)


  /*
    ==========================================================
    CARGA INICIAL
    ==========================================================

    Cuando se abre el módulo se consulta la lista
    de pacientes almacenada en Spring Boot / MySQL.
  */

  useEffect(() => {

    cargarPacientes()

  }, [])


  /*
    ============================================================
    CARGAR PACIENTES
    ============================================================
  */

  const cargarPacientes = async () => {

    try {

      setCargando(true)

      const respuesta = await axios.get(
        `${API_URL}/pacientes`
      )

      /*
        Guarda en el estado la lista recibida
        desde el backend.
      */
      setPacientes(respuesta.data)

    } catch (error) {

      console.error(
        'Error al cargar los pacientes:',
        error
      )

      mostrarMensaje(
        'No fue posible cargar los pacientes. Verifique que Spring Boot esté ejecutándose.',
        'error'
      )

    } finally {

      setCargando(false)

    }

  }


  /*
    ============================================================
    MANEJO DE CAMBIOS EN EL FORMULARIO
    ============================================================
  */

  const handleChange = (e) => {

    /*
      Obtiene el nombre y valor del campo
      que está modificando el usuario.
    */
    const { name, value } = e.target


    /*
      Actualiza solamente el campo modificado.
    */
    setPaciente((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value
    }))


    /*
      Si el usuario comienza a corregir un campo,
      eliminamos inmediatamente el error visual
      de ese campo.
    */
    if (errores[name]) {

      setErrores((erroresAnteriores) => ({
        ...erroresAnteriores,
        [name]: ''
      }))

    }


    /*
      Si existía un mensaje general de error,
      se limpia al comenzar una nueva modificación.
    */
    if (tipoMensaje === 'error') {

      setMensaje('')

    }

  }


  /*
    ============================================================
    VALIDAR FORMULARIO
    ============================================================
  */

  const validarFormulario = () => {

    /*
      Objeto que almacenará todos los errores
      encontrados durante la validación.
    */
    const nuevosErrores = {}


    /*
      ----------------------------------------------------------
      VALIDACIÓN DEL DOCUMENTO
      ----------------------------------------------------------
    */

    const documento = paciente.documento.trim()


    /*
      El documento es obligatorio.
    */
    if (!documento) {

      nuevosErrores.documento =
        'El documento es obligatorio.'

    }

    /*
      El documento debe tener mínimo 5 caracteres.
    */
    else if (documento.length < 5) {

      nuevosErrores.documento =
        'El documento debe tener mínimo 5 caracteres.'

    }

    /*
      El documento no debe superar 50 caracteres,
      coincidiendo con la validación del backend.
    */
    else if (documento.length > 50) {

      nuevosErrores.documento =
        'El documento no puede superar los 50 caracteres.'

    }

    /*
      Solo se permiten letras, números, espacios,
      guiones y puntos.

      Esto permite documentos como:

      123456789
      1.023.456.789
      CC-123456
    */
    else if (!/^[a-zA-Z0-9.\-\s]+$/.test(documento)) {

      nuevosErrores.documento =
        'El documento contiene caracteres no permitidos.'

    }


    /*
      ----------------------------------------------------------
      VALIDACIÓN DEL NOMBRE
      ----------------------------------------------------------
    */

    const nombre = paciente.nombre.trim()


    if (!nombre) {

      nuevosErrores.nombre =
        'El nombre es obligatorio.'

    }

    else if (nombre.length < 2) {

      nuevosErrores.nombre =
        'El nombre debe tener mínimo 2 caracteres.'

    }

    else if (nombre.length > 100) {

      nuevosErrores.nombre =
        'El nombre no puede superar los 100 caracteres.'

    }

    /*
      Se permiten letras incluyendo caracteres
      propios del español, espacios y algunos signos.
    */
    else if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(nombre)) {

      nuevosErrores.nombre =
        'El nombre solo puede contener letras.'

    }


    /*
      ----------------------------------------------------------
      VALIDACIÓN DEL APELLIDO
      ----------------------------------------------------------
    */

    const apellido = paciente.apellido.trim()


    if (!apellido) {

      nuevosErrores.apellido =
        'El apellido es obligatorio.'

    }

    else if (apellido.length < 2) {

      nuevosErrores.apellido =
        'El apellido debe tener mínimo 2 caracteres.'

    }

    else if (apellido.length > 100) {

      nuevosErrores.apellido =
        'El apellido no puede superar los 100 caracteres.'

    }

    else if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(apellido)) {

      nuevosErrores.apellido =
        'El apellido solo puede contener letras.'

    }


    /*
      ----------------------------------------------------------
      VALIDACIÓN DEL CORREO
      ----------------------------------------------------------
    */

    const correo = paciente.correo.trim()


    /*
      El correo no es obligatorio en la entidad,
      pero si el usuario lo escribe debe tener
      un formato válido.
    */
    if (correo) {

      /*
        Validación básica de formato de correo.
      */
      const formatoCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!formatoCorreo.test(correo)) {

        nuevosErrores.correo =
          'Ingrese un correo electrónico válido.'

      }

      else if (correo.length > 150) {

        nuevosErrores.correo =
          'El correo no puede superar los 150 caracteres.'

      }

    }


    /*
      ----------------------------------------------------------
      VALIDACIÓN DEL TELÉFONO
      ----------------------------------------------------------
    */

    const telefono = paciente.telefono.trim()


    /*
      El teléfono es opcional.

      Sin embargo, si se proporciona,
      se valida su longitud y contenido.
    */
    if (telefono) {

      if (telefono.length < 7) {

        nuevosErrores.telefono =
          'El teléfono debe tener mínimo 7 caracteres.'

      }

      else if (telefono.length > 25) {

        nuevosErrores.telefono =
          'El teléfono no puede superar los 25 caracteres.'

      }

      else if (!/^[0-9+\-\s()]+$/.test(telefono)) {

        nuevosErrores.telefono =
          'El teléfono contiene caracteres no permitidos.'

      }

    }


    /*
      ----------------------------------------------------------
      VALIDACIÓN DE FECHA DE NACIMIENTO
      ----------------------------------------------------------
    */

    if (paciente.fechaNacimiento) {

      /*
        Convertimos la fecha recibida desde el input
        para verificar que no sea posterior al día actual.
      */
      const fechaNacimiento =
        new Date(
          `${paciente.fechaNacimiento}T00:00:00`
        )

      const hoy = new Date()

      hoy.setHours(0, 0, 0, 0)


      if (fechaNacimiento > hoy) {

        nuevosErrores.fechaNacimiento =
          'La fecha de nacimiento no puede ser futura.'

      }

    }


    /*
      ----------------------------------------------------------
      VALIDACIÓN DE DIRECCIÓN
      ----------------------------------------------------------
    */

    const direccion = paciente.direccion.trim()


    if (direccion.length > 250) {

      nuevosErrores.direccion =
        'La dirección no puede superar los 250 caracteres.'

    }


    /*
      Guarda los errores encontrados.
    */
    setErrores(nuevosErrores)


    /*
      Devuelve true si no existe ningún error.
    */
    return Object.keys(nuevosErrores).length === 0

  }


  /*
    ============================================================
    MOSTRAR MENSAJE
    ============================================================
  */

  const mostrarMensaje = (texto, tipo = 'info') => {

    setMensaje(texto)

    setTipoMensaje(tipo)

  }


  /*
    ============================================================
    LIMPIAR FORMULARIO
    ============================================================
  */

  const limpiarFormulario = () => {

    /*
      Restablece todos los campos.
    */
    setPaciente(
      formularioInicial()
    )


    /*
      Sale del modo edición.
    */
    setIdPacienteEditando(null)


    /*
      Elimina los errores.
    */
    setErrores({})


    /*
      Limpia mensajes.
    */
    setMensaje('')

  }


  /*
    ============================================================
    GUARDAR PACIENTE
    ============================================================
  */

  const guardarPaciente = async (e) => {

    /*
      Evita que el navegador recargue la página
      al enviar el formulario.
    */
    e.preventDefault()


    /*
      Ejecuta todas las validaciones antes
      de comunicarse con Spring Boot.
    */
    const formularioValido =
      validarFormulario()


    /*
      Si existe algún error, no continúa.
    */
    if (!formularioValido) {

      mostrarMensaje(
        'Revise los campos marcados antes de continuar.',
        'error'
      )

      return

    }


    try {

      setCargando(true)


      /*
        Construimos el objeto que será enviado
        al backend.

        Los nombres coinciden con los atributos
        de la entidad Paciente.java.
      */
      const datosPaciente = {

        documento:
          paciente.documento.trim(),

        nombre:
          paciente.nombre.trim(),

        apellido:
          paciente.apellido.trim(),

        correo:
          paciente.correo.trim()
            ? paciente.correo.trim()
            : null,

        telefono:
          paciente.telefono.trim()
            ? paciente.telefono.trim()
            : null,

        fechaNacimiento:
          paciente.fechaNacimiento
            ? paciente.fechaNacimiento
            : null,

        direccion:
          paciente.direccion.trim()
            ? paciente.direccion.trim()
            : null

      }


      /*
        ========================================================
        ACTUALIZAR PACIENTE
        ========================================================
      */

      if (idPacienteEditando !== null) {

        await axios.put(
          `${API_URL}/pacientes/${idPacienteEditando}`,
          datosPaciente
        )


        mostrarMensaje(
          'El paciente fue actualizado correctamente.',
          'success'
        )

      }


      /*
        ========================================================
        REGISTRAR PACIENTE
        ========================================================
      */

      else {

        await axios.post(
          `${API_URL}/pacientes`,
          datosPaciente
        )


        mostrarMensaje(
          'El paciente fue registrado correctamente.',
          'success'
        )

      }


      /*
        Actualiza la tabla consultando nuevamente
        la información de MySQL.
      */
      await cargarPacientes()


      /*
        Limpia el formulario.
      */
      setPaciente(
        formularioInicial()
      )


      /*
        Sale del modo edición.
      */
      setIdPacienteEditando(null)


      /*
        Limpia los errores.
      */
      setErrores({})


    } catch (error) {

      console.error(
        'Error al guardar el paciente:',
        error
      )


      /*
        Muestra en consola la respuesta exacta
        enviada por Spring Boot.

        Esto resulta especialmente útil durante
        las pruebas del proyecto.
      */
      console.error(
        'Respuesta del servidor:',
        error.response?.data
      )


      /*
        Manejo específico para documento duplicado.

        La entidad Paciente.java define documento
        como UNIQUE.
      */
      if (
        error.response?.status === 500 &&
        error.response?.data
      ) {

        mostrarMensaje(
          'No fue posible guardar el paciente. Verifique que el documento no esté registrado previamente.',
          'error'
        )

      }

      else {

        mostrarMensaje(
          'No fue posible registrar o actualizar el paciente. Revise los datos e intente nuevamente.',
          'error'
        )

      }

    } finally {

      setCargando(false)

    }

  }


  /*
    ============================================================
    EDITAR PACIENTE
    ============================================================
  */

  const editarPaciente = (pacienteSeleccionado) => {

    /*
      Guarda el ID del paciente seleccionado.
    */
    setIdPacienteEditando(
      pacienteSeleccionado.idPaciente
    )


    /*
      Carga los datos existentes en el formulario.
    */
    setPaciente({

      documento:
        pacienteSeleccionado.documento || '',

      nombre:
        pacienteSeleccionado.nombre || '',

      apellido:
        pacienteSeleccionado.apellido || '',

      correo:
        pacienteSeleccionado.correo || '',

      telefono:
        pacienteSeleccionado.telefono || '',

      fechaNacimiento:
        pacienteSeleccionado.fechaNacimiento || '',

      direccion:
        pacienteSeleccionado.direccion || ''

    })


    /*
      Elimina errores anteriores.
    */
    setErrores({})


    /*
      Muestra información indicando que se
      está editando un paciente.
    */
    mostrarMensaje(
      `Editando paciente #${pacienteSeleccionado.idPaciente}. Modifique los datos y seleccione "Actualizar".`,
      'info'
    )


    /*
      Desplaza automáticamente la pantalla
      hasta el encabezado del módulo.
    */
    setTimeout(() => {

      encabezadoPacienteRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

    }, 100)

  }


  /*
    ============================================================
    ELIMINAR PACIENTE
    ============================================================
  */

  const eliminarPaciente = async (idPaciente) => {

    /*
      Solicita confirmación antes de eliminar.
    */
    const confirmar = window.confirm(
      '¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer.'
    )


    /*
      Si el usuario cancela, no se realiza ninguna operación.
    */
    if (!confirmar) {

      return

    }


    try {

      setCargando(true)


      /*
        Envía la solicitud DELETE al backend.
      */
      await axios.delete(
        `${API_URL}/pacientes/${idPaciente}`
      )


      /*
        Actualiza la lista después de eliminar.
      */
      await cargarPacientes()


      /*
        Si el paciente eliminado era el que
        estaba siendo editado, limpia el formulario.
      */
      if (
        idPacienteEditando === idPaciente
      ) {

        limpiarFormulario()

      }


      mostrarMensaje(
        'El paciente fue eliminado correctamente.',
        'success'
      )


    } catch (error) {

      console.error(
        'Error al eliminar el paciente:',
        error
      )


      /*
        Si Spring Boot devuelve un conflicto,
        posiblemente el paciente tenga citas
        relacionadas en la base de datos.
      */
      if (error.response?.status === 409) {

        mostrarMensaje(
          'No es posible eliminar este paciente porque tiene información relacionada con otros registros del sistema.',
          'error'
        )

      }

      else {

        mostrarMensaje(
          'No fue posible eliminar el paciente.',
          'error'
        )

      }

    } finally {

      setCargando(false)

    }

  }


  /*
    ============================================================
    FUNCIÓN AUXILIAR PARA MOSTRAR ERROR DE CAMPO
    ============================================================
  */

  const mostrarError = (nombreCampo) => {

    if (!errores[nombreCampo]) {

      return null

    }


    return (

      <span className="field-error">
        {errores[nombreCampo]}
      </span>

    )

  }


  /*
    ============================================================
    INTERFAZ VISUAL
    ============================================================
  */

  return (

    <section className="Paciente-module">


      {/* ======================================================
          ENCABEZADO DEL MÓDULO
          ====================================================== */}

      <div
        className="module-header"
        ref={encabezadoPacienteRef}
      >

        <div>

          <span className="module-tag">
            Módulo Paciente
          </span>

          <h2>
            Gestión de Pacientes
          </h2>

          <p>
            Registra, consulta y administra la información básica de los pacientes.
          </p>

        </div>

      </div>


      {/* ======================================================
          MENSAJE INFORMATIVO / VALIDACIÓN
          ====================================================== */}

      {mensaje && (

        <div
          className={`mensaje mensaje-${tipoMensaje}`}
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

          {idPacienteEditando !== null
            ? `Editar Paciente #${idPacienteEditando}`
            : 'Formulario Paciente'}

        </h3>


        <form
          className="Paciente-form"
          onSubmit={guardarPaciente}
          noValidate
        >


          {/* ==================================================
              DOCUMENTO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="documento">
              Documento *
            </label>

            <input
              id="documento"
              type="text"
              name="documento"
              value={paciente.documento}
              onChange={handleChange}
              placeholder="Ingrese el documento"
              maxLength="50"
              className={
                errores.documento
                  ? 'input-error'
                  : ''
              }
              aria-invalid={
                errores.documento
                  ? 'true'
                  : 'false'
              }
            />

            {mostrarError('documento')}

          </div>


          {/* ==================================================
              NOMBRE
              ================================================== */}

          <div className="form-group">

            <label htmlFor="nombre">
              Nombres *
            </label>

            <input
              id="nombre"
              type="text"
              name="nombre"
              value={paciente.nombre}
              onChange={handleChange}
              placeholder="Ingrese los nombres"
              minLength="2"
              maxLength="100"
              className={
                errores.nombre
                  ? 'input-error'
                  : ''
              }
              aria-invalid={
                errores.nombre
                  ? 'true'
                  : 'false'
              }
            />

            {mostrarError('nombre')}

          </div>


          {/* ==================================================
              APELLIDO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="apellido">
              Apellidos *
            </label>

            <input
              id="apellido"
              type="text"
              name="apellido"
              value={paciente.apellido}
              onChange={handleChange}
              placeholder="Ingrese los apellidos"
              minLength="2"
              maxLength="100"
              className={
                errores.apellido
                  ? 'input-error'
                  : ''
              }
              aria-invalid={
                errores.apellido
                  ? 'true'
                  : 'false'
              }
            />

            {mostrarError('apellido')}

          </div>


          {/* ==================================================
              CORREO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              name="correo"
              value={paciente.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              maxLength="150"
              className={
                errores.correo
                  ? 'input-error'
                  : ''
              }
              aria-invalid={
                errores.correo
                  ? 'true'
                  : 'false'
              }
            />

            {mostrarError('correo')}

          </div>


          {/* ==================================================
              TELÉFONO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="telefono">
              Teléfono
            </label>

            <input
              id="telefono"
              type="tel"
              name="telefono"
              value={paciente.telefono}
              onChange={handleChange}
              placeholder="Ej. 300 123 4567"
              maxLength="25"
              className={
                errores.telefono
                  ? 'input-error'
                  : ''
              }
              aria-invalid={
                errores.telefono
                  ? 'true'
                  : 'false'
              }
            />

            {mostrarError('telefono')}

          </div>


          {/* ==================================================
              FECHA DE NACIMIENTO
              ================================================== */}

          <div className="form-group">

            <label htmlFor="fechaNacimiento">
              Fecha de nacimiento
            </label>

            <input
              id="fechaNacimiento"
              type="date"
              name="fechaNacimiento"
              value={paciente.fechaNacimiento}
              onChange={handleChange}
              className={
                errores.fechaNacimiento
                  ? 'input-error'
                  : ''
              }
              aria-invalid={
                errores.fechaNacimiento
                  ? 'true'
                  : 'false'
              }
            />

            {mostrarError('fechaNacimiento')}

          </div>


          {/* ==================================================
              DIRECCIÓN
              ================================================== */}

          <div className="form-group full">

            <label htmlFor="direccion">
              Dirección
            </label>

            <input
              id="direccion"
              type="text"
              name="direccion"
              value={paciente.direccion}
              onChange={handleChange}
              placeholder="Ingrese la dirección de residencia"
              maxLength="250"
              className={
                errores.direccion
                  ? 'input-error'
                  : ''
              }
              aria-invalid={
                errores.direccion
                  ? 'true'
                  : 'false'
              }
            />

            {mostrarError('direccion')}

          </div>


          {/* ==================================================
              BOTONES
              ================================================== */}

          <div className="form-buttons">

            <button
              type="submit"
              className="btn-primary"
              disabled={cargando}
            >

              {cargando
                ? 'Procesando...'
                : idPacienteEditando !== null
                  ? 'Actualizar'
                  : 'Guardar'}

            </button>


            <button
              type="button"
              className="btn-secondary"
              onClick={limpiarFormulario}
              disabled={cargando}
            >

              {idPacienteEditando !== null
                ? 'Cancelar edición'
                : 'Limpiar'}

            </button>

          </div>

        </form>

      </div>


      {/* ======================================================
          TABLA DE PACIENTES
          ====================================================== */}

      <PacienteTable
        pacientes={pacientes}
        onEditar={editarPaciente}
        onEliminar={eliminarPaciente}
      />


    </section>

  )

}


/*
  ============================================================
  EXPORTACIÓN
  ============================================================
*/

export default Paciente