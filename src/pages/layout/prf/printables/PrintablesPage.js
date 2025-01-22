import React, { useEffect, useRef, useState } from "react";
import PrfProvider from "../PrfProvider";
import "./prf_printable.css";
import TabComponent from "./components/TabComponent";
import { useParams } from "react-router-dom";
import { get_all_prf_summaryOfCandidContent } from "../axios/prfRequest";
import PrintableContent from "./components/PrintableContent";
import { useReactToPrint } from "react-to-print";
import { usePrfData } from "./context/PrintableDataProvider";
import CustomModal from "./components/CustomModal";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Button, Fab, Snackbar, Tooltip } from "@mui/material";

const drawerWidth = 410;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PrintablesPage() {
  const { process, prf_id } = useParams();
  console.log("process", process);
  const {
    setPrfId,
    fetchPrintableContent,
    showModal,
    setProcessType,
    saveAllchanges,
    toastOpen,
    setToastOpen,
    handleToastClose,
  } = usePrfData();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const action = (
    <React.Fragment>
      {/* <Button size="small" onClick={handleToastClose}>
        Close
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleToastClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (prf_id) {
      console.log("useEffect prf_id", prf_id);
      setPrfId(prf_id);
      // fetchPrintableContent(prf_id);
    }
    if (process) {
      setProcessType(process);
    }
  }, [prf_id]);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Summary of Candidates",
  });
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#c9c9c9",
        height: "auto",
        marginTop: "-10px",
      }}
    >
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "fixed",
            top: "64px",
            backgroundColor: "white",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <TabComponent process={process} />
      </Drawer>
      <Main open={open}>
        <Box sx={{ display: "flex", height: "100%" }}>
          <Box
            sx={{
              // bgcolor: "blue"
              position: "relative",
              padding: "0px 30px",
            }}
          >
            <Box
              sx={{
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                // bgcolor: "red",
                marginTop: "8px",
                marginLeft: "-20px",
              }}
            >
              <Tooltip title="Open Menu" placement="right" arrow>
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </Fab>
              </Tooltip>

              <Tooltip title="Save all changes" placement="right" arrow>
                <Fab
                  color="success"
                  aria-label="add"
                  onClick={() => {
                    saveAllchanges({
                      prf_id,
                      file_name: process,
                    });
                  }}
                >
                  <SaveIcon />
                </Fab>
              </Tooltip>
              <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={handleToastClose}
                message="Successfully Saved!"
                action={action}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                ContentProps={{
                  sx: { bgcolor: "#4caf50", color: "white", fontWeight: "500" },
                }}
              />
              <Tooltip title="Print" placement="right" arrow>
                <Fab color="red" aria-label="add" onClick={handlePrint}>
                  <PrintIcon />
                </Fab>
              </Tooltip>
            </Box>
          </Box>
          <DrawerHeader />
          <Box
            sx={{
              // backgroundColor: "yellow",
              width: "100%",
              overflow: "auto",
              padding: "15px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PrintableContent ref={printRef} process={process} />
          </Box>
        </Box>
      </Main>
    </Box>
  );
}
