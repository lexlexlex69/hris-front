import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { convertFileTo64, customSetFile } from "../../../customprocessdata/CustomProcessData";
import { toast } from "react-toastify";
import { addNewScholarship, updateScholarship } from "../ScholarshipRequest";

export const UpdateScholarshipModal = (props) =>{
    useEffect(()=>{
        setData({
            ...data,
            name:props.data.name,
            sponsor:props.data.sponsor,
            post_end_date:props.data.post_end_date,
            link:props.data.link,
            scholarship_id:props.data.scholarship_id
        })
    },[])
    const [singleFile,setsingleFile] = useState('');
    const [data,setData] = useState({
        name:'',
        sponsor:'',
        post_end_date:'',
        file:'',
        link:'',
        scholarship_id:''
    })
    const handleSingleFile = async (e) =>{
        const fileExt = ['pdf','png','jpeg','jpg'];
        const res = await convertFileTo64(e.target.files[0],fileExt)
        if(res){
            // setsingleFile(res)
            setData({
                ...data,
                file:res
            })
        }else{
            // setsingleFile('')
            setData({
                ...data,
                file:''
            })
        }
    }
    const handleSetValue = (val,name) =>{
        setData({
            ...data,
            [name]:val
        })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        const id = toast.loading('Updating data')
        try{
            let t_data = {
                data:data
            }
            const res = await updateScholarship(t_data);
            if(res.data.status === 200){
                props.close();
                props.setData(res.data.data)
                toast.update(id,{
                    render:res.data.message,
                    type:'success',
                    isLoading:false,
                    autoClose:true
                    
                })
            }else{
                toast.update(id,{
                    render:res.data.message,
                    type:'success',
                    isLoading:false,
                    autoClose:true
                    
                })
            }
        }catch(err){
            toast.update(id,{
                render:err,
                type:'error',
                isLoading:false,
                autoClose:true
                
            })
        }
    }
    return(
        <Box sx={{m:1}}>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField label='Scholarship Name' value={data.name} onChange={(val)=>handleSetValue(val.target.value,'name')} fullWidth required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Sponsor' value={data.sponsor} onChange={(val)=>handleSetValue(val.target.value,'sponsor')} fullWidth required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Post End Date' type='date' value={data.post_end_date} onChange={(val)=>handleSetValue(val.target.value,'post_end_date')} fullWidth required InputLabelProps={{shrink:true}}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Link' value={data.link} onChange={(val)=>handleSetValue(val.target.value,'link')} fullWidth placeholder="Optional" InputLabelProps={{shrink:true}}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Attachment' type="file" onChange={handleSingleFile} InputLabelProps={{shrink:true}} InputProps={{ inputProps: { accept:'image/*    ,.pdf'}}} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant="contained" className="custom-roundbutton" color="success" type="submit">
                            Save
                        </Button>
                        <Button variant="contained" className="custom-roundbutton" color="error" onClick={props.close}>
                            Cancel
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            </form>
        </Box>
    )
}