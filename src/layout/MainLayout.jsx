import Navbar from "./Navbar";

import Sidebar from "./Sidebar";


function MainLayout({

    usuario,

    moduloActivo,

    cambiarModulo,

    onLogout,

    children

}) {


    return (

        <div className="main-layout">


            <Navbar

                usuario={usuario}

                onLogout={onLogout}

            />



            <div className="layout-body">


                <Sidebar

                    moduloActivo={moduloActivo}

                    cambiarModulo={cambiarModulo}

                    rol={usuario.rol}

                />



                <main className="layout-content">

                    {children}

                </main>


            </div>


        </div>

    );

}


export default MainLayout;