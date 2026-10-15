// ProductosAdmin.test.jsx
import { render, screen } from '@testing-library/react';
import { vi, it, expect } from 'vitest';
import ProductosAdmin from '../Admin/Producto/productosA';

it('muestra la lista de productos traída del servidor', async () => {
  global.fetch = vi.fn((url) => {
    if (url === '/api/productos') {
      return Promise.resolve({
        json: async () => ({
          productos: [
            {
              nombre: 'Bohemian Rapsody',
              descripcion: 'Iconico exito de Queen',
              categoria_nombre: 'Rock',
              stock: 20,
              precio: 33500,
              imagen_url: '',
              en_oferta: 0,
              porc_oferta: 0,
            },
          ],
        }),
      });
    }
    if (url === '/api/categorias') {
      return Promise.resolve({
        json: async () => ({
          categorias: [{ id_categoria: 1, nombre_categoria: 'Rock' }],
        }),
      });
    }
  });

  render(<ProductosAdmin />);

  expect(screen.getByText('Cargando productos...')).toBeInTheDocument();

  expect(await screen.findByText('Bohemian Rapsody')).toBeInTheDocument();
  expect(screen.getByText('Iconico exito de Queen')).toBeInTheDocument();
  expect(screen.getByText('$33500')).toBeInTheDocument();
  expect(screen.getByText('Sin imagen')).toBeInTheDocument();

  expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
});