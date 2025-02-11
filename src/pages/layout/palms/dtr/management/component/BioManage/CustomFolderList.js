import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { useBio } from "../../context/BioManageProvider";
import { formatDate } from "../../util/datetimeformat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import { Skeleton } from "@mui/material";

export default function CustomFolderList({ data, historyLoading }) {
  const { getExecData } = useBio();
  const deviceName = (id) =>
    getExecData.find((item) => item.device_id == id).device_name;
  return (
    <List sx={{ width: "100%", maxWidth: "100%", bgcolor: "paper.background" }}>
      {data.map((item, index) => (
        <>
          {historyLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="76px"
              sx={{
                marginBottom: "10px",
              }}
            />
          ) : (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                height: "76px",
                marginBottom: "10px",
              }}
            >
              <ListItemAvatar sx={{ paddingTop: "10px" }}>
                {item.status == "success" && (
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <CheckCircleIcon />
                  </Avatar>
                )}
                {item.status == "failed" && (
                  <Avatar sx={{ bgcolor: "error.main" }}>
                    <CancelIcon />
                  </Avatar>
                )}
                {item.status == "pending" && (
                  <Avatar sx={{ bgcolor: "text.disabled" }}>
                    <PauseCircleFilledIcon />
                  </Avatar>
                )}
                {item.status == "processing" && (
                  <Avatar sx={{ bgcolor: "info.main" }}>
                    <PendingIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                sx={{ flex: "1" }}
                primary={deviceName(item.device_id)}
                secondary={formatDate(item.datestart)}
              />
              <ListItemText
                primary="Status"
                secondary={item.status}
                sx={{ flex: ".6" }}
              />
              <ListItemText
                primary="Executed"
                secondary={formatDate(item.updated_at)}
                sx={{ flex: "1" }}
              />
              <ListItemText
                primary="Remark"
                secondary={item.error_message}
                sx={{ flex: "1.2" }}
              />
            </ListItem>
          )}
        </>
      ))}
    </List>
  );
}
