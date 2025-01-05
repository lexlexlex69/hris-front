import { Autocomplete, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,Box,InputLabel,MenuItem ,FormControl,Select, Checkbox,CircularProgress,Backdrop, Tooltip} from '@mui/material';
import React,{useEffect, useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { cancelHoliday, searchCancelApplication } from '../LeaveApplicationRequest';
import moment from 'moment';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { styled } from '@mui/material/styles';
import {blue} from '@mui/material/colors';
import Swal from 'sweetalert2';
import { api_url } from '../../../../../request/APIRequestURL';
const Input = styled('input')({
    display: 'none',
});
export default function CancelLeaveHoliday(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedDate,setSelectedDate] = useState('')
    const [data,setData] = useState([])
    const [data1,setData1] = useState([])
    const [officeData,setOfficeData] = useState([])
    const [filterOffice,setFilterOffice] = useState(null)
    const [period,setPeriod] = useState('NONE')
    const [selectedIDs,setSelectedIDs] = useState([])
    const [selectAll,setSelectAll] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(false)
    const handleSearch = (e)=>{
        e.preventDefault();
        setIsLoadingData(true)
        var t_data = {
            date:moment(selectedDate).format('MM-DD-YYYY')
        }
        searchCancelApplication(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.data.length === 0){
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:'No data found'
                })
            }else{
                setData(res.data.data)
                setData1(res.data.data)
                setOfficeData(res.data.offices)
            }
            setIsLoadingData(false)

            

        }).catch(err=>{
            console.log(err)
            setIsLoadingData(false)

        })
        console.log(t_data)
    }
    const handleFilterOffice = (row)=>{
        console.log(row)
        if(row){
            var t_arr = data1.filter((el)=>{
                return el.dept_code === row.dept_code
            })
            setData(t_arr)
        }else{
            setData(data1)
        }
        setFilterOffice(row);

        

    }
    const handleSelectID = (id)=>{
        console.log(id)
        var index = selectedIDs.indexOf(id);

        if( index > -1){
            var t_ids  = [...selectedIDs];
            t_ids.splice(index,1);
            setSelectedIDs(t_ids)
        }else{
            var t_ids = [...selectedIDs];
            t_ids.push(id);
            setSelectedIDs(t_ids)
            
        }
    }
    useEffect(()=>{
        if(selectAll){
            var t_ids = [];
            data.forEach(el=>{
                t_ids.push(el.leave_application_id)
            })
            setSelectedIDs(t_ids)
        }else{
            setSelectedIDs([])
        }
    },[selectAll])
    const handleProceed = ()=>{
        if(selectedIDs.length>0){
            Swal.fire({
                icon:'question',
                title:'Confirmation',
                html:'Proceed to cancellation ?',
                confirmButtonText:'Yes',
                showCancelButton:true
            }).then(res=>{
                if(res.isConfirmed){
                    Swal.fire({
                        icon:'info',
                        title:'Cancelling leave application',
                        html:'Please wait...',
                        allowEscapeKey:false,
                        allowOutsideClick:false,
                        showCancelButton:false,
                        showConfirmButton:false
                    })
                    Swal.showLoading()
                    var t_data = {
                        period:period,
                        ids:selectedIDs,
                        date:selectedDate,
                        api_url:api_url+'/cancelLeaveHoliday',
                        file:memoFile
                    }
                    cancelHoliday(t_data)
                    .then(res=>{
                        if(res.data.status===200){
                            Swal.fire({
                                icon:'success',
                                title:res.data.message,
                                timer:1500,
                                showConfirmButton:false
                            })
                            setData(res.data.data)
                            setData1(res.data.data)
                            setOfficeData(res.data.offices)
                        }else{
                             Swal.fire({
                                icon:'success',
                                title:res.data.message
                            })
                        }
                        console.log(res.data)
                    }).catch(err=>{
                        console.log(err)
                    })
                    console.log(t_data)
                }
            })
        }else{
            Swal.fire({
                icon:'warning',
                title:'Please select first from the list to proceed'
            })
        }
        
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
    return(
        <Grid container sx={{p:2}}>
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',flexDirection:'row'}}
            open={isLoadingData}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" /> &nbsp;
                <Typography>Searching leave application...</Typography>
            </Backdrop>
            <form onSubmit = {handleSearch} style={{width:'100%'}}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <TextField type='date' label='Date of holiday' InputLabelProps={{shrink:true}} value = {selectedDate} onChange = {(val)=>setSelectedDate(val.target.value)} required/>
                &nbsp;
                <Button variant='outlined' type='submit'><SearchIcon/></Button>
            </Grid>
            </form>
            <Grid item xs={12} sx={{mt:1}}>
                <hr/>
                <Box sx={{display:'flex',justifyContent:'space-between',pointerEvents:data.length>0?'auto':'none'}}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-dept"
                        options={officeData}
                        // sx={{minWidth:300}}
                        fullWidth
                        value = {filterOffice}
                        getOptionLabel={(option) => option.dept_title}
                        onChange={(event,newValue) => {
                            handleFilterOffice(newValue)
                            }}
                        renderInput={(params) => <TextField {...params} label=" Filter Office/Department"/>}
                        />
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <FormControl sx={{minWidth:100}}>
                            <InputLabel id="demo-simple-select-label">Period *</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={period}
                                label="Period *"
                                onChange={(val)=>setPeriod(val.target.value)}

                                >
                                <MenuItem value={'NONE'}>NONE</MenuItem>
                                <MenuItem value={'AM'}>AM</MenuItem>
                                <MenuItem value={'PM'}>PM</MenuItem>
                            </Select>
                        </FormControl>
                        <label htmlFor={"contained-button-file"} style={{width:'100%',height:'100%'}}>
                        <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)}/>
                        <Tooltip title='Upload Memo. File'><Button variant='outlined' color='primary' size='small' component="span" fullWidth sx={{ '&:hover': { bgcolor: blue[800], color: '#fff' }, flex: 1,height:'100%'}}> <AttachFileIcon/></Button></Tooltip>
                        </label>

                        <Button variant='outlined' color = 'success' sx={{height:'100%'}} onClick={handleProceed}>
                            <SendIcon/>
                        </Button>
                    </Box>
                
                </Box>
                <Paper sx={{mt:1}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Office/Dept.
                                    </TableCell>
                                    <TableCell>
                                        Leave Name
                                    </TableCell>
                                    <TableCell align='center'>
                                        Select <br/>
                                        <Checkbox checked={selectAll} onChange = {()=>setSelectAll(!selectAll)}/>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.length>0
                                    ?
                                    data.map((row,key)=>
                                        <TableRow key={key} hover>
                                            <TableCell>
                                                {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                            </TableCell>
                                            <TableCell>
                                                {row.short_name}
                                            </TableCell>
                                            <TableCell>
                                                {row.leave_type_name}
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Checkbox checked = {selectedIDs.includes(row.leave_application_id)} onChange={()=>handleSelectID(row.leave_application_id)}/>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    :
                                    <TableRow>
                                            <TableCell align='center' colSpan={4}>
                                                No result found...
                                            </TableCell>
                                    </TableRow>
                                    
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}