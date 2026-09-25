import L from 'leaflet';

export const geo = {
  // Convert [lng, lat] (GeoJSON standard) to [lat, lng] (Leaflet standard)
  toLeafletCoords: (coordinates) => {
    return coordinates.map(ring => 
      ring.map(point => [point[1], point[0]])
    );
  },

  // Calculate bounds for an array of feature objects (GeoJSON features)
  calculateBounds: (features) => {
    if (!features || features.length === 0) return null;
    
    let lats = [];
    let lngs = [];
    
    features.forEach(f => {
      if (f.geometry && f.geometry.coordinates) {
        f.geometry.coordinates[0].forEach(pt => {
          lngs.push(pt[0]);
          lats.push(pt[1]);
        });
      }
    });

    if (lats.length === 0 || lngs.length === 0) return null;

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    if (maxLat - minLat < 0.001 || maxLng - minLng < 0.001) {
      console.warn("Dev Warning: Computed bounds are suspiciously small, check coordinates.");
    }
    
    if (minLat > 90 || minLat < -90) {
      console.warn("Dev Warning: Coordinates might be swapped. Lats should be between -90 and 90.");
    }

    // Return Leaflet LatLngBounds
    return L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng));
  }
};
