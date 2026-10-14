import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './usuarios.css'

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const cargarUsuarios = async () => {
    try{
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      if(data.ok){
        setUsuarios(data.usuarios);
      }
      else{
        console.error("error al obtener los usuarios");
      }
    }
    catch(error){
      console.error("error en la peticion");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  },[]);

  const eliminarUsuario = async (id) => {
    if(!usuarioAEliminar) return;

    try {
      const response = await fetch(`/api/usuarios/${usuarioAEliminar.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.ok) {
        setUsuarios(usuarios.filter((u) => u.id !== usuarioAEliminar.id));
        setUsuarioAEliminar(null);
      } else {
        alert(data.error || "Error a eliminar al usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="container text-center">
      <h1 className="titulo">Tabla de Usuarios</h1>

      <table className="table table-bordered">
        <thead className="text-center tabla_usuarios ">
          <tr>
            <th scope="col">Run</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido</th>
            <th scope="col">Correo</th>
            <th scope="col">Telefono</th>
            <th scope="col">Region</th>
            <th scope="col">Comuna</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.rut}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.correo}</td>
              <td>{u.telefono}</td>
              <td>{u.region}</td>
              <td>{u.comuna}</td>
              <td>{u.rol}</td>
              <td>
                
                {/*botones */}
                <div className="d-grid gap-3 d-md-block">
                  <Link
                    className="btn btn_historial btn-sm me-2"
                    to={`/historialCompra/${u.id}`}>
                    Historial
                  </Link>
                  <Link
                    className="btn btn_editar btn-sm me-2"
                    to={`/editarUsuario/${u.id}`}>
                    Editar
                  </Link>
                  <Button
                    className="btn_eliminar"
                    size="sm"
                    onClick={() => setUsuarioAEliminar(u)}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Link className="btn btn_registrar mt-3" to="/registro">
        Registrar Usuario
      </Link>

      {/*modal eliminar usuario*/}
      <Modal 
        show={usuarioAEliminar !== null} 
        onHide={() => setUsuarioAEliminar(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-start">
          <p>
            El usuario sera eliminado permanentemente:{" "}
            <strong>{usuarioAEliminar?.nombre_completo}</strong>
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn_eliminar" onClick={() => setUsuarioAEliminar(null)}>
            Cancelar
          </Button>
          <Button className="btn_editar" onClick={eliminarUsuario}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Usuarios;