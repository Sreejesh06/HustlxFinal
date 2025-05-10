import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Explicitly add error handling to root rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>EmpowerHer</h1><p>Application failed to load. Please refresh the page.</p></div>';
} else {
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme="light" storageKey="empowerher-theme">
          <App />
        </ThemeProvider>
      </React.StrictMode>
    );
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Error rendering the application:", error);
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>EmpowerHer</h1><p>Application encountered an error. Please refresh the page.</p></div>';
  }
}
