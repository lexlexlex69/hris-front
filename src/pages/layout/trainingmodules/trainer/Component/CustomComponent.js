import Reac,{useState} from 'react';
import {Grid,TextField,Typography,Paper,Box,Chip,Button,IconButton,InputAdornment,Tooltip,Autocomplete } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {blue,red,green} from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
export default function CustomComponent(props){
    return(
        <Grid item xs={12}>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Typography sx={{color:'#ff6a00',fontWeight:'bold'}}>{props.name}</Typography>
            {/* {
                props.isUpdateOpen
                ?
                null
                :
                <Tooltip title='Update Academic Qualification'><IconButton color='success' onClick={props.setUpdateOpen}><EditIcon/></IconButton></Tooltip>

            } */}
            </Box>
             
            <Grid item container spacing={1}>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                    <IconButton color='success' onClick={props.addData}>
                <AddOutlinedIcon sx={{border:'solid 1px',borderColor:green[800],borderRadius:'50%'}}/>
                </IconButton>
                </Grid>
            {
                props.data.map((data,index)=>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}} key = {index}>
                {
                    props.name === 'Academic Qualification'
                    ?
                    <Autocomplete
                        freeSolo
                        id={`free-solo-acad-${index}`}
                        disableClearable
                        options={props.courseData.map((option) => option.course_name)}
                        value = {data.value}
                        onChange={(event, newValue) => {
                            props.setDataValue(index,newValue)
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label={'#'+(index+1)}
                            InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            }}
                        />
                        )}
                        fullWidth

                    />
                    :
                    <TextField  value = {data.value} label ={'#'+(index+1)} fullWidth onChange = {(value) => props.setDataValue(index,value.target.value)} required = {props.required}
                        />
                    
                }
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
            {
                props.isUpdateOpen
                ?
                <Grid item xs={12}>
                    <Button variant='contained' color='success'>Save</Button>
                </Grid>
                :
                null
            }
            </Grid>
        </Grid>
    )
}