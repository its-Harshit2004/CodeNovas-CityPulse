export const mapConfig = {
  // OSM's public tile servers are for demo/light usage; production should use a self-hosted or commercial provider through the same config.
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 10,
  maxZoom: 18,
  defaultCenter: [26.91, 75.80], // Jaipur roughly
  mapTheme: 'dark-blend', // "dark-blend" | "light"
};
