/**
 * AlertBanner — bottom bar showing the highest-severity alert across all zones,
 * or a normal status message if no alerts exist.
 *
 * States:
 *  - 🔴 HIGH ALERT — zone name + evidence
 *  - 🟡 CIVIC ALERT — N zones with abnormal conditions
 *  - 🟢 CITY STATUS NORMAL — no anomalies
 */

export function AlertBanner({ zones }) {
  if (!zones || zones.length === 0) return null;

  const highAlertZones   = zones.filter((z) => z.severity === "high");
  const mediumAlertZones = zones.filter((z) => z.severity === "medium");

  // High alert: show the first (most critical) high-alert zone
  if (highAlertZones.length > 0) {
    const zone = highAlertZones[0];
    const evidenceItems = zone.evidence || [];

    return (
      <div
        className="alert-banner banner-high"
        role="alert"
        aria-live="assertive"
        aria-label={`High alert in ${zone.name}`}
      >
        <div className="banner-severity-dot high" aria-hidden="true" />
        <span className="banner-label high">HIGH ALERT</span>
        <span className="banner-sep" aria-hidden="true" />
        <span className="banner-message">
          {zone.name}
          {zone.correlation?.message ? ` — ${zone.correlation.message}` : ""}
        </span>
        {evidenceItems.length > 0 && (
          <div className="banner-evidence" aria-label="Alert evidence">
            {evidenceItems.map((ev, i) => (
              <span key={i} className="banner-ev-item">• {ev}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Medium alert: aggregate message
  if (mediumAlertZones.length > 0) {
    return (
      <div
        className="alert-banner banner-medium"
        role="alert"
        aria-live="polite"
        aria-label={`${mediumAlertZones.length} zones with medium alert`}
      >
        <div className="banner-severity-dot medium" aria-hidden="true" />
        <span className="banner-label medium">CIVIC ALERT</span>
        <span className="banner-sep" aria-hidden="true" />
        <span className="banner-message">
          {mediumAlertZones.length} zone{mediumAlertZones.length > 1 ? "s" : ""}{" "}
          {mediumAlertZones.length > 1 ? "are" : "is"} showing abnormal conditions.
          {" "}{mediumAlertZones.map((z) => z.name).join(", ")}
        </span>
      </div>
    );
  }

  // All normal
  return (
    <div
      className="alert-banner banner-normal"
      role="status"
      aria-label="City status normal"
    >
      <div className="banner-severity-dot normal" aria-hidden="true" />
      <span className="banner-label normal">CITY STATUS NORMAL</span>
      <span className="banner-sep" aria-hidden="true" />
      <span className="banner-message">No significant civic anomalies detected.</span>
    </div>
  );
}
