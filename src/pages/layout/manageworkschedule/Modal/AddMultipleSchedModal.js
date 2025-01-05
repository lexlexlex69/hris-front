import { Grid, Typography,Autocomplete,TextField,Button,Box,Modal, Tooltip, IconButton,Stack,Fade,Alert } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React,{useEffect, useState} from 'react';
import moment from 'moment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue, green, red, yellow } from '@mui/material/colors'
import Swal from 'sweetalert2';
import { addMultipleWorkSched,getEmpStatus } from '../WorkScheduleRequest';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
const addMultipleSchedStatusStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:350,
    marginBottom: 0,
    bgcolor: '#fff',
    border: '2px solid #fff',
    borderRadius:3, 
    boxShadow: 24,
  };
export default function AddMultipleSchedModal(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedDept,setSelectedDept] = useState([]);
    const [selectedYear,setSelectedYear] = useState('');
    const [selectedTemplate,setSelectedTemplate] = useState('');
    const [selectedTemplateWorkingDaysDetails,setSelectedTemplateWorkingDaysDetails] = React.useState([])
    const [selectedTemplateRestDaysDetails,setSelectedTemplateRestDaysDetails] = React.useState([])
    const [year,setYear] = useState([])
    const [currAddedDept,setCurrAddedDept] = useState('')
    const [successMultipleAdd,setSuccessMultipleAdd] = useState(false)
    const [multipleAddStatusModal,setMultipleAddStatusModal] = useState(false)
    const [multipleAddStatusLoading,setMultipleAddStatusLoading] = useState(true)
    const [currAddedDeptNo,setCurrAddedDeptNo] = useState(0)
    const [empStatusData,setEmpStatusData] = useState([])
    const [loadEmpStatus,setLoadEmpStatus] = useState(true)
    useEffect(()=>{
        var curr = 1;
        var year = [];
        for(var i = 0 ; i<5 ; i++){
            year.push(curr)
            curr = curr + 1;
        }
        setYear(year)
        getEmpStatus()
        .then(res=>{
            setEmpStatusData(res.data)
            setLoadEmpStatus(false)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const submitData = (event)=>{
        event.preventDefault();
        if(selectedDept.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Department field is required!'
            })
        }else{
            var dept_code = [];
            var template_days = [];
            var temp_year = [];
            for(var inc_year = 0 ; inc_year < selectedYear ; inc_year ++){
                var year  = parseInt(moment(new Date()).format('YYYY'))+inc_year
                temp_year.push(year);
            }
            selectedDept.forEach(el=>{
                dept_code.push(el.dept_code)
            })
            var data2 = {
                dept_code:dept_code,
                template_id:selectedTemplate.template_id,
                year:temp_year,
                emp_status:empStatus
            }
            addMultipleWorkSched(data2)
            .then(res=>{
                console.log(res.data)
                if(res.data>0){
                    Swal.fire({
                        icon:'success',
                        title:'Successfully added',
                        html:'Total Data Added: '+res.data, 
                    })
                }else{
                    Swal.fire({
                        icon:'info',
                        title:'No Data were added',
                        html:'Work schedule may have already exist.'
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
            
        }
        

    }
    const handleSetTemplate = (event) => {
        var data = event.target.value
        var working_days = JSON.parse(data.working_days)
        var rest_days = JSON.parse(data.rest_days)
        setSelectedTemplateWorkingDaysDetails(working_days)
        setSelectedTemplateRestDaysDetails(rest_days)
        setSelectedTemplate(event.target.value);
    };
    const [empStatus,setEmpStatus] = React.useState([])
    const handleEmpStatus = (value)=>{
        const index = empStatus.findIndex(object => {
            return object === value.target.value;
        });
        // console.log(index)

        if(index === -1){
            var temp = empStatus;
            temp.push(value.target.value);
            setEmpStatus(temp)
        }else{
            empStatus.splice(index, 1);
        }
    }
    return (
        <Fade in>
        <form onSubmit={submitData} style ={{margin:'10px'}}>
        <Grid container spacing={2}>
            {/* <Grid item xs={12}>
            <Alert severity="info"><em>Existing updatedschedule data that hawill not be updated/override. Delete first the schedule before adding a new one.</em></Alert>
            </Grid> */}
            <Grid item xs={12}>
                <Autocomplete
                    // disablePortal
                    disableCloseOnSelect
                    multiple
                    id="dept"
                    options={props.deptData}
                    value={selectedDept}
                    onChange = {(event,newValue)=>{
                        setSelectedDept(newValue)
                    }}
                    getOptionLabel={(option) => option.dept_title}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Department *"
                    />
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Box sx={{width:'100%'}}>
                    <Typography sx={{fontWeight:'bold'}}>Employment Status</Typography>
                    {
                        loadEmpStatus
                        ?
                        <Box sx={{textAlign:'center'}}>
                            <CircularProgress color="success"/>
                        </Box>
                        :
                        <Fade in = {!loadEmpStatus}>
                        <FormGroup sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',flexWrap:'wrap'}}>
                        {empStatusData.map((data,key)=>
                            <FormControlLabel key={key} sx={{fontSize:'.7rem'}} control={<Checkbox sx = {{color:'orange'}} value = {data.code} onChange={handleEmpStatus}/>} label={data.description} />
                        )}
                        </FormGroup>
                        </Fade>
                    }
                    
                    </Box>
                    <Box>
                        <Tooltip title = "Not selecting emp status will add all types of employee">
                            <IconButton sx={{color:blue[500]}}>
                                <HelpOutlineOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth required>
                    <InputLabel id="select-year-id">Year</InputLabel>
                    <Select
                    labelId="select-year-id"
                    id="select-year"
                    value={selectedYear}
                    label="Year"
                    onChange={(value)=>setSelectedYear(value.target.value)}
                    >
                    {year.map((data,key)=>
                        <MenuItem value={data} key={key}>{data}</MenuItem>
                    )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Work Schedule Template</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTemplate}
                    label="Work Schedule Template"
                    onChange={handleSetTemplate}
                    >
                    {props.templateData.map((data,key)=>
                        <MenuItem value={data} key={key}>{data.template_name}</MenuItem>
                    )}
                    </Select>
                </FormControl>

                {
                    selectedTemplate.length !==0
                    ?
                    <Grid item xs={12} sx={{p:2,margin:'10px 0 10px 0',border:'solid 1px #c4c4c4',borderRadius:'5px'}}>
                        <Typography sx={{fontWeight:'bold',marginBottom:'5px'}}>Schedule Details:</Typography>
                        <Box severity="info" sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-start'}}>
                            {selectedTemplateWorkingDaysDetails.map((data,key)=>
                                <Typography key = {key} sx={{background:'#e4e4e4',p:1,mr:1,borderRadius:'20px',fontSize:'1rem','&:hover':{background:'#c4c4c4'}}}>{data.day}<br/> {data.whrs_desc}</Typography>
                            )}
                        </Box>
                    </Grid>  
                    :
                    ''
                }
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',position:'sticky',bottom:'-17px',background:'#fff'}}>
                <Tooltip title ='Save Schedule'><Button sx={{'&:hover':{color:'white',background:green[800]}}}variant='outlined' type='submit' startIcon={<SaveOutlinedIcon/>} color='success'>Save</Button></Tooltip>
                &nbsp;
                <Tooltip title ='Close Modal'><Button sx={{'&:hover':{color:'white',background:red[800]}}}variant='outlined' startIcon={<CancelOutlinedIcon/>} color='error' onClick={props.close}>Close</Button></Tooltip>
            </Grid>
            <Modal
                open={multipleAddStatusModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={addMultipleSchedStatusStyle}>
                    {/* <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setMultipleAddStatusModal(false)}/> */}
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Adding Employee Schedule Status
                    </Typography>
                    <Box sx={{p:2}}>
                        {
                            currAddedDeptNo === selectedDept.length
                            ?
                            <Box>
                             <Typography sx={{fontSize:'1.3rem',color:'green',textAlign:'center'}}>Successfully Added</Typography>
                                <Box sx={{background:'#f4f4f4',padding:'5px',borderRadius:'5px'}}>
                                <Typography sx={{textAlign:'left',fontWeight:'bold',fontSize:'1.1rem'}}>Department List:</Typography>
                                    <ul style={{textAlign:'left',fontSize:'.9rem'}}>
                                    {selectedDept.map((data,key)=>
                                        <li key = {key} >{data.dept_title}</li>
                                    )}
                                    </ul>
                                </Box>
                                <Button sx={{float:'right',mt:1,mb:1}} variant='outlined' onClick = {()=> setMultipleAddStatusModal(false)}>Ok</Button>


                            </Box>
                            :
                            <Box sx={{textAlign:'center'}}>
                            <CircularProgress color="success" />
                            <Typography>Department Currently Added : {currAddedDept}</Typography>
                            <Typography><strong>{currAddedDeptNo}</strong> of {selectedDept.length} Department has been added.</Typography>
                            <small>* Please don't close this page while saving the data.</small>
                            </Box>
                        }
                        {/* <Typography>Status : {multipleAddStatusLoading?'pending':'success'}</Typography> */}
                        {/* <Button></Button> */}
                    </Box>
                </Box>
            </Modal>
        </Grid>
        </form>
        </Fade>
    )
}