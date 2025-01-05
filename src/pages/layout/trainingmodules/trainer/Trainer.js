import React,{useEffect, useState} from 'react';
import {Grid,Typography,Box,Skeleton,Stack,Button,IconButton,Tooltip,Table,TableBody,TableHead,TableRow,TablePagination,TableContainer,Paper, TextField } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {blue,green,red} from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useNavigate}from "react-router-dom";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Add from './Dialog/Add';
import { deleteTrainer, getAllTrainerData, getCourse, getMetaTagsData } from './TrainerRequest';
import DataTable from 'react-data-table-component';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import Update from './Dialog/Update';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[800],
    color: theme.palette.common.white,
},
[`&.${tableCellClasses.body}`]: {
    fontSize: 14,
},
}));
export default function Trainer(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [isLoading,setIsLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [seeMoreTrainingIds,setSeeMoreTrainingIds] = useState([])
    const [metaTagsData,setMetaTagsData] = useState([])
    const [selectedUpdateData,setSelectedUpdateData] = useState([])

    const deleteAction = (row)=>{
        Swal.fire({
            icon:'warning',
            title: 'Confirm delete trainer?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelbuttonText:'No'
          }).then((result) => {
            if (result.isConfirmed) {
                var data2 = {
                    trainer_id:row.trainer_id
                }
                Swal.fire({
                    icon:'info',
                    title:'Deleting data',
                    html:'Please wait...'
                })
                Swal.showLoading()
                deleteTrainer(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        setData(res.data.data)
                        setData1(res.data.data)
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
                    console.log(res.data)
                }).catch(err=>{
                    console.log(err)
                })
            }
          })
        
    }
    const [courseData,setCourseData] = useState([])
    useEffect(()=>{
        checkPermission(36)
        .then(async (response)=>{
            if(response.data){
                setIsLoading(false)
                getAllTrainerData()
                .then(res=>{
                    setData(res.data)
                    setData1(res.data)
                }).catch(err=>{
                    console.log(err)
                })
                getMetaTagsData()
                .then(res=>{
                    setMetaTagsData(res.data)
                }).catch(err=>{
                    console.log(err)
                })
                const courses = await getCourse()
                setCourseData(courses.data.data)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])
    const formatAcadQ = (row)=>{
        if(row.acad === null){
            return(
                <span>N/A</span>
            )
        }else{
            return(
                <ul>
                    {JSON.parse(row.acad).map((data,key)=>
                        <li key = {key}>{data.acad_qualif_name}</li>
                    )}
                </ul>
            )
        }
        
    }
    const formatProfAff = (row)=>{
        if(row.prof_aff === null){
            return(
                <span>N/A</span>
            )
        }else{
            return(
                <ul>
                    {JSON.parse(row.prof_aff).map((data,key)=>
                        <li key = {key}>{data.prof_aff_name}</li>
                    )}
                </ul>
            )
        }
        
    }
    const formatTTrainings = (row)=>{
        if(row.trainings === null){
            return(
                <span>N/A</span>
            )
        }else{
            if(seeMoreTrainingIds.includes(row.trainer_id)){
                return(
                    <ul>
                    {JSON.parse(row.trainings).map((data,key)=>
                        <li key = {key}>{data.training_name}</li>
                    )}
                    <a href='#' onClick = {()=>removeSeeMore(row.trainer_id)}>see less</a>
                    </ul>
                )
            }else{
                return(
                    <ul>
                    {JSON.parse(row.trainings).map((data,key)=>
                        key>=3
                        ?
                            key===3
                            ?
                            <a href='#' onClick = {()=>addSeeMore(row.trainer_id)} key={key}>see more</a>
                            :
                            ''
                        :
                        <li key = {key}>{data.training_name}</li>
                    )}
                    </ul>
                )
            }
        }
        
    }
    const formatProfExp = (row)=>{
        if(row.prof_exp === null){
            return(
                <span>N/A</span>
            )
        }else{
            return(
                <ul>
                    {JSON.parse(row.prof_exp).map((data,key)=>
                        <li key = {key}>{data.prof_exp_name}</li>
                    )}
                </ul>
            )
        }
    }
    const formatTechExpertise = (row)=>{
        if(row.expertise === null){
            return(
                <span>N/A</span>
            )
        }else{
            return(
                <ul>
                    {JSON.parse(row.expertise).map((data,key)=>
                        <li key = {key}>{data.expertise_name}</li>
                    )}
                </ul>
            )
        }
    }
    const addSeeMore = (id) =>{
        let temp = [...seeMoreTrainingIds];
        temp.push(id);
        setSeeMoreTrainingIds(temp)
    }
    const removeSeeMore = (id)=>{
        var index = seeMoreTrainingIds.indexOf(id);
        if (index !== -1) {
            seeMoreTrainingIds.splice(index, 1);
        }
    }
    const handleDialogOpen = (event) =>{
        event.preventDefault();
        setOpenDialog(true);

    }
    const handleCloseDialog = () =>{
        setOpenDialog(false);
    }
    const handleCloseUpdateDialog = () =>{
        setOpenUpdateDialog(false);
    }
    const handleReload = () => {
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        getAllTrainerData()
        .then(res=>{
            setData(res.data)
            setData1(res.data)
            Swal.close();
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    const updateAction = (data) =>{
        setOpenUpdateDialog(true);
        setSelectedUpdateData(data)
        console.log(data)
    }
    const [searchVal,setSearchVal] = useState('');
    const handleSearch = (val)=>{
        setSearchVal(val.target.value);
        // if(val){
        //     var t_arr = data1.filter((el)=>{
        //         return el.fname.toLowerCase().includes(val.target.value) || el.lname.toLowerCase().includes(val.target.value)
        //     })
        //     setData(t_arr)
        // }else{
        //     setData(data1)
        // }

    }
    const filterData = data.filter((el)=>el.fname?.toUpperCase().includes(searchVal.toUpperCase()) || el.lname?.toUpperCase().includes(searchVal.toUpperCase()) || el.company_name?.toUpperCase().includes(searchVal.toUpperCase()))
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{margin:'5px 10px 10px 10px'}}>
            <DashboardLoading actionButtons={2}/>
            </Box>

            :
            <Box sx={{margin:'5px 10px 10px 10px'}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{background:'#008756'}} className='flex-row-flex-start'>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Manage Trainer
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Manage Trainer'/>
                    </Grid>
                    <Grid item xs={12} className={matches?'flex-column-reverse':'flex-row-space-between'}>
                        <Box>
                            <TextField label = 'Search trainer' value = {searchVal} onChange = {handleSearch} sx={{mb:1}} fullWidth/>
                        </Box>
                        <Box sx={{display:'flex',gap:1,justifyContent:matches?'center':'auto'}}>
                        <Tooltip title="Add new trainer">
                            <IconButton color='success' onClick={handleDialogOpen} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}}>
                            <AddOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reload trainer data">
                            <IconButton color='primary' onClick={handleReload} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}}>
                            <ReplayIcon />
                            </IconButton>
                        </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            Name
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Academic Qualification
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Professional Affiliation
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Trainings Attended
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Professional Experience
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Technical Field of Expertise
                                        </StyledTableCell>
                                        <StyledTableCell sx={{minWidth:120}}>
                                            Action
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        filterData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                        <TableRow key = {key}>
                                                <StyledTableCell>
                                                    {
                                                        row.is_internal
                                                        ?
                                                        <>
                                                        {row.lname}, {row.fname}
                                                        </>
                                                        :
                                                        row.company_name
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {formatAcadQ(row)}  
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {formatProfAff(row)}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {formatTTrainings(row)}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {formatProfExp(row)}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {formatTechExpertise(row)}
                                                </StyledTableCell>
                                                <StyledTableCell >
                                                <Box sx={{display:'flex',gap:1}}>
                                                
                                                <Tooltip title='Edit Trainer Info'><IconButton color='success' onClick = {()=>updateAction(row)} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}}><EditIcon/></IconButton></Tooltip>
                                                <Tooltip title='Delete Trainer'><IconButton color='error' onClick = {()=>deleteAction(row)} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}}><DeleteOutlineOutlinedIcon/></IconButton></Tooltip>
                                                </Box>

                                                </StyledTableCell>
                                            </TableRow>  
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        </Paper>
                        {/* <DataTable
                            data = {data}
                            columns = {columns}
                            pagination
                        /> */}
                    </Grid>
                </Grid>
                <Dialog
                    fullScreen
                    sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}
                    open={openDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Adding Trainer
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:4}}>
                        <Add close= {handleCloseDialog} setData = {setData} setData1 = {setData1} metaTagsData = {metaTagsData} courseData = {courseData}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}
                    open={openUpdateDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseUpdateDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Update Trainer
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseUpdateDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:4}}>
                        <Update close= {handleCloseUpdateDialog} setData = {setData} metaTagsData = {metaTagsData} data = {selectedUpdateData} setSelectedUpdateData = {setSelectedUpdateData}/>
                    </Box>

                </Dialog>
            </Box>
        }
        </>
    )
}