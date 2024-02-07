import Header from "./Header"
import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import useAuth from "../../../hooks/useAuth"
const PrivateLoyout = () => {
    /*restringir acceso a usuarios a la parte privada */
    const { auth, loading } = useAuth();

    if (loading) {
        return <h1>Cargando el login...</h1>
    } else {
        return (
            <>
                <Header></Header>
                <section className="layout__content">
                    {/*HEADER*/}
                    {   //si existe el usuario cargar mostrar outlet, y sino que navegue a la parte publica
                        auth._id ? <Outlet></Outlet> : <Navigate to='/login'></Navigate>
                    }
                </section>
                <Sidebar>
                </Sidebar>
            </>

        )
    }

}

export default PrivateLoyout