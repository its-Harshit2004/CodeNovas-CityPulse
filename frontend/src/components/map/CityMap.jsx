import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mapConfig } from '../../config/mapConfig';
import MapAutoFit from './MapAutoFit';
import ZoneLayer from './ZoneLayer';
import ZoneLabel from './ZoneLabel';
import ZoneHoverCard from './ZoneHoverCard';
import EventLayer from './EventLayer';
import MapLegend from './MapLegend';
import MapFilterBar from './MapFilterBar';
import MapFullscreen from './MapFullscreen';
import ErrorBoundary from '../ErrorBoundary';

const CityMapContent = ({ 
  zones, 
  mode = 'overall',
  selectedZoneId, 
  onSelectZone,
  events,
  showEventsDefault = true,
  predictionHorizon,
  height = '100%',
  compact = false,
  allowFullscreen = true,
  activeSignals = []
}) => {
  const [internalMode, setInternalMode] = useState(mode);
  const [showEvents, setShowEvents] = useState(showEventsDefault);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [hoverZoneId, setHoverZoneId] = useState(null);
  const [hoverEvent, setHoverEvent] = useState(null);

  const handleHover = (id, event) => {
    setHoverZoneId(id);
    setHoverEvent(event);
  };

  const tileFilter = mapConfig.mapTheme === 'dark-blend' 
    ? 'invert(1) hue-rotate(180deg) brightness(0.7) contrast(0.95) saturate(0.55)' 
    : 'none';

  const mapContent = (
    <div className={`w-full h-full relative ${!isFullscreen && !compact ? 'rounded-xl overflow-hidden border border-[var(--navy-border)]' : ''}`}>
      <MapContainer 
        center={mapConfig.defaultCenter} 
        zoom={mapConfig.minZoom} 
        minZoom={mapConfig.minZoom}
        maxZoom={mapConfig.maxZoom}
        zoomControl={false} 
        attributionControl={true}
        style={{ height: '100%', width: '100%', background: 'transparent' }}
      >
        <div style={{ filter: tileFilter, opacity: 0.85, width: '100%', height: '100%', position: 'absolute', zIndex: 0, pointerEvents: 'none' }}>
          <TileLayer url={mapConfig.tileUrl} attribution={mapConfig.attribution} />
        </div>
        
        <MapAutoFit selectedZoneId={selectedZoneId} shouldFit={true} />
        
        <ZoneLayer 
          zones={zones} 
          mode={internalMode} 
          selectedZoneId={selectedZoneId} 
          onSelectZone={onSelectZone} 
          onHoverZone={handleHover}
          predictionHorizon={predictionHorizon}
        />
        
        <ZoneLabel />
        
        <ErrorBoundary fallback={null}>
          <EventLayer events={events} showEvents={showEvents} />
        </ErrorBoundary>
      </MapContainer>
      
      {mapConfig.mapTheme === 'dark-blend' && !isFullscreen && !compact && (
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: 'inset 0 0 40px 20px var(--navy-bg)'
        }}></div>
      )}

      {!compact && (
        <>
          <MapFilterBar activeSignals={activeSignals} mode={internalMode} onModeChange={setInternalMode} showEvents={showEvents} onToggleEvents={setShowEvents} />
          <MapLegend mode={internalMode} activeSignals={activeSignals} />
        </>
      )}

      <ZoneHoverCard 
        zoneId={hoverZoneId} 
        mouseEvent={hoverEvent} 
        zones={zones} 
        mode={internalMode} 
        activeSignals={activeSignals} 
      />
    </div>
  );

  if (allowFullscreen) {
    return (
      <MapFullscreen isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen}>
        {mapContent}
      </MapFullscreen>
    );
  }

  return <div style={{ height }}>{mapContent}</div>;
};

export default function CityMap(props) {
  return (
    <ErrorBoundary resetKeys={[props.mode]}>
      <CityMapContent {...props} />
    </ErrorBoundary>
  );
}
