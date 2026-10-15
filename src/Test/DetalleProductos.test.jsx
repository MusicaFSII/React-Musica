import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, it, expect } from 'vitest';
import { CarritoContext } from '../Tienda/Carrito/Carrito'; 
import DetalleProductos from '../Tienda/Productos/detalleProductos';

it('muestra el detalle del producto y lo agrega al carrito', async () => {
  const agregarProducto = vi.fn();

  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      ok: true,
      producto: {
        id_producto: 1,
        codigo: 'VIN-0020',
        nombre: 'Material Girl',
        descripcion: 'Disco pop',
        imagen_url: 'ma_girl.png',
        precio: 20000,
        en_oferta: 1,
        porc_oferta: 25,
        precio_final: 15000,
      },
    }),
  });

  render(
    <MemoryRouter initialEntries={['/producto/VIN-0020']}>
      <CarritoContext.Provider value={{ agregarProducto }}>
        <Routes>
          <Route path="/producto/:codigo" element={<DetalleProductos />} />
        </Routes>
      </CarritoContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText('Cargando producto...')).toBeInTheDocument();

  expect(await screen.findByRole('heading', { name: 'Material Girl' })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/productos/VIN-0020');

  expect(screen.getByText('-25%')).toBeInTheDocument();
  expect(screen.getByText('Disco pop')).toBeInTheDocument(); 

  const formato = (valor) => new Intl.NumberFormat('es-CL').format(valor);
  const precioBase = 15000; 
  const iva = Math.round(precioBase * 0.19);
  const neto = precioBase - iva;

  expect(screen.getByText(formato(precioBase))).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
  expect(agregarProducto).toHaveBeenCalledWith({
    id: 1,
    nombre: 'Material Girl',
    precio: 15000,
    imagen: 'ma_girl.png',
  });
});