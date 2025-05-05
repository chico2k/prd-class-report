// Color configuration
import { darken, lighten, rgba, adjustHue, transparentize } from "polished";
import config from "./index";

// Get the primary and secondary colors based on build target
// Use environment variables if defined, otherwise use config
let PRIMARY_COLOR = config.lvr.colors.primary;
let SECONDARY_COLOR = config.lvr.colors.secondary;

// Try to use the injected environment variables from Vite if available
try {
  if (typeof __PRIMARY_COLOR__ !== "undefined") {
    PRIMARY_COLOR = __PRIMARY_COLOR__;
  }
  if (typeof __SECONDARY_COLOR__ !== "undefined") {
    SECONDARY_COLOR = __SECONDARY_COLOR__;
  }
} catch {
  // Fall back to config values if environment variables aren't available
  console.log("Using config values for colors");
}

// Base colors that need to be specified
const baseColors = {
  primary: PRIMARY_COLOR,
  secondary: SECONDARY_COLOR,

  // Status colors (these are kept as explicit values since they have specific meanings)
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#17a2b8",
};

// Function to generate derived colors
function generateColorPalette(primaryColor: string, secondaryColor: string) {
  return {
    // Primary variants
    primary: primaryColor,
    primaryDark: darken(0.1, primaryColor),
    primaryLight: lighten(0.55, primaryColor),
    primaryHover: darken(0.05, primaryColor),

    primarySelected: baseColors.success, // Using success color for selected state
    primarySelectedBg: lighten(0.55, primaryColor),

    // Secondary variants
    secondary: secondaryColor,
    secondaryDark: darken(0.1, secondaryColor),
    secondaryLight: lighten(0.3, secondaryColor),

    // Text colors
    textPrimary: darken(0.1, primaryColor),
    textSecondary: secondaryColor,
    textLight: lighten(0.2, secondaryColor),

    // Borders and backgrounds
    border: lighten(0.3, secondaryColor),
    borderLight: lighten(0.35, secondaryColor),
    background: lighten(0.4, secondaryColor),
    cardBackground: "#ffffff", // White stays white

    // Status colors
    success: baseColors.success,
    danger: baseColors.danger,
    warning: baseColors.warning,
    info: baseColors.info,
  };
}

// Generate the full color palette
export const colors = generateColorPalette(
  baseColors.primary,
  baseColors.secondary
);

// Helper function to access colors with transparency
export function getColorWithOpacity(
  colorName: keyof typeof colors,
  opacity: number
): string {
  const color = colors[colorName];
  return rgba(color, opacity);
}

// Additional color utilities
export const colorUtils = {
  // Get a lighter version of any color
  lighten: (color: string, amount = 0.2) => lighten(amount, color),

  // Get a darker version of any color
  darken: (color: string, amount = 0.2) => darken(amount, color),

  // Adjust the hue of a color (shifts color on the color wheel)
  adjustHue: (color: string, degrees: number) => adjustHue(degrees, color),

  // Make a color transparent
  transparentize: (color: string, amount: number) =>
    transparentize(amount, color),
};
