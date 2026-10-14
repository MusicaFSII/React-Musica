import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './productos.css';

export default function CatalogoProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        const data = await res.json();
  
        setProductos(data.productos || []);
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  if (cargando) {
    return <div className="text-center p-5">Cargando catálogo...</div>;
  }

  return (
    <div className="container my-4">
      <div className="cartel mb-4 text-center">
        <h2>Catálogo de Productos</h2>
      </div>

      <div className="row">
        {productos.map((prod) => (
          <div key={prod.id_producto || prod.codigo} className="col-12 col-sm-6 col-lg-3 mb-4">
            <Link to={`/producto/${prod.codigo}`} className="card-link text-decoration-none">
              <div className="card h-100 text-center p-3 shadow-sm">
                <div className="img-box mb-2 d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
                  <img src={prod.imagen_url} className="img-fluid" alt={prod.nombre} style={{ maxHeight: '100%', objectFit: 'contain' }}/>
                </div>
                <div className="justify-content-between">
                  <h6>{prod.nombre}</h6>
                  <div>
                    <span>Stock: {prod.stock}</span>
                    
                    <div>
                      {prod.en_oferta === 1 && prod.porc_oferta > 0 ? (
                        <>
                          <span className="text-white text-decoration-line-through small d-block">
                            ${prod.precio ? prod.precio.toLocaleString('es-CL') : 0}
                          </span>
                          <span className="fw-bold text-danger">
                            ${prod.precio_final ? prod.precio_final.toLocaleString('es-CL') : 0}
                          </span>
                        </>
                      ) : (
                        <span className="fw-bold text-primary">
                          ${prod.precio ? prod.precio.toLocaleString('es-CL') : 0}
                        </span>
                      )}
                    </div>
                    
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}