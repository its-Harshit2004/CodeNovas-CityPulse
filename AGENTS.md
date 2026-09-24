# CityPulse Development Rules

## Project

CityPulse is a live civic health dashboard for the AmiHacks Track B problem.

The application combines:
- weather
- traffic
- civic incidents/complaints

and analyzes these signals by geographic zone.

## Architecture

Preferred flow:

```
Data Sources
→ Normalization
→ Analytics (backend/analytics/)
→ Backend API (backend/server.js, port 3001)
→ React Dashboard (frontend/, port 5173)
```

## Analytics Ownership

The backend analytics module owns:
- baseline comparison (`backend/analytics/baseline.js`)
- anomaly detection (`backend/analytics/anomalyDetector.js`)
- correlation detection (`backend/analytics/correlationEngine.js`)
- severity determination
- evidence generation

**Frontend must NOT duplicate this logic.**

Frontend consumes the resulting analysis through the API (`/api/dashboard`, `/api/pulse/:zoneId`).

## Dashboard Concept

The primary visualization is a geographic map (React-Leaflet).

Every monitored zone is represented by a circular status marker (not a pin).

Status:
- GREEN (`#22C55E`) = normal
- YELLOW (`#EAB308`) = medium alert
- RED (`#EF4444`) = high alert
- GREY (`#6B7280`) = insufficient/no data

High-alert markers use a subtle CSS pulsing ring.

## Map Interaction

Clicking a zone marker must:
1. Set that zone as `selectedZone`
2. Fetch full pulse data from `GET /api/pulse/:zoneId`
3. Update the right-side ZoneDetails panel

## Correlation Language

**Never** claim correlation is causation.

Use wording such as:
> "Possible weather-related disruption"

Never write:
> "Rain caused the traffic problem."

## API Endpoints

- `GET /api/zones` — list all zones (id, name, lat, lng)
- `GET /api/pulse/:zoneId` — full analytics result for one zone
- `GET /api/dashboard` — all zones + aggregate metrics

Backend runs on port 3001. Frontend dev server on port 5173 (proxies /api to backend).

## UI Design

Dark civic-intelligence/control-room visual style.
Background: `#0B1220` | Surface: `#111827`
Font: Inter (body), JetBrains Mono (metrics)

Visual hierarchy:
1. Map (most important)
2. Zone status
3. Alert
4. Metrics
5. Evidence

## Auto-Refresh

`REFRESH_INTERVAL = 30000` ms (defined in Dashboard.jsx)

## File Structure

```
backend/
├── analytics/       ← DO NOT MODIFY without explicit request
│   ├── analyzer.js
│   ├── anomalyDetector.js
│   ├── baseline.js
│   └── correlationEngine.js
├── data/
│   ├── zones.js     ← zone config (id, name, lat, lng)
│   └── sampleData.js ← demo civic data per zone
└── server.js        ← Express API (ports/routes)

frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── MetricCard.jsx
│   │   ├── CityMap.jsx
│   │   ├── ZoneMarker.jsx
│   │   ├── ZoneDetails.jsx
│   │   ├── AlertBanner.jsx
│   │   └── MapLegend.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── index.css
│   ├── App.jsx
│   └── main.jsx
```

## Engineering Rules

- Do not rewrite existing analytics architecture unnecessarily.
- Prefer existing dependencies (leaflet, react-leaflet, lucide-react, recharts).
- Do not modify `backend/analytics/` unless explicitly asked.
- Do not change API contracts without documenting the change.
- Do not hardcode production data when the API exists.
- Do not duplicate anomaly/severity logic in React components.
- Always test changes — run both backend and frontend dev servers.

## Starting the Project

```bash
# Terminal 1 — Backend API
cd backend && node server.js

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Then open http://localhost:5173
