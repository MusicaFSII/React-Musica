import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import './historialCompra.css'

function HistorialCompra() {
  const { id } = useParams();
  const [compras, setCompras] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const responseUsuario = await fetch(`/api/usuarios/${id}`);
        const dataUsuario = await responseUsuario.json();

        if (dataUsuario.ok) {
          setUsuario(dataUsuario.usuario);
        } else {
          setUsuario(dataUsuario.usuario || dataUsuario);
        }

        const responseCompras = await fetch(`/api/compras/usuario/${id}`);
        const dataCompras = await responseCompras.json();

        if (dataCompras.ok) {
          setCompras(dataCompras.compras);
        } else {
          setError("No se pudieron obtener las compras del usuario.");
        }
      } catch (err) {
        console.error("Error al cargar la informacion:", err);
        setError("Error de conexión al obtener los datos.");
      }
    };

    if (id) {
      obtenerDatos();
    }
  }, [id]);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="titulo">
          Historial de Compras
          {usuario?.nombre ? ` - ${usuario.nombre}` : ""}
        </h2>
        <Link to="/usuarios" className="btn boton_volver">
          Volver a Usuarios
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && compras.length === 0 ? (
        <div className="alert alert-info text-center">
          El usuario no ha realizado compras.
        </div>
      ) : (
        <Table responsive className="table table-bordered">
          <thead className="text-center tabla_historial">
            <tr>
              <th>ID Compra</th>
              <th>Fecha</th>
              <th>Cantidad de Productos</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => {
              const cantidadProductos = compra.items
                ? compra.items.reduce((acc, item) => acc + (item.cantidad || 1), 0)
                : 1;

              return (
                <tr key={compra.id} className="align-middle">
                  <td className="text-center fw-bold">#{compra.id}</td>
                  <td className="text-center">
                    {new Date(compra.fecha).toLocaleDateString("es-CL")}
                  </td>
                  <td className="text-center fw-semibold">
                    {cantidadProductos} {cantidadProductos === 1 ? "producto" : "productos"}
                  </td>
                  <td className="text-center">
                    <Badge bg="success">Completado</Badge>
                  </td>
                  <td className="text-end fw-bold">
                    ${Number(compra.total).toLocaleString("es-CL")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default HistorialCompra;