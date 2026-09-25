const path = require('path');
const fs = require('fs');

/**
 * Returns normalized civic data for a specific zone from the JSON fixture store.
 * @param {string} zoneId - e.g. "A", "B", "C"
 */
async function getNormalizedData(zoneId) {
  try {
    const filePath = path.join(__dirname, 'fixtures', 'citypulse.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const records = JSON.parse(rawData);

    const targetRecord = records.find(
      (r) => r.zone_id.toUpperCase() === zoneId.toUpperCase()
    );

    if (!targetRecord) {
      return records[0]; // Default fallback to Zone A
    }

    return targetRecord;
  } catch (error) {
    console.error('Error reading normalized data fixture:', error);
    throw error;
  }
}

module.exports = {
  getNormalizedData
};
