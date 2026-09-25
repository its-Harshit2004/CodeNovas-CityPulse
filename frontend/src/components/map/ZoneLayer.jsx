import React, { useMemo, useEffect, useRef } from 'react';
import { Polygon, useMap } from 'react-leaflet';
import { zoneGeometry } from '../../mock/zones.geojson';
import { geo } from '../../utils/geo';

const ZoneLayer = ({ zones, mode, selectedZoneId, onSelectZone, onHoverZone, predictionHorizon }) => {
  const map = useMap();
  const polygonRefs = useRef({});

  const getColor = (status) => {
    switch(status) {
      case 'red': return '#ef4444';
      case 'amber': return '#f59e0b';
      case 'green': return '#10b981';
      default: return '#64748b';
    }
  };

  const getZoneStatus = (zoneData) => {
    if (!zoneData) return 'grey';
    if (mode === 'forecast' && predictionHorizon) {
      const pred = (zoneData.predictions || []).find(p => p.horizonMinutes === predictionHorizon);
      return pred ? pred.predictedStatus : 'grey';
    }
    if (mode === 'overall') return zoneData.overall?.status || 'grey';
    return zoneData.signals?.[mode]?.status || 'grey';
  };

  // Keep state outside of React re-render by updating Leaflet styles directly
  const activeFeatures = useMemo(() => {
    if (!zones || zones.length === 0) return zoneGeometry.features;
    const zoneIds = new Set(zones.map(z => z.id));
    return zoneGeometry.features.filter(f => zoneIds.has(f.id));
  }, [zones]);

  useEffect(() => {
    activeFeatures.forEach(feature => {
      const pRef = polygonRefs.current[feature.id];
      if (!pRef) return;
      
      const zoneData = zones?.find(z => z.id === feature.id);
      const status = getZoneStatus(zoneData);
      const isSelected = selectedZoneId === feature.id;
      const color = getColor(status);

      pRef.setStyle({
        color: isSelected ? '#38bdf8' : color,
        fillColor: color,
        fillOpacity: isSelected ? 0.45 : 0.35,
        weight: isSelected ? 3 : 2,
        className: status === 'red' ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''
      });
    });
  }, [zones, mode, selectedZoneId, predictionHorizon, activeFeatures]);

  const handleMouseOver = (e, featureId) => {
    const pRef = polygonRefs.current[featureId];
    const isSelected = selectedZoneId === featureId;
    if (pRef) {
      pRef.setStyle({ fillOpacity: isSelected ? 0.6 : 0.5 });
    }
    onHoverZone && onHoverZone(featureId, e.originalEvent);
  };

  const handleMouseOut = (e, featureId) => {
    const pRef = polygonRefs.current[featureId];
    const isSelected = selectedZoneId === featureId;
    if (pRef) {
      pRef.setStyle({ fillOpacity: isSelected ? 0.45 : 0.35 });
    }
    onHoverZone && onHoverZone(null, null);
  };

  const memoizedPolygons = useMemo(() => {
    return activeFeatures.map(feature => {
      const positions = geo.toLeafletCoords(feature.geometry.coordinates);
      return (
        <Polygon
          key={feature.id}
          positions={positions}
          ref={(ref) => { polygonRefs.current[feature.id] = ref; }}
          eventHandlers={{
            mouseover: (e) => handleMouseOver(e, feature.id),
            mouseout: (e) => handleMouseOut(e, feature.id),
            click: () => onSelectZone && onSelectZone(feature.id)
          }}
        />
      );
    });
  }, [onSelectZone, activeFeatures]);

  return <>{memoizedPolygons}</>;
};

export default ZoneLayer;
