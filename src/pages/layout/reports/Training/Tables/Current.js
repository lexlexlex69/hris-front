import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { evaluationDaysLeftNumberForReports } from "../../../customstring/CustomString";
import FullModal from '../../.././custommodal/FullModal';
import { CurrentModal } from "../Modals/CurrentModal";
import { blue, grey } from "@mui/material/colors";
export const Current = (props)=>{
    const [openCurrentModal,setOpenCurrentModal] = useState(false)
    const [infoData,setInfoData] = useState([])
    const filter = (day1,day2)=>{
        let count = 0;
        props.data.forEach(el=>{ 
            let left = evaluationDaysLeftNumberForReports(el.period_to);
            console.log(left)
            if(left>=day1 && left<=day2){
                count+= JSON.parse(el.details).length;
            }
        })
        return count>0?<Tooltip title='View List'><Button variant="outlined" onClick={()=>handleViewTrainings(day1,day2)}>{count}</Button></Tooltip>:null;
    }
    const handleViewTrainings = (day1,day2) =>{
        let t_data = [];
        props.data.forEach(el=>{ 
            let left = evaluationDaysLeftNumberForReports(el.period_to);
            if(left>=day1 && left<=day2){
                JSON.parse(el.details).forEach(el2=>{
                    t_data.push({
                        training_name:el.training_name,
                        period_from:el.period_from,
                        period_to:el.period_to,
                        training_details_id:el.training_details_id,
                        venue_location:el.venue_location,
                        venue_name:el.venue_name,
                        training_shortlist_id:el2.fname,
                        fname:el2.fname,
                        mname:el2.mname,
                        lname:el2.lname,
                        extname:el2.extname,

                    })
                })
            }
        })
        setInfoData(t_data);
        setOpenCurrentModal(true)
    }
    return(
        <Box>
            <Grid container>
                <Grid item xs={12}>
                    {/* <Typography>Lapse</Typography> */}
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            
                                        </TableCell>
                                        <TableCell align="center" sx={{background:blue[800],color:'#fff'}}>
                                            5
                                        </TableCell>
                                        <TableCell align="center" sx={{background:blue[800],color:'#fff'}}>
                                            10
                                        </TableCell>
                                        <TableCell align="center" sx={{background:blue[800],color:'#fff'}}>
                                            20
                                        </TableCell>
                                        <TableCell align="center" sx={{background:blue[800],color:'#fff'}}>
                                            30
                                        </TableCell>
                                        <TableCell align="center" sx={{background:blue[800],color:'#fff'}}>
                                            40
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Internal
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(1,5)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(6,10)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(11,20)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(21,30)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(31,40)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            External
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Invitation
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
            <FullModal open = {openCurrentModal} close = {()=>setOpenCurrentModal(false)} title='Table Data'>
                <CurrentModal data = {infoData}/>
            </FullModal>
        </Box>
    )
}