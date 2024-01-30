import { Outlet } from "react-router-dom"
import Header from "./Header"


const PublicLayout = () => {
    return (
        <>
            {/*HEADER*/}
            <Header></Header>
            {/*CONTENIDO PRINICIPAL*/}
            <section className="layout__content">
                <Outlet></Outlet>

            </section>


        </>
    )
}

export default PublicLayout
