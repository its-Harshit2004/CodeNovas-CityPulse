import React, { useEffect, useState } from 'react';
import { useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import { zoneGeometry } from '../../mock/zones.geojson';
import { geo } from '../../utils/geo';

const ZoneLabel = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);
    return () => map.off('zoomend', onZoom);
  }, [map]);

  if (zoom < 11) return null;

  return (
    <>
      {zoneGeometry.features.map(f => {
        const bounds = geo.calculateBounds([f]);
        if (!bounds) return null;
        const center = bounds.getCenter();
        
        const icon = L.divIcon({
          className: 'bg-transparent text-white font-bold text-sm drop-shadow-md whitespace-nowrap text-center',
          html: `<div style="text-shadow: 0 1px 4px rgba(0,0,0,0.8);">${f.properties.name}</div>`,
          iconSize: [120, 20],
          iconAnchor: [60, 10]
        });

        return (
          <Marker key={f.id} position={center} icon={icon} interactive={false} />
        );
      })}
    </>
  );
};

export default ZoneLabel;
