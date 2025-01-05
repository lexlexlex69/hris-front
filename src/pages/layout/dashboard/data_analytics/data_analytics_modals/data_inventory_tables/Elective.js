import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Elective({data}) {
  return (
      <Table size="small">
          <TableBody>
              <TableRow>
                  <TableCell align="center">-</TableCell>
                  <TableCell align="center">-</TableCell>
              </TableRow>
          </TableBody>
      </Table>
  )
}

export default Elective