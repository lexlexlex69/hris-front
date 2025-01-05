import React,{memo, useCallback, useEffect, useState} from 'react';
import { Grid,Table,Paper,Typography,TextField,Checkbox,Box, Tooltip, IconButton,RadioGroup,Radio,Button } from '@mui/material'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { addOvertimeDetails, getAllEmployee } from '../OvertimeMemoRequest';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {blue,red} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

//icons
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';

import InputAdornment from '@mui/material/InputAdornment';

import moment from 'moment';
import Swal from 'sweetalert2';
import DateType from '../Components/DateType';
import Row from '../Components/Row';
const Input = styled('input')({
    display: 'none',
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: 13,
      padding:10
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding:10
    },
  }));
const AddDialog = memo(({...props}) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [isLoadingData,setIsLoadingData] = useState(true);
    const [data,setData] = useState([]);
    const [regularData,setRegularData] = useState([]);
    const [casualData,setCasualData] = useState([]);
    const [JOCOSData,setJOCOSData] = useState([]);
    const [searchVal,setSearchVal] = useState('');
    const [weekdaysFrom,setWeekdaysFrom] = useState('');
    const [weekdaysTo,setWeekdaysTo] = useState('');
    const [weekendsFrom,setWeekendsFrom] = useState('');
    const [weekendsTo,setWeekendsTo] = useState('');
    const [holidaysFrom,setHolidaysFrom] = useState('');
    const [holidaysTo,setHolidaysTo] = useState('');
    const [wholeMonthData,setWholeMonthData] = useState([]);
    const [specificDateData,setSpecificDateData] = useState([]);
    useEffect(()=>{
        Swal.fire({
            icon:'info',
            title:'Loading Employee List',
            html:'Please wait...',
            showConfirmButton:false,
            allowEscapeKey:false,
            allowOutsideClick:false

        })
        getAllEmployee()
        .then(res=>{
            console.log(res.data)
            setData(res.data)
            var t_regular = res.data.filter((el)=>{
                return el.emp_status === 'RE'
            });
            var t_casual = res.data.filter((el)=>{
                return el.emp_status === 'CS'
            });
            var t_jo_cos = res.data.filter((el)=>{
                return el.emp_status !== 'RE' && el.emp_status !== 'CS'
            });
            setRegularData(t_regular);
            setCasualData(t_casual);
            setJOCOSData(t_jo_cos);
            // Swal.fire({
            //     icon:'success',
            //     title:'Successfully loaded !',
            //     timer:1500,
            //     showConfirmButton:false
            // })
            setIsLoadingData(false)
            Swal.close();
        }).catch(err=>{
            console.log(err)
            Swal.close();
        })
    },[])
    const handleWeekdays = useCallback((emp_no,value)=>{
        var temp = [...data];
        setData(prevItems=> prevItems.map(item=>{
            if(item.emp_no === emp_no){
                item.weekdays = value.target.value
            }
            return item;
        }))
        // temp[index].weekdays = value.target.value
        // setData(temp)
    },[])
    const handleWeekends = useCallback((emp_no,value)=>{
        var temp = [...data];
        setData(prevItems=> prevItems.map(item=>{
            if(item.emp_no === emp_no){
                item.weekends = value.target.value
            }
            return item;
        }))
        // temp[index].weekends = value.target.value
        // setData(temp)
    },[])
    // const handleSelected = useCallback((emp_no)=>{
    //     // var temp = [...data];
    //     setData(prevItems => prevItems.map(item=>{
    //         if(item.emp_no === emp_no){
    //             item.is_selected = !item.is_selected
    //         }
    //         return item;
    //     }))

    //     // data[index].is_selected = !data[index].is_selected
    //     // setData(temp)
    // },[])
    const handleSelected = (emp_no)=>{
        // var temp = [...data];
        setData(prevItems => prevItems.map(item=>{
            if(item.emp_no === emp_no){
                item.is_selected = !item.is_selected
            }
            return item;
        }))

        // data[index].is_selected = !data[index].is_selected
        // setData(temp)
    }
    
    
    const [selectedDateType,setSelectedDateType] = useState('')
    const handleSave = ()=>{
        console.log(data)
        console.log(specificDateData)

        var t_days = [];
        var t_months = [];
        var t_months_name = [];
        var year = [];
        var t_year = [];
        var period_date_text = '';

        if(selectedDateType == 0){
            wholeMonthData.forEach((el,key)=>{
                t_months.push(el.month.name)
                t_year.push(el.year);
                getDaysArray(el.year,el.month.number).forEach(el2=>{
                    t_days.push(el2)
                })
                var month_days_arr = getDaysArray(el.year,el.month.number);
                if(key !== wholeMonthData.length-1){
                    period_date_text+=el.month.shortName+' '+moment(month_days_arr[0]).format('DD')+'-'+moment(month_days_arr[month_days_arr.length-1]).format('DD')+ ',' +el.year+' ,'
                }else{
                    period_date_text+=el.month.shortName+' '+moment(month_days_arr[0]).format('DD')+'-'+moment(month_days_arr[month_days_arr.length-1]).format('DD')+ ',' +el.year
                }
            })
            year = [...new Set(t_year)]

        }else{
            specificDateData.forEach((el,key)=>{
                t_days.push(el.format('YYYY-MM-DD'))
                t_months_name.push(el.format('MMMM'))
                t_year.push(el.format('YYYY'))

                if(specificDateData.length ===0){
                    period_date_text+=el.format('MMM. D, YYYY')
                }else if(key === 0){
                    if(key === specificDateData.length-1){
                        period_date_text+=el.format('MMM. D, YYYY')
                    }else{
                        period_date_text+=el.format('MMM. D,')
                    }
                }else{
                    if(key === specificDateData.length-1){
                        if(el.format('MMMM') === specificDateData[key-1].format('MMMM')){
                            period_date_text+= el.format('D, YYYY')
                        }else{
                            period_date_text+=el.format('MMM. D, YYYY')
                        }
                    }else{
                        if(el.format('MMMM') === specificDateData[key-1].format('MMMM')){
                            period_date_text+= el.format('D,')
                        }else{
                            period_date_text+=el.format('YYYY, MMM. D,')
                        }
                    }
                }
                
            })
            t_months = [...new Set(t_months_name)]
            year = [...new Set(t_year)]
        }
        /**
         * Get selected employee
         */
        var t_emp = data.filter((el)=>{
            return el.is_selected;
        })
        if(t_days.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please select date period'
            })
        }else{
            if((weekdaysFrom.length ===0 || weekdaysTo.length ===0) && (weekendsFrom.length === 0 || weekendsTo.length === 0 )){
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Please select time schedule'
                })
            }else{
                if(t_emp.length ===0){
                    Swal.fire({
                        icon:'warning',
                        title:'Oops...',
                        html:'Please select employee'
                    })
                }else{
                    var t_data = {
                        date_period:t_days,
                        weekdays_from:weekdaysFrom,
                        weekdays_to:weekdaysTo,
                        weekends_from:weekendsFrom,
                        weekends_to:weekendsTo,
                        holidays_from:holidaysFrom,
                        holidays_to:holidaysTo,
                        emp_list:t_emp,
                        months_name:t_months,
                        year:year,
                        period_type:selectedDateType==0?'month':'specific',
                        period_date_text:period_date_text,
                        memo_file:memoFile,
                        weekdays_wpay_cfactor:weekdaysWpayCFactor,
                        weekdays_coc_cfactor:weekdaysCOCCFactor,
                        weekends_wpay_cfactor:weekendsWpayCFactor,
                        weekends_coc_cfactor:weekendsCOCCFactor
                    }
                    console.log(t_data)
                    Swal.fire({
                        icon:'info',
                        title:'Saving data',
                        html:'Please wait...',
                        showConfirmButton:false,
                        allowEscapeKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading();
                    addOvertimeDetails(t_data)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 200){
                            props.setData(res.data.data)
                            props.close()
                            Swal.fire({
                                icon:'success',
                                title:res.data.message,
                                timer:1500,
                                showCloseButton:false
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:res.data.message
                            })
                        }
                    }).catch(err=>{
                        console.log(err)
                        Swal.close();
                    })
                }
            }
            
        }
        
    }
    const getDaysArray = (year, month) => {
        var monthIndex = month - 1; // 0..11 instead of 1..12
        // var names = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
        var date = new Date(year, monthIndex, 1);
        var result = [];
        while (date.getMonth() == monthIndex) {
            result.push(moment(date).format('YYYY-MM-DD'));
            date.setDate(date.getDate() + 1);
        }
        return result;
    }
    const [memoFile,setMemoFile] = useState('');
    const handleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                file = fileReader.result;
                setMemoFile(file)
                // setsingleFile(fileReader.result)
            }
        }else{
            file = '';
            setMemoFile(file)

            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const handleSelectDateType = useCallback((val)=>{
        setSelectedDateType(val.target.value)
    },[])
    const handleSearchVal = (val)=>{
        setSearchVal(val.target.value)
    }
    const [weekdaysWpayCFactor,setWeekdaysWpayCFactor] = useState(1.25);
    const [weekendsWpayCFactor,setWeekendsWpayCFactor] = useState(1.5);
    const [weekdaysCOCCFactor,setWeekdaysCOCCFactor] = useState(1);
    const [weekendsCOCCFactor,setWeekendsCOCCFactor] = useState(1.5);
    const filter = data.filter(el=>el.emp_fname.toUpperCase().includes(searchVal.toUpperCase()) || el.emp_lname.toUpperCase().includes(searchVal.toUpperCase()))
    return(
        <>
        {
            isLoadingData
            ?
            null
            :
            <Grid container sx={{p:2}} spacing={1}>
                <Grid item xs={12} sx={{mb:1}}>
                    <Typography sx={{background: blue[800],color: '#fff',padding: '5px 10px',width: 'fit-content',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>Date Period *</Typography>
                </Grid>
                <Grid item xs={12} sx={{mb:1,display:'flex',flexDirection:'row',alignItems:'center'}}>
                    {/* <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={selectedDateType}
                        onChange={handleSelectDateType}
                        name="radio-buttons-group"
                        row
                    >
                        <FormControlLabel value={0} control={<Radio />} label="Whole Month" />
                        <FormControlLabel value={1} control={<Radio />} label="Specific dates" />
                    </RadioGroup> */}
                    <DateType value = {selectedDateType} handleSelectDateType = {handleSelectDateType}/>
                </Grid>
                {
                    selectedDateType !== ''
                    ?
                        selectedDateType == 0
                        ?
                        <Grid item xs={12} sx={{mb:1}}>
                        <DatePicker
                            value={wholeMonthData}
                            onChange = {setWholeMonthData}
                            onlyMonthPicker
                            multiple
                            sort
                            plugins={[
                                <DatePanel />
                            ]}
                        />
                        </Grid>
                        :
                        <Grid item xs={12} sx={{mb:1}}>
                        <DatePicker
                            value={specificDateData}
                            onChange = {setSpecificDateData}
                            multiple
                            sort
                            plugins={[
                            <DatePanel />
                        ]}
                        />
                        </Grid>
                    :
                    null
                    
                }
                <Grid item xs={12} sx={{mb:1}}>
                <hr/>

                    <Typography sx={{background: blue[800],color: '#fff',padding: '5px 10px',width: 'fit-content',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>Time Schedule *</Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Typography sx={{mb:1,color:red[800]}}>Weekdays</Typography>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={6}>
                            <TextField label='From' fullWidth type='time' InputLabelProps={{shrink:true}} value = {weekdaysFrom} onChange = {(val)=>setWeekdaysFrom(val.target.value)}/>
                        </Grid>
                        &nbsp;
                        <Grid item xs={6}>
                            <TextField label='To' fullWidth type='time' InputLabelProps={{shrink:true}} value = {weekdaysTo} onChange = {(val)=>setWeekdaysTo(val.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Typography sx={{mb:1,color:red[800]}}>Weekends</Typography>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={6}>
                            <TextField label='From' fullWidth type='time' InputLabelProps={{shrink:true}} value = {weekendsFrom} onChange = {(val)=>setWeekendsFrom(val.target.value)}/>
                        </Grid>
                        &nbsp;
                        <Grid item xs={6}>
                            <TextField label='To' fullWidth type='time' InputLabelProps={{shrink:true}} value = {weekendsTo} onChange = {(val)=>setWeekendsTo(val.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Typography sx={{mb:1,color:red[800]}}>Holidays</Typography>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={6}>
                            <TextField label='From' fullWidth type='time' InputLabelProps={{shrink:true}} value = {holidaysFrom} onChange = {(val)=>setHolidaysFrom(val.target.value)}/>
                        </Grid>
                        &nbsp;
                        <Grid item xs={6}>
                            <TextField label='To' fullWidth type='time' InputLabelProps={{shrink:true}} value = {holidaysTo} onChange = {(val)=>setHolidaysTo(val.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{mb:1}}>
                <hr/>
                    <Typography sx={{background: blue[800],color: '#fff',padding: '5px 10px',width: 'fit-content',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>Constant Factor <em>(Regular/Casual)</em> *</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{pr:matches?0:1}}>
                    <Typography sx={{mb:1,color:red[800]}}>Weekdays</Typography>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={6}>
                            <TextField label='With Pay' fullWidth type='number' InputLabelProps={{shrink:true}} value = {weekdaysWpayCFactor} onChange = {(val)=>setWeekdaysWpayCFactor(val.target.value)}/>
                        </Grid>
                        &nbsp;
                        <Grid item xs={6}>
                            <TextField label='COC' fullWidth type='number' InputLabelProps={{shrink:true}} value = {weekdaysCOCCFactor} onChange = {(val)=>setWeekdaysCOCCFactor(val.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{pl:matches?0:1}}>
                    <Typography sx={{mb:1,color:red[800]}}>Weekends</Typography>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={6}>
                            <TextField label='With Pay' fullWidth type='number' InputLabelProps={{shrink:true}} value = {weekendsWpayCFactor} onChange = {(val)=>setWeekendsWpayCFactor(val.target.value)}/>
                        </Grid>
                        &nbsp;
                        <Grid item xs={6}>
                            <TextField label='COC' fullWidth type='number' InputLabelProps={{shrink:true}} value = {weekendsCOCCFactor} onChange = {(val)=>setWeekendsCOCCFactor(val.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{mt:2}}>
                <hr/>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:1}}>
                    <Typography sx={{background: blue[800],color: '#fff',padding: '5px 10px',width: 'fit-content',borderTopRightRadius: '20px',borderBottomRightRadius: '20px',mb:1}}>Employee List *</Typography>
                    <TextField label='Search' value = {searchVal} onChange = {handleSearchVal} InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton onClick={()=>setSearchVal('')}><ClearIcon /></IconButton>
                        </InputAdornment>
                    ),
                    }}/>
                    </Box>
                    {/* <TextField label='Search' value = {searchVal} onChange = {handleSearchVal}/> */}
                    <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table>
                            <TableHead sx={{position:'sticky',top:0,zIndex:2}}>
                                <TableRow>
                                    <StyledTableCell rowSpan={2}>
                                        Name
                                    </StyledTableCell>
                                    <StyledTableCell colSpan={2} align='center'>
                                        Maximum OT Hours
                                    </StyledTableCell>
                                    <StyledTableCell rowSpan={2} align='center'>
                                        Selected
                                    </StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell align='center'>
                                        Weekdays
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        Weekends
                                    </StyledTableCell>
                                    
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    filter.length > 0
                                    ?
                                    filter.map((row,key)=>
                                    <Row
                                        key={key}
                                        row={row}
                                        handleWeekdays = {handleWeekdays}
                                        handleWeekends = {handleWeekends}
                                        handleSelected = {handleSelected}
                                    />
                                    // <TableRow key={key}>
                                    //     <StyledTableCell>
                                    //         {row.emp_fname} {row.emp_mname? row.emp_mname.charAt(0)+'.':' '} {row.emp_lname}
                                    //     </StyledTableCell>
                                    //     <StyledTableCell align='center'>
                                    //         <TextField label='Hours' InputLabelProps={{shrink:true}} type='number' value = {row.weekdays} onChange = {(value)=>handleWeekdays(key,value)} disabled = {row.is_selected?false:true}/>
                                    //     </StyledTableCell>
                                    //     <StyledTableCell align='center'>
                                    //         <TextField label='Hours' InputLabelProps={{shrink:true}} type='number' value = {row.weekends} onChange = {(value)=>handleWeekends(key,value)} disabled = {row.is_selected?false:true}/>
                                    //     </StyledTableCell>
                                    //     <StyledTableCell align='center'>
                                    //         <Checkbox checked={row.is_selected} onChange ={()=>handleSelected(key)}/>
                                    //     </StyledTableCell>
                                    // </TableRow>
                                    )
                                    :
                                    <TableRow>
                                            <StyledTableCell colSpan={4} align='center'>
                                                No Data
                                            </StyledTableCell>
                                            
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                    <label htmlFor={"contained-button-file"} style={{width:'100%'}}>
                    <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)}/>
                    
                    <Tooltip title='Upload Memo. File'><Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[800], color: '#fff' }, flex: 1}}> <AttachFileIcon />Upload Memo. File</Button></Tooltip>

                </label>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:2}}>
                    <Button color='success' className='custom-roundbutton' variant='contained' onClick={handleSave}disabled={memoFile.length===0?true:false}>Save</Button>
                    &nbsp;
                    <Button color='error' className='custom-roundbutton' variant='contained' onClick={props.close}>Cancel</Button>
                </Grid>
            </Grid>
        }
        </>
        
    )
})

export default AddDialog