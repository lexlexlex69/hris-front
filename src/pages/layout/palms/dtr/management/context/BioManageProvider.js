import { createContext, useContext, useEffect, useState } from "react";

import { currentMonth, currentYear, monthList } from "../util/datetimeformat";
import { getExecLogs, reExec } from "../util/requests";
import CustomDialogReExec from "../component/BioManage/CustomDialogReExec";
import CustomSnackbar from "../component/BioManage/CustomSnackBar";
import { groupByDevice } from "../util/process";

const BioStateContext = createContext();

export const BioContextProvider = ({ children }) => {
  const [date, setDate] = useState({
    month: null,
    year: null,
  });
  console.log(date);
  const [getExecData, setGetExecData] = useState();
  const [getExecDataError, setGetExecDataError] = useState();
  const [selectDevice, setSelectDevice] = useState(null);
  const [displayData, setDisplayData] = useState();
  const [modalData, setModalData] = useState();
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [reExecDialog, setReExecDialog] = useState(false);
  const [autoCompleteDeviceLoading, setAutoCompleteDeviceLoading] =
    useState(false);
  const [reExecPayload, setReExecPayload] = useState();
  const [showRows, setShowRows] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    desc: "",
    type: "",
  });

  const handleClick = (desc, type) => {
    setSnackDetails({
      desc,
      type,
    });
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  console.log("getExecData", getExecData);
  //   useEffect(() => {
  //     handleClick();
  //   }, [getExecDataError]);

  if (!date?.month && !date?.month) {
    const currentMonthConvert = monthList.find(
      (item) => item.id == currentMonth
    );
    setDate({
      month: currentMonthConvert,
      year: currentYear,
    });
  }
  getExecData && console.log("getExecData", getExecData);
  const handleTableRowClick = (date) => {
    setOpen(true);
  };

  const modalOpener = (title, dates) => {
    setOpen(true);
    setModalTitle(title);
    if (title === "Execution Log") {
      const toModal = displayData?.data.find((item) => item.datestart == dates);
      console.log("toModal", toModal);
      setModalData(toModal);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setModalTitle("");
    setModalData([]);
  };

  const handleDisplay = () => {
    setShowRows(true);
    setTimeout(() => {
      setShowRows(false);
    }, 300);
    const toDisplay = getExecData?.find(
      (item, index) => item.device_id == selectDevice?.device_id
    );
    console.log("toDisplay", toDisplay);
    setDisplayData(toDisplay);
  };
  const notificationData = getExecData
    ?.filter((item) => item.noFetchedDates.length != 0)
    .map((item) => ({
      ...item,
      data: item.data.filter(
        (item) => item.Success === 0 && item.Warning == 0 && item.Failed != 0
      ),
    }));

  const handleReExec = async () => {
    // console.log("payload", payload);
    handleClosereExecDialog();
    reExec(reExecPayload)
      .then((response) => {
        console.log("responseapi", response);
        handleClick("Process added to queue successfully. ", "success");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setSelectDevice(null);
    setAutoCompleteDeviceLoading(true);
    // setGetExecData(groupByDevice(fakeResponse2));
    // setAutoCompleteDeviceLoading(false);
    date?.month &&
      date?.month &&
      getExecLogs({
        datestart: `${date.year}-${date.month.id}-01`,
        dateend: `${date.year}-${date.month.id}-31`,
      })
        .then((response) => {
          console.log("responseapi", response);
          // console.log("responseapiconverted", groupByDevice(response.data));
          if (!response.data) {
            if (response.data == "Unauthorized Access") {
              setGetExecDataError(response.data);
            } else {
              setGetExecDataError("Error while fetching data");
            }
            handleClick(
              "Error while fetching data please reload the page.",
              "error"
            );
          } else {
            setGetExecData(groupByDevice(response.data));
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setAutoCompleteDeviceLoading(false);
        });
  }, [date]);

  const handleClickOpenModalReExec = (payload) => {
    setReExecDialog(true);
    setReExecPayload(payload);
  };
  const handleClosereExecDialog = () => {
    setReExecDialog(false);
    setReExecPayload();
  };
  return (
    <BioStateContext.Provider
      value={{
        date,
        setDate,
        getExecData,
        getExecDataError,
        selectDevice,
        setSelectDevice,
        displayData,
        handleTableRowClick,
        handleCloseModal,
        modalData,
        open,
        modalTitle,
        modalOpener,
        notificationData,
        handleDisplay,
        handleReExec,
        autoCompleteDeviceLoading,
        reExecDialog,
        setReExecDialog,
        handleClickOpenModalReExec,
        handleClosereExecDialog,
        reExecPayload,
        showRows,
        openSnack,
        handleCloseSnack,
        snackDetails,
      }}
    >
      <CustomDialogReExec />
      <CustomSnackbar />
      {children}
    </BioStateContext.Provider>
  );
};

export const useBio = () => useContext(BioStateContext);
