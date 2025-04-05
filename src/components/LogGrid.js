import React from "react";

const LogGrid = ({ gridData, title }) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <div className="eld-grid">
        {Array.from({ length: 24 }).map((_, hour) => (
          <React.Fragment key={hour}>
            {Array.from({ length: 4 }).map((_, quarter) => {
              const index = hour * 4 + quarter;
              const status = gridData[index] || 0;
              return (
                <div
                  key={`${hour}-${quarter}`}
                  className={`eld-cell ${status > 0 ? `status-${status}` : ""}`}
                  title={`Hour ${hour}:${quarter * 15} - Status: ${status}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LogGrid;
