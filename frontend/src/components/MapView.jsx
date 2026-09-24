function MapView({ zoneId, alertActive }) {
  return (
    <div className="map-view">
      <div className="map-view__header">
        <h3>Zone Map</h3>
        <span>
          Zone {zoneId}
        </span>
      </div>

      <div className="map-view__placeholder">
        <div
          className={`map-view__zone ${
            alertActive ? "map-view__zone--alert" : ""
          }`}
        >
          Zone {zoneId}
        </div>

        <p>
          Interactive city map will appear here.
        </p>
      </div>
    </div>
  );
}

export default MapView;