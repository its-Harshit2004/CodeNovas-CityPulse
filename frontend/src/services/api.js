import mockPulse from "../mock/pulse.json";

export async function getPulse(zoneId = "A") {
  // Temporary mock response.
  // Later this will be replaced with the real backend API.
  return {
    ...mockPulse,
    zone_id: zoneId,
  };
}