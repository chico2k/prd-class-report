import { create } from "zustand";
import { Data, Enroll, Sched } from "../types/indes";
import { devtools } from "zustand/middleware";
import { isPreview, isProduction } from "../helpers";

// This import path will be replaced with an empty module in production builds
// See vite.config.ts where "src/mockData" is aliased to "src/utils/mock-empty.ts"

// Load data immediately based on environment
const loadInitialData = async (): Promise<Data | null> => {
  // In development or preview mode, load mock data
  if (import.meta.env.DEV && isPreview()) {
    try {
      // Using dynamic import that will be properly handled by Vite's build process
      // Note: Vite doesn't use webpack-specific directives
      const dataModule = await import(
        /* @vite-ignore */
        "../mockData/data"
      );

      return dataModule.mookData;
    } catch (error) {
      console.error("Failed to load mock data:", error);
      return null;
    }
  }
  // In production, only use window.data
  return window.data || null;
};

type DataState = {
  data: Data | null;
  isLoading: boolean;
  setData: (data: Data) => void;
  // Helper functions for data access
  getSchedById: (schedId: number) => Sched | null;
  getEnrollmentsBySchedId: (schedId: number) => Enroll[];
};

export const useDataStore = create<DataState>()(
  devtools((set, get) => ({
    data: null,
    isLoading: true,
    setData: (data: Data) => set({ data, isLoading: false }),

    // Get a schedule by its ID
    getSchedById: (schedId: number) => {
      const { data } = get();
      if (!data?.sched) return null;

      return data.sched.find((sched) => sched.SCHD_ID === schedId) || null;
    },

    // Get all enrollments for a specific schedule ID
    getEnrollmentsBySchedId: (schedId: number) => {
      const { data } = get();
      if (!data?.enroll) return [];

      return data.enroll.filter((enrollment) => enrollment.SCHD_ID === schedId);
    },
  }))
);

(async () => {
  try {
    const initialData = await loadInitialData();
    if (isProduction()) {
      delete window.data;
    }
    if (initialData) {
      useDataStore.getState().setData(initialData);
    }
  } catch (error) {
    console.error("Error initializing data store:", error);
  }
})();
