import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import i18n from "../../i18n";
import { colors } from "../../config/colors";

const SwitcherContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: ${colors.cardBackground};
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
`;

const Label = styled.div`
  font-weight: bold;
  color: ${colors.primary};
`;

const Select = styled.select`
  padding: 4px;
  border-radius: 3px;
  border: 1px solid ${colors.border};
  background-color: white;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const DevBadge = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  background-color: #ff5722;
  color: white;
  font-size: 9px;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
`;

/**
 * A language switcher component that only appears in development mode
 */
export const LanguageSwitcher: React.FC = () => {
  const isDev = import.meta.env.DEV;
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Update local state when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLang(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  if (!isDev) return null;

  const languages = {
    English: "English",
    German: "German",
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;

    // Update both i18n and the preference
    i18n.changeLanguage(newLang);

    // If preferences exist, update them too (helps with testing)
    if (window.preferences) {
      window.preferences.localeId = newLang;
    }
  };

  return (
    <SwitcherContainer>
      <DevBadge>DEV</DevBadge>
      <Label>Language</Label>
      <Select value={currentLang} onChange={handleLanguageChange}>
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Select>
    </SwitcherContainer>
  );
};
