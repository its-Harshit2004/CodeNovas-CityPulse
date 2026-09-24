function AlertCard({ alert }) {
  if (!alert) return null;

  return (
    <div className={`alert-card alert-card--${alert.severity || "normal"}`}>
      <div className="alert-card__header">
        <span className="alert-card__status">
          {alert.active ? "Active Alert" : "No Active Alert"}
        </span>

        {alert.severity && (
          <span className="alert-card__severity">
            {alert.severity.toUpperCase()}
          </span>
        )}
      </div>

      <p className="alert-card__message">
        {alert.message}
      </p>
    </div>
  );
}

export default AlertCard;