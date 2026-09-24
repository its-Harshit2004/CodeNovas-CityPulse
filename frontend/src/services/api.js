/**
 * CityPulse API Service
 *
 * Consumes the backend analytics API.
 * The frontend NEVER performs anomaly calculations — all severity/alert logic
 * is owned by the backend analytics pipeline.
 */

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches the list of all zones (ID, name, coordinates).
 * @returns {Promise<{zones: Array, timestamp: string}>}
 */
export async function fetchZones() {
  const res = await fetch(`${API_BASE}/api/zones`);
  if (!res.ok) throw new Error(`Failed to fetch zones: ${res.status}`);
  return res.json();
}

/**
 * Fetches full analytics result for a single zone.
 * @param {string} zoneId
 * @returns {Promise<Object>} analytics result (severity, alert, anomalies, correlation, evidence, metrics)
 */
export async function fetchPulse(zoneId) {
  const res = await fetch(`${API_BASE}/api/pulse/${zoneId}`);
  if (!res.ok) throw new Error(`Failed to fetch pulse for zone ${zoneId}: ${res.status}`);
  return res.json();
}

/**
 * Fetches the complete dashboard snapshot: all zone statuses + aggregate metrics.
 * @returns {Promise<{zones: Array, metrics: Object, timestamp: string}>}
 */
export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  if (!res.ok) throw new Error(`Failed to fetch dashboard: ${res.status}`);
  return res.json();
}
