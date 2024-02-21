import PropTypes from 'prop-types';
import avatar from '../../assets/img/user.jpg'
import { Global } from "../../helpers/Global";
import useAuth from '../../hooks/useAuth';
//recibe las props
const UserList = ({ users, getUsers, following, setFollowing, more, loading, page, setPage }) => {

    const { auth } = useAuth()
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
            //array nuevo con usuarios que no sean  el que acabo de dejar de seguir
            let filterFollowing = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowing);
        }
    }
    return (
        <>
            <div className='content__post'>
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

            </div>
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

//especificando las props de acuerdo a su tipo: array o funcion
UserList.propTypes = {
    setFollowing: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    getUsers: PropTypes.func.isRequired,
    following: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    more: PropTypes.bool.isRequired,
    setPage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};
export default UserList;
