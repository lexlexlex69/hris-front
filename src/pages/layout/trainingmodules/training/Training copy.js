import React,{useEffect, useState} from 'react';
import {Grid,Typography,Stack,Skeleton,Box,Paper,Button,Modal,InputLabel ,MenuItem ,FormControl,Select  } from '@mui/material';
import {useNavigate}from "react-router-dom";
import {blue,red,green} from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Shortlist from './Dialog/Shortlist';
import Add from './Modal/Add';
import { generateShortlist, getTrainings } from './TrainingRequest';
import moment from 'moment';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';

import './Training.css'
import Swal from 'sweetalert2';
import Summary from './Dialog/Summary';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
export default function Training(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 345:600,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };

    const [isLoading,setIsLoading] = useState(true)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [colSpan, setColSpan] = useState([]);
    const [filterDeptData, setFilterDeptData] = useState([]);
    const [selectedFilterDept, setSelectedFilterDept] = useState('');
    const [generatedShortlistData,setGeneratedShortlistData] = useState([])
    const [generatedShortlistTotalResData,setGeneratedShortlistTotalResData] = useState([])
    const [trainerScheduleData,setTrainerScheduleData] = useState([]);
    useEffect(()=>{
        setIsLoading(false)
        // getTrainings()
        // .then(res=>{
        //     console.log(res.data)
        //     setData1(res.data)
        //     setData(res.data)
        //     const uniqueDept = [...new Set(res.data.map(item => item.short_name))];
        //     setFilterDeptData(uniqueDept);
            
        // }).catch(err=>{
        //     console.log(err)
        // })
    },[])
    const [open, setOpen] = useState(false);
    const [data,setData] = useState([])
    const [data1,setData1] = useState([])
    const [trainingDetails,setTrainingDetails] = useState([])
    const [shortListDetails,setShortListDetails] = useState([])
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    
    const handleDialogOpen = (data) =>{
        // event.preventDefault();
        var trainer_name = '';
        console.log(data)
        data.trainer.forEach(el => {
            trainer_name = trainer_name+el.lname+', '+el.fname+' ;'
        });
        data.trainer_name = trainer_name
        setTrainingDetails(data)
        Swal.fire({
            icon:'info',
            title:'Generating Shortlist',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        generateShortlist(data)
        .then(res=>{
            if(res.data.data.length ===0){
                Swal.fire({
                    icon:'error',
                    title:'No data found',
                    html:'Please try different meta tags'
                })
            }else{
                setGeneratedShortlistData(res.data.data)
                setGeneratedShortlistTotalResData(res.data.total_result)
                Swal.close()
                setOpenDialog(true);
            }
            // console.log(res.data) 
            
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })

    }
    const handleSaveShortlist = (data)=>{
        setShortListDetails(data)
        setOpenSummaryDialog(true)
        console.log(data)
    }
    const [openDialog, setOpenDialog] = useState(false);
    const [openSummaryDialog, setOpenSummaryDialog] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleCloseSummaryDialog = () => {
        setOpenSummaryDialog(false);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const trainingNameFormat = (data) =>{
        let arr_data = JSON.parse(data.arr)
        console.log(arr_data)
        
    }
    const testBtn = () =>{
        var checkedValue = []; 
        var inputElements = document.getElementsByClassName('selected-emp');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                checkedValue.push(inputElements[i].value);
            }
        }
        console.log(checkedValue)
    }
    const handleChangeFilter = (event) => {
        setSelectedFilterDept(event.target.value);
        let old = data1;
        let temp = [];
        old.forEach(element => {
            if(element.short_name === event.target.value){
                temp.push(element)
            }
        });
        setData(temp)
        var inputElements = document.getElementsByClassName('selected-emp');
        for(var i=0; inputElements[i]; ++i){
            inputElements[i].checked = false
        }
    };
    const handleClearFilter = () => {
        setData(data1)
        setSelectedFilterDept('')
    }
    
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{margin:'20px'}}>
            <Stack sx={{marginTop:'-10px'}}>
                <Skeleton variant="text" height={'110px'} animation="wave"/>
            </Stack>
            </Box>

            :
            <Box sx={{margin:'20px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                        <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Create Training Details
                            </Typography>
                        </Box>
                    </Grid>
                    <br/>
                    <Grid item xs={12} sx={{display:'flex',flexDirectionL:'row',justifyContent:'flex-end'}}>
                        <Button variant='outlined' sx={{'&:hover':{color:'#fff',background:blue[800]}}}onClick={handleOpen}><AddOutlinedIcon/></Button>
                    </Grid>
                    <Grid item xs={12} lg ={6} sx={{mb:2}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-start'}}>
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Filter Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedFilterDept}
                            label="Filter Department"
                            onChange={handleChangeFilter}
                        >
                            {
                                filterDeptData.map((data,key)=>
                                    <MenuItem value={data} key = {key}>{data}</MenuItem>

                                )
                            }
                        </Select>
                        </FormControl>
                        &nbsp;
                        <Button variant='outlined' color='error' startIcon={<BackspaceOutlinedIcon/>} onClick = {handleClearFilter}>clear</Button>
                        </Box>
                        
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ maxHeight:'60vh',overflow:'scroll'}}>
                        <table id = 'trn-row' className='table table-bordered'>
                        <thead style={{verticalAlign:'middle',textAlign:'center',position:'sticky',top:0,background:'#0C7CD5',fontSize:'11px',color:'white'}}>
                        <tr>
                            <th rowSpan={2}>DEPARTMENT NAME</th>
                            <th rowSpan={2}>EMPLOYEE NAME</th>
                            <th rowSpan={2}>BIRTHDAY</th>
                            <th rowSpan={2}>AGE</th>
                            <th rowSpan={2}>POSITION</th>
                            <th rowSpan={2}>DATE HIRED</th>
                            <th rowSpan={2}>NO. OF YEARS IN CGB</th>
                            <th rowSpan={2}>TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS / TRAINING PROGRAMS</th>
                            <th colSpan={2}>INCLUSIVE DATES OF ATTENDANCE (mm/dd/yyyy)</th>
                            <th rowSpan={2}>NUMBER OF HOURS</th>
                            <th rowSpan={2}>TYPE OF I.D (Technical, Foundational, Managerial/Supervisory)</th>
                            <th rowSpan={2}>CONDUCTED / SPONSORED BY</th>
                            <th rowSpan={2}>REMARKS</th>
                            <th rowSpan={2}>SELECT</th>
                        </tr>
                        <tr>
                            <th>
                                FROM
                            </th>
                            <th>
                                TO
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{verticalAlign:'top',fontSize:'10px'}}>
                        {/* {
                            data.map((row,key)=>
                            <tr key={key} className='tbl-row'>
                                <td>{row.short_name}</td>
                                <td>{row.fullname}</td>
                                <td>{row.emp_dob}</td>
                                <td>{moment().diff(moment(row.emp_dob,'YYYY-MM-DD'), 'years')}</td>
                                <td>{row.position_name}</td>
                                <td>{row.date_hired}</td>
                                <td>{moment().diff(moment(row.date_hired,'YYYY-MM-DD'), 'years')}</td>
                                <td>
                                    {
                                        JSON.parse(row.arr).map((trn,key)=>
                                            <tr key = {key} style = {{border:'solid 1px'}}>
                                                <td>{trn.title}</td>
                                            </tr>
                                        )
                                    }
                                </td>

                            </tr>
                            )
                        } */}
                        {
                            data.map((row,key)=>
                                key === 0
                                ?
                                <tr key={key} className='tbl-row'>
                                    <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.short_name}</td>
                                    <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.fullname}</td>
                                    <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.emp_dob}</td>
                                    <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{moment().diff(moment(row.emp_dob,'YYYY-MM-DD'), 'years')}</td>
                                    <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold',overflow:'hidden'}}>{row.position_name}</td>
                                    <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.date_hired}</td>
                                    <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{moment().diff(moment(row.date_hired,'YYYY-MM-DD'), 'years')}</td>
                                    <td>{row.title}</td>
                                    <td>{moment(row.datefrom,'YYYY-MM-DD').format('MM/DD/YYYY')}</td>
                                    <td>{row.dateto}</td>
                                    <td>{row.nohours}</td>
                                    <td>{row.typeLD}</td>
                                    <td>{row.conducted}</td>
                                    <td></td>
                                    <td style={{position:'sticky',top:'100px'}}><input type = 'checkbox' value = {JSON.stringify({emp_no:row.emp_id,dept_code:row.dept_code,dept_name:row.short_name})} className="selected-emp"/></td>
                                </tr>
                                :
                                    row.short_name === data[key-1].short_name
                                    ?
                                        row.fname === data[key-1].fname
                                        ?
                                        <tr key={key} className='tbl-row'>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{row.title}</td>
                                            <td>{moment(row.datefrom,'YYYY-MM-DD').format('MM/DD/YYYY')}</td>
                                            <td>{row.dateto}</td>
                                            <td>{row.nohours}</td>
                                            <td>{row.typeLD}</td>
                                            <td>{row.conducted}</td>
                                            <td></td>
                                        </tr>
                                        :
                                        <tr key={key} className='tbl-row'>
                                            <td></td>
                                            <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.fullname}</td>
                                            <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.emp_dob}</td>
                                            <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{moment().diff(moment(row.emp_dob,'YYYY-MM-DD'), 'years')}</td>
                                            <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.position_name}</td>
                                            <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.date_hired}</td>
                                            <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{moment().diff(moment(row.date_hired,'YYYY-MM-DD'), 'years')}</td>
                                            <td>{row.title}</td>
                                            <td>{moment(row.datefrom,'YYYY-MM-DD').format('MM/DD/YYYY')}</td>
                                            <td>{row.dateto}</td>
                                            <td>{row.nohours}</td>
                                            <td>{row.typeLD}</td>
                                            <td>{row.conducted}</td>
                                            <td></td>
                                            <td style={{position:'sticky',top:'100px'}} ><input type = 'checkbox' value = {JSON.stringify({emp_no:row.emp_id,dept_code:row.dept_code,dept_name:row.short_name})} className="selected-emp"/></td>
                                        </tr>
                                    
                                    :
                                    <tr key={key} className='tbl-row'>
                                        <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.short_name}</td>
                                        <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.fullname}</td>
                                        <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.emp_dob}</td>
                                        <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{moment().diff(moment(row.emp_dob,'YYYY-MM-DD'), 'years')}</td>
                                        <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.position_name}</td>
                                        <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{row.date_hired}</td>
                                        <td style={{position:'sticky',top:'100px',background:'#F37E21',color:'white',fontWeight:'bold'}}>{moment().diff(moment(row.date_hired,'YYYY-MM-DD'), 'years')}</td>
                                        <td>{row.title}</td>
                                        <td>{moment(row.datefrom,'YYYY-MM-DD').format('MM/DD/YYYY')}</td>
                                        <td>{row.dateto}</td>
                                        <td>{row.nohours}</td>
                                        <td>{row.typeLD}</td>
                                        <td>{row.conducted}</td>
                                        <td></td>

                                        <td style={{position:'sticky',top:'100px'}}><input type = 'checkbox' value = {JSON.stringify({emp_no:row.emp_id,dept_code:row.dept_code,dept_name:row.short_name})} className="selected-emp"/></td>
                                    </tr>

                                
                            )
                        }
                        
                    </tbody>
                    </table>
                    </Paper>
                    <Button onClick={testBtn}>Test</Button>
                    </Grid>
                </Grid>
                <Modal
                    open={open}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {/* <CancelOutlinedIcon/> */}
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpen(false)}/>

                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Create training Details
                        </Typography>
                        <Box sx={{mt:2,pt:0,pl:matches?2:4,pr:matches?2:4,pb:2,maxHeight:'70vh',overflowY:'scroll'}}>
                            <Add handleDialogOpen = {handleDialogOpen}/>
                        </Box>
                    </Box>
                </Modal>
                <Dialog
                    fullScreen
                    open={openDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Generated Shortlist
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Shortlist data = {generatedShortlistData} total_results = {generatedShortlistTotalResData} handleSaveShortlist = {handleSaveShortlist}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={openSummaryDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseSummaryDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Training Details Summary
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseSummaryDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Summary trainingDetails = {trainingDetails} shortListDetails = {shortListDetails} setTrainerScheduleData={setTrainerScheduleData} trainerScheduleData = {trainerScheduleData} closeSummary = {handleCloseSummaryDialog} closeShortList = {handleCloseDialog} closeModal = {handleClose}/>
                    </Box>

                </Dialog>
            </Box>
        }
        </>
    )
}