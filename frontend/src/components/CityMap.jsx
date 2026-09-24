/**
 * CityMap — the primary visual component.
 *
 * Responsibilities:
 *  - renders the Leaflet map with dark/light-aware tile layer
 *  - renders one ZoneMarker per zone
 *  - handles marker click → calls onZoneSelect(zone)
 *  - displays MapLegend overlay
 *  - does NOT determine zone severity (comes from API)
 */

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { getMarkerConfig } from "./ZoneMarker";
import { MapLegend } from "./MapLegend";

// Jaipur center coordinates
const MAP_CENTER = [26.9124, 75.7873];
const MAP_ZOOM = 13;

// Dark map: CARTO Dark Matter (no branding, clean dark)
const TILE_DARK = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
};

// Light map: CARTO Positron (clean light)
const TILE_LIGHT = {
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
};

/**
 * MapUpdater — fits the map bounds to show all zone markers on first load.
 */
function MapUpdater({ zones }) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && zones.length > 0) {
      initialized.current = true;
      const bounds = zones.map((z) => [z.latitude, z.longitude]);
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 14 });
      } else {
        map.setView(MAP_CENTER, MAP_ZOOM);
      }
    }
  }, [zones, map]);

  return null;
}

export function CityMap({ zones, selectedZone, onZoneSelect, darkMode }) {
  const tiles = darkMode !== false ? TILE_DARK : TILE_LIGHT;

  return (
    <div className="map-section" role="main" aria-label="City health map">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="map-container"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          key={tiles.url}
          url={tiles.url}
          attribution={tiles.attribution}
          subdomains="abcd"
          maxZoom={19}
        />

        <MapUpdater zones={zones} />

        {zones.map((zone) => {
          const isSelected = selectedZone?.zone_id === zone.zone_id;
          const icon = L.divIcon(getMarkerConfig(zone, isSelected));

          return (
            <Marker
              key={zone.zone_id}
              position={[zone.latitude, zone.longitude]}
              icon={icon}
              eventHandlers={{ click: () => onZoneSelect(zone) }}
              title={`${zone.name} — ${zone.severity || "loading"}`}
            />
          );
        })}
      </MapContainer>

      <MapLegend />
    </div>
  );
}
