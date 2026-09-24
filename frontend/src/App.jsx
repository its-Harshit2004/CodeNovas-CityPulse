import { useState, useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import "./index.css";

export default function App() {
  // Dark mode is the default (control-room aesthetic)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("citypulse-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("citypulse-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Dashboard darkMode={darkMode} onToggleTheme={() => setDarkMode((d) => !d)} />
  );
}
