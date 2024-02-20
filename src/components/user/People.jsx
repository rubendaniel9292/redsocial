import { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.jpg'
import { Global } from "../../helpers/Global";
import useAuth from '../../hooks/useAuth';

const People = () => {
    const { auth } = useAuth()
    const [users, setUser] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers(page);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);//sin dependencia para cargar todos los usarios en un solo listado en al misma pagina, 
    //con dependecia [page] si deseo cargar solo los usuarios de una determinada pagina
    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        //peticion para sacar usuarios
        const request = await fetch(Global.url + 'user/list/' + nextPage, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await request.json();

        //estado para poder listarlos
        if (data.user && data.status === 'success') {
            //let newUser = data.user;
            let newUser = (nextPage === 1) ? data.user : [...users, ...data.user];
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
            setUser(newUser);
            setFollowing(data.user_following);
            //console.log('listado de seguimiento: ', following);//es decir si lo estoy siguiendo
            setLoading(false);
        }
        //paginacion
        /*compara si el numero de usuarios en el estado es mayor o igual al total de usuarios de la bd oculta el boton*/
        if (users.length >= data.total) {
            setMore(false);//setea el estado del boton para que no se muestre o mostrart boton
        }
    }
    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);//para evitar el retraso de 1
        //console.log('listado de seguimiento 2: ', following);//es decir si lo estoy siguiendo

    }
    const follow = async (userId) => {
        //peticion al backend
        const request = await fetch(Global.url + 'follow/save', {
            method: 'POST',
            body: JSON.stringify({ followed: userId }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await request.json();
        //cuando sea exitosa, actualziar el estado de following agregando el nuevo follow
        if (data.status === 'success') {
            setFollowing([...following, userId]);
        }

    }
    const unFollow = async (userId) => {
        //peticion al backend
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await request.json();

        //cuando sea exitosa, actualziar el estado de following filtando los datos para elimianr el antiguo user id que acabi de dejar de segrui
        if (data.status === 'success') {
            //array nuevo con usuariios que no sean  el que acabo de dejar de seguir
            let filterFollowing = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowing);
        }
    }
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Gente</h1>
            </header>
            {
                users.map(user => {
                    return (
                        <article className="posts__post" key={user._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <a href="#" className="post__image-link">
                                        <img
                                            src={user.image !== 'default.png' ? Global.url + 'user/avatar/' + user.image : avatar}
                                            className="post__user-image"
                                            alt="Foto de perfil"
                                        />
                                    </a>
                                </div>

                                <div className="post__body">
                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{user.created_at}</a>
                                    </div>
                                    <h4 className="post__content">{user.bio}</h4>
                                </div>
                            </div>
                            {/*mostrar cuando el usuario no sea el identificado*/}
                            {user._id !== auth._id &&
                                <div className="post__buttons">
                                    {
                                        !following.includes(user._id) &&
                                        <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                                            Seguir
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    }

                                    {following.includes(user._id) &&
                                        <button className="post__button" onClick={() => unFollow(user._id)}>
                                            Dejar de Seguir
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    }
                                </div>
                            }


                        </article >
                    )
                })
            }
            {loading ? <strong>Cargando.....</strong> : ''}
            {
                more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver más personas
                    </button>

                </div>

            }
        </>
    )
}

export default People;
