import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@/providers/language-provider";
import { SiteHeader } from "../site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("LanguageProvider & LanguageToggle in SiteHeader", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  });

  it("switches between Arabic (RTL) and English (LTR) in SiteHeader and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <SiteHeader onOpenMobileMenu={vi.fn()} />
      </LanguageProvider>
    );

    // Starts in Arabic RTL
    expect(screen.getByText("الرئيسية")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("rtl");

    // Switch to English
    await user.click(screen.getByRole("button", { name: "Switch to English" }));

    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
    expect(localStorage.getItem("amani_lang_v1")).toBe("en");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Book Royal Session")).toBeInTheDocument();
    expect(screen.getByText("عربي")).toBeInTheDocument();

    // Switch back to Arabic
    await user.click(
      screen.getByRole("button", { name: "التبديل إلى اللغة العربية" })
    );

    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem("amani_lang_v1")).toBe("ar");
    expect(screen.getByText("الرئيسية")).toBeInTheDocument();
  });
});
