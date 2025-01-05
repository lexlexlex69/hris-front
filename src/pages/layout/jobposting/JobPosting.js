import React from "react";

import AddIcon from '@mui/icons-material/Add';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';

import { Container,FormControl,InputLabel,Select,MenuItem,Button,Typography,Box,Modal,Grid,TextField,Tooltip } from "@mui/material";



import 'react-data-table-component-extensions/dist/index.css';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


//sweetalert
import Swal from "sweetalert2";
import AddJobVacancies from "./AddJobVacancies";
import ViewJobVacancies from "./ViewJobVacancies";


export default function JobPosting(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // get data based on selected employment status
    

    

   

    
    // const handleUpdateData = React.useCallback(state => {
    //     setSelectedJob({...selectedJob,[state.target.name]:state.target.value})
    // },[])

   
    
    const [selectedComponentAction,setSelectedComponentAction] = React.useState('');
    const showAction = () =>{
        switch(selectedComponentAction){
            case 'ADD':
                return(
                    <AddJobVacancies/>
                )
                break;
            case 'VIEW':
                return(
                    <ViewJobVacancies/>
                )
            default:
                return ''
        }
    }
    return(
        <Box sx = {{'margin':'20px','textAlign':'center'}}>
            <Typography variant="h5" gutterBottom component="div">
                Job Posting
            </Typography>
            <br/>
            <Box sx = {{'display':'flex','flexDirection':'row-reverse'}}>
                <Button variant="contained" startIcon={<ViewComfyIcon />} onClick={()=> setSelectedComponentAction('VIEW')}>View</Button> &nbsp;
                <Button variant="contained" startIcon={<AddIcon/>} color = "success" onClick={()=> setSelectedComponentAction('ADD')}> Add</Button>
            </Box>
            
            {showAction()}
        </Box>
    )
}