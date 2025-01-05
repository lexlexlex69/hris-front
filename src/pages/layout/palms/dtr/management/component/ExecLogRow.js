import React from "react";

function ExecLogRow({ data, handleRowClick, formatDate, index }) {
  return (
    <div
      className="bioTest-container"
      key={index}
      onClick={() => handleRowClick(data.date)}
    >
      <div className="bioTest-sub-container">
        <p>Date:</p>
        <div className="bioTest-date-info">
          <svg
            className="bioTest-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
            />
          </svg>
          <span className="bioTest-row-date">{formatDate(data.date)}</span>
        </div>
      </div>
      <div className="bioTest-sub-container">
        <p className="bioTest-reason-text">Status:</p>
        <div className="bioTest-status">
          {data.complete ? (
            <div className="bioTest-status-badge">
              <svg
                className="bioTest-badge-icon"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 11.917 9.724 16.5 19 7.5"
                />
              </svg>
              Completed
            </div>
          ) : (
            <div
              className="bioTest-status-badge"
              style={{
                background: "rgb(254 226 226)",
                color: "rgb(153 27 27)",
              }}
            >
              <svg
                className="bioTest-badge-icon"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              Incomplete
            </div>
          )}
        </div>
      </div>

      <div className="bioTest-sub-container">
        <p className="bioTest-reason-text">Attempt Execution:</p>
        <span>
          {data.totalStatus1}/{data.totalExec}
        </span>
      </div>

      <div className="bioTest-sub-container">
        <p className="bioTest-reason-text">Executed Devices:</p>
        <span>
          {data.totalDeviceStatus1.length}/{data.totalDevices.length}
        </span>
      </div>

      <div className="bioTest-action">
        <button
          className="bioTest-details-button"
          onClick={() => handleRowClick(data.date)}
        >
          View details
        </button>
      </div>
    </div>
  );
}

export default ExecLogRow;
