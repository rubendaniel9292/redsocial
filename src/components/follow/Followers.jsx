import { useEffect, useState } from 'react';
//import avatar from '../../assets/img/user.jpg'
import { Global } from "../../helpers/Global";
//import useAuth from '../../hooks/useAuth';
import UserList from '../user/UserList';
import { useParams } from 'react-router-dom';

const Followers = () => {

    const [users, setUser] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        getUsers(page);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);//sin dependencia para cargar todos los usarios en un solo listado en al misma pagina, 
    //con dependecia [page] si deseo cargar solo los usuarios de una determinada pagina
    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        //sacar userId la url
        const userId = params.userId;
        //peticion para sacar usuarios
        const request = await fetch(Global.url + 'follow/followers/' + userId + '/' + nextPage, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await request.json();
        //recorrer y limpiar follows para quedarme con follow
        let cleanUsrers = [];
        data.follows.forEach(follow => {
            cleanUsrers = [...cleanUsrers, follow.user]

        });
        console.log('clean users:', cleanUsrers)
        data.users = cleanUsrers;
        console.log('datausers: ', data.users)

        //estado para poder listarlos
        if (data.users && data.status === 'success') {
            //let newUser = data.user;
            let newUser = (nextPage === 1) ? data.users : [...users, ...data.user];
            /*validacion con ternaria: 
            Al utilizar la expresión condicional (nextPage === 1) ? data.user : [...users, ...data.user], 
            estás asegurándote de que cuando nextPage es igual a 1 (es decir, la primera página), 
            se establecerá directamente la lista de usuarios obtenidos de la respuesta de la API (data.user). 
            De lo contrario, cuando nextPage no es igual a 1 (cualquier página que no sea la primera), 
            se concatenarán los nuevos usuarios (data.user) a la lista existente de usuarios (users). 
            Esto asegura que no se dupliquen los usuarios y que se maneje correctamente la paginación.
        
            if (users.length >= 1) {
                newUser = [...users, ...data.user]//asignar todos los usuarios del estado mas los siguientes que voy a sacar

            }*/
            console.log('listado de seguimiento: ', newUser);
            setUser(newUser);
            setFollowing(data.user_following);
            //console.log('listado de seguimiento: ', following);//es decir si lo estoy siguiendo
            setLoading(false);
        }else{
            console.log('no se muestra el newuser')
        }
        //paginacion
        /*compara si el numero de usuarios en el estado es mayor o igual al total de usuarios de la bd oculta el boton*/
        if (users.length >= data.total) {
            setMore(false);//setea el estado del boton para que no se muestre o mostrart boton
        }
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Seguidores</h1>
            </header>
            <UserList
                users={users}
                getUsers={getUsers}
                following={following}
                setFollowing={setFollowing}
                more={more}
                loading={loading}
                page={page}
                setPage={setPage}
            ></UserList>
        </>
    )
}

export default Followers;
