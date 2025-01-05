import React, { useEffect, useState } from "react";
import {Box,Grid,Paper,TextField,Autocomplete,Backdrop,CircularProgress,List,ListItem,ListItemButton,ListItemIcon,ListItemText,Tooltip,IconButton,Button,Typography,Fade,Checkbox } from '@mui/material';
import { addRemoveTraineeHRDC, getAllReservedTraineePerDept } from "../TraineeApprovalHRDCRequest";
import Swal from "sweetalert2";

import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import StarIcon from '@mui/icons-material/Star';

import SmallModal from "../../custommodal/SmallModal";
import {red,green,blue,grey} from '@mui/material/colors';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { APILoading } from "../../apiresponse/APIResponse";

const Input = styled('input')({
    display: 'none',
});
export default function AddRemoveTrainee(props){
    const [selectedDept,setSelectedDept] = useState(null)
    const [openBackdrop,setOpenBackdrop] = useState(false)
    const [shortlistData,setShortlistData] = useState([])
    const [reservedData,setReservedData] = useState([])
    const [selectedRemoved,setSelectedRemoved] = useState([])
    const [selectedAdded,setSelectedAdded] = useState([])
    const [openProceed,setOpenProceed] = useState(false)
    const [openAddModal,setopenAddModal] = useState(false)
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false)
    }
    const handleCloseProceed = () => {
        setOpenProceed(false)
    }
    const handleCloseAddModal = () => {
        setopenAddModal(false)
    }
    const handleSetDept = async (event,val)=>{
        setSelectedDept(val);
        if(val){
            var temp = {...selectedDept}
            if(temp.dept_name !== val.dept_name){
                try{
                    setOpenBackdrop(true)
                    /**
                    Search list of reserved trainee
                    */
                    var t_data = {
                        dept_code:val.dept_code,
                        id:props.data.training_details_id
                    }
                    // console.log(t_data)
                    const res = await getAllReservedTraineePerDept(t_data)
                    console.log(res.data)
                    setShortlistData(res.data.shortlist_data)
                    setReservedData(res.data.reserved_data)
                    setOpenBackdrop(false)

                }catch(err){
                    Swal.fire({
                        icon:'error',
                        message:err
                    })
                }
            }
            
            
        }
    }
    const handleRemove = (index) => {
        var temp = [...shortlistData];
        var temp2 = [...selectedRemoved];
        temp2.push(temp[index])
        temp.splice(index,1);
        setShortlistData(temp)
        setSelectedRemoved(temp2)
    }
    const handleProceed = () => {
        setOpenProceed(true)
    }
    const handleSelectedRemove = (index) => {
        var temp = [...selectedRemoved];
        var temp2 = [...shortlistData]
        temp2.push(temp[index])
        temp.splice(index,1);
        setSelectedRemoved(temp)
        setShortlistData(temp2)
    }
    useEffect(()=>{
        if(selectedRemoved.length === 0){
            setOpenProceed(false)
        }
    },[selectedRemoved])
    const [fileData,setFileData] = useState(null);
    
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','doc','docx',
    ])
    const handleSetFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        // console.log(file)
        if(fileExtensions.includes(extension.toLowerCase())){
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setFileData(fileReader.result)
            }
        }else{
            setFileData(null);
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF | DOC | Image file.'
            })
        }
    }
    const handleSubmit = async (type) => {
        try{
            APILoading('info','Submitting trainee','Please wait...')
            var t_data = {
                to_removed:selectedRemoved,
                to_add:selectedAdded,
                file:fileData,
                type:type,
                training_details_id:props.data.training_details_id
            }
            console.log(t_data)
            const res = await addRemoveTraineeHRDC(t_data)
            if(res.data.status === 200){
                props.close();
                handleCloseProceed()
                setFileData(null)
                setSelectedAdded([])
                setSelectedRemoved([])
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
            console.log(res.data)
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
    }
    const handleSelectAdded = (id) => {

        var temp = [...selectedAdded];
        var index = temp.indexOf(id);
        // console.log(index)
        if(index === -1){
            temp.push(id)
            setSelectedAdded(temp)
        }else{
            temp.splice(index,1);
            setSelectedAdded(temp)
        }
    }
    return (
        <Box sx={{p:1}}>
            <Grid container>
                <Grid item xs={12}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-dept"
                        options={JSON.parse(props.data.shortlist_details)}
                        value={selectedDept}
                        getOptionLabel={(option) => option.dept_name}
                        onChange={handleSetDept}
                        isOptionEqualToValue={(option, value) => option.dept_name === value.dept_name}

                        renderInput={(params) => <TextField {...params} label="Office/Department" />}
                    />
                </Grid>
                {
                    shortlistData.length>0
                    ?
                    <Grid item xs={12} sx={{mt:1}}>
                        <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                            <Tooltip title='Add new trainee without removing current trainee'><IconButton color="success" className="custom-iconbutton" onClick={()=>setopenAddModal(true)} sx={{'&:hover':{color:'#fff',background:green[800]}}}><AddIcon/></IconButton></Tooltip>
                        </Box>
                        <Box sx={{display:'flex',justifyContent:'space-between',background:blue[700],p:1}}>
                        <Typography sx={{color:'#fff',fontStyle:'italic',fontSize:'.9rem'}}>List of {selectedDept.dept_name}'s approved trainee:</Typography>
                        <Typography sx={{color:'#fff',fontStyle:'italic',fontSize:'.9rem'}}>Total: {shortlistData.length}</Typography>
                        </Box>
                        <Paper sx={{maxHeight:'50vh',overflowY:'scroll'}}>
                            <List>
                                {
                                    shortlistData.map((item,key)=>
                                        <Fade in key={key}>
                                            <ListItem>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <PersonIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={`${item.lname}, ${item.fname}`} />
                                                    <Tooltip title='Remove Trainee'><IconButton color='error' className="custom-iconbutton" onClick={()=>handleRemove(key)} sx={{'&:hover':{color:'#fff',background:red[800]}}}><RemoveIcon/></IconButton></Tooltip>
                                                </ListItemButton>
                                            </ListItem>
                                        </Fade>
                                    )
                                }
                                
                            </List>
                        </Paper>
                        <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                            <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon/>} disabled={selectedRemoved.length === 0?true:false} onClick={handleProceed} className="custom-roundbutton">Proceed</Button>
                        </Box>
                        <SmallModal open={openProceed} close={handleCloseProceed} title='Add new trainee'>
                            <Box>
                                <Box>
                                
                                </Box>
                                    <Typography sx={{background:red[800],color:'#fff',p:1}}>Trainee to remove:</Typography>
                                    <Paper sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                                        <List>
                                        {
                                            selectedRemoved.map((item,key)=>
                                                <Fade in key={key}>
                                                    <ListItem>
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <PersonIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`${item.lname}, ${item.fname}`} />
                                                            <Tooltip title='Delete selected'><IconButton color='error' className="custom-iconbutton" onClick={()=>handleSelectedRemove(key)}><DeleteIcon/></IconButton></Tooltip>
                                                        </ListItemButton>
                                                    </ListItem>
                                                </Fade>
                                            )
                                        }
                                    </List>
                                </Paper>
                                <Box sx={{mt:3}}>
                                    <Typography sx={{background:green[800],color:'#fff',p:1}}>Available Reserved Trainee:</Typography>
                                    <Paper sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                                        <List>
                                        {
                                            reservedData.length > 0
                                            ?
                                            reservedData.map((item,key)=>
                                                <ListItem key={key}>
                                                    <ListItemButton>
                                                        <Tooltip title={`Rank ${item.reserved_order}`}>
                                                        <ListItemIcon>
                                                            # &nbsp;{item.reserved_order}
                                                            {/* <StarIcon/> &nbsp;{item.reserved_order} */}
                                                        </ListItemIcon>
                                                        </Tooltip>
                                                        <ListItemText primary={`${item.lname}, ${item.fname}`} secondary={`Rate: ${item.rate}`}/>
                                                        {/* <Tooltip title='Remove Trainee'><IconButton color='error' className="custom-iconbutton" onClick={()=>handleRemove(key)}><RemoveIcon/></IconButton></Tooltip> */}
                                                        <Tooltip title='Click to select'><Checkbox checked={selectedAdded.includes(item.training_shortlist_id)?true:false} onChange={()=>handleSelectAdded(item.training_shortlist_id)}/></Tooltip>
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                            :
                                            <ListItem>
                                                 <ListItemButton>
                                                    <ListItemText sx={{display:'flex',justifyContent:'center',alignItems:'center'}} primary='No data'>
                                                    </ListItemText>
                                                 </ListItemButton>
                                            </ListItem>
                                        }
                                    </List>
                                </Paper>
                                </Box>
                                <Box sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                                    {/* <label htmlFor={"contained-attachment-file"}>
                                        <Input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" id={"contained-attachment-file"} type="file" onChange = {(value)=>handleSetFile(value)}/>
                                        <Tooltip title='Upload Attachment' component="span"><Button variant='outlined' color='primary' className="custom-roundbutton"><AttachFileIcon/></Button></Tooltip>
                                    </label> */}
                                    <Button variant="contained" className="custom-roundbutton" color="success" onClick={()=>handleSubmit(1)}>Submit</Button>
                                </Box>
                            </Box>
                        </SmallModal>

                        <SmallModal open={openAddModal} close = {handleCloseAddModal} title='Adding new trainee'>
                            <Box>
                                <Box>
                                
                                </Box>
                                <Box sx={{mt:3}}>
                                    <Typography sx={{background:green[800],color:'#fff',p:1}}>Available Reserved Trainee:</Typography>
                                    <Paper sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                                        <List>
                                        {
                                            reservedData.length>0
                                            ?
                                            reservedData.map((item,key)=>
                                                <ListItem key={key}>
                                                    <ListItemButton>
                                                        <Tooltip title={`Rank ${item.reserved_order}`}>
                                                        <ListItemIcon>
                                                            {/* <StarIcon/> &nbsp;{item.reserved_order} */}
                                                            # &nbsp;{item.reserved_order}
                                                        </ListItemIcon>
                                                        </Tooltip>
                                                        <ListItemText primary={`${item.lname}, ${item.fname}`} secondary={`Rate: ${item.rate}`}/>
                                                        {/* <Tooltip title='Remove Trainee'><IconButton color='error' className="custom-iconbutton" onClick={()=>handleRemove(key)}><RemoveIcon/></IconButton></Tooltip> */}
                                                        <Tooltip title='Click to select'><Checkbox checked={selectedAdded.includes(item.training_shortlist_id)?true:false} onChange={()=>handleSelectAdded(item.training_shortlist_id)}/></Tooltip>
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                            :
                                            <ListItem>
                                                 <ListItemButton>
                                                    <ListItemText sx={{display:'flex',justifyContent:'center',alignItems:'center'}} primary='No data'>
                                                    </ListItemText>
                                                 </ListItemButton>
                                            </ListItem>
                                        }
                                    </List>
                                </Paper>
                                </Box>
                                <Box sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                                    {/* {
                                        selectedAdded.length > 0
                                        ?
                                        <label htmlFor={"contained-attachment-file"}>
                                            <Input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" id={"contained-attachment-file"} type="file" onChange = {(value)=>handleSetFile(value)} />
                                            <Tooltip title='Upload Attachment' component="span"><Button variant='outlined' color='primary' className="custom-roundbutton"><AttachFileIcon/></Button></Tooltip>
                                        </label>
                                        :
                                        null

                                    } */}
                                   
                                    <Button variant="contained" className="custom-roundbutton" color="success" onClick={()=>handleSubmit(0)} disabled={selectedAdded.length ===0 ? true:false}>Submit</Button>
                                </Box>
                            </Box>
                        </SmallModal>
                    </Grid>
                    :
                    null
                }
                
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                    onClick={handleCloseBackdrop}
                    >
                <CircularProgress color="inherit" />
                </Backdrop>
            </Grid>
        </Box>
    )
}