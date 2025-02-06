import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useBio } from "../../context/BioManageProvider";

export default function CustomSnackbar() {
  const { openSnack, handleCloseSnack, snackDetails } = useBio();

  return (
    <div>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        sx={{ zIndex: "99999" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snackDetails?.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackDetails?.desc}
        </Alert>
      </Snackbar>
    </div>
  );
}
