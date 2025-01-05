import { FormControl, TextField } from '@mui/material';
import React, { useState } from 'react'

function CustomEditableCellDataTable({ value, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setCellValue(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(cellValue);
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <FormControl fullWidth>
          <TextField
            value={cellValue}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        </FormControl>
      ) : (
        cellValue
      )}
    </div>
  );
}

export default CustomEditableCellDataTable
