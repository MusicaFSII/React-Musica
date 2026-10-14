import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../Admin/Dashboard/dashboard";

const crearFetch = (body) =>
  vi.fn(() => Promise.resolve({ json: () => Promise.resolve(body) }));

const renderizar = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

//tarjetas
describe("Vista Dashboard - carga del total de usuarios y tarjetas", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("muestra el total de usuarios que entrega el backend", async () => {
    const fetchMock = crearFetch({ ok: true, total: 42 });
    vi.stubGlobal("fetch", fetchMock);

    renderizar();

    expect(await screen.findByText("42")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/usuarios/count");
  });

  it("muestra las dos tarjetas de metricas con sus titulos", async () => {
    vi.stubGlobal("fetch", crearFetch({ ok: true, total: 5 }));

    renderizar();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dashboard");
    expect(screen.getByText("Total Productos")).toBeInTheDocument();
    expect(screen.getByText("Total Usuarios")).toBeInTheDocument();
    expect(await screen.findByText("5")).toBeInTheDocument();
  });

  it("mantiene ambas metricas en 0 si el backend responde ok: false", async () => {
    const json = vi.fn(() => Promise.resolve({ ok: false }));
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ json })));

    renderizar();

    await waitFor(() => expect(json).toHaveBeenCalled());
    expect(screen.getAllByText("0")).toHaveLength(2);
  });

  it("registra el error y mantiene las metricas en 0 si falla la conexión", async () => {
    const error = new Error("sin conexion");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(error)));

    renderizar();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error al obtener los usuarios:",
        error
      );
    });
    expect(screen.getAllByText("0")).toHaveLength(2);
  });

  it("muestra las 8 tarjetas de acceso con su ruta correcta", () => {
    vi.stubGlobal("fetch", crearFetch({ ok: true, total: 0 }));

    renderizar();

    const rutas = screen
      .getAllByRole("link")
      .map((enlace) => enlace.getAttribute("href"));

    expect(rutas).toEqual([
      "/dashboard",
      "/ordenes",
      "/productosA",
      "/categoriaA",
      "/usuarios",
      "/reportes",
      "/perfil",
      "/home",
    ]);
  });
});