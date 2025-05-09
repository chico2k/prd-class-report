import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./i18n"; // Import i18n configuration
import {
  verifyHost,
  setupHostVerification,
  displayReportUnavailable,
} from "./security/hostVerification";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// Import the generated route tree

import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Verify host before rendering app (immediate check)
const isProd = import.meta.env.PROD;
let shouldRender = true;

// Debug parameter - set to true to test the report unavailable screen
const FORCE_DEBUG_DISPLAY = new URLSearchParams(window.location.search).has(
  "debugReport"
);

if (FORCE_DEBUG_DISPLAY) {
  shouldRender = false;
  displayReportUnavailable();
} else if (isProd && !verifyHost()) {
  // If verification fails in production, don't render the app
  shouldRender = false;
  displayReportUnavailable();
}

// Only render if we passed the verification
if (shouldRender) {
  const rootElement = document.getElementById("root")!;
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    );
  }

  // Set up periodic verification if we passed the initial check
  if (isProd) {
    setupHostVerification();
  }
}
