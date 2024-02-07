import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Logout = () => {
    const navigate = useNavigate();
    const { setAuth, setCounters } = useAuth();
    //serrar secion con un leve retraso para que el cierre no se de manera abrupta
    useEffect(() => {
        setTimeout(() => {
            //vaciar el local storage
            localStorage.clear();

            //setear estados globales a vacioos
            setAuth({});
            setCounters({})
            //rediracion a login
            navigate('/login');
        }, 500);

    });
    return (
        <h1>Cerrando secion...</h1>
    )
}

export default Logout