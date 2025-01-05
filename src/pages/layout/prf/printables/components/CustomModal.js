import React, { useState } from "react"
import { usePrfData } from "../context/PrintableDataProvider"

function CustomModal({ showModal }) {
  const {
    closeModal,
    handleRowClick,
    fetchEmployeeByName,
    employeeList,
    handleModalRowClick,
    modalTitle,
  } = usePrfData()
  const [name, setName] = useState()

  const forHandleClickRow = (data) => {
    if (modalTitle && modalTitle === "PREPARED BY") {
      handleModalRowClick({
        prepared_by: `${data.fname} ${data.mname} ${data.lname} ${data.extname}`,
        prepared_by_position: data.position_name,
      })
    } else if (modalTitle && modalTitle === "ENDORSED BY") {
      handleModalRowClick({
        endorsed_by: `${data.fname} ${data.mname} ${data.lname} ${data.extname}`,
        endorsed_by_position: data.position_name,
        endorsed_by_department: data.dept_title,
      })
    }
  }
  return (
    <>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
            backgroundColor: "#2a2a2a73",
            overflow: "hidden",
          }}
          onClick={closeModal}
          className="PRF_Modal_CustomInput"
        >
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -45%)",
              width: "60vw",
              backgroundColor: "white",
              padding: "20px",
              maxHeight: "80vh",
              overflow: "hidden",
              borderRadius: ".8rem",
            }}
            onClick={(event) => event.stopPropagation()} // Prevent event from bubbling up
          >
            <div className="bioTest-modal-header ">
              <div className="bioTest-modal-title">
                <div>
                  <h3>Test</h3>
                </div>
                <div>
                  <button
                    type="button"
                    className="bioTest-button"
                    data-modal-toggle="readProductModal"
                    onClick={closeModal}
                  >
                    <svg
                      aria-hidden="true"
                      className="bioTest-svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {/* <span className="sr-only">Close modal</span> */}
                  </button>
                </div>
              </div>
              <div className="bioTest-modal-inputs-container ">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />{" "}
                <button onClick={() => fetchEmployeeByName(name)}>
                  Search
                </button>
              </div>
            </div>
            <div
              style={{
                overflow: "auto",
                height: "500px",
              }}
            >
              <div className="bioTest-custom-divider">
                {employeeList &&
                  employeeList.map((item, index) => (
                    <p key={index} onClick={() => forHandleClickRow(item)}>
                      {item.fname} {!item.mname && !item.mname} {item.lname}{" "}
                      {!item.extname && item.extname} {item.position_name}{" "}
                      {item.dept_title}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CustomModal
