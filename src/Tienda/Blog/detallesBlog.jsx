import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import './blog.css'

export default function detallesBlog() {
  const [blogs, setBlogs] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs/detalles/${blog_id}`);
        const data = await res.json();
  
        if (data.ok) {
          setBlogs(data.blogs || []);
        }
      } catch (e) {
        console.error('Error al conectar con el servidor:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarBlogs();
  }, []);

  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando blogs...</div>;
  }

  return (
    <div>
      <div className="button-crear-blog">
        <h2 className="titulo-pagina">Blogs</h2>
      </div>
        <div>
          {blogs.map((blog) => (
            <div key={blog.id}>
              <Card className="estructura-blogs-inicio" >
                <Card.Img src={blog.imagen_blog} className="tamano-imagen-blog"/>
                <div>
                  <Card.Title className="titulo-blog">{blog.titulo}</Card.Title>
                </div>
                <div>
                  {blog.contenido}
                </div>
              </Card>
            </div>
          ))}
        </div>
    </div> 
  );
}
