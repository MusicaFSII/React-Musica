import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, it, expect } from 'vitest';
import Blog from '../Tienda/Blog/Blogs';

it('muestra la lista de blogs presentes en la base de datos SQLite', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: async () => ({
      ok: true,
      blogs: [
        {
          blog_id: 1,
          titulo: 'El mejor disco de la historia',
          contenido: 'Aquí se debe presentar información del mejor disco de la historia',
          imagen_blog: 'data:image/png;base64,AAAA',
        },
        {
          blog_id: 2,
          titulo: 'Cuantas veces un solo artista puede permanecer en la cima',
          contenido: 'Opiniones diversas sobre este tema que es bastante apasionante para los entendidos',
          imagen_blog: 'data:image/png;base64,BBBB',
        },
      ],
    }),
  });

  render(
    <MemoryRouter initialEntries={['/blogs']}>
      <Blog />
    </MemoryRouter>
  );

  expect(screen.getByText('Cargando blogs...')).toBeInTheDocument();

  expect(await screen.findByText('El mejor disco de la historia')).toBeInTheDocument();
  expect(screen.getByText('Cuantas veces un solo artista puede permanecer en la cima')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Blogs' })).toBeInTheDocument();

  expect(screen.queryByRole('button', { name: 'Crear Blog' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
});