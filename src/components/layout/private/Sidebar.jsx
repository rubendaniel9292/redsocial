
import avatar from '../../../assets/img/user.jpg'
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import UserFrom from '../../../hooks/UserFrom'
import { useState } from 'react';
const Sidebar = () => {
    /*acceder al valor del contexto: no accede y no se carga el componente */
    const { auth, counters } = useAuth();
    const { form, changed } = UserFrom({});
    const [stored, setStored] = useState("not_stored");
    // Verificar si auth es undefined antes de acceder a sus propiedades
    if (!auth) {
        // Manejar el caso donde auth es undefined, por ejemplo, mostrando un mensaje de error o tomando una acción predeterminada.
        console.error('auth no esta definido!!!...');
        return null; // O realiza alguna acción adecuada para tu aplicación
    }



    const savePublication = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        // Recoger datos del formulario
        let newPublication = form;
        newPublication.user = auth._id;

        // Hacer request para guardar en bd
        const request = await fetch(Global.url + "publication/save", {
            method: "POST",
            body: JSON.stringify(newPublication),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();
        console.log(data)

        // Mostrar mensaje de exito o error
        if (data.status === "success") {
            setStored("stored");
        } else {
            setStored("error");
        }

        // Subir imagen
        const fileInput = document.querySelector("#file");

        if (data.status == "success" && fileInput.files[0]) {

            const formData = new FormData();
            formData.append("file", fileInput.files[0]);

            const uploadRequest = await fetch(Global.url + "publication/upload/" + data.newPublicacion._id, {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": token
                }
            });

            const uploadData = await uploadRequest.json();

            if (uploadData.status == "success") {
                setStored("stored");
            } else {
                setStored("error");
            }
        }

        //if (data.status = "success" && uploadData.status == "success"){
        const myForm = document.querySelector("#publication-form");
        myForm.reset();
        //}
    }

    return (
        <>

            <aside className="layout__aside">

                <header className="aside__header">
                    <h1 className="aside__title">Hola {auth.nick}</h1>
                </header>
                <div className="aside__container">
                    <div className="aside__profile-info">
                        <div className="profile-info__general-info">
                            <div className="general-info__container-avatar">
                                <img
                                    src={auth.image !== 'default.png' ? Global.url + 'user/avatar/' + auth.image : avatar}
                                    className="container-avatar__img"
                                    alt="Foto de perfil"
                                />
                            </div>

                            <div className="general-info__container-names">
                                <a href="#" className="container-names__name">{auth.name} {auth.surname}</a>
                                <p className="container-names__nickname">{auth.nick}</p>
                            </div>
                        </div>

                        <div className="profile-info__stats">

                            <div className="stats__following">
                                <Link to={'/social/siguiendo/' + auth._id} className="following__link">
                                    <span className="following__title">Siguiendo</span>
                                    <span className="following__number">{counters.following}</span>
                                </Link>
                            </div>
                            <div className="stats__following">
                                <Link to={'/social/seguidores/' + auth._id} className="following__link">
                                    <span className="following__title">Seguidores</span>
                                    <span className="following__number">{counters.followed}</span>
                                </Link>
                            </div>


                            <div className="stats__following">
                                <Link to={"/social/perfil/" + auth._id} className="following__link">
                                    <span className="following__title">Publicaciones</span>
                                    <span className="following__number">{counters.publications}</span>
                                </Link>
                            </div>


                        </div>
                    </div>


                    <div className="aside__container-form">
                        {stored == "stored" ?
                            <strong className="alert alert-success"> Publicada correctamente !!</strong>
                            : ''}

                        {stored == "error" ?
                            <strong className="alert alert-danger"> No se ha publicado nada !!</strong>
                            : ''}

                        <form id='publication-form' className="container-form__form-post" onSubmit={savePublication}>

                            <div className="form-post__inputs">
                                <label htmlFor="text" className="form-post__label">¿Que estas pesando hoy?</label>
                                <textarea name="text" className="form-post__textarea" onChange={changed}></textarea>
                            </div>

                            <div className="form-post__inputs">
                                <label htmlFor="image" className="form-post__label">Sube tu foto</label>
                                <input id='file'type="file" name="file" className="form-post__image" />
                            </div>

                            <input type="submit" value="Enviar" className="form-post__btn-submit" />

                        </form>

                    </div>

                </div>

            </aside>
        </>

    )
}

export default Sidebar
