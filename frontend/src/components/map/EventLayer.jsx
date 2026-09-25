import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { getEventDef } from '../../config/signalRegistry';
import { DynamicIcon } from '../../utils/iconResolver';

const EventLayer = ({ events, showEvents }) => {
  if (!showEvents) return null;
  const validEvents = Array.isArray(events) ? events : [];

  return (
    <>
      {validEvents.map(ev => {
        if (!ev || !ev.geometry || !ev.geometry.coordinates) return null;
        if (ev.geometry.type !== 'Point') {
          console.warn('Dev Warning: EventLayer currently only supports Point geometries.', ev.id);
          return null;
        }

        const def = getEventDef(ev.type);
        
        // Render icon to static markup
        const iconHtml = `<div class="w-8 h-8 rounded-full bg-[var(--navy-bg)] border-2 border-${def.color}-500 flex items-center justify-center text-${def.color}-500 drop-shadow-md">
           ${renderToStaticMarkup(<DynamicIcon name={def.icon} size={16} type="event" />)}
        </div>`;

        const icon = L.divIcon({
          className: 'bg-transparent',
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        // GeoJSON uses [lng, lat]
        const pos = [ev.geometry.coordinates[1], ev.geometry.coordinates[0]];

        return (
          <Marker key={ev.id || `event-${pos[0]}-${pos[1]}`} position={pos} icon={icon}>
            <Tooltip sticky className="!bg-[var(--navy-panel)] !text-white !border-[var(--navy-border)] !rounded-md">
              <div className="font-bold text-sm mb-1">{ev.title || 'Event'}</div>
              <div className="text-xs text-text-secondary capitalize">{ev.type || 'unknown'}</div>
              <div className="text-[10px] text-text-muted mt-1">{ev.description || ''}</div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default EventLayer;
