import { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BsPerson, BsEnvelope, BsCardHeading, BsTelephone, BsGeoAlt, BsMap } from "react-icons/bs";
import './perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);

  const cargarPerfil = async () => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    if (!usuarioGuardado) return;
    
    try {
      const response = await fetch(`/api/usuarios/${usuarioGuardado.id}`);
      const data = await response.json();
      if (data.ok) {
        setUsuario(data.usuario);
      } else {
        console.error("Error al obtener perfil:", data.error);
      }
    } catch (error) {
      console.error("Error");
    } 
  };

  useEffect(() => {
    cargarPerfil();
  }, []);


  if (!usuario) return null;

  const dataPerfil = [
    { id: 'nombre', title: 'Nombre', value: usuario.nombre, icon: <BsPerson size={28} className='icono_color mb-2' /> },
    { id: 'apellido', title: 'Apellido', value: usuario.apellido, icon: <BsPerson size={28} className='icono_color mb-2' /> },
    { id: 'correo', title: 'Correo Electronico', value: usuario.correo, icon: <BsEnvelope size={28} className='icono_color mb-2' /> },
    { id: 'rut', title: 'RUT', value: usuario.rut, icon: <BsCardHeading size={28} className='icono_color mb-2' /> },
    { id: 'telefono', title: 'Telefono', value: usuario.telefono, icon: <BsTelephone size={28} className='icono_color mb-2' /> },
    { id: 'region', title: 'Region', value: usuario.region, icon: <BsMap size={28} className='icono_color mb-2' /> },
    { id: 'comuna', title: 'Comuna', value: usuario.comuna, icon: <BsGeoAlt size={28} className='icono_color mb-2' /> },
  ];

  return (
    <div className="container text-center my-4">
      <h1 className="titulo">Mi Perfil</h1>
      <h4 className="titulo">Información de la cuenta</h4>

      <Row xs={1} md={2} lg={3} className="g-3 mt-2">
        {dataPerfil.map((item) => (
          <Col key={item.id}>
            <Card className="h-100 text-center shadow-sm tarjeta_perfil">
              <Card.Body>
                {item.icon}
                <Card.Title className="fs-6 text_card">{item.title}</Card.Title>
                <Card.Text className="fw-bold fs-5 text_card">{item.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/*botones editar perfil y cambiar contraseña*/}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link className="btn btn_editar" to={`/editarUsuario/${usuario.id}`}>
          Editar Perfil
        </Link>
        <Link className="btn btn_cambiar" to={`/cambiarPsswd/${usuario.id}`}>
          Cambiar Contraseña
        </Link>
      </div>
      
    </div>  
  );
}

export default Perfil;