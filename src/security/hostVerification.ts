// Using Vite's define replacement for better security
// These values are replaced at build time with randomly generated values
const DOMAIN_SALT = __DOMAIN_SALT__ as string;
const SECURITY_ENABLED = __SECURITY_ENABLED__ as boolean;
const ENCODED_DOMAINS = __ENCODED_DOMAINS__ as string[];

// Obfuscation helpers - splits string and rejoins to make static analysis harder
const _x = (s: string) => s.split("").reverse().join("");
const _o = (s: string, n: number) =>
  s
    .split("")
    .map((c) => String.fromCharCode(c.charCodeAt(0) + n))
    .join("");

// Function to encode domains (only used during development)
const _e = (domain: string): string => {
  return _o(domain, -3);
};

// Function to decode domains at runtime
const _d = (encoded: string): string => {
  try {
    return _o(encoded, 3); // Uses the OPPOSITE shift direction (+3) for decoding
  } catch (e) {
    return encoded; // Return original string if decoding fails
  }
};

// Verification options with obfuscated keys
const VERIFICATION_OPTIONS = {
  [_x("lavretnIkcehc")]: 5000, // ms
  [_x("tlaSpsah")]: DOMAIN_SALT, // Will be replaced at build time
};

// Type-safe way to get obfuscated properties
const getObfuscatedProp = <T>(
  obj: Record<string, T>,
  obfuscatedKey: string
): T => {
  return obj[obfuscatedKey];
};

/**
 * Generates a domain-specific hash to embed in API calls
 */
export const getDomainHash = (): string => {
  const domain = window.location.hostname;
  const hashSalt = getObfuscatedProp(
    VERIFICATION_OPTIONS,
    _x("tlaSpsah")
  ) as string;

  // Create a simple hash using the domain and salt
  const hash = domain.split("").reduce((acc, char, i) => {
    return (
      acc +
      char.charCodeAt(0) * (i + 1) * hashSalt.charCodeAt(i % hashSalt.length)
    );
  }, 0);
  return hash.toString(36); // Convert to base36 string
};

/**
 * More resilient hostname matching that handles subdomains
 */
const domainMatches = (allowedDomain: string, currentHost: string): boolean => {
  // Exact match
  if (allowedDomain === currentHost) {
    return true;
  }

  // Support wildcard subdomains (convert yourdomain.com to *.yourdomain.com)
  if (currentHost.endsWith(`.${allowedDomain}`)) {
    return true;
  }

  // Special case for domains with hyphens and subdomains
  if (
    allowedDomain.includes(".") &&
    currentHost.replace(/-/g, "").includes(allowedDomain.replace(/-/g, ""))
  ) {
    return true;
  }

  // Case insensitive match
  if (allowedDomain.toLowerCase() === currentHost.toLowerCase()) {
    return true;
  }

  return false;
};

/**
 * Verifies that the app is running on an allowed domain
 */
export const verifyHost = (): boolean => {
  // Skip in development mode
  if (!SECURITY_ENABLED) {
    return true;
  }

  const currentHost = window.location.hostname;

  // Test direct comparison with encoded values
  const encodedCurrentHost = _e(currentHost);
  for (let i = 0; i < ENCODED_DOMAINS.length; i++) {
    if (ENCODED_DOMAINS[i] === encodedCurrentHost) {
      return true;
    }
  }

  // Decode each domain at runtime and check against current hostname
  for (let i = 0; i < ENCODED_DOMAINS.length; i++) {
    try {
      const decoded = _d(ENCODED_DOMAINS[i]);
      if (domainMatches(decoded, currentHost)) {
        return true;
      }
    } catch (error) {
      // Silent fail and continue checking
    }
  }

  return false;
};

/**
 * Sets up continuous domain verification
 * This makes it harder to simply modify the code once
 */
export const setupHostVerification = (): void => {
  // Skip in development mode
  if (!SECURITY_ENABLED) {
    return;
  }

  // Immediate check
  if (!verifyHost()) {
    displayReportUnavailable();
    return;
  }

  // Set up periodic checking - only verify the hostname
  const intervalId = setInterval(() => {
    const isValid = verifyHost();

    if (!isValid) {
      clearInterval(intervalId);
      displayReportUnavailable();
    }
  }, getObfuscatedProp(VERIFICATION_OPTIONS, _x("lavretnIkcehc")) as number);
};

/**
 * Shows a simple report unavailable message
 */
export const displayReportUnavailable = (): void => {
  try {
    const errorMessage = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; text-align: center; padding: 50px; color: #333; background-color: #f8f8f8; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div style="max-width: 500px; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="margin-top: 0; color: #444;">Report Unavailable</h2>
          <p>This report could not be generated. Please contact your administrator.</p>
        </div>
      </div>
    `;

    // Replace the entire content with the error message
    document.body.innerHTML = errorMessage;
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.classList.add("report-unavailable");
  } catch {
    // Fallback even simpler message if the above fails
    document.body.innerHTML = `
      <div style="padding: 50px; text-align: center; font-family: sans-serif;">
        <h2>Report Unavailable</h2>
        <p>This report could not be generated. Please contact your administrator.</p>
      </div>
    `;
  }
};
