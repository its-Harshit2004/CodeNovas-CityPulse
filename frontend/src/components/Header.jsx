/**
 * Header — compact dark control-room header.
 * Left:  CITYPULSE brand + subtitle
 * Right: LIVE indicator + last updated time + dark/light mode toggle
 */
import { Sun, Moon } from "lucide-react";

export function Header({ lastUpdated, isLive, darkMode, onToggleTheme }) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  return (
    <header className="header" role="banner">
      {/* ── Left: Brand ───────────────────────────────── */}
      <div className="header-left">
        <div className="header-brand">
          <h1 className="header-logo">
            CITY<span className="cp-pulse">PULSE</span>
          </h1>
          <p className="header-subtitle">Live Civic Health Dashboard</p>
        </div>
      </div>

      {/* ── Right: Status + Toggle ─────────────────────── */}
      <div className="header-right">
        {isLive && (
          <div
            className="live-indicator"
            role="status"
            aria-label="Dashboard is receiving live data"
          >
            <div className="live-dot" aria-hidden="true" />
            Live
          </div>
        )}

        {formattedTime && (
          <div className="last-updated-wrapper" aria-label={`Last updated at ${formattedTime}`}>
            <span className="last-updated-label">Last updated</span>
            <span className="last-updated-time">{formattedTime}</span>
          </div>
        )}

        <div className="header-divider" aria-hidden="true" />

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
