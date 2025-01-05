import React from 'react';
import { Box, Button, Grid, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { formatExtName, formatMiddlename, StyledTableCellLedger } from '../../../../customstring/CustomString';
import { red } from '@mui/material/colors';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const PreviewLedger = ({selectedEmp,previewLedgerData,handlePostLedger,CustomStyledTableCell}) => {
    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography sx={{textAlign:'center',fontSize:'1.1rem'}}>Employee's Leave Ledger Card</Typography>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                <Typography>Name: {`${selectedEmp?.fname} ${formatMiddlename(selectedEmp?.mname)} ${selectedEmp?.lname} ${formatExtName(selectedEmp?.extname)}`}</Typography>
                <Box>
                    <Typography color='primary' sx={{fontWeight:'bold'}}>Ledger Balance: VL({previewLedgerData.length>0?previewLedgerData[previewLedgerData.length-1].vl_bal:0}) SL({previewLedgerData.length>0?previewLedgerData[previewLedgerData.length-1].sl_bal:0})</Typography>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'65dvh'}}>
                        <Table>
                            <TableHead sx={{position:'sticky',top:0,background:'#fff'}}>
                                <TableRow>
                                    <StyledTableCellLedger>
                                        Period
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger colSpan={4} align='center'>
                                        Particulars
                                    </StyledTableCellLedger>
                                        <StyledTableCellLedger rowSpan={1} align='center'>
                                        Control No.
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger colSpan={4} align='center'>
                                        Vacation Leave
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger colSpan={4} align='center'>
                                        Sick Leave
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger rowSpan={1} align='center'>
                                        Date & Action on Taken Application For Leave
                                    </StyledTableCellLedger>
                                </TableRow>
                                <TableRow>
                                    <CustomStyledTableCell align='center'>
                                        Inclusive Dates
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Type of Leave
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Days
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Hours
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Minutes
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Earned
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Absence UT/T With Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Balance
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Absence UT/T Without Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Earned
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Absence UT/T With Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Balance
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Absence UT/T Without Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                    </CustomStyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    previewLedgerData.length>0
                                    ?
                                    previewLedgerData.map((item,key)=>{
                                        return(
                                            <TableRow hover key={key}>
                                                <CustomStyledTableCell>
                                                    {item.inc_dates}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell sx={{color:item.leave_type?item.leave_type.includes('TARDI')?red[800]:'black':'black'}}>
                                                    {item.leave_type}
                                                </CustomStyledTableCell>
                                                {/* <CustomStyledTableCell>
                                                    {item.leave_type}
                                                </CustomStyledTableCell> */}
                                                <CustomStyledTableCell>
                                                    {item.days}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell>
                                                    {item.hours}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell>
                                                    {item.mins}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell>
                                                    {item.control_no}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.vl_earned>0?item.vl_earned:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.vl_wpay>0?item.vl_wpay:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.vl_bal}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.vl_wopay>0?item.vl_wopay:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.sl_earned>0?item.sl_earned:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.sl_wpay>0?item.sl_wpay:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.sl_bal}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.sl_wopay>0?item.sl_wopay:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='center'>
                                                    {item.action}
                                                </CustomStyledTableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    null
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button variant='contained' className='custom-roundbutton' startIcon={<CloudUploadIcon/>} onClick={handlePostLedger}>Post Ledger</Button>
            </Grid>
        </Grid>
    )
}