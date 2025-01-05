import React, { useEffect } from 'react';
import { Container, Grid, TextField, Typography,Box,Button, TableContainer,Table, TableRow,TableHead,TableCell,TableFooter,TableBody, FormControl,InputLabel,Select,MenuItem, Paper,Tooltip,Autocomplete,IconButton } from '@mui/material';
import DatePicker from 'react-multi-date-picker';
// import TimePicker from "react-multi-date-picker/plugins/time_picker";
//icon
import InputIcon from 'react-multi-date-picker/components/input_icon';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import CachedIcon from '@mui/icons-material/Cached';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import Swal from 'sweetalert2';
import { AttachFile } from '@mui/icons-material';
import { blue, green, red, yellow } from '@mui/material/colors'
import { checkMaximumMissedLogs, getLogAdjustmentData } from './DTRRequest';
import { toast } from 'react-toastify';
const Input = styled('input')({
    display: 'none',
});

export default function AddDTRRectificationRequest(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [adjustmentLogsData,setAdjustmentLogsData] = React.useState([])
    useEffect(()=>{
        getLogAdjustmentData()
        .then(response=>{
            const data = response.data.response
            var new_data = [];
            data.forEach(el=>{
                new_data.push({
                    'label':el.atype_desc,
                    'atype_code':el.atype_code,
                    'atype_desc':el.atype_desc,
                    // 'type_code':el.type_code
                })
            })
            setAdjustmentLogsData(new_data)
        }).catch(error=>{
            console.log(error)
        })
    },[])
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.info.dark,
          color: theme.palette.common.white,
          fontSize: matches?11:15,
    
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: matches?10:12,
        },
      }));
      const [data,setData] = React.useState([{
        'date':'',
        'date_err':false,
        'nature':'',
        'reason':null,
        'rectified_time':'',
        'file':''
    }])
    const setDate = (index,value) => {
        let data2 = [...data];
        /**
        * Check if reach maximum missed logs Permanent/Casual 3 per month , COS/JO 3 per half month
        */
        /**
         * Check if selected date
         */
        if(data2[index].reason){
            if(value){
                if(data2[index].reason.atype_desc.toUpperCase().includes('MISSED')){
                    var data3 = {
                        date:value.format('YYYY-MM-DD'),
                        day:parseInt(value.format('DD')),
                        month:parseInt(value.format('MM')),
                        monthname:value.format('MMMM'),
                        year:parseInt(value.format('YYYY')),
                        from:new Date(parseInt(value.format('YYYY')),parseInt(value.format('MM'))-1,1),
                        to:new Date(parseInt(value.format('YYYY')),parseInt(value.format('MM')),0),

                    }
                    console.log(data3)
                    checkMaximumMissedLogs(data3)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 500){
                            toast.warning(res.data.message)
                            data2[index].date = "";
                            data2[index].date_err = true;
                            setData(data2)
                        }else{
                            data2[index].date = value.format('YYYY-MM-DD');
                            data2[index].date_err = false;
                            setData(data2)
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    data2[index].date = value.format('YYYY-MM-DD');
                    data2[index].date_err = false;
                    setData(data2)
                }
            }
        }else{
            data2[index].date = value.format('YYYY-MM-DD');
            data2[index].date_err = false;
            setData(data2)
        }
        
    }
    const setNature = (index,value) => {
        let data2 = [...data];
        data2[index].nature = value;
        setData(data2)
    }
    const setReason = (index,value) => {
        let data2 = [...data];

        /**
        * Check if reach maximum missed logs Permanent/Casual 3 per month , COS/JO 3 per half month
        */
        /**
         * Check if selected date
         */
        console.log(data2[index].date)
        console.log(value)
        if(data2[index].date){
            if(value){
                if(value.atype_desc.toUpperCase().includes('MISSED')){
                    var data3 = {
                        date:data2[index].date,
                        day:parseInt(moment(data2[index].date).format('DD')),
                        month:parseInt(moment(data2[index].date).format('MM')),
                        monthname:moment(data2[index].date).format('MMMM'),
                        year:parseInt(moment(data2[index].date).format('YYYY')),
                        from:new Date(parseInt(moment(data2[index].date).format('YYYY')),parseInt(moment(data2[index].date).format('MM'))-1,1),
                        to:new Date(parseInt(moment(data2[index].date).format('YYYY')),parseInt(moment(data2[index].date).format('MM')),0),

                    }
                    console.log(data3)
                    checkMaximumMissedLogs(data3)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 500){
                            toast.warning(res.data.message)
                            data2[index].reason = null;
                            data2[index].date_err = true;
                            setData(data2)
                        }else{
                            data2[index].reason = value;
                            data2[index].date_err = false;

                            setData(data2)
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    data2[index].reason = value;
                    data2[index].date_err = false;

                    setData(data2)
                }
            }
        }else{
            data2[index].reason = value;
            data2[index].date_err = false;
            setData(data2)
        }
        
    }
    const setSpecifyTime = (index,value) => {
        let data2 = [...data];
        data2[index].rectified_time = value;
        setData(data2)
    }
    const handleFile = (index,e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        let data2 = [...data];
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                data2[index].file = fileReader.result;
                setData(data2)
                // setsingleFile(fileReader.result)
            }
        }else{
            data2[index].file = '';
            setData(data2)
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const [natureData,setNatureData] = React.useState(['Time In','Break Out','Break In','Time Out'])
    const addData = () =>{
        var data2 = [...data];
        var new_data =  {
            'date':'',
            'nature':'',
            'reason':null,
            'rectified_time':'',
            'file':''
        }
        data2.push(new_data)
        
        setData(data2)
    }
    const deleteData = (index) => {
        var data2 = [...data]
        data2.splice(index,1)
        setData(data2)
    }
    const saveData = () =>{
        // toast.warning('Already reached maximum of 3 missed logs, for the month of December');
        var has_empty = false;
        // console.log(data)
        data.forEach(element => {
            if(element.date === '' || element.nature === '' || element.reason === '' || element.reason === null || element.rectified_time === '' || element.file === ''){
                has_empty=true
            }
        });
        var duplicate = Object.values(data.reduce((c, v) => {
            let k = v.date +'-'+v.nature;
            c[k] = c[k] || [];
            c[k].push(v);
            return c;
          }, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
        if(has_empty || data.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please filled out all neccessary data',
                
            })
        }else{
            if(duplicate.length !==0){
                var tr = ""
                duplicate.forEach(el=>
                    tr+="<tr><td>"+el.date+"</td>"+"<td>"+el.nature+"</td></tr>"
                )
                Swal.fire({
                    icon:'warning',
                    title:'Duplicate values detected',
                    html:"<table class='table table-bordered'><thead><tr><th>Date</th><th>Nature</th></tr></thead><tbody>"+tr+"</tbody></table><span>Please review again your application.</span>"
                })
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Confirm submit request ?',
                    showCancelButton:true,
                    confirmButtonText:'Yes',
                    cancelButtonText:'No'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // setData([{
                        //     'date':'',
                        //     'nature':'',
                        //     'reason':'',
                        //     'rectified_time':'',
                        //     'file':''
                        // }])
                        var data2 = []

                        data.forEach(element => {
                            data2.push({
                                'date':element.date,
                                'nature':element.nature,
                                'reason':element.reason.atype_desc,
                                'adj_type':element.reason.atype_code,
                                'rectified_time':element.rectified_time,
                                'file':element.file
                            })

                        })
                        // console.log(data2)
                        props.submitRectificationRequest(data2)
                        // props.handleClose()

                    }
    
                })
            }
            
            
        }
        
    }
    return(
        <Grid container spacing={1} sx={{p:1}}>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <IconButton sx = {{'&:hover': { bgcolor: green[800], color: '#fff' }}} onClick={addData} color='success' className='custom-iconbutton'> <AddIcon/></IconButton>
                    </Box>
                </Grid>
                <Box sx={{m:1,padding:'10px',width:'100%'}} component={Paper}>
                
                {/* <Grid item xs={12}>
                    <small><strong>Note:</strong> Selected date must completely   </small>
                </Grid> */}
                <Grid item xs={12}>
                    
                    <TableContainer sx={{maxHeight:matches?'40vh':'50vh'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell>Nature</StyledTableCell>
                                <StyledTableCell>Reason</StyledTableCell>
                                <StyledTableCell>Specify Rectified Time</StyledTableCell>
                                <StyledTableCell>Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                            data.length ===0
                            ?
                            <TableRow>
                               <StyledTableCell colSpan={5} sx={{textAlign:'center'}}> No Data</StyledTableCell>
                            </TableRow>
                            :
                            data.map((data2,index)=>
                            <TableRow key = {index}>
                                <StyledTableCell>
                                {
                                    data2.date_err
                                    ?
                                    <small style={{color:red[800]}}>Maximum missed log reached !</small>
                                    :
                                    null
                                }
                                <DatePicker
                                    value={data2.date}
                                    onChange = {(value)=>setDate(index,value)}
                                    // render={<InputIcon/> }
                                    // render={(value, openCalendar) => {
                                    //     return (
                                    //     <button onClick={openCalendar} className = "custom-inclusive-dates">
                                    //         <InputIcon/>
                                    //     </button>
                                    //     )
                                    // }}
                                    maxDate={new Date()}
                                    containerStyle={{
                                        width:'100%',
                                        minWidth:'100px',
                                        height:data2.date_err?'40px':'55px',
                                    }}
                                    mapDays={({ date }) => {
                                        let props2 = {}
                                        let isWeekend = [0, 6].includes(date.weekDay.index)
                                        // let isDisabled = props.appliedDates.includes(moment(new Date(date)).format('YYYY-MM-DD'))

                                        if (isWeekend) props2.className = "highlight highlight-red"
                                        // if (isDisabled) props2.disabled = true
                                        return props2
                                    }}
                                    placeholder='Date'
                                />
                                </StyledTableCell>

                                <StyledTableCell>
                                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 120}}>
                                        <InputLabel id="nature-select-filled-label">Nature</InputLabel>
                                        <Select
                                        labelId="nature-select-filled-label"
                                        id={"nature-select-filled-label"+index}
                                        value={data2.nature}
                                        label="Nature"
                                        onChange = {(value)=>setNature(index,value.target.value)}
                                        >
                                        {natureData.map((data3,key3)=>
                                            <MenuItem value={data3} key = {key3}>{data3}</MenuItem>
                                        )}
                                        </Select>
                                    </FormControl>
                                    {/* <TextField type='text' variant='filled' size = 'small' label = "" fullWidth InputLabelProps={{shrink:true}} value = {data2.nature} onChange = {(value)=>setNature(index,value.target.value)}/> */}
                                </StyledTableCell>

                                <StyledTableCell>
                                {/* <TextField type='text' variant='filled' size = 'small' label = ""  fullWidth InputLabelProps={{shrink:true}} value = {data2.reason} onChange = {(value)=>setReason(index,value.target.value)} placeholder='Reason...'/> */}
                                {/* <FormControl variant="filled" sx={{ m: 1, width:250,height:'56px'}}>
                                        <InputLabel id="nature-select-filled-label">Select ...</InputLabel>
                                        <Select
                                        labelId="nature-select-filled-label"
                                        id="nature-select-filled-label"
                                        value={data2.reason}
                                        label="Select ..."
                                        onChange = {(value)=>setReason(index,value.target.value)}
                                        >
                                        {adjustmentLogsData.map((data,key)=>
                                            <MenuItem value={data} key = {key}>{data.atype_desc}</MenuItem>
                                        )}
                                        </Select>
                                    </FormControl> */}
                                <Autocomplete
                                    disablePortal
                                    id={"combo-box-adjustment"+index}
                                    options={adjustmentLogsData}
                                    getOptionLabel={(option) => option.atype_desc}
                                    sx={{ width: 250}}
                                    value = {data2.reason}
                                    onChange={(event, newValue) => {
                                        setReason(index,newValue);
                                      }}
                                    renderInput={(params) => <TextField {...params} label="Adjustment Type" />}
                                />
                                {/* <Autocomplete
                                    freeSolo
                                    id="free-solo-2-demo"
                                    disableClearable
                                    options={adjustmentLogsData.map((option) => option.atype_desc)}
                                    sx={{ width: 250 }}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search adjustment type"
                                        InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        }}
                                        fullWidth
                                    />
                                    )}
                                /> */}
                                </StyledTableCell>

                                <StyledTableCell>
                                <TextField type='time' variant='outlined' size = 'large' label = "Time" fullWidth InputLabelProps={{shrink:true}} value = {data2.rectified_time} onChange = {(value)=>setSpecifyTime(index,value.target.value)} />
                                </StyledTableCell>

                                <StyledTableCell>
                                <Button variant='outlined' color='error' size='small' startIcon={<DeleteForeverIcon/>} onClick={()=> deleteData(index)} fullWidth sx={{ marginBottom:'5px','&:hover': { bgcolor: red[800], color: '#fff' }, flex: 1 ,display:data.length === 1 ? 'none':'auto'}}>Delete</Button>
                                <label htmlFor={"contained-button-file"+index} style={{width:'100%'}}>
                                    <Input accept="image/*,.pdf" id={"contained-button-file"+index} type="file" onChange = {(value)=>handleFile(index,value)}/>
                                    
                                    <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[800], color: '#fff' }, flex: 1}}> {data2.file.length ===0?<Tooltip title='No file uploaded'><WarningIcon size='small' color='error' fontSize='small'/></Tooltip>:''} <AttachFile fontSize='small'/>Upload </Button>

                                </label>
                                </StyledTableCell>
                            
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Grid>
                </Box>
                
                <Grid item xs={12} sx={{marginTop:'10px'}}>
                    <Box sx={{}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Button color='success' variant='contained' onClick={saveData} size='small' className='custom-roundbutton'>Save</Button>
                            &nbsp;
                            <Button color='error' variant='contained' onClick={props.handleClose} size='small' className='custom-roundbutton'> Cancel</Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
    )
}