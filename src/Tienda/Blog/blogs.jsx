import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import './blog.css'

export default function Blog() {
  const location = useLocation();
  const esAdmin = location.pathname.includes('/admin');

  const [blogs, setBlogs] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [modo, setModo] = useState('lista');
  const [blogEditable, setBlogEditable] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);

  const [tituloEditado, setTituloEditado] = useState('');
  const [contenidoEditado, setContenidoEditado] = useState('');

  useEffect(() => {
    const cargarBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
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

  const convertirBase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.readAsDataURL(archivo);
      lector.onload = () => resolve(lector.result);
      lector.onerror = (error) => reject(error);
    });
  };

  const controlCrear = async (e) => {
    e.preventDefault();
    if (!imagen) return alert("Por favor, selecciona una imagen.");

    try {
      const stringBase64 = await convertirBase64(imagen);
      const nuevoBlog = { titulo, contenido, imagen_blog: stringBase64 };

      const res = await fetch('/api/blogs/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoBlog)
      });
      const data = await res.json();

      if (data.ok) {
        alert("¡Blog creado con éxito!");
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activarEdicion = (blog) => {
    setBlogEditable(blog);
    setTituloEditado(blog.titulo);
    setContenidoEditado(blog.contenido);
    setModo('editar');
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      let stringBase64 = null;
      if (imagen) {
        stringBase64 = await convertirBase64(imagen);
      }

      const res = await fetch(`/api/blogs/editar/${blogEditable.blog_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: tituloEditado,
          contenido: contenidoEditado
        })
      });
      const data = await res.json();

      if (data.ok) {
        alert("Blog actualizado con éxito");
        setBlogs(blogs.map(b => b.blog_id === blogEditable.blog_id ? { ...b, titulo: tituloEditado, contenido: contenidoEditado } : b));
        setBlogEditable(null);
        setModo('lista');
      }
    } catch (error) {
      console.log('Ha ocurrido un error actualizando el blog', error);
    }
  };

  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando blogs...</div>;
  }

  if ((modo === 'crear' || modo === 'editar') && esAdmin) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', color: '#fff' }}>
        <h3>{modo === 'crear' ? 'Creación de blog' : `Editando: ${blogEditable?.blog_id}`}</h3>

        <form onSubmit={modo === 'crear' ? controlCrear : guardarCambios}>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Título:</label>
            <input type="text" value={modo === 'crear' ? titulo : tituloEditado} onChange={e => modo === 'crear' ? setTitulo(e.target.value) : setTituloEditado(e.target.value)} style={{ width: '100%', padding: '8px', color: '#000' }} required />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Contenido:</label>
            <textarea 
              value={modo === 'crear' ? contenido : contenidoEditado} 
              onChange={e => modo === 'crear' ? setContenido(e.target.value) : setContenidoEditado(e.target.value)} 
              rows="5" 
              style={{ width: '100%', padding: '8px', color: '#000' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Imagen:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImagen(e.target.files[0])} 
              style={{ width: '100%' }}
              required={modo === 'crear'} 
/>
          </div>

          <Button type="submit" variant={modo === 'crear' ? 'primary' : 'success'} style={{ marginRight: '10px' }}>
            {modo === 'crear' ? 'Publicar' : 'Guardar Cambios'}
          </Button>

          <Button type="button" variant="secondary" onClick={() => {
            setBlogEditable(null);
            setModo('lista');
            setTitulo('');
            setContenido('');
            setImagen(null);
          }}>
            Cancelar
          </Button>

        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="button-crear-blog">
        <h2>Blogs</h2>
        {esAdmin &&(
          <Button variant="primary" onClick={() => setModo('crear')}>
            Crear Blog
          </Button>
        )}
      </div>

      {blogs.length === 0 ? (
        <div>No hay blogs, ¡Escribe uno!</div>
      ) : (
        <div>
          {blogs.map((blog) => (
            <div key={blog.id}>
              <Card className="main-blog flex-row">
                <Card.Img src={blog.imagen_blog} />
                <Card.Body>
                  <Card.Title className="titulo-blog">{blog.titulo}</Card.Title>
                  <Card.Text>{blog.contenido}</Card.Text>
                  {esAdmin &&(
                    <div>
                      <Button variant="warning" onClick={() => activarEdicion(blog)}>
                        Editar
                      </Button>
                    </div>
                  )}
                  
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div> 
  );
} 
