const isProduction = () => {
  return window.environment === "production";
};

const isPreview = () => {
  return window.environment === "preview";
};

export { isProduction, isPreview };
