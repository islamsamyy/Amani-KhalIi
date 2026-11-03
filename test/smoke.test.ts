import { describe, it, expect } from "vitest";

describe("Smoke Test", () => {
  it("vitest is running successfully in jsdom environment", () => {
    expect(1 + 1).toBe(2);
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });
});
