import { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import PublicationList from '../publication/PublicationList';

const Feed = () => {
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    useEffect(() => {
        getPublications(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getPublications = async (nextPage = 1, showNews = true) => {
        if (showNews) {
            setPublications([]);
            setPage(1);
            nextPage = 1;
        }
        const request = await fetch(Global.url + 'publication/feedpost/' + nextPage, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await request.json();

        if (data.status === 'success') {
            let newPublications = data.publications;
            //si el nuervo perfil es falso y hay mas de una publicacion, añadir publica ciones al estado, 
            //caso contrario resetar y agregar las publicaciones nuevas de ese perfil
            if (!showNews && data.publications.length >= 1) {
                newPublications = [...publications, ...data.publications]
            }
            setPublications(newPublications);
            //comprobar la longitud del estado es mayor o igual a total menos la longitud del ultimo elemento del array ()
            if (!showNews && publications.length >= (data.total - data.publications.length)) {
                setMore(false);
            }
            if (data.pages <= 1) {
                setMore(false)
            }
        }
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
            </header>
            <PublicationList
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            >
            </PublicationList>
          
        </>
    )
}

export default Feed