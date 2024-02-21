import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Global } from '../../../helpers/Global';
import avatar from '../../../assets/img/user.jpg'
import { SerializeFrom } from "../../../helpers/SerializeFrom";

const Config = () => {
  const [saved, setSaved] = useState('');

  const { auth, setAuth } = useAuth();

  const updateUser = async (e) => {
    e.preventDefault();
    //recoger datos del formulario
    const token = localStorage.getItem('token')
    let newDatauser = SerializeFrom(e.target);
    //borrar propiedad innecesara
    delete newDatauser.file;
    setSaved('loading');
    //guardar y actualizar datos del en el la bd
    const request = await fetch(Global.url + 'user/update', {
      method: 'PUT',
      body: JSON.stringify(newDatauser),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    //esperar el resultado y hacer peticion para convertir cualquier respuesta en un objeto de JS usable
    const data = await request.json();
    //console.log(data);

    if (data.status === 'success' && data.user) {
      //no obtener la contraseña nunca
      delete data.user.password;
      setAuth(data.user);//actualiza el estado que guarda la informacion
      setSaved('saved');
    } else {
      setSaved('error');
      //console.log(!!data.user);//doble negacion para convertir un valor a su equivalente booleano
    }

    //subida de imagenes
    const fileInput = document.querySelector('#file');
    if (data.status === 'success' && fileInput.files[0]) {
      const formData = new FormData();//crea un formulario virtual
      //recoger imagen a subir
      formData.append('file', fileInput.files[0]);
      //peticion para enviar la imagen al backend
      const upLoadRequest = await fetch(Global.url + 'user/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': token
        }
      });

      const upLoadData = await upLoadRequest.json();
      
      if (upLoadData.status === 'success' && upLoadData.user) {
        delete upLoadData.user.password;
        setAuth(upLoadData.user);
        setSaved('saved');
      } else {
        setSaved('error');
      }
    }

  }



  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Actualizar perfil</h1>
      </header>
      <div className="content__posts">
        {saved === 'saved' ?
          <strong className="alert alert-success"> Usuario actualizado correctamente !!</strong>
          : ''}

        {saved === 'error' ?
          <strong className="alert alert-danger">El usuario no se ha actualizado !!</strong>
          : ''
        }
        <br></br>
        <form id="myForm" className="config-from" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Nombres</label>
            <input type="text" name="name" defaultValue={auth.name}></input>
          </div>

          <div className="form-group">
            <label htmlFor="surname">Apellidos</label>
            <input type="text" name="surname" defaultValue={auth.surname}></input>
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nickanme</label>
            <input type="text" name="nick" readOnly defaultValue={auth.nick}></input>
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea name="bio" defaultValue={auth.bio}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" name="email" defaultValue={auth.email}></input>
          </div>

          <div className="form-group">
            <label htmlFor="password">Cotraseña</label>
            <input type="password" name="password" ></input>
          </div>

          <div className="form-group">
            <label htmlFor="file">Foto de perfil</label>
            <div className="general-info__container-avatar">
              <img
                src={auth.image !== 'default.png' ? Global.url + 'user/avatar/' + auth.image : avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            </div>
            <br></br>
            <input type="file" name="file" id='file'></input>
          </div>
          <br></br>

          <input type="submit" value='Actualizar' className="btn btn-succes"></input>
        </form>
      </div>
    </>
  )
}

export default Config;