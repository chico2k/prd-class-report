import { create } from "zustand";
import {
  ColumnDefinitions,
  CustomColumns,
  Data,
  Enroll,
  Labels,
  Preferences,
  Sched,
} from "../types/indes";
import { produce } from "immer";
import { loadInitialData } from "./utils/loadInitialData";
import { getDateTime } from "./utils/getDateTime";
import { getFieldValue } from "./utils/getFieldValue";
import { getHeader } from "./utils/getHeader";
import { createColumnDefinition } from "./utils/createColumnDefinition";
import { readColumnDefinitionsToLocalStorage } from "./utils/readColumnDefinitionsToLocalStorage";

type Store = {
  // ___ LOADING ___
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // ___ DATA ___
  data: Data | null;
  setData: (data: Data) => void;
  getSchedById: (schedId: number) => Sched | null;
  getEnrollmentsBySchedId: (schedId: number) => Enroll[];

  // ___ COLUMN DEFINITIONS ___
  columnDefinitions: ColumnDefinitions[];
  createColumnDefinition: () => void;
  getFieldValue: (
    value: string,
    colDef: ColumnDefinitions,
    customColumns: CustomColumns
  ) => string;
  getHeader: (
    label: string,
    colDef: ColumnDefinitions,
    getSFlabel: (label: string) => string
  ) => string;
  getDateTimeVisibleColumns: () => ColumnDefinitions[];
  storeColumnDefinitionsToLocalStorage: () => void;
  setColumnDefinitions: (columnDefinitions: ColumnDefinitions[]) => void;

  // ___ LABELS ___
  labels: Labels | null;
  setLabels: (labels: Labels) => void;
  getSFlabel: (label: string) => string;

  // ___ PREFERENCES ___
  preferences: Preferences | null;
  setPreferences: (preferences: Preferences) => void;
  getDateTime: (rawDate: string) => string;
  setLocaleId: (localeId: string) => void;

  // ___ FILTERS ___
  columnFilters: { [key: string]: string[] };
  setColumnFilters: (filters: { [key: string]: string[] }) => void;
};

export const useStore = create<Store>()((set, get) => ({
  // ___ LOADING ___
  isLoading: true,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  // ___ DATA ___
  data: null,
  setData: (data: Data) => set({ data }),

  // ___ COLUMN DEFINITIONS ___
  createColumnDefinition: () => {
    const { data } = get();
    const columnDefinitions = createColumnDefinition(data);
    const updatedColDef =
      readColumnDefinitionsToLocalStorage(columnDefinitions);
    set({ columnDefinitions: updatedColDef });
  },
  getFieldValue: (value: string, colDef: ColumnDefinitions) => {
    const { data } = get();
    if (!data?.customColumns) return "";
    return getFieldValue(value, colDef, data?.customColumns);
  },
  getHeader: (label: string, colDef: ColumnDefinitions) => {
    const { getSFlabel } = get();
    return getHeader(label, colDef, getSFlabel);
  },
  columnDefinitions: [],
  getDateTimeVisibleColumns: () => {
    const { columnDefinitions } = get();
    return columnDefinitions.filter((col) => col.visible);
  },
  setColumnDefinitions: (columnDefinitions: ColumnDefinitions[]) => {
    set({ columnDefinitions });
    get().storeColumnDefinitionsToLocalStorage();
  },
  storeColumnDefinitionsToLocalStorage: () => {
    const { columnDefinitions } = get();

    const storage = {
      "report-sched": {
        columnDefinitions: columnDefinitions,
      },
    };
    localStorage.setItem("reportPreferences", JSON.stringify(storage));
  },

  // ___ SCHED ___
  getSchedById: (schedId: number) => {
    const { data } = get();
    if (!data?.sched) return null;

    return data.sched.find((sched) => sched.SCHD_ID === schedId) || null;
  },
  getEnrollmentsBySchedId: (schedId: number) => {
    const { data } = get();
    if (!data?.enroll) return [];

    return data.enroll.filter((enrollment) => enrollment.SCHD_ID === schedId);
  },
  labels: null,
  setLabels: (labels: Labels) => set({ labels }),
  getSFlabel: (label: string) => {
    const { labels } = get();
    return labels?.[label] || label;
  },
  preferences: null,
  setLocaleId: (localeId: string) =>
    set(
      produce((state) => {
        state.preferences.localeId = localeId;
      })
    ),
  setPreferences: (preferences: Preferences) => set({ preferences }),
  getDateTime: (rawDate: string) => {
    const { preferences } = get();
    return getDateTime(rawDate, preferences);
  },

  // ___ FILTERS ___
  columnFilters: {},
  setColumnFilters: (filters) => set({ columnFilters: filters }),
}));

(async () => {
  const initialData = await loadInitialData();
  console.log("initialData: ", initialData);
  if (
    initialData &&
    initialData.data &&
    initialData.labels &&
    initialData.preferences
  ) {
    useStore.getState().setData(initialData.data);
    useStore.getState().setLabels(initialData.labels);
    useStore.getState().setPreferences(initialData.preferences);
    useStore.getState().setIsLoading(false);
    useStore.getState().createColumnDefinition();
  }
})();
