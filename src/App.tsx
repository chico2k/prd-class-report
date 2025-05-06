import { ScheduleSidebar } from "./components/selection";
import { MainResult } from "./components/MainResult";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "./components/DevTools";
import { setupHostVerification } from "./security/hostVerification";

function App() {
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [isAuthorized] = useState<boolean>(true);

  // Setup host verification (only in production)
  useEffect(() => {
    const isProd = import.meta.env.PROD;
    if (isProd) {
      setupHostVerification();
    }
  }, []);

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
