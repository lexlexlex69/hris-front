import { Box, Button, Tooltip, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import '.././Announcement.css';
import { viewFileAPI } from "../../../../../viewfile/ViewFileRequest";
import AttachmentIcon from '@mui/icons-material/Attachment';
import moment from "moment";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea,CardActions  } from '@mui/material';
export const Trainings = (props)=>{
    
    return (
        // <Box sx={{maxHeight:'60vh',overflowY:'scroll'}}>
        //     {
        //         props.data.map((item,key)=>
        //             <Card  key={key} sx={{mb:1}}>
        //                 <CardActionArea>
        //                 <CardContent>
        //                 <Typography gutterBottom variant="h5" component="div">{item.training_name}</Typography>
        //                 <Typography variant="body2" color="text.secondary">{item.training_desc}</Typography>
                        
        //                 </CardContent>
        //                 <CardActions>
        //                     {/* <Box sx={{display:'flex',justifyContent:'space-between'}}>
        //                     {item?.file_id&&<Tooltip title='View Attachment'><Button variant="outlined" onClick={()=>viewFileAPI(item.file_id)} startIcon={<AttachmentIcon/>}>Attachment</Button></Tooltip>}
        //                     {item?.link&&<Tooltip title='Visit link'><Button href={item.link} target="_BLANK">Visit Link</Button></Tooltip>}
        //                 </Box> */}
        //                 </CardActions>
        //                 </CardActionArea>
        //             </Card>
        //         )
        //     }

        // </Box>
        <>
        {
            props.data.map((item,key)=>
                <ListItem key={key} sx={{'&:hover':{background:grey[100]}}}>
                    <Typography sx={{color:blue[600],fontSize:'.9rem'}}>Training</Typography>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={item.training_name} secondary={
                    <Box>{item.training_desc?<><span>{item.training_desc}</span><br/></>:''} Date: {moment(item.training_start).format('MMM. DD, YYYY')} - {moment(item.training_end).format('MMM. DD, YYYY')}</Box>}/>
                </ListItem>
            )
        }
        </>
    )
}