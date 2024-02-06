import { useState, useEffect, createContext } from "react";
import { Global } from "../helpers/Global";
import PropTypes from 'prop-types';
/*
se define un contexto usando createContext para compartir 
datos entre componentes sin tener que pasar props manualmente
*/
const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    //cada vez que se use este componente o se carge la pantalla, se comprueba el token mediante useEffect
    useEffect(() => {
        //se ejecuta cada vez que se ejecuta este contexto
        authUser();

    }, []);
    //autenticar de manera asincrona al usuario

    const authUser = async () => {
        try {
            //sacar datos de usuario identificado de local storage
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            //si se muestran los consoles
            console.log('LocalStorage token:', token);
            console.log('LocalStorage user:', user);
            //comprobar si tengo el token y el user
            if (!token || !user) return false;
            //transofrmar los datos a un objeto de JS.
            const userObj = JSON.parse(user);//acceder al objeto user
            const userId = userObj._id;//obtener el usuario identificado
            //peticion ajax al backend que compruebe el token y que me devuelva todos los datos de pergil del usuario para tenerlos en el estado de auth
            const request = await fetch(Global.url + 'user/porfile/' + userId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
           
            //validaciones
            if (!request.ok) {
                //verificar si el token ha caducado y manejarlo adecuadamente
                if (request.status === 401) {
                    // Manejar el caso en que el token haya expirado
                    console.warn('Token expirado');
                    // Realizar acciones como cerrar sesión o redirigir a la página de inicio de sesión para cerra sion
                    //localStorage.removeItem('token');
                } else {
                    throw new Error('Error al obtener el perfil del usuario.');
                }
            }

            //peticion para los contadores
           

            //setear el estado de auth
            const data = await request.json();
            const requestCounters = await fetch(Global.url + 'user/counters/' + userId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const dataCounters = await requestCounters.json();
            
            setAuth(data.user);//si se muestran los datos
            setCounters(dataCounters)
           

        }
        catch (error) {
            console.error('Error al autenticar al usuario:', error);
        }

    }
    return (
        /*envuelves tus componentes con un proveedor de contexto 
        para obetner acceso a estos dos metodos en cualquier componente
        */
        <AuthContext.Provider value={{ auth, setAuth, counters}}>
            {children}
        </AuthContext.Provider>
    )
}
// Validación de Propiedades, se suguiere como buena practica

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
//export default AuthContext;
export {AuthContext, AuthProvider} ;