/**
 * Zone configuration: defines the geographic zones monitored by CityPulse.
 * Each zone has an ID, display name, and coordinates (centered on Jaipur).
 */
const zones = [
  {
    zone_id: "A",
    name: "Zone A",
    latitude: 26.9124,
    longitude: 75.7873
  },
  {
    zone_id: "B",
    name: "Zone B",
    latitude: 26.9260,
    longitude: 75.8070
  },
  {
    zone_id: "C",
    name: "Zone C",
    latitude: 26.9000,
    longitude: 75.8100
  },
  {
    zone_id: "D",
    name: "Zone D",
    latitude: 26.8890,
    longitude: 75.7750
  },
  {
    zone_id: "E",
    name: "Zone E",
    latitude: 26.9350,
    longitude: 75.7650
  }
];

module.exports = { zones };
