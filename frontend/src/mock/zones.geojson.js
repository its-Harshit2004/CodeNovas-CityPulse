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
      id: "zone-b",
      properties: { name: "Zone B (Center)", id: "zone-b" },
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
      id: "zone-c",
      properties: { name: "Zone C (South)", id: "zone-c" },
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
    },
    {
      type: "Feature",
      id: "zone-d",
      properties: { name: "Zone D (East)", id: "zone-d" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.81, 26.92],
            [75.86, 26.92],
            [75.86, 26.86],
            [75.81, 26.86],
            [75.81, 26.92]
          ]
        ]
      }
    }
  ]
};
