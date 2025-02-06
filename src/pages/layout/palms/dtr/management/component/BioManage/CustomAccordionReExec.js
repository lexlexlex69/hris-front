import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Chip, Typography } from "@mui/material";
import { formatDate, formatDateTime } from "../../util/datetimeformat";
import { useBio } from "../../context/BioManageProvider";

export default function CustomAccordionReExec({ data }) {
  const { getExecData } = useBio();
  console.log("deviceszz", data);
  return (
    <div>
      {data?.map((item, index) => (
        <Accordion key={index} disableGutters sx={{ marginTop: "10px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={item.datestart}
            id={item.datestart}
          >
            <Typography sx={{ fontWeight: "600" }}>
              {
                getExecData?.find((dat) => item.device_id == dat.device_id)
                  .device_name
              }{" "}
              ({item.dates.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {item.dates.map((date) => (
              <Chip label={formatDate(date)} sx={{ margin: "5px" }} />
              // <Typography>{formatDate(date)}</Typography>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
