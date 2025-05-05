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
export const updateLanguage = () => {
  const currentLang = window.preferences?.localeId || "English";
  if (i18n.language !== currentLang) {
    console.log(`Changing language from ${i18n.language} to ${currentLang}`);
    i18n.changeLanguage(currentLang);
  }
  return currentLang;
};

export default i18n;
