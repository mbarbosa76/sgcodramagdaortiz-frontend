/*
============================================================
FacturaService.js
Sistema de Gestión de Citas Odontológicas

Servicio encargado de consumir la API REST
del módulo Facturación.

============================================================
*/

import axios from "axios";


const API_URL =
    "http://localhost:8765/api/facturas";



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




const listarFacturas = async () => {


    const respuesta =
        await axios.get(
            API_URL,
            obtenerConfigAuth()
        );


    return respuesta.data;

};




const crearFactura = async (factura) => {


    const respuesta =
        await axios.post(

            API_URL,

            factura,

            obtenerConfigAuth()

        );


    return respuesta.data;

};




const eliminarFactura = async (idFactura) => {


    await axios.delete(

        `${API_URL}/${idFactura}`,

        obtenerConfigAuth()

    );

};



export {

    listarFacturas,

    crearFactura,

    eliminarFactura

};