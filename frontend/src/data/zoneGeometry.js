export const zoneGeometry = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "zone-a",
      properties: { name: "Zone A (North)", id: "zone-a" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.78, 26.95],
            [75.82, 26.95],
            [75.82, 26.91],
            [75.78, 26.91],
            [75.78, 26.95]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "zone-b",
      properties: { name: "Zone B (Center)", id: "zone-b" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.78, 26.91],
            [75.82, 26.91],
            [75.82, 26.87],
            [75.78, 26.87],
            [75.78, 26.91]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "zone-c",
      properties: { name: "Zone C (South)", id: "zone-c" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.78, 26.87],
            [75.82, 26.87],
            [75.82, 26.83],
            [75.78, 26.83],
            [75.78, 26.87]
          ]
        ]
      }
    }
  ]
};
