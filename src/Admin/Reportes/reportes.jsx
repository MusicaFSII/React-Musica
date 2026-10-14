import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsExclamationTriangle, BsBoxSeam, BsCheckCircle, BsXCircle } from "react-icons/bs";
import './reporte.css';

function Reportes() {
  const [productosCriticos, setProductosCriticos] = useState([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [productosEnStock, setProductosEnStock] = useState(0);
  const [productosAgotados, setProductosAgotados] = useState(0);

  useEffect(() => {
    cargarDatosReporte();
  }, []);

  const cargarDatosReporte = async () => {
    try {
      const res = await fetch('/api/productos');
      const data = await res.json();
      
      if (data.ok && data.productos) {
        const productos = data.productos;
        setTotalProductos(productos.length);
        const enStock = productos.filter(p => p.stock > 0).length;
        setProductosEnStock(enStock);
        const agotados = productos.filter(p => p.stock === 0).length;
        setProductosAgotados(agotados);
        const criticos = productos.filter(p => p.stock <= 6);
        setProductosCriticos(criticos);
      }
    } catch (error) {
      console.error("Error al cargar datos de productos:", error);
      setProductosCriticos([]);
    }
  };

  return (
    <main className="container my-4">
      <div className="wireframe-box p-4 mb-5 tabla_historial rounded shadow-sm">
        <h2 className="titulo mb-4">Reportes de Inventario</h2>

        {/*tarjeta productos*/}
        <Row xs={1} md={3} className="g-4 mb-4">
          <Col>
            <Card className="h-100 text-center p-3 shadow-sm total_productos">
              <Card.Body>
                <Card.Title className="titulo_metrica">
                  <BsBoxSeam size={30} className="mb-2" /> Total Productos
                </Card.Title>
                <h2 className="text_metricas">{totalProductos}</h2>
                <Card.Text className="text_metricas">
                  Variedad de discos registrados.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="h-100 text-center p-3 shadow-sm en_stock">
              <Card.Body>
                <Card.Title className="titulo_metrica">
                  <BsCheckCircle size={30} className="mb-2" /> Productos en Stock
                </Card.Title>
                <h2 className="text_metricas">{productosEnStock}</h2>
                <Card.Text className="text_metricas">
                  Disponibles para la venta.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="h-100 text-center p-3 shadow-sm sin_stock">
              <Card.Body>
                <Card.Title className="titulo_metrica">
                  <BsXCircle size={30} className="mb-2" /> Productos Agotados
                </Card.Title>
                <h2 className="text_metricas">{productosAgotados}</h2>
                <Card.Text className="text_metricas">
                  Sin stock disponible actualmente.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Productos Críticos */}
        <Card className="mb-4 tabla_historial border border-danger">
          <Card.Header className="bg-danger text-white d-flex align-items-center">
            <BsExclamationTriangle className="me-2" size={20} />
            <strong>Listado de Productos Críticos (Stock Reducido &lt; 6)</strong>
          </Card.Header>
          <Card.Body>
            {productosCriticos.length === 0 ? (
              <p className="titulo mb-0 text-center py-3">No hay productos con stock crítico en este momento.</p>
            ) : (
              <Table className="table-bordered tabla_historial" responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Stock Actual</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {productosCriticos.map(prod => (
                    <tr key={prod.id_producto || prod.codigo}>
                      <td>{prod.id_producto || prod.codigo}</td>
                      <td>{prod.nombre}</td>
                      <td><span className="badge bg-danger">{prod.stock} un.</span></td>
                      <td>${prod.precio ? prod.precio.toLocaleString('es-CL') : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

      </div>
    </main>
  );
}

export default Reportes;