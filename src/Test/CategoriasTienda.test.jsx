import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, it, expect } from 'vitest';
import CategoriasTienda from '../Tienda/Categorias/categorias'; 

it('muestra los productos de la categoría seleccionada', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      ok: true,
      productos: [
        {
          id_producto: 1,
          codigo: 'VIN-0019',
          nombre: 'Dont tread on me',
          descripcion: 'Clasico de Metallica',
          precio: 56000,
          imagen_url: 'https://enlace.com/dtom.jpg',
        },
      ],
    }),
  });

  render(
    <MemoryRouter>
      <CategoriasTienda />
    </MemoryRouter>
  );

  expect(screen.getByText('Cargando productos...')).toBeInTheDocument();

  expect(await screen.findByText('Dont tread on me')).toBeInTheDocument();
  expect(screen.getByText('Clasico de Metallica')).toBeInTheDocument();

  expect(fetch).toHaveBeenCalledWith('/api/productos');

  expect(screen.getByRole('link', { name: /Dont tread on me/i })).toHaveAttribute('href', '/producto/VIN-0019');

  const precioFormateado = (56000).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });
  expect(screen.getByText(precioFormateado)).toBeInTheDocument();
});