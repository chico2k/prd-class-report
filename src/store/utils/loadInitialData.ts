import { isPreview } from "../../helpers";

// Load data immediately based on environment
export const loadInitialData = async () => {
  // In development or preview mode, load mock data
  if (import.meta.env.DEV && isPreview()) {
    try {
      // Using dynamic import that will be properly handled by Vite's build process
      // Note: Vite doesn't use webpack-specific directives
      const dataModule = await import(
        /* @vite-ignore */
        "../../mockData/data"
      );

      const labelsModule = await import(
        /* @vite-ignore */
        "../../mockData/labels"
      );

      const preferencesModule = await import(
        /* @vite-ignore */
        "../../mockData/preferences"
      );

      return {
        data: dataModule.mookData,
        labels: labelsModule.labels,
        preferences: preferencesModule.preferencesMock,
      };
    } catch {
      return null;
    }
  }
  // In production, only use window.data
  return {
    data: window.data,
    labels: window.labels,
    preferences: window.preferences,
  };
};
