import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useBio } from "../../context/BioManageProvider";
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
} from "@mui/material";
// import { CustomCenterModal } from "./CustomCenterModal";
import CustomAccordion from "./CustomAccordion";
import { formatDate } from "../../util/datetimeformat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplayIcon from "@mui/icons-material/Replay";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CustomCenterModal } from "../../../../../prf/components/export_components/ExportComp";

export default function CustomTableBio() {
  const {
    displayData,
    modalTitle,
    modalData,
    handleCloseModal,
    open,
    modalOpener,
    handleClickOpenModalReExec,
    showRows,
  } = useBio();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log("displayData", displayData);

  const columns = [
    {
      field: "Device Name",
      headerName: "Device name",

      // description: "This column has a value getter and is not sortable.",
      sortable: false,
      // width: "auto",
      flex: 1,
      valueGetter: (value, row) => `${row.logs[0].device_name} `,
      renderCell: (params) => (
        <Box sx={{ fontWeight: "bold", color: "#111111de" }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "datestart",
      headerName: "Date",
      headerAlign: "center",
      // width: 100,
      flex: 1,
      disableClickEventBubbling: true,
      valueGetter: (value, row) => `${formatDate(row.datestart)} `,
      renderCell: (params) => {
        const currentRow = params.row;
        const onClick = (e) => {
          console.log("currentRow", currentRow);
          currentRow && modalOpener("Execution Log", currentRow.datestart);
          // return alert(JSON.stringify(currentRow, null, 4))
        };

        return (
          <Box
            sx={{
              // bgcolor: "red",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chip
              label={formatDate(currentRow?.datestart)}
              onClick={onClick}
              sx
              icon={<CalendarMonthIcon />}
              color="primary"
              variant="outlined"
              size="medium"
            />
            {/* <CalendarMonthIcon /> */}
          </Box>
        );
      },
    },
    {
      field: "Success",
      headerName: "Success",
      // width: 130,
      flex: 0.5,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FiberManualRecordIcon sx={{ width: "12px" }} color="success" />
          {params.value}
        </Box>
      ),
    },
    {
      field: "Failed",
      headerName: "Failed",
      // width: 130,
      flex: 0.5,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FiberManualRecordIcon sx={{ width: "12px" }} color="error" />
          {params.value}
        </Box>
      ),
    },
    {
      field: "Warning",
      headerName: "Warning",
      // width: 130,
      flex: 0.5,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FiberManualRecordIcon sx={{ width: "12px" }} color="warning" />
          {params.value}
        </Box>
      ),
    },
    {
      field: "totalFetched",
      headerName: "Total fetch",
      // width: 130,
      flex: 0.7,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <EqualizerIcon sx={{ width: "15px" }} color="primary" />
          {params.value}
        </Box>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      // width: 180,
      sortable: false,
      flex: 0.2,
      disableClickEventBubbling: true,
      headerAlign: "center",

      renderCell: (params) => {
        const currentRow = params.row;
        const payload = [
          {
            device_id: currentRow.logs[0].device_id,
            dates: [currentRow.datestart],
          },
        ];
        const onClick = (e) => {
          const currentRow = params.row;
          currentRow && modalOpener("Execution Log", currentRow.datestart);
          // return alert(JSON.stringify(currentRow, null, 4))
        };

        // currentRow && console.log(payload);
        // handleReExec(payload);

        const open = Boolean(anchorEl);

        return (
          <Box
            sx={{
              // bgcolor: "red",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={onClick}>
                <OpenInNewIcon sx={{ marginRight: "5px" }} /> Open
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleClickOpenModalReExec(payload);
                }}
              >
                <ReplayIcon sx={{ marginRight: "5px" }} />
                Re-Exec
              </MenuItem>
            </Menu>
            {/* <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onClick}
              // sx={{ marginRight: "10px" }}
            >
              Open
            </Button>
            <Button variant="contained" size="small" onClick={reexec}>
            Re-Exec
            </Button> */}
          </Box>
        );
      },
    },
  ];
  const row = displayData && displayData?.data;
  function getRowId(row) {
    return row.datestart;
  }

  return (
    <div style={{ height: "auto", width: "100%" }}>
      <CustomModalDisplay
        openner={open}
        comptitle={modalTitle}
        handleCloseBTN={handleCloseModal}
        data={modalData}
        modalTitle={modalTitle}
      />
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <DataGrid
          rows={row && row}
          getRowId={getRowId}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          sx={{
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600, // Ensure column header text is bold
              color: "#111111de",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f9f9f9", // Light gray background for odd rows
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e0f7fa", // Light blue background when hovered
            },
            ".MuiDataGrid-row": {
              opacity: showRows ? 0 : 1,
              // maxHeight: showRows ? "100px" : "0px",
              transition: "opacity 0.5s ease, max-height 0.5s ease",
            },
          }}
          pageSizeOptions={[10, 20]}
          // checkboxSelection
        />
      </div>
    </div>
  );
}

function CustomModalDisplay({
  openner,
  comptitle,
  handleCloseBTN,
  data,
  modalTitle,
}) {
  const matches = useMediaQuery("(min-width: 565px)");
  console.log(data);
  return (
    <CustomCenterModal
      key={"open1"}
      compSize={"40%"}
      matches={matches}
      openner={openner && modalTitle === "Execution Log"}
      comptitle={comptitle}
      handleCloseBTN={handleCloseBTN}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box>
          <CustomAccordion data={data ? data : []} />
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
