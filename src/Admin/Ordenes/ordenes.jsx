import { useState, useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { BsFileEarmarkPdf, BsSearch } from "react-icons/bs";
import html2pdf from 'html2pdf.js';

export default function Ordenes() {
  const [compras, setCompras] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroUsuarioId, setFiltroUsuarioId] = useState('');
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const boletaRef = useRef(null);

  useEffect(() => {
    cargarCompras();
    cargarUsuarios();
  }, []);

  const cargarCompras = async () => {
    try {
      const res = await fetch('/api/compras');
      const data = await res.json();
      if (data.ok) setCompras(data.compras);
    } catch (error) {
      console.error("Error al cargar compras:", error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      if (data.ok) setUsuarios(data.usuarios);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const comprasFiltradas = filtroUsuarioId 
    ? compras.filter(c => String(c.usuario_id) === String(filtroUsuarioId))
    : compras;

  const descargarBoletaPDF = (compra) => {
    setCompraSeleccionada(compra);
    
    setTimeout(() => {
      const elemento = boletaRef.current;
      if (!elemento) return;
      const opciones = {
        margin: 10,
        filename: `boleta_admin_${compra.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      html2pdf().set(opciones).from(elemento).save();
    }, 500);
  };

  return (
    <main className="container my-4">
      <div className="wireframe-box p-4 mb-5 tabla_historial rounded shadow-sm">
        <h2 className="titulo mb-4">Ordenes</h2>

        {/*historial compras*/}
        <Card className="mb-4 tabla_historial">
          <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
            <strong>Historial de Ordenes</strong>
            <div className="d-flex align-items-center gap-2" style={{ width: '320px' }}>
              <BsSearch className="text-white" />
              <Form.Select 
                size="sm" 
                value={filtroUsuarioId} 
                onChange={(e) => setFiltroUsuarioId(e.target.value)}
              >
                <option value="">Filtrar por usuario (Todos)</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido} ({u.correo})
                  </option>
                ))}
              </Form.Select>
            </div>
          </Card.Header>
          <Card.Body>
            <Table className="table-bordered tabla_historial" responsive>
              <thead>
                <tr>
                  <th>N° Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comprasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center titulo">No se encontraron ordenes.</td>
                  </tr>
                ) : (
                  comprasFiltradas.map(compra => (
                    <tr key={compra.id}>
                      <td>#{compra.id}</td>
                      <td>{compra.fecha}</td>
                      <td>{compra.nombre} {compra.apellido}</td>
                      <td>{compra.correo}</td>
                      <td>${compra.total}</td>
                      <td>
                        <Button 
                          className="botonPDF"
                          size="sm" 
                          onClick={() => descargarBoletaPDF(compra)}
                        >
                          <BsFileEarmarkPdf className="me-1" /> Descargar Boleta
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/*contenedor que general la boleta en PDF */}
        <div style={{ display: 'none' }}>
          {compraSeleccionada && (
            <div ref={boletaRef} className="p-4 bg-white text-dark" style={{ width: '600px' }}>
              <h3 className="text-success mb-3">Boleta Electrónica - Nro #{compraSeleccionada.id}</h3>
              <p><strong>Fecha:</strong> {compraSeleccionada.fecha}</p>
              <hr />
              <h5>Datos del Cliente</h5>
              <p><strong>Nombre:</strong> {compraSeleccionada.nombre} {compraSeleccionada.apellido}</p>
              <p><strong>Correo:</strong> {compraSeleccionada.correo}</p>
              <p><strong>Teléfono:</strong> {compraSeleccionada.telefono}</p>
              <hr />
              <h5>Dirección de Envío</h5>
              <p><strong>Calle:</strong> {compraSeleccionada.calle} {compraSeleccionada.depo ? `, Dpto: ${compraSeleccionada.depo}` : ''}</p>
              <p><strong>Comuna / Región:</strong> {compraSeleccionada.comuna}, {compraSeleccionada.region}</p>
              {compraSeleccionada.indicacion && <p><strong>Indicaciones:</strong> {compraSeleccionada.indicacion}</p>}
              <hr />
              <h4 className="text-end mt-4">Total Pagado: ${compraSeleccionada.total}</h4>
            </div>
          )}
        </div>

      </div>
    </main>
)};