import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Usuarios from "../Admin/Usuarios/usuarios";
import HistorialCompra from "../Admin/Usuarios/historialCompra";
import EditarUsuario from "../Admin/Usuarios/editarUsuario";
import Login from "../Tienda/Login/login";
import Registro from "../Tienda/Login/registro";

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

const responder = (data, ok = true) =>
  Promise.resolve({ ok, json: () => Promise.resolve(data) });

beforeEach(() => {
  navigateMock.mockClear();
  localStorage.clear();
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/*Vista Usuarios (usuarios.jsx) - funcion eliminarUsuario*/
describe("Vista Usuarios - funcion eliminarUsuario", () => {
  const usuariosMock = [
    {
      id: 1,
      rut: "12345678K",
      nombre: "Ana",
      apellido: "Pérez",
      correo: "ana@duoc.cl",
      telefono: "912345678",
      region: "metropolitana",
      comuna: "Santiago",
      rol: "cliente",
    },
    {
      id: 2,
      rut: "87654321K",
      nombre: "Luis",
      apellido: "Soto",
      correo: "luis@gmail.com",
      telefono: "987654321",
      region: "valparaiso",
      comuna: "Viña del Mar",
      rol: "admin",
    },
  ];

  const crearFetch = (respuestaDelete = { ok: true }) =>
    vi.fn((url, options) => {
      if (options?.method === "DELETE") return responder(respuestaDelete);
      return responder({ ok: true, usuarios: usuariosMock });
    });

  const renderizar = () =>
    render(
      <MemoryRouter>
        <Usuarios />
      </MemoryRouter>
    );

  it("elimina al usuario de la tabla cuando se acepta el modal", async () => {
    const fetchMock = crearFetch({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderizar();
    expect(await screen.findByText("Ana")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    await user.click(screen.getByRole("button", { name: "Aceptar" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/usuarios/1", {
        method: "DELETE",
      });
      expect(screen.queryByText("Ana")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Luis")).toBeInTheDocument();
  });

  it("no llama al backend si se cancela el modal", async () => {
    const fetchMock = crearFetch();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderizar();
    await screen.findByText("Ana");

    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("muestra una alerta y mantiene al usuario si el servidor responde error", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({ ok: false, error: "No se puede eliminar" })
    );
    const user = userEvent.setup();

    renderizar();
    await screen.findByText("Ana");

    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    await user.click(screen.getByRole("button", { name: "Aceptar" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("No se puede eliminar");
    });
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });
});

/*Vista HistorialCompra (historialCompra.jsx) - calculo de cantidadProductos*/
describe("Vista HistorialCompra - calculo de cantidad de productos", () => {
  const crearFetch = (respuestaCompras) =>
    vi.fn((url) => {
      if (url === "/api/usuarios/5") {
        return responder({ ok: true, usuario: { id: 5, nombre: "Ana" } });
      }
      return responder(respuestaCompras);
    });

  const renderizar = () =>
    render(
      <MemoryRouter initialEntries={["/historialCompra/5"]}>
        <Routes>
          <Route path="/historialCompra/:id" element={<HistorialCompra />} />
        </Routes>
      </MemoryRouter>
    );

  it("suma las cantidades de los items de cada compra", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({
        ok: true,
        compras: [
          {
            id: 101,
            fecha: "2026-03-15T12:00:00",
            items: [{ cantidad: 2 }, { cantidad: 3 }],
            total: 45990,
          },
        ],
      })
    );

    renderizar();

    expect(await screen.findByText("5 productos")).toBeInTheDocument();
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.getByText("$45.990")).toBeInTheDocument();
  });

  it("usa 1 producto (singular) cuando la compra no trae items", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch({
        ok: true,
        compras: [{ id: 102, fecha: "2026-04-01T12:00:00", total: 9990 }],
      })
    );

    renderizar();

    expect(await screen.findByText("1 producto")).toBeInTheDocument();
  });

  it("muestra el mensaje de sin compras cuando la lista está vacia", async () => {
    vi.stubGlobal("fetch", crearFetch({ ok: true, compras: [] }));

    renderizar();

    expect(
      await screen.findByText("El usuario no ha realizado compras.")
    ).toBeInTheDocument();
  });

  it("muestra error si el backend no entrega las compras", async () => {
    vi.stubGlobal("fetch", crearFetch({ ok: false }));

    renderizar();

    expect(
      await screen.findByText("No se pudieron obtener las compras del usuario.")
    ).toBeInTheDocument();
  });
});

/*Vista EditarUsuario (editarUsuario.jsx) - handleChange y handleSubmit*/
describe("Vista EditarUsuario - handleChange y handleSubmit", () => {
  const usuarioMock = {
    id: 7,
    nombre: "Ana",
    apellido: "Pérez",
    rut: "12345678K",
    correo: "ana@duoc.cl",
    telefono: "912345678",
    rol: "cliente",
    region: "metropolitana",
    comuna: "Santiago",
  };

  const crearFetch = (respuestaPut = { ok: true }) =>
    vi.fn((url, options) => {
      if (options?.method === "PUT") return responder(respuestaPut);
      return responder({ ok: true, usuario: usuarioMock });
    });

  const renderizar = () =>
    render(
      <MemoryRouter initialEntries={["/editarUsuario/7"]}>
        <Routes>
          <Route path="/editarUsuario/:id" element={<EditarUsuario />} />
        </Routes>
      </MemoryRouter>
    );

  it("handleChange: actualiza el campo nombre mientras se escribe", async () => {
    vi.stubGlobal("fetch", crearFetch());
    const user = userEvent.setup();

    renderizar();
    const inputNombre = await screen.findByDisplayValue("Ana");

    await user.clear(inputNombre);
    await user.type(inputNombre, "Carla");

    expect(screen.getByDisplayValue("Carla")).toBeInTheDocument();
  });

  it("handleSubmit: envia el PUT con los datos editados y vuelve a /usuarios", async () => {
    const fetchMock = crearFetch({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderizar();
    const inputNombre = await screen.findByDisplayValue("Ana");
    await user.clear(inputNombre);
    await user.type(inputNombre, "Carla");
    await user.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/usuarios");
    });

    const llamadaPut = fetchMock.mock.calls.find(
      ([, options]) => options?.method === "PUT"
    );
    expect(llamadaPut[0]).toBe("/api/usuarios/7");
    expect(JSON.parse(llamadaPut[1].body).nombre).toBe("Carla");
    expect(window.alert).toHaveBeenCalledWith("Usuario actualizado con exito");
  });

  it("handleSubmit: muestra el error del servidor y no navega", async () => {
    vi.stubGlobal("fetch", crearFetch({ ok: false, error: "RUT duplicado" }));
    const user = userEvent.setup();

    renderizar();
    await screen.findByDisplayValue("Ana");
    await user.click(screen.getByRole("button", { name: "Actualizar" }));

    expect(await screen.findByText("RUT duplicado")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});

/*Vista Login (login.jsx) - función handleSubmit*/
describe("Vista Login - función handleSubmit", () => {
  const crearFetch = (ok, body) => vi.fn(() => responder(body, ok));

  const completarFormulario = async (user, correo, contrasena) => {
    if (correo) await user.type(screen.getByLabelText("Correo"), correo);
    if (contrasena)
      await user.type(screen.getByLabelText("Contraseña"), contrasena);
    await user.click(screen.getByRole("button", { name: "Iniciar Sesion" }));
  };

  it("muestra error si hay campos vacios y no llama al backend", async () => {
    const fetchMock = crearFetch(true, {});
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<Login />);
    await completarFormulario(user, "", "");

    expect(
      await screen.findByText("Todos los campos son obligatorios")
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("redirige a /dashboard y guarda la sesion si el usuario es admin", async () => {
    const usuario = { correo: "admin@duoc.cl", rol: "admin" };
    vi.stubGlobal("fetch", crearFetch(true, { ok: true, usuario }));
    const user = userEvent.setup();

    render(<Login />);
    await completarFormulario(user, "admin@duoc.cl", "1234");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });
    expect(JSON.parse(localStorage.getItem("usuario"))).toEqual(usuario);
  });

  it("redirige a /home si el usuario es cliente", async () => {
    const usuario = { correo: "ana@gmail.com", rol: "cliente" };
    vi.stubGlobal("fetch", crearFetch(true, { ok: true, usuario }));
    const user = userEvent.setup();

    render(<Login />);
    await completarFormulario(user, "ana@gmail.com", "1234");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/home");
    });
  });

  it("muestra el error del servidor si las credenciales son invvlidas", async () => {
    vi.stubGlobal(
      "fetch",
      crearFetch(false, { ok: false, error: "Credenciales invalidas" })
    );
    const user = userEvent.setup();

    render(<Login />);
    await completarFormulario(user, "ana@gmail.com", "9999");

    expect(await screen.findByText("Credenciales invalidas")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(localStorage.getItem("usuario")).toBeNull();
  });
});

/*Vista Registro (registro.jsx) - funcion registro (envio del formulario)*/
describe("Vista Registro - funcion registro (envio del formulario)", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  const crearFetch = (ok, body) => vi.fn(() => responder(body, ok));

  const completarFormulario = async (user) => {
    await user.type(screen.getByPlaceholderText("Nombre"), "Ana");
    await user.type(screen.getByPlaceholderText("Apellido"), "Pérez");
    await user.type(screen.getByPlaceholderText("RUT 12345678K"), "12345678K");
    await user.type(
      screen.getByPlaceholderText("Correo Electronico"),
      "ana@duoc.cl"
    );
    await user.type(screen.getByPlaceholderText("Contraseña"), "1234");
    await user.type(screen.getByPlaceholderText("Confirmar Contraseña"), "1234");
    await user.type(screen.getByPlaceholderText("Telefono"), "912345678");
    await user.selectOptions(screen.getByRole("combobox"), "metropolitana");
    await user.type(screen.getByPlaceholderText("Comuna"), "Santiago");
  };

  it("envia los datos del formulario por POST y redirige a /login", async () => {
    const fetchMock = crearFetch(true, { message: "Usuario registrado" });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<Registro />);
    await completarFormulario(user);
    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/registro");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toMatchObject({
      nombre: "Ana",
      apellido: "Pérez",
      rut: "12345678K",
      correo: "ana@duoc.cl",
      region: "metropolitana",
      comuna: "Santiago",
    });
    expect(window.alert).toHaveBeenCalledWith("Usuario registrado");
  });

  it("muestra el error del servidor y no redirige", async () => {
    vi.stubGlobal("fetch", crearFetch(false, { error: "El correo ya existe" }));
    const user = userEvent.setup();

    render(<Registro />);
    await completarFormulario(user);
    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("El correo ya existe");
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("no envia nada si el formulario esta incompleto", async () => {
    const fetchMock = crearFetch(true, {});
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<Registro />);
    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    expect(fetchMock).not.toHaveBeenCalled();
  });
});