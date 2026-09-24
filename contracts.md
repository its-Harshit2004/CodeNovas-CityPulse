# CityPulse Data Contracts

## Member 1 → Member 2

{
  zone_id,
  timestamp,
  weather,
  traffic,
  incidents
}

## Member 2 → Member 3

{
  zone_id,
  alert,
  severity,
  anomalies,
  correlation,
  evidence
}

## Member 3 → Member 4

GET /api/pulse/:zoneId

{
  zone_id,
  updated_at,
  metrics,
  alert,
  evidence,
  source_status
}
