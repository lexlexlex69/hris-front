import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { blue } from "@mui/material/colors";
import moment from "moment";
import React, { useEffect, useState } from "react";
import UpdateIcon from '@mui/icons-material/Update';
import { computeLate, computeProcessLate } from "../../../../customprocessdata/CustomProcessData";
import { updateLogType } from "../DTRManagementRequests";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";
export const RawLogs = ({selectedRowDTR,selectedRawLogs,from,to,setSelectedData,actions}) =>{
    console.log(selectedRowDTR)
    const [data,setData] = useState(selectedRawLogs)
    const [selectedRow,setSelectedRow] = useState({})
    const formatLogs = (suffix)=>{
        switch(suffix){
            case 0:
            return(
                'Time In'
            );
            case 1:
            return(
                'Time Out'
            );
            case 2:
            return(
                'Break Out'
            );
            case 3:
            return(
                'Break In'
            );
            case 4:
            return(
                'Hide'
            );
        }
    }
    const handleSelectRow = (row)=>{
        setSelectedRow(row)
        setSelectedType(row.suffix)
        console.log(row)
    }
    const [selectedType,setSelectedType] = useState(0)
    const handleChangeType = (e)=>{
        
        let temp = [...data];
        const index = temp.findIndex(object => {
            return object.id === selectedRow.id;
        });
        temp[index].suffix = e.target.value;
        setSelectedType(e.target.value);
        setData(temp);

    }
    const handleReProcessLogs = async ()=>{
        try{
            APILoading('info','Adjusting log type','Please wait...')
            var t_data = {
                id:selectedRow.id,
                status:selectedRow.suffix,
                date:selectedRow.trandate,
                from:from,
                to:to,
                emp_id:selectedRowDTR.emp_id
            }
            // console.log(t_data)
            const res = await updateLogType(t_data);
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1000,
                    showConfirmButton:false
                })
                setSelectedData(res.data.data[0])
            }else{
                 Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
            console.log(res.data)
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
        // console.log(computeProcessLate(selectedRowDTR,data))

    }
    return(
        <Grid container sx={{p:1}} spacing={1}>
            {
                actions.includes('UPDATE')
                ?
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Adjust Log Type</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedType}
                        label="Adjust Log Type"
                        onChange={handleChangeType}
                        size="small"
                        >
                        <MenuItem value={0}>Time In</MenuItem>
                        <MenuItem value={1}>Time Out</MenuItem>
                        <MenuItem value={2}>Break Out</MenuItem>
                        <MenuItem value={3}>Break In</MenuItem>
                        <MenuItem value={4}>Hide</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" size="small" sx={{width:150}} startIcon={<UpdateIcon/>} onClick={handleReProcessLogs}>Process</Button>
                </Grid>
                :
                null
            }
            
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Date
                                    </TableCell>
                                    <TableCell>
                                        Time Log
                                    </TableCell>
                                    <TableCell>
                                        Type
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map((item)=>{
                                        return(
                                            <TableRow key={item.timein} onClick={()=>handleSelectRow(item)} sx={{'&:hover':{cursor:'pointer',background:blue[200]},background:selectedRow.id === item.id ?blue[200]:'#fff'}}>
                                                    <TableCell>
                                                        {moment(item.trandate,'YYYY-MM-DD').format('MM-DD-YYYY')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(item.timein,'HH:mm:ss').format('hh:mm A')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatLogs(item.suffix)}
                                                    </TableCell>
                                            </TableRow>
                                        )
                                        
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}