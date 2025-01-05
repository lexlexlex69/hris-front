import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReplayIcon from "@mui/icons-material/Replay";

function ModalRow({ item, toggleModalRow, selectedDate, handleReExec }) {
  console.log("item", item);

  const handleReExecuteDevice = (e, device_id, selectedDate) => {
    e.stopPropagation();
    console.log("execute clicked", device_id, selectedDate);
  };
  return (
    <React.Fragment key={item.device_name}>
      {/* Main row */}

      <div
        className="bioTest-modal-row"
        onClick={() => {
          // console.log(history);
          toggleModalRow(item.device_name);
        }}
      >
        <div>
          {item.data.some((item) => item.status === "1") ? (
            <svg
              className="bioTest-modal-status-svg"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"></path>
            </svg>
          ) : (
            <svg
              className="bioTest-modal-status-svg2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"></path>
            </svg>
          )}
          {item.device_name}
        </div>

        <div>
          <div className="bioTest-button-container">
            {item.data.some((item) => item.status === "1") ? (
              ""
            ) : (
              <button
                type="button"
                className="bioTest-button-order-again"
                onClick={(e) => {
                  handleReExec(e, [
                    { date: selectedDate, devices: item.device_id },
                  ]);
                }}
              >
                <ReplayIcon fontSize="20" /> Execute
              </button>
            )}

            <button
              href="#"
              className="bioTest-button-view-details"
              onClick={() => {
                // console.log(history);
                toggleModalRow(item.device_name);
              }}
            >
              {item.isAllLogVisible ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
              History
            </button>
          </div>
        </div>
      </div>

      {/* Expanded history rows */}
      {item.isAllLogVisible && (
        <>
          <div className="bioTest-custom-divider2">
            {item.data.map((entry) => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: entry.status === "1" ? "#dcfce7" : "#fee2e2",
                  padding: "10px 30px",
                  fontSize: ".8rem",
                }}
              >
                <div colSpan="2">
                  <div>
                    <strong>Date:</strong> {entry.datetime_loaded}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {entry.status === "1" ? "Success" : "Failed"}
                  </div>
                  <div>
                    <strong>Description:</strong> {entry.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default ModalRow;
