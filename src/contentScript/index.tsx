import React from "react";
import { createRoot } from "react-dom/client";
import ContentScript from "./contentScript";

function init() {
  const appContainer = document.createElement("div");
  appContainer.id = "app-container";
  if (!appContainer) {
    throw new Error("Failed to create app container");
  }
  const body = document.body as HTMLElement;
  body.style.zIndex = "0";

  // Create a new <style> element
  const style = document.createElement("style");

  // Add CSS rules for the universal (*) selector
  style.innerHTML = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    z-index: 0; /* Example style: set z-index to 0 */
  }
`;

  // Append the <style> element to the document's <head>
  document.head.appendChild(style);

  document.body.insertAdjacentElement("beforeend", appContainer);
  const root = createRoot(appContainer);
  console.log("appContainer", appContainer);
  root.render(<ContentScript />);
}

init();
