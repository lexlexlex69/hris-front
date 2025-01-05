import { Grid, Typography,Autocomplete,TextField,Button,Box,Modal } from '@mui/material';
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
import { addMultipleWorkSched } from '../WorkScheduleRequest';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CircularProgress from '@mui/material/CircularProgress';

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
    useEffect(()=>{
        var curr = 1;
        var year = [];
        for(var i = 0 ; i<5 ; i++){
            year.push(curr)
            curr = curr + 1;
        }
        setYear(year)
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
            var template_days = []
            JSON.parse(selectedTemplate.working_days).forEach(el=>{
                template_days.push(el.day)
            })

            /**
             * Loop selected number of year
             */
            for(var inc_year = 0 ; inc_year < selectedYear ; inc_year ++){
                var year  = parseInt(moment(new Date()).format('YYYY'))+inc_year;
                var schedule_data = [];
                /**
                 * Get all months
                 */
                moment.months().forEach(element => {
                    var schedule = [];
                    /**
                     * Convert month to new Date
                     */
                    var month_start = moment().month(element)
                    var month = moment(month_start).format('MM')-1;
                    // var year = moment(month_start).format('YYYY');
                    var from_period = new Date(year, month, 1);

                    var to_period = new Date(year, month+1, -1);

                    /**
                     * Loop days for current month
                     */
                    while (moment(from_period).format('MMMM') === element) {
                        /**
                         * Check if month day exist in template days
                         */
                        if(template_days.includes(moment(from_period).format('dddd'))){
                            /**
                             * If month day exist in template days get the template details
                             */
                            JSON.parse(selectedTemplate.working_days).forEach(el2=>{
                                if(el2.day === moment(from_period).format('dddd')){
                                    schedule.push({
                                        'day':moment(from_period).format('D'),
                                        'whrs_code':el2.whrs_code,
                                        'whrs_desc':el2.whrs_desc,
                                    });
                                }
                            })
                        }
                        from_period.setDate(from_period.getDate() + 1);
                    }
                    schedule_data.push({
                        month:moment(month_start).format('M'),
                        year:moment(month_start).format('YYYY'),
                        schedule:schedule
                    })    
                });
            }
            var count = 0;
            Swal.fire({
                icon:'info',
                title:'Adding Work Schedule',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading();
            selectedDept.forEach(el=>{
                dept_code.push(el.dept_code)
                var temp_dept_code = []
                temp_dept_code.push(el.dept_code)
                var data2 = {
                    schedule_data:schedule_data,
                    template_id:selectedTemplate.template_id,
                    dept_code:temp_dept_code
                }
                
                // setMultipleAddStatusLoading(true)
                addMultipleWorkSched(data2)
                .then(res=>{
                    Swal.close();
                    console.log(res.data)
                    setMultipleAddStatusModal(true)
                    setCurrAddedDept(el.dept_title)
                    // setMultipleAddStatusLoading(false)
                    count++;
                    setCurrAddedDeptNo(count)

                    
                }).catch(err=>{
                    Swal.close();
                    console.log(err)
                })
                setSuccessMultipleAdd(false)
            })


            // var data2 = {
            //     schedule_data:schedule_data,
            //     template_id:selectedTemplate.template_id,
            //     dept_code:dept_code
            // }
            // console.log(data2)
            // addMultipleWorkSched(data2)
            // .then(res=>{
            //     console.log(res.data)
            // }).catch(err=>{
            //     console.log(err)
            // })
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
    return (
        <form onSubmit={submitData} style ={{margin:'10px'}}>
        <Grid container spacing={2}>
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
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Button variant='outlined' type='submit'>Save</Button>
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
    )
}