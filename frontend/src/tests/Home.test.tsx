import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import Home from "../pages/Home";

describe("Home Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the public hero section when not logged in", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText("Welcome to TripSaver")).toBeInTheDocument();
    expect(
      screen.getByText(/Discover incredible products/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Sign In/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i }),
    ).toBeInTheDocument();
  });

  it("renders the Dashboard when a token exists in localStorage", () => {
    localStorage.setItem("token", "valid-token");

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText(/You are successfully logged in/i),
    ).toBeInTheDocument();
  });
});
