/*
============================================================
SEARCHBAR.JSX

Sistema de Gestión de Citas Odontológicas
Consultorio Odontológico Dra. Magda Ortiz

Componente reutilizable de búsqueda.

Se utiliza en todos los módulos (Pacientes, Citas,
Usuarios, Profesionales, Historia Clínica) para filtrar
las tablas por cualquier campo, con el mismo patrón
que ya usa la aplicación móvil:

    texto en minúsculas + includes(búsqueda)
============================================================
*/

import { Search, X } from "lucide-react";

import "./SearchBar.css";


/*
========================================================
COMPONENTE SEARCHBAR

Propiedades:

- valor:      texto actual de búsqueda.
- onChange:   función que recibe el nuevo texto.
- placeholder texto guía del campo.

El botón "X" aparece solo cuando hay texto
y permite limpiar la búsqueda rápidamente.
========================================================
*/

function SearchBar({
    valor,
    onChange,
    placeholder = "Buscar..."
}) {

    return (

        <div className="search-bar">

            <Search size={18} className="search-bar-icon" />

            <input
                type="text"
                value={valor}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="search-bar-input"
            />

            {valor && (

                <button
                    type="button"
                    className="search-bar-clear"
                    onClick={() => onChange("")}
                    title="Limpiar búsqueda"
                >

                    <X size={16} />

                </button>

            )}

        </div>

    );

}


export default SearchBar;
