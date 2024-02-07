import UserFrom from "../../hooks/UserFrom";
import { useState } from "react";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
const Login = () => {
  const { form, changed } = UserFrom({});
  const [loged, setLoged] = useState('not_loged');
  const { setAuth } = useAuth();
  const loginUser = async (e) => {
    //prevenir atualziacion de pantalla
    e.preventDefault();
    //regoger datos del formulario
    let userToLogin = form;
    //peticion a la api 
    const request = await fetch(Global.url + 'user/login', {
      method: 'POST',
      body: JSON.stringify(userToLogin),//convertir a JSON string
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await request.json();
    //persistir los datos en el navegador 
    if (data.status === 'success') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.userRecord));
      setLoged('login');
      //redireccion 

      setTimeout(() => {
        //setear datos en el para que redireciones y no entrar manualamente a /social
        setAuth(data.userRecord);
        window.location.reload();//realiza el navigate a public o private layout de manera automatica
      }, 500);

    } else {
      setLoged('error')
    }

  }
  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>
      <strong className="alert alert-success">{loged == 'login' ? 'Usuario logeado correctamente.' : ''}</strong>
      <strong className="alert alert-danger">{loged == 'error' ? 'Usuario no logeado.' : ''}</strong>

      <div className="content__posts">
        <form className="form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="name" name="email" onChange={changed}></input>
          </div>

          <div className="form-group">
            <label htmlFor="password">Cotraseña</label>
            <input type="password" name="password" onChange={changed}></input>
          </div>

          <input type="submit" value='Iniciar sesión' className="btn btn-succes"></input>

        </form>


      </div>
    </>
  )
}

export default Login
