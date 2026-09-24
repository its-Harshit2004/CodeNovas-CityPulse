function ZoneSelector({ selectedZone, onZoneChange }) {
  const zones = ["A", "B", "C"];

  return (
    <div className="zone-selector">
      <label htmlFor="zone">Select Zone</label>

      <select
        id="zone"
        value={selectedZone}
        onChange={(e) => onZoneChange(e.target.value)}
      >
        {zones.map((zone) => (
          <option key={zone} value={zone}>
            Zone {zone}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ZoneSelector;