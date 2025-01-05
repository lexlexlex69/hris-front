import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomFileUpload({ setData, setSheetNm }) {
  const [sheets, setSheets] = useState([]);
  const [sheetName, setSheetName] = useState("");
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    toast.info('Upload processing...', { autoClose: 2000 }); // Show processing toast

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      setFileData(data);  // Store file data in state
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetNames = workbook.SheetNames;
      setSheets(sheetNames);
      toast.success('Upload done!', { autoClose: 2000 }); // Show done toast
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast.error('Error reading file', { autoClose: 2000 }); // Show error toast
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSheetSelect = useCallback((sheetName) => {
    setSheetName(sheetName);
    setSheetNm(sheetName);
    if (!fileData) return;

    const workbook = XLSX.read(fileData, { type: 'array' });
    const worksheet = workbook.Sheets[sheetName];
    let jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "N/A" });

    // Ensure all rows have the same columns
    if (jsonData.length > 0) {
      const allKeys = Object.keys(jsonData[0]);
      jsonData = jsonData.map(row => {
        const updatedRow = { ...row };
        allKeys.forEach(key => {
          if (!updatedRow[key]) {
            updatedRow[key] = "N/A";
          }
        });
        return updatedRow;
      });
    }

    setData(jsonData);
  }, [fileData, setData, setSheetNm]);

  return (
    <>
      <Grid container spacing={1} sx={{ my: "8px" }}>
        <Grid item xs={12} lg={4} alignItems="end">
          <FormControl fullWidth>
            <TextField
              variant='standard'
              sx={{ height: "100%", padding: "2px" }}
              label="Upload excel file"
              InputLabelProps={{ shrink: true }}
              type="file"
              id="file-input"
              onChange={handleFileUpload}
            />
          </FormControl>
        </Grid>
        {sheets.length > 0 && (
          <Grid item xs={12} lg={4} alignItems="end">
            <FormControl fullWidth>
              <InputLabel id="fileupload-id">Excel File Upload</InputLabel>
              <Select
                labelId="fileupload-id"
                label="Excel File Upload"
                variant="outlined"
                value={sheetName}
                onChange={(e) => handleSheetSelect(e.target.value)}
              >
                <MenuItem value=""> Select a sheet </MenuItem>
                {sheets.map((sheet, idx) => (
                  <MenuItem key={idx} value={sheet}>
                    {sheet}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      <ToastContainer />
    </>
  );
}

export default CustomFileUpload;
