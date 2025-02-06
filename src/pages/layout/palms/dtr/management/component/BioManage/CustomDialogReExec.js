import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useBio } from "../../context/BioManageProvider";
import { Typography } from "@mui/material";
import CustomAccordionReExec from "./CustomAccordionReExec";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomDialogReExec() {
  const { reExecDialog, handleClosereExecDialog, reExecPayload, handleReExec } =
    useBio();
  console.log("devices", reExecPayload);
  return (
    <React.Fragment>
      <Dialog
        open={reExecDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosereExecDialog}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={"lg"}
        scroll={"paper"}
        sx={{ zIndex: 9999 }}
      >
        <DialogTitle>
          <Typography
            variant="h4"
            sx={{ padding: "10px 10px", borderRadius: "5px", color: "white" }}
            bgcolor={"#1976d2"}
          >
            Re-Execute
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {/* {JSON.stringify(reExecPayload)} */}
            <Typography variant="h5">Devices:</Typography>
            {reExecPayload?.map((item) => (
              <>
                <CustomAccordionReExec data={[item]} />
              </>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosereExecDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleReExec}>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
