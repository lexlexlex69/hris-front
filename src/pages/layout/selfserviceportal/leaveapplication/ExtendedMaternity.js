import { Grid, Typography,Stack,Box,Skeleton,Fade, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip,Modal,InputLabel,MenuItem ,FormControl,Select,Backdrop,CircularProgress, TextField ,Button,Dialog,AppBar,Toolbar ,Slide,Paper   } from '@mui/material';
import React,{react, useEffect, useState} from 'react';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { getFiledExtendedMaternityLeave, getFilteredFiledExtendedMaternityLeave, getOutsiderBeneficiaryData } from './LeaveApplicationRequest';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { green,red,blue } from '@mui/material/colors';

//icons
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PrintIcon from '@mui/icons-material/Print';
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import RefreshIcon from '@mui/icons-material/Refresh';

import ExtendedMaternityLeaveFillout from './Modal/ExtendedMaternityLeaveFillout';
import AllocationOfMaternityLeaveForm from './AllocationOfMaternityLeaveForm';
import { toast } from 'react-toastify';
import { VerifyAllocationOfMaternityLeaveForm } from './VerifyAllocationOfMaternityLeaveForm';
import EarnMaternityCreditsOutsideBenefactorDialog from './Dialog/EarnMaternityCreditsOutsidedBenefactorDialog';
import moment from 'moment';
import Swal from 'sweetalert2';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ExtendedMaternity(){
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    /**
     * Modal style
     */
     const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 400:900,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        p: 2,
      };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[500],
        color: theme.palette.common.white,
        fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        },
    }));
    const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[500],
        color: theme.palette.common.white,
        fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        },
    }));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    const [data1,setData1] = useState([])
    const [outsiderData,setOutsiderData] = useState([])
    const [openAllocation,setOpenAllocation] = useState(false)
    const [openShowAllocationForm,setOpenShowAllocationForm] = useState(false)
    useEffect(()=>{
        checkPermission(49)
        .then((response)=>{
            setIsLoading(false)
            if(response.data){
                getFiledExtendedMaternityLeave()
                .then(res=>{
                    setData(res.data)
                    setData1(res.data)
                    return getOutsiderBeneficiaryData()
                })
                .then(res=>{
                    console.log(res.data)
                    setOutsiderData(res.data)
                    setIsLoading(false)
                })
                .catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const [employeeInfo,setEmployeeInfo] = useState([])
    const [selectedAllocationForm,setSelectedAllocationForm] = useState([])
    const [openVerifyAllocationForm,setOpenVerifyAllocationForm] = useState(false)
    const handleAddBeneficiary = (data)=>{
        setEmployeeInfo(data)
        setOpenAllocation(true)
    }
    const handleVerifyBeneficiary = (data)=>{
        console.log(data)
        setSelectedAllocationForm(data)
        setOpenVerifyAllocationForm(true)
    }
    const handleShowAllocationForm = (data,type)=>{
        console.log(data)

        if(type === 1){
            var temp = {...data}
            var name = temp.benefactor_name.split(',')
            temp.position_name = data.benefactor_position;
            temp.lname = name[0]?name[0].trim().toUpperCase():'';
            temp.fname = name[1]?name[1].trim().toUpperCase():'';
            temp.mname = name[2]?name[2].trim().toUpperCase():'';
            temp.paddress = data.benefactor_address
            temp.contact_details = data.benefit_contact_details

            setSelectedAllocationForm(temp)
            setOpenShowAllocationForm(true)
        }else{

            setSelectedAllocationForm(data)
            setOpenShowAllocationForm(true)
        }
    }
    const [filter, setFilter] = React.useState('');
    const [loadingFilter, setLoadingFilter] = React.useState(false);
    const handleChangeFilter = (event) => {
        var data2 = {
            filter:event.target.value
        }
        setLoadingFilter(true)
        getFilteredFiledExtendedMaternityLeave(data2)
        .then(res=>{
            // console.log(res.data)
            setData(res.data)
            setData1(res.data)
            setLoadingFilter(false)
            if(res.data.length === 0){
                toast.error('No data found.')
            }

        }).catch(err=>{
            console.log(err)
        })
        setFilter(event.target.value);
    };
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setSearchValue(value.target.value)
        let new_arr = data1.filter((el)=>{
            return el.fname.includes(value.target.value.toUpperCase()) ||  el.lname.includes(value.target.value.toUpperCase())
        })
        setData(new_arr)
    }
    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const refreshData = async ()=>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading()
        await getFiledExtendedMaternityLeave()
        .then(res=>{
            setData(res.data)
            setData1(res.data)
            return getOutsiderBeneficiaryData()
        })
        .then(res=>{
            setOutsiderData(res.data)
            Swal.close()
        })
        .catch(err=>{
            console.log(err)
            Swal.close()

        })
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading/>
                :
                <Fade in>
                    <Grid container>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loadingFilter}
                            // onClick={loadingFilter}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <Typography>Loading filter</Typography>
                                <CircularProgress color="inherit" />

                            </Box>
                        </Backdrop>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Extended Maternity Leave'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                            <Tooltip title ='Add Maternity Credits From Outsider Benefactor'><IconButton className='custom-iconbutton' color='success' onClick={handleClickOpenDialog}><AddIcon/></IconButton></Tooltip>
                            &nbsp;
                            {/* <Tooltip title ='Add Maternity Credits'><IconButton className='custom-iconbutton' color='primary' onClick={handleClickOpenDialog}><GroupAddIcon/></IconButton></Tooltip> */}
                            <Tooltip title ='Reload Data'><IconButton className='custom-iconbutton' color='primary' onClick={refreshData}><RefreshIcon/></IconButton></Tooltip>
                        </Grid>
                        {/* <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',mt:2,mb:1}}>
                            <TextField label='Search' value ={searchValue} onChange = {handleSearch}/>
                            <FormControl sx={{width:200}}>
                                <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filter}
                                label="Filter"
                                onChange={handleChangeFilter}
                                >
                                <MenuItem value={2}>Same Agency</MenuItem>
                                <MenuItem value={3}>Different Agency</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={12}>
                            <Typography sx={{background:blue[900],color:'#fff',padding:'5px 10px'}}>
                                Internal Benefactor
                            </Typography>
                            <Paper>
                            <TableContainer>
                                {
                                    filter === 2
                                    ?
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    Benefactor
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Beneficiary
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Allocated Days
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Actions
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.length === 0
                                                ?
                                                <TableRow>
                                                    <TableCell align='center' colSpan={4}>
                                                        No data...
                                                    </TableCell>
                                                </TableRow>
                                                :
                                                data.map((row,index)=>
                                                    <TableRow key={index} hover>
                                                        <StyledTableCell>
                                                            {row.fname} {row.mname?row.mname.charAt(0)+'.':''} {row.lname}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.benefit_fullname}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.allocation_number_days}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {
                                                            row.same_agency
                                                            ?
                                                            <Tooltip title='Review Applied Application'><IconButton onClick={()=>handleAddBeneficiary(row)}><PersonSearchIcon/></IconButton></Tooltip> 
                                                            :
                                                                row.is_added
                                                                ?
                                                                <Tooltip title='Show Allocation Form'><IconButton color='primary' onClick={()=>handleShowAllocationForm(row)}><ArticleIcon/></IconButton></Tooltip>
                                                                :
                                                                <Tooltip title='Add Beneficiary Info'><IconButton onClick={()=>handleAddBeneficiary(row)}><PersonAddAltIcon/></IconButton></Tooltip>
                                                            }
                                                        
                                                        
                                                        </StyledTableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                    :
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    Name
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Relationship
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Allocated Days
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Date Filed
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Actions
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.length === 0
                                                ?
                                                <TableRow>
                                                    <TableCell align='center' colSpan={4}>
                                                        No data...
                                                    </TableCell>
                                                </TableRow>
                                                :
                                                data.map((row,index)=>
                                                    <TableRow key={index} hover>
                                                        <StyledTableCell>
                                                            {row.fname} {row.mname?row.mname.charAt(0)+'.':''} {row.lname}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.benefit_relationship}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.allocation_number_days}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {moment(row.created_at).format('MMMM DD, YYYY')}
                                                        </StyledTableCell>
                                                        {
                                                            row.m_a_status === 'APPROVED'
                                                            ?
                                                            <StyledTableCell>
                                                                <Tooltip title='Show Allocation Form'><IconButton color='primary' onClick={()=>handleShowAllocationForm(row)}><ArticleIcon/></IconButton></Tooltip>
                                                            </StyledTableCell>
                                                            :

                                                            <StyledTableCell>
                                                            {
                                                            row.same_agency
                                                            ?
                                                                <Tooltip title='Review Beneficiary Info'><IconButton onClick={()=>handleVerifyBeneficiary(row)}><PersonSearchIcon/></IconButton></Tooltip> 
                                                                :
                                                                    row.is_added
                                                                    ?
                                                                    <Tooltip title='Show Allocation Form'><IconButton color='primary' onClick={()=>handleShowAllocationForm(row)}><ArticleIcon/></IconButton></Tooltip>
                                                                    :
                                                                    <Tooltip title='Add Beneficiary Info'><IconButton onClick={()=>handleAddBeneficiary(row)}><PersonAddAltIcon/></IconButton></Tooltip>
                                                                }
                                                            
                                                            
                                                            </StyledTableCell>
                                                        }
                                                        
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                }
                                
                            </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                            <Typography sx={{background:blue[900],color:'#fff',padding:'5px 10px'}}>
                                External Benefactor
                            </Typography>
                            <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell2>
                                                Benefactor
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Beneficiary
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Relationship
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Allocated Days
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Date Added
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Added By
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Action
                                            </StyledTableCell2>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            outsiderData.map((row,key)=>
                                                <TableRow key={key}>
                                                    <StyledTableCell2>
                                                        {row.benefactor_name}
                                                    </StyledTableCell2>
                                                    <StyledTableCell2>
                                                        {row.benefit_fullname}
                                                    </StyledTableCell2>
                                                    <StyledTableCell2>
                                                        {row.benefit_relationship}
                                                    </StyledTableCell2>
                                                    <StyledTableCell2>
                                                        {row.allocation_number_days}
                                                    </StyledTableCell2>
                                                    <StyledTableCell2>
                                                        {moment(row.created_at).format('MMMM DD, YYYY')}
                                                    </StyledTableCell2>
                                                    <StyledTableCell2>
                                                        {row.added_by}
                                                    </StyledTableCell2>
                                                    <StyledTableCell>
                                                        <Tooltip title='Show Allocation Form'><IconButton color='primary' onClick={()=>handleShowAllocationForm(row,1)}><ArticleIcon/></IconButton></Tooltip>
                                                    </StyledTableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Grid>
                        <Modal
                            open={openAllocation}
                            onClose={()=> setOpenAllocation(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                            <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                                NOTICE OF ALLOCATION OF MATERNITY LEAVE FORM
                            </Typography>
                            <Box sx ={{maxHeight:'70vh',overflowY:'scroll',padding:'5px'}}>
                                <Grid container spacing={2}>
                                    <ExtendedMaternityLeaveFillout onClose = {()=> setOpenAllocation(false)} employeeInfo = {employeeInfo} setData = {setData}/>
                                </Grid>
                            </Box>
                            </Box>
                        </Modal>
                        <Modal
                            open={openShowAllocationForm}
                            onClose={()=> setOpenShowAllocationForm(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                            {/* <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                                NOTICE OF ALLOCATION OF MATERNITY LEAVE FORM
                            </Typography> */}
                            <Box sx ={{maxHeight:'70vh',overflowY:'scroll',padding:'5px'}}>
                                <Grid container spacing={2}>
                                    <AllocationOfMaternityLeaveForm onClose = {()=> setOpenShowAllocationForm(false)} info = {selectedAllocationForm} />
                                </Grid>
                            </Box>
                            </Box>
                        </Modal>
                        <Modal
                            open={openVerifyAllocationForm}
                            onClose={()=> setOpenVerifyAllocationForm(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                            {/* <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                                NOTICE OF ALLOCATION OF MATERNITY LEAVE FORM
                            </Typography> */}
                            <Box sx ={{maxHeight:'70vh',overflowY:'scroll',padding:'5px'}}>
                                <Grid container spacing={2}>
                                    <VerifyAllocationOfMaternityLeaveForm close = {()=> setOpenVerifyAllocationForm(false)} info = {selectedAllocationForm} setData={setData} />

                                </Grid>
                            </Box>
                            </Box>
                        </Modal>
                        <Dialog
                            fullScreen
                            open={openDialog}
                            onClose={handleCloseDialog}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'relative' }}>
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
                                Earning Maternity Credits from Outside Agency Benefactor
                                </Typography>
                                <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                                close
                                </Button>
                            </Toolbar>
                            </AppBar>
                            <EarnMaternityCreditsOutsideBenefactorDialog close={handleCloseDialog} setOutsiderData={setOutsiderData}/>
                        </Dialog>
                    </Grid>
                </Fade>
            }
        </Box>
        
    )
}