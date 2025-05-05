import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "path";
import fs from "fs";
import path from "path";
import config from "./src/config";

// Domain encoding helper for build time
const encodeDomain = (domain: string): string => {
  return domain
    .split("")
    .map((c) => String.fromCharCode(c.charCodeAt(0) - 3))
    .join("");
};

// Generate encoded domains for security based on the config
const getEncodedDomains = (isProd: boolean, domains: string[]) => {
  // Encode all domains for security
  const encodedDomains = [...domains, "localhost", "127.0.0.1"].map(
    (domain) => {
      const encoded = encodeDomain(domain);
      // Only log in development mode
      if (!isProd) {
        console.log(`Encoded ${domain} → ${encoded}`);
      }
      return encoded;
    }
  );

  return encodedDomains;
};

// Helper to ensure the output directory exists
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const isProd = mode === "production";
  const isLVRBuild =
    process.env.BUILD_TARGET === "lvr" || !process.env.BUILD_TARGET;

  // Get domains from config
  const domains = isLVRBuild ? config.lvr.domains : [];

  // Generate encoded domains
  const encodedDomains = getEncodedDomains(isProd, domains);

  // Set build output directory
  const outDir = isLVRBuild
    ? "dist/lvr"
    : `dist/${process.env.BUILD_TARGET || "default"}`;

  // Ensure the output directory exists
  if (isProd && command === "build") {
    ensureDirectoryExists(outDir);
  }

  // Create a build-specific config file with the target's settings
  const createBuildConfig = () => {
    if (isProd && command === "build") {
      const buildTarget = process.env.BUILD_TARGET || "lvr";
      // Type-safe check for the target config
      if (buildTarget === "lvr") {
        const targetConfig = config.lvr;
        const configJson = JSON.stringify(targetConfig, null, 2);
        const configDir = path.join(outDir, "config");
        ensureDirectoryExists(configDir);
        fs.writeFileSync(path.join(configDir, "build-config.json"), configJson);
      } else if (buildTarget in config) {
        // Handle other build targets if they are added to the config in the future
        const targetConfig = (config as Record<string, any>)[buildTarget];
        const configJson = JSON.stringify(targetConfig, null, 2);
        const configDir = path.join(outDir, "config");
        ensureDirectoryExists(configDir);
        fs.writeFileSync(path.join(configDir, "build-config.json"), configJson);
      }
    }
  };

  // Create the config file when building
  if (isProd && command === "build") {
    createBuildConfig();
  }

  return {
    plugins: [react(), viteSingleFile()],
    build: {
      outDir,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isProd, // Remove console.log in production
          dead_code: true,
        },
        mangle: {
          // Especially mangle security-related functions
          reserved: ["App", "React"], // Keep important names readable
          properties: {
            regex: /^_/, // Only mangle properties starting with underscore
          },
        },
        format: {
          // Make the code harder to read and modify
          beautify: false,
          comments: false,
        },
      },
      rollupOptions: {
        // Exclude mockData from the build using multiple strategies
        external: [/^src\/mockData\//],
        // Tree-shake away unused mock data imports
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
        },
      },
    },
    define: {
      // Replace these strings at build time with random values
      // This makes it harder to identify critical constants
      __DOMAIN_SALT__: JSON.stringify(
        isProd ? Math.random().toString(36).substring(2, 15) : "dev_salt"
      ),
      __SECURITY_ENABLED__: isProd,
      // Add a define var for all allowed domains
      __ENCODED_DOMAINS__: JSON.stringify(encodedDomains),
      // Add the target-specific configuration
      __BUILD_TARGET__: JSON.stringify(
        isLVRBuild ? "lvr" : process.env.BUILD_TARGET
      ),
      __PRIMARY_COLOR__: JSON.stringify(
        isLVRBuild ? config.lvr.colors.primary : "#357951"
      ),
      __SECONDARY_COLOR__: JSON.stringify(
        isLVRBuild ? config.lvr.colors.secondary : "#6c757d"
      ),
    },
    resolve: {
      alias: {
        // In production builds, replace all imports of mockData with empty modules
        ...(isProd && {
          "src/mockData": resolve(__dirname, "src/utils/mock-empty.ts"),
        }),
      },
    },
  };
});
