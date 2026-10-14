import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Compras from "../Tienda/Comprar/compras";
import CompraExito from "../Tienda/Comprar/compraExito";
import CompraFallo from "../Tienda/Comprar/compraFallo";
import { CarritoContext } from "../Tienda/Carrito/Carrito";

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../Carrito/Carrito", async () => {
  const { createContext } = await import("react");
  return { CarritoContext: createContext(null) };
});

const html2pdfMock = vi.hoisted(() => {
  const cadena = { set: vi.fn(), from: vi.fn(), save: vi.fn() };
  const funcion = vi.fn();
  return { cadena, funcion };
});

vi.mock("html2pdf.js", () => ({ default: html2pdfMock.funcion }));

const responder = (data) =>
  Promise.resolve({ json: () => Promise.resolve(data) });

beforeEach(() => {
  navigateMock.mockClear();
  localStorage.clear();
  html2pdfMock.funcion.mockReset().mockReturnValue(html2pdfMock.cadena);
  html2pdfMock.cadena.set.mockReset().mockReturnValue(html2pdfMock.cadena);
  html2pdfMock.cadena.from.mockReset().mockReturnValue(html2pdfMock.cadena);
  html2pdfMock.cadena.save.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/*Vista Compras (compras.jsx) - función submit*/
describe("Vista Compras - función submit", () => {
  const carritoMock = [
    { id: 1, nombre: "Disco A", imagen: "/img/a.jpg", precio: 15990, cantidad: 2 },
  ];

  const crearFetch = (respuestaCompra) =>
    vi.fn((url, options) =>
      options?.method === "POST" ? responder(respuestaCompra) : responder({ ok: false })
    );

  const renderizar = () =>
    render(
      <MemoryRouter>
        <CarritoContext.Provider
          value={{
            carrito: carritoMock,
            costoTotal: 31980,
            totalProductos: 2,
            limpiarCarrito: vi.fn(),
          }}
        >
          <Compras />
        </CarritoContext.Provider>
      </MemoryRouter>
    );

  const completarFormulario = async (user) => {
    await user.type(screen.getByPlaceholderText("Correo Electrónico"), "ana@duoc.cl");
    await user.type(screen.getByPlaceholderText("Nombre"), "Ana");
    await user.type(screen.getByPlaceholderText("Apellido"), "Pérez");
    await user.type(screen.getByPlaceholderText("Teléfono"), "912345678");
    await user.type(screen.getByPlaceholderText("Calle"), "Av. Siempre Viva 123");
    await user.selectOptions(screen.getByRole("combobox"), "metropolitana");
    await user.type(screen.getByPlaceholderText("Comuna"), "Santiago");
    await user.click(screen.getByRole("button", { name: "Pagar $31.980" }));
  };

  it("envia los datos, el total y el carrito, y va a /compraExito si la compra es exitosa", async () => {
    const fetchMock = crearFetch({ ok: true, compra_id: 55 });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderizar();
    await completarFormulario(user);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/compraExito", {
        state: { compraId: 55 },
      });
    });

    const [url, options] = fetchMock.mock.calls.find(
      ([, opciones]) => opciones?.method === "POST"
    );
    expect(url).toBe("/api/compras");
    const cuerpo = JSON.parse(options.body);
    expect(cuerpo).toMatchObject({
      correo: "ana@duoc.cl",
      nombre: "Ana",
      calle: "Av. Siempre Viva 123",
      region: "metropolitana",
      comuna: "Santiago",
      total: 31980,
    });
    expect(cuerpo.productos).toEqual(carritoMock);
  });

  it("va a /compraFallo con el id y el error si el servidor rechaza la compra", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({ ok: false, compra_id: 77, error: "Pago rechazado" })
    );
    const user = userEvent.setup();

    renderizar();
    await completarFormulario(user);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/compraFallo", {
        state: { compraId: 77, errorMsg: "Pago rechazado" },
      });
    });
  });
});

/*Vista CompraExito (compraExito.jsx) - funcion descargarPDF*/
describe("Vista CompraExito - funcion descargarPDF", () => {
  it("genera el PDF de la boleta con el nombre y las opciones correctas", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        responder({
          ok: true,
          compra: {
            nombre: "Ana",
            apellido: "Pérez",
            correo: "ana@duoc.cl",
            telefono: "912345678",
            calle: "Av. Siempre Viva 123",
            comuna: "Santiago",
            region: "metropolitana",
            total: 31980,
            productos: [{ nombre_producto: "Disco A", precio: 15990, cantidad: 2 }],
          },
        })
      )
    );
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/compraExito", state: { compraId: 55 } }]}
      >
        <CompraExito />
      </MemoryRouter>
    );
    await screen.findByText("Detalle del Pedido");

    await user.click(screen.getByRole("button", { name: "Descargar Boleta en PDF" }));

    expect(html2pdfMock.funcion).toHaveBeenCalledTimes(1);
    expect(html2pdfMock.cadena.set).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: "boleta_compra_55.pdf",
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
    );
    expect(html2pdfMock.cadena.from).toHaveBeenCalledWith(expect.any(HTMLElement));
    expect(html2pdfMock.cadena.save).toHaveBeenCalledTimes(1);
  });
});

/*Vista CompraFallo (compraFallo.jsx) - boton "Volver a Realizar el Pago"*/
describe("Vista CompraFallo - reintento del pago", () => {
  it("va a /compras enviando el id de la compra fallida", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/compraFallo", state: { compraId: 77, errorMsg: "Pago rechazado" } },
        ]}
      >
        <CompraFallo />
      </MemoryRouter>
    );

    expect(screen.getByText("Pago rechazado")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Volver a Realizar el Pago" }));

    expect(navigateMock).toHaveBeenCalledWith("/compras", {
      state: { reintentarCompraId: 77 },
    });
  });
});