export const signalRegistry = {
  traffic: { id: 'traffic', label: 'Traffic', unit: '%', category: 'Mobility', icon: 'car', higherIsWorse: true, format: (val) => `${val}%` },
  rainfall: { id: 'rainfall', label: 'Rainfall', unit: 'mm/hr', category: 'Environment', icon: 'droplets', higherIsWorse: true, format: (val) => `${val} mm/hr` },
  incidents: { id: 'incidents', label: 'Incidents', unit: 'count', category: 'Safety', icon: 'alert-triangle', higherIsWorse: true, format: (val) => `${val}` },
  waterlogging: { id: 'waterlogging', label: 'Waterlogging', unit: 'cm', category: 'Environment', icon: 'cloud-rain', higherIsWorse: true, format: (val) => `${val} cm` },
  air_quality: { id: 'air_quality', label: 'Air Quality', unit: 'AQI', category: 'Environment', icon: 'shield-alert', higherIsWorse: true, format: (val) => `${val} AQI` },
  gas_leak: { id: 'gas_leak', label: 'Gas Leaks', unit: 'ppm', category: 'Safety', icon: 'alert-triangle', higherIsWorse: true, format: (val) => `${val} ppm` },
  construction: { id: 'construction', label: 'Roadworks', unit: 'sites', category: 'Infrastructure', icon: 'construction', higherIsWorse: true, format: (val) => `${val}` }
};

export const eventRegistry = {
  construction: { icon: 'construction', color: 'amber' },
  waterlogging: { icon: 'droplets', color: 'red' },
  accident: { icon: 'car', color: 'red' },
  public_event: { icon: 'activity', color: 'green' },
  road_closure: { icon: 'alert-triangle', color: 'red' }
};

export const getSignalDef = (id) => {
  return signalRegistry[id] || { id, label: id, unit: '', category: 'Other', icon: 'activity', higherIsWorse: true, format: (v) => `${v}` };
};

export const getEventDef = (type) => {
  return eventRegistry[type] || { icon: 'activity', color: 'grey' };
};
