export const groupByDevice = (data) => {
  //   console.log("stringify", JSON.stringify(data));
  const grouped = data.reduce((acc, item) => {
    const device_id = item.device_id.trim();
    const device_name = item.device_name.trim();
    const datestart = item.datestart;
    const dateend = item.dateend;
    const existingGroup = acc.find((group) => group.device_id === device_id);
    if (existingGroup) {
      const existingDate = existingGroup.data.findIndex(
        (group) => group.datestart === datestart
      );
      if (existingDate >= 0) {
        existingGroup.data[existingDate].logs.push(item);
      } else {
        existingGroup.data.push({ datestart, logs: [item] });
      }
    } else {
      acc.push({
        device_id,
        device_name,
        data: [{ datestart, logs: [item] }],
      });
    }

    return acc;
  }, []);
  return grouped;
};
