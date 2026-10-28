/*
============================================================
BuscadorUniversal.jsx

Sistema de Gestión de Citas Odontológicas

Componente de búsqueda reutilizable para las tablas de
TODOS los módulos (Pacientes, Citas, Usuarios,
Profesionales, Historia Clínica, Servicios, Facturación).

Reproduce el mismo comportamiento que ya tiene la App
móvil: mientras el usuario escribe, la lista se va
filtrando en tiempo real, sin importar en cuál campo del
registro coincida el texto (nombre, apellido, documento,
teléfono, correo, estado, etc.).

Cómo se usa:

1. El módulo (por ejemplo Paciente.jsx) mantiene su lista
   completa sin modificarla (ej: `pacientes`).

2. Se agrega este componente arriba de la tabla, pasándole
   la lista completa y una función que recibe el texto que
   el usuario escribió:

     <BuscadorUniversal
        datos={pacientes}
        camposBusqueda={[
            "documento",
            "nombres",
            "apellidos",
            "correo",
            "telefono"
        ]}
        onResultado={(filtrados) => setPacientesFiltrados(filtrados)}
        placeholder="Buscar por nombre, documento, teléfono..."
     />

3. La tabla se dibuja usando `pacientesFiltrados` en vez de
   `pacientes`.

Ventajas de centralizarlo aquí:

- Un solo lugar donde arreglar o mejorar la lógica de
  búsqueda para que se refleje en todos los módulos.
- Mismo look & feel (icono, placeholder, botón de limpiar)
  en toda la aplicación.
============================================================
*/


import { useEffect, useState } from "react";

import { Search, X } from "lucide-react";

import "./BuscadorUniversal.css";




/*
============================================================
FUNCIÓN DE COINCIDENCIA

Recibe un registro (objeto) y el texto buscado, y
devuelve verdadero si CUALQUIERA de los campos indicados
en "camposBusqueda" contiene ese texto.

Se normaliza a minúsculas y sin espacios extremos para que
la búsqueda no distinga mayúsculas/minúsculas.

Si un campo está anidado (ej: paciente.nombres dentro de
una cita), "camposBusqueda" puede recibir una función en
lugar de un nombre de propiedad; en ese caso se ejecuta
esa función sobre el registro para obtener el valor a
comparar.
============================================================
*/

const coincideConBusqueda = (
    registro,
    camposBusqueda,
    textoBuscado
) => {

    return camposBusqueda.some((campo) => {

        let valor;

        if (typeof campo === "function") {
            valor = campo(registro);
        } else {
            valor = registro?.[campo];
        }

        if (valor === null || valor === undefined) {
            return false;
        }

        return valor
            .toString()
            .toLowerCase()
            .includes(textoBuscado);

    });

};




function BuscadorUniversal({

    datos,

    camposBusqueda,

    onResultado,

    placeholder = "Buscar...",

}) {


    /*
    ========================================================
    TEXTO ESCRITO POR EL USUARIO
    ========================================================
    */

    const [texto, setTexto] = useState("");




    /*
    ========================================================
    RE-FILTRAR CADA VEZ QUE:

    - Cambia el texto escrito.
    - Cambia la lista original de datos (por ejemplo,
      porque se recargó desde el backend).
    ========================================================
    */

    useEffect(() => {

        const textoNormalizado =
            texto.trim().toLowerCase();

        if (textoNormalizado === "") {

            onResultado(datos);
            return;

        }

        const resultado = datos.filter((registro) =>
            coincideConBusqueda(
                registro,
                camposBusqueda,
                textoNormalizado
            )
        );

        onResultado(resultado);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texto, datos]);




    return (

        <div className="buscador-universal">

            <Search
                className="buscador-icono"
                size={18}
            />

            <input
                type="text"
                className="buscador-input"
                placeholder={placeholder}
                value={texto}
                onChange={(evento) =>
                    setTexto(evento.target.value)
                }
            />

            {
                texto !== "" && (

                    <button
                        type="button"
                        className="buscador-limpiar"
                        title="Limpiar búsqueda"
                        onClick={() => setTexto("")}
                    >
                        <X size={16} />
                    </button>

                )
            }

        </div>

    );

}


export default BuscadorUniversal;
