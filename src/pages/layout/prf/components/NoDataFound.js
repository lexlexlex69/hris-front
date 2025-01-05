import { TableRow, TableCell } from "@mui/material";

function NoDataFound({spanNo}) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={spanNo} align="center">
          No data found
        </TableCell>
      </TableRow>
    </>
  );
}

export default NoDataFound;
