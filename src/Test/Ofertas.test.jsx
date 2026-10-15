import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, it, expect } from 'vitest';
import Ofertas from '../Tienda/Ofertas/ofertas';

it('muestra los productos en oferta traídos del servidor', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: async () => ({
      productos: [
        {
          id_producto: 1,
          codigo: 'VIN-0029',
          nombre: 'Love is a long road',
          imagen_url: 'tom_petty.png',
          stock: 10,
          precio: 20000,
          en_oferta: 1,
          porc_oferta: 25,
          precio_final: 15000,
        },
        {
          id_producto: 2,
          codigo: 'VIN-0030',
          nombre: 'Back In Black',
          imagen_url: 'acdc.png',
          stock: 7,
          precio: 30000,
          en_oferta: 0,
          porc_oferta: 0,
          precio_final: 30000,
        },
      ],
    }),
  });

  render(
    <MemoryRouter>
      <Ofertas />
    </MemoryRouter>
  );

  expect(screen.getByText('Cargando catálogo...')).toBeInTheDocument();

  expect(await screen.findByText('Love is a long road')).toBeInTheDocument();
  expect(screen.getByText('Back In Black')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Ofertas' })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/productos/ofertas');

  expect(screen.getByText(`$${(2000).toLocaleString('es-CL')}`)).toBeInTheDocument();
  expect(screen.getByText(`$${(1500).toLocaleString('es-CL')}`)).toBeInTheDocument();

  expect(screen.getByText(`$${(3000).toLocaleString('es-CL')}`)).toBeInTheDocument();

  expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Love is a long road/ })).toHaveAttribute('href', '/producto/VIN-0029');
});