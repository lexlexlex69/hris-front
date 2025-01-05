import { Box, Paper, TableContainer,Table,TableHead,TableRow,TableCell,TableBody, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { formatExtName, formatMiddlename } from "../../../customstring/CustomString";
import { grey } from "@mui/material/colors";

export default function EmpListTable(props){
    const [filter,setFilter] = useState(1);
    // const filterData = props.data.filter(el => parseInt(el.user_type) === parseInt(filter))
    return(
        <Box>
            <Typography sx={{color:grey[600],fontSize:'.9rem',fontStyle:'italic'}}>Total : {props.data.length}</Typography>
            <Paper>
                <TableContainer sx={{maxHeight:'70vh'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    User Type <br/>
                                    {/* <TextField label='Filter' value = {filter} onChange={(val)=>setFilter(val.target.value)}/> */}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.map((item,key)=>
                                    <TableRow key={key}>
                                        <TableCell>
                                            {`${item.lname}, ${item.fname} ${formatExtName(item.extname)} ${formatMiddlename(item.mname)}`}
                                        </TableCell>
                                        <TableCell>
                                            {`${item.username?item.username:''}`}
                                        </TableCell>
                                        <TableCell>
                                            {`${item.user_type?item.user_type:''}`}
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}