import React, { useEffect } from "react";

function ModalCustomInput({
  modalSearch,
  handleModalSearchChange,
  setModalFilteredData,
  modalData,
}) {
  useEffect(() => {
    const filteredItems = modalData.data.filter((item) =>
      item.device_name.toLowerCase().includes(modalSearch.toLowerCase())
    ); // Filter items based on the search query
    setModalFilteredData(filteredItems);
    // modalData && console.log(filteredItems);
  }, [modalSearch]);
  return (
    <>
      <div className="bioTest-custom-inputText">
        <div className="bioTest-custom-inputText-icon-container">
          <svg
            className="bioTest-custom-inputText-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          className="bioTest-custom-inputText-input"
          type="text"
          placeholder="Device name"
          value={modalSearch}
          onChange={handleModalSearchChange}
        />
        <button
          type="submit"
          className="bioTest-button-order-again custom-button-2"
        >
          Search
        </button>
      </div>
    </>
  );
}

export default ModalCustomInput;
