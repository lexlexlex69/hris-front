import { Box, Fab, IconButton, Tooltip } from "@mui/material";
import {
  Preview as PreviewIcon,
  Assessment as AssessmentIcon,
  AssignmentTurnedInOutlined as AssignmentTurnedInIcon,
  NoteAltOutlined as NoteAltIcon,
  ContactPageOutlined as ContactPageIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Feed as FeedIcon,
} from "@mui/icons-material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PrfStateContext } from "../../pages/layout/prf/PrfProvider";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

export default function PrintPreviewButton() {
  const { openedPR, tempReq } = useContext(PrfStateContext);
  console.log("openedPR", openedPR);
  console.log("tempReq", tempReq);
  // console.log("printPreviewButton", data);
  return (
    <>
      <Box>
        {!openedPR && (
          <Link
            //   to={`view-prf/${it.id}`}
            to={`view-printable/summaryofcandid/` + tempReq.id}
            target={"_blank"}
            rel="noopener noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Fab variant="extended" size="medium" color="primary">
              <LocalPrintshopIcon sx={{ mr: 1 }} />
              Summary of Candidates
            </Fab>
          </Link>
        )}
        {openedPR === "Casual" && (
          <Link
            //   to={`view-prf/${it.id}`}
            to={`view-printable/en/` + tempReq.id}
            target={"_blank"}
            rel="noopener noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Fab variant="extended" size="medium" color="primary">
              <LocalPrintshopIcon sx={{ mr: 1 }} />
              Employment Notice
            </Fab>
          </Link>
        )}
        {openedPR === "Contract of Service" && (
          <>
            <Link
              //   to={`view-prf/${it.id}`}
              to={`view-printable/noe/` + tempReq.id}
              target={"_blank"}
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <Fab variant="extended" size="medium" color="primary">
                <LocalPrintshopIcon sx={{ mr: 1 }} />
                Notice of Employment
              </Fab>
            </Link>
            <Link
              //   to={`view-prf/${it.id}`}
              to={`view-printable/atr/` + tempReq.id}
              target={"_blank"}
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <Fab variant="extended" size="medium" color="primary">
                <LocalPrintshopIcon sx={{ mr: 1 }} />
                Advice to Report
              </Fab>
            </Link>
          </>
        )}
        {openedPR === "Job Order" && (
          <Link
            //   to={`view-prf/${it.id}`}
            to={`view-printable/jo/` + tempReq.id}
            target={"_blank"}
            rel="noopener noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Fab variant="extended" size="medium" color="primary">
              <LocalPrintshopIcon sx={{ mr: 1 }} />
              Job Order
            </Fab>
          </Link>
        )}
      </Box>
    </>
  );
}
