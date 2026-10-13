import Logo from '../../assets/logo.png';
import './contacto.css'
import { useState } from 'react'; 
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { BsEnvelopeAt, BsPinMapFill, BsPhone, BsSend } from "react-icons/bs";

function Contacto() {
  const [datos, setDatos] = useState({
    correo: '',
    nombre: '',
    apellido: '',
    comentario: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [varianteAlert, setVarianteAlert] = useState('danger');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
 
    try {
      const response = await fetch('/api/comentario', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setVarianteAlert('success');
        setMensaje(data.mensaje || 'Comentario enviado con exito');
        setDatos({ correo: '', nombre: '', apellido: '', comentario: '' });
      } 
      else {
        setVarianteAlert('danger');
        setMensaje(data.error || 'Ocurrio un error al enviar el mensaje');
      }
    } 
    catch (error) {
      setVarianteAlert('danger');
      setMensaje('Error el mensaje no pude ser enviado');
    }
  };

  const tarjetasInfo = [
    { titulo: "Telefono", texto: "Proximamente", icono: <BsPhone/>  },
    { titulo: "Email", texto: "Proximamente", icono: <BsEnvelopeAt/> },
    { titulo: "Direccion", texto: "Proximamente", icono: <BsPinMapFill/> }
  ];

  return (
    <main className='contacto'>
      <div className="contenedor_logo">
        <img src={Logo} alt="logo"/>
      </div>
      
      <Container className='contenedor'>
        <Row xs={1} md={2} className="g-4 align-items-start" >
          
          {/**tarjetas contactos */}
          <Col md={5} lg={4}>
            <div className="d-flex flex-column gap-3">
              {tarjetasInfo.map((info, idx) => (
                <Card key={idx} className='tarjeta_contacto_item'>
                  <Card.Body className="d-flex align-items-center gap-3">
                    <div className="icono_box">
                      {info.icono}
                    </div>
                    <Card.Title className='mb-0 fw-bold titulo_card'>{info.titulo}</Card.Title>
                    <Card.Text className="mb-0 subtexto_card">{info.texto}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          {/*formulario contacto */}
          <Col md={7} lg={8}>
            <div className="contenedor_formulario_contacto">
              <h2>Envianos tus comentarios</h2>
              
              <form onSubmit={handleSubmit}>
                {mensaje && <Alert variant={varianteAlert}>{mensaje}</Alert>}
                <label htmlFor="correo">Correo</label>
                <input
                  className="form-control"
                  maxLength="100"
                  name="correo"
                  pattern=".+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)"
                  placeholder="Correo Electronico"
                  type="text"
                  required
                  value={datos.correo}
                  onChange={handleChange}
                />
                  
                <label htmlFor="nombre">Nombre</label>
                <input
                  className="form-control"
                  maxLength="100"
                  name="nombre"
                  placeholder="Nombre"
                  type="text"
                  required
                  value={datos.nombre}
                  onChange={handleChange}
                />

                <label htmlFor="apellido">Apellido</label>
                <input
                  className="form-control"
                  maxLength="100"
                  name="apellido"
                  placeholder="Apellido"
                  type="text"
                  required
                  value={datos.apellido}
                  onChange={handleChange}
                />

                <label htmlFor="comentario">Comentario</label>
                <textarea
                  className="form-control"
                  maxLength="500"
                  name="comentario"
                  placeholder="Contenido"
                  required
                  rows="4"
                  value={datos.comentario}
                  onChange={handleChange}
                />
                <button className="btn btn-primary" type="submit">
                  <BsSend className='me-2'/>Enviar Mensaje
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}   

export default Contacto;