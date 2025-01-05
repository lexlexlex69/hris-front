import React, { useEffect, useState } from "react";
import { testBiofetch } from "./DTRManagementRequests";
import "./mystylebio.css";
import { fakeResponse } from "./fakedata";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ModalCustomInput from "./component/ModalCustomInput";
import ModalRow from "./component/ModalRow";
import ExecLogRow from "./component/ExecLogRow";

function Test_Bio() {
  const [datedata, setDatedate] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  // const [isAscending, setIsAscending] = useState(true);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  function getMonthLabel(value) {
    const month = months.find((month) => month.value == value);
    // console.log(value);
    return month ? month.label : "Month not found";
  }

  const date = new Date();
  const month = date.getMonth() + 1; // e.g., "December"
  const year = date.getFullYear(); // e.g., 2024

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [collectedDate, setCollectedDate] = useState({
    year: year,
    month: month,
  });
  const [modalFilteredData, setModalFilteredData] = useState(null);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    console.log("Selected Month:", month); // You can handle this value as needed
  };
  const handleYearChange = (year) => {
    setSelectedYear(year);
    console.log("Selected Year:", year); // You can handle this value as needed
  };

  // const pay = {
  //   datestart: `2024-11-19`,
  //   dateend: `2024-11-20`,
  // };
  const pay = {
    datestart: `${selectedYear}-${selectedMonth}-01`,
    dateend: `${selectedYear}-${selectedMonth}-31`,
  };

  //ver2
  const fetchedData = (response) => {
    const grouped = response.reduce((acc, item) => {
      // console.log("itemreduce", item);
      const date = item.datetime_loaded.split(" ")[0]; // Extract the date part
      const existingGroup = acc.find((group) => group.date === date);
      if (existingGroup) {
        existingGroup.data.push(item);
        existingGroup.totalExec = existingGroup.totalExec + 1;
        if (item.status === "1")
          existingGroup.totalStatus1 = existingGroup.totalStatus1 + 1;
        if (!existingGroup.totalDevices.includes(item.device_id))
          existingGroup.totalDevices.push(item.device_id);
        if (
          !existingGroup.totalDeviceStatus1.includes(item.device_id) &&
          item.status === "1"
        )
          existingGroup.totalDeviceStatus1.push(item.device_id);
        if (
          existingGroup.totalDevices.length ===
          existingGroup.totalDeviceStatus1.length
        )
          existingGroup.complete = true;
        else if (
          existingGroup.totalDevices.length !==
          existingGroup.totalDeviceStatus1.length
        )
          existingGroup.complete = false;
      } else {
        acc.push({
          date,
          data: [item],
          totalExec: 1,
          totalStatus1: item.status === "1" ? 1 : 0,
          totalDevices: [item.device_id],
          totalDeviceStatus1: item.status === "1" ? [item.device_id] : [],
          complete: false,
        });
      }
      return acc;
    }, []);

    // Sort the grouped data by date initially in ascending order
    grouped.sort((a, b) => new Date(a.date) - new Date(b.date));
    setGroupedData(grouped);

    console.log("grouped", grouped);
    const failedDevices = execLogFailedDevices(response);
    const sucessDevices = execLogSuccessfulDevices(response);
    console.log("sucessDevices", sucessDevices);
    const totalArray = sucessDevices.map((successItem) => {
      // Find the corresponding failed entry for the same date
      const failedItem = failedDevices.find(
        (failedItem) => failedItem.date === successItem.date
      );

      // If a corresponding failed entry exists, remove common devices
      const uniqueDevices = failedItem
        ? failedItem.devices.filter(
            (device) => !successItem.devices.includes(device)
          )
        : []; // If no failed entry, default to an empty array

      return { date: successItem.date, devices: uniqueDevices };
    });
    setForPayload(totalArray);
    console.log("totalArray", totalArray);
  };
  const execLogFailedDevices = (response) => {
    const grouped = response.reduce((acc, item) => {
      // console.log("itemreduce", item);
      const date = item.datetime_loaded.split(" ")[0]; // Extract the date part
      const device_id = item.device_id;

      const existingGroup = acc.find((group) => group.date === date);
      // console.log("existingGroup", existingGroup);
      if (existingGroup) {
        if (!existingGroup.devices.includes(device_id) && item.status == 0)
          existingGroup.devices.push(item.device_id);
      } else if (!existingGroup && item.status == 0) {
        acc.push({
          date,
          devices: [item.device_id],
        });
      }
      // const failedDevices = data.data.reduce((acc, item) => {
      //   const device_id = item.device_id;
      //   if (!acc.includes(device_id) && item.status == 0) {
      //     acc.push(device_id);
      //   }
      //   return acc;
      // }, []);
      return acc;
    }, []);

    // Sort the grouped data by date initially in ascending order
    grouped.sort((a, b) => new Date(a.date) - new Date(b.date));
    // setGroupedData("failedExec", grouped);

    console.log("failedExec", grouped);
    return grouped;
  };
  const execLogSuccessfulDevices = (response) => {
    const grouped = response.reduce((acc, item) => {
      // console.log("itemreduce", item);
      const date = item.datetime_loaded.split(" ")[0]; // Extract the date part
      const device_id = item.device_id;

      const existingGroup = acc.find((group) => group.date === date);
      // console.log("existingGroup", existingGroup);
      if (existingGroup) {
        if (!existingGroup.devices.includes(device_id) && item.status == 1)
          existingGroup.devices.push(item.device_id);
      } else if (!existingGroup && item.status == 1) {
        acc.push({
          date,
          devices: [item.device_id],
        });
      }
      return acc;
    }, []);

    // Sort the grouped data by date initially in ascending order
    grouped.sort((a, b) => new Date(a.date) - new Date(b.date));
    // setGroupedData("failedExec", grouped);
    console.log("successfulExec", grouped);
    return grouped;
  };
  const modalDataSetter = (date) => {
    const data = groupedData.find((item) => item.date === date);
    console.log("data", data);
    if (data) {
      const grouped = data.data.reduce((acc, item) => {
        const device_name = item.device_name; // Extract the date part
        const existingGroup = acc.find(
          (group) => group.device_name === device_name
        );
        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          acc.push({
            device_name,
            device_id: item.device_id,
            data: [item],
            isAllLogVisible: false,
          });
        }
        return acc;
      }, []);
      const failedDevices = data.data.reduce((acc, item) => {
        const device_id = item.device_id;
        if (!acc.includes(device_id) && item.status == 0) {
          acc.push(device_id);
        }
        return acc;
      }, []);
      // Sort the grouped data by date initially in ascending order
      // grouped.data.sort(
      //   (a, b) => new Date(a.datetime_loaded) - new Date(b.datetime_loaded)
      // );
      console.log("modalgrouped", grouped);
      setModalData({ date, data: grouped, failedDevices });
    }
  };

  const [sortOrder, setSortOrder] = useState("Ascending");

  const handleSortOrderChange = (event) => {
    console.log(event.target.value);
    setSortOrder(event.target.value);
    const sorted = [...groupedData].sort((a, b) => {
      return sortOrder === "Ascending"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
    setGroupedData(sorted);
  };
  // const toggleSortOrder = () => {
  //   setIsAscending(!isAscending);

  //   // Sort the grouped data based on the new order
  //   const sorted = [...groupedData].sort((a, b) => {
  //     return isAscending
  //       ? new Date(b.date) - new Date(a.date)
  //       : new Date(a.date) - new Date(b.date);
  //   });
  //   setGroupedData(sorted);
  //   console.log("sorted", sorted);
  // };
  const handleDisplay = () => {
    testBiofetch(pay)
      .then((response) => {
        console.log("response", response.data);
        fetchedData(response.data);
        // let data = response.data || fakeResponse;
        console.log("selectedMonth", selectedMonth);
        setCollectedDate({
          year: selectedYear,
          month: selectedMonth,
        });
      })
      .catch((error) => {
        // toast.error(error.message);
        console.log(error);
      });
  };
  const [forPayLoad, setForPayload] = useState(null);
  useEffect(() => {
    // fetchedData(fakeResponse);

    testBiofetch(pay)
      .then((response) => {
        console.log("response", response.data);
        fetchedData(response.data);
        let data = response.data || fakeResponse;
        console.log("data", data);
      })
      .catch((error) => {
        // toast.error(error.message);
        console.log(error);
      });
  }, []);
  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState("all");
  const [modalShowFilter, setModalShowFilter] = useState("all");
  modalData && console.log("modalData", modalData);

  const handleShowFilter = (type) => {
    console.log(type);
    setShowFilter(type);
  };
  const handleModalShowFilter = (event) => {
    console.log(event.target.value);
    setModalShowFilter(event.target.value);
  };

  const handleRowClick = (date) => {
    // console.log("date", date);
    // setSelectedDate(date);
    // setModalData(groupedData[date]);
    setShowModal(true);
    // let data = fakeResponse;
    // setModalData(data);
    modalDataSetter(date);
    console.log("modalData", modalData);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData([]);
    setIsAllLogsVisible(false);
    setModalShowFilter("all");
  };

  const years = Array.from(
    { length: year - 2020 + 1 },
    (_, index) => 2020 + index
  );

  // const groupedData = groupByDeviceName(modalData);
  const [expandedRows, setExpandedRows] = useState({});
  const toggleModalRow = (deviceName) => {
    setModalFilteredData((prevItems) => {
      // console.log("prevItems", prevItems);

      return prevItems.map((row) =>
        row.device_name === deviceName
          ? { ...row, isAllLogVisible: !row.isAllLogVisible }
          : row
      );
    });
    console.log("modalgroupedtoogle", modalData);
  };

  const toggleAllrow = () => {
    setIsAllLogsVisible((prev) => {
      const newVisibility = !prev;
      setModalFilteredData((prev) =>
        prev.map((item) => ({
          ...item,
          isAllLogVisible: newVisibility,
        }))
      );

      return newVisibility;
    });
  };
  useEffect(() => {
    const isAllLogsVisibleTrue =
      modalFilteredData &&
      modalFilteredData.every((item) => item.isAllLogVisible);
    isAllLogsVisibleTrue &&
      !isAllLogsVisible &&
      setIsAllLogsVisible(isAllLogsVisibleTrue);

    const isAllLogsVisibleFalse =
      modalFilteredData &&
      modalFilteredData.every((item) => !item.isAllLogVisible);
    isAllLogsVisibleFalse &&
      isAllLogsVisible &&
      setIsAllLogsVisible(!isAllLogsVisibleFalse);
  }, [modalFilteredData, setModalFilteredData]);

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const [isAllLogsVisible, setIsAllLogsVisible] = useState(false);

  const [modalSearch, setModalSearch] = useState(""); // To store the search query
  const handleModalSearchChange = (e) => {
    setModalSearch(e.target.value); // Update the search query
  };

  // useEffect(() => {
  //   const filteredItems = modalData.data.filter((item) =>
  //     item.device_name.toLowerCase().includes(modalSearch.toLowerCase())
  //   ); // Filter items based on the search query
  //   modalData && console.log(filteredItems);
  // }, [modalSearch, setModalSearch]);

  const handleReExec = (e, arr) => {
    e.stopPropagation();
    // if (type === "perDate") {
    //   console.log(dates, devices);
    // }

    console.log("handleReExec", arr);
  };
  modalFilteredData && console.log("modalFilteredData", modalFilteredData);

  return (
    <div className="bioTest-page">
      <h3 className="biotTest-title">Execution Log</h3>
      <div className="bioTest-main-container">
        <div className="bioTest-header ">
          <div className="bioTest-header-container">
            <div>
              <h4>{` ${getMonthLabel(collectedDate.month)} ${
                collectedDate.year
              }`}</h4>
            </div>

            <div className="bioTest-header-right">
              <span>Month</span>
              <select
                onChange={(e) => handleMonthChange(e.target.value)}
                defaultValue={selectedMonth}
              >
                {/* <option value="">Select a month</option> */}
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <span>Year</span>

              <select
                onChange={(e) => handleYearChange(e.target.value)}
                defaultValue={selectedYear}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="bioTest-button-order-again"
                style={{
                  border: "none",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
                onClick={() => handleDisplay()}
              >
                Display
              </button>
            </div>
          </div>
        </div>

        <div className="bioTest-header bioTest-header-after">
          <div className="bioTest-radiobutton-group">
            <span>Show:</span>
            <div>
              <input
                type="radio"
                id="showAll"
                name="showInput"
                onChange={() => handleShowFilter("all")}
                checked={showFilter === "all"}
              />
              <label htmlFor="showAll">All</label>
            </div>
            <div>
              <input
                type="radio"
                id="showComplete"
                name="showInput"
                onChange={() => handleShowFilter("complete")}
                checked={showFilter === "complete"}
              />
              <label htmlFor="showComplete">Completed</label>
            </div>
            <div>
              <input
                type="radio"
                id="showIncomplete"
                name="showInput"
                onChange={() => handleShowFilter("incomplete")}
                checked={showFilter === "incomplete"}
              />
              <label htmlFor="showIncomplete">Incomplete</label>
            </div>
          </div>
          <div className="bioTest-custom-actions-container">
            <div className="bioTest-custom-dropdown-container">
              <label htmlFor="date" className="bioTest-custom-dropdown-sr-only">
                Sort Date:
              </label>
              <select
                id="date"
                className="bioTest-custom-dropdown-select"
                value={sortOrder}
                onChange={handleSortOrderChange}
              >
                <option defaultValue value="Ascending">
                  Ascending
                </option>
                <option value="Descending">Descending</option>
              </select>
            </div>
            <div
              className="bioTest-reExec-button-container"
              style={{ border: "none" }}
            >
              <button
                type="button"
                className="bioTest-button-order-again"
                onClick={(e) => {
                  handleReExec(e, forPayLoad);
                }}
              >
                <ReplayIcon fontSize="20" /> Re-execute All
              </button>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div className="bioTest-custom-divider">
              {groupedData ? (
                groupedData.map((data, index) => {
                  if (showFilter === "all") {
                    return (
                      <>
                        <ExecLogRow
                          data={data}
                          index={index}
                          handleRowClick={handleRowClick}
                          formatDate={formatDate}
                        />
                      </>
                    );
                  } else if (data.complete && showFilter === "complete") {
                    return (
                      <>
                        <ExecLogRow
                          data={data}
                          index={index}
                          handleRowClick={handleRowClick}
                          formatDate={formatDate}
                        />
                      </>
                    );
                  }
                  if (!data.complete && showFilter === "incomplete") {
                    return (
                      <>
                        <ExecLogRow
                          data={data}
                          index={index}
                          handleRowClick={handleRowClick}
                          formatDate={formatDate}
                        />
                      </>
                    );
                  }
                })
              ) : (
                <>
                  <h1>No</h1>
                </>
              )}
            </div>
          </div>

          {/* Modal */}
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
                      <h3>Logs for {formatDate(modalData.date)}</h3>
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
                  <div className="bioTest-modal-inputs-container">
                    <ModalCustomInput
                      modalData={modalData}
                      modalSearch={modalSearch}
                      setModalData={setModalData}
                      handleModalSearchChange={handleModalSearchChange}
                      setModalFilteredData={setModalFilteredData}
                    />
                    <div className="bioTest-header-right-container">
                      <div className="bioTest-custom-dropdown-container">
                        <label
                          htmlFor="date"
                          className="bioTest-custom-dropdown-sr-only"
                        >
                          Filter:
                        </label>
                        <select
                          id="date"
                          className="bioTest-custom-dropdown-select"
                          value={modalShowFilter}
                          onChange={handleModalShowFilter}
                        >
                          <option defaultValue value="all">
                            All
                          </option>
                          <option value="successful">Successful</option>
                          <option value="unsuccessful">Unsuccessful</option>
                        </select>
                      </div>
                      <div className="bioTest-modal-show-container">
                        <label htmlFor="allLogVisibility">Show:</label>
                        <button
                          onClick={() => toggleAllrow()}
                          name="allLogVisibility"
                        >
                          {isAllLogsVisible ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bioTest-reExec-button-container">
                    <button
                      type="button"
                      className="bioTest-button-order-again"
                      onClick={(e) => {
                        const modalFailed = forPayLoad.find(
                          (item) => item.date === modalData.date
                        );
                        handleReExec(e, modalFailed);
                      }}
                    >
                      <ReplayIcon fontSize="20" /> Re-execute All
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
                    {modalFilteredData ? (
                      modalFilteredData.map((item) => {
                        if (modalShowFilter === "all")
                          return (
                            <>
                              <ModalRow
                                item={item}
                                toggleModalRow={toggleModalRow}
                                selectedDate={modalData.date}
                                handleReExec={handleReExec}
                              />
                            </>
                          );
                        else if (
                          modalShowFilter === "successful" &&
                          item.data.some((item) => item.status === "1")
                        )
                          return (
                            <>
                              <ModalRow
                                item={item}
                                toggleModalRow={toggleModalRow}
                                selectedDate={modalData.date}
                                handleReExec={handleReExec}
                              />
                            </>
                          );
                        else if (
                          modalShowFilter === "unsuccessful" &&
                          !item.data.some((item) => item.status === "1")
                        )
                          return (
                            <>
                              <ModalRow
                                item={item}
                                toggleModalRow={toggleModalRow}
                                selectedDate={modalData.date}
                                handleReExec={handleReExec}
                              />
                            </>
                          );
                      })
                    ) : (
                      <>Loading</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test_Bio;
