import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import './editar_usuario.css';

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    telefono: "",
    rol: "cliente",
    region: "selecciona",
    comuna: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await fetch(`/api/usuarios/${id}`);
        const data = await response.json();
        if (data.ok) {
          setFormData(data.usuario);
        } else {
          setError("No se encontro el usuario");
        }
      } catch (err) {
        setError("Error al cargar datos del usuario");
      }
    };
    obtenerUsuario();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.ok) {
        alert("Usuario actualizado con exito");
        navigate("/usuarios");
      } else {
        setError(data.error || "Error al actualizar usuario");
      }
    } catch (err) {
      setError("Error");
    }
  };

  return (
    <div className="contenedor">
      <div className="contenedor_editarUsuario">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <h2>Editar Usuario</h2>

          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label>Apellido</label>
          <input
            type="text"
            name="apelldio"
            value={formData.apellido}
            onChange={handleChange}
            required
          />

          <label >RUT</label>
          <input
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            required
          />
   
          <label className="form-label">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />

          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          
          <label>Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>

          <div className="region-comuna">
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
          >
            <option value="selecciona">Seleccione la Región</option>
            <option value="metropolitana">Región Metropolitana</option>
            <option value="aisen">Aisén</option>
            <option value="antofagasta">Antofagasta</option>
            <option value="araucania">Araucanía</option>
            <option value="arica y parinacota">Arica y Parinacota</option>
            <option value="atacama">Atacama</option>
            <option value="biobio">Biobío</option>
            <option value="coquimbo">Coquimbo</option>
            <option value="libertador bernardo">
            Libertador General Bernardo O'Higgins
            </option>
            <option value="los lagos">Los Lagos</option>
            <option value="los rios">Los Ríos</option>
            <option value="magallanes">Magallanes</option>
            <option value="maule">Maule</option>
            <option value="ñuble">Ñuble</option>
            <option value="tarapaca">Tarapacá</option>
            <option value="valparaiso">Valparaíso</option>
          </select>

          <input
            type="text"
            name="comuna"
            value={formData.comuna}
            onChange={handleChange}
          />
        </div>

          <div className="acciones-botones">
            <button type="submit" className="btn-guardar">
              Actualizar
            </button>
            <Link to="/dashboard" className="btn-cancelar">
              Cancelar
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditarUsuario;