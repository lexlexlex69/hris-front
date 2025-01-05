import { Box, Typography,Stack,Skeleton,Fade,Grid,Paper,Autocomplete,TextField,Button,AppBar,Toolbar,IconButton,Modal } from '@mui/material';
import React,{useEffect, useRef, useState} from 'react';
import {useNavigate}from "react-router-dom";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { getAllOfficeData } from '../headofoffice/HeadOfOfficeConfigRequest';
import {blue,red,purple} from '@mui/material/colors';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getEmpLogs, getOfficeEmp, searchHistoryLogs } from './AuditTrailRequest';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { auditLogs } from '../../auditlogs/Request';
import TableData from './Table/TableData';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import Dialog from '@mui/material/Dialog';
import SearchModal from './Modal/SearchModal';
import InputAdornment from '@mui/material/InputAdornment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import TableContainer from '@mui/material/TableContainer/TableContainer';
import Table from '@mui/material/Table/Table';
import TableHead from '@mui/material/TableHead/TableHead';
import TableRow from '@mui/material/TableRow/TableRow';
import TableCell from '@mui/material/TableCell/TableCell';
import TableBody from '@mui/material/TableBody/TableBody';
import TablePagination from '@mui/material/TablePagination/TablePagination';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import moment from 'moment';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AuditTrail(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:matches?300:550,
    marginBottom: 0,
    background: '#fff',
    border: '2px solid #fff',
    borderRadius:3,
    boxShadow: 24,
    // p: 4,
  };
    const [isLoading,setIsLoading] = useState(true);
    const [office,setOffice] = useState(null)
    const [officeData,setOfficeData] = useState([])
    const [data,setData] = useState([])
    const [logData,setLogData] = useState([])
    const [selectedEmp,setSelectedEmp] = useState('')
    const [selectedUserName,setSelectedUserName] = useState('');
    const [searchModal,setSearchModal] = useState('');
    const [searchData,setSearchData] = useState([]);
    const columns = [
        {
            name:'Name',
            selector:row=>row.fullname
        }
    ];
    
    const tableData = {
        columns,
        data
    }
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(()=>{
        checkPermission(33)
        .then((response)=>{
            if(response.data){
                setIsLoading(false)
                getAllOfficeData()
                .then(respo=>{
                    const data = respo.data
                    setOfficeData(data)
                }).catch(err=>{
                    console.log(err)
                })
                var logs = {
                    action:'ACCESS AUDIT TRAIL',
                    action_dtl:'ACCESS AUDIT TRAIL MODULE',
                    module:'AUDIT TRAIL'
                }
                auditLogs(logs)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const handleSetOffice = (event,newValue) => {
        console.log(newValue)
        if(newValue){
            var data = {
                dept_code:newValue.dept_code,
                dept_name:newValue.office_division_name
            }
            getOfficeEmp(data)
            .then(res=>{
                console.log(res.data)
                setData(res.data)
            }).catch(err=>{
                console.log(err)
            })
            setOffice(newValue);

        }else{
            setOffice(null);
        }
    }
    const customStyles = {
        rows: {
            style: {
                // minHeight: '72px', // override the row height
                // '&:hover':{
                //     cursor:'pointer',
                // }
                '&:hover':{
                    cursor:'pointer',
                    fontWeight:'bold'
                },
            },
        },
        headCells: {
            style: {
                paddingLeft: '10px', // override the cell padding for head cells
                paddingRight: '10px',
                background:blue[ 500],
                color:'white',
                fontSize:'.9rem',
                wordWrap:'break-word'
            },
        },
        cells: {
            style: {
                paddingLeft: '10px', // override the cell padding for data cells
                paddingRight: '10px',
                
            },
        },
    };
    
    const rowSelect = (row)=>{
        var logs = {
            action:'VIEW EMPLOYEE AUDIT TRAIL',
            action_dtl:'NAME = '+row.fullname,
            module:'AUDIT TRAIL'
        }
        auditLogs(logs)
        setSelectedEmp(row.fullname)
        setSelectedUserName(row.username)
        // getEmpLogs(row)
        // .then(res=>{
        //     setLogData(res.data)
        // }).catch(err=>{
        //     console.log(err)
        // })
    }
    const [historyDialogOpen,setHistoryDialogOpen] = useState(false)
    const handleOpenHistory = ()=>{
        setHistoryDialogOpen(true)
    }
    const handleCloseHistory = ()=>{
        setHistoryDialogOpen(false)
    }
    const dateFromRef = useRef();
    const dateToRef = useRef();
    const handleSetDateFrom = (value)=>{
        dateFromRef.current = value.target.value
    }
    const handleSetDateTo = (value)=>{
        dateToRef.current = value.target.value
    }
    const handleSearch = (event)=>{
        event.preventDefault();
        var data2 = {
            from:dateFromRef.current,
            to:dateToRef.current,
        }
        // console.log(data2)
        searchHistoryLogs(data2)
        .then(res=>{
            console.log(res.data)
            setSearchData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const [searchVal,setSearchVal] = useState('');
    const filteredData = searchData.filter((el)=>{
        return el.user_name.includes(searchVal.toUpperCase()) || el.module.includes(searchVal.toUpperCase()) || el.user_action.includes(searchVal.toUpperCase())
    })
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{margin:'10px 20px 20px 20px'}}>
            <Stack sx={{marginTop:'-10px'}}>
                <Skeleton variant="text" height={'110px'} animation="wave"/>
            </Stack>
            </Box>

            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Audit Trail
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Audit Trail'/>
                    </Grid>
                    <br/>
                    <Grid item xs={12} sx={{display:'flex',flexDirectionL:'row',justifyContent:'flex-end'}}>
                        <IconButton color='secondary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:purple[800]}}} onClick = {handleOpenHistory}><DateRangeIcon/></IconButton>
                        &nbsp;
                        <IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>setSearchModal(true)}><PersonSearchOutlinedIcon/></IconButton>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={officeData}
                        value = {office}
                        getOptionLabel={(option) => option.office_division_name}
                        onChange={handleSetOffice}
                        renderInput={(params) => <TextField {...params} label="Office" required/>}
                        
                    />
                    <DataTableExtensions
                            {...tableData}
                            export={false}
                            print={false}
                        >
                        <DataTable
                            data = {data}
                            columns = {columns}
                            customStyles = {customStyles}
                            highlightOnHover
                            pagination
                            fixedHeader
                            fixedHeaderScrollHeight="300px"
                            onRowClicked={rowSelect}

                        />
                        </DataTableExtensions>
                    </Grid>
                    <Grid item xs={12} md={8} lg={8} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Box sx={{width:matches?'100%':'99%',marginTop:matches?'auto':'8px'}}>
                            {
                              selectedEmp.length !==0
                              ?
                              <>
                              <TextField label = 'Employee Name' value = {selectedEmp} fullWidth InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} variant='standard'/>
                            <TableData data = {logData} username = {selectedUserName}/>
                              </>
                              :
                              <Stack sx={{marginTop:'-138px'}}>
                                <Skeleton variant="text" height={'100vh'} width='100$' animation="wave"/>
                            </Stack>

                            }
                            
                            
                        </Box>

                    </Grid>
                </Grid>
                <Modal
                    open={searchModal}
                    onClose = {()=>setSearchModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx ={style}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=>setSearchModal(false)}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Search User
                        </Typography>
                        <Box sx={{mt:2,p:2}}>
                            <SearchModal/>
                        </Box>
                    </Box>
                </Modal>
                <Dialog
                    fullScreen
                    open={historyDialogOpen}
                    onClose={handleCloseHistory}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseHistory}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        User logs
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseHistory}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <form onSubmit={handleSearch}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                <TextField label='Date From' type='date' InputLabelProps={{shrink:true}} ref={dateFromRef} required onChange = {handleSetDateFrom}/>
                                &nbsp;
                                <TextField label='Date To' type='date' InputLabelProps={{shrink:true}} ref={dateToRef} required onChange = {handleSetDateTo}/>
                                &nbsp;
                                <Button variant='contained' type='submit'>Search</Button>
                            </Grid>
                        </Grid>
                        </form>
                        <Grid container spacing={1} sx={{mt:2}}>
                            <Grid item xs={12}>
                            <TextField label='Search' placeholder='Name | Module | Action' value = {searchVal} onChange = {(val)=>setSearchVal(val.target.value)} sx={{mb:1}}/>
                            <Paper>
                                <TableContainer sx={{maxHeight:'60vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Office Name</TableCell>
                                                <TableCell>User Type</TableCell>
                                                <TableCell>Module</TableCell>
                                                <TableCell>Action</TableCell>
                                                <TableCell>Action Details</TableCell>
                                                <TableCell>Datetime</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                                    <TableRow key={key} hover>
                                                        <TableCell>{row.user_name}</TableCell>
                                                        <TableCell>{row.short_name}</TableCell>
                                                        <TableCell>{row.user_type === 1?'Employee':'Applicant'}</TableCell>
                                                        <TableCell>{row.module}</TableCell>
                                                        <TableCell>{row.user_action}</TableCell>
                                                        <TableCell>{row.user_action_details}</TableCell>
                                                        <TableCell>{moment(row.created_at).format('MMMM DD, YYYY | h:mm a')}</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25,100]}
                                    component="div"
                                    count={filteredData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>

                            </Grid>

                        </Grid>

                    </Box>
                </Dialog>
                
            </Box>
        }
        </>
        
    )
}