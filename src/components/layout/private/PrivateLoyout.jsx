import Header from "./Header"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
const PrivateLoyout = () => {
    console.log('PrivateLayout renderizado...');
    return (
        <>
            <Header></Header>
            <section className="layout__content">
                {/*HEADER*/}

                <Outlet></Outlet>

            </section>
            <Sidebar>
            </Sidebar>
        </>

    )
}

export default PrivateLoyout