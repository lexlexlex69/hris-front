import { Button, Grid, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const UpdateCTO = ({pendingInfo,handleUpdateCTO,close})=>{
    const [data,setData] = useState({
        bal_as_of:pendingInfo.bal_as_of,
        bal_before_process:pendingInfo.bal_before_process,
        bal_after_process:pendingInfo.bal_after_process,
        days_hours_applied:pendingInfo.days_hours_applied
    })
    useEffect(()=>{
        if(data.bal_before_process){
            if(parseFloat(data.days_hours_applied)>=parseFloat(data.bal_before_process)){
                setData({
                    ...data,
                    bal_after_process:0
                })
            }else{
                setData({
                    ...data,
                    bal_after_process:(data.bal_before_process-data.days_hours_applied).toFixed(3)
                })
            }
            
        }else{
            setData({
                ...data,
                bal_after_process:data.bal_before_process.toFixed(3)
            })
        }

    },[data.bal_before_process])
    useEffect(()=>{
        if(data.days_hours_applied){
            if(parseFloat(data.days_hours_applied)<=parseFloat(data.bal_before_process)){
                setData({
                    ...data,
                    bal_after_process:(data.bal_before_process-data.days_hours_applied).toFixed(3)
                })
            }else{
                setData({
                    ...data,
                    bal_after_process:0
                })
            }
        }else{
            setData({
                ...data,
                bal_after_process:data.bal_before_process.toFixed(3)
            })
        }
    },[data.days_hours_applied])
    const handleChange = (val,name) =>{
        setData({
            ...data,
            [name]:val.target.value
        })
    }
    const handleSubmit = ()=>{
        console.log(data)
        if(data.bal_after_process && data.bal_before_process && data.days_hours_applied && data.bal_as_of){
            handleUpdateCTO({
                bal_as_of:data.bal_as_of,
                bal_before_process:data.bal_before_process,
                bal_after_process:data.bal_after_process,
                days_hours_applied:data.days_hours_applied
            })
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                text:'Please input all required fields.'
            })
        }
        
    }
    return(
        <Grid container sx={{pt:1}} spacing={1}>
            <Grid item xs={12}>
                <TextField label='As of' value={data.bal_as_of} onChange={(val)=>handleChange(val,'bal_as_of')} required fullWidth/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'row',justifyContent:'space-between',alignItems:'center'}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Total Earned</TableCell>
                                <TableCell>
                                <TextField label='Hours' type="number" value={data.bal_before_process} onChange={(val)=>handleChange(val,'bal_before_process')} required fullWidth/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Less this application</TableCell>
                                <TableCell>
                                <TextField label='Hours' type="number" value={data.days_hours_applied} onChange={(val)=>handleChange(val,'days_hours_applied')} required fullWidth/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Balance</TableCell>
                                <TableCell>
                                {/* <TextField label='Hours' type="number" value={data.bal_after_process} onChange={(val)=>handleChange(val,'bal_after_process')} required fullWidth disabled/> */}
                                <TextField label='Hours' type="number" value={data.bal_after_process} InputProps={{readOnly:true}} fullWidth disabled/>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant="contained" className="custom-roundbutton" color='success' size="small" onClick={handleSubmit}>Submit Update</Button>
                <Button variant="contained" className="custom-roundbutton" color='error' size="small" onClick={close}>Cancel</Button>
            </Grid>
        </Grid>
    )
}