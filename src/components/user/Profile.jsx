import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../assets/img/user.jpg'
import { useEffect, useState } from 'react';
import { getProfile } from '../../helpers/getProfile';
import { useParams, Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const [user, setUser] = useState({});
  const [counters, setCounters] = useState({});
  const { auth } = useAuth();
  const [iFollow, setIfollow] = useState(false);
  const params = useParams();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {
    getDatauser();
    getCounters();
    getPublications(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getDatauser();
    getCounters();
    getPublications(1, true);
    setMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);//siempre que haya un cambio en params se vuelve a cargar el componente y ejecutar los metodos

  const getDatauser = async () => {
    let datauser = await getProfile(params.userId, setUser);
    if (datauser.followInfo.following && datauser.followInfo.following._id) setIfollow(true);

  }

  const getCounters = async () => {
    const request = await fetch(Global.url + 'user/counters/' + params.userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();

    if (data.following) {
      setCounters(data)
    }

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

    if (data.status === 'success') {
      setIfollow(true);
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
      setIfollow(false);
    }
  }

  const getPublications = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(Global.url + 'publication/user/' + params.userId + '/' + nextPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    console.log('publicaciones', data);
    console.log(data.status)
    if (data.status === 'success') {
      let newPublications = data.publications;
      //si el nuervo perfil es falso y hay mas de una publicacion, añadir publica ciones al estado, 
      //caso contrari0 resetar y agregar las publicaciones nuevas de ese perfil
      if (!newProfile && data.publications.length >= 1) {
        newPublications = [...publications, ...data.publications]
      }
      if (newProfile) {
        newPublications = data.publications;
        setMore(true);
        setPage(1);
      }
      setPublications(newPublications);
      //comprobar la longitud del estado es mayor o igual a total menos la longitud del ultimo elemento del array ()
      if (!newProfile && publications.length >= (data.total - data.publications.length)) {
        setMore(false);
      }
      if(data.pages <=1){
        setMore(false)
      }
    }
  }
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
    getPublications(1, true);
    setPage(1);
    setMore(true);

  }


  return (
    <>
      <header className="aside__profile-info">

        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            <img
              src={user.image !== 'default.png' ? Global.url + 'user/avatar/' + user.image : avatar}
              className="container-avatar__img"
              alt="Foto de perfil"
            />
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>{user.name} {user.surname}</h1>
              {user._id != auth._id &&
                (iFollow ?
                  <button onClick={() => unFollow(user._id)} className="content__button content__button--right post__button">Dejar de Seguir</button>
                  :
                  <button onClick={() => follow(user._id)} className="content__button content__button--right">Seguir</button>
                )}
            </div>

            <h2 className="container-names__nickname">{user.nick}</h2>
            <p>{user.bio}</p>
          </div>

        </div>

        <div className="profile-info__stats">

          <div className="stats__following">
            <Link to={'/social/siguiendo/' + user._id} className="following__link">
              <span className="following__title">Siguiendo</span>
              <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link to={'/social/seguidores/' + user._id} className="following__link">
              <span className="following__title">Seguidores</span>
              <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link to={'/social/perfil/' + user._id} className="following__link">
              <span className="following__title">Publicaciones</span>
              <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
            </Link>
          </div>


        </div>
      </header>

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
                      <a href="#" className="user-info__create-date">{publication.created_at}</a>
                    </div>
                    <h4 className="post__content">{publication.text}</h4>
                    {
                      publication.file && <img src={Global.url+'publication/media/'+publication.file}></img>
                    }
                  </div>

                </div>
                {auth._id === publication.user._id &&
                  <div className="post__buttons">
                    <button onClick={()=>deletePublication(publication._id)} className="post__button">
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

export default Profile
