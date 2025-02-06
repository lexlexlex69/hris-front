export const filterData = (arr, type) => {
  if (type === 0) {
    return arr;
  }
  if (type === 1) {
    const result = arr.filter((item) => item.datestart !== item.dateend);
    console.log("result", result);
    return result;
  }

  if (type === "show0status") {
    const result = arr.filter((item) => item.status == 0);
    console.log("result", result);
    return result;
  }
};

export const groupByDevice = (data) => {
  //   console.log("stringify", JSON.stringify(data));
  const grouped = data.reduce((acc, curr) => {
    // Find or create an entry for the current device
    let deviceEntry = acc.find((item) => item.device_id === curr.device_id);

    if (!deviceEntry) {
      deviceEntry = {
        device_id: curr.device_id,
        device_name: curr.device_name,
        data: [],
        noFetchedDates: [],
      };
      acc.push(deviceEntry);
    }

    // Find or create an entry for the current date
    let dateEntry = deviceEntry.data.find(
      (item) => item.datestart === curr.datestart
    );

    if (!dateEntry) {
      dateEntry = {
        datestart: curr.datestart,
        logs: [],
        Success: 0,
        Warning: 0,
        Failed: 0,
        totalFetched: 0,
      };
      deviceEntry.data.push(dateEntry);
    }

    // Add log and update counts
    const fetchedCount = curr.description.match(
      /(\d+) data fetched successfully/
    )?.[1];
    if (curr.status === "1") {
      if (curr.description.includes("Success")) {
        dateEntry.Success++;
      }
      if (curr.description.includes("Warning")) {
        dateEntry.Warning++;
      }
      dateEntry.totalFetched += fetchedCount ? parseInt(fetchedCount, 10) : 0;
    } else if (curr.status === "0") {
      dateEntry.Failed++;
    }

    dateEntry.logs.push(curr);

    if (
      dateEntry.Success == 0 &&
      dateEntry.Warning == 0 &&
      dateEntry.Failed != 0 &&
      !deviceEntry.noFetchedDates.find((item) => item == curr.datestart)
    ) {
      deviceEntry.noFetchedDates.push(curr.datestart);
    }
    if (dateEntry.Success > 0 || dateEntry.Warning > 0) {
      // deviceEntry.noFetchedDates = deviceEntry.noFetchedDates.filter(item => item === curr.datestart)
      const index = deviceEntry.noFetchedDates.indexOf(curr.datestart);

      // Check if the element exists in the array
      if (index > -1) {
        // Remove the element at the found index
        deviceEntry.noFetchedDates.splice(index, 1);
      }
    }

    return acc;
  }, []);
  return grouped;
};
