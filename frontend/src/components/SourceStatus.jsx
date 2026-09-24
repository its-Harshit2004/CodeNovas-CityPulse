function SourceStatus({ sourceStatus }) {
  if (!sourceStatus) return null;

  return (
    <div className="source-status">
      <h3>Data Sources</h3>

      <div className="source-status__list">
        {Object.entries(sourceStatus).map(([source, status]) => (
          <div className="source-status__item" key={source}>
            <span className="source-status__name">
              {source.charAt(0).toUpperCase() + source.slice(1)}
            </span>

            <span
              className={`source-status__badge source-status__badge--${status}`}
            >
              {status === "ok" ? "Online" : status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SourceStatus;