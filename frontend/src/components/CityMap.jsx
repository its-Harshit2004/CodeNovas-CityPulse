import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { zoneGeometry } from '../data/zoneGeometry';

const MapUpdater = () => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

const FitBounds = ({ selectedZoneId }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedZoneId) {
      const feature = zoneGeometry.features.find(f => f.id === selectedZoneId);
      if (feature) {
        // Simple bounding box calc for 1 polygon
        const coords = feature.geometry.coordinates[0];
        const lats = coords.map(c => c[1]);
        const lngs = coords.map(c => c[0]);
        const bounds = [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)]
        ];
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    } else {
      map.setView([26.91, 75.80], 12);
    }
  }, [selectedZoneId, map]);
  return null;
};

const CityMap = ({ zones, colorBy = 'overall', selectedZoneId, onSelectZone, height = '100%' }) => {
  const center = [26.91, 75.80]; // Jaipur center

  const getColor = (status) => {
    switch(status) {
      case 'red': return '#ef4444';
      case 'amber': return '#f59e0b';
      case 'green': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div className="w-full relative rounded-xl overflow-hidden border border-[var(--navy-border)] z-0" style={{ height }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapUpdater />
        <FitBounds selectedZoneId={selectedZoneId} />
        
        {zoneGeometry.features.map((feature) => {
          const zoneId = feature.id;
          const zoneData = zones?.find(z => z.id === zoneId);
          
          let status = 'grey';
          if (zoneData) {
            if (colorBy === 'overall') status = zoneData.status;
            else status = zoneData.signals[colorBy]?.status || 'grey';
          }
          
          const isSelected = selectedZoneId === zoneId;
          const positions = feature.geometry.coordinates[0].map(c => [c[1], c[0]]);
          const fillColor = getColor(status);
          
          return (
            <Polygon
              key={zoneId}
              positions={positions}
              pathOptions={{
                color: isSelected ? '#ffffff' : fillColor,
                fillColor: fillColor,
                fillOpacity: isSelected ? 0.5 : 0.2,
                weight: isSelected ? 2 : 1,
                className: status === 'red' ? 'animate-pulse-slow' : ''
              }}
              eventHandlers={{
                click: () => onSelectZone && onSelectZone(zoneId === selectedZoneId ? null : zoneId)
              }}
            >
              <LeafletTooltip sticky className="!bg-[var(--navy-panel)] !text-white !border-[var(--navy-border)] !rounded-md">
                <div className="font-bold text-sm">{feature.properties.name}</div>
                <div className="text-xs capitalize flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: fillColor}}></span>
                  {status === 'red' ? 'High Alert' : status === 'amber' ? 'Moderate' : status === 'green' ? 'Normal' : 'No Data'}
                </div>
              </LeafletTooltip>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CityMap;
