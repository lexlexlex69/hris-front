import React,{useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Grid,Box,Typography,Paper,Stack,Skeleton,TableContainer,Table,TableHead,TableRow,TableBody,TableFooter,Pagination,CircularProgress,Tooltip,IconButton,Button,FormControl,InputLabel,Select,MenuItem,Modal,TextField,InputAdornment,Fade, Checkbox } from '@mui/material';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useNavigate} from "react-router-dom";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { auditLogs } from '../../auditlogs/Request';
import { getAllEmpList, getEmployeeList, getSpecificEmployeeTrainings, getSpecifiedTrainingsSummary, getTrainingsSummary } from './EmployeeTrainingsRequest';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue,red} from '@mui/material/colors';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import UnblockModal from './Modal/UnblockModal';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import HelpIcon from '@mui/icons-material/Help';
import UpdateModal from './Modal/UpdateModal';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import DownloadIcon from '@mui/icons-material/Download';
import ListIcon from '@mui/icons-material/List';
import ChecklistIcon from '@mui/icons-material/Checklist';

import { toast } from 'react-toastify';
import BlockModal from './Modal/BlockModal';
import moment from 'moment';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { APILoading } from '../../apiresponse/APIResponse';
import Swal from 'sweetalert2';
import FullModal from '../../custommodal/FullModal';
import { DownloadTableExcel,useDownloadExcel } from 'react-export-table-to-excel';
import MediumModal from '../../custommodal/MediumModal'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { formatExtName, formatMiddlename } from '../../customstring/CustomString';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      paddingTop:5,
      paddingBottom:5,
    },
  }));

export default function EmployeeTrainings(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()

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
    const [summaryData,setSummaryData] = useState([])
    useEffect(()=>{
        checkPermission(47)
        .then(async (response)=>{
            if(response.data){
                // var logs = {
                //     action:'ACCESS EMPLOYEE TRAININGS',
                //     action_dtl:'ACCESS EMPLOYEE TRAININGS MODULE',
                //     module:'EMPLOYEE TRAININGS'
                // }
                // auditLogs(logs)
                setIsLoading(false)
                /**
                Get trainings summary
                 */
                const summary = await getTrainingsSummary()
                console.log(summary)
                setSummaryData(summary.data.data)
                
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
    const handleUnblock = (row)=>{
        setSelectedEmp(row)
        setUnblockModal(true)
    }
    const handleBlock = (row)=>{
        setSelectedEmp(row)
        setBlockModal(true)
    }
    const handleUpdate = (row)=>{
        setSelectedEmp(row)
        setUpdateModal(true)
    }
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
    const [empTrainingsData,setEmpTrainingsData] = useState([])
    const [openEmpTrainingsModal,setOpenEmpTrainingsModal] = useState(false)
    const [selectedEmpData,setSelectedEmpData] = useState([])
    const handleCloseEmpTrainingsModal = () => {
        setOpenEmpTrainingsModal(false)
    }
    const handleViewTrainings = async (row) => {
        console.log(row)
        setSelectedEmpData(row)
        APILoading('info','Retrieving employee trainings','Please wait...')
        var t_data = {
            id:row.id
        }
        const res = await getSpecificEmployeeTrainings(t_data)
        setEmpTrainingsData(res.data.data)
        setOpenEmpTrainingsModal(true)
        Swal.close();
    }
    const printSummary = useRef()
    const [openDownloadSummary,setOpenDownloadSummary] = useState(false);
    const [allEmpListData,setAllEmpListData] = useState([])
    const [loadingEmpList,setLoadingEmpList] =  useState(false)
    const [selectedEmpForSummary,setSelectedEmpForSummary] = useState([])
    const handleOpenDownloadSummary = async () =>{
        setOpenDownloadSummary(true)
        setLoadingEmpList(true)
        if(allEmpListData.length === 0){
            /**
            get all employees
            */
            try{
                const res = await getAllEmpList()
                setAllEmpListData(res.data)
                setLoadingEmpList(false)
                
            }catch(err){
                Swal.fire({
                    icon:'error',
                    title:err
                })
            }
        }else{
            setLoadingEmpList(false)
        }
        
        
        
    }
    const handleCloseDownloadSummary = () =>{
        setOpenDownloadSummary(false)
        setSelectedEmpForSummary([])
    }
    
    const handleRowSelected = useCallback(row =>{
        setSelectedEmpForSummary(row.selectedRows)
    },[])
    const handleDownloadSummary = async ()=>{
        APILoading('info','Genarating Summary','Please wait...')
        try{
            var emp_ids = [];
            selectedEmpForSummary.forEach(el=>{
                emp_ids.push(el.id)
            })
            var t_data = {
                emp_ids:emp_ids
            }
            const res = await getSpecifiedTrainingsSummary(t_data)
            console.log(res.data.data)
            if(res.data.data.length>0){
                setSummaryData(res.data.data)
                Swal.close()
                onDownload()
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:'No trainings found on the selected employee'
                })
            }
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        // onDownload()
        // console.log(selectedEmpForSummary)
    }
    const columns = useMemo( ()=> [
        {
            name:'Name',
            selector:row=>row.lname+', '+row.fname+' '+formatExtName(row.extname)+' '+formatMiddlename(row.mname)
        },{
            name:'Position',
            selector:row=>row.position_name
        }
        ],[],
    )
    const tableData = {
        columns:columns,
        data:allEmpListData,
    };
    const {onDownload} = useDownloadExcel({
        currentTableRef:printSummary.current,
        filename:'Trainings Summary' +moment().format('MM-DD-YYYY h:m:s a'),
        sheet:"Summary"
    })
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
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Employee Trainings Management
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Employee Trainings Management'/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' onClick={handleOpenDownloadSummary}>Download Summary</Button>
                        <MediumModal open={openDownloadSummary} close={handleCloseDownloadSummary} title='Download Employee Trainings Summary'>
                            {
                                loadingEmpList
                                ?
                                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                    <CircularProgress/>
                                    <Typography>Loading Employee List. Please wait...</Typography>
                                </Box>
                                :
                                <Box sx={{position:'relative'}}>
                                    {
                                        selectedEmpForSummary.length>0
                                        ?
                                        <Tooltip title={<Box sx={{maxHeight:'50vh',p:1,overflowY:'scroll'}}>
                                        <Typography sx={{fontSize:'.9rem',mb:1}}>Selected Employee/s:</Typography>
                                        {selectedEmpForSummary.map((item,key)=>
                                            <p key={key} style={{display:'flex',alignItems:'center',gap:1,'&:hover':{background:grey[800],cursor:'pointer'}}}>{`${key+1}. ${item.lname}, ${item.fname} ${formatExtName(item.extname)} ${formatMiddlename(item.mname)}`}</p>
                                        )}</Box>}><IconButton className='custom-iconbutton' sx={{position: 'absolute',top: '50%',zIndex: 2,background: '#fff',right: 0,'&:hover':{background:'#fff'}}}><ChecklistIcon/></IconButton></Tooltip>
                                        :
                                        null
                                    }
                                    
                                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>

                                    <Button variant='contained' startIcon={<DownloadIcon/>} disabled={selectedEmpForSummary.length === 0 ?true:false} onClick={handleDownloadSummary}>Download Now</Button>
                                    </Box>
                                    <small style={{color:grey[700]}}><em>* Please select the employee to be included in the summary</em></small>

                                    <DataTableExtensions
                                        {...tableData}
                                        filterPlaceholder = 'Search Employee'
                                        export = {false}
                                        print = {false}
                                        >
                                        <DataTable
                                            columns={columns}
                                            data={data}

                                            // subHeader
                                            pagination
                                            selectableRows
                                            // contextActions={contextActions}
                                            onSelectedRowsChange={handleRowSelected}
                                            // clearSelectedRows={toggleCleared}
                                            fixedHeader
                                            // fixedHeaderScrollHeight="40vh"
                                            paginationPerPage={5}
                                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                            paginationComponentOptions={{
                                                rowsPerPageText: 'Records per page:',
                                                rangeSeparatorText: 'out of',
                                            }}
                                        />
                                    </DataTableExtensions>
                                </Box>
                            }
                        </MediumModal>
                        {/* <DownloadTableExcel
                            filename={`Trainings Summary ${moment().format('MM-DD-YYYY h:m:s a')}`}
                            sheet="Summary"
                            currentTableRef={printSummary.current}
                            style={{cursor:'d'}}
                        >

                        <Tooltip title='Download Emplyee Trainings Summary'><Button variant='contained'>Download Summary</Button></Tooltip>
                        </DownloadTableExcel> */}
                        <div style={{display:'none'}}>
                        <table ref={printSummary}>
                            <thead>
                                <tr>
                                    <th>
                                        Last Name
                                    </th>
                                    <th>
                                        First Name
                                    </th>
                                    <th>
                                        Middle Name
                                    </th>
                                    <th>
                                        Ext. Name
                                    </th>
                                    <th>
                                        Trainings
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    summaryData.map((item,key)=>
                                        <tr key={key}>
                                            <td>
                                                {item.lname}
                                            </td>
                                            <td>
                                                {item.fname}
                                            </td>
                                            <td>
                                                {item.mname}
                                            </td>
                                            <td>
                                                {item.extname}
                                            </td>
                                            <td>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                title
                                                            </th>
                                                            <th>
                                                                date from
                                                            </th>
                                                            <th>
                                                                date to
                                                            </th>
                                                            <th>
                                                                no. of hours
                                                            </th>
                                                            <th>
                                                                conducted by
                                                            </th>
                                                            <th>
                                                                type
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {JSON.parse(item.trainings).map((item2,key2)=>
                                                        <tr key={key2}>
                                                            <td>{item2.title}</td>
                                                            <td>{item2.datefrom}</td>
                                                            <td>{item2.dateto}</td>
                                                            <td>{item2.nohours}</td>
                                                            <td>{item2.conducted}</td>
                                                            <td>{item2.typeLD}</td>
                                                        </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                                
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        </div>
                    </Grid>
                    <form onSubmit={submitSearch} style={{width:'100%'}}>
                    <Grid item xs={12} sx={{mt:2,mb:1}}>
                        <TextField label='Search' value={searchValue} onChange = {handleSearch}
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            {
                                fetchingData
                                ?
                                <CircularProgress size={30}/>
                                :
                                <Box sx={{display:'flex',flexDirection:'row'}}>
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
                    </Grid>
                    </form>
                    <Grid item xs={12} sx={{mb:1}}>
                        <Typography sx={{fontSize:'.8rem',fontStyle:'italic'}}><CircleIcon sx={{color:red[100]}}/> - Block/Ban</Typography>
                        <table>
                            <thead>
                                <tr>
                                    <th>

                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                        <TableContainer>
                            <Table>
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
                                        <StyledTableCell>
                                            Meta Tags <Tooltip title ='Keyword used when generating training shortlist'><IconButton ><HelpIcon sx={{fontSize:'15px',color:'#fff'}}/></IconButton></Tooltip>
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
                                                {row.meta_tags}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                <em>{row.training_status}</em>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.is_ban?moment(row.training_sanction).format('MMMM DD,YYYY'):''}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {
                                                        row.is_ban
                                                        ?
                                                        <Tooltip title='Unblock'><IconButton color='success' className='custom-iconbutton' size='small' onClick={()=>handleUnblock(row)}><LockOpenIcon/></IconButton></Tooltip>
                                                        :
                                                        <Tooltip title='Block' color='error'><IconButton className='custom-iconbutton' size='small' onClick={()=>handleBlock(row)}><LockIcon/></IconButton></Tooltip>
                                                    }
                                                    <Tooltip title='Update meta tags'><IconButton color='success' className='custom-iconbutton' size='small' onClick={()=>handleUpdate(row)} sx={{ml:1}}><EditIcon/></IconButton></Tooltip>

                                                    <Tooltip title='View Trainings'><IconButton color='primary' className='custom-iconbutton' size='small' onClick={()=>handleViewTrainings(row)} sx={{ml:1}}><ModelTrainingIcon/></IconButton></Tooltip>
                                                    {/* <Tooltip title='View trainings attended'><IconButton className='custom-iconbutton' color='primary' sx={{ml:1}} size='small' onClick={()=>handleViewTrainings(row)}><FolderSharedIcon/></IconButton></Tooltip> */}
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
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
                        </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
                <FullModal open={openEmpTrainingsModal} close={handleCloseEmpTrainingsModal} title={`${selectedEmpData.lname}'s list of Trainings`}>
                    <Box>
                        <Paper>
                            <TableContainer sx={{maxHeight:'60dvh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Title
                                            </TableCell>
                                            <TableCell>
                                                Date From
                                            </TableCell>
                                            <TableCell>
                                                Date To
                                            </TableCell>
                                            <TableCell>
                                                No. of hours
                                            </TableCell>
                                            <TableCell>
                                                Conducted by
                                            </TableCell>
                                            <TableCell>
                                                Type
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            empTrainingsData.map((item,key)=>
                                                <TableRow key={key}>
                                                    <TableCell>
                                                        {item.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(item.datefrom).format('MMMM DD, YYYY')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(item.dateto).format('MMMM DD, YYYY')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.nohours}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.conducted}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.typeLD}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </FullModal>
                <Modal
                    open={unblockModal}
                    onClose={()=> setUnblockModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={unblockModalStyle}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setUnblockModal(false)}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Unblock Employee Trainings
                        </Typography>
                        <Box sx={{m:2}}>
                            <UnblockModal close = {()=> setUnblockModal(false)} selectedEmp = {selectedEmp} setData = {setData} rowsPerPage = {rowsPerPage} searchValue = {searchValue}/>
                        </Box>

                    </Box>
                </Modal>
                <Modal
                    open={blockModal}
                    onClose={()=> setBlockModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={unblockModalStyle}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setBlockModal(false)}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Block Employee Trainings
                        </Typography>
                        <Box sx={{m:2}}>
                            <BlockModal close = {()=> setBlockModal(false)} selectedEmp = {selectedEmp} setData = {setData} rowsPerPage = {rowsPerPage} searchValue = {searchValue}/>
                        </Box>

                    </Box>
                </Modal>
                <Modal
                    open={updateModal}
                    onClose={()=> setUpdateModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={unblockModalStyle}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setUpdateModal(false)}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Updating Employee Meta Tags
                        </Typography>
                        <Box sx={{m:2}}>
                            <UpdateModal close = {()=> setUpdateModal(false)} selectedEmp = {selectedEmp} setData = {setData} rowsPerPage = {rowsPerPage} handleUpdateMetatags = {handleUpdateMetatags}/>
                        </Box>

                    </Box>
                </Modal>
                
            </Box>
        }
        
        </React.Fragment>
    )
}