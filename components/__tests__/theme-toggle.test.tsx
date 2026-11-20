import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "../theme-toggle";

describe("ThemeProvider & ThemeToggle (Light / Dark Mode)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-theme");
  });

  it("toggles between light mode and dark mode and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle variant="header" />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole("button", { name: "تفعيل الوضع الداكن" });
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Switch to dark mode
    await user.click(toggleBtn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("amani_theme_v1")).toBe("dark");
    expect(
      screen.getByRole("button", { name: "تفعيل الوضع الفاتح" })
    ).toBeInTheDocument();

    // Switch back to light mode
    await user.click(screen.getByRole("button", { name: "تفعيل الوضع الفاتح" }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("amani_theme_v1")).toBe("light");
  });

  it("hydrates saved dark theme from localStorage on mount", () => {
    localStorage.setItem("amani_theme_v1", "dark");
    render(
      <ThemeProvider>
        <ThemeToggle variant="admin" />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      screen.getByRole("button", { name: "تفعيل الوضع الفاتح" })
    ).toBeInTheDocument();
  });
});
