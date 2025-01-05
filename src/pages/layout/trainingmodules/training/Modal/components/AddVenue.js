import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { addNewVenue } from "../../TrainingRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";
const AddVenue = (props) =>{
    const [data,setData] = useState({
        venue_name:'',
        venue_location:''
    })
    const handleChange = (val,id) => {
        setData({
            ...data,
            [id]:val.target.value
        })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            APILoading('info','Adding data','Please wait...')
            let t_data = {
                data:data
            }
            const res = await addNewVenue(t_data);
            if(res.data.status === 200){
                props.setData(res.data.data)
                props.close()
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500
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
                title:error,
                timer:1500
            })
        }
        
        
    }
    return(
       <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField label='Venue Name' value ={data.venue_name} onChange={(val)=>handleChange(val,'venue_name')} fullWidth required/>
            </Grid>
             <Grid item xs={12}>
                <TextField label='Venue Location' value ={data.venue_location} onChange={(val)=>handleChange(val,'venue_location')} fullWidth required/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',gap:1,justifyContent:'flex-end'}}>
                <Button variant="contained" color='success' className="custom-roundbutton" type="submit">Save</Button>
                <Button variant="contained" color='error' className="custom-roundbutton" onClick={props.close}>Cancel</Button>
            </Grid>
        </Grid>
       </form> 
    )
} 
export default React.memo(AddVenue)