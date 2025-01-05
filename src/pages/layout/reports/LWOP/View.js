import { Table, TableBody, TableCell, TableContainer, TableHead } from "@mui/material";
import { useState } from "react";

const tableHeader = [
    { id: 1, headerName: 'name', width: 100 },
    { id: 1, headerName: 'office', width: 100 },
    { id: 1, headerName: 'leave period', width: 100 },
    { id: 1, headerName: 'no. of days', width: 100 },
    { id: 1, headerName: 'date received', width: 100 },
    { id: 1, headerName: 'date reported', width: 100 },
    { id: 1, headerName: 'leave in-charge', width: 100 },
    { id: 1, headerName: 'remarks', width: 100 },
];

const LWOPView = () => {
    // const [columnData, setColumnData] = useState(null)
    const [rowData, setRowData] = useState([])

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {tableHeader.map((i, ix) => (
                                <TableCell> {i.headerName} </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default React.memo(LWOPView);