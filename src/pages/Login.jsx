/*
============================================================
Login.jsx

Sistema de Gestión de Citas Odontológicas

Pantalla premium de inicio de sesión.

Incluye:

- Identidad visual del consultorio.
- Logo institucional.
- Iconografía profesional.
- Mostrar/ocultar contraseña.
- Autenticación JWT.

============================================================
*/


import { useState } from "react";


import {
    User,
    LockKeyhole,
    LogIn,
    Eye,
    EyeOff
} from "lucide-react";


import { login } from "../services/AuthService";


import logoConsultorio from "../assets/logo-consultorio.png";

import hojasVerdes from "../assets/hojas-verdes.png";





function Login({ onLoginExitoso }) {





    /*
    ========================================================
    ESTADOS
    ========================================================
    */


    const [credenciales, setCredenciales] = useState({

        username: "",

        password: ""

    });




    const [mensaje, setMensaje] = useState("");




    const [cargando, setCargando] = useState(false);




    const [mostrarPassword, setMostrarPassword] = useState(false);









    /*
    ========================================================
    MANEJAR CAMBIOS
    ========================================================
    */


    const manejarCambio = (evento) => {


        const {

            name,

            value

        } = evento.target;



        setCredenciales({

            ...credenciales,

            [name]: value

        });


    };









    /*
    ========================================================
    AUTENTICACIÓN
    ========================================================
    */


    const manejarSubmit = async(evento)=>{


        evento.preventDefault();



        try {


            setCargando(true);

            setMensaje("");





            const respuesta = await login(

                credenciales.username,

                credenciales.password

            );







            const {

                token,

                ...datosUsuario

            } = respuesta.data;







            localStorage.setItem(

                "token",

                token

            );







            localStorage.setItem(

                "usuario",

                JSON.stringify(datosUsuario)

            );







            onLoginExitoso(

                datosUsuario

            );





        }

        catch(error){



            console.error(

                "Error al iniciar sesión:",

                error

            );





            /*
            =================================================
            ERROR DE CREDENCIALES
            =================================================

            Spring Security responde 401 cuando
            las credenciales son incorrectas.

            Se mantiene 404 por compatibilidad.
            */

            if(

                error.response?.status === 401

                ||

                error.response?.status === 404

            ){



                setMensaje(

                    "Usuario o contraseña incorrectos."

                );


            }

            else {


                setMensaje(

                    "No fue posible iniciar sesión. Intente nuevamente."

                );


            }


        }

        finally {


            setCargando(false);


        }


    };









    return (



        <div className="login-container">





            <div className="login-box">







                <div className="login-logo">



                    <img

                        src={logoConsultorio}

                        alt="Consultorio Odontológico Dra. Magda Ortiz"

                    />



                </div>






                <img

                    src={hojasVerdes}

                    className="login-decoration"

                    alt=""

                />









                <div className="module-title">



                    <h2>

                        Iniciar sesión

                    </h2>





                    <p>

                        Sistema de Gestión de Citas Odontológicas

                        <br/>

                        Consultorio Odontológico Dra. Magda Ortiz

                    </p>



                </div>









                {

                    mensaje && (



                        <div className="message">


                            {mensaje}


                        </div>



                    )

                }









                <form onSubmit={manejarSubmit}>







                    <div className="form-group">





                        <label

                            htmlFor="username"

                            className="input-label"

                        >


                            <User

                                size={17}

                                className="label-icon"

                            />


                            <span>

                                Nombre de usuario

                            </span>



                        </label>









                        <div className="input-icon-wrapper">



                            <input

                                id="username"

                                name="username"

                                type="text"

                                placeholder="Ingresa tu usuario"

                                value={credenciales.username}

                                onChange={manejarCambio}

                                required

                            />



                        </div>





                    </div>









                    <div className="form-group">





                        <label

                            htmlFor="password"

                            className="input-label"

                        >


                            <LockKeyhole

                                size={17}

                                className="label-icon"

                            />



                            <span>

                                Contraseña

                            </span>



                        </label>









                        <div className="input-icon-wrapper password-wrapper">





                            <input

                                id="password"

                                name="password"

                                type={

                                    mostrarPassword

                                    ?

                                    "text"

                                    :

                                    "password"

                                }

                                placeholder="Ingresa tu contraseña"

                                value={credenciales.password}

                                onChange={manejarCambio}

                                required

                            />









                            <button

                                type="button"

                                className="password-toggle"

                                onClick={()=>


                                    setMostrarPassword(

                                        !mostrarPassword

                                    )


                                }

                            >



                                {

                                    mostrarPassword

                                    ?

                                    <EyeOff size={19}/>

                                    :

                                    <Eye size={19}/>


                                }



                            </button>





                        </div>







                    </div>









                    <div className="form-buttons">





                        <button

                            type="submit"

                            className="btn-primary"

                            disabled={cargando}

                        >



                            <LogIn size={20}/>





                            <span>


                            {

                                cargando

                                ?

                                "Ingresando..."

                                :

                                "Ingresar al sistema"


                            }



                            </span>





                        </button>





                    </div>







                </form>









                <div className="login-footer-message">





                    <span className="line"></span>





                    <span className="footer-tooth">

                        🦷

                    </span>





                    <p>

                        Cuidamos tu sonrisa, cuidamos de ti

                    </p>





                    <span className="line"></span>







                </div>







            </div>







        </div>



    );


}





export default Login;