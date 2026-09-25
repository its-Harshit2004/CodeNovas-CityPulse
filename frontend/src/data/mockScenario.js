import dayjs from 'dayjs';

let currentTick = 0;

const baseDate = dayjs('2026-09-25T12:00:00Z');

const t = (offsetMins) =>
  baseDate
    .add(currentTick * 5 + offsetMins, 'minute')
    .toISOString();

const generateZoneData = (tick) => {
  return [
    {
      id: "A",
      name: "Zone A (North)",

      overall: {
        status: "green",
        riskScore: 15,
        summary: "Zone A is operating normally with no active disruptions.",
        confidence: 0.95,
        generatedAt: t(0),
        drivers: [
          {
            signalId: "traffic",
            weight: 0.8
          }
        ]
      },

      signals: {
        traffic: {
          value: 45,
          baseline: 42,
          deltaPct: 7,
          status: "green",
          trend: "up",
          updatedAt: t(-1)
        },

        rainfall: {
          value: 0,
          baseline: 2,
          deltaPct: -100,
          status: "green",
          trend: "flat",
          updatedAt: t(-3)
        },

        incidents: {
          value: 1,
          baseline: 1,
          deltaPct: 0,
          status: "green",
          trend: "flat",
          updatedAt: t(-2)
        },

        air_quality: {
          value: 85,
          baseline: 90,
          deltaPct: -5,
          status: "green",
          trend: "down",
          updatedAt: t(-5)
        }
      },

      evidence: [
        "Traffic within normal levels",
        "No precipitation"
      ],

      predictions: [],

      history: [
        {
          t: t(-60),
          traffic: 42,
          rainfall: 0,
          incidents: 1,
          air_quality: 90
        },
        {
          t: t(-30),
          traffic: 44,
          rainfall: 0,
          incidents: 0,
          air_quality: 88
        },
        {
          t: t(0),
          traffic: 45,
          rainfall: 0,
          incidents: 1,
          air_quality: 85
        }
      ]
    },

    {
      id: "B",
      name: "Zone B (Center)",

      overall:
        tick >= 4
          ? {
              status: "red",
              riskScore: 92,
              summary:
                "Zone B is experiencing a possible weather-related disruption.",
              confidence: 0.88,
              generatedAt: t(0),
              drivers: [
                {
                  signalId: "rainfall",
                  weight: 0.5
                },
                {
                  signalId: "waterlogging",
                  weight: 0.3
                },
                {
                  signalId: "traffic",
                  weight: 0.2
                }
              ]
            }
          : tick >= 1
          ? {
              status: "amber",
              riskScore: 65,
              summary:
                "Zone B shows elevated congestion likely linked to moderate rainfall.",
              confidence: 0.82,
              generatedAt: t(0),
              drivers: [
                {
                  signalId: "rainfall",
                  weight: 0.7
                }
              ]
            }
          : {
              status: "green",
              riskScore: 25,
              summary: "Zone B is operating normally.",
              confidence: 0.9,
              generatedAt: t(0),
              drivers: []
            },

      signals: {
        traffic: {
          value:
            tick >= 4
              ? 81
              : tick >= 1
              ? 65
              : 42,

          baseline: 40,

          deltaPct:
            tick >= 4
              ? 93
              : tick >= 1
              ? 62
              : 5,

          status:
            tick >= 4
              ? "red"
              : tick >= 1
              ? "amber"
              : "green",

          trend:
            tick >= 1
              ? "up"
              : "flat",

          updatedAt: t(-1)
        },

        rainfall: {
          value:
            tick >= 4
              ? 18
              : tick >= 1
              ? 10
              : 1,

          baseline: 1,

          deltaPct:
            tick >= 4
              ? 500
              : tick >= 1
              ? 900
              : 0,

          status:
            tick >= 4
              ? "red"
              : tick >= 1
              ? "amber"
              : "green",

          trend:
            tick >= 1
              ? "up"
              : "flat",

          updatedAt: t(-3)
        },

        incidents: {
          value:
            tick >= 4
              ? 7
              : tick >= 1
              ? 4
              : 2,

          baseline: 2,

          deltaPct:
            tick >= 4
              ? 250
              : tick >= 1
              ? 100
              : 0,

          status:
            tick >= 4
              ? "amber"
              : "green",

          trend:
            tick >= 4
              ? "up"
              : "flat",

          updatedAt: t(-2)
        },

        waterlogging: {
          value:
            tick >= 4
              ? 15
              : 0,

          baseline: 0,

          deltaPct:
            tick >= 4
              ? 1500
              : 0,

          status:
            tick >= 4
              ? "red"
              : "green",

          trend:
            tick >= 4
              ? "up"
              : "flat",

          updatedAt: t(-4)
        },

        air_quality: {
          value: 105,
          baseline: 90,
          deltaPct: 16,
          status: "amber",
          trend: "up",
          updatedAt: t(-5)
        }
      },

      evidence:
        tick >= 4
          ? [
              "Rainfall 18 mm/hr, about 6x normal",
              "Traffic index 81% vs 40% baseline",
              "Waterlogging at 15cm"
            ]
          : [
              "Normal conditions across most signals"
            ],

      predictions:
        tick >= 1 && tick < 4
          ? [
              {
                id: "p1",
                horizonMinutes: 60,
                predictedStatus: "red",
                signalIds: ["waterlogging"],
                confidence: 0.75,
                headline:
                  "Waterlogging is likely on the main corridor if rain continues",
                possibleImpact:
                  "Traffic may slow further"
              }
            ]
          : [],

      history: [
        {
          t: t(-60),
          traffic: 40,
          rainfall: 0,
          incidents: 2,
          waterlogging: 0,
          air_quality: 90
        },

        {
          t: t(-30),
          traffic:
            tick >= 1
              ? 65
              : 41,
          rainfall:
            tick >= 1
              ? 10
              : 1,
          incidents:
            tick >= 1
              ? 4
              : 2,
          waterlogging: 0,
          air_quality: 100
        },

        {
          t: t(0),
          traffic:
            tick >= 4
              ? 81
              : tick >= 1
              ? 65
              : 42,
          rainfall:
            tick >= 4
              ? 18
              : tick >= 1
              ? 10
              : 1,
          incidents:
            tick >= 4
              ? 7
              : tick >= 1
              ? 4
              : 2,
          waterlogging:
            tick >= 4
              ? 15
              : 0,
          air_quality: 105
        }
      ]
    },

    {
      id: "C",
      name: "Zone C (South)",

      overall:
        tick >= 4
          ? {
              status: "amber",
              riskScore: 55,
              summary:
                "Zone C has seen a sudden cluster of incidents causing moderate congestion.",
              confidence: 0.79,
              generatedAt: t(0),
              drivers: [
                {
                  signalId: "incidents",
                  weight: 0.7
                }
              ]
            }
          : {
              status: "green",
              riskScore: 10,
              summary:
                "Zone C is clear and operating below baseline congestion.",
              confidence: 0.96,
              generatedAt: t(0),
              drivers: []
            },

      signals: {
        traffic: {
          value:
            tick >= 4
              ? 50
              : 30,

          baseline: 32,

          deltaPct:
            tick >= 4
              ? 56
              : -6,

          status:
            tick >= 4
              ? "amber"
              : "green",

          trend:
            tick >= 4
              ? "up"
              : "flat",

          updatedAt: t(-1)
        },

        rainfall: {
          value: 0,
          baseline: 0,
          deltaPct: 0,
          status: "green",
          trend: "flat",
          updatedAt: t(-3)
        },

        incidents: {
          value:
            tick >= 4
              ? 5
              : 0,

          baseline: 1,

          deltaPct:
            tick >= 4
              ? 400
              : -100,

          status:
            tick >= 4
              ? "red"
              : "green",

          trend:
            tick >= 4
              ? "up"
              : "flat",

          updatedAt: t(-2)
        },

        construction: {
          value: 2,
          baseline: 1,
          deltaPct: 100,
          status: "amber",
          trend: "up",
          updatedAt: t(-10)
        }
      },

      evidence:
        tick >= 4
          ? [
              "Sudden spike in incidents reported",
              "Traffic congestion building up"
            ]
          : [
              "Below baseline traffic"
            ],

      predictions: [],

      history: [
        {
          t: t(-60),
          traffic: 32,
          rainfall: 0,
          incidents: 0,
          construction: 1
        },

        {
          t: t(-30),
          traffic:
            tick >= 4
              ? 35
              : 31,
          rainfall: 0,
          incidents:
            tick >= 4
              ? 2
              : 0,
          construction: 2
        },

        {
          t: t(0),
          traffic:
            tick >= 4
              ? 50
              : 30,
          rainfall: 0,
          incidents:
            tick >= 4
              ? 5
              : 0,
          construction: 2
        }
      ]
    }
  ];
};

export const advanceTick = () => {
  currentTick++;
};

export const resetTick = () => {
  currentTick = 0;
};

export const getFullPayload = () => {
  const zones = generateZoneData(currentTick);

  const events = [];

  events.push({
    id: "e1",
    type: "construction",
    title: "Road repair on Main St",
    zoneIds: ["C"],
    geometry: {
      type: "Point",
      coordinates: [75.80, 26.82]
    },
    status: "amber",
    startsAt: t(-120),
    endsAt: t(1440),
    affectedSignals: [
      "traffic",
      "construction"
    ],
    description:
      "Lane closure due to resurfacing.",
    updatedAt: t(-10)
  });

  if (currentTick >= 4) {
    events.push({
      id: "e2",
      type: "waterlogging",
      title: "Severe Waterlogging",
      zoneIds: ["B"],
      geometry: {
        type: "Point",
        coordinates: [75.78, 26.89]
      },
      status: "red",
      startsAt: t(-10),
      endsAt: t(60),
      affectedSignals: [
        "traffic",
        "rainfall"
      ],
      description:
        "Deep water accumulation blocking transit.",
      updatedAt: t(-1)
    });
  }

  const suddenChanges = [];

  if (currentTick >= 4) {
    suddenChanges.push({
      id: "sc-1",
      zoneId: "B",
      signalId: "traffic",
      from: 42,
      to: 81,
      detectedAt: t(-1),
      severity: "red"
    });

    suddenChanges.push({
      id: "sc-2",
      zoneId: "C",
      signalId: "incidents",
      from: 0,
      to: 5,
      detectedAt: t(-2),
      severity: "amber"
    });

    suddenChanges.push({
      id: "sc-3",
      zoneId: "B",
      signalId: "waterlogging",
      from: 0,
      to: 15,
      detectedAt: t(-4),
      severity: "red"
    });
  } else if (currentTick >= 1) {
    suddenChanges.push({
      id: "sc-4",
      zoneId: "B",
      signalId: "rainfall",
      from: 1,
      to: 10,
      detectedAt: t(-2),
      severity: "amber"
    });
  }

  const timeline = [];

  if (currentTick >= 4) {
    timeline.push({
      id: "tl-1",
      t: t(-1),
      zoneId: "B",
      text:
        "Zone B traffic index crossed Critical threshold (81%).",
      severity: "red"
    });

    timeline.push({
      id: "tl-2",
      t: t(-2),
      zoneId: "C",
      text:
        "Zone C reported 5 new incidents in the last 15 mins.",
      severity: "amber"
    });
  }

  if (currentTick >= 1) {
    timeline.push({
      id: "tl-3",
      t: t(-5),
      zoneId: "B",
      text:
        "Zone B rainfall crossed Moderate threshold.",
      severity: "amber"
    });
  }

  timeline.push({
    id: "tl-4",
    t: t(-60),
    zoneId: "A",
    text:
      "System daily diagnostic completed normally.",
    severity: "green"
  });

  timeline.sort(
    (a, b) =>
      dayjs(b.t).valueOf() -
      dayjs(a.t).valueOf()
  );

  return {
    city: {
      id: "city-1",
      name: "Jaipur",
      center: [26.91, 75.80],
      updatedAt: t(0)
    },

    signalTypes: [
      {
        id: "waterlogging",
        label: "Waterlogging",
        unit: "cm",
        category: "Environment",
        icon: "droplets",
        higherIsWorse: true
      },

      {
        id: "air_quality",
        label: "Air Quality",
        unit: "AQI",
        category: "Environment",
        icon: "shield-alert",
        higherIsWorse: true
      },

      {
        id: "gas_leak",
        label: "Gas Leaks",
        unit: "ppm",
        category: "Safety",
        icon: "alert-triangle",
        higherIsWorse: true
      },

      {
        id: "construction",
        label: "Roadworks",
        unit: "sites",
        category: "Infrastructure",
        icon: "construction",
        higherIsWorse: true
      }
    ],

    zones,

    events,

    suddenChanges,

    timeline,

    sources: [
      {
        signalId: "traffic",
        updatedAt: t(-1)
      },
      {
        signalId: "rainfall",
        updatedAt: t(-3)
      },
      {
        signalId: "incidents",
        updatedAt: t(-2)
      }
    ]
  };
};