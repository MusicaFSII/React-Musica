import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, it, expect } from 'vitest';
import CarritoPage from '../Tienda/Carrito/DetallesCarrito'; 
import { CarritoContext } from '../Tienda/Carrito/Carrito';

it('muestra los productos del carrito y el resumen', async () => {
  const eliminarProducto = vi.fn();
  const limpiarCarrito = vi.fn();

  const valorContexto = {
    carrito: [
      { id: 1, nombre: 'Billie Jean', precio: 25000, cantidad: 2, imagen: 'mj.png' },
      { id: 2, nombre: 'Smooth Criminal', precio: 27500, cantidad: 3, imagen: 'exito.png' },
    ],
    eliminarProducto,
    limpiarCarrito,
    totalProductos: 5,
    costoTotal: 132500,
  };

  render(
    <MemoryRouter>
      <CarritoContext.Provider value={valorContexto}>
        <CarritoPage />
      </CarritoContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
  expect(screen.getByText('Billie Jean')).toBeInTheDocument();
  expect(screen.getByText('Smooth Criminal')).toBeInTheDocument();

  expect(screen.getByText(`$${(25000).toLocaleString('es-CL')}`)).toBeInTheDocument();
  expect(screen.getByText(`$${(27500).toLocaleString('es-CL')}`)).toBeInTheDocument();

  expect(screen.getByText('Total artículos:')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Proceder al Pago' })).toHaveAttribute('href', '/compras');

  await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);
  expect(eliminarProducto).toHaveBeenCalledWith(1);

  await userEvent.click(screen.getByRole('button', { name: 'Vaciar Carrito' }));
  expect(limpiarCarrito).toHaveBeenCalled();
});