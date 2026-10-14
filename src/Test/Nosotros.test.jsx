import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Nosotros from "../Tienda/Nosotros/nosotros";

describe("Vista Nosotros - renderizado de las historias (historias.map)", () => {
  it("muestra las 3 historias y alterna la clase reverse", () => {
    render(
      <MemoryRouter>
        <Nosotros />
      </MemoryRouter>
    );

    expect(screen.getByText("01 / NUESTRA HISTORIA")).toBeInTheDocument();
    expect(screen.getByText("02 / NUESTRA PASIÓN")).toBeInTheDocument();
    expect(screen.getByText("03 / NUESTRA IDENTIDAD")).toBeInTheDocument();

    const titulos = screen
      .getAllByRole("heading", { level: 3 })
      .map((titulo) => titulo.textContent);
    expect(titulos).toEqual([
      "Todo comienza con una canción.",
      "El encanto de lo analógico.",
      "Un ritmo diferente.",
    ]);

    const tarjetas = screen.getAllByRole("article");
    expect(tarjetas).toHaveLength(3);
    expect(tarjetas[0]).not.toHaveClass("reverse");
    expect(tarjetas[1]).toHaveClass("reverse");
    expect(tarjetas[2]).not.toHaveClass("reverse");
  });
});