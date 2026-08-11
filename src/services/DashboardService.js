/*
============================================================
DashboardService.js

Sistema de Gestión de Citas Odontológicas

Servicio encargado de consumir los endpoints
principales del Dashboard.

Endpoints:

/api/dashboard/admin

/api/dashboard/profesional

/api/dashboard/recepcionista

============================================================
*/


import axios from "axios";



const API_URL =

    "http://localhost:8765/api/dashboard";





/*
============================================================
CONFIGURACIÓN JWT

Obtiene el token guardado
después del login.

============================================================
*/


const obtenerConfigAuth = () => {


    const token =

        localStorage.getItem("token");



    return {


        headers: {


            Authorization:

                `Bearer ${token}`


        }


    };


};







/*
============================================================
DASHBOARD ADMINISTRADOR

============================================================
*/


export const obtenerDashboardAdmin = () => {


    return axios.get(

        `${API_URL}/admin`,

        obtenerConfigAuth()

    );


};








/*
============================================================
DASHBOARD PROFESIONAL

============================================================
*/


export const obtenerDashboardProfesional = () => {


    return axios.get(

        `${API_URL}/profesional`,

        obtenerConfigAuth()

    );


};







/*
============================================================
DASHBOARD RECEPCIONISTA

============================================================
*/


export const obtenerDashboardRecepcionista = () => {


    return axios.get(

        `${API_URL}/recepcionista`,

        obtenerConfigAuth()

    );


};