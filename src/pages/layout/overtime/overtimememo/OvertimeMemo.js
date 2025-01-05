import React,{useEffect, useState} from 'react';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { Box,Grid,Fade,Tooltip,Button,IconButton,Modal,TextField,InputAdornment,TableFooter } from '@mui/material';
//icons
import AddIcon from '@mui/icons-material/Add';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';

import {blue,green,red} from '@mui/material/colors'
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AddDialog from './Dialog/AddDialog';
import { deleteEmpOvertimeDetails, getOvertimeDetailsPerDept } from './OvertimeMemoRequest';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import moment from 'moment';
import { formatExtName } from '../../customstring/CustomString';
import Swal from 'sweetalert2';
import SmallModal from '../../custommodal/SmallModal';
import UpdatingEmpDates from './Components/UpdatingEmpDates';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function OvertimeMemo(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':600,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
    };
    const [isLoading,setisLoading] = React.useState(true)
    const [data,setData] = useState([])

    useEffect(()=>{
        checkPermission(55)
        .then((response)=>{
            // console.log(response.data)
            setisLoading(false)
            if(response.data){
                getOvertimeDetailsPerDept()
                .then(res=>{
                    console.log(res.data)
                    setData(res.data.reverse())
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate('/')
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const [open, setOpen] = React.useState(false);
    const [openEmplistModal, setOpenEmplistModal] = useState(false);
    const [selectedEmpListData, setSelectedEmpListData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpenEmpListModal = () => {
        setOpenEmplistModal(true);
    };

    const handleCloseEmpListModal = () => {
        setOpenEmplistModal(false);
    };
    const handleViewEmpList = (row)=>{
        console.log(row)
        setSelectedData(row)
        setSelectedEmpListData(JSON.parse(row.emp_list))
        setOpenEmplistModal(true);
    }
    const formatTime = (time)=>{
        if(time){
            var date = new Date();
            var t_time = time.split(':');
            
            date.setHours(t_time[0],t_time[1],t_time[2])
            return moment(date).format('h:mm a')
        }else{
            return null;
        }
    }
    const handleRemove = (row) =>{
        console.log(selectedData)
        Swal.fire({
            icon:'info',
            title:'Deleting from list',
            html:'Please wait...'
        })
        Swal.showLoading();
        var t_data  = {
            overtime_id:selectedData.overtime_id,
            emp_id:row.id
        }
        deleteEmpOvertimeDetails(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                var temp = [...selectedEmpListData];
                var index = temp.findIndex(object=>{
                    return object.id === row.id
                });
                temp.splice(index,1);
                setSelectedEmpListData(temp)

                var temp2 = [...data];
                var index2 = temp2.findIndex(object=>{
                    return object.overtime_id === selectedData.overtime_id
                })
                temp2[index2].emp_list = JSON.stringify(temp);
                setData(temp2);
                
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
            
        }).catch(err=>{
            console.log(err)
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const [searchVal,setSearchVal] = useState('');

    const searchFilter = selectedEmpListData.filter((el)=>{
        return el.emp_fname.includes(searchVal.toUpperCase()) || el.emp_lname.includes(searchVal.toUpperCase())
    })
    const [openUpdateDatesPerEmp,setOpenUpdateDatesPerEmp] = useState(false);
    const [selectedEmp,setSelectedEmp] = useState('')
    const handleUpdateDates = (row)=>{
        console.log(row)
    }
    const handleUpdateDatesPerEmp = (row) => {
        console.log(row)
        setSelectedEmp(row)
        setOpenUpdateDatesPerEmp(true)
    }
    return(
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading actionButtons={1}/>
                :
                <Fade in={!isLoading}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title ='Overtime Memo'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Tooltip title='Add overtime memo details'><IconButton color='success' className='custom-iconbutton' onClick={handleClickOpen}><AddIcon/></IconButton></Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell rowSpan={2}>
                                                Date Period
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                Total
                                            </TableCell>
                                            <TableCell colSpan={2} align='center'>
                                                WeekDays
                                            </TableCell>
                                            <TableCell  colSpan={2} align='center'>
                                                WeekEnds
                                            </TableCell>
                                            <TableCell  colSpan={2} align='center'>
                                                Holidays
                                            </TableCell>
                                            <TableCell rowSpan={2} align='center'>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='center'>
                                                From
                                            </TableCell>
                                            <TableCell align='center'>
                                                To
                                            </TableCell>
                                             <TableCell align='center'>
                                                From
                                            </TableCell>
                                            <TableCell align='center'>
                                                To
                                            </TableCell>
                                            <TableCell align='center'>
                                                From
                                            </TableCell>
                                            <TableCell align='center'>
                                                To
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data.map((row,key)=>
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {row.period_date_text}
                                                </TableCell>
                                                <TableCell>
                                                    {JSON.parse(row.emp_list).length}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {formatTime(row.weekdays_from)}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {formatTime(row.weekdays_to)}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {formatTime(row.weekends_from)}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {formatTime(row.weekends_to)}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {formatTime(row.holidays_from)}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {formatTime(row.holidays_to)}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Box sx={{display:'flex',justifyContent:'center',gap:1}}>
                                                    <Tooltip title='Update dates'><IconButton color='success' onClick={()=>handleUpdateDates(row)} className='custom-iconbutton'><EditIcon/></IconButton></Tooltip>
                                                    <Tooltip title='View Employee List'><IconButton color='primary' onClick={()=>handleViewEmpList(row)} className='custom-iconbutton'><PeopleAltIcon/></IconButton></Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>


                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        
                        </Grid>
                        <Dialog
                            fullScreen
                            open={open}
                            // onClose={handleClose}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'relative' }}>
                            <Toolbar>
                                <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                                >
                                <CloseIcon />
                                </IconButton>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Overtime Details
                                </Typography>
                                <Button autoFocus color="inherit" onClick={handleClose}>
                                close
                                </Button>
                            </Toolbar>
                            </AppBar>
                            <Box>
                                <AddDialog close={handleClose} setData ={setData}/>
                            </Box>
                        </Dialog>

                        <Modal
                            open={openEmplistModal}
                            onClose={handleCloseEmpListModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography sx={{background: blue[800],color: '#fff',padding: '5px 10px',width: 'fit-content',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>Employee List</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{mt:1,mb:1}}>
                                    <TextField label = 'Search' placeholder='Firstname | Lastname' value = {searchVal} onChange = {(val)=>setSearchVal(val.target.value)} fullWidth
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><SearchIcon/></InputAdornment>
                                    }}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper>
                                        <TableContainer sx={{maxHeight:'65vh'}}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Employee Name
                                                        </TableCell>
                                                        <TableCell>
                                                            Max OT (weekdays)
                                                        </TableCell>
                                                        <TableCell>
                                                            Max OT (weekdends)
                                                        </TableCell>
                                                        <TableCell>
                                                            Action
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        searchFilter.map((row,key)=>
                                                            <TableRow key={key} hover>
                                                                <TableCell>
                                                                    {`${row.emp_fname} ${row.emp_mname?row.emp_mname.charAt(0)+'.':' '} ${row.emp_lname} ${formatExtName(row.emp_extname)}`}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {row.weekdays}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {row.weekends}
                                                                </TableCell>
                                                                <TableCell align='center'>
                                                                    <Box sx={{display:'flex',justifyContent:'center',gap:1}}>
                                                                    <Tooltip title='Update Dates'><IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleUpdateDatesPerEmp(row)}><EditIcon/></IconButton></Tooltip>
                                                                    <Tooltip title='Delete from list'><IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleRemove(row)}><DeleteIcon/></IconButton></Tooltip>
                                                                    </Box>

                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                    <Typography sx={{display:'flex',justifyContent:'flex-end',color:'#4e4e4e',fontStyle:'italic',fontSize:'.8rem'}}>Total: {searchFilter.length}</Typography>
                                </Grid>
                            
                            </Grid>
                            </Box>
                        </Modal>
                        <SmallModal open = {openUpdateDatesPerEmp} close = {()=>setOpenUpdateDatesPerEmp(false)} title={`Updating ${selectedEmp.emp_lname}'s overtime dates`}>
                            <UpdatingEmpDates selectedData = {selectedData} selectedEmp = {selectedEmp} close = {()=>setOpenUpdateDatesPerEmp(false)}/>
                        </SmallModal>
                    </Grid>
                </Fade>
            }
        </Box>
    )
}