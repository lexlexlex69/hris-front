import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip,Modal,Button,Typography,RadioGroup,FormControlLabel,Radio } from "@mui/material";
import moment from "moment";
import React, { useState,useRef, useEffect } from "react";
import { formatExtName, formatMiddlename } from "../../customstring/CustomString";
import AttachmentIcon from '@mui/icons-material/Attachment';
import { viewFileAPI } from "../../../../viewfile/ViewFileRequest";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

//Icons
import PrintIcon from '@mui/icons-material/Print';
import PrintDisabledIcon from '@mui/icons-material/PrintDisabled';
import CloseIcon from '@mui/icons-material/Close';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import ReactToPrint,{useReactToPrint} from 'react-to-print';
import PrintNominationFormModal2 from "../Modal/PrintNominationModal2";
import Swal from "sweetalert2";

export default function RequestedReplacement(props){
    useEffect(()=>{
        console.log(props)
        localStorage.removeItem('notify_nomination_form')
    },[])
    const [data,setData] = useState(props.data)
    const [nominationData,setNominationData] = useState(props.data[0].nomination_info)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 816,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:'5px',
        pt: 2,
        px: 4,
        pb: 3,
    };
    const preferenceStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:'5px',
        pt: 2,
        px: 2,
        pb: 3,
    };
    
    const formatArr = (row) => {
        var temp = JSON.parse(row)
        return (
            <ul>
                {
                temp.map((item,key)=>
                    <li key={key}>{`${item.fname} ${formatMiddlename(item.mname)} ${item.lname} ${formatExtName(item.extname)}`}</li>

                )}
            </ul>
        )
    }
    const [openPreviewPrint, setOpenPreviewPrint] = React.useState(false);
    const handleOpenPrint = () => {
        setOpenPreviewPrint(true);
    };
    const handleClosePrint = () => {
        setOpenPreviewPrint(false);
    };
    const printNominationRef = useRef();
    const beforeNominationFormPrint = () => {
        if(!localStorage.getItem('notify_nomination_form')){
            Swal.fire({
                icon:'info',
                title:'Please print on a long bondpaper (8.5 x 13 in)',
                confirmButtonText:"Ok, I've got it",
                showCancelButton:true,
                cancelButtonText:'Cancel Print'
            }).then(res=>{
                if(res.isConfirmed){
                    localStorage.setItem('notify_nomination_form', true);
                    reactToPrintNominationForm()
                }
            })
        }else{
            reactToPrintNominationForm()
        }
        
    }
    const reactToPrintNominationForm  = useReactToPrint({
        content: () => printNominationRef.current,
        documentTitle:'Nomination Form'
    });
    const [tempData,setTempData] = useState(props.data[0].nomination_info);
    const [openFoodPreference,setOpenFoodPreference] = useState(false)
    const handleChangePreference = (index,val)=>{
        let temp = [...tempData];
        temp[index].preferences = val.target.value;
        setTempData(temp)
    }
    const handleSavePreference = ()=>{
        setNominationData(tempData)
        setOpenFoodPreference(false)

    }
    const handleCancelPreference = () =>{
        setOpenFoodPreference(false)

    }
    return (
        <Box>
            <Grid container>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer sx={{maxHeight:'60vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>To Replace</TableCell>
                                        <TableCell>Replacement</TableCell>
                                        <TableCell>Attachment</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date Requested</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((item,key)=>
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {formatArr(item.replace_info)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatArr(item.replacement_info)}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title='View attachment'><IconButton color='primary' className="custom-iconbutton" onClick={()=>viewFileAPI(item.file_id)}><AttachmentIcon/></IconButton></Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    {item.status === 'DISAPPROVED'?item.status+' ('+item.reason+')':item.status}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(item.created_at).format('MMMM DD, YYYY | hh:mma')}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.status === 'APPROVED'
                                                        ?
                                                        <Tooltip title='Print nomination form'><IconButton color='primary' className="custom-iconbutton" onClick={handleOpenPrint}><PrintIcon/></IconButton></Tooltip>
                                                        :
                                                        <IconButton disabled className="custom-iconbutton"><PrintDisabledIcon/></IconButton>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Modal
                        open={openPreviewPrint}
                        onClose={handleClosePrint}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Box sx={{...style,maxHeight:'80vh',overflowY:'scroll'}}>
                            <Box sx={{position:'sticky',top:0,background:'#fff',zIndex:100,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'baseline',mb:1}}>
                                <Box>
                                <h4 id="child-modal-title">Preview Nomination Form</h4>
                                <Box sx={{display:'flex',gap:1}}>
                                    <Button onClick={beforeNominationFormPrint} variant='contained' color = 'primary' startIcon={<PrintIcon/>}>Print</Button>
                                    <Button variant='contained' color='info' startIcon={<FastfoodIcon/>} onClick={()=>setOpenFoodPreference(true)}>
                                        Update food preference
                                    </Button>
                                    </Box>
                                </Box>
                                
                                <IconButton onClick={handleClosePrint} color='error'><CloseIcon/></IconButton>
                                
                            </Box>
                            <PrintNominationFormModal2 ref = {printNominationRef} data = {nominationData} selectedTraining = {props.selectedTrainingDetails} deptHead={props.deptHead}/>
                        </Box>
                    </Modal>
                    <Modal
                        open={openFoodPreference}
                        onClose={()=>setOpenFoodPreference(false)}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Box sx={{...preferenceStyle}}>
                            <Typography>Updating food preference</Typography>
                            <TableContainer sx={{maxHeight:'70vh',overflowY:'scroll'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Name
                                            </TableCell>
                                            <TableCell>
                                                Preference
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            tempData.map((item,key)=>
                                            <TableRow key={key}>
                                                    <TableCell>{item.fname}</TableCell>
                                                    <TableCell>
                                                        <RadioGroup
                                                            aria-labelledby={`preferences-${item.key}`}
                                                            name={`preferences-${item.key}`}
                                                            value = {item.preferences}
                                                            onChange={(val)=>handleChangePreference(key,val)}
                                                            
                                                        >
                                                            <FormControlLabel value={1} control={<Radio size="small"/>} label="NON-PORK/CHICKEN"/>
                                                            <FormControlLabel value={2} control={<Radio size="small"/>} label="VEGAN DIET" />
                                                            <FormControlLabel value={3} control={<Radio size="small"/>} label="PORK/CHICKEN" />
                                                        </RadioGroup>
                                                    </TableCell>
                                            </TableRow> 
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        <Box sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                            <Button variant='contained' color='success' className='custom-roundbutton' size='small' onClick = {handleSavePreference}>Save</Button>
                            <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCancelPreference}>Cancel</Button>
                        </Box>
                        </Box>
                    </Modal>
                </Grid>
            
            </Grid>
        </Box>
    )
}