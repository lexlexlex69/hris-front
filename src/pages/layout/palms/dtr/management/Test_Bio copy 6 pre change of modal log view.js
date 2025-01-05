import React, { useEffect, useState } from "react";
import { testBiofetch } from "./DTRManagementRequests";
import "./mystylebio.css";
import { fakeResponse } from "./fakedata";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
    const month = months.find((month) => month.value === value);
    return month ? month.label : "Month not found";
  }

  const date = new Date();
  const month = date.getMonth() + 1; // e.g., "December"
  const year = date.getFullYear(); // e.g., 2024

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

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
      console.log("itemreduce", item);
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
      } else {
        acc.push({
          date,
          data: [item],
          totalExec: 1,
          totalStatus1: item.status === "1" ? 1 : 0,
          totalDevices: [item.device_id],
          totalDeviceStatus1: item.status === "1" ? [item.device_id] : [],
        });
      }
      return acc;
    }, []);

    // Sort the grouped data by date initially in ascending order
    grouped.sort((a, b) => new Date(a.date) - new Date(b.date));
    setGroupedData(grouped);

    console.log("grouped", grouped);
  };
  const modalDataSetter = (date) => {
    const data = groupedData.find((item) => item.date === date);
    console.log(data);
    if (data) {
      const grouped = data.data.reduce((acc, item) => {
        const device_name = item.device_name; // Extract the date part
        const existingGroup = acc.find(
          (group) => group.device_name === device_name
        );
        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          acc.push({ device_name, data: [item] });
        }
        return acc;
      }, []);
      // Sort the grouped data by date initially in ascending order
      // grouped.data.sort(
      //   (a, b) => new Date(a.datetime_loaded) - new Date(b.datetime_loaded)
      // );
      console.log(grouped);
      setModalData({ date, data: grouped });
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
  useEffect(() => {
    fetchedData(fakeResponse);

    // testBiofetch(pay)
    //   .then((response) => {
    //     console.log("response", response.data);
    //     fetchedData(response.data);
    //     let data = response.data || fakeResponse;
    //     console.log("data", data);
    //   })
    //   .catch((error) => {
    //     // toast.error(error.message);
    //     console.log(error);
    //   });
  }, [selectedMonth, selectedYear]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState("all");
  const [modalShowFilter, setModalShowFilter] = useState("all");

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
    setExpandedRows({});
  };

  const years = Array.from(
    { length: year - 2020 + 1 },
    (_, index) => 2020 + index
  );
  //to be remove
  // const groupByDeviceName = (data) => {
  //   return data.reduce((acc, item) => {
  //     if (!acc[item.device_name]) {
  //       acc[item.device_name] = [];
  //     }
  //     acc[item.device_name].push(item);
  //     return acc;
  //   }, {});
  // };

  // const groupedData = groupByDeviceName(modalData);
  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (deviceName) => {
    setExpandedRows((prev) => ({
      ...prev,
      [deviceName]: !prev[deviceName],
    }));
    console.log(expandedRows);
  };

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

  return (
    <div className="bioTest-page">
      <h3 className="biotTest-title">Execution Log</h3>
      <div className="bioTest-main-container">
        <div className="bioTest-header ">
          <div className="bioTest-header-container">
            <div>
              <h4>{` ${getMonthLabel(selectedMonth)} ${selectedYear}`}</h4>
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
          <div>
            {/* <button onClick={toggleSortOrder}>
              Sort by Date: {isAscending ? "Descending" : "Ascending"}
            </button> */}
            <div class="bioTest-custom-dropdown-container">
              <label for="date" class="bioTest-custom-dropdown-sr-only">
                Sort Date:
              </label>
              <select
                id="date"
                class="bioTest-custom-dropdown-select"
                value={sortOrder}
                onChange={handleSortOrderChange}
              >
                <option selected value="Ascending">
                  Ascending
                </option>
                <option value="Descending">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div class="bioTest-custom-divider">
              {groupedData &&
                groupedData.map((data, index) => {
                  if (showFilter === "all") {
                    return (
                      <div
                        class="bioTest-container"
                        key={index}
                        onClick={() => handleRowClick(data.date)}
                      >
                        <div class="bioTest-sub-container">
                          <p>Date:</p>
                          <div class="bioTest-date-info">
                            <svg
                              class="bioTest-icon"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                              />
                            </svg>
                            <span className="bioTest-row-date">
                              {formatDate(data.date)}
                            </span>
                          </div>
                        </div>
                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Status:</p>
                          <div class="bioTest-status">
                            {data.totalDevices.length ===
                            data.totalDeviceStatus1.length ? (
                              <div class="bioTest-status-badge">
                                <svg
                                  class="bioTest-badge-icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 11.917 9.724 16.5 19 7.5"
                                  />
                                </svg>
                                Completed
                              </div>
                            ) : (
                              <div
                                class="bioTest-status-badge"
                                style={{
                                  background: "rgb(254 226 226)",
                                  color: "rgb(153 27 27)",
                                }}
                              >
                                <svg
                                  class="bioTest-badge-icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Incomplete
                              </div>
                            )}
                          </div>
                        </div>

                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Attempt Execution:</p>
                          <span>
                            {data.totalStatus1}/{data.totalExec}
                          </span>
                        </div>

                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Executed Devices:</p>
                          <span>
                            {data.totalDeviceStatus1.length}/
                            {data.totalDevices.length}
                          </span>
                        </div>

                        <div class="bioTest-action">
                          <button
                            class="bioTest-details-button"
                            onClick={() => handleRowClick(data.date)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  } else if (
                    data.totalDevices.length ===
                      data.totalDeviceStatus1.length &&
                    showFilter === "complete"
                  ) {
                    return (
                      <div
                        class="bioTest-container"
                        key={index}
                        onClick={() => handleRowClick(data.date)}
                      >
                        <div class="bioTest-sub-container">
                          <p>Date:</p>
                          <div class="bioTest-date-info">
                            <svg
                              class="bioTest-icon"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                              />
                            </svg>
                            <span className="bioTest-row-date">
                              {formatDate(data.date)}
                            </span>
                          </div>
                        </div>
                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Status:</p>
                          <div class="bioTest-status">
                            {data.totalDevices.length ===
                            data.totalDeviceStatus1.length ? (
                              <div class="bioTest-status-badge">
                                <svg
                                  class="bioTest-badge-icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 11.917 9.724 16.5 19 7.5"
                                  />
                                </svg>
                                Completed
                              </div>
                            ) : (
                              <div
                                class="bioTest-status-badge"
                                style={{
                                  background: "rgb(254 226 226)",
                                  color: "rgb(153 27 27)",
                                }}
                              >
                                <svg
                                  class="bioTest-badge-icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Incomplete
                              </div>
                            )}
                          </div>
                        </div>

                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Attempt Execution:</p>
                          <span>
                            {data.totalStatus1}/{data.totalExec}
                          </span>
                        </div>

                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Executed Devices:</p>
                          <span>
                            {data.totalDeviceStatus1.length}/
                            {data.totalDevices.length}
                          </span>
                        </div>

                        <div class="bioTest-action">
                          <button
                            class="bioTest-details-button"
                            onClick={() => handleRowClick(data.date)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  }
                  if (
                    data.totalDevices.length !==
                      data.totalDeviceStatus1.length &&
                    showFilter === "incomplete"
                  ) {
                    return (
                      <div
                        class="bioTest-container"
                        key={index}
                        onClick={() => handleRowClick(data.date)}
                      >
                        <div class="bioTest-sub-container">
                          <p>Date:</p>
                          <div class="bioTest-date-info">
                            <svg
                              class="bioTest-icon"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                              />
                            </svg>
                            <span className="bioTest-row-date">
                              {formatDate(data.date)}
                            </span>
                          </div>
                        </div>
                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Status:</p>
                          <div class="bioTest-status">
                            {data.totalDevices.length ===
                            data.totalDeviceStatus1.length ? (
                              <div class="bioTest-status-badge">
                                <svg
                                  class="bioTest-badge-icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 11.917 9.724 16.5 19 7.5"
                                  />
                                </svg>
                                Completed
                              </div>
                            ) : (
                              <div
                                class="bioTest-status-badge"
                                style={{
                                  background: "rgb(254 226 226)",
                                  color: "rgb(153 27 27)",
                                }}
                              >
                                <svg
                                  class="bioTest-badge-icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Incomplete
                              </div>
                            )}
                          </div>
                        </div>

                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Attempt Execution:</p>
                          <span>
                            {data.totalStatus1}/{data.totalExec}
                          </span>
                        </div>

                        <div class="bioTest-sub-container">
                          <p class="bioTest-reason-text">Executed Devices:</p>
                          <span>
                            {data.totalDeviceStatus1.length}/
                            {data.totalDevices.length}
                          </span>
                        </div>

                        <div class="bioTest-action">
                          <button
                            class="bioTest-details-button"
                            onClick={() => handleRowClick(data.date)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  }
                })}
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
                  width: "90vh",
                  backgroundColor: "white",
                  padding: "20px",
                  maxHeight: "80vh",
                  overflow: "hidden",
                  borderRadius: ".8rem",
                }}
                onClick={(event) => event.stopPropagation()} // Prevent event from bubbling up
              >
                <div className="bioTest-modal-header">
                  <h3>Logs for {formatDate(modalData.date)}</h3>
                  <div>
                    <button
                      type="button"
                      class="bioTest-button"
                      data-modal-toggle="readProductModal"
                      onClick={closeModal}
                    >
                      <svg
                        aria-hidden="true"
                        class="bioTest-svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      {/* <span class="sr-only">Close modal</span> */}
                    </button>
                    <div>
                      <div class="bioTest-custom-dropdown-container">
                        <label
                          for="date"
                          class="bioTest-custom-dropdown-sr-only"
                        >
                          Filter:
                        </label>
                        <select
                          id="date"
                          class="bioTest-custom-dropdown-select"
                          value={modalShowFilter}
                          onChange={handleModalShowFilter}
                        >
                          <option selected value="all">
                            All
                          </option>
                          <option value="successful">Successful</option>
                          <option value="unsuccessful">Unsuccessful</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="allLogVisibility"></label>
                        <button
                          onClick={() => setIsAllLogsVisible((prev) => !prev)}
                          name="allLogVisibility"
                        >
                          {isAllLogsVisible ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    overflow: "auto",
                    height: "500px",
                  }}
                >
                  <div class="bioTest-custom-divider">
                    {modalData &&
                      modalData.data.map((item) => {
                        if (modalShowFilter === "all")
                          return (
                            <React.Fragment key={item.device_name}>
                              {/* Main row */}

                              <div className="bioTest-modal-row">
                                <div>
                                  {item.data.some(
                                    (item) => item.status === "1"
                                  ) ? (
                                    <svg
                                      class="bioTest-modal-status-svg"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      class="bioTest-modal-status-svg2"
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
                                  <div class="bioTest-button-container">
                                    {item.data.some(
                                      (item) => item.status === "1"
                                    ) ? (
                                      ""
                                    ) : (
                                      <button
                                        type="button"
                                        class="bioTest-button-order-again"
                                      >
                                        <ReplayIcon fontSize="20" /> Execute
                                      </button>
                                    )}

                                    <button
                                      href="#"
                                      class="bioTest-button-view-details"
                                      onClick={() => {
                                        // console.log(history);
                                        toggleRow(item.device_name);
                                      }}
                                    >
                                      {expandedRows[item.device_name] ? (
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
                              {expandedRows[item.device_name] && (
                                <>
                                  <div className="bioTest-custom-divider2">
                                    {item.data.map((entry) => (
                                      <div
                                        key={entry.id}
                                        style={{
                                          backgroundColor:
                                            entry.status === "1"
                                              ? "#dcfce7"
                                              : "#fee2e2",
                                          padding: "10px 30px",
                                          fontSize: ".8rem",
                                        }}
                                      >
                                        <div colSpan="2">
                                          <div>
                                            <strong>Date:</strong>{" "}
                                            {entry.datetime_loaded}
                                          </div>
                                          <div>
                                            <strong>Status:</strong>{" "}
                                            {entry.status === "1"
                                              ? "Success"
                                              : "Failed"}
                                          </div>
                                          <div>
                                            <strong>Description:</strong>{" "}
                                            {entry.description}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </React.Fragment>
                          );
                        else if (
                          modalShowFilter === "successful" &&
                          item.data.some((item) => item.status === "1")
                        )
                          return (
                            <React.Fragment key={item.device_name}>
                              {/* Main row */}

                              <div className="bioTest-modal-row">
                                <div>
                                  {item.data.some(
                                    (item) => item.status === "1"
                                  ) ? (
                                    <svg
                                      class="bioTest-modal-status-svg"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      class="bioTest-modal-status-svg2"
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
                                  <div class="bioTest-button-container">
                                    {item.data.some(
                                      (item) => item.status === "1"
                                    ) ? (
                                      ""
                                    ) : (
                                      <button
                                        type="button"
                                        class="bioTest-button-order-again"
                                      >
                                        <ReplayIcon fontSize="20" /> Execute
                                      </button>
                                    )}

                                    <button
                                      href="#"
                                      class="bioTest-button-view-details"
                                      onClick={() => {
                                        // console.log(history);
                                        toggleRow(item.device_name);
                                      }}
                                    >
                                      {expandedRows[item.device_name] ? (
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
                              {expandedRows[item.device_name] && (
                                <>
                                  <div className="bioTest-custom-divider2">
                                    {item.data.map((entry) => (
                                      <div
                                        key={entry.id}
                                        style={{
                                          backgroundColor:
                                            entry.status === "1"
                                              ? "#dcfce7"
                                              : "#fee2e2",
                                          padding: "10px 30px",
                                          fontSize: ".8rem",
                                        }}
                                      >
                                        <div colSpan="2">
                                          <div>
                                            <strong>Date:</strong>{" "}
                                            {entry.datetime_loaded}
                                          </div>
                                          <div>
                                            <strong>Status:</strong>{" "}
                                            {entry.status === "1"
                                              ? "Success"
                                              : "Failed"}
                                          </div>
                                          <div>
                                            <strong>Description:</strong>{" "}
                                            {entry.description}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </React.Fragment>
                          );
                        else if (
                          modalShowFilter === "unsuccessful" &&
                          item.data.some((item) => item.status !== "1")
                        )
                          return (
                            <React.Fragment key={item.device_name}>
                              {/* Main row */}

                              <div className="bioTest-modal-row">
                                <div>
                                  {item.data.some(
                                    (item) => item.status === "1"
                                  ) ? (
                                    <svg
                                      class="bioTest-modal-status-svg"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      class="bioTest-modal-status-svg2"
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
                                  <div class="bioTest-button-container">
                                    {item.data.some(
                                      (item) => item.status === "1"
                                    ) ? (
                                      ""
                                    ) : (
                                      <button
                                        type="button"
                                        class="bioTest-button-order-again"
                                      >
                                        <ReplayIcon fontSize="20" /> Execute
                                      </button>
                                    )}

                                    <button
                                      href="#"
                                      class="bioTest-button-view-details"
                                      onClick={() => {
                                        // console.log(history);
                                        toggleRow(item.device_name);
                                      }}
                                    >
                                      {expandedRows[item.device_name] ? (
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
                              {expandedRows[item.device_name] && (
                                <>
                                  <div className="bioTest-custom-divider2">
                                    {item.data.map((entry) => (
                                      <div
                                        key={entry.id}
                                        style={{
                                          backgroundColor:
                                            entry.status === "1"
                                              ? "#dcfce7"
                                              : "#fee2e2",
                                          padding: "10px 30px",
                                          fontSize: ".8rem",
                                        }}
                                      >
                                        <div colSpan="2">
                                          <div>
                                            <strong>Date:</strong>{" "}
                                            {entry.datetime_loaded}
                                          </div>
                                          <div>
                                            <strong>Status:</strong>{" "}
                                            {entry.status === "1"
                                              ? "Success"
                                              : "Failed"}
                                          </div>
                                          <div>
                                            <strong>Description:</strong>{" "}
                                            {entry.description}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </React.Fragment>
                          );
                      })}
                  </div>
                </div>
              </div>

              {/*<table border="1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Device ID</th>
                  <th>Device Name</th>
                  <th>DateTime Loaded</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {modalData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>this{item.device_id}this</td>
                    <td>{item.device_name}</td>
                    <td>{item.datetime_loaded}</td>
                    <td>{item.status}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
                dataaaaaaaaaaa
              </tbody>
            </table> */}
            </div>
          )}
        </div>
      </div>
      {/* <ul>
        {testdata.map((item) => (
          <li key={item.id}>
            {item.device_name} - {item.datetime_loaded}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default Test_Bio;
