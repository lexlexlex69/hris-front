import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

function Total({data}) {
  return (
    <Table size='small'>
        <TableBody>
            <TableRow>
                <TableCell align="center" sx={{color:'red'}}>{data.types.reduce((acc,{total}) => acc + Number(total),0)}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
  )
}

export default Total