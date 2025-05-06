import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export const useTranslationUtils = () => {
  const { t, i18n } = useTranslation();

  // Get current language
  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);

  // Manually set a language (this will override preferences)
  const setLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  return {
    t,
    i18n,
    getCurrentLanguage,
    setLanguage,
  };
};
