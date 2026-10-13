import React from 'react';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

//rutas de la tienda
import NavigationBar from './Tienda/Navbar/navbar';
import Footer from './Tienda/Footer/footer';
import Home from './Tienda/Home/home';
import Productos from './Tienda/Productos/producto';
import CategoriasTienda from './Tienda/Categorias/categorias';
import DetalleProductos from "./Tienda/Productos/detalleProductos";
import { CarritoContext, carrito as CarritoProvider} from './Tienda/Carrito/Carrito';
import DetallesCarrito from './Tienda/Carrito/DetallesCarrito';
import Nosotros from './Tienda/Nosotros/nosotros';
import Blog from './Tienda/Blog/blogs';
import Contacto from './Tienda/Contacto/contacto';
import Categorias from './Tienda/Categorias/categorias';
import Compras from './Tienda/Comprar/compras';
import CompraExito from './Tienda/Comprar/compraExito';
import CompraFallo from './Tienda/Comprar/compraFallo';
import Ofertas from './Tienda/Ofertas/ofertas';
import Login from './Tienda/Login/login';
import Registro from './Tienda/Login/registro';

//rutas de administracion
import NavbarAdmin from './Admin/Navbar/navbarAdmin';
import Perfil from './Admin/Perfil/perfil';
import CambiarPsswd from './Admin/Perfil/cambiarPsswd';
import Usuarios from './Admin/Usuarios/usuarios';
import EditarUsuario from './Admin/Usuarios/editarUsuario';
import HistorialCompra from './Admin/Usuarios/historialCompra';
import ProductosAdmin from './Admin/Producto/productosA';
import CategoriasAdmin from './Admin/Categoria/categoriaA';
import Dashboard from './Admin/Dashboard/dashboard';
import Reporte from './Admin/Reportes/reportes';
import Ordenes from './Admin/Ordenes/ordenes';

function App() {
  return (
    <BrowserRouter>

    <CarritoProvider>
      <Routes>

        {/* TIENDA */}
        <Route element={<><NavigationBar /><Footer /></>}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/producto" element={<Productos />} />
          <Route path="/producto/:codigo" element={<DetalleProductos />} />
          <Route path="/categorias/:id" element={<Categorias />} />
          <Route path="/carrito" element={<DetallesCarrito/>} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/admin/blogs" element={<Blog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/compraExito" element={<CompraExito />} />
          <Route path="/compraFallo" element={<CompraFallo />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        {/* ADMIN solo usuario con el rol = admin*/}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route element={<><NavbarAdmin /><Footer /></>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/editarUsuario/:id" element={<EditarUsuario />} />
            <Route path="/historialCompra/:id" element={<HistorialCompra />} />
            <Route path="/productosA" element={<ProductosAdmin />} />
            <Route path="/categoriaA" element={<CategoriasAdmin />} />
            <Route path="/reportes" element={<Reporte />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cambiarPsswd/:id" element={<CambiarPsswd />} />
            <Route path="/ordenes" element={<Ordenes/>} />
          </Route>
        </Route>

      </Routes>
      </CarritoProvider>
    </BrowserRouter>

    
  );
}
export default App;