import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Jo({ data }) {
    return (
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell align="center">
                        {data.types.map((x, i) => x.emp_status === 'JO' ? x.sex[1] ? x.sex[1].total : null : null)}
                    </TableCell>
                    <TableCell align="center">
                        {data.types.map((x, i) => x.emp_status === 'JO' ? x.sex[0] ? x.sex[0].total : null : null)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default Jo