function MetricCard({ title, value, unit }) {
  return (
    <div className="metric-card">
      <p className="metric-card__title">{title}</p>

      <div className="metric-card__value">
        <span>{value}</span>
        {unit && <small>{unit}</small>}
      </div>
    </div>
  );
}

export default MetricCard;




