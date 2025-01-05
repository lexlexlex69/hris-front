import { Grid, TextField, Typography,Button,Radio,FormControl,FormLabel,RadioGroup,InputLabel,Select,MenuItem,Container,Box,Tooltip,IconButton   } from '@mui/material';
import React,{useEffect, useState} from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Swal from 'sweetalert2';
import { updateTemplate } from '../WorkScheduleRequest';
import { blue, green, red, yellow } from '@mui/material/colors'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
export default function UpdateTemplateModal(props){
    const [templateName,setTemplateName] = useState('')
    const [selectedGroupWorkingHours,setSelectedGroupWorkingHours] = React.useState('')
    const [workScheduleData,setWorkScheduleData] = React.useState([])
    const [oldWorkData,setOldWorkData] = useState([])
    const [oldRestData,setOldRestData] = useState([])
    const [workingDays,setWorkingDays] = React.useState({
        Sunday:false,
        Monday:false,
        Tuesday:false,
        Wednesday:false,
        Thursday:false,
        Friday:false,
        Saturday:false
    })
    useEffect(()=>{
        setTemplateName(props.data.template_name)
        setOldWorkData(JSON.parse(props.data.working_days))
        setOldRestData(JSON.parse(props.data.rest_days))
        setWorkScheduleData(props.workScheduleData)
        var Sunday = false;
        var Monday = false;
        var Tuesday = false;
        var Wednesday = false;
        var Thursday = false;
        var Friday = false;
        var Saturday = false;
        JSON.parse(props.data.working_days).forEach(element => {
            if(element.day === 'Sunday'){
                Sunday = true;
            }
            if(element.day === 'Monday'){
                Monday = true;
            }
            if(element.day === 'Tuesday'){
                Tuesday = true;
            }
            if(element.day === 'Wednesday'){
                Wednesday = true;
            }
            if(element.day === 'Thursday'){
                Thursday = true;            
            }
            if(element.day === 'Friday'){
                Friday = true;            
            }
            if(element.day === 'Saturday'){
                Saturday = true;            
            }
        });
        var days = {
            Sunday:Sunday,
            Monday:Monday,
            Tuesday:Tuesday,
            Wednesday:Wednesday,
            Thursday:Thursday,
            Friday:Friday,
            Saturday:Saturday
        }
        setWorkingDays(days)
    },[])

    const [workingDaysArray,setWorkingDaysArray] = React.useState([])
    const [restDaysArray,setRestDaysArray] = React.useState([])
    const [workingDayScheduleType,setWorkingDayScheduleType] = React.useState('')
    
    useEffect(()=>{
        var tempArr = {...workingDays};
        var work_days = [];
        var rest_days = [];
        // tempArr.forEach(el=>{
        //     if(el){
        //         temp.push(el)
        //     }
        // })
        for(var key in tempArr){
            if(tempArr[key]){
                work_days.push({
                    day:key,
                    whrs_data:''
                })
            }else{
                rest_days.push({
                    day:key
                })
            }
        }
        setWorkingDaysArray(work_days)
        setRestDaysArray(rest_days)
    },[workingDays])
    
    const [restDays,setRestDays] = React.useState({
        Sunday:false,
        Monday:false,
        Tuesday:false,
        Wednesday:false,
        Thursday:false,
        Friday:false,
        Saturday:false,
    })
    
    const handleSetWorkingDays = (event)=>{
        setWorkingDays({
            ...workingDays,
            [event.target.name]: event.target.checked,
          });
    }
    const handleIndividualWorkSchedule = (key,value) =>{

        var data = [...workingDaysArray];
        data[key].whrs_data = value;
        setWorkingDaysArray(data)
    }
    const saveTemplate = (event)=>{
        event.preventDefault();
        var data;
        if(templateName.length === 0){
            Swal.fire({
                icon:'info',
                title:'Please input template name'
            })
        }else if(workingDayScheduleType.length === 0){
            Swal.fire({
                icon:'info',
                title:'Please select Working Days Schedule Type'
            })
        }else if(workingDayScheduleType === 'Individual'){
            var temp_work_days = []
            workingDaysArray.forEach(el=>{
                temp_work_days.push(
                    {
                        day:el.day,
                        whrs_desc:el.whrs_data.whrs_desc,
                        whrs_code:el.whrs_data.whrs_code

                    }
                )
            })
            data  = {
                template_id:props.data.template_id,
                work_days:temp_work_days,
                rest_days:restDaysArray,
                template_name:templateName
            }
            updateTemplate(data)
            .then(response=>{
                const data = response.data
                console.log(data)
                if(response.data.status === 200){
                    props.close()
                    props.onUpdateTemplate()
                    Swal.fire({
                        icon:'success',
                        title:response.data.message,
                        showConfirmButton:false,
                        timer:1500
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:response.data.message
                    })
                }
            }).catch(error=>{
                console.log(error)
            })
        }else{
            var temp_work_days = [];
            workingDaysArray.forEach(el=>{
                temp_work_days.push({
                    day:el.day,
                    whrs_code:selectedGroupWorkingHours.whrs_code,
                    whrs_desc:selectedGroupWorkingHours.whrs_desc,
                    time_in:selectedGroupWorkingHours.whrs_time1,
                    break_out:selectedGroupWorkingHours.whrs_time2,
                    break_in:selectedGroupWorkingHours.whrs_time3,
                    time_out:selectedGroupWorkingHours.whrs_time4,
                })
            })
            data = {
                template_id:props.data.template_id,
                work_days:temp_work_days,
                rest_days:restDaysArray,
                template_name:templateName
            }
            console.log(data)
            updateTemplate(data)
            .then(response=>{
                const data = response.data
                console.log(data)
                if(response.data.status === 200){
                    props.close()
                    props.onUpdateTemplate()
                    Swal.fire({
                        icon:'success',
                        title:response.data.message,
                        showConfirmButton:false,
                        timer:1500
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:response.data.message
                    })
                }
            }).catch(error=>{
                console.log(error)
            })
        }
        
        
    }
    return(
        <Container>
        <form onSubmit={saveTemplate}>
        <Box sx={{height:'60vh',overflowY:'scroll',marginTop:'20px',padding:'10px'}}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info"><small><em>* Note: Updating this template schedule will not automatically reflect the data to those specific updated schedule from this template.</em></small></Alert>
                
            </Grid>
            {/* <Grid item xs={12}>
                <Box sx={{background:'#f4f4f4',color:'#4c4c4c',borderRadius:'5px',padding:'15px'}}>
                <Typography sx={{fontSize:'1rem'}}><em>Current Work Schedule:</em></Typography>
                <Typography sx={{color:'#1976d2',mt:1,fontWeight:'bold'}}>Working Days</Typography>
                <Box style={{display:'flex',flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap', width:'100%'}}>
                {oldWorkData.map((data,key)=>
                    <Typography key ={key} sx={{fontWeight:'bold',fontSize:'.9rem'}}>&#8226; {data.day} ({data.whrs_desc})</Typography>
                )}
                </Box>

                <Typography sx={{color:'#1976d2',mt:1,fontWeight:'bold'}}>Rest Days</Typography>
                <Box style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap', width:'100%'}}>
                {oldRestData.map((data,key)=>
                    <Typography key ={key} sx={{fontWeight:'bold',fontSize:'.9rem'}}>&#8226; {data.day} </Typography>
                )}
                </Box>
                </Box>

            </Grid> */}
            <Grid item xs={12}>
                <TextField label = 'Template Name' value = {templateName} onChange = {(value)=>setTemplateName(value.target.value)} fullWidth required/>
            </Grid>
            
            <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between '}}>
                    <Typography sx={{fontWeight:'bold'}}>Working Days</Typography>
                    <Tooltip title="Unselected days will be set as Rest days">
                    <IconButton color='primary'>
                        <InfoOutlinedIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
                <FormGroup sx={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                    <FormControlLabel
                        control={
                        <Checkbox
                        checked={workingDays.Sunday}
                        onChange={handleSetWorkingDays}
                        name="Sunday"
                        />
                        }
                        label="Sunday"
                    />
                    <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Monday}
                            onChange={handleSetWorkingDays}
                            name="Monday"/>
                            }
                            label="Monday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Tuesday}
                            onChange={handleSetWorkingDays}
                            name="Tuesday"/>
                            }
                            label="Tuesday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Wednesday}
                            onChange={handleSetWorkingDays}
                            name="Wednesday"/>
                            }
                            label="Wednesday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Thursday}
                            onChange={handleSetWorkingDays}
                            name="Thursday"/>
                            }
                            label="Thursday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Friday}
                            onChange={handleSetWorkingDays}
                            name="Friday"/>
                            }
                            label="Friday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Saturday}
                            onChange={handleSetWorkingDays}
                            name="Saturday"/>
                            }
                            label="Saturday"
                        />
                </FormGroup>
            </Grid>
            {
                workingDaysArray.length !==0
                ?
                <Grid item xs={12}>
                    <FormLabel id="schedule-type" sx={{fontWeight:'bold',color:'black'}}>Working Days Schedule Type</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="schedule-type"
                        name="schedule-type-radio"
                    >
                        <FormControlLabel value="Individual" control={<Radio />} label="Individual" onChange = {(value)=>setWorkingDayScheduleType(value.target.value)}/>
                        <FormControlLabel value="Group" control={<Radio />} label="Group" onChange = {(value)=>setWorkingDayScheduleType(value.target.value)}/>
                    </RadioGroup>
                </Grid>
                :
                ''
            }
            {
                
                workingDayScheduleType.length !==0
                ?
                    workingDayScheduleType === 'Individual'
                    ?
                    <Grid item xs={12}>
                    {
                    workingDaysArray.map((data,key)=>
                    <FormControl fullWidth key = {key} sx={{marginBottom:'10px'}}>
                        <InputLabel id={"schedule-time"+key}>{data.day}</InputLabel>
                        <Select
                            labelId={"schedule-time"+key}
                            id={"schedule-time"+key}
                            label={data.day}
                            value={data.whrs_data}
                            onChange = {(value)=>handleIndividualWorkSchedule(key,value.target.value)}
                            required
                        >
                            {workScheduleData.map((data,key)=>
                                <MenuItem value={data} key={key}>{data.whrs_desc}</MenuItem>

                            )}
                        </Select>
                        </FormControl>
                    )}
                    </Grid>
                    :
                        workingDayScheduleType === 'Group'
                        ?
                        <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="schedule-time">Working Hours</InputLabel>
                            <Select
                                labelId="schedule-time"
                                id="schedule-time"
                                label="Working Hours"
                                value = {selectedGroupWorkingHours}
                                onChange = {(value)=>setSelectedGroupWorkingHours(value.target.value)}
                                required
                            >
                                {workScheduleData.map((data,key)=>
                                    <MenuItem value={data} key={key}>{data.whrs_desc}</MenuItem>

                                )}
                            </Select>
                            </FormControl>
                        </Grid>
                        :
                        ''
                :
                ''
            }
            
        </Grid>
        </Box>
        <hr/>

        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                {
                    workingDaysArray.length !== 0
                    ?
                    <Tooltip title='Save Template Update'><Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='outlined' color='success' type='submit' startIcon={<SaveOutlinedIcon/>}>Save</Button></Tooltip>
                    :
                    <Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='outlined' color='success' disabled type='submit' startIcon={<SaveOutlinedIcon/>}>Save</Button>

                }
                &nbsp;
                <Tooltip title='Close Modal'><Button sx={{'&:hover':{color:'white',background:red[800]}}} variant='outlined' color='error' onClick = {props.close} startIcon={<CancelOutlined/>}>Close</Button></Tooltip>
        </Box>
        </form>
        </Container>
    )
}