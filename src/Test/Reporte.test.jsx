import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Reportes from "../Admin/Reportes/reportes";

const productosMock = [
  { id_producto: 1, nombre: "Disco Agotado", stock: 0, precio: 12990 },
  { id_producto: 2, nombre: "Disco Bajo", stock: 3, precio: 15990 },
  { id_producto: 3, nombre: "Disco Limite", stock: 6, precio: 18990 },
  { id_producto: 4, nombre: "Disco Normal", stock: 7, precio: 21990 },
  { id_producto: 5, nombre: "Disco Abundante", stock: 20, precio: 9990 },
];

const crearFetch = (body) =>
  vi.fn(() => Promise.resolve({ json: () => Promise.resolve(body) }));

describe("Vista Reportes - productos criticos", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("lista los productos con stock de 6 o menos (incluye los agotados)", async () => {
    const fetchMock = crearFetch({ ok: true, productos: productosMock });
    vi.stubGlobal("fetch", fetchMock);

    render(<Reportes />);

    expect(await screen.findByText("Disco Agotado")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/productos");
    expect(screen.getByText("Disco Bajo")).toBeInTheDocument();
    expect(screen.getByText("Disco Limite")).toBeInTheDocument();
    expect(screen.getByText("0 un.")).toBeInTheDocument();
    expect(screen.getByText("3 un.")).toBeInTheDocument();
    expect(screen.getByText("6 un.")).toBeInTheDocument();
    expect(screen.queryByText("Disco Normal")).not.toBeInTheDocument();
    expect(screen.queryByText("Disco Abundante")).not.toBeInTheDocument();
  });

  it("muestra el precio con separador de miles chileno, o $0 si no tiene precio", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({
        ok: true,
        productos: [
          { id_producto: 1, nombre: "Con precio", stock: 2, precio: 15990 },
          { id_producto: 2, nombre: "Sin precio", stock: 1 },
        ],
      })
    );

    render(<Reportes />);

    expect(await screen.findByText("$15.990")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("usa el código como identificador cuando el producto no tiene id_producto", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({
        ok: true,
        productos: [{ codigo: "COD9", nombre: "Solo codigo", stock: 1, precio: 5000 }],
      })
    );

    render(<Reportes />);

    expect(await screen.findByText("Solo codigo")).toBeInTheDocument();
    expect(screen.getByText("COD9")).toBeInTheDocument();
  });

  it("muestra un mensaje cuando ningún producto tiene stock crítico", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({
        ok: true,
        productos: [
          { id_producto: 1, nombre: "Disco A", stock: 50, precio: 10000 },
          { id_producto: 2, nombre: "Disco B", stock: 60, precio: 12000 },
        ],
      })
    );

    render(<Reportes />);

    expect(
      await screen.findByText("No hay productos con stock crítico en este momento.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Disco A")).not.toBeInTheDocument();
    expect(screen.queryByText("Disco B")).not.toBeInTheDocument();
  });

  it("muestra el mensaje de lista vacía si el backend responde ok: false", async () => {
    const json = vi.fn(() => Promise.resolve({ ok: false }));
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ json })));

    render(<Reportes />);

    await waitFor(() => expect(json).toHaveBeenCalled());
    expect(
      screen.getByText("No hay productos con stock crítico en este momento.")
    ).toBeInTheDocument();
  });
});

describe("Vista Reportes - falla de conexión", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("registra el error y deja la lista de críticos vacía", async () => {
    const error = new Error("sin conexión");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(error)));

    render(<Reportes />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error al cargar datos de productos:",
        error
      );
    });
    expect(
      screen.getByText("No hay productos con stock crítico en este momento.")
    ).toBeInTheDocument();
  });
});