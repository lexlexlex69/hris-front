import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import HistoryIcon from "@mui/icons-material/History";
import {
  Badge,
  Button,
  Pagination,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useBio } from "../../context/BioManageProvider";
import CustomAccordionNoFetch from "./CustomAccordionNoFetch";
import ReplayIcon from "@mui/icons-material/Replay";
import CircularProgress from "@mui/material/CircularProgress";
import { CustomCenterModal } from "../../../../../prf/components/export_components/ExportComp";
import CustomFolderList from "./CustomFolderList";

export default function CustomFabHistory() {
  const {
    handleCloseModal,
    open,
    modalTitle,
    modalOpener,
    autoCompleteDeviceLoading,
    getExecDataError,
  } = useBio();

  return (
    <>
      <CustomModalNoFetch
        openner={open}
        modalTitle={modalTitle}
        comptitle={modalTitle}
        handleCloseBTN={handleCloseModal}
      />
      <Box>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            modalOpener("History");
          }}
          disabled={getExecDataError || autoCompleteDeviceLoading}
          size="small"
        >
          {getExecDataError || autoCompleteDeviceLoading ? (
            <>
              <CircularProgress color="inherit" size={20} />
            </>
          ) : (
            <>
              <HistoryIcon sx={{ margin: "5px" }} />
            </>
          )}
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
}) {
  const matches = useMediaQuery("(min-width: 565px)");
  const { pageNum, setPageNum, pageMax, getJobStatus, historyLoading } =
    useBio();
  const handleChange = (event, value) => {
    setPageNum(value);
  };
  return (
    <CustomCenterModal
      key={"open1"}
      compSize={"40%"}
      matches={matches}
      openner={openner && modalTitle === "History"}
      comptitle={comptitle}
      handleCloseBTN={handleCloseBTN}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box sx={{ overflow: "auto", height: "60vh", padding: "5px 0px" }}>
          <CustomFolderList
            data={getJobStatus?.data?.jobs?.data}
            historyLoading={historyLoading}
          />
        </Box>

        <Stack
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>Page: {pageNum}</Typography>
          <Pagination
            count={pageMax}
            page={pageNum}
            onChange={handleChange}
            disabled={historyLoading}
            size="large"
          />
        </Stack>
        {/* <Button variant="text" onClick={handleCloseBTN}>
            Close
          </Button> */}
      </Box>
    </CustomCenterModal>
  );
}
