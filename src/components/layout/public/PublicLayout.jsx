import { Navigate, Outlet } from "react-router-dom"
import Header from "./Header"
import useAuth from "../../../hooks/useAuth"


const PublicLayout = () => {
    const {auth} = useAuth();
    return (
        <>
            {/*HEADER*/}
            <Header></Header>
            {/*CONTENIDO PRINICIPAL*/}
            <section className="layout__content">
                {
                //validar si no existe el usuario identifado mostrar la parte publica, login y registro
                !auth._id ? 
                <Outlet></Outlet>:<Navigate to='/social'></Navigate>
                }
                

            </section>


        </>
    )
}

export default PublicLayout;
