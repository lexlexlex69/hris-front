import { Box,Stack,Chip, CircularProgress,Typography,Grid, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getEmpOvertimeDates, updateEmpOvertimeDates } from "../OvertimeMemoRequest";
import moment from "moment";
import Swal from "sweetalert2";
import { APILoading } from "../../../apiresponse/APIResponse";

function UpdatingEmpDates(props){
    const [isLoading,setisLoading] = useState(true);
    const [data,setData] = useState([]);
    useEffect(()=>{
        _init();
    },[])
    const handleDelete = (row)=>{
        let temp = [...data];
        let index = temp.indexOf(row);

        temp.splice(index,1);
        setData(temp)
    }
    const _init = async () =>{
        try{
            let t_data = {
                overtime_id:props.selectedData.overtime_id,
                emp_id:props.selectedEmp.id
            }
            const res = await getEmpOvertimeDates(t_data);
            setData(JSON.parse(res.data.data.date_period));
            setisLoading(false)
            console.log(res.data.data)
        }catch(error){
            toast.error(error)
        }
        
    }
    const handleSave = async () => {
        try{
            APILoading('info','Saving updates','Please wait...');

            let t_data = {
                overtime_id:props.selectedData.overtime_id,
                emp_id:props.selectedEmp.id,
                dates:data
            }
            const res = await updateEmpOvertimeDates(t_data);
            if(res.data.status === 200){
                props.close();
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }catch(error){
            Swal.fire({
                icon:'error',
                title:error
            })
        }
    }
    return (
        <Box>
            {
                isLoading 
                ?
                (
                    <Box sx={{display:'flex',justifyContent:'center'}}>
                    <CircularProgress/>
                    </Box>
                ):
                (
                <Grid container>
                <Grid item xs={12} sx={{display:'flex',gap:1,justifyContent:'center',flexWrap:'wrap',maxHeight:'70vh',overflowY:'scroll'}}>
                {
                    data&&data.length>0
                    ?
                    (   
                        data.map((item,key)=>{
                            return(
                                <Chip key={key} label={moment(item).format('MMM. DD, YYYY')} variant="outlined" onDelete={()=>handleDelete(item)}/>
                            )
                        })
                    )
                    :
                    (
                    <Typography>No dates</Typography>
                    )
                }
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button size="small" variant="contained" className="custom-roundbutton" color='success' onClick={handleSave}>Save</Button>
                    <Button size="small" variant="contained" className="custom-roundbutton" color='error' onClick={props.close}>Cancel</Button>
                </Grid>
                </Grid>
                )

            }
        
        </Box>
    )
}

export default React.memo(UpdatingEmpDates)