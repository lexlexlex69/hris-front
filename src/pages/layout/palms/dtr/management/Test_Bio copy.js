import React, { useEffect, useState } from "react";
import { testBiofetch } from "./DTRManagementRequests";

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
    acc[arr.stat].push(arr);
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
  const pay = {
    datestart: `2024-11-19`,
    dateend: `2024-11-20`,
  };
  // const pay = {
  //   datestart: `${selectedYear}-${selectedMonth}-01`,
  //   dateend: `${selectedYear}-${selectedMonth}-31`,
  // };
  useEffect(() => {
    testBiofetch(pay)
      .then((response) => {
        console.log("response", response.data);
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

        // Group data by date and add successful device fetch counts
        const groupedData = response.data.reduce((acc, item) => {
          const devicesLatestStatus = response.data.reduce((acc, item) => {
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
            if (data.status === "1") acc.push(device_id);
            return acc;
          }, []);
          console.log("successfullyFetchedDevices", successfullyFetchedDevices);

          const date = item.datetime_loaded.split(" ")[0]; // Extract the date part
          if (!acc[date]) {
            acc[date] = {
              date,
              fetches: 0,
              status0: 0,
              status1: 0,
              devices: new Set(),
              successfulDevices: successfullyFetchedDevices.length,
            };
          }
          acc[date].fetches += 1;
          if (item.status === "0") {
            acc[date].status0 += 1;
          } else if (item.status === "1") {
            acc[date].status1 += 1;
          }
          acc[date].devices.add(item.device_id); // Add device ID to the Set

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
    setSelectedDate(date);
    // setModalData(groupedData[date]);
    setShowModal(true);
    testBiofetch({
      datestart: date,
      dateend: date,
    })
      .then((response) => {
        console.log("response", response.data);
        setModalData(response.data);
      })
      .catch((error) => {
        // toast.error(error.message);
        console.log(error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setModalData([]);
  };

  const years = Array.from(
    { length: year - 2012 + 1 },
    (_, index) => 2012 + index
  );

  return (
    <div>
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
      <select
        onChange={(e) => handleYearChange(e.target.value)}
        defaultValue={selectedYear}
      >
        {/* <option value="">Select a month</option> */}
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <h2>Sorted Data</h2>
      {/* {JSON.stringify(testdata)}
      {datedata &&
        datedata.map((data) => (
          <p>
            {data.date} {data.fetches} {data.status0} {data.status1}
          </p>
        ))} */}
      <div>
        <table border="1">
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
        </table>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              border: "1px solid black",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>Data for {selectedDate}</h3>
            <button onClick={closeModal}>Close</button>
            <table border="1">
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
            </table>
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
