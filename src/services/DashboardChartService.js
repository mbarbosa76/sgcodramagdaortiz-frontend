/*
============================================================
DashboardChartService.js

Sistema de Gestión de Citas Odontológicas

Servicio encargado de consumir los endpoints
de gráficos del Dashboard según el rol.

Endpoints:

ADMIN:

/api/dashboard/citas-estados

/api/dashboard/facturacion-mensual


PROFESIONAL:

/api/dashboard/profesional/citas-estados


RECEPCIONISTA:

/api/dashboard/recepcionista/citas-estados

============================================================
*/


import axios from "axios";






/*
============================================================
URL BASE DEL BACKEND

============================================================
*/


const API_URL =

    "http://localhost:8765/api/dashboard";








/*
============================================================
CONFIGURACIÓN JWT

Obtiene el token almacenado
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
GRÁFICO GENERAL DE CITAS

Utilizado por:

Administrador.

Obtiene todas las citas
del consultorio agrupadas por estado.

============================================================
*/


export const obtenerCitasEstados = () => {


    return axios.get(

        `${API_URL}/citas-estados`,

        obtenerConfigAuth()

    );


};









/*
============================================================
GRÁFICO DE CITAS DEL PROFESIONAL

Utilizado por:

Profesional autenticado.

Obtiene solamente sus citas.

============================================================
*/


export const obtenerCitasEstadosProfesional = () => {


    return axios.get(

        `${API_URL}/profesional/citas-estados`,

        obtenerConfigAuth()

    );


};









/*
============================================================
GRÁFICO DE CITAS RECEPCIONISTA

Utilizado por:

Recepcionista.

Muestra información operativa
de agenda.

============================================================
*/


export const obtenerCitasEstadosRecepcionista = () => {


    return axios.get(

        `${API_URL}/recepcionista/citas-estados`,

        obtenerConfigAuth()

    );


};









/*
============================================================
GRÁFICO FACTURACIÓN MENSUAL

Utilizado por:

Administrador.

============================================================
*/


export const obtenerFacturacionMensual = () => {


    return axios.get(

        `${API_URL}/facturacion-mensual`,

        obtenerConfigAuth()

    );


};