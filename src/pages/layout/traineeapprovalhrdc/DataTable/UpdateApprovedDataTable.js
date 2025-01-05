import React, { useEffect, useState,memo } from 'react';
import { Grid,Box,Checkbox ,Typography,TableContainer,Table,TableHead,TableBody,TableRow,Button,TablePagination,TextField,IconButton,Tooltip,Chip,Paper,Stack,Skeleton,Modal   } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { searchValueFunction } from '../../searchtable/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors';

//icons
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllShortlistTraineeHRDC, hrdcApproval, updateApprovedTraineeHRDC } from '../TraineeApprovalHRDCRequest';
import Swal from 'sweetalert2';
import AddingNewTrainees from '../Modal/AddingNewTrainees';
import EmployeeList from '../Modal/EmployeeList';
import UpdateSlotModal from '../Modal/UpdateSlotModal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
function UpdateApprovedDataTable(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':'50vw',
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };

    const [preselect,setPreselect] = useState([]);
    const [oldselect,setOldselect] = useState([]);
    const [slot,setSlot] = useState(0)
    const [reachMaxSlot,setReachMaxSlot] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data,setData] = useState([]);
    const [data2,setData2] = useState([]);
    const [deptInfo,setDeptInfo] = useState([]);
    const [currUpdateTraineeData,setCurrUpdateTraineeData] = useState([])
    const [isLoadingData,setIsLoadingData] = useState(true)
    const [openAddModal,setOpenAddModal] = useState(false)
    const [openUpdateSlotModal,setOpenUpdateSlotModal] = useState(false)
    const [totalSelected,setTotalSelected] = useState(0)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>{
        console.log(props)
        // setSlot(props.selectedTraining.slot)
        // setData(props.data)
        var temp = [];
        var temp2 = [];

        var data2 = {
            id:props.selectedTraining.training_details_id,
            manual:false,
            is_hrdc:true
        }
        getAllShortlistTraineeHRDC(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.length === 0){
                Swal.fire({
                    icon:'error',
                    title:'Notice !',
                    html:'As of the moment, none of the trainees were approved by the department head/incharge. Please try again later.'
                })
            }else{
                var t_data = [...res.data.data]
                var t_count = 0;
                var counter = props.selectedTraining.participants
                t_data.forEach(el=>{
                    if(t_count!==counter){
                        if(el.hrdc_approved){
                            el.selected = true
                            t_count++;
                        }else{
                            el.selected = false
                        }
                    }else{
                        el.selected = false
                    }
                })
                console.log(t_data)
                setData(t_data)
                setData2(t_data)
                setDeptInfo(res.data.dept_info)
                res.data.data.forEach(element => {
                    if(element.hrdc_approved){
                        temp.push(element.training_shortlist_id)
                        temp2.push(element)
                    }
                });
                setPreselect(temp)
                setOldselect(temp)
                setCurrUpdateTraineeData(t_data)
                setIsLoadingData(false)
            }
            
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleSelectTrainee = (key,selected,short_name)=>{
        /**
         * Check if alloted slot for dept already reach
         */
        var temp = [...data];

        if(temp[key].selected){
            temp[key].selected = !temp[key].selected;
            setData(temp)
            setCurrUpdateTraineeData(temp)
        }else{
            var count = 0;
            var slot = 0;

            JSON.parse(deptInfo[0].shortlist_details).forEach(el=>{
                if(el.dept_name === short_name){
                    slot = el.slot
                }
            })

            temp.forEach(el=>{
                if(el.selected && el.short_name === short_name){
                    count++;
                }
            })
            if(count>=slot){
                toast.warning('Slot allocation to '+short_name+' already reached.'+' Slot: '+slot+', Selected: '+count,{autoClose:3000})
            }else{
                temp[key].selected = !temp[key].selected;
                setData(temp)
                setCurrUpdateTraineeData(temp)
            }
        }
        
        
        // var id = row.training_shortlist_id
        // if(preselect.includes(id)){
        //     var temp = [...preselect]
        //     var temp2 = [...currUpdateTraineeData]
        //     var index = temp.indexOf(id)
        //     if(index>-1){
        //         temp.splice(index,1);
        //         temp2.splice(index,1);
        //         setPreselect(temp)
        //         setCurrUpdateTraineeData(temp2)
        //     }
        // }else{
        //     var temp = [...preselect]
        //     var temp2 = [...currUpdateTraineeData]
        //     temp.push(id);
        //     temp2.push(row);
        //     setPreselect(temp)
        //     setCurrUpdateTraineeData(temp2)

        // }
    }
    useEffect(()=>{
        if(preselect.length !==0){
            if(parseInt(slot)===preselect.length){
                setReachMaxSlot(true)
            }
        }

    },[preselect])
    const save = ()=>{
        var removed = [];
        var added = [];
        var data2 = {
            removed:removed,
            added:added
        }
        oldselect.forEach(el=>{
            if(!preselect.includes(el)){
                removed.push(el)
            }
        })
        preselect.forEach(el=>{
            if(!oldselect.includes(el)){
                added.push(el)
            }
        })
        Swal.fire({
            icon:'warning',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Saving data',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading()
            var data2 = {
                training_details_id:props.selectedTraining.training_details_id,
                removed:removed,
                added:added,
            }
            updateApprovedTraineeHRDC(data2)
            .then(res=>{
                // console.log(res.data)
                // Swal.close();
                if(res.data.status === 200){
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                    // handleCloseShowUpdateTrainee()
                    props.close()
                    // setData(res.data.data)
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close()
                console.log(err)
            })
        }
        })
        // console.log(data2)
        // props.saveUpdateTrainee(data2)
    }
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setPage(0)
        setSearchValue(value.target.value)
        var item = ['fname','lname','short_name']
        var temp = searchValueFunction(data2,item,value.target.value);
        setData(temp)
        // const filteredRows = props.data.filter((row) => {
        //     return row.fname.toLowerCase().includes(value.target.value.toLowerCase()) || row.lname.toLowerCase().includes(value.target.value.toLowerCase());
        //   });
        //   setData(filteredRows)
    }
    const handleClearSearch = () =>{
        setSearchValue('')
        setData(data2)
    }
    const clearPreselect = ()=>{
        // data2.forEach(element => {
        //     if(element.hrdc_approved){
        //         temp.push(element.training_shortlist_id)
        //     }
        // });
        setPreselect([])
        setCurrUpdateTraineeData([])
        var temp = [...data];
        temp.forEach(el=>{
            el.selected = false
        })
        setData(temp)
    }
    const handleSetRate = (index,value,short_name)=>{
        /**
        Check if dept slot already reached
         */
        var count = 0;
        var slot = 0;

        JSON.parse(deptInfo[0].shortlist_details).forEach(el=>{
            if(el.dept_name === short_name){
                slot = el.slot
            }
        })
        data.forEach(el=>{
            if(el.selected && el.short_name === short_name){
                count++;
            }
        })
        if(count>=slot){
            if(value.target.value !==''){
                toast.warning('Slot allocation to '+short_name+' already reached.'+' Slot: '+slot+', Selected: '+count,{autoClose:3000})
            }
            var temp = [...data];

            temp[index].rate = value.target.value;
            setData(temp)
        }else{
            if(autoSelect){
                if(parseInt(totalSelected)<parseInt(props.selectedTraining.participants)){
                    if(parseFloat(value.target.value)>=parseFloat(passingRate)){
                        var temp = [...data];
                        temp[index].rate = value.target.value;
                        temp[index].selected = true;
                        setData(temp)
                    }else{
                        var temp = [...data];
                        temp[index].rate = value.target.value;
                        temp[index].selected = false;
                        setData(temp)
                    }
                }else{
                    if(parseFloat(value.target.value)>=parseFloat(passingRate)){
                        var temp = [...data];
                        temp[index].rate = value.target.value;
                        temp[index].selected = false;
                        setData(temp)
                    }else{
                        if(value.target.value === ''){
                            var temp = [...data];
                            temp[index].rate = value.target.value;
                            temp[index].selected = false;
                            setData(temp)
                        }else{
                            var temp = [...data];
                            temp[index].rate = value.target.value;
                            setData(temp)
                        }

                    }
                }
                
            }else{
                var temp = [...data];

                temp[index].rate = value.target.value;
                setData(temp)
            }
        }
        
        
    }
    useEffect(()=>{
        var temp = 0;
        data.forEach(el=>{
            if(el.selected){
                temp++;
            }
        })
        setTotalSelected(temp)
    },[data])
    const handleSave = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'warning',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Saving data',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading()
            var temp = [];
            data.forEach(el=>{
                temp.push({
                    training_shortlist_id:el.training_shortlist_id,
                    rate:el.rate,
                    selected:el.selected,
                })

            })
            var data2  = {
                data:temp,
                training_details_id:props.selectedTraining.training_details_id
            }
            console.log(data2)
            hrdcApproval(data2)
            .then(res=>{
                if(res.data.status === 200){
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                    props.close()
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close()
                console.log(err)
            })
        }
        })
        
    }
    const [autoSelect,setAutoSelect] = useState(false);
    const [passingRate,setPassingRate] = useState('');
    const handleAutoSelect = ()=>{
        setAutoSelect(!autoSelect)
    }
    useEffect(()=>{
        if(autoSelect){
            console.log(data)
            if(passingRate !== ''){
                
                // var temp = [...data];
                // temp.map(el=>{
                //     if(parseInt(el.rate)>=parseInt(passingRate)){
                //         el.selected = true;
                //     }
                // })
                // setData(temp)


                /**
                 * 
                 Group first per department
                 */
                
                var t_dept_info = [];
                JSON.parse(deptInfo[0].shortlist_details).forEach(el=>{
                    el.counter = 0;
                    t_dept_info.push(el)
                })

                /**
                Loop data
                 */
                console.log(t_dept_info)
                var temp = [...data];
                // temp.map(el=>{
                //     if(parseInt(el.rate)>=parseInt(passingRate)){
                //         el.selected = true;
                //     }
                // })
                // setData(temp)
                temp.forEach(el=>{
                    /**
                    Check first if the dept name counter reached to slot
                     */
                    var check_arr = t_dept_info.filter((el2)=>{
                        return el.short_name === el2.dept_name
                    })
                    if(check_arr[0].counter !== parseInt(check_arr[0].slot)){
                        if(parseInt(el.rate)>=parseInt(passingRate)){
                            el.selected = true;
                            console.log(check_arr[0].counter)
                            var index = t_dept_info.findIndex(x => x.dept_name === el.short_name);
                            t_dept_info[index].counter = t_dept_info[index].counter+1;
                        }else{
                            el.selected = false;
                        }
                    }else{
                        el.selected = false;
                    }
                })
                setData(temp)
            }
        }
    },[autoSelect])
    useEffect(()=>{
        if(passingRate !== ''){
            /**
            disabled rate below to passing rate
            */
            // var temp = [...data];
            // temp.map(el=>{
            //     if(parseInt(el.rate)>=parseInt(passingRate)){
            //         el.selected = true;
            //     }else{
            //         el.selected = false;
            //     }
            // })
            // setData(temp)

            /**
            * 
            Group first per department
            */
            
            var t_dept_info = [];
            JSON.parse(deptInfo[0].shortlist_details).forEach(el=>{
                el.counter = 0;
                t_dept_info.push(el)
            })

            /**
            Loop data
                */
            console.log(t_dept_info)
            var temp = [...data];
            // temp.map(el=>{
            //     if(parseInt(el.rate)>=parseInt(passingRate)){
            //         el.selected = true;
            //     }
            // })
            // setData(temp)
            temp.forEach(el=>{
                /**
                Check first if the dept name counter reached to slot
                    */
                var check_arr = t_dept_info.filter((el2)=>{
                    return el.short_name === el2.dept_name
                })
                if(check_arr[0].counter !== parseInt(check_arr[0].slot)){
                    if(parseInt(el.rate)>=parseInt(passingRate)){
                        el.selected = true;
                        console.log(check_arr[0].counter)
                        var index = t_dept_info.findIndex(x => x.dept_name === el.short_name);
                        t_dept_info[index].counter = t_dept_info[index].counter+1;
                    }else{
                        el.selected = false;
                    }
                    
                }else{
                    el.selected = false;
                }
            })
            setData(temp)
        }
    },[passingRate])
    return(
        <>
        <form onSubmit={handleSave}>
        <Paper>
        <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',alignItems:'center'}}>
            <Grid container sx={{display:'flex',flexDirection:'row', alignItems:'center'}}>
                <Grid item xs={12} md={6} lg={6}>
                        <TextField label='Search Table' sx={{m:1}} value = {searchValue} onChange={handleSearch} placeholder='Firstname | Lastname | Department' InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
                    }}/>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Tooltip title='Add Trainee (from selected reserve trainees)'>{matches?<Button color='success' onClick={()=>setOpenAddModal(true)} fullWidth variant='outlined'sx={{mb:1}}><AddIcon/></Button>:<IconButton color='success' className='custom-iconbutton' onClick={()=>setOpenAddModal(true)}><AddIcon/></IconButton>}</Tooltip>
                    &nbsp;
                    <Tooltip title='Update slot'>{matches?<Button color='primary' onClick={()=>setOpenAddModal(true)} fullWidth variant='outlined'sx={{mb:1}}><SupervisedUserCircleIcon/></Button>:<IconButton color='primary' className='custom-iconbutton' onClick={()=>setOpenUpdateSlotModal(true)}><SupervisedUserCircleIcon/></IconButton>}</Tooltip> 
                </Grid>

            </Grid>
        <Box sx={{display:'flex',justifyContent:'flex-end',alignItems:'center',width:'100%',mb:matches?1:0}}>
        <TextField label='Passing Rate' value = {passingRate} onChange = {(value)=>setPassingRate(value.target.value)} sx={{maxWidth:100}}/>
        <FormGroup>
            <FormControlLabel control={<Switch checked ={autoSelect} onChange = {handleAutoSelect} />} label="Auto Select" />
        </FormGroup>
        <Typography sx={{background:blue[900],color:'#fff',p:2,borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px'}}><em>Total Selected: {totalSelected}</em><Tooltip title='Clear Selected'><IconButton sx={{color:blue[900],background:'#fff',p:0,ml:1,'&:hover':{background:'#fff',color:red[500]}}} onClick={clearPreselect}><ClearOutlinedIcon sx={{fontSize:'22px'}}/></IconButton></Tooltip></Typography>

        </Box>

        </Box>
        <TableContainer sx={{maxHeight:'50vh'}}>
            
            <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <StyledTableCell>
                        Name
                    </StyledTableCell>
                    <StyledTableCell>
                        Position
                    </StyledTableCell>
                    <StyledTableCell>
                        Department/Office
                    </StyledTableCell>
                    <StyledTableCell>
                        Employment Status
                    </StyledTableCell>
                    <StyledTableCell>
                        Score/Rate
                    </StyledTableCell>
                    <StyledTableCell>
                        Select
                    </StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    isLoadingData
                    ?
                    <React.Fragment>
                    <TableRow>
                        <StyledTableCell colSpan={6}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={6}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={6}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={6}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={6}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                    </React.Fragment>
                    :
                    // data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
                    data.map((data,key)=>
                    <TableRow key={key} hover>
                        <StyledTableCell>
                            {data.lname}, {data.fname}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.position_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.short_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.description}
                        </StyledTableCell>
                        <StyledTableCell>
                            <TextField label={'Rate for '+data.lname} value={data.rate} onChange = {(value)=>handleSetRate(key,value,data.short_name)} InputLabelProps={{shrink: true}} required = {data.selected?true:false}/>
                        </StyledTableCell>
                        <StyledTableCell>
                            {/* <Checkbox checked ={preselect.includes(data.training_shortlist_id)?true:false}  onChange={()=>handleSelectTrainee(data)} disabled={preselect.includes(data.training_shortlist_id)?false:preselect.length>=props.selectedTraining.participants?true:false}/> */}
                            <Checkbox checked ={data.selected}  onChange={()=>handleSelectTrainee(key,data.selected,data.short_name)} disabled={data.selected?false:totalSelected>=props.selectedTraining.participants?true:data.rate>=passingRate?false:true}/>
                        </StyledTableCell>
                    </TableRow>
                )
                }
            </TableBody>
            </Table>
        </TableContainer>
        {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        </Paper>
        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
        <Typography>Total :{data.length}</Typography>
        </Box>
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
        <Button variant='contained' sx={{m:2}} color='success' className='custom-roundbutton' disabled={totalSelected === 0 ? true:false} type='submit'>Save</Button>
        </Box>
        </form>
        <Modal
            open={openAddModal}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/* <CancelOutlinedIcon/> */}
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenAddModal(false)}/>

                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Adding new trainee/s
                </Typography>
                <Box sx={{m:1}}>
                    <AddingNewTrainees close = {()=> setOpenAddModal(false)} selectedTraining = {props.selectedTraining} currList = {data} setData = {setData} setData2 = {setData2} setPreselect={setPreselect} setOldselect = {setOldselect} preselect = {preselect} deptInfo = {deptInfo} currUpdateTraineeData = {currUpdateTraineeData}/>
                </Box>
            </Box>
        </Modal>
        <Modal
            open={openUpdateSlotModal}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/* <CancelOutlinedIcon/> */}
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenUpdateSlotModal(false)}/>

                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Updating Slot
                </Typography>
                <Box sx={{m:1}}>
                    <UpdateSlotModal close = {()=> setOpenUpdateSlotModal(false)} selectedTraining = {props.selectedTraining} deptInfo = {deptInfo} currUpdateTraineeData = {currUpdateTraineeData} setDeptInfo = {setDeptInfo}/>
                </Box>
            </Box>
        </Modal>
        </>
    )
}
export default memo(UpdateApprovedDataTable)