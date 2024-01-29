import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faHouse, faUser, faEnvelope, faGear, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../../assets/img/user.png'
const Nav = () => {
    return (

        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i><FontAwesomeIcon icon={faHouse} /></i>
                        <span className="menu-list__title">Inicio</span>
                    </a>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i > <FontAwesomeIcon icon={faList} /></i>
                        <span className="menu-list__title">Timeline</span>
                    </a>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i ><FontAwesomeIcon icon={faUser} /></i>
                        <span className="menu-list__title">Gente</span>
                    </a>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i><FontAwesomeIcon icon={faEnvelope} /></i>
                        <span className="menu-list__title">Mensajes</span>
                    </a>
                </li>
            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">
                    <a href="#" className="list-end__link-image">
                        <img src={avatar} className="list-end__img" alt="Imagen de perfil" />
                    </a>
                </li>
                <li className="list-end__item">
                    <a href="#" className="list-end__link">
                        <span className="list-end__name">Nickname</span>
                        <i className="fa-solid fa-caret-down"></i>
                    </a>
                </li>
                <li className="list-end__item">
                    <a href="#" className="list-end__link">

                        <i ><FontAwesomeIcon icon={faGear} /></i>
                        <span className="list-end__name">Ajustes</span>
                    </a>
                </li>
                <li className="list-end__item">
                    <a href="#" className="list-end__link">
                        <i ><FontAwesomeIcon icon={faPowerOff} /></i>
                        <span className="list-end__name">Cerrar Sesión</span>
                    </a>
                </li>
            </ul>

        </nav>

    )
}

export default Nav
