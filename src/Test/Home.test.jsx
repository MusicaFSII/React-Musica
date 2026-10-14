import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Tienda/Home/home";

const crearFetch = (body) =>
  vi.fn(() => Promise.resolve({ json: () => Promise.resolve(body) }));

const crearProductos = (cantidad, cambios = () => ({})) =>
  Array.from({ length: cantidad }, (_, i) => ({
    id_producto: i + 1,
    codigo: `COD${i + 1}`,
    nombre: `Disco ${i + 1}`,
    descripcion: `Descripción ${i + 1}`,
    precio: 10000 + i * 1000,
    imagen_url: `/img/disco${i + 1}.jpg`,
    categoria_nombre: "Rock",
    ...cambios(i),
  }));

const renderizar = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe("Vista Home - productos destacados", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("formatoPrecio: muestra el precio en pesos chilenos con separador de miles", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({
        productos: crearProductos(2, (i) => ({
          precio: i === 0 ? 15990 : 750,
        })),
      })
    );

    renderizar();

    expect(await screen.findByText("$15.990")).toBeInTheDocument();
    expect(screen.getByText("$750")).toBeInTheDocument();
  });

  it("muestra solo los primeros 6 productos aunque el backend entregue mas", async () => {
    vi.stubGlobal("fetch", crearFetch({ productos: crearProductos(8) }));

    renderizar();

    expect(await screen.findByText("Disco 1")).toBeInTheDocument();
    expect(screen.getByText("Disco 6")).toBeInTheDocument();
    expect(screen.queryByText("Disco 7")).not.toBeInTheDocument();
    expect(screen.queryByText("Disco 8")).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });
});