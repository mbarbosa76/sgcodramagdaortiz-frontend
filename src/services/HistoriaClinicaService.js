/*
============================================================
HistoriaClinicaService.js
Sistema de Gestión de Citas Odontológicas
============================================================

Servicio encargado de consumir la API REST del módulo
Historia Clínica.

============================================================
*/

import axios from "axios";


const API_URL = "http://localhost:8765/api/historias";


const obtenerConfigAuth = () => {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`

        }

    };

};



const listarHistorias = async () => {

    const respuesta = await axios.get(
        API_URL,
        obtenerConfigAuth()
    );

    return respuesta.data;

};



const crearHistoria = async (historia) => {

    const respuesta = await axios.post(
        API_URL,
        historia,
        obtenerConfigAuth()
    );

    return respuesta.data;

};



const actualizarHistoria = async (
    idHistoria,
    historia
) => {

    const respuesta = await axios.put(
        `${API_URL}/${idHistoria}`,
        historia,
        obtenerConfigAuth()
    );

    return respuesta.data;

};



const eliminarHistoria = async (
    idHistoria
) => {

    await axios.delete(
        `${API_URL}/${idHistoria}`,
        obtenerConfigAuth()
    );

};


export {

    listarHistorias,

    crearHistoria,

    actualizarHistoria,

    eliminarHistoria

};