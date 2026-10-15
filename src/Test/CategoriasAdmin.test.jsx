import { render, screen } from '@testing-library/react';
import { vi, it, expect } from 'vitest';
import CategoriasAdmin from '../Admin/Categoria/categoriaA';

it('muestra la lista de categorías registradas en la base de datos', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: async () => ({
      categorias: [
        { id_categoria: 1, nombre_categoria: 'Pop' },
        { id_categoria: 2, nombre_categoria: 'Jazz' },
      ],
    }),
  });

  render(<CategoriasAdmin />);

  expect(screen.getByText('Categorías')).toBeInTheDocument();

  expect(await screen.findByText('Pop')).toBeInTheDocument();
  expect(screen.getByText('Jazz')).toBeInTheDocument();
});