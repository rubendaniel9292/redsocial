//import { Routes, Router, Navigate } from "react-router-dom"
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom'; // Cambio a HashRouter
import PublicLayout from '../components/layout/public/PublicLayout';
import Login from '../components/user/Login';
import Register from '../components/user/Register';
import PrivateLoyout from '../components/layout/private/PrivateLoyout';
import Feed from '../components/publication/Feed';
const Routing = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<PublicLayout></PublicLayout>}>
                    <Route index element={<Login></Login>}></Route>
                    <Route path='login' element={<Login></Login>}></Route>
                    <Route path='registro' element={<Register></Register>}></Route>
                </Route>
                {/* todas las rutas que empiecen con SOCIAL*/}
                <Route path='/social' element={<PrivateLoyout></PrivateLoyout>}>
                    <Route index element={<Feed></Feed>}></Route>
                    <Route path='feed' element={<Feed></Feed>}></Route>

                </Route>
            </Routes>
        </HashRouter>

    )
}

export default Routing