import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import AlertCard from "../components/AlertCard";
import ZoneSelector from "../components/ZoneSelector";
import SourceStatus from "../components/SourceStatus";
import MapView from "../components/MapView";

import { getPulse } from "../services/api";

function Dashboard() {
  const [selectedZone, setSelectedZone] = useState("A");
  const [pulseData, setPulseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPulseData() {
      try {
        setLoading(true);
        setError("");

        const data = await getPulse(selectedZone);
        setPulseData(data);
      } catch (err) {
        setError("Unable to load CityPulse data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPulseData();
  }, [selectedZone]);

  if (loading) {
    return <p>Loading CityPulse data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!pulseData) {
    return <p>No data available.</p>;
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Live Civic Health Dashboard</p>
          <h1>CityPulse</h1>
        </div>

        <ZoneSelector
          selectedZone={selectedZone}
          onZoneChange={setSelectedZone}
        />
      </header>

      <section className="dashboard__metrics">
        <MetricCard
          title="Rainfall"
          value={pulseData.metrics.rain_mm}
          unit="mm"
        />

        <MetricCard
          title="Traffic"
          value={pulseData.metrics.traffic_pct}
          unit="%"
        />

        <MetricCard
          title="Incidents"
          value={pulseData.metrics.incidents}
        />
      </section>

      <section className="dashboard__alert">
        <AlertCard alert={pulseData.alert} />
      </section>

      <section className="dashboard__evidence">
        <h2>Supporting Evidence</h2>

        <ul>
          {pulseData.evidence.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="dashboard__map">
        <MapView
          zoneId={pulseData.zone_id}
          alertActive={pulseData.alert.active}
        />
      </section>

      <section className="dashboard__sources">
        <SourceStatus sourceStatus={pulseData.source_status} />
      </section>

      <footer className="dashboard__footer">
        Last updated:{" "}
        {new Date(pulseData.updated_at).toLocaleString()}
      </footer>
    </main>
  );
}

export default Dashboard;