import css from "../styles.css?raw";

export function injectStyles() {
  // remove all style tag in the dom incluing parent window
  const isProd = import.meta.env.PROD;
  if (isProd) {
    const styleTags = document.querySelectorAll("style");
    styleTags.forEach((style) => {
      style.remove();
    });

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
  return;
}
