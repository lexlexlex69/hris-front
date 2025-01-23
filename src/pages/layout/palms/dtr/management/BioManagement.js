import React, { useEffect, useState } from "react";
import { getExecLogs } from "./DTRManagementRequests";
import "./table.css";

function BioManagement() {
  const [loading, setLoading] = useState(false);
  const [getExecData, setGetExecData] = useState();

  const filterData = (arr, type) => {
    if (type === 0) {
      return arr;
    }
    if (type === 1) {
      const result = arr.filter((item) => item.datestart !== item.dateend);
      console.log("result", result);
      return result;
    }
  };
  useEffect(() => {
    setLoading(true);
    /// --------------     less than or equal || greater than or equal
    getExecLogs({ datestart: "2024-10-16", dateend: "2024-10-21" })
      .then((response) => {
        console.log("response.data", response.data);
        const filteredExec = response?.data && filterData(response.data, 0);
        setGetExecData(filteredExec);
        // setGetExecData(response.data);
        console.log("filteredExec", filteredExec);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <table>
        <caption>Front-end web developer course 2021</caption>
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">device_id</th>
            <th scope="col">device_name</th>
            <th scope="col">datetime_loaded</th>
            <th scope="col">status</th>
            <th scope="col">description</th>
            <th scope="col">datestart</th>
            <th scope="col">dateend</th>
          </tr>
        </thead>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <tbody>
            {getExecData &&
              getExecData.map((item, index) => (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.device_id}</td>
                  <td>{item.device_name}</td>
                  <td>{item.datetime_loaded}</td>
                  <td>{item.status}</td>
                  <td>{item.description}</td>
                  <td>{item.datestart}</td>
                  <td>{item.dateend}</td>
                </tr>
              ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default BioManagement;
