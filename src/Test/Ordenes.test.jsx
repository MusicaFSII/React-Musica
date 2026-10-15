import { render, screen } from '@testing-library/react';
import { vi, it, expect } from 'vitest';
import Ordenes from '../Admin/Ordenes/ordenes';

vi.mock('html2pdf.js', () => ({ default: vi.fn() }));

it('Historial de órdenes desde el servidor', async () => {
  global.fetch = vi.fn((url) => {
    if (url === '/api/compras') {
      return Promise.resolve({
        json: async () => ({
          ok: true,
          compras: [
            {
              id: 1,
              fecha: '2026-10-10',
              nombre: 'Ana',
              apellido: 'Pérez',
              correo: 'ana@correo.cl',
              total: 15000,
              usuario_id: 7,
            },
          ],
        }),
      });
    }
    if (url === '/api/usuarios') {
      return Promise.resolve({
        json: async () => ({
          ok: true,
          usuarios: [
            { id: 7, nombre: 'Ana', apellido: 'Pérez', correo: 'ana@correo.cl' },
          ],
        }),
      });
    }
  });

  render(<Ordenes />);

  expect(screen.getByText('Ordenes')).toBeInTheDocument();
  expect(await screen.findByText('#1')).toBeInTheDocument();
  expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
  expect(screen.getByText('$15000')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /Descargar Boleta/i })
  ).toBeInTheDocument();
});