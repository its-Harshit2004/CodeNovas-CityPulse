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
            [75.76, 26.98],
            [75.84, 26.98],
            [75.84, 26.93],
            [75.76, 26.93],
            [75.76, 26.98]
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
            [75.76, 26.92],
            [75.80, 26.92],
            [75.80, 26.86],
            [75.76, 26.86],
            [75.76, 26.92]
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
            [75.76, 26.85],
            [75.84, 26.85],
            [75.84, 26.80],
            [75.76, 26.80],
            [75.76, 26.85]
          ]
        ]
      }
    }
  ]
};
