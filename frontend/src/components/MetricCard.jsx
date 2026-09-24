/**
 * MetricCard — compact glassmorphic card for a single city-wide metric.
 * Receives: label, value, unit, trend, cardClass, icon component.
 * Does NOT perform any analytics calculations — purely display.
 */

export function MetricCard({ label, value, unit, trend, cardClass, icon: Icon }) {
  const isLoading = value === undefined || value === null;

  return (
    <div
      className={`metric-card ${cardClass || ""}`}
      role="region"
      aria-label={`${label} metric`}
    >
      <div className="metric-label">
        {Icon && (
          <Icon
            className="metric-icon"
            size={12}
            aria-hidden="true"
          />
        )}
        {label}
      </div>

      {isLoading ? (
        <>
          <div className="skeleton skeleton-value" aria-hidden="true" />
          <div className="skeleton skeleton-text" style={{ marginTop: 6 }} aria-hidden="true" />
        </>
      ) : (
        <>
          <div className="metric-value" aria-live="polite">
            {value}
            {unit && <span className="metric-unit">{unit}</span>}
          </div>
          {trend && <div className="metric-trend">{trend}</div>}
        </>
      )}
    </div>
  );
}
