import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import './blog.css'

export default function detallesBlog() {
  const {blog_id} = useParams();
  const [blogs, setBlogs] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs/detalles/${blog_id}`);
        const data = await res.json();
  
        if (res.ok) {
          setBlogs(data);
        }
      } catch (e) {
        console.error('Error al conectar con el servidor:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarBlogs();
  }, [blog_id]);

  if (cargando) {
    return <div>Cargando blogs...</div>;
  }

  if (cargando) {
    return <div>No se encontró el blog</div>;
  }

  return (
    <div>
      <div>
        <Card className="separacion-titulo-parrafo">
          <Card.Img src={blogs.imagen_blog} className="tamano-imagen-blog-detalle" />
          <div className="contenido-texto-blog">
            <Card.Title className="titulo-blog-detalle">{blogs.titulo}</Card.Title>
            <div className="parrafo-posicion-tamano">
              {blogs.contenido}
            </div>
          </div>
        </Card>
      </div>
    </div> 
  );
}
