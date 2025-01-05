import { Box, IconButton, Tooltip } from "@mui/material";
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
            <Tooltip title="View Personnel Request" arrow>
              <IconButton
                type="button"
                className="custom-iconbutton"
                color="primary"
              >
                <PreviewIcon />
              </IconButton>
              Summary of Candidates
            </Tooltip>
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
            <Tooltip title="View Personnel Request" arrow>
              <IconButton
                type="button"
                className="custom-iconbutton"
                color="primary"
              >
                <PreviewIcon />
              </IconButton>
              Employment Notice
            </Tooltip>
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
              <Tooltip title="View Personnel Request" arrow>
                <IconButton
                  type="button"
                  className="custom-iconbutton"
                  color="primary"
                >
                  <PreviewIcon />
                </IconButton>
                Notice of Employment
              </Tooltip>
            </Link>
            <Link
              //   to={`view-prf/${it.id}`}
              to={`view-printable/atr/` + tempReq.id}
              target={"_blank"}
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <Tooltip title="View Personnel Request" arrow>
                <IconButton
                  type="button"
                  className="custom-iconbutton"
                  color="primary"
                >
                  <PreviewIcon />
                </IconButton>
                Advice to Report
              </Tooltip>
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
            <Tooltip title="View Personnel Request" arrow>
              <IconButton
                type="button"
                className="custom-iconbutton"
                color="primary"
              >
                <PreviewIcon />
              </IconButton>
              Job Order
            </Tooltip>
          </Link>
        )}
      </Box>
    </>
  );
}
