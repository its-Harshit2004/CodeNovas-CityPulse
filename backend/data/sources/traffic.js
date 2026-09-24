require("dotenv").config();

const zones = require("../config/zones");

async function getTrafficData() {

    const apiKey = process.env.TOMTOM_API_KEY;

    if (!apiKey) {
        throw new Error("TOMTOM_API_KEY is missing from .env");
    }

    const results = [];

    for (const [zoneId, zone] of Object.entries(zones)) {

        const url =
            `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json` +
            `?key=${apiKey}` +
            `&point=${zone.latitude},${zone.longitude}` +
            `&unit=kmph`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Traffic API failed for Zone ${zoneId}: ${response.status}`
            );
        }

        const data = await response.json();

        const flow = data.flowSegmentData;

        const currentSpeed = flow.currentSpeed;
        const freeFlowSpeed = flow.freeFlowSpeed;

        let congestion = 0;

        if (freeFlowSpeed > 0) {
            congestion =
                (1 - currentSpeed / freeFlowSpeed) * 100;
        }

        congestion = Math.max(
            0,
            Math.min(100, congestion)
        );

        results.push({
            zone: zoneId,
            timestamp: new Date().toISOString(),
            congestion: Number(congestion.toFixed(2))
        });
    }

    return results;
}

module.exports = {
    getTrafficData
};