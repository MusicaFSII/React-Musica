import { BsChevronLeft } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import './compras.css';
import { useState, useEffect, useContext} from "react";
import {CarritoContext} from "../Carrito/Carrito";

function Compras() {
  const navigate = useNavigate();
  const {carrito, costoTotal, totalProductos, limpiarCarrito} = useContext(CarritoContext);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    calle: '',
    depo: '',
    region: 'selecciona',
    comuna: '', 
    indicacion: ''
  });
  
  //autocompleta si la sesion esta abierta 
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const u = JSON.parse(usuarioGuardado);
        setFormData(prev => ({
          ...prev,
          nombre: u.nombre || prev.nombre,
          apellido: u.apellido || prev.apellido,
          correo: u.correo || prev.correo,
          telefono: u.telefono || prev.telefono,
          region: u.region || prev.region,
          comuna: u.comuna || prev.comuna
        }));
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({ ...prev, [name]: value}));
  };

  //se autocompleta si el correo coincide con la base de datos
  const correoBlur = async () => {
    if(!formData.correo.trim()) return;
    
    try {
      const response = await fetch(`/api/usuarios/correo/${encodeURIComponent(formData.correo)}`);
      const data = await response.json();
       
      if(data.ok && data.usuario){
        const u = data.usuario;
        setFormData(prev => ({
          ...prev,
          nombre: u.nombre || prev.nombre,
          apellido: u.apellido || prev.apellido,
          telefono: u.telefono || prev.telefono,
          region: u.region || prev.region,
          comuna: u.comuna || prev.comuna
        }));
      }
    }
    catch (error){
      console.error("Error al autocompletar al usuario", error);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total: costoTotal,
          productos: carrito
        })
      });

      const data = await response.json();
      if (data.ok && data.compra_id) {
        navigate('/compraExito',{ state: { compraId: data.compra_id } });
      } else {
        navigate('/compraFallo',{ state: { compraId: data.compra_id, errorMsg: data.error } });
      }
    } catch (error) {
      console.error("Error al enviar la compra:", error);
      navigate('/compraFallo', { state: { errorMsg: "Error al procesar el pago" } });
    }
  };

  return (
  <main className="container my-4">
    <div className="wireframe-box p-4 mb-5">
      
      {/*boton de volver */}
      <Button
        as={Link}
        to="/home"
        className="boton_volver"
      >
        <BsChevronLeft className='me-1'/>Volver
      </Button>

      {/*resumen del pedido*/}
      <Card className="mt-4 mb-4 tarjeta_producto">
        <Card.Body>
          <Card.Title className="text_card">Resumen del Pedido</Card.Title>
          <hr style={{ border: '0', borderTop: '2px solid #FFF3CF', margin: '10px 0' }} />
          
          {/*acordeon con la lista de productos */}
          <Accordion defaultActiveKey="0" className="w-100" >
            <Accordion.Item eventKey="0" className="w-100">
              <Accordion.Header className="w-100">{totalProductos} Articulo(s)</Accordion.Header>
              <Accordion.Body className="p-0">
                <Table striped bordered hover responsive className="mb-0 w-100">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>SubTotal</th>
                    </tr>
                  </thead>
                  <tbody >
                    {carrito.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-3">No hay productos en el carrito</td>
                      </tr>
                    ) : (
                      carrito.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img src={item.imagen} alt={item.nombre}
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}>
                            </img>
                          </td>
                          <td>{item.nombre}</td>
                          <td>{item.cantidad}</td>
                          <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
     
          <hr style={{ border: '0', borderTop: '2px solid #FFF3CF', margin: '10px 0' }} />
          <Card.Text className="text_card">Total a pagar ${costoTotal.toLocaleString('es-CL')}</Card.Text>
        </Card.Body>
      </Card>

    <hr style={{ border: '0', borderTop: '2px solid #FFF3CF', margin: '10px 0' }} />
      {/*informacion del cliente*/}
      <div className="contenedor_formulario">
        <form onSubmit={submit}>
          <h3>Información del Cliente</h3>
            <label htmlFor="correo">Correo</label>
            <input
              maxLength="100"
              name="correo"
              pattern=".+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)"
              placeholder="Correo Electrónico"
              type="text" 
              required
              value={formData.correo}
              onChange={handleChange}
              onBlur={correoBlur}
            />
            <label htmlFor="nombre">Nombre</label>
            <input
              maxLength="100"
              name="nombre"
              placeholder="Nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
            <label htmlFor="apellido">Apellido</label>
            <input
              maxLength="100"
              name="apellido"
              placeholder="Apellido"
              type="text"
              required
              value={formData.apellido}
              onChange={handleChange}
            />
            
          <hr style={{ border: '0', borderTop: '2px solid #FFF3CF', margin: '10px 0' }} />
          {/*informacion de envio */}
          <h3>Información Dirección de Envío</h3>
          <label htmlFor="telefono">Teléfono</label>
          <input 
            name="telefono" 
            placeholder="Teléfono" 
            type="text" 
            required
            value={formData.telefono}
            onChange={handleChange}
          />
          <label htmlFor="calle">Calle</label>
          <input 
            name="calle" 
            placeholder="Calle" 
            type="text" 
            required
            value={formData.calle}
            onChange={handleChange}
          />
          <label htmlFor="depo">Departamento (opcional)</label>
          <input 
            name="depo" 
            placeholder="Departamento" 
            type="text" 
            value={formData.depo}
            onChange={handleChange}
          />
          
          <div className="region-comuna">
            <select id="region" name="region" value={formData.region} onChange={handleChange} required>
              <option value="selecciona" disabled>Seleccione la Región</option>
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
              name="comuna" 
              placeholder="Comuna" 
              type="text" 
              required
              value={formData.comuna}
              onChange={handleChange}
            />
          </div>

          <label htmlFor="indicacion">Indicaciones de Entrega (opcional)</label>
          <textarea
            className="form-control"
            maxLength="500"
            name="indicacion"
            placeholder="Indicación"
            rows="4"
            value={formData.indicacion}
            onChange={handleChange}
          />

          {/* Botón de pagar */}
          <div className="container mt-4">
            <Button type="submit" className="boton">Pagar ${costoTotal.toLocaleString('es-CL')}</Button>
          </div>

        </form>
      </div>
    </div>
  </main>
  );
}
export default Compras;