import { Box, Collapse, Grid, List, ListItemButton, ListItemText,Card,CardContent, ListItemIcon, ListItem, Button, Tooltip,Select,MenuItem,FormControl,InputLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAvailableScholarship, getAvailableTraining } from "./AnnouncementsRequest";
import { Scholarship } from "./components/Scholarship";
import { Trainings } from "./components/Trainings";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CampaignIcon from '@mui/icons-material/Campaign';
import AttachmentIcon from '@mui/icons-material/Attachment';
import LinkIcon from '@mui/icons-material/Link';

import Badge from '@mui/material/Badge';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { blue, grey, orange } from "@mui/material/colors";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from "moment";
import { viewFileAPI } from "../../../../viewfile/ViewFileRequest";

const announementHeader = createTheme({
        typography: {
            fontFamily: 'latoreg',
            fontSize:13
        }
    });
export const Announcements = () =>{
    const [scholarshipData,setScholarshipData] = useState([])
    const [trainingData,setTrainingData] = useState([])
    const [countAnncmnt,setCountAnncmnt] = useState(0)
    useEffect(()=>{
        _scholarship()
        _training()
    },[])
    const _scholarship = async ()=>{
        const res = await getAvailableScholarship();
        if(res.data.data.length>0){
            setCountAnncmnt((prevState)=>{
                return prevState+1
            })
        }
        setScholarshipData(res.data.data)
    }
    const _training = async ()=>{
        const res = await getAvailableTraining();
        if(res.data.data.length>0){
            setCountAnncmnt((prevState)=>{
                return prevState+1
            })
        }
        setTrainingData(res.data.data)
    }
    const [openScholarship, setOpenScholarship] = useState(false);

    const handleClickScholarship = () => {
        setOpenScholarship(!openScholarship);
    };
    const [filter, setFilter] = useState(0);

    const handleChange = (event) => {
        setFilter(event.target.value);
    };
    const filterComponent = () => {
        switch(filter){
            case 0:
                return(
                    <>
                    <Scholarship data = {scholarshipData}/>
                    <Trainings data = {trainingData}/>

                    </>
                )
            break;
            case 1:
                return(
                    <Scholarship data = {scholarshipData}/>
                )
            break;
            case 2:
                return(
                    <Trainings data = {trainingData}/>
                )
            break;
        }
    }
    return (
        <Box>
        {
            countAnncmnt>0
            ?
            <>
                <Card raised sx={{ mt: 2 }}>
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography color="#5C5C5C" sx={{ p: 1 }}><b>Announcements</b> {} <CampaignIcon/></Typography>
                     <FormControl
                        sx={{width:200,mt:1,mr:1}}
                        >
                        <InputLabel id="filter-select-label" size="small">Filter</InputLabel>
                        <Select
                        labelId="filter-select-label"
                        id="filter-select-label"
                        value={filter}
                        label="Filter"
                        onChange={handleChange}
                        size="small"
                        >
                        <MenuItem value={0}>All</MenuItem>
                        <MenuItem value={1}>Scholarship</MenuItem>
                        <MenuItem value={2}>Training</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <CardContent sx={{p:0}}>
                    <Grid container id = 'announcement-div'>
                        {/* {
                            scholarshipData.length>0
                            ?
                            <Accordion sx={{width:'100%'}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Box sx={{display:'flex',gap:2}}>
                                        <Typography title={`${scholarshipData.length} Available Scholarship`}>
                                        <Badge badgeContent={scholarshipData.length} color="primary">
                                            <NotificationsActiveIcon sx={{color:orange[800]}}/>
                                        </Badge>
                                        </Typography>
                                        <ThemeProvider theme={announementHeader}>
                                            <Typography sx={{color:grey[800]}}>Scholarships</Typography>
                                        </ThemeProvider>

                                    </Box>


                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Scholarship data ={scholarshipData}/>
                                    </AccordionDetails>
                            </Accordion>
                            :
                            null
                        } */}
                        {
                            filter === 0
                            ?
                            <Grid item xs={12}>
                            <List sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                            {/* {
                                scholarshipData.map((item,key)=>
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
                            } */}
                            <Scholarship data = {scholarshipData}/>
                            <Trainings data = {trainingData}/>
                            {/* {
                                trainingData.map((item,key)=>
                                    <ListItem key={key} sx={{'&:hover':{background:grey[100]}}}>
                                        <Typography sx={{color:blue[600],fontSize:'.9rem'}}>Training</Typography>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={item.training_name} secondary={
                                        <Box>{item.training_desc?<><span>{item.training_desc}</span><br/></>:''} Date: {moment(item.training_start).format('MMM. DD, YYYY')} - {moment(item.training_end).format('MMM. DD, YYYY')}</Box>}/>
                                    </ListItem>
                                )
                            } */}
                            </List>

                            </Grid>
                            :
                            filterComponent()
                        }
                        

                    </Grid>
                    </CardContent>

                </Card>
            </>
            :
            null
        }
        
        </Box>

    )
}