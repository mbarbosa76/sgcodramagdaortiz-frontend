import {
    LogOut,
    UserCircle
} from "lucide-react";


function Navbar({
    usuario,
    onLogout
}) {


    return (

        <header className="navbar">


            <div className="navbar-brand">


                <div className="navbar-logo">

                    🦷

                </div>


                <div>

                    <h1>
                        Sistema de Gestión de Citas Odontológicas
                    </h1>


                    <p>
                        Consultorio Odontológico Dra. Magda Ortiz
                    </p>

                </div>


            </div>




            <div className="navbar-user">


                <div className="user-info">


                    <UserCircle size={22}/>


                    <span>

                        {usuario.nombre}

                        {" "}

                        ({usuario.rol})

                    </span>


                </div>




                <button

                    type="button"

                    onClick={onLogout}

                >

                    <LogOut size={18}/>

                    Cerrar sesión


                </button>



            </div>



        </header>

    );

}


export default Navbar;