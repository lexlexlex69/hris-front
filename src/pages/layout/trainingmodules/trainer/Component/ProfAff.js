import Reac,{useState} from 'react';
import {Grid,TextField,Typography,Paper,Box,Chip,Button,IconButton,InputAdornment } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {blue,red,green} from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
export default function ProfAff(props){
    
    return(
    <Grid item xs={12} sx={{mt:2}}>
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
        <Typography sx={{color:'#ff6a00',fontWeight:'bold'}}>{props.name}</Typography>
        <IconButton color='success' onClick={props.addData}>
        <AddOutlinedIcon sx={{border:'solid 1px',borderColor:green[800],borderRadius:'50%'}}/>
        </IconButton>
        </Box>
        <Grid item container spacing={1}>
        {
            props.data.map((data,index)=>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            
            <TextField key = {index} value = {data.acad} required label ={'#'+(index+1)} fullWidth onChange = {(value) => props.setDataValue(index,value.target.value)}
            />
            {
                props.data.length === 1
                ?
                ''
                :
                <Button color='error' variant='outlined' onClick = {()=>props.deleteData(index)}><DeleteOutlineOutlinedIcon/></Button>
            }
            <br/>
            </Grid>

            )
        }
        </Grid>
    </Grid>
    )
}