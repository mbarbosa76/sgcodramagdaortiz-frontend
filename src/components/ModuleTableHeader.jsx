/*
============================================================
MODULE TABLE HEADER
============================================================

Componente reutilizable para los encabezados
de las tablas del sistema.

Responsabilidad:

- Mostrar título de la tabla.
- Mostrar descripción del módulo.
- Mostrar buscador uniforme.
- Mantener una identidad visual consistente
  entre todos los módulos.

Módulos que pueden utilizarlo:

- Pacientes.
- Citas.
- Facturación.
- Historia Clínica.
- Servicios.
- Profesionales.
- Usuarios.

============================================================
*/


import SearchBar from "./SearchBar";

import "./ModuleTableHeader.css";



function ModuleTableHeader({

    titulo,

    descripcion,

    busqueda,

    setBusqueda,

    placeholder="Buscar..."

}) {


    return (

        <div className="module-table-header">


            {/* =================================================
                TÍTULO DE TABLA
            ================================================= */}

            <div className="table-title">

                <h3>

                    {titulo}

                </h3>


                <p>

                    {descripcion}

                </p>

            </div>



            {/* =================================================
                BUSCADOR GENERAL

                Se reutiliza el componente SearchBar
                existente para mantener la misma experiencia
                visual en todo el sistema.
            ================================================= */}

            <SearchBar

                valor={busqueda}

                onChange={setBusqueda}

                placeholder={placeholder}

            />


        </div>

    );

}


export default ModuleTableHeader;