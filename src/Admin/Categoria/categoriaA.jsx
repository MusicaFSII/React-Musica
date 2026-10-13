import React, { useState, useEffect } from 'react';
import './categoriaA.css';

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nombreCategoria, setNombreCategoria] = useState('');

  const cargarCategorias = async () => {
    try {
      const res = await fetch('/api/categorias');
      const data = await res.json();
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/categorias/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_categoria: nombreCategoria }),
    });

    const data = await response.json();
    if (data.ok) {
      alert(data.mensaje || 'Categoría agregada exitosamente');
      cargarCategorias();
      document.getElementById('cuadro-ingreso-categorias').close();
      setNombreCategoria('');
    } else {
      alert(data.error || 'Error al registrar categoría');
    }
  } catch (error) {
    console.error('Error en la petición:', error);
  }
};

  return (
    <div className="container-fluid flex-grow-1 p-0">
      <div className="row m-0 min-vh-100">

        <div className="col-10 col-sm-9 col-xl-10 p-4">
          <h2 className="mb-4">Categorías</h2>
          
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre de la Categoría</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="2" className="text-center">Cargando categorías...</td>
                </tr>
              ) : categorias.length > 0 ? (
                categorias.map((cat, index) => (
                  <tr key={cat.id_categoria || index}>
                    <th scope="row">{index + 1}</th>
                    <td>{cat.nombre_categoria}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">No hay categorías registradas</td>
                </tr>
              )}
            </tbody>
          </table>

          <button 
            className="btn btn-success" 
            onClick={() => document.getElementById('cuadro-ingreso-categorias').showModal()}
          >
            Agregar categoría
          </button>

          <dialog id="cuadro-ingreso-categorias">
            <form className="cuadro-registro" onSubmit={handleSubmit}>
              <h3>INGRESO DE CATEGORÍA</h3>
              
              <label htmlFor="nombre_categoria">Nombre: </label>
              <input 
                type="text" 
                id="nombre_categoria" 
                value={nombreCategoria} 
                onChange={(e) => setNombreCategoria(e.target.value)} 
                required 
              />

              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-info">Agregar</button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => document.getElementById('cuadro-ingreso-categorias').close()}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
}