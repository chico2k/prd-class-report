import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en";
import deTranslations from "./locales/de";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    English: {
      translation: enTranslations,
    },
    German: {
      translation: deTranslations,
    },
    // Add more languages as needed
  },
  lng: "English", // Start with English, we'll update immediately in App.tsx
  fallbackLng: "English",
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
  react: {
    useSuspense: false, // Recommended for simpler setup
  },
});

// Function to update language when preferences change
export const updateLanguage = (localeId: string) => {
  if (i18n.language !== localeId) {
    i18n.changeLanguage(localeId);
  }
  return localeId;
};

export default i18n;
