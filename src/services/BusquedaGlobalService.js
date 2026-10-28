
/*
 * ============================================================
 * BUSQUEDAGLOBALSERVICE.JS
 * SISTEMA DE GESTION DE CITAS ODONTOLOGICAS
 * Consultorio Odontologico Dra. Magda Ortiz (SGCO)
 * ============================================================
 *
 * Servicio encargado de realizar busquedas globales dentro
 * de los diferentes modulos del sistema.
 *
 * Permite buscar informacion relacionada con:
 *
 * - Pacientes.
 * - Profesionales.
 * - Servicios odontologicos.
 * - Usuarios.
 * - Historias clinicas.
 * - Citas.
 *
 * La informacion se obtiene mediante solicitudes HTTP
 * realizadas con Axios al backend Spring Boot.
 *
 * La URL base se obtiene desde la configuracion central
 * ubicada en src/config/api.js.
 *
 * Las solicitudes protegidas utilizan el token JWT
 * almacenado durante el inicio de sesion.
 *
 * ============================================================
 */

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa la URL centralizada del backend.
import { API_BASE_URL } from "../config/api";


/*
 * ============================================================
 * CONFIGURACION DE AUTENTICACION
 * ============================================================
 *
 * Obtiene el token JWT almacenado en el navegador y lo agrega
 * al encabezado Authorization de las solicitudes protegidas.
 */

const config = () => ({

    headers: {

        Authorization: `Bearer ${localStorage.getItem("token")}`

    }

});


/*
 * ============================================================
 * BUSQUEDA GLOBAL
 * ============================================================
 */

/**
 * Busca coincidencias en los diferentes modulos del SGCO.
 *
 * Procedimiento:
 *
 * 1. Recibe el termino ingresado por el usuario.
 * 2. Elimina espacios innecesarios al inicio y al final.
 * 3. Consulta los endpoints configurados.
 * 4. Revisa los datos que devuelve cada modulo.
 * 5. Conserva las coincidencias encontradas.
 * 6. Limita los resultados para evitar listas demasiado largas.
 *
 * Si el termino esta vacio, devuelve una lista vacia.
 *
 * @param {string} termino Texto que se desea buscar.
 * @returns {Promise<Array>} Lista de coincidencias encontradas.
 */
export async function buscarGlobal(termino) {

    /*
     * ========================================================
     * VALIDAR EL TERMINO DE BUSQUEDA
     * ========================================================
     *
     * Se eliminan los espacios al inicio y al final.
     * Si no hay texto, no es necesario consultar el backend.
     */

    const q = termino.trim();

    if (!q) {

        return [];

    }


    /*
     * ========================================================
     * ENDPOINTS DE LOS MODULOS
     * ========================================================
     *
     * Todas las rutas utilizan API_BASE_URL.
     *
     * De esta manera, la busqueda funciona tanto en el entorno
     * local como en el despliegue en la nube, dependiendo de
     * la variable de entorno VITE_API_URL.
     *
     * Se conservan las rutas utilizadas anteriormente
     * por este servicio.
     */

    const peticiones = [

        ["pacientes", `${API_BASE_URL}/pacientes`],

        ["profesionales", `${API_BASE_URL}/profesionales`],

        ["servicios", `${API_BASE_URL}/servicios`],

        ["usuarios", `${API_BASE_URL}/usuarios`],

        ["historias", `${API_BASE_URL}/historias-clinicas`],

        ["citas", `${API_BASE_URL}/citas`]

    ];


    /*
     * ========================================================
     * EJECUTAR LAS CONSULTAS
     * ========================================================
     *
     * Promise.allSettled permite procesar las respuestas
     * aunque alguno de los modulos presente un error.
     *
     * De esta manera, una consulta fallida no impide
     * necesariamente recibir resultados de los demas modulos.
     */

    const respuestas = await Promise.allSettled(

        peticiones.map(([tipo, url]) =>

            axios.get(

                url,

                config()

            ).then(respuesta => ({

                tipo,

                datos: respuesta.data || []

            }))

        )

    );


    /*
     * ========================================================
     * NORMALIZAR LOS VALORES
     * ========================================================
     *
     * Convierte los valores a texto en minusculas.
     * Esto permite comparar datos de diferentes tipos
     * sin depender de mayusculas o minusculas.
     */

    const normalizar = (valor) =>

        String(valor ?? "").toLowerCase();


    /*
     * ========================================================
     * FILTRAR Y ORGANIZAR LOS RESULTADOS
     * ========================================================
     *
     * - Se conservan las consultas que finalizaron correctamente.
     * - Se buscan coincidencias en los valores de cada registro.
     * - Se limita a cinco coincidencias por modulo.
     * - Se limita el resultado final a quince elementos.
     *
     * Se mantiene la estructura de respuesta utilizada
     * anteriormente por los componentes del frontend.
     */

    return respuestas

        .filter(respuesta =>

            respuesta.status === "fulfilled"

        )

        .flatMap(respuesta =>

            respuesta.value.datos

                .filter(item =>

                    Object.values(item).some(valor =>

                        normalizar(valor).includes(

                            q.toLowerCase()

                        )

                    )

                )

                .slice(0, 5)

                .map(item => ({

                    tipo: respuesta.value.tipo,

                    item

                }))

        )

        .slice(0, 15);

}
