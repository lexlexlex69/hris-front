import { Box, Grid, Paper, Typography,List,ListItem,ListItemButton,ListItemIcon,ListItemText,Fade, Tooltip, IconButton, CircularProgress } from "@mui/material";
import React, { useEffect,useState } from "react";
import Swal from "sweetalert2";
import { getUnAttendedTrainee } from "../TrainingAttendanceRequest";
import { grey } from "@mui/material/colors";
//Icons
import PersonIcon from '@mui/icons-material/Person';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { viewFileAPI } from "../../../../../viewfile/ViewFileRequest";
export default function UnAttendedModal(props){
    const [data,setData] = useState([])
    const [data2,setData2] = useState([])
    const [loading,setLoading] = useState(true)
    useEffect( async()=>{
        try{
            var t_data = {
                id:props.id
            }
            const res = await getUnAttendedTrainee(t_data)
            setData(res.data.online)
            setData2(res.data.voluntary)
            setLoading(false)
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
    },[])
    return(
        <Box>
            {
                loading
                ?
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            <CircularProgress/>
                            <Typography>Loading data. Please wait...</Typography>
                        </Box>
                    </Grid>
                
                </Grid>
                :
                <Grid container>
                    {
                        data.length>0
                        ?
                        <Grid item xs={12} sx={{maxHeight:'60vh',overflowY:'scroll'}}>
                            <Typography sx={{color:grey[700],fontStyle:'italic'}}>* Base on online attendance:</Typography>
                            <Paper>
                                <List>
                                    {
                                        data.map((item,key)=>
                                            <Fade in key={key}>
                                                <ListItem>
                                                    <ListItemButton>
                                                        <ListItemIcon>
                                                            <PersonIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={`${item.lname}, ${item.fname}`} secondary={`Reason: ${item.reason}`} />
                                                        {
                                                            item.file_id
                                                            ?
                                                            <Tooltip title='View attached file'>
                                                                <ListItemIcon>
                                                                    <IconButton className="custom-iconbutton" onClick={()=>viewFileAPI(item.file_id)}><AttachmentIcon /></IconButton>
                                                                </ListItemIcon>
                                                            </Tooltip>
                                                            :
                                                            null
                                                        }
                                                        
                                                    </ListItemButton>
                                                </ListItem>
                                            </Fade>
                                        )
                                    }
                                    
                                </List>
                            </Paper>
                        </Grid>
                        :
                        null
                    }
                    {
                        data2.length>0
                        ?
                        <Grid item xs={12} sx={{mt:1}}>
                            <Typography sx={{color:grey[700],fontStyle:'italic'}}>* Other:</Typography>
                            <Paper>
                                <List>
                                    {
                                        data2.map((item,key)=>
                                            <Fade in key={key}>
                                                <ListItem>
                                                    <ListItemButton>
                                                        <ListItemIcon>
                                                            <PersonIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={`${item.lname}, ${item.fname}`} secondary={`Reason: ${item.reason}`} />
                                                        {
                                                            item.file_id
                                                            ?
                                                            <Tooltip title='View attached file'>
                                                                <ListItemIcon>
                                                                    <IconButton className="custom-iconbutton" onClick={()=>viewFileAPI(item.file_id)}><AttachmentIcon /></IconButton>
                                                                </ListItemIcon>
                                                            </Tooltip>
                                                            :
                                                            null
                                                        }
                                                        
                                                    </ListItemButton>
                                                </ListItem>
                                            </Fade>
                                        )
                                    }
                                    
                                </List>
                            </Paper>
                        </Grid>
                        :
                        null
                    }
                </Grid>
            }
            
        </Box>
    )
}