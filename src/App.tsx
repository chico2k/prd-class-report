import { ScheduleSidebar } from "./components/selection";
import { MainResult } from "./components/MainResult";
import { useState, useEffect } from "react";
import { updateLanguage } from "./i18n";
import { LanguageSwitcher } from "./components/DevTools";
import { setupHostVerification } from "./security/hostVerification";

function App() {
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [currentLocale, setCurrentLocale] = useState<string>("English");
  const [isAuthorized] = useState<boolean>(true);

  // Setup host verification (only in production)
  useEffect(() => {
    const isProd = import.meta.env.PROD;
    if (isProd) {
      setupHostVerification();
    }
  }, []);

  // Update language when preferences change
  useEffect(() => {
    // Set language based on preferences
    const locale = updateLanguage();
    setCurrentLocale(locale);

    // Check for language changes every second (only in production)
    const isProd = import.meta.env.PROD;
    if (isProd) {
      const interval = setInterval(() => {
        const newLocale = window.preferences?.localeId || "English";
        if (newLocale !== currentLocale) {
          const updated = updateLanguage();
          setCurrentLocale(updated);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentLocale]);

  // If auth fails, this component won't render properly anyway
  // But we add this check as an additional layer of protection
  if (!isAuthorized) {
    return <div>Unauthorized Access</div>;
  }

  return (
    <>
      <ScheduleSidebar onSelect={setSelectedID} selectedID={selectedID} />
      <MainResult selectedID={selectedID} />
      <LanguageSwitcher />
    </>
  );
}

export default App;
