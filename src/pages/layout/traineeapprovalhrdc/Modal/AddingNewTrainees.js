import React,{useCallback, useEffect, useState} from 'react';
import { Grid,TextField,Typography,TableContainer,Table,TableHead,TableRow,TableBody,TableFooter,Paper,Button,Checkbox,Backdrop,CircularProgress, IconButton,Fade  } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green,orange} from '@mui/material/colors';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';
import { addNewTrainees, getDeptReserved } from '../TraineeApprovalHRDCRequest';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import HelpIcon from '@mui/icons-material/Help';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { formatMiddlename } from '../../customstring/CustomString';

export default function AddingNewTrainees(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?12:15,
        // paddingTop:5,
        // paddingBottom:5,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?11:13,
        // paddingTop:5,
        // paddingBottom:5,
        },
    }));
    const [deptNameData,setDeptNameData] = useState([])
    const [data,setData] = useState([])
    const [selectedReserve,setSelectedReserve] = useState([])
    useEffect(()=>{
        var temp_dept = [];
        JSON.parse(props.deptInfo[0].shortlist_details).forEach(el=>{
            if(el.slot>0){
                temp_dept.push(el)
            }
        })
        setDeptNameData(temp_dept)
        console.log(props.currUpdateTraineeData)
        console.log(props.currList)
    },[])
    const [selectedFilter,setSelectedFilter] = useState('');
    const [selectedCurrConfirm,setSelectedCurrConfirm] = useState(0);
    const [available,setAvailable] = useState(0);
    const [isLoadingData,setIsLoadingData] = useState(false);
    const handleSearchDeptReserved = async (value)=>{
        setIsLoadingData(true)
        setSelectedFilter(value)
        setSelectedReserve([])
        var count = 0;
        props.currUpdateTraineeData.forEach(el=>{
            if(el.short_name === value.dept_name && el.selected){
                count++;
            }
        })
        setSelectedCurrConfirm(count)
        setAvailable(value.slot-count)
        var data2 = {
            dept_code:value.dept_code,
            training_details_id:props.selectedTraining.training_details_id
        }
        await getDeptReserved(data2)
        .then(res=>{
            console.log(res.data)
            var temp = [...res.data];
            temp.forEach(el=>{
                el.selected = false;
            })
            setData(temp)
            setIsLoadingData(false)
            if(res.data.length ===0){
                toast.error('No data found')
            }
        }).catch(err=>{
            setIsLoadingData(false)
            console.log(err)
        })
    }
    const handleSelectReserve = (index)=>{
        var temp = [...data]
        temp[index].selected = !temp[index].selected
        setData(temp)
    }
    const handleSave = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Saving data',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false 
            })
            Swal.showLoading();
            // Swal.close();
            var t_preselect = [];
            props.currUpdateTraineeData.forEach(el=>{
                if(el.short_name === selectedFilter.dept_name){
                    t_preselect.push(el.training_shortlist_id)
                }
            })
            var data2 = {
                data:data,
                // preselect:t_preselect,
                // reserve:selectedReserve,
                // dept_code:selectedFilter.dept_code,
                training_details_id:props.selectedTraining.training_details_id
            }
            console.log(data2)
            addNewTrainees(data2)
            .then(res=>{
                if(res.data.status=== 200){
                    var t_data = [...res.data.data]
                    t_data.forEach(el=>{
                        if(el.hrdc_approved){

                            var t_check = props.currUpdateTraineeData.filter((el2)=>{
                                return el2.emp_id === el.emp_id && el2.selected
                            })
                            if(t_check.length>0){
                                el.selected = true
                            }else{
                                var t_check2 = data.filter((el2)=>{
                                    return el2.emp_id === el.emp_id
                                })
                                if(t_check2.length>0){
                                    el.selected = true
                                }else{
                                    el.selected = false
                                }
                            }
                        }else{
                            el.selected = false
                        }
                    })
                    props.setData(t_data)
                    props.setData2(t_data)
                    // var temp = [];
                    // res.data.data.forEach(element => {
                    //     if(element.hrdc_approved){
                    //         temp.push(element.training_shortlist_id)
                    //     }
                    // });
                    // props.setPreselect(temp)
                    // props.setOldselect(temp)
                    props.close();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false 
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close();
                console.log(err)
            })
        }
        })
        
    }
    const [totalSelected,setTotalSelected] = useState(0)
    useEffect(()=>{
        var count=0;
        data.forEach(el=>{
            if(el.selected){
                count++;
            }
        })
        setTotalSelected(count)
    },[data])
    const handleSetRate = (value,index)=>{
        var temp = [...data];
        temp[index].rate = value.target.value
        setData(temp)
    }
    return(
        <form onSubmit={handleSave}>
        <Grid container spacing={1} sx={{mt:2,mb:1}}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoadingData}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedFilter}
                    label="Department"
                    onChange={(value)=>handleSearchDeptReserved(value.target.value)}
                    >
                    {
                        deptNameData.map((row,key)=>
                            <MenuItem value={row} key = {key}>{row.dept_name}</MenuItem>
                        )
                    }
                    </Select>
                </FormControl>
            </Grid>
            {
                data.length !==0
                ?
                <Grid item xs={12} sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',mt:2,alignItems:'center'}}>
                    <em>
                    <small style={{background:blue[900],padding:'5px 10px 5px 10px',borderRadius:'20px',color:'#fff'}}>Slot : {selectedFilter.slot}</small> &nbsp;
                    <small style={{background:green[900],padding:'5px 10px 5px 10px',borderRadius:'20px',color:'#fff'}}>Confirmed : {selectedCurrConfirm}</small> &nbsp;
                    <small style={{background:orange[900],padding:'5px 10px 5px 10px',borderRadius:'20px',color:'#fff'}}>Available : {available}</small>
                    </em>
                    <em><small>*Showing only reserved trainee/s</small></em>
                </Grid>
                :
                null
            }
           
            <Grid item xs={12}>
                <Paper>
                <TableContainer sx={{maxHeight:matches?'35vh':'50vh'}}>
                    <Table stickyHeader>
                    <TableHead>
                        <StyledTableCell>Rank</StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        {/* <StyledTableCell>Position</StyledTableCell> */}
                        {/* <StyledTableCell>Employment Status</StyledTableCell> */}
                        <StyledTableCell>Rate</StyledTableCell>
                        <StyledTableCell>Select</StyledTableCell>
                    </TableHead>
                    <TableBody>
                        {
                            data.length === 0
                            ?
                            <TableRow>
                                    <StyledTableCell colSpan={4} align='center'>No Data</StyledTableCell>
                            </TableRow>
                            :
                            data.map((row,key)=>
                                <TableRow hover key={key}>
                                    <StyledTableCell>{row.reserved_order}</StyledTableCell>
                                    <StyledTableCell>{row.fname} {formatMiddlename(row.mname)} {row.lname}</StyledTableCell>
                                    {/* <StyledTableCell>{row.position_name}</StyledTableCell> */}
                                    {/* <StyledTableCell>{row.description}</StyledTableCell> */}
                                    <StyledTableCell>
                                    {/* <TextField label = {row.lname+"'s Rate"} InputLabelProps={{shrink:true}} id={'rate-'+row.training_shortlist_id} disabled={row.selected?false:totalSelected>=available?true:false} required = {row.selected?true:false} value={row.rate} onChange = {(value)=>handleSetRate(value,key)}/> */}
                                    <TextField label = {row.lname+"'s Rate"} InputLabelProps={{shrink:true}} id={'rate-'+row.training_shortlist_id} required value={row.rate} onChange = {(value)=>handleSetRate(value,key)}/>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    <Checkbox checked={row.selected?true:false} onChange = {()=>handleSelectReserve(key)} disabled={row.selected?false:totalSelected>=available?true:false}/></StyledTableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                {/* <Button variant='contained' color='success'className='custom-roundbutton' type='submit' disabled={totalSelected===0?true:false}>Save</Button> */}
                <Button variant='contained' color='success'className='custom-roundbutton' type='submit'>Save</Button>
                
            </Grid>
        </Grid>
        </form>
    )
}