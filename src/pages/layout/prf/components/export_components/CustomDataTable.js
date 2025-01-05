import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useCallback, useMemo } from 'react';

function CustomDataTable({ data, setData, editToggler, maxHeight }) {
  const handleInputChange = useCallback((e, rowIndex, columnName) => {
    const newData = [...data];
    newData[rowIndex][columnName] = e.target.value || "N/A";
    setData(newData);
  }, [data, setData]);

  const memoizedTableHead = useMemo(() => (
    <TableHead>
      <TableRow>
        {data.length > 0 && Object.keys(data[0]).map((key) => (
          <TableCell key={key} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}>
            {key.toUpperCase()}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  ), [data]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: maxHeight ? maxHeight : 530 }}>
        <Table stickyHeader aria-label="sticky table" size='small'>
          {memoizedTableHead}
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(row).map((column) => (
                  <TableCell key={column}>
                    {editToggler ? (
                      <input
                        type="text"
                        value={row[column] || "N/A"}
                        onChange={(e) => handleInputChange(e, rowIndex, column)}
                      />
                    ) : (
                      row[column] || "N/A"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default CustomDataTable;
