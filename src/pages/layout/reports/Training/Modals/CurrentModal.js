import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { formatMiddlename, formatTwoDateToTextShort } from "../../../customstring/CustomString";

export const CurrentModal = (props)=>{
    console.log(props)
    return(
        <Box>
            <Grid container>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer sx={{maxHeight:'80vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Employee
                                        </TableCell>
                                        <TableCell>
                                            Training Name
                                        </TableCell>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                        <TableCell>
                                            Location
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.data.map((item,key)=>
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {`${item.lname} ${formatMiddlename(item.mname)} ${item.fname}`}
                                                </TableCell>
                                                <TableCell>
                                                    {item.training_name}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTwoDateToTextShort(item.period_from,item.period_to)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.venue_location}
                                                </TableCell>
                                            </TableRow>
                                        )
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