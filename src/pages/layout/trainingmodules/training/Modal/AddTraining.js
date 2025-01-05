import { Grid, TextField, Autocomplete, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { addNewTraining, getTrainingType } from "../TrainingRequest";

export default function AddTraining(props){
    const [trainingName,setTrainingName] = useState('');
    const [trainingDesc,setTrainingDesc] = useState('');
    const [postingDateStart,setPostingDateStart] = useState('');
    const [postingDateEnd,setPostingDateEnd] = useState('');
    const [trainingDateStart,setTrainingDateStart] = useState('');
    const [trainingDateEnd,setTrainingDateEnd] = useState('');
    const [metaTags,setMetaTags] = useState([])
    const [trainingType,setTrainingType] = useState(null)
    const [trainingTypeData,setTrainingTypeData] = useState([])
    useEffect(()=>{
        _getTrainingType()
    },[])
    const _getTrainingType = async () =>{
        const res = await getTrainingType()
        setTrainingTypeData(res.data)
    }
    const handleSave = (e)=>{
        e.preventDefault();
        if(metaTags.length >0){
            Swal.fire({
                icon:'info',
                title:'Adding new training',
                html:'Please wait...'
            })
            Swal.showLoading();
            var temp_metatags = '';
            metaTags.forEach((el,key) => {
                if(key===metaTags.length-1){
                    temp_metatags+=el.meta_name
                }else{
                    temp_metatags+=el.meta_name+','
                }
            });
            var t_data = {
                name:trainingName,
                desc:trainingDesc,
                meta_tags:temp_metatags,
                type:trainingType.type_name,
                training_start:trainingDateStart,
                training_end:trainingDateEnd,
                posting_start:postingDateStart,
                posting_end:postingDateEnd
            }
            addNewTraining(t_data)
            .then(res=>{
                if(res.data.status === 200){
                    props.close()
                    props.setExistingTrainingData(res.data.data)
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
            }).catch(err=>{
                Swal.fire({
                    icon:'error',
                    title:err
                })
            })
        }else{
            Swal.fire({
                icon:'warning',
                title:'Please select Meta Tags'
            })
        }
    }
    return (
        <form onSubmit={handleSave}>
        <Grid container spacing={2} sx={{maxHeight:'70vh',overflowY:'scroll',mt:1,mb:1}}>
            <Grid item xs={12}>
                <TextField label='Training Name' value = {trainingName} onChange = {(val)=>setTrainingName(val.target.value)} fullWidth required/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='text' label='Training Description' value = {trainingDesc} onChange = {(val)=>setTrainingDesc(val.target.value)} multiline fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <TextField type="date" label='Training Date Start' value = {trainingDateStart} onChange = {(val)=>setTrainingDateStart(val.target.value)} fullWidth InputLabelProps={{shrink:true}}/>
            </Grid>
            <Grid item xs={12}>
                <TextField type="date" label='Training Date End' value = {trainingDateEnd} onChange = {(val)=>setTrainingDateEnd(val.target.value)} fullWidth InputLabelProps={{shrink:true}}/>
            </Grid>
            <Grid item xs={12}>
                <TextField type="date" label='Posting Date Start' value = {postingDateStart} onChange = {(val)=>setPostingDateStart(val.target.value)} fullWidth InputLabelProps={{shrink:true}}/>
            </Grid>
            <Grid item xs={12}>
                <TextField type="date" label='Posting Date End' value = {postingDateEnd} onChange = {(val)=>setPostingDateEnd(val.target.value)} fullWidth InputLabelProps={{shrink:true}}/>
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    value={trainingType}
                    onChange={(event, newValue) => {
                        setTrainingType(newValue);
                    }}
                    options={trainingTypeData}
                    getOptionLabel={(option) => option.type_name}
                    renderInput={(params) => <TextField {...params} label="Type *" />}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    value={metaTags}
                    onChange={(event, newValue) => {
                        setMetaTags(newValue);
                    }}
                    options={props.metaTagsData}
                    getOptionLabel={(option) => option.meta_name}
                    multiple
                    renderInput={(params) => <TextField {...params} label="Meta Tags *" />}
                    required
                />
            </Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant ='contained' color ='success' className='custom-roundbutton' type='submit'>Save</Button>
                <Button variant ='contained' color ='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
            </Grid>
        </Grid>
        </form>
    )
}