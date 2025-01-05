import React, { useEffect, useState } from "react";
import { testBiofetch } from "./DTRManagementRequests";
import "./mystylebio.css";
import { fakeResponse } from "./fakedata";

function Test_Bio() {
  const sample = [
    { stat: "stat1", dId: 1 },
    { stat: "stat1", dId: 2 },
    { stat: "stat2", dId: 3 },
    { stat: "stat2", dId: 4 },
  ];

  const red = sample.reduce((acc, arr) => {
    if (!acc[arr.stat]) {
      acc[arr.stat] = [];
    }
    acc[arr.stat].push(arr.dId);
    return acc;
  }, {});

  console.log("stat", red);
  const [testdata, setTestdata] = useState(null);
  const [datedata, setDatedate] = useState(null);
  const [uniqueDates, setUniqueDates] = useState([]);
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

  console.log({ month }, { year });
  // const pay = {
  //   datestart: `2024-11-19`,
  //   dateend: `2024-11-20`,
  // };
  const pay = {
    datestart: `${selectedYear}-${selectedMonth}-01`,
    dateend: `${selectedYear}-${selectedMonth}-31`,
  };
  useEffect(() => {
    testBiofetch(pay)
      .then((response) => {
        console.log("response", response.data);
        // const red2 = response.data.reduce((acc, arr) => {
        //   // Extract the date part (YYYY-MM-DD) from datetime_loaded
        //   const date = arr.datetime_loaded.split(" ")[0];

        //   if (!acc[date]) {
        //     acc[date] = [];
        //   }

        //   acc[date].push(arr);
        //   return acc;
        // }, {});

        // console.log("red2", red2);
        // const sortedData = response.data.sort((a, b) => {
        //   return new Date(a.datetime_loaded) - new Date(b.datetime_loaded);
        // });
        // setTestdata(sortedData);
        // console.log("testdata", testdata);
        // const uniqueDates = Array.from(
        //   new Set(
        //     response.data.map((item) => item.datetime_loaded.split(" ")[0])
        //   )
        // );

        // console.log(uniqueDates);
        let data = response.data || fakeResponse;
        console.log("data", data);
        const devicesLatestStatus = data.reduce((acc, item) => {
          const { device_id, datetime_loaded, status } = item;
          if (
            !acc[device_id] ||
            acc[device_id].datetime_loaded < datetime_loaded
          ) {
            acc[device_id] = { datetime_loaded, status };
          }
          return acc;
        }, {});
        console.log("devicesLatestStatus", devicesLatestStatus);

        // Determine if each device is successfully fetched
        const successfullyFetchedDevices = Object.entries(
          devicesLatestStatus
        ).reduce((acc, [device_id, data]) => {
          // console.log("dev id", device_id, "data", data);
          if (data.status === "1") acc.push(device_id);
          return acc;
        }, []);
        console.log("successfullyFetchedDevices", successfullyFetchedDevices);

        // Group data by date and add successful device fetch counts
        const groupedData = data.reduce((acc, item) => {
          // const devicesLatestStatus = response.data.reduce((acc, item) => {
          //   const { device_id, datetime_loaded, status } = item;
          //   if (
          //     !acc[device_id] ||
          //     acc[device_id].datetime_loaded < datetime_loaded
          //   ) {
          //     acc[device_id] = { datetime_loaded, status };
          //   }
          //   return acc;
          // }, {});
          // console.log("devicesLatestStatus", devicesLatestStatus);

          // // Determine if each device is successfully fetched
          // const successfullyFetchedDevices = Object.entries(
          //   devicesLatestStatus
          // ).reduce((acc, [device_id, data]) => {
          //   if (data.status === "1") acc.push(device_id);
          //   return acc;
          // }, []);
          // console.log("successfullyFetchedDevices", successfullyFetchedDevices);

          const date = item.datetime_loaded.split(" ")[0]; // Extract the date part
          if (!acc[date]) {
            acc[date] = {
              date,
              fetches: 0,
              status0: 0,
              status1: 0,
              devices: new Set(),
              successfulDevices: 0,
            };
          }
          acc[date].fetches += 1;
          if (item.status === "0") {
            acc[date].status0 += 1;
          } else if (item.status === "1") {
            acc[date].status1 += 1;
          }
          acc[date].devices.add(item.device_id); // Add device ID to the Set
          // console.log("succ", successfullyFetchedDevices, item.device_id);
          // Count successful devices based on the latest fetch status
          if (
            successfullyFetchedDevices.includes(item.device_id)
            // && acc[date].successfulDevices === 0
          ) {
            // console.log(
            //   "successfullyFetchedDevices2",
            //   successfullyFetchedDevices
            // );
            acc[date].successfulDevices = acc[date].successfulDevices + 1; // Avoid double counting
            // acc[date].successfulDevices = successfullyFetchedDevices.length; // Avoid double counting
          }
          return acc;
        }, {});

        // console.log("group data", groupedData);

        // Convert grouped data to an array and format output
        const resultArray = Object.values(groupedData).map((data) => ({
          ...data,
          devices: data.devices.size, // Convert Set size to a number
        }));
        setDatedate(resultArray);
      })
      .catch((error) => {
        // toast.error(error.message);
        console.log(error);
      });
  }, [selectedMonth, selectedYear]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = (date) => {
    console.log("date", date);
    setSelectedDate(date);
    // setModalData(groupedData[date]);
    setShowModal(true);
    let data = fakeResponse;
    setModalData(data);
    // testBiofetch({
    //   datestart: date,
    //   dateend: date,
    // })
    //   .then((response) => {
    //     console.log("response", response.data);
    //     let data = response.data || fakeResponse;
    //     setModalData(data);
    //   })
    //   .catch((error) => {
    //     // toast.error(error.message);
    //     console.log(error);
    //   });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setModalData([]);
    setExpandedRows({});
  };

  const years = Array.from(
    { length: year - 2020 + 1 },
    (_, index) => 2020 + index
  );

  const groupByDeviceName = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.device_name]) {
        acc[item.device_name] = [];
      }
      acc[item.device_name].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByDeviceName(modalData);
  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (deviceName) => {
    setExpandedRows((prev) => ({
      ...prev,
      [deviceName]: !prev[deviceName],
    }));
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div className="bioTest-page">
      <div className="bioTest-header">
        <h2>{`Execution Log for ${getMonthLabel(
          selectedMonth
        )} ${selectedYear}`}</h2>
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
        </div>
      </div>

      <div>
        {/* <table border="1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Fetch Executed</th>
              <th>Success Fetch</th>
              <th>Failed Fetch</th>
              <th>Fetched devices</th>
              <th>successfulDevices</th>
            </tr>
          </thead>
          <tbody>
            {datedata &&
              datedata.map((date, indx) => (
                <tr key={indx} onClick={() => handleRowClick(date.date)}>
                  <td>{date.date}===</td>
                  <td>{date.fetches}===</td>
                  <td>{date.status1}===</td>
                  <td>{date.status0}===</td>
                  <td>{date.devices}===</td>
                  <td>{date.successfulDevices}===</td>
                </tr>
              ))}
          </tbody>
        </table> */}
        <div>
          <div class="bioTest-custom-divider">
            {datedata &&
              datedata.map((data, index) => (
                <div class="bioTest-container" key={index}>
                  <div class="bioTest-sub-container">
                    <p>Date:</p>
                    <div class="bioTest-date-info">
                      <svg
                        class="bioTest-icon"
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
                          d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                        />
                      </svg>
                      <span>{formatDate(data.date)}</span>
                    </div>
                  </div>

                  <div class="bioTest-sub-container">
                    <p class="bioTest-reason-text">Total Execution:</p>
                    <span>{data.fetches}</span>
                  </div>
                  <div class="bioTest-sub-container">
                    <p class="bioTest-reason-text">Successful Execution:</p>
                    <span>{data.status1}</span>
                  </div>
                  {/* <div class="bioTest-sub-container">
                    <p class="bioTest-reason-text">Unsuccessful Execution:</p>
                    <span>{data.status0}</span>
                  </div> */}
                  <div class="bioTest-sub-container">
                    <p class="bioTest-reason-text">Total Devices:</p>
                    <span>{data.devices}</span>
                  </div>
                  <div class="bioTest-sub-container">
                    <p class="bioTest-reason-text"> Successful Devices:</p>
                    <span>{data.successfulDevices}</span>
                  </div>

                  <div class="bioTest-status">
                    {data.devices < data.successfulDevices ? (
                      <span class="bioTest-status-badge">
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
                      </span>
                    ) : (
                      <span
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
                      </span>
                    )}
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
              ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70vh",
              backgroundColor: "white",
              padding: "20px",
              border: "1px solid black",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div className="bioTest-modal-header">
              <h3>Logs for {formatDate(selectedDate)}</h3>
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
              </div>
            </div>
            <table
              border="1"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>Device Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([deviceName, history]) => (
                  <React.Fragment key={deviceName}>
                    {/* Main row */}
                    <tr
                    // style={{
                    //   backgroundColor:
                    //     history[history.length - 1].status === "1"
                    //       ? "green"
                    //       : "red",
                    // }}
                    >
                      <td>
                        {history[history.length - 1].status === "1" ? (
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
                        {deviceName}
                        {/* {history[history.length - 1].datetime_loaded} */}
                        {history[history.length - 1].status === "1"
                          ? " Success"
                          : "Failed"}
                        {history[history.length - 1].status === "0" ? (
                          <button>Re-fetch</button>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            console.log(history);
                            toggleRow(deviceName);
                          }}
                        >
                          {expandedRows[deviceName]
                            ? "Hide History"
                            : "Show History"}
                        </button>
                      </td>
                    </tr>
                    {/* Expanded history rows */}
                    {expandedRows[deviceName] &&
                      history.map((entry) => (
                        <tr
                          key={entry.id}
                          style={{
                            backgroundColor:
                              entry.status === "1" ? "green" : "red",
                          }}
                        >
                          <td colSpan="2">
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
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

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
