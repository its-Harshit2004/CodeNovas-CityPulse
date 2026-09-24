/**
 * ZoneMarker — generates a Leaflet DivIcon for each zone's circular status dot.
 *
 * Responsibilities:
 *  - marker color by severity (radial gradient + glow)
 *  - HIGH ALERT: double pulsing ring (#FF000D)
 *  - selected state: white ring + glow
 *  - zone label beneath dot
 *
 * Does NOT determine severity — that comes from the API result.
 */

const MARKER_SIZE = 22; // px diameter

/**
 * Returns a Leaflet DivIcon config object for the given zone.
 */
export function getMarkerConfig(zone, isSelected) {
  const { severity, name } = zone;
  const isHigh = severity === "high";
  const dotSize = isSelected ? MARKER_SIZE + 4 : MARKER_SIZE;
  const wrapSize = dotSize + 16; // room for pulse rings

  // Double pulse rings for HIGH ALERT
  const pulseHtml = isHigh
    ? `
      <div class="pulse-ring" style="width:${dotSize + 12}px;height:${dotSize + 12}px;top:-6px;left:${(wrapSize - dotSize - 12) / 2}px;"></div>
      <div class="pulse-ring-2" style="width:${dotSize + 20}px;height:${dotSize + 20}px;top:-10px;left:${(wrapSize - dotSize - 20) / 2}px;"></div>
    `
    : "";

  const html = `
    <div class="zone-marker" title="${escapeName(name)} — ${severityLabel(severity)}">
      <div class="zone-dot-wrapper" style="position:relative;width:${wrapSize}px;height:${dotSize}px;">
        ${pulseHtml}
        <div
          class="zone-dot severity-${severity}${isSelected ? " selected" : ""}"
          style="width:${dotSize}px;height:${dotSize}px;position:absolute;left:${(wrapSize - dotSize) / 2}px;top:0;"
          role="button"
          tabindex="0"
          aria-label="${escapeName(name)}: ${severityLabel(severity)}"
          aria-pressed="${isSelected}"
        ></div>
      </div>
      <span class="zone-label">${escapeName(name)}</span>
    </div>
  `;

  return {
    html,
    className: "",
    iconSize: [wrapSize, dotSize + 20],
    iconAnchor: [wrapSize / 2, dotSize / 2],
  };
}

function severityLabel(severity) {
  switch (severity) {
    case "normal":  return "Normal";
    case "medium":  return "Medium Alert";
    case "high":    return "High Alert";
    case "no_data": return "No Data";
    default:        return "Unknown";
  }
}

function escapeName(name) {
  return String(name)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
