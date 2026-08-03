/*
  ============================================================
  Profesional.jsx
  ============================================================

  Página principal del módulo de gestión de profesionales.

  Este componente permite:

  - Consultar profesionales registrados en MySQL.
  - Registrar nuevos profesionales.
  - Editar profesionales existentes.
  - Eliminar profesionales.
  - Validar la información antes de enviarla.
  - Mostrar mensajes informativos al usuario.
  - Seleccionar Departamento y, según ese departamento,
    seleccionar el Municipio, ambos obtenidos desde la
    API pública externa "API Colombia" (a través del
    backend propio, que actúa como intermediario).

  Arquitectura utilizada (módulo Profesional):

  React
      ↓
  Axios (ProfesionalService.js)
      ↓
  Spring Boot
      ↓
  ProfesionalController
      ↓
  ProfesionalService / ProfesionalServiceImpl
      ↓
  ProfesionalRepository
      ↓
  MySQL

  Arquitectura utilizada (Departamento / Municipio):

  React
      ↓
  Axios (ColombiaService.js)
      ↓
  Spring Boot (ApiColombiaController -> /api/publica/colombia)
      ↓
  ApiColombiaService
      ↓
  API externa: https://api-colombia.com
*/

import { useEffect, useRef, useState } from 'react'

/*
  Importa los estilos propios del módulo Profesional.
*/
import './Profesional.css'

/*
  Importa el componente encargado de mostrar
  la tabla de profesionales.
*/
import ProfesionalTable from '../components/ProfesionalTable'

/*
  Importa las funciones que realizan las peticiones
  HTTP al backend para el módulo Profesional.
*/
import {
  getProfesionales,
  crearProfesional,
  actualizarProfesional,
  eliminarProfesional
} from '../services/ProfesionalService'

/*
  Importa las funciones que consultan Departamento
  y Municipio a través de la API pública externa.
*/
import {
  getDepartamentos,
  getMunicipiosPorDepartamento
} from '../services/ColombiaService'


/*
  ============================================================
  LISTA DE ESPECIALIDADES
  ============================================================

  Se maneja como una lista fija en el frontend, igual
  que se hace con las especialidades de Técnico en el
  proyecto guía ServiGestor360.
*/
const especialidades = [
  'Odontología General',
  'Ortodoncia',
  'Endodoncia',
  'Periodoncia',
  'Cirugía Oral',
  'Odontopediatría',
  'Higiene Dental'
]


/*
  ============================================================
  ESTADO INICIAL DEL FORMULARIO
  ============================================================
*/
const formularioInicial = () => ({
  identificacion: '',
  nombre: '',
  apellido: '',
  especialidad: '',
  telefono: '',
  correo: '',
  direccion: '',
  registroProfesional: '',
  estado: 'Activo',
  departamento: '',
  municipio: ''
})


/*
  ============================================================
  COMPONENTE PROFESIONAL
  ============================================================
*/
function Profesional() {

  /*
    Permite desplazar automáticamente la pantalla hasta
    el encabezado del módulo cuando se selecciona "Editar".
  */
  const encabezadoProfesionalRef = useRef(null)


  /*
    ==========================================================
    ESTADOS
    ==========================================================
  */

  const [profesionales, setProfesionales] = useState([])

  const [profesional, setProfesional] = useState(
    formularioInicial()
  )

  /*
    Guarda el ID del profesional que se está editando.

    null = registro nuevo.
    número = edición de un profesional existente.
  */
  const [idProfesionalEditando, setIdProfesionalEditando] =
    useState(null)

  const [mensaje, setMensaje] = useState('')

  const [tipoMensaje, setTipoMensaje] = useState('info')

  const [errores, setErrores] = useState({})

  const [cargando, setCargando] = useState(false)

  /*
    Departamentos y municipios obtenidos desde
    la API pública externa "API Colombia".
  */
  const [departamentos, setDepartamentos] = useState([])

  const [municipios, setMunicipios] = useState([])


  /*
    ==========================================================
    CARGA INICIAL
    ==========================================================

    Al abrir el módulo se consultan, en paralelo:

    - Los profesionales ya registrados (backend propio).
    - Los departamentos de Colombia (API externa, a través
      del backend propio).
  */
  useEffect(() => {

    cargarProfesionales()
    cargarDepartamentos()

  }, [])


  /*
    ============================================================
    CARGAR PROFESIONALES
    ============================================================
  */
  const cargarProfesionales = async () => {

    try {

      setCargando(true)

      const respuesta = await getProfesionales()

      setProfesionales(respuesta.data)

    } catch (error) {

      console.error(
        'Error al cargar los profesionales:',
        error
      )

      mostrarMensaje(
        'No fue posible cargar los profesionales. Verifique que Spring Boot esté ejecutándose.',
        'error'
      )

    } finally {

      setCargando(false)

    }

  }


  /*
    ============================================================
    CARGAR DEPARTAMENTOS (API COLOMBIA)
    ============================================================
  */
  const cargarDepartamentos = async () => {

    try {

      const respuesta = await getDepartamentos()

      setDepartamentos(respuesta.data)

    } catch (error) {

      console.error(
        'Error al cargar los departamentos desde API Colombia:',
        error
      )

      mostrarMensaje(
        'No fue posible cargar los departamentos. La API pública externa podría no estar disponible.',
        'error'
      )

    }

  }


  /*
    ============================================================
    CARGAR MUNICIPIOS SEGÚN EL DEPARTAMENTO (API COLOMBIA)
    ============================================================
  */
  const cargarMunicipios = async (idDepartamento) => {

    try {

      const respuesta =
        await getMunicipiosPorDepartamento(idDepartamento)

      setMunicipios(respuesta.data)

    } catch (error) {

      console.error(
        'Error al cargar los municipios desde API Colombia:',
        error
      )

      setMunicipios([])

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
    MANEJO DE CAMBIOS EN EL FORMULARIO
    ============================================================
  */
  const handleChange = (e) => {

    const { name, value } = e.target

    setProfesional((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value
    }))

    if (errores[name]) {

      setErrores((erroresAnteriores) => ({
        ...erroresAnteriores,
        [name]: ''
      }))

    }

  }


  /*
    ============================================================
    MANEJO DEL CAMBIO DE DEPARTAMENTO
    ============================================================

    Al cambiar el departamento:

    1. Se guarda el nombre del departamento seleccionado
       en el formulario (es lo que finalmente se envía
       y se guarda en la base de datos propia).

    2. Se limpia el municipio seleccionado previamente,
       ya que corresponde a otro departamento.

    3. Se consultan, en la API Colombia, los municipios
       del nuevo departamento seleccionado.
  */
  const handleChangeDepartamento = (e) => {

    const nombreDepartamento = e.target.value

    const departamentoSeleccionado = departamentos.find(
      (dep) => dep.name === nombreDepartamento
    )

    setProfesional((datosAnteriores) => ({
      ...datosAnteriores,
      departamento: nombreDepartamento,
      municipio: ''
    }))

    setMunicipios([])

    if (departamentoSeleccionado) {

      cargarMunicipios(departamentoSeleccionado.id)

    }

  }


  /*
    ============================================================
    VALIDAR FORMULARIO
    ============================================================
  */
  const validarFormulario = () => {

    const nuevosErrores = {}

    if (!profesional.identificacion.trim()) {
      nuevosErrores.identificacion =
        'La identificación es obligatoria.'
    }

    if (!profesional.nombre.trim()) {
      nuevosErrores.nombre =
        'El nombre es obligatorio.'
    }

    if (!profesional.apellido.trim()) {
      nuevosErrores.apellido =
        'El apellido es obligatorio.'
    }

    if (!profesional.especialidad) {
      nuevosErrores.especialidad =
        'Seleccione una especialidad.'
    }

    if (!profesional.telefono.trim()) {
      nuevosErrores.telefono =
        'El teléfono es obligatorio.'
    }

    const correo = profesional.correo.trim()

    if (!correo) {

      nuevosErrores.correo =
        'El correo es obligatorio.'

    } else if (!/^\S+@\S+\.\S+$/.test(correo)) {

      nuevosErrores.correo =
        'Ingrese un correo con formato válido.'

    }

    setErrores(nuevosErrores)

    return Object.keys(nuevosErrores).length === 0

  }


  /*
    ============================================================
    GUARDAR PROFESIONAL (CREAR O ACTUALIZAR)
    ============================================================
  */
  const guardarProfesional = async (e) => {

    e.preventDefault()

    if (!validarFormulario()) {

      mostrarMensaje(
        'Por favor corrija los errores señalados en el formulario.',
        'error'
      )

      return

    }

    try {

      setCargando(true)

      if (idProfesionalEditando !== null) {

        await actualizarProfesional(
          idProfesionalEditando,
          profesional
        )

        mostrarMensaje(
          'Profesional actualizado correctamente.',
          'success'
        )

      } else {

        await crearProfesional(profesional)

        mostrarMensaje(
          'Profesional registrado correctamente.',
          'success'
        )

      }

      limpiarFormulario()
      cargarProfesionales()

    } catch (error) {

      console.error(
        'Error al guardar el profesional:',
        error
      )

      mostrarMensaje(
        'No fue posible guardar el profesional. Verifique los datos e intente nuevamente.',
        'error'
      )

    } finally {

      setCargando(false)

    }

  }


  /*
    ============================================================
    EDITAR PROFESIONAL
    ============================================================
  */
  const editarProfesional = (profesionalSeleccionado) => {

    setProfesional({
      identificacion: profesionalSeleccionado.identificacion || '',
      nombre: profesionalSeleccionado.nombre || '',
      apellido: profesionalSeleccionado.apellido || '',
      especialidad: profesionalSeleccionado.especialidad || '',
      telefono: profesionalSeleccionado.telefono || '',
      correo: profesionalSeleccionado.correo || '',
      direccion: profesionalSeleccionado.direccion || '',
      registroProfesional: profesionalSeleccionado.registroProfesional || '',
      estado: profesionalSeleccionado.estado || 'Activo',
      departamento: profesionalSeleccionado.departamento || '',
      municipio: profesionalSeleccionado.municipio || ''
    })

    setIdProfesionalEditando(profesionalSeleccionado.idProfesional)

    setErrores({})

    mostrarMensaje(
      `Editando al profesional #${profesionalSeleccionado.idProfesional}.`,
      'info'
    )

    /*
      Si el profesional ya tenía un departamento guardado,
      se cargan sus municipios para que el select quede
      disponible con las opciones correctas.
    */
    if (profesionalSeleccionado.departamento) {

      const departamentoSeleccionado = departamentos.find(
        (dep) => dep.name === profesionalSeleccionado.departamento
      )

      if (departamentoSeleccionado) {

        cargarMunicipios(departamentoSeleccionado.id)

      }

    }

    /*
      Desplaza la pantalla hasta el encabezado del módulo.
    */
    encabezadoProfesionalRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

  }


  /*
    ============================================================
    ELIMINAR PROFESIONAL
    ============================================================
  */
  const eliminarProfesionalHandler = async (idProfesional) => {

    const confirmar = window.confirm(
      '¿Está seguro de eliminar este profesional?'
    )

    if (!confirmar) {
      return
    }

    try {

      await eliminarProfesional(idProfesional)

      mostrarMensaje(
        'Profesional eliminado correctamente.',
        'success'
      )

      cargarProfesionales()

    } catch (error) {

      console.error(
        'Error al eliminar el profesional:',
        error
      )

      mostrarMensaje(
        'No fue posible eliminar el profesional.',
        'error'
      )

    }

  }


  /*
    ============================================================
    LIMPIAR FORMULARIO
    ============================================================
  */
  const limpiarFormulario = () => {

    setProfesional(formularioInicial())
    setIdProfesionalEditando(null)
    setErrores({})
    setMunicipios([])

  }


  /*
    ============================================================
    MOSTRAR ERROR DE UN CAMPO
    ============================================================
  */
  const mostrarError = (campo) => {

    if (!errores[campo]) {
      return null
    }

    return (
      <span className="field-error">
        {errores[campo]}
      </span>
    )

  }


  /*
    ============================================================
    RENDER
    ============================================================
  */
  return (

    <section className="Profesional-module">

      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div
        className="module-header"
        ref={encabezadoProfesionalRef}
      >

        <span className="module-tag">
          Módulo Profesional
        </span>

        <h2>
          Gestión de Profesionales
        </h2>

        <p>
          Registra, consulta y administra los profesionales del
          sistema, seleccionando su ubicación (Departamento y
          Municipio) desde la API pública externa API Colombia.
        </p>

      </div>


      {/* ======================================================
          MENSAJE
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
          {idProfesionalEditando !== null
            ? `Editar Profesional #${idProfesionalEditando}`
            : 'Formulario Profesional'}
        </h3>

        <form
          className="Profesional-form"
          onSubmit={guardarProfesional}
          noValidate
        >

          {/* ================================================
              IDENTIFICACIÓN
              ================================================ */}

          <div className="form-group">

            <label htmlFor="identificacion">
              Identificación *
            </label>

            <input
              id="identificacion"
              type="text"
              name="identificacion"
              value={profesional.identificacion}
              onChange={handleChange}
              placeholder="Ingrese la identificación"
              maxLength="50"
              className={errores.identificacion ? 'input-error' : ''}
            />

            {mostrarError('identificacion')}

          </div>


          {/* ================================================
              NOMBRE
              ================================================ */}

          <div className="form-group">

            <label htmlFor="nombre">
              Nombres *
            </label>

            <input
              id="nombre"
              type="text"
              name="nombre"
              value={profesional.nombre}
              onChange={handleChange}
              placeholder="Ingrese los nombres"
              maxLength="100"
              className={errores.nombre ? 'input-error' : ''}
            />

            {mostrarError('nombre')}

          </div>


          {/* ================================================
              APELLIDO
              ================================================ */}

          <div className="form-group">

            <label htmlFor="apellido">
              Apellidos *
            </label>

            <input
              id="apellido"
              type="text"
              name="apellido"
              value={profesional.apellido}
              onChange={handleChange}
              placeholder="Ingrese los apellidos"
              maxLength="100"
              className={errores.apellido ? 'input-error' : ''}
            />

            {mostrarError('apellido')}

          </div>


          {/* ================================================
              ESPECIALIDAD
              ================================================ */}

          <div className="form-group">

            <label htmlFor="especialidad">
              Especialidad *
            </label>

            <select
              id="especialidad"
              name="especialidad"
              value={profesional.especialidad}
              onChange={handleChange}
              className={errores.especialidad ? 'input-error' : ''}
            >

              <option value="">
                Seleccione una especialidad
              </option>

              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}

            </select>

            {mostrarError('especialidad')}

          </div>


          {/* ================================================
              TELÉFONO
              ================================================ */}

          <div className="form-group">

            <label htmlFor="telefono">
              Teléfono *
            </label>

            <input
              id="telefono"
              type="tel"
              name="telefono"
              value={profesional.telefono}
              onChange={handleChange}
              placeholder="Ej. 300 123 4567"
              maxLength="25"
              className={errores.telefono ? 'input-error' : ''}
            />

            {mostrarError('telefono')}

          </div>


          {/* ================================================
              CORREO
              ================================================ */}

          <div className="form-group">

            <label htmlFor="correo">
              Correo electrónico *
            </label>

            <input
              id="correo"
              type="email"
              name="correo"
              value={profesional.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              maxLength="150"
              className={errores.correo ? 'input-error' : ''}
            />

            {mostrarError('correo')}

          </div>


          {/* ================================================
              REGISTRO PROFESIONAL
              ================================================ */}

          <div className="form-group">

            <label htmlFor="registroProfesional">
              Registro profesional
            </label>

            <input
              id="registroProfesional"
              type="text"
              name="registroProfesional"
              value={profesional.registroProfesional}
              onChange={handleChange}
              placeholder="Ej. TP-123456"
              maxLength="50"
            />

          </div>


          {/* ================================================
              ESTADO
              ================================================ */}

          <div className="form-group">

            <label htmlFor="estado">
              Estado
            </label>

            <select
              id="estado"
              name="estado"
              value={profesional.estado}
              onChange={handleChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

          </div>


          {/* ================================================
              DEPARTAMENTO (API COLOMBIA)
              ================================================ */}

          <div className="form-group">

            <label htmlFor="departamento">
              Departamento
            </label>

            <select
              id="departamento"
              name="departamento"
              value={profesional.departamento}
              onChange={handleChangeDepartamento}
            >

              <option value="">
                Seleccione un departamento
              </option>

              {departamentos.map((departamento) => (
                <option
                  key={departamento.id}
                  value={departamento.name}
                >
                  {departamento.name}
                </option>
              ))}

            </select>

          </div>


          {/* ================================================
              MUNICIPIO (API COLOMBIA, según Departamento)
              ================================================ */}

          <div className="form-group">

            <label htmlFor="municipio">
              Municipio
            </label>

            <select
              id="municipio"
              name="municipio"
              value={profesional.municipio}
              onChange={handleChange}
              disabled={!profesional.departamento}
            >

              <option value="">
                {profesional.departamento
                  ? 'Seleccione un municipio'
                  : 'Seleccione primero un departamento'}
              </option>

              {municipios.map((municipio) => (
                <option
                  key={municipio.id}
                  value={municipio.name}
                >
                  {municipio.name}
                </option>
              ))}

            </select>

          </div>


          {/* ================================================
              DIRECCIÓN
              ================================================ */}

          <div className="form-group full">

            <label htmlFor="direccion">
              Dirección
            </label>

            <input
              id="direccion"
              type="text"
              name="direccion"
              value={profesional.direccion}
              onChange={handleChange}
              placeholder="Ingrese la dirección"
              maxLength="250"
            />

          </div>


          {/* ================================================
              BOTONES
              ================================================ */}

          <div className="form-buttons">

            <button
              type="submit"
              className="btn-primary"
              disabled={cargando}
            >
              {cargando
                ? 'Procesando...'
                : idProfesionalEditando !== null
                  ? 'Actualizar'
                  : 'Guardar'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={limpiarFormulario}
              disabled={cargando}
            >
              {idProfesionalEditando !== null
                ? 'Cancelar edición'
                : 'Limpiar'}
            </button>

          </div>

        </form>

      </div>


      {/* ======================================================
          TABLA DE PROFESIONALES
          ====================================================== */}

      <ProfesionalTable
        profesionales={profesionales}
        onEditar={editarProfesional}
        onEliminar={eliminarProfesionalHandler}
      />

    </section>

  )

}


export default Profesional
