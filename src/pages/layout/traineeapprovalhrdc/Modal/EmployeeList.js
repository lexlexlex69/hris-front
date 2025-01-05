import React,{useEffect, useState} from 'react';
import {Grid,Box,Typography,Paper,Stack,Skeleton,TableContainer,Table,TableHead,TableRow,TableBody,TableFooter,Pagination,CircularProgress,Tooltip,IconButton,Button,FormControl,InputLabel,Select,MenuItem,Modal,TextField,InputAdornment,Fade,Checkbox  } from '@mui/material';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useNavigate} from "react-router-dom";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { auditLogs } from '../../auditlogs/Request';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue,red} from '@mui/material/colors';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import HelpIcon from '@mui/icons-material/Help';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

import { toast } from 'react-toastify';
import moment from 'moment';
import { addNewTrainees, getEmployeeList } from '../TraineeApprovalHRDCRequest';
import Swal from 'sweetalert2';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      paddingTop:0,
      paddingBottom:0,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      paddingTop:5,
      paddingBottom:5,
    },
  }));

export default function EmployeeList(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [alreadySelectedData,setAlreadySelectedData] = useState([])

    const unblockModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'99%':400,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
    };
    const updateModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'99%':400,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
    };
    const [data,setData] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [showFrom,setShowFrom] = useState(0);
    const [showTo,setShowTo] = useState(0);
    const [totalData,setTotalData] = useState(0);
    const [isLoadingData,setIsLoadingData] = useState(false);
    const [totalPage,setTotalPage] = useState(0);
    const [page,setPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(5);
    const [unblockModal,setUnblockModal] = useState(false);
    const [blockModal,setBlockModal] = useState(false);
    const [updateModal,setUpdateModal] = useState(false);
    const [selectedEmp,setSelectedEmp] = useState();
    const [searchValue,setSearchValue] = useState('');
    const [searchTimer,setSearchTimer] = useState(1000);
    const [fetchingData,setFetchingData] = useState(false);
    const [selectedEmpList,setSelectedEmpList] = useState([]);
    const [selectedEmpListWDept,setSelectedEmpListWDept] = useState([]);
    useEffect(()=>{
        checkPermission(47)
        .then((response)=>{
            if(response.data){
                // var logs = {
                //     action:'ACCESS EMPLOYEE TRAININGS',
                //     action_dtl:'ACCESS EMPLOYEE TRAININGS MODULE',
                //     module:'EMPLOYEE TRAININGS'
                // }
                // auditLogs(logs)
                setIsLoading(false)
                console.log(props.currList)
                var temp = [];
                props.currList.forEach(el=>{
                    temp.push(el.emp_id)
                })
                setAlreadySelectedData(temp)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    useEffect(async()=>{
        setIsLoadingData(true)
        var data2 = {
            is_search:false,
            search_value:searchValue,
            page:page,
            perPage:rowsPerPage
        }
        await getEmployeeList(data2)
        .then(res=>{
            console.log(res.data)
            setTotalPage(res.data.last_page)
            setData(res.data.data)
            setShowFrom(res.data.from)
            setShowTo(res.data.to)
            setTotalData(res.data.total)
            setIsLoadingData(false)

            if(res.data.data.length === 0){
                toast.error('Oops... No data found. Please try other keyword.')
            }

        }).catch(err=>{
            console.log(err)
        })
    },[page,rowsPerPage])
    const handleChange = (event, value) => {
        setPage(value);
    };
    const handleSearch = (value)=>{
        setSearchValue(value.target.value)
    }
    // useEffect(()=>{
    //     let timer;

    //     clearTimeout(timer);

    //     timer = setTimeout(async () => {
    //     // search(text);
    //     setIsLoadingData(true)
    //     setFetchingData(true)
    //     var data2 = {
    //         is_search:true,
    //         search_value:searchValue,
    //         page:page,
    //         perPage:rowsPerPage
    //     }
    //     await getEmployeeList(data2)
    //     .then(res=>{
    //         console.log(res.data)
    //         setTotalPage(res.data.last_page)
    //         setData(res.data.data)
    //         setShowFrom(res.data.from)
    //         setShowTo(res.data.to)
    //         setTotalData(res.data.total)
    //         setPage(1)
    //         setIsLoadingData(false)
    //         setFetchingData(false)

    //     }).catch(err=>{
    //         console.log(err)
    //     })
    // }, searchTimer);
    // },[searchValue])
    const submitSearch = async(event) =>{
        event.preventDefault();
        setIsLoadingData(true)
        setFetchingData(true)
        var data2 = {
            is_search:true,
            search_value:searchValue,
            page:page,
            perPage:rowsPerPage
        }
        await getEmployeeList(data2)
        .then(res=>{
            console.log(res.data)
            setTotalPage(res.data.last_page)
            setData(res.data.data)
            setShowFrom(res.data.from)
            setShowTo(res.data.to)
            setTotalData(res.data.total)
            setPage(1)
            setIsLoadingData(false)
            setFetchingData(false)
            if(res.data.data.length === 0){
                toast.error('Oops... No data found. Please try other keyword.')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleUpdateMetatags = async() =>{
        setIsLoadingData(true)
        setFetchingData(true)
        var data2 = {
            is_search:true,
            search_value:searchValue,
            page:page,
            perPage:rowsPerPage
        }
        await getEmployeeList(data2)
        .then(res=>{
            setTotalPage(res.data.last_page)
            setData(res.data.data)
            setShowFrom(res.data.from)
            setShowTo(res.data.to)
            setTotalData(res.data.total)
            setIsLoadingData(false)
            setFetchingData(false)

        }).catch(err=>{
            console.log(err)
        })
    }
    const clearSearch = async() =>{
        setSearchValue('')

        if(searchValue !==''){
            setIsLoadingData(true)
            setFetchingData(true)
            var data2 = {
                is_search:true,
                search_value:'',
                page:page,
                perPage:rowsPerPage
            }
            await getEmployeeList(data2)
            .then(res=>{
                console.log(res.data)
                setTotalPage(res.data.last_page)
                setData(res.data.data)
                setShowFrom(res.data.from)
                setShowTo(res.data.to)
                setTotalData(res.data.total)
                setPage(1)
                setIsLoadingData(false)
                setFetchingData(false)

            }).catch(err=>{
                console.log(err)
            })
        }

    }
    const handleSelectEmp = (row)=>{
        if(selectedEmpList.includes(row.id)){
            var temp = [...selectedEmpList]
            var temp2 = [...selectedEmpListWDept]

            var index = temp.indexOf(row.id)
            if(index>-1){
                temp.splice(index,1);
                temp2.splice(index,1);
                setSelectedEmpList(temp)
                setSelectedEmpListWDept(temp2)
            }
        }else{
            let temp = [...selectedEmpList];
            let temp2 = [...selectedEmpListWDept];
            temp.push(row.id)
            temp2.push(row)
            setSelectedEmpList(temp)
            setSelectedEmpListWDept(temp2)
        }
    }
    const handleSave = ()=>{
        console.log(selectedEmpList)
        Swal.fire({
            icon:'info',
            title:'Adding data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var data2 = {
            ids:selectedEmpList,
            training_details_id:props.selectedTraining.training_details_id
        }
        addNewTrainees(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status=== 200){
                props.setData(res.data.data)
                props.setData2(res.data.data)
                var temp = [];
                res.data.data.forEach(element => {
                    if(element.hrdc_approved){
                        temp.push(element.training_shortlist_id)
                    }
                });
                props.setPreselect(temp)
                props.setOldselect(temp)
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
            Swal.close()
            console.log(err)
        })
    }
    return(
        <React.Fragment>
        {
            isLoading
            ?
            <Box sx={{margin:'0 10px 10px 10px'}}>
            <Stack>
                <Skeleton variant='rounded' height={60} animation='wave' />
            </Stack>
            </Box>
            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container sx={{display:'flex',alignItems:'center'}}>
                    <Grid item xs={6} sx={{mt:2,mb:1}}>
                    <form onSubmit={submitSearch} style={{width:'100%'}}>
                        <TextField label='Search' value={searchValue} onChange = {handleSearch}
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            {
                                fetchingData
                                ?
                                <CircularProgress size={30}/>
                                :
                                <Box>
                                {
                                    searchValue !== ''
                                    ?
                                    <Fade in>
                                    <Tooltip title = 'submit search'><IconButton color='primary' type='submit'><SendIcon/></IconButton></Tooltip>
                                    </Fade>
                                    :
                                    null
                                }
                                <Tooltip title = 'clear search'><IconButton color='error' onClick={clearSearch}><HighlightOffIcon/></IconButton></Tooltip>
                                
                                </Box>
                            }
                            </InputAdornment>
                        ),
                        }}
                        placeholder='Firstname | Lastname | Department'
                        required
                        // sx={{width:matches?'100%':'50%'}}
                        fullWidth
                    />
                    </form>

                    </Grid>
                    <Grid item xs={6} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Button variant = 'contained' color='success' className='custom-roundbutton' disabled={selectedEmpList.length === 0 ?true:false} onClick = {handleSave}>Save</Button>
                    </Grid>
                    <Grid item xs={12} sx={{mb:1}}>
                        <Typography sx={{fontSize:'.8rem',fontStyle:'italic'}}><CircleIcon sx={{color:red[100]}}/> - Block/Ban</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell sx={{width:300}}>
                                            Name
                                        </StyledTableCell>
                                        <StyledTableCell sx={{width:200}}>
                                            Department
                                        </StyledTableCell>
                                        <StyledTableCell sx={{width:200}}>
                                            Employment Status
                                        </StyledTableCell>
                                        <StyledTableCell sx={{width:200}}>
                                            Last Training Status
                                        </StyledTableCell>
                                        <StyledTableCell sx={{width:20}}>
                                            Block until
                                        </StyledTableCell>
                                        <StyledTableCell align='center' sx={{minWidth:200}}>
                                            Actions
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        isLoadingData
                                        ?
                                        <React.Fragment>
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={7}>
                                                <Skeleton variant='rounded' height={25} animation='wave' />
                                            </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={7}>
                                                <Skeleton variant='rounded' height={25} animation='wave' />
                                            </StyledTableCell>
                                        </TableRow> 
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={7}>
                                                <Skeleton variant='rounded' height={25} animation='wave' />
                                            </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={7}>
                                                <Skeleton variant='rounded' height={25} animation='wave' />
                                            </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={7}>
                                                <Skeleton variant='rounded' height={25} animation='wave' />
                                            </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={7}>
                                                <Skeleton variant='rounded' height={25} animation='wave' />
                                            </StyledTableCell>
                                        </TableRow>
                                        </React.Fragment>
                                        :
                                        data.length === 0
                                        ?
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={7}>
                                                Oops... No data found
                                            </StyledTableCell>
                                        </TableRow>
                                        :
                                        data.map((row,index)=>
                                            <TableRow hover key = {index} sx={{background:row.is_ban?red[100]:'auto'}}>
                                                <StyledTableCell>
                                                {row.lname}, {row.fname}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.short_name}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.emp_status}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                <em>{row.training_status}</em>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.is_ban?moment(row.training_sanction).format('MMMM DD,YYYY'):''}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                   <Checkbox checked={selectedEmpList.includes(row.id)} disabled = {alreadySelectedData.includes(row.id)} onChange = {()=>handleSelectEmp(row)}/>
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableCell colSpan={6}>
                                    <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-end',alignItems:'center',justifyItems:'center',mt:1,mb:1}}>
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                    <InputLabel id="rowsperpage-selece-small">Rows per page</InputLabel>
                                    <Select
                                        labelId="rowsperpage-selece-small"
                                        id="rowsperpage-selece-small"
                                        value={rowsPerPage}
                                        label="Rows per page"
                                        onChange={(value)=>setRowsPerPage(value.target.value)}
                                    >
                                        <MenuItem value="">
                                        </MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={15}>15</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                    </FormControl>
                                    <Typography sx={{fontSize:'.9rem'}}> {showFrom} - {showTo} of {totalData}</Typography>
                                    <Pagination
                                        count={totalPage}
                                        siblingCount={0}
                                        onChange = {handleChange}
                                        color="primary"
                                    />
                                    </Box>
                                    </TableCell>
                                </TableFooter>
                            </Table>
                            
                        </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            
                
            </Box>
        }
        
        </React.Fragment>
    )
}