import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

const Nav = () => {
    return (

        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i><FontAwesomeIcon icon={faUser} /></i>
                        <span className="menu-list__title">Login</span>
                    </a>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i > <FontAwesomeIcon icon={faUsers} /></i>
                        <span className="menu-list__title">Registro</span>
                    </a>
                </li>


            </ul>


        </nav>

    )
}

export default Nav
