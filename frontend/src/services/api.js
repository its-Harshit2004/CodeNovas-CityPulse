import { getFullPayload, advanceTick, resetTick } from '../data/mockScenario';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true";
// const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const normalizePayload = (data) => {
  if (!data) return null;

  if (data.success && Array.isArray(data.zones)) {
    const p = {
      city: { id: "city-default", name: "Jaipur", center: [26.91, 75.80] },
      events: [],
      signalTypes: [],
      suddenChanges: [],
      timeline: [],
      sources: []
    };

    p.zones = data.zones.map((bz) => {
      const severityMap = { normal: 'green', low: 'green', medium: 'amber', high: 'red' };
      const overallStatus = severityMap[bz.alert?.severity] || 'grey';
      
      const signals = {};
      
      if (bz.metrics && bz.source_status) {
        signals.traffic = {
          value: bz.metrics.traffic_pct,
          status: bz.signal_status?.traffic || 'grey',
          source: bz.source_status.traffic || 'fixture',
          updatedAt: bz.updated_at
        };
        
        signals.rainfall = {
          value: bz.metrics.rain_mm,
          status: bz.signal_status?.rainfall || 'grey',
          source: bz.source_status.weather || 'fixture',
          updatedAt: bz.updated_at
        };
        
        signals.incidents = {
          value: bz.metrics.incidents,
          status: bz.signal_status?.incidents || 'grey',
          source: bz.source_status.incidents || 'fixture',
          updatedAt: bz.updated_at
        };
      }

      return {
        id: bz.zone_id,
        name: bz.name || `Zone ${bz.zone_id}`,
        signals: signals,
        evidence: bz.evidence || [],
        predictions: undefined,
        history: undefined,
        overall: { 
          status: overallStatus, 
          summary: bz.alert?.llm_statement || bz.alert?.message || "No data available",
          riskScore: undefined,
          confidence: undefined,
          drivers: undefined
        }
      };
    });

    return p;
  }

  const p = { ...data };

  p.city = p.city || { id: "city-default", name: "Unknown City", center: [0, 0] };
  p.zones = Array.isArray(p.zones) ? p.zones : [];
  p.events = Array.isArray(p.events) ? p.events : [];
  p.signalTypes = Array.isArray(p.signalTypes) ? p.signalTypes : [];
  p.suddenChanges = Array.isArray(p.suddenChanges) ? p.suddenChanges : [];
  p.timeline = Array.isArray(p.timeline) ? p.timeline : [];
  p.sources = Array.isArray(p.sources) ? p.sources : [];

  p.zones = p.zones.map((z, idx) => {
    return {
      ...z,
      id: z.id || `generated-zone-${idx}`,
      name: z.name || `Zone ${idx}`,
      signals: z.signals || {},
      evidence: Array.isArray(z.evidence) ? z.evidence : [],
      predictions: Array.isArray(z.predictions) ? z.predictions : [],
      history: Array.isArray(z.history) ? z.history : [],
      overall: z.overall || { status: 'grey', riskScore: 0 }
    };
  });

  // Drop events with invalid geometry safely
  p.events = p.events.filter(ev => {
    if (!ev.geometry || !ev.geometry.coordinates || !ev.geometry.type) {
      console.warn('Dev Warning: Dropping event due to missing geometry', ev);
      return false;
    }
    return true;
  });

  return p;
};

export const api = {
  getFullState: async () => {
    try {
      if (USE_MOCK) {
        await delay(300);
        return normalizePayload(getFullPayload());
      }
      const res = await fetch(`${API_BASE}/api/state`);

      if (!res.ok) {
        throw new Error(`Backend request failed: ${res.status}`);
      }

      const data = await res.json();
      return normalizePayload(data);
    } catch (err) {
      console.error('API Error', err);
      throw err;
    }
  },

  advanceDemo: async () => {
    if (USE_MOCK) advanceTick();
  },

  resetDemo: async () => {
    if (USE_MOCK) resetTick();
  }
};
