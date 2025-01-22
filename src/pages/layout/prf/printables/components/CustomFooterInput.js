import React, { useEffect, useState } from "react";
import "./CustomInput.css";
import { usePrfData } from "../context/PrintableDataProvider";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CustomCenterModal,
  phpPesoIntFormater,
} from "../../components/export_components/ExportComp";
import { toWords } from "number-to-words";
import CustomInputTemplate from "./CustomInputTemplate";
import { Item } from "./CustomNoeInput";

function CustomFooterInput({ title, defaultValue }) {
  console.log("defaultValue", defaultValue);
  const { footerTitle, setFooterTitle } = usePrfData();
  const [inputState, setInputState] = useState("");

  useEffect(() => {
    setFooterTitle(defaultValue);
  }, []);
  useEffect(() => {
    setInputState(footerTitle);
  }, [footerTitle]);

  return (
    <CustomInputTemplate title={title}>
      <Box>
        <TextField
          id="outlined-basic"
          label={`Footer Title`}
          variant="outlined"
          sx={{ width: "100%" }}
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setFooterTitle(inputState);
          }}
        >
          Save
        </Button>
      </Box>
    </CustomInputTemplate>
  );
}

export default CustomFooterInput;
