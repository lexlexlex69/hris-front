import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import { formatDateTime } from "../../util/datetimeformat";

export default function CustomAccordion({ data }) {
  const bgAssign = (item) => {
    let color = "";
    if (item.includes("Success")) {
      color = "success.main";
    }
    if (item.includes("Failed")) {
      color = "error.main";
    }
    if (item.includes("Warning")) {
      color = "warning.main";
    }
    return color;
  };
  console.log(data);
  return (
    <div>
      {data?.logs?.map((item, index) => (
        <Accordion
          key={index}
          disableGutters
          //  defaultExpanded
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={item.datestart}
            id={item.datestart}
          >
            <Typography>
              #{item.id} {formatDateTime(item.datetime_loaded)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                bgcolor: bgAssign(item.description),
                padding: "10px 5px",
                borderRadius: "5px",
              }}
            >
              <Typography component="h1" color="#FFF">
                {item.description}
              </Typography>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
