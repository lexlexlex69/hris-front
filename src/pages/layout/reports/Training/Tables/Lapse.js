import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { evaluationDaysLeftNumberForReports } from "../../../customstring/CustomString";
import FullModal from "../../../custommodal/FullModal";
import { LapseModal } from "../Modals/LapseModal";
import { blue } from "@mui/material/colors";
import PersonIcon from '@mui/icons-material/Person';
import moment from "moment";

export const Lapse = (props)=>{
    console.log(props.data)
    const [openModal,setOpenModal] = useState(false)
    const [infoData,setInfoData] = useState([])
    const [lapseDays,setLapseDays] = useState('')
    const filter = (day1,day2)=>{
        let count = 0;
        props.data.forEach(el=>{
            
            let left = evaluationDaysLeftNumberForReports(el.period_to);
            // console.log(left)

            if(left<0){
                if(el.date_complied_lifted){
                    let d = moment(el.date_complied_lifted).diff(el.ban_start_date,'days')+1
                    if(d>=day1 && d<=day2){
                        count++;
                    }
                }else{
                    if(Math.abs(left)>=day1 && Math.abs(left)<=day2){
                        count++;
                    }
                }
                
            }
            
        })
        return count>0?<Tooltip title='View List'><Button variant="outlined" sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>handleViewTrainings(day1,day2)} startIcon={<PersonIcon/>}>{count}</Button></Tooltip>:null;
    }
    const handleViewTrainings = (day1,day2) =>{
        let t_data = [];
        props.data.forEach(el=>{
            
            let left = evaluationDaysLeftNumberForReports(el.period_to);
            if(left<=0){
                setLapseDays(day1+' - '+day2+' days')
                if(el.date_complied_lifted){
                    let d = moment(el.date_complied_lifted).diff(el.ban_start_date,'days')+1
                    if(d>=day1 && d<=day2){
                        t_data.push(el)
                    }
                }else{
                    if(Math.abs(left)>=day1 && Math.abs(left)<=day2){
                        t_data.push(el)
                    }
                }
                // if(Math.abs(left)>=day1 && Math.abs(left)<=day2){
                //     t_data.push(el)
                //     // JSON.parse(el.details).forEach(el2=>{
                //     //     t_data.push({
                //     //         training_name:el.training_name,
                //     //         period_from:el.period_from,
                //     //         period_to:el.period_to,
                //     //         training_details_id:el.training_details_id,
                //     //         venue_location:el.venue_location,
                //     //         venue_name:el.venue_name,
                //     //         training_shortlist_id:el2.fname,
                //     //         fname:el2.fname,
                //     //         mname:el2.mname,
                //     //         lname:el2.lname,
                //     //         extname:el2.extname,

                //     //     })
                //     // })
                // }
            }
            
        })
        console.log(t_data)
        setInfoData(t_data);
        setOpenModal(true)
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
                                            40+
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell >
                                            Internal
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(1,5)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(6,10 )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(11,20)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(21,30)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {filter(31,370)}
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
            <FullModal open = {openModal} close = {()=>setOpenModal(false)} title={`Lapse ${lapseDays}`}>
                <LapseModal data = {infoData}/>
            </FullModal>
        </Box>
    )
}