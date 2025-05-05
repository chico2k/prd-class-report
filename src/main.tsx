import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n"; // Import i18n configuration
import {
  verifyHost,
  setupHostVerification,
  displayReportUnavailable,
} from "./security/hostVerification";

// Verify host before rendering app (immediate check)
const isProd = import.meta.env.PROD;
let shouldRender = true;

// Debug parameter - set to true to test the report unavailable screen
const FORCE_DEBUG_DISPLAY = new URLSearchParams(window.location.search).has(
  "debugReport"
);

if (FORCE_DEBUG_DISPLAY) {
  console.log("Debug report display forced by URL parameter");
  shouldRender = false;
  displayReportUnavailable();
} else if (isProd && !verifyHost()) {
  // If verification fails in production, don't render the app
  shouldRender = false;
  displayReportUnavailable();
}

// Only render if we passed the verification
if (shouldRender) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Set up periodic verification if we passed the initial check
  if (isProd) {
    setupHostVerification();
  }
}
