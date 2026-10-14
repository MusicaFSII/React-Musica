import { useState, useEffect } from "react";
import { Link, useNavigate, useParams} from "react-router-dom";  
import './cambiar_psswd.css';

function CambiarPsswd() {
  const {id} = useParams();
  const [passData, setPassData] = useState({ actual: '', nueva: '', confirmacion: '' });
  const [mensaje, setMensaje] = useState(''); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPassData({
      ...passData,
      [e.target.name]: e.target.value
    });
  };

  const handleCambiarClave = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (passData.nueva !== passData.confirmacion) {
      setMensaje('La confimacion no coincide con la nueva contraseña');
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${id}/cambiar-clave`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contrasenaActual: passData.actual,
          contrasenaNueva: passData.nueva
        })
      });

      const data = await response.json();

      if (data.ok) {
        setMensaje('Contraseña actualizada correctamente');
        setTimeout(() => {
          navigate('/perfil');
        }, 1500);
      } else {
        setMensaje(data.error || 'Error al actualizar');
      }
    } catch (err) {
      setMensaje('Error');
    }
  };

  return (
    <div className="contenedor">
        <div className="contenedor_cambioPsswd">
            <form onSubmit={handleCambiarClave}>
                <h2>Cambio de Contraseña</h2>
                 
                {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
                  
                <label htmlFor="actual">Constraseña Actual</label>
                <input
                  id="actual"
                  type="password"
                  name="actual"
                  maxLength="10"
                  minLength="4"
                  placeholder="Contraseña Actual"
                  required
                  value={passData.actual}
                  onChange={handleChange}
                />

                <label htmlFor="nueva">Nueva Constraseña</label>
                <input
                  id="nueva"
                  type="password"
                  name="nueva"
                  maxLength="10"
                  minLength="4"
                  placeholder="Nueva Contraseña"
                  required
                  value={passData.nueva}
                  onChange={handleChange}
                />
                <label htmlFor="confirmacion">Confirmacion Nueva Contraseña</label>
                <input
                  id="confirmacion"
                  type="password"
                  name="confirmacion"
                  maxLength="10"
                  minLength="4"
                  placeholder="Confirmacion Nueva Contraseña"
                  required
                  value={passData.confirmacion}
                  onChange={handleChange}
                />

               <div className="acciones-botones">
                <button type="submit" className="btn-guardar">
                  Actualizar
                </button>
                <Link to="/perfil" className="btn-cancelar">
                  Cancelar
                </Link>
              </div>
            </form>
        </div>
    </div>
  );
}

export default CambiarPsswd;