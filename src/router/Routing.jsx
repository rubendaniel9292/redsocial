//import { Routes, Router, Navigate } from "react-router-dom"
import { Routes, Route, HashRouter, Link, BrowserRouter } from 'react-router-dom'; // Cambio a HashRouter
import PublicLayout from '../components/layout/public/PublicLayout';
import Login from '../components/user/Login';
import Register from '../components/user/Register';
import PrivateLoyout from '../components/layout/private/PrivateLoyout';
import Feed from '../components/publication/Feed';
import {AuthProvider}  from '../context/AuthProvider';
import Logout from '../components/user/Logout';
import People from '../components/user/People';
import Config from '../components/layout/private/Config';
import Following from '../components/follow/Following';
import Followers from '../components/follow/Followers';
const Routing = () => {
    return (
        // Uso de Contexto en la aplicación
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout></PublicLayout>}>
                        <Route index element={<Login></Login>}></Route>
                        <Route path='login' element={<Login></Login>}></Route>
                        <Route path='registro' element={<Register></Register>}></Route>
                    </Route>
                    {/* todas las rutas privadas que empiecen con SOCIAL*/}
                    <Route path='/social' element={<PrivateLoyout></PrivateLoyout>}>
                        <Route index element={<Feed></Feed>}></Route>
                        <Route path='feed' element={<Feed></Feed>}></Route>
                        <Route path='logout' element={<Logout></Logout>}></Route>
                        <Route path='people' element={<People></People>}></Route>
                        <Route path='config' element={<Config></Config>}></Route>
                        <Route path='siguiendo/:userId' element={<Following></Following>}></Route>
                        <Route path='seguidores/:userId' element={<Followers></Followers>}></Route>
                    </Route>

                    <Route path='*'
                        element={
                            <>
                                <p>
                                    <h1>Error 404: la página no existe</h1>

                                    <Link to='/'>Volver al inicio</Link>
                                </p>
                            </>
                        }

                    ></Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default Routing