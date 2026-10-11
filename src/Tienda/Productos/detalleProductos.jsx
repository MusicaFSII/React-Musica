import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CarritoContext } from '../Carrito/Carrito';
import Accordion from 'react-bootstrap/Accordion';
import './productos.css';

export default function DetalleProductos() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { agregarProducto } = useContext(CarritoContext);

  useEffect(() => {
    const endpoint = codigo ? `/api/productos/${codigo}` : '/api/productos';

    fetch(endpoint)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Error en la petición a la API');
        }
        return respuesta.json();
      })
      .then((data) => {
        if (data.ok) {
          if (data.producto) {
            setProducto(data.producto);
          } else if (data.productos && data.productos.length > 0) {
            setProducto(data.productos[0]);
          }
        } else {
          setError('No se pudo encontrar el producto');
        }
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [codigo]);

  if (cargando) return <div className="text-center p-5">Cargando producto...</div>;
  if (error || !producto) return <div className="text-center p-5">{error || 'Producto no encontrado.'}</div>;

  const porcentajeIVA = 0.19;
  const montoIVA = producto.precio * porcentajeIVA;
  const precioNeto = producto.precio - montoIVA;
  const precioTotal = producto.precio;

  const formatearPrecio = (valor) => {
    return valor ? new Intl.NumberFormat('es-CL').format(valor) : '0';
  };

  const agregarClick = () => {
    agregarProducto({
      id: producto.id_producto || producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio || 0,
      imagen: producto.imagen_url || 'https://via.placeholder.com/300?text=Sin+Imagen'
    });
  };

  return (
    <main className="container">
      <div className="container-presentacion">
        <div className="card-productos">
          <h1>{producto.nombre}</h1>
          <img src={producto.imagen_url} className="card-productos-img" alt={producto.nombre || "producto-detalle"} />
        </div>

          <div className="card-precios-detalles">
            <p>
              Precio neto: $<span id="precioProducto">{formatearPrecio(precioNeto)}</span>
            </p>
            <p>
              IVA (19%): $<span id="precioIVA">{formatearPrecio(montoIVA)}</span>
            </p>
            <p className='precio-total'>
              Precio TOTAL: $<span id="precioTotal">{formatearPrecio(precioTotal)}</span>
            </p>

            <button type="button" className="btn btn-info btn-carrito button-agregar" onClick={agregarClick}>
              Agregar al carrito
            </button>
          </div>
      </div> 

      <Accordion className="acordeon-descripcion">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Descripción</Accordion.Header>
        <Accordion.Body>
          {producto.descripcion}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </main>
  );
}