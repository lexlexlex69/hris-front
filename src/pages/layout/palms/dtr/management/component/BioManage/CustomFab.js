import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { Badge, Button, Typography, useMediaQuery } from "@mui/material";
import { useBio } from "../../context/BioManageProvider";
import CustomAccordionNoFetch from "./CustomAccordionNoFetch";
import ReplayIcon from "@mui/icons-material/Replay";
import CircularProgress from "@mui/material/CircularProgress";
import { CustomCenterModal } from "../../../../../prf/components/export_components/ExportComp";

export default function CustomFab() {
  const {
    notificationData,
    handleCloseModal,
    open,
    modalTitle,
    modalOpener,
    autoCompleteDeviceLoading,
    getExecDataError,
  } = useBio();
  console.log("notificationData", notificationData);

  const notificationTotalCount = notificationData?.length;
  return (
    <>
      <CustomModalNoFetch
        openner={open}
        modalTitle={modalTitle}
        comptitle={modalTitle}
        handleCloseBTN={handleCloseModal}
        data={notificationData}
      />
      <Box>
        <Fab
          color="warning"
          aria-label="add"
          onClick={() => {
            modalOpener("Failed Fetch");
          }}
          disabled={getExecDataError || autoCompleteDeviceLoading}
          size="small"
        >
          <Badge
            badgeContent={
              getExecDataError || autoCompleteDeviceLoading
                ? 0
                : notificationTotalCount
            }
            color="error"
          >
            {getExecDataError || autoCompleteDeviceLoading ? (
              <>
                <CircularProgress color="inherit" size={20} />
              </>
            ) : (
              <>
                <NotificationImportantIcon sx={{ margin: "5px" }} />
              </>
            )}
          </Badge>
        </Fab>
      </Box>
    </>
  );
}

function CustomModalNoFetch({
  openner,
  modalTitle,
  comptitle,
  handleCloseBTN,
  data,
}) {
  const matches = useMediaQuery("(min-width: 565px)");
  const { handleClickOpenModalReExec } = useBio();
  console.log("customfab", data);

  const handleReExecAll = () => {
    const payload = data?.map((item) => ({
      device_id: item.device_id,
      dates: item.noFetchedDates,
    }));
    // console.log(payload);
    // handleReExec(payload);
    handleClickOpenModalReExec(payload);
  };
  return (
    <CustomCenterModal
      key={"open1"}
      compSize={"40%"}
      matches={matches}
      openner={openner && modalTitle === "Failed Fetch"}
      comptitle={comptitle}
      handleCloseBTN={handleCloseBTN}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              textAlign: "center",
              boxShadow: 3,
              padding: "10px 20px",
              bgcolor: "#ff4747",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h3" color="white">
              {data?.length}
            </Typography>
            <Typography color="white"> Failed Devices</Typography>
          </Box>
          <Button variant="contained" onClick={handleReExecAll}>
            <ReplayIcon sx={{ marginRight: "5px" }} />
            Re-Execute All
          </Button>
        </Box>

        <Box sx={{ overflow: "auto", height: "60vh", padding: "5px 0px" }}>
          <CustomAccordionNoFetch data={data ? data : []} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={handleCloseBTN}>
            Cancel
          </Button>
        </Box>
      </Box>
    </CustomCenterModal>
  );
}
