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
import LinkIcon from '@mui/icons-material/Link';

export const Scholarship = (props)=>{
    
    return (
        // <Box sx={{maxHeight:'60vh',overflowY:'scroll'}}>
        //     {
        //         props.data.map((item,key)=>
        //             <Card  key={key} sx={{mb:1}}>
        //                 <CardActionArea>
        //                 <CardContent>
        //                 <Typography gutterBottom variant="h5" component="div">{item.name}</Typography>
        //                 <Typography variant="body2" color="text.secondary">Sponsored by:{item.sponsor}</Typography>
        //                 <Typography className="scholarship-until">Application until:{moment(item.post_end_date).format('MMMM DD,YYYY')}</Typography>
                        
        //                 </CardContent>
        //                 <CardActions>
        //                     <Box sx={{display:'flex',justifyContent:'space-between'}}>
        //                     {item?.file_id&&<Tooltip title='View Attachment'><Button variant="outlined" onClick={()=>viewFileAPI(item.file_id)} startIcon={<AttachmentIcon/>}>Attachment</Button></Tooltip>}
        //                     {item?.link&&<Tooltip title='Visit link'><Button href={item.link} target="_BLANK">Visit Link</Button></Tooltip>}
        //                 </Box>
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
                    <Typography sx={{color:blue[600],fontSize:'.9rem'}}>Scholarship</Typography>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={item.name} secondary={
                    <Box><span>Sponsor: {item.sponsor}</span><br/> Application Until: {moment(item.post_end_date).format('MMM. DD, YYYY')}</Box>}/>
                    <Box sx={{display:'flex',flexDirection:'column',gap:1,justifyContent:'space-between'}}>
                    {item?.file_id&&<Tooltip title='View Attachment'><Button size="small" variant="outlined" onClick={()=>viewFileAPI(item.file_id)} startIcon={<AttachmentIcon/>}>Attachment</Button></Tooltip>}
                    {item?.link&&<Tooltip title='Visit link'><Button size="small" variant="outlined" href={item.link} target="_BLANK" startIcon={<LinkIcon/>}>Visit Link</Button></Tooltip>}
                    </Box>
                </ListItem>
            )
        }
        </>
    )
}