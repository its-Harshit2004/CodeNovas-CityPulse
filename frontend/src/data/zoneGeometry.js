export const zoneGeometry = {
  type: "FeatureCollection",

  features: [
    {
      type: "Feature",
      id: "A",
      properties: { name: "Zone A (North)", id: "A" },
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
      id: "B",
      properties: { name: "Zone B (Center)", id: "B" },
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
      id: "C",
      properties: { name: "Zone C (South)", id: "C" },
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