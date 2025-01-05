import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import React, { useState } from "react";
import {formatTwoDateToTextShort } from "../../../customstring/CustomString";
import moment from "moment";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
        // fontSize: 12,
        paddingTop:5,
        paddingBottom:5,
        }
    }));
export const LapseModal = (props)=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [search,setSearch] = useState('')
    const filter = props.data.filter(el=>el.name.includes(search.toUpperCase()) || el.training_name.toUpperCase().includes(search.toUpperCase()) || el.status.toUpperCase().includes(search.toUpperCase()))
    return(
        <Box>
            <Grid container>
                <Grid item xs={12}>
                    <TextField label = 'Search' placeholder="Name | Training Name | Status" value={search} onChange={(val)=>setSearch(val.target.value)} fullWidth/>
                    <Paper sx={{mt:1}}>
                        <TableContainer sx={{maxHeight:'70vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            Training Name
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Date
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Location
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Employee
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Ban Start Date
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Ban End Date
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Date Complied/Lifted
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Status
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        filter.length>0
                                        ?
                                        filter.map((item,key)=>
                                            <TableRow key={key} hover>
                                                <TableCell>
                                                    {item.training_name}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTwoDateToTextShort(item.period_from,item.period_to)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.location}
                                                </TableCell>
                                                <TableCell>
                                                    {item.name}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(item.ban_start_date).format('MMMM DD,YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(item.ban_end_date).format('MMMM DD,YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    {item.date_complied_lifted&&moment(item.date_complied_lifted).format('MMMM DD,YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    <span style={{color:item.status === 'ACTIVE'?'red':'green',fontWeight:'bold'}}>{item.status}</span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                        :
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No data
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}