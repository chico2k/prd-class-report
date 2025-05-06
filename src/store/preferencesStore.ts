import { create } from "zustand";
import { Preferences } from "../types/indes";
import { formatInTimeZone } from "date-fns-tz";
import { isPreview, isProduction } from "../helpers";
import { updateLanguage } from "../i18n";
import { produce } from "immer";

const formatWithUserPreferences = (
  date: Date,
  datePattern: string,
  timePattern: string | undefined,
  timeZone: string | undefined
): string => {
  // Use date-fns to format the base date and time
  let formatted = formatInTimeZone(date, timeZone || "UTC", datePattern);

  // If time pattern is provided, add it
  if (timePattern) {
    const formattedTime = formatInTimeZone(
      date,
      timeZone || "UTC",
      timePattern
    );

    // Handle capitalization of AM/PM
    const upperCaseTime = formattedTime
      .replace(/am/i, "AM")
      .replace(/pm/i, "PM");

    const tzDisplay = timeZone;

    formatted = `${formatted} ${upperCaseTime} ${tzDisplay}`;
  }

  return formatted;
};

// Load preferences immediately based on environment
const loadInitialPreferences = async (): Promise<Preferences | null> => {
  if (import.meta.env.DEV && isPreview()) {
    try {
      const preferencesModule = await import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        "../mockData/preferences"
      );
      return preferencesModule.preferencesMock;
    } catch (error) {
      console.error("Failed to load mock preferences:", error);
      return null;
    }
  }
  return window.preferences || null;
};

type PreferencesState = {
  preferences: Preferences | null;
  isLoading: boolean;
  setLocaleId: (localeId: string) => void;
  setPreferences: (preferences: Preferences) => void;
  getDateTime: (rawDate: string) => string;
};

export const usePreferencesStore = create<PreferencesState>()((set, get) => ({
  preferences: null,
  isLoading: true,
  setLocaleId: (localeId: string) =>
    set(
      produce((state: PreferencesState) => {
        if (state.preferences) {
          state.preferences.localeId = localeId;
        }
      })
    ),
  setPreferences: (preferences: Preferences) =>
    set(
      produce((state: PreferencesState) => {
        state.preferences = preferences;
        state.isLoading = false;
      })
    ),
  getDateTime: (rawDate: string) => {
    const { preferences } = get();
    const date = new Date(rawDate);
    const userDatePattern = preferences?.datePattern;
    const userTimeZone = preferences?.timeZone;
    const userTimePattern = preferences?.timePattern;

    if (!userDatePattern) {
      return date.toISOString().split("T")[0]; // Default to ISO format if no pattern
    }

    try {
      // Format based on user preferences
      const formattedDate = formatWithUserPreferences(
        date,
        userDatePattern,
        userTimePattern,
        userTimeZone
      );
      return formattedDate;
    } catch {
      return date.toISOString();
    }
  },
}));

// Initialize preferences automatically
(async () => {
  const initialPreferences = await loadInitialPreferences();
  if (isProduction()) {
    delete window.preferences;
  }
  if (initialPreferences) {
    usePreferencesStore.getState().setPreferences(initialPreferences);
    updateLanguage(initialPreferences.localeId);
  }
})();
