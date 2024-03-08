import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Global } from '../../helpers/Global';
import avatar from '../../assets/img/user.jpg'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';
import  alerts from "../../helpers/Alerts";

const PublicationList = ({
    publications,
    getPublications,
    page,
    setPage,
    more,
    setMore }) => {
    const { auth } = useAuth();
    const nextPage = async () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    }
    const deletePublication = async (publicationId) => {
        const request = await fetch(Global.url + 'publication/remove/' + publicationId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await request.json();
        if (data.status === 'success') {
            getPublications(1, true);
            setPage(1);
            setMore(true);
            alerts('Eliminación exitosa', 'Publicación eliminada exitosamente', 'success');

        }else alerts('Error', 'Ocurrió un error al intentar eliminar la publicación', 'error');
    }

    return (
        <>

            <div className='content__posts'>
                {
                    publications.map(publication => {
                        return (
                            <article className="posts__post" key={publication._id}>

                                <div className="post__container">

                                    <div className="post__image-user">
                                        <Link to={"/social/perfil/" + publication.user._id} className="post__image-link">
                                            <img
                                                src={publication.user.image !== 'default.png' ? Global.url + 'user/avatar/' + publication.user.image : avatar}
                                                className="post__user-image"
                                                alt="Foto de perfil"
                                            />
                                        </Link>
                                    </div>

                                    <div className="post__body">
                                        <div className="post__user-info">
                                            <a href="#" className="user-info__name">{publication.user.name} {publication.user.surname}</a>
                                            <span className="user-info__divider"> | </span>
                                            <a href="#" className="user-info__create-date"><ReactTimeAgo date={publication.created_at} locale='es-ES'></ReactTimeAgo></a>
                                        </div>
                                        <h4 className="post__content">{publication.text}</h4>
                                        {
                                            publication.file && <img src={Global.url + 'publication/media/' + publication.file}></img>
                                        }
                                    </div>

                                </div>
                                {auth._id === publication.user._id &&
                                    <div className="post__buttons">
                                        <button onClick={() => deletePublication(publication._id)} className="post__button">
                                            <i ><FontAwesomeIcon icon={faTrash} /></i>
                                        </button>
                                    </div>
                                }


                            </article>

                        )
                    })
                }

            </div>
            <div className="content__container-btn">
                {more && publications.length >= 5 &&
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver mas publicaciones
                    </button>
                }

            </div>
        </>
    )
}
//especificando las props de acuerdo a su tipo: array o funcion
PublicationList.propTypes = {
    publications: PropTypes.array.isRequired,
    getPublications: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    more: PropTypes.bool.isRequired,
    setMore: PropTypes.func.isRequired
};
export default PublicationList;

