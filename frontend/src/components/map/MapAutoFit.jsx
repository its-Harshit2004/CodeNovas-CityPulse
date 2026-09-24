import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { geo } from '../../utils/geo';
import { zoneGeometry } from '../../mock/zones.geojson';

const MapAutoFit = ({ selectedZoneId, shouldFit }) => {
  const map = useMap();
  
  useEffect(() => {
    // Setup resize observer for container
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(map.getContainer());
    
    return () => ro.disconnect();
  }, [map]);

  useEffect(() => {
    if (!shouldFit) return;
    
    let featuresToFit = zoneGeometry.features;
    if (selectedZoneId) {
      const selected = zoneGeometry.features.find(f => f.id === selectedZoneId);
      if (selected) featuresToFit = [selected];
    }
    
    const bounds = geo.calculateBounds(featuresToFit);
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30], animate: true, maxZoom: 14 });
    }
  }, [map, selectedZoneId, shouldFit]);

  return null;
};

export default MapAutoFit;
