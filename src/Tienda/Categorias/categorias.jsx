import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function CategoriasTienda() {
  const {id} = useParams();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = id ? `/api/productos/categorias/${id}` : '/api/productos';

    fetch(endpoint)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Error en la petición a la API');
        }
        return respuesta.json();
      })
      .then((data) => {
        if (data.ok) {
            setProductos(data.productos || []);
          } else {
            setError(data.mensaje || 'No se encontrar productos de esta categoría');
          }
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <div className="text-center p-5">Cargando productos...</div>;
  }
  if (error){
    return <div className="text-center p-5">{error || 'No hay productos en esta categoría'}</div>;
  } 
  if (productos.length === 0){
    return(
      <div className="text-center p-5">
        <p>No hay productos disponibles en esta categoría.</p>
      </div>
    )
  }

  const formatoPrecio = (precio) =>
    precio.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    });

  return (
  <main className="container my-5">
    <div className="d-flex align-items-center mb-4">
      <h1 className="h2 m-0">
        {'Categoría'} <span></span>
      </h1>
    </div>

    <div className="row g-4">
      {productos.map((prod) => {
        const idUnico = prod.id_producto || prod.codigo;

        return (
          <div className="col-12 col-md-4" key={idUnico}>
            <article className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body p-0">
                  <Link to={`/producto/${prod.codigo}`} className="card-link text-decoration-none">
                    <div className="position-relative overflow-hidden mb-3" style={{ background: '#f5f5f5', borderRadius: '4px' }}>
                      <img src={prod.imagen_url} alt={`Portada de ${prod.nombre}`} className="img-fluid w-100" loading="lazy"/>
                    </div>
                    <h3 className="h5 card-title mb-1">{prod.nombre}</h3>
                    <p className="card-text text-bright small mb-2">{prod.descripcion}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <strong className="text-bright">{formatoPrecio(prod.precio)}</strong>
                    </div>
                  </Link>
                </div>
            </article>
          </div>
        );
      })}
    </div>
  </main>
);
}