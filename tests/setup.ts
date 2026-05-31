import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

// localStorage shim for jsdom (already provided, but ensure clean state per test)
beforeEach(() => {
  localStorage.clear();
});
