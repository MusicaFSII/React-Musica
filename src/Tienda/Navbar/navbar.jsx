import { Link, NavLink, Outlet } from 'react-router-dom';
import { BsCart2, BsPersonCircle } from "react-icons/bs";
import Logo from '../../assets/logo.png';
import './navbar.css';

function NavigationBar() {
  return (
    <>
      <nav className="navbar">

        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={Logo} alt="Offbeat" />
          </Link>

          <div className="navbar-links">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/producto">Productos</NavLink>
            <NavLink to="/ofertas">Ofertas</NavLink>
            <NavLink to="/nosotros">Nosotros</NavLink>
            <NavLink to="/blogs">Blog</NavLink>
            <NavLink to="/contacto">Contacto</NavLink>
          </div>
        </div>

        <div className="navbar-actions">
          <Link
            to="/login"
            className="user-button"
            aria-label="Iniciar sesión"
            title="Iniciar sesión"
          >
            <BsPersonCircle size={21}/>
          </Link>

          <Link to="/carrito" className="cart-button">
            <BsCart2 size={19}/>
            <span>Carrito</span>
          </Link>
        </div>

      </nav>
      <Outlet />  
    </>
  );
}

export default NavigationBar;