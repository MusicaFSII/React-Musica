import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import './navbarAdmin.css';

function NavbarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="admin-layout container-fluid flex-grow-1 p-0">
      <div className="row m-0 min-vh-100">

        {/* Menú lateral*/}
        <div className="col-12 col-md-3 col-xl-2 admin-sidebar p-0">
          <Navbar className="sidebar-header border-bottom">
            <Container fluid className="px-3">
              <Navbar.Brand as={Link} to="/dashboard" className="sidebar-logo">
                <img src={Logo} alt="Offbeat" />
              </Navbar.Brand>
            </Container>
          </Navbar>

          <Nav className="flex-column sidebar-nav p-3">
            <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/ordenes" active={location.pathname === '/ordenes'}>Ordenes</Nav.Link>
            <Nav.Link as={Link} to="/usuarios" active={location.pathname === '/usuarios'}>Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/productosA" active={location.pathname === '/productosA'}>Productos</Nav.Link>
            <Nav.Link as={Link} to="/categoriaA" active={location.pathname === '/categoriaA'}>Categorias</Nav.Link>
            <Nav.Link as={Link} to="/reportes" active={location.pathname === '/reportes'}>Reportes</Nav.Link>
            <Nav.Link as={Link} to="/admin/blogs" active={location.pathname === '/admin/blogs'}>Blogs</Nav.Link>
            <Nav.Link as={Link} to="/perfil" active={location.pathname === '/perfil'}>Perfil</Nav.Link>
            
            <hr className="sidebar-divider" />

            <Button 
              as={Link} 
              to="/home" 
              className="btn-store w-100 mb-2">
              Tienda
            </Button>

            <Button 
              onClick={logout} 
              className="btn-logout w-100">
              Cerrar Sesión
            </Button>
          </Nav>
        </div>

        <div className="col-12 col-md-9 col-xl-10 p-0 m-0 admin-main">
          {/*navbar superior */}
          <Navbar className="admin-topbar">
            <Container fluid className="px-4">
              <Nav className="ms-auto align-items-center">
                <Nav.Item>
                  <h3 className="brand-title mb-0">Off Beat</h3>
                </Nav.Item>
              </Nav>
            </Container>
          </Navbar>

          {/*contenido de la pagina */}
          <div className="p-4 admin-content">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}

export default NavbarAdmin;