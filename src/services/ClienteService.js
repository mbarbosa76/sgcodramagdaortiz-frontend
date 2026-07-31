// Importa Axios para realizar peticiones HTTP al backend
import axios from 'axios'

// URL base del endpoint Paciente en Spring Boot
const API = 'http://localhost:8765/api/pacientes'

// Obtiene el token JWT almacenado en el navegador
const obtenerConfigAuth = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// Consulta todos los Pacientes registrados
export const getPacientes = () =>
  axios.get(API, obtenerConfigAuth())

// Crea un nuevo Paciente
export const crearPaciente = (Paciente) =>
  axios.post(API, Paciente, obtenerConfigAuth())

// Actualiza un Paciente existente por su ID
export const actualizarPaciente = (idPaciente, Paciente) =>
  axios.put(`${API}/${idPaciente}`, Paciente, obtenerConfigAuth())

// Elimina un Paciente existente por su ID
export const eliminarPaciente = (idPaciente) =>
  axios.delete(`${API}/${idPaciente}`, obtenerConfigAuth())