import React, { useEffect, useState } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

function RootComponent() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setIsMobile(isPortrait);
    };

    // Initial check
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  if (!isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#203337]">
        <h1 className="text-[#faeed7] font-mono text-center text-2xl">
          Bloomscroll does not currently support desktop. Please visit on your phone!
        </h1>
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>
);
