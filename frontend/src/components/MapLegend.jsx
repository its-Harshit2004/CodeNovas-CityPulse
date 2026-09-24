/**
 * MapLegend — compact floating glass panel over the map explaining zone status colors.
 * Always visible. Positioned bottom-left of the map.
 */

const LEGEND_ITEMS = [
  { key: "normal",  label: "Normal",       dotClass: "normal" },
  { key: "medium",  label: "Medium Alert", dotClass: "medium" },
  { key: "high",    label: "High Alert",   dotClass: "high"   },
  { key: "no_data", label: "No Data",      dotClass: "nodata" },
];

export function MapLegend() {
  return (
    <div
      className="map-legend"
      role="complementary"
      aria-label="Zone status legend"
    >
      <div className="legend-title">Zone Status</div>
      {LEGEND_ITEMS.map(({ key, label, dotClass }) => (
        <div key={key} className="legend-item">
          <div
            className={`legend-dot ${dotClass}`}
            aria-hidden="true"
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
