/**
 * ZoneDetails — right-side panel showing full analytics for the selected zone.
 *
 * Displays: zone name, severity badge, traffic/rainfall/incidents with baselines,
 * anomaly list, correlation (always "possible"), evidence, timestamp.
 *
 * Does NOT perform any analytics — purely visualises what the API returns.
 */

import { Clock, MapPin } from "lucide-react";

const SEVERITY_LABELS = {
  normal:  "Normal",
  medium:  "Medium Alert",
  high:    "High Alert",
  no_data: "No Data",
};

/* ─── Severity Badge ──────────────────────────────────────────────────────── */
function SeverityBadge({ severity }) {
  const label = SEVERITY_LABELS[severity] || severity;
  return (
    <span
      className={`zone-severity-badge badge-${severity}`}
      role="status"
      aria-label={`Zone status: ${label}`}
    >
      <span className="badge-dot" aria-hidden="true" />
      {label.toUpperCase()}
    </span>
  );
}

/* ─── Single Metric Detail Card ───────────────────────────────────────────── */
function MetricDetailCard({ label, value, unit, baseline, anomalyText }) {
  return (
    <div className="metric-detail">
      <div className="metric-detail-label">{label}</div>
      <div className="metric-detail-value">
        {value ?? "—"}
        {unit && <span className="metric-detail-unit">{unit}</span>}
      </div>
      {baseline !== undefined && baseline !== null && (
        <div className="metric-detail-baseline">Baseline: {baseline}{unit}</div>
      )}
      {anomalyText && (
        <div className="metric-detail-anomaly">⬆ {anomalyText}</div>
      )}
    </div>
  );
}

/* ─── Anomalies ───────────────────────────────────────────────────────────── */
function AnomalySection({ anomalies }) {
  if (!anomalies || anomalies.length === 0) return null;
  return (
    <div className="details-section">
      <div className="details-section-title">Anomalies Detected</div>
      {anomalies.map((a, i) => {
        const pct =
          a.baseline > 0
            ? (((a.current - a.baseline) / a.baseline) * 100).toFixed(1)
            : null;
        return (
          <div key={i} className="anomaly-item" role="alert" aria-label={`${a.metric} anomaly`}>
            <div className="anomaly-metric">{a.metric}</div>
            <div className="anomaly-values">
              {a.current} vs {a.baseline} baseline
              {pct && (
                <span style={{ color: "var(--color-high)", marginLeft: 8, fontWeight: 700 }}>
                  ↑ {pct}% above
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Correlation ─────────────────────────────────────────────────────────── */
function CorrelationSection({ correlation }) {
  if (!correlation?.signals?.length) return null;
  return (
    <div className="details-section">
      <div className="details-section-title">Possible Correlation</div>
      <div className="correlation-block">
        <div className="correlation-signals" aria-label="Correlated signals">
          {correlation.signals.map((sig, i) => (
            <span key={sig} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span className="signal-chip">{sig}</span>
              {i < correlation.signals.length - 1 && (
                <span className="signal-arrow" aria-hidden="true">↓</span>
              )}
            </span>
          ))}
        </div>
        {correlation.message && (
          <p className="correlation-message">"{correlation.message}"</p>
        )}
      </div>
    </div>
  );
}

/* ─── Evidence ────────────────────────────────────────────────────────────── */
function EvidenceSection({ evidence }) {
  if (!evidence || evidence.length === 0) return null;
  return (
    <div className="details-section">
      <div className="details-section-title">Evidence</div>
      <ul className="evidence-list" aria-label="Supporting evidence">
        {evidence.map((item, i) => (
          <li key={i} className="evidence-item">
            <span className="evidence-bullet" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="details-empty" role="status" aria-label="No zone selected">
      <MapPin size={52} className="details-empty-icon" aria-hidden="true" />
      <p className="details-empty-text">
        Click a zone marker on the map to view its civic health status and alert details.
      </p>
      <p className="details-empty-hint">← Select a zone on the map</p>
    </div>
  );
}

/* ─── No-Data State ───────────────────────────────────────────────────────── */
function NoDataState({ zoneName }) {
  return (
    <div className="details-body">
      <div className="details-section">
        <div className="details-section-title">Data Status</div>
        <div className="nodata-block" role="status" aria-label="No data available">
          ⚪ <strong>NO DATA</strong>
          <br />
          Civic health status for <strong>{zoneName}</strong> cannot be determined.
          <br />
          Awaiting data from monitoring sources.
        </div>
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="details-body" aria-busy="true" aria-label="Loading zone details">
      <div className="details-section" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="skeleton" style={{ height: 22, width: "55%" }} />
        <div className="skeleton" style={{ height: 18, width: "38%" }} />
        <div className="skeleton" style={{ height: 72, width: "100%", marginTop: 6 }} />
        <div className="skeleton" style={{ height: 56, width: "100%" }} />
        <div className="skeleton" style={{ height: 56, width: "100%" }} />
      </div>
    </div>
  );
}

/* ─── Main Export ─────────────────────────────────────────────────────────── */
export function ZoneDetails({ zone, loading }) {
  if (!zone && !loading) return <EmptyState />;
  if (loading && !zone)  return <LoadingSkeleton />;
  if (!zone)             return <EmptyState />;

  const { name, severity, metrics, anomalies, correlation, evidence, timestamp } = zone;

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString("en-IN", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hour12: false,
      })
    : null;

  const trafficAnomaly  = anomalies?.find((a) => a.metric === "traffic");
  const incidentAnomaly = anomalies?.find((a) => a.metric === "incidents");

  const trafficPct =
    trafficAnomaly?.baseline > 0
      ? (((trafficAnomaly.current - trafficAnomaly.baseline) / trafficAnomaly.baseline) * 100).toFixed(1)
      : null;

  return (
    <>
      {/* Sticky header with colored left border by severity */}
      <div className={`details-header sev-${severity}`}>
        <div className="zone-name" id={`zone-${zone.zone_id}-heading`}>{name}</div>
        <SeverityBadge severity={severity} />
      </div>

      {severity === "no_data" ? (
        <NoDataState zoneName={name} />
      ) : (
        <div className="details-body" role="region" aria-labelledby={`zone-${zone.zone_id}-heading`}>

          {/* Metrics */}
          <div className="details-section">
            <div className="details-section-title">Current Metrics</div>
            <div className="metrics-grid">
              <MetricDetailCard
                label="Traffic"
                value={metrics?.traffic}
                unit="%"
                baseline={trafficAnomaly?.baseline}
                anomalyText={trafficPct ? `${trafficPct}% above baseline` : null}
              />
              <MetricDetailCard
                label="Rainfall"
                value={metrics?.rain_mm}
                unit="mm"
              />
              <MetricDetailCard
                label="Incidents"
                value={metrics?.incidents}
                baseline={incidentAnomaly?.baseline}
                anomalyText={incidentAnomaly ? "Elevated" : null}
              />
            </div>
          </div>

          <AnomalySection anomalies={anomalies} />
          <CorrelationSection correlation={correlation} />
          <EvidenceSection evidence={evidence} />

          {formattedTime && (
            <div className="details-section">
              <div className="timestamp-row">
                <Clock size={11} aria-hidden="true" />
                Last updated: {formattedTime}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
