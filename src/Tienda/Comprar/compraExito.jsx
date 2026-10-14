import { BsChevronLeft, BsCheckCircle } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import { useState, useEffect, useRef } from "react";
import html2pdf from 'html2pdf.js';
import './boleta.css';

function CompraExito() {
  const location = useLocation();
  const compraId = location.state?.compraId;
  const [compra, setCompra] = useState(null);
  const boleta = useRef(null);

  useEffect(() => {
    if (!compraId) return;

    const cargarCompra = async () => {
      try {
        const response = await fetch(`/api/compras/${compraId}`);
        const data = await response.json();
        if (data.ok && data.compra) {
          setCompra(data.compra);
        }
      } catch (error) {
        console.error("Error al obtener los detalles de la compra:", error);
      }
    };

    cargarCompra();
  }, [compraId]);

  const descargarPDF = () => {
    const elemento = boleta.current;
    const opciones = {
      margin: 10,
      filename: `boleta_compra_${compraId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(opciones).from(elemento).save();
  };

  return (
    <main className="container-fluid my-4 pagina_boleta">
      <div className="wireframe-box p-4 mb-5">
        <Button as={Link} to="/home" variant="outline-primary">
          <BsChevronLeft className='me-1'/>Volver al Inicio
        </Button>

        <div ref={boleta} className="p-3 bg-white boleta-exportable">
          <h1 className="mt-4 text-success">
            <BsCheckCircle className="me-2" color="#31cc12" />
            ¡Compra realizada con exito! nro #{compraId}
          </h1>

          {compra && (
            <>
              <Card className="mt-4 mb-4">
                <Card.Header as="h5">Informacion del Cliente</Card.Header>
                <Card.Body>
                  <p><strong>Nombre</strong> {compra.nombre} {compra.apellido}</p>
                  <p><strong>Correo Electrónico:</strong> {compra.correo}</p>
                  <p className="mb-0"><strong>Teléfono de contacto:</strong> {compra.telefono}</p>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header as="h5">Dirección de Envío</Card.Header>
                <Card.Body>
                  <p><strong>Calle:</strong> {compra.calle} {compra.depo ? `, Dpto/Casa: ${compra.depo}` : ''}</p>
                  <p><strong>Comuna / Región:</strong> {compra.comuna}, <span className="text-capitalize">{compra.region}</span></p>
                  {compra.indicacion && (
                    <p className="mb-0"><strong>Indicaciones de entrega:</strong> {compra.indicacion}</p>
                  )}
                </Card.Body>
              </Card>

              <h4 className="mb-3">Detalle del Pedido</h4>
              <div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compra.productos && compra.productos.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre_producto}</td>
                        <td>${item.precio.toLocaleString('es-CL')}</td>
                        <td>{item.cantidad}</td>
                        <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                    <tr>
                      <th colSpan={5} className="text-end pe-4 fs-5">
                        Total pagado: ${compra.total}
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </div>

        <div className="container mt-4 text-center">
          <Button variant="outline-danger" className='mb-4' onClick={descargarPDF}>
            Descargar Boleta en PDF
          </Button>
        </div>
      </div>
    </main>
  );
}

export default CompraExito;