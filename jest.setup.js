import { preferencesMock } from "./src/mockData/preferences.ts";

// Mock window.preferences for tests
Object.defineProperty(global.window, "preferences", {
  value: preferencesMock,
  writable: true,
});

export default {};
