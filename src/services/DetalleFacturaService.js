/*
============================================================
DetalleFacturaService.js
Sistema de Gestión de Citas Odontológicas

Servicio para consultar detalles de factura.
============================================================
*/

import axios from "axios";


const API_URL =
    "http://localhost:8765/api/detalles-factura";



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




const listarDetalles = async () => {


    const respuesta =
        await axios.get(
            API_URL,
            obtenerConfigAuth()
        );


    return respuesta.data;

};



export {

    listarDetalles

};