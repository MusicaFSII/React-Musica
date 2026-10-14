import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CarritoContext } from './Carrito'; 
import './carrito.css'

export default function CarritoPage() {

  const { carrito, eliminarProducto, totalProductos, costoTotal, limpiarCarrito } = useContext(CarritoContext);

  return (
    <div className="container my-5" style={{ minHeight: '60vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Carrito de Compras</h2>
        {carrito.length > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={limpiarCarrito}>
            Vaciar Carrito
          </button>
        )}
      </div>

      {carrito.length === 0 ? (
        <div className="cuadro-carrito-vacio">
          <h4 >Tu carrito está vacío</h4>
          <Link to="/producto" className="boton-carrito-vacio btn btn-primary px-4">
            Ir al Catálogo
          </Link>
        </div>
      ) : (

        <div className="row">
          <div className="col-12 col-lg-8 mb-4">
            <div className="card shadow-sm p-3">
              <div className="table-responsive">
                <table className="table align-middle m-0">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img 
                            src={item.imagen} 
                            alt={item.nombre} 
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                          />
                        </td>
                        <td className="fw-semibold text-dark">{item.nombre}</td>
                        <td className="text-center">
                          <span className="badge bg-secondary fs-6 px-3">{item.cantidad}</span>
                        </td>
                        <td>${item.precio.toLocaleString('es-CL')}</td>
                        <td className="fw-bold text-primary">
                          ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={() => eliminarProducto(item.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card p-4 bg-light">
              <h4 className="resumen-texto">Resumen</h4>
              <div className="resumen-texto d-flex justify-content-between mb-2">
                <span>Total artículos:</span>
                <span className="fw-semibold">{totalProductos}</span>
              </div>
              <hr />
              <div className="resumen-texto d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold">Total a pagar:</span>
                <span className="fs-4 fw-bold text-success">
                  ${costoTotal.toLocaleString('es-CL')}
                </span>
              </div>
              
              <Link to="/compras" className="btn btn-success w-100 btn-lg py-2fw-bold">
                Proceder al Pago
              </Link>
              <Link to="/producto" className="btn btn-link w-100 text-center text-decoration-none mt-2 text-muted small">
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
