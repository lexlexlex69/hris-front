import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'


const BaseTable = ({ data,tableHeadColumns }) => {
    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="education table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <FormControlLabel
                                    label="select all"
                                    control={
                                        <Checkbox
                                            value=""
                                            color="primary"
                                        />
                                    }
                                />
                            </TableCell>
                            {tableHeadColumns && tableHeadColumns.map((item,i) => (
                                <TableCell key={i}>
                                    {item}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.map(item => (
                            <TableRow key={item.id}>
                                <TableCell align="left">
                                    <FormControlLabel
                                        label=""
                                        control={
                                            <Checkbox
                                                value=""
                                                color="primary"
                                            />
                                        }
                                    />
                                </TableCell>
                                <TableCell align="left">{item.positiontitle}</TableCell>
                                <TableCell align="left">{item.datefrom}</TableCell>
                                <TableCell align="left">{item.dateto}</TableCell>
                                <TableCell align="left">{item.agency}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default React.memo(BaseTable);