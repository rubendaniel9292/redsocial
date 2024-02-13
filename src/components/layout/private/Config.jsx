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
        'Authorization': localStorage.getItem('token')
      }
    });
    //esperar el resultado y hacer peticion para convertir cualquier respuesta en un objeto de JS usable
    const data = await request.json();
    console.log(data);

    if (data.status == 'success' && data.user) {
      console.log('console en el if');
      //no obtener la contraseña nunca
      delete data.user.password;
      setAuth(data.user);//actualiza el estado que guarda la informacion
      console.log('datos despues del IF:', data);
      console.log('datos despues del auth IF:', auth);
      setSaved('saved');
    } else {
      console.log('no se cumple la condicion del if');
      setSaved('error');
      console.log(data.status === 'success');
      console.log(!!data.user);//doble negacion para convertir un valor a su equivalente booleano
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

        {console.log('resultado del saved: ', saved)}
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
            <input type="text" name="nick" defaultValue={auth.nick}></input>
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