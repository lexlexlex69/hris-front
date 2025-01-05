import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Permanent({ data }) {
    return (
        <Table
            size='small'>
            <TableBody>
                <TableRow>
                    <TableCell align='left'>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell align='left'>
                                        <Table size='small'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align='left'>
                                                        {data?.pe_f_m_1}
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        {data?.pe_f_f_1}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell align='left'>
                                        <Table size='small'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align='left'>
                                                        {data?.pe_f_m_2}
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        {data?.pe_f_m_2}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableCell>
                    <TableCell align='left'>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell align='left'>
                                        <Table size='small'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align='left'>-</TableCell>
                                                    <TableCell align='left'>-</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell align='left'>
                                        <Table size='small'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align='left'>-</TableCell>
                                                    <TableCell align='left'>-</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default Permanent