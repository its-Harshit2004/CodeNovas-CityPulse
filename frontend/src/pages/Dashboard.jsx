/**
 * Dashboard — the main page orchestrating all CityPulse components.
 *
 * State:
 *  zones, selectedZone, dashboardMetrics, loading, error, lastUpdated
 *
 * Data flow:
 *   GET /api/dashboard → all zone statuses + aggregate metrics (30s refresh)
 *   GET /api/pulse/:zoneId → full zone analytics on click
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "../components/Header";
import { MetricCard } from "../components/MetricCard";
import { CityMap } from "../components/CityMap";
import { ZoneDetails } from "../components/ZoneDetails";
import { AlertBanner } from "../components/AlertBanner";
import { fetchDashboard, fetchPulse } from "../services/api";
import { AlertTriangle, Car, CloudRain, Bell, Activity } from "lucide-react";

const REFRESH_INTERVAL = 30000; // 30 seconds

export function Dashboard({ darkMode, onToggleTheme }) {
  const [zones, setZones]               = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [zoneLoading, setZoneLoading]   = useState(false);
  const [error, setError]               = useState(null);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const lastSuccessRef                  = useRef(null);

  const loadDashboard = useCallback(async () => {
    try {
      const data = await fetchDashboard();
      setZones(data.zones || []);
      setDashboardMetrics(data.metrics || null);
      setLastUpdated(data.timestamp);
      lastSuccessRef.current = data.timestamp;
      setError(null);
    } catch (err) {
      console.error("[CityPulse] Dashboard fetch failed:", err);
      setError({
        message: "Unable to retrieve the latest civic data.",
        lastSuccess: lastSuccessRef.current,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleZoneSelect = useCallback(async (zone) => {
    setSelectedZone({ ...zone, _partial: true });
    setZoneLoading(true);
    try {
      const pulse = await fetchPulse(zone.zone_id);
      setSelectedZone(pulse);
    } catch (err) {
      console.error(`[CityPulse] Pulse fetch failed for ${zone.zone_id}:`, err);
      setSelectedZone({ ...zone, _fetchError: true });
    } finally {
      setZoneLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  useEffect(() => {
    const timer = setInterval(loadDashboard, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [loadDashboard]);

  // Re-fetch selected zone if its severity changed after a dashboard refresh
  useEffect(() => {
    if (selectedZone && !selectedZone._partial) {
      const updated = zones.find((z) => z.zone_id === selectedZone.zone_id);
      if (updated && updated.severity !== selectedZone.severity) {
        handleZoneSelect(updated);
      }
    }
  }, [zones]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enrich zones for AlertBanner with full evidence/correlation when available
  const zonesForBanner = zones.map((z) => {
    if (selectedZone && selectedZone.zone_id === z.zone_id && !selectedZone._partial) {
      return { ...z, evidence: selectedZone.evidence, correlation: selectedZone.correlation };
    }
    return z;
  });

  // Metric card color classes (visual only — NOT analytics)
  const trafficCardClass =
    dashboardMetrics?.avgTraffic > 70 ? "card-alert"
    : dashboardMetrics?.avgTraffic > 50 ? "card-warning"
    : "card-normal";

  const rainCardClass     = dashboardMetrics?.maxRain > 20 ? "card-warning" : "card-normal";
  const incidentCardClass =
    dashboardMetrics?.totalIncidents > 15 ? "card-alert"
    : dashboardMetrics?.totalIncidents > 5 ? "card-warning"
    : "card-normal";
  const alertCardClass    = dashboardMetrics?.activeAlerts > 0 ? "card-alert" : "card-normal";

  return (
    <div className="app-shell">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Header
        lastUpdated={lastUpdated}
        isLive={!error}
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
      />

      {/* ── Metric Cards ─────────────────────────────────────────────────── */}
      <div className="metrics-row" role="region" aria-label="City-wide metrics">
        <MetricCard
          label="Traffic"
          icon={Car}
          value={loading ? null : dashboardMetrics?.avgTraffic}
          unit="%"
          trend={
            dashboardMetrics?.avgTraffic > 50
              ? `↑ ${dashboardMetrics.avgTraffic}% avg`
              : "avg across zones"
          }
          cardClass={trafficCardClass}
        />
        <MetricCard
          label="Rainfall"
          icon={CloudRain}
          value={loading ? null : dashboardMetrics?.maxRain}
          unit="mm"
          trend="peak across zones"
          cardClass={rainCardClass}
        />
        <MetricCard
          label="Incidents"
          icon={Activity}
          value={loading ? null : dashboardMetrics?.totalIncidents}
          trend="total active"
          cardClass={incidentCardClass}
        />
        <MetricCard
          label="Active Alerts"
          icon={Bell}
          value={loading ? null : dashboardMetrics?.activeAlerts}
          cardClass={alertCardClass}
        />
      </div>

      {/* ── Error Banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          <AlertTriangle size={16} className="error-icon" aria-hidden="true" />
          <div>
            <div className="error-title">⚠ DATA CONNECTION ISSUE</div>
            <div className="error-desc">
              {error.message}
              {error.lastSuccess && (
                <>
                  {" "}Last received:{" "}
                  {new Date(error.lastSuccess).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit", hour12: false,
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main: Map + Details ──────────────────────────────────────────── */}
      <div className="main-content">

        {/* Map — primary visual element */}
        {loading && zones.length === 0 ? (
          <div className="map-section">
            <div className="loading-overlay" role="status" aria-label="Loading civic data">
              <div className="loading-spinner" aria-hidden="true" />
              <p className="loading-text">Loading civic data…</p>
            </div>
          </div>
        ) : (
          <CityMap
            zones={zones}
            selectedZone={selectedZone}
            onZoneSelect={handleZoneSelect}
            darkMode={darkMode}
          />
        )}

        {/* Zone Details Panel */}
        <aside className="details-panel" role="complementary" aria-label="Zone details">
          <ZoneDetails zone={selectedZone} loading={zoneLoading} />
        </aside>
      </div>

      {/* ── Alert Banner ─────────────────────────────────────────────────── */}
      <AlertBanner zones={zonesForBanner} />
    </div>
  );
}
