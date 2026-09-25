const baselines = {
  A: {
    traffic: 40,
    incidents: 2
  },

  B: {
    traffic: 35,
    incidents: 3
  },

  C: {
    traffic: 40,
    incidents: 2
  },

  D: {
    traffic: 30,
    incidents: 2
  },

  E: {
    traffic: 45,
    incidents: 3
  }
};

function getBaseline(zoneId) {
  return baselines[zoneId] || {
    traffic: 0,
    incidents: 0
  };
}

module.exports = { getBaseline };