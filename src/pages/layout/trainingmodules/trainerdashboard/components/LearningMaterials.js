import { Grid, TextField, Typography,Box, IconButton, Tooltip } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { getTrainerAssignTrainings } from '../TrainerRequest';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {blue} from '@mui/material/colors';
//icons
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
export default function LearningMaterials(){
    const [trainings,setTrainings] = useState([])
    useEffect(()=>{
        getTrainerAssignTrainings()
        .then(res=>{
            console.log(res.data)
            setTrainings(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    return (
        <Box sx={{pt:5,pl:'10vw',pr:'10vw'}}>
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography>List of Trainings</Typography>
            </Grid>
             <Grid item xs={12}>
                <List>
                {
                    trainings.map((row,key)=>
                        <Box sx={{border:'solid 1px #c5c5c5',borderRadius:'5px','&:hover':{background:'#efefef'},p:1,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <ListItem key= {key}>{row.training_name}</ListItem>
                        <Tooltip title='Update Learning Materials'><IconButton color ='primary' sx={{'&:hover':{color:'#fff',background:blue[800]}}}className='custom-iconbutton'><EditIcon/></IconButton></Tooltip>
                        </Box>
                    )
                }
                </List>
            </Grid>
        </Grid>
        </Box>
    )
}