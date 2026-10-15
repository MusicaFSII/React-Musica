import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, it, expect } from 'vitest';
import CatalogoProductos from '../Tienda/Productos/producto';

it('muestra el catálogo de productos traído del servidor', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: async () => ({
      productos: [
        {
          codigo: 'VIN-0010', //
          nombre: 'Bohemian Rapsody',
          descripcion: 'Iconico exito de Queen',
          categoria_nombre: 'Rock',
          stock: 20,
          precio: 33500,
          imagen_url: '',
          en_oferta: 0,
          porc_oferta: 0,
        },
        {
          codigo: 'VIN-0012', //
          nombre: 'The Last Stand',
          descripcion: 'Clasicos de Sabaton',
          categoria_nombre: 'Rock',
          stock: 30,
          precio: 23500,
          precio_final: 18800,
          en_oferta: 1,
          porc_oferta: 20,
        },
      ],
    }),
  });

  render(
    <MemoryRouter>
      <CatalogoProductos />
    </MemoryRouter>
  );

  expect(screen.getByText('Cargando catálogo...')).toBeInTheDocument();

  expect(await screen.findByText('Bohemian Rapsody')).toBeInTheDocument();
  expect(screen.getByText('The Last Stand')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Catálogo de Productos' })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/productos');

  expect(screen.getByText(`$${(33500).toLocaleString('es-CL')}`)).toBeInTheDocument();
  expect(screen.getByText(`$${(23500).toLocaleString('es-CL')}`)).toBeInTheDocument();
  expect(screen.getByText(`$${(18800).toLocaleString('es-CL')}`)).toBeInTheDocument();

  expect(screen.getByText('Stock: 20')).toBeInTheDocument();
  expect(screen.getByText('Stock: 30')).toBeInTheDocument();

  expect(screen.getByRole('link', { name: /Bohemian Rapsody/ })).toHaveAttribute('href', '/producto/VIN-0010');
});