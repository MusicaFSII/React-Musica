import './login.css';
import Logo from '../../assets/logo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setcontrasena] = useState('');
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  //verifica si hay un usuario guardado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (correo === '' || contrasena === '') {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        setUsuario(data.usuario);

        if (data.usuario.rol === 'admin') {
          navigate('/dashboard');
        } 
        else {
          navigate('/home');
        }
      } 
      else {
        setError(data.error || 'Credenciales invalidas');
      }
    } 
    catch (err) {
      setError("Error");
    }
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setCorreo('');
    setcontrasena('');
  };

  const registro = () => {
    navigate('/registro');
  };

  return (
    <main className="contenedor">
      <div className="contenedor_logo">
        <img src={Logo} alt="logo" />
        <h1>Off Beat</h1>
      </div>

    
      {usuario ? (
        /*vista del usuario cuando ya inicio sesion*/
        <div className="tarjeta_cuenta">
          <h2>Mi Cuenta</h2>

          <div className="perfil_banner">
            <div className="perfil_info">
              <span>Bienvenido/a</span>
              <h3>{(usuario.correo).toUpperCase()}</h3>
            </div>
          </div>

          {/* Si es admin, tiene un boton para ir al dashboard */}
          {usuario.rol === 'admin' && (
            <button
              type="button"
              className="btn_admin"
              onClick={() => navigate('/dashboard')}
            >
              Ir a Administración
            </button>
          )}

          <button
            type="button"
            className="btn_logout"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        /* Formulario de inicio de sesión */
        <div className="contenedor_login">
          <form onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            <label htmlFor="correo">Correo</label>
            <input
              maxLength="100"
              name="correo"
              id="correo"
              pattern=".+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)"
              placeholder="Correo Electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <label htmlFor="contrasena">Contraseña</label>
            <input
              maxLength="10"
              minLength="4"
              name="contrasena"
              id="contrasena"
              placeholder="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setcontrasena(e.target.value)}
            />
            <button type="submit">Iniciar Sesion</button>
          </form>

          <div className="caja-registro">
            {error && <p className="error">{error}</p>}
            <h4>¿Aún no tienes cuenta?</h4>
            <p>Registrate para iniciar sesion</p>
            <button type="button" onClick={registro}>Registrarse</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Login;