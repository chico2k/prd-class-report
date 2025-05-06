import { create } from "zustand";
import { Labels } from "../types/indes";
import { devtools } from "zustand/middleware";
import { isPreview, isProduction } from "../helpers";

// This import path will be replaced with an empty module in production builds
// See vite.config.ts where "src/mockData" is aliased to "src/utils/mock-empty.ts"

// Load labels immediately based on environment
const loadInitialLabels = async (): Promise<Labels | null> => {
  // In development or preview mode, load mock data
  if (import.meta.env.DEV && isPreview()) {
    try {
      // Using dynamic import that will be properly handled by Vite's build process
      // Note: Vite doesn't use webpack-specific directives
      const labelsModule = await import(
        /* @vite-ignore */
        "../mockData/labels"
      );

      return labelsModule.labels;
    } catch (error) {
      console.error("Failed to load mock labels:", error);
      return null;
    }
  }
  // In production, only use window.labels
  return window.labels || null;
};

type LabelState = {
  labels: Labels | null;
  isLoading: boolean;
  setLabels: (labels: Labels) => void;
  getSFlabel: (label: string) => string;
};

export const useLabelStore = create<LabelState>()(
  devtools((set, get) => ({
    labels: null,
    isLoading: true,
    setLabels: (labels: Labels) => set({ labels, isLoading: false }),
    getSFlabel: (label: string) => {
      const state = get();
      if (state.isLoading || !state.labels) {
        return label;
      }

      return state.labels[label] || label;
    },
  }))
);

// Initialize labels automatically
(async () => {
  try {
    const initialLabels = await loadInitialLabels();
    if (isProduction()) {
      delete window.labels;
    }
    if (initialLabels) {
      useLabelStore.getState().setLabels(initialLabels);
    }
  } catch (error) {
    console.error("Error initializing label store:", error);
  }
})();
