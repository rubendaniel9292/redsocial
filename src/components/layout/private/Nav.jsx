import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faHouse, faUser, faGear, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../../assets/img/user.jpg'
import { NavLink } from 'react-router-dom';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
const Nav = () => {
    const { auth } = useAuth();
    return (

        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to='/social' className="menu-list__link">
                        <i><FontAwesomeIcon icon={faHouse} /></i>
                        <span className="menu-list__title">Inicio</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/social' className="menu-list__link">
                        <i > <FontAwesomeIcon icon={faList} /></i>
                        <span className="menu-list__title">Timeline</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/social/people' className="menu-list__link">
                        <i ><FontAwesomeIcon icon={faUser} /></i>
                        <span className="menu-list__title">Gente</span>
                    </NavLink>
                </li>

          
            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">
                    <a href="#" className="list-end__link-image">


                        <img
                            src={auth.image !== 'default.png' ? Global.url + 'user/avatar/' + auth.image : avatar}
                            className="list-end__img"
                            alt="Foto de perfil"
                        />
                    </a>
                </li>
                <li className="list-end__item">
                    <NavLink to={"/social/perfil/" + auth._id} className="list-end__link">
                        <span className="list-end__name">{auth.nick}</span>
                        <i className="fa-solid fa-caret-down"></i>
                    </NavLink>
                </li>
                <li className="list-end__item">
                    <NavLink to='/social/config' className="list-end__link">

                        <i ><FontAwesomeIcon icon={faGear} /></i>
                        <span className="list-end__name">Ajustes</span>
                    </NavLink>
                </li>
                <li className="list-end__item">
                    <NavLink to='/social/logout' className="list-end__link">
                        <i ><FontAwesomeIcon icon={faPowerOff} /></i>
                        <span className="list-end__name">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>

        </nav>

    )
}

export default Nav
