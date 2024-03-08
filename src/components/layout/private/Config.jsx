//import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Global } from '../../../helpers/Global';
import avatar from '../../../assets/img/user.jpg'
import { SerializeFrom } from "../../../helpers/SerializeFrom";
import alerts from "../../../helpers/Alerts";

const Config = () => {
  //const [saved, setSaved] = useState('');
  const { auth, setAuth } = useAuth();
  const updateUser = async (e) => {
    e.preventDefault();
    //recoger datos del formulario
    const token = localStorage.getItem('token')
    let newDatauser = SerializeFrom(e.target);

    // Verificar si se han realizado cambios en los datos del usuario
    let dataChanged = false;
    if (
      newDatauser.name !== auth.name ||
      newDatauser.surname !== auth.surname ||
      newDatauser.bio !== auth.bio ||
      newDatauser.email !== auth.email
    ) {
      dataChanged = true;
    }

    // Si no hay cambios en los datos del usuario, no enviar la solicitud de actualización
    if (!dataChanged) {
      alerts('Advertencia: ', 'Ingrese informacion nueva en al menos uno de los campos del formulario', 'warning');
      //setSaved('warning1');
      return;
    }
    //borrar propiedad innecesara
    delete newDatauser.file;
    //setSaved('loading');
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
      alerts('Actualización exitosa', 'Usuario actualizado correctamente !!', 'success');
      //setSaved('saved');
    } else if (data.status === 'warning') {
      //setSaved('warning');
      alerts('Advertencia', 'Correo ya esta siendo utilizado por otro usuario!!. Utilice otro', 'warning');
    } else {
      //setSaved('error');
      //console.log(!!data.user);//doble negacion para convertir un valor a su equivalente booleano
      alerts('Error durante la actualización', 'El usuario no se ha actualizado !!', 'error');
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
        //setSaved('saved');
        alerts('Actualización exitosa', 'Usuario actualizado correctamente !!', 'success');
        //setSaved('saved');

      } else if (data.status === 'warning') {
        //setSaved('warning');
        alerts('Advertencia', 'El usuario no se ha actualizado !!', 'warning');
      } else {
        //setSaved('error');
        alerts('Error durante la actualización', 'El usuario no se ha actualizado !!', 'error');
      }
    }
  }

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Actualizar perfil</h1>
      </header>
      <div className="content__posts">
        {
          /* 
                {saved === 'saved' ?
          <strong className="alert alert-success"> Usuario actualizado correctamente !!</strong>
          : ''}

        {saved === 'error' ?
          <strong className="alert alert-danger">El usuario no se ha actualizado !!</strong>
          : ''
        }
        {saved === 'warning' ?
          <strong className="alert alert-danger">Correo ya esta siendo utilizado por otro usuario o está repetido!!. Utilice otro</strong>
          : ''
        }
        {saved === 'warning1' ?
          <strong className="alert alert-danger">Ingrese informacion nueva en al menos uno de los campos del formulario</strong>
          : ''
        }
          */
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