import React,{useEffect, useState} from 'react';
import { Grid,Box,Skeleton,Paper,Fade,Typography,Button, TextField,Autocomplete,FormGroup,FormControlLabel,Checkbox,Tooltip,Stack } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { blue, green, red, yellow } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Slide from '@mui/material/Slide';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getOffices,getOBRectificationDetail, deleteOBScheduleAPI, deleteOBInserted } from './DTRRequest';
import { ThemeProvider , createTheme } from '@mui/material/styles';
import moment from 'moment';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddOB from './Dialog/AddOB';
import { checkPermission } from '../permissionrequest/permissionRequest';
import {useNavigate}from "react-router-dom";
import { auditLogs } from '../auditlogs/Request';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const inputTheme = createTheme();

inputTheme.typography.input ={
    color:'purple'
}
const CUSTOMTHEME = createTheme({
    typography: {
        allVariants:{
            // fontSize: '.9rem',
            color:blue[800],
        },
        input:{
            background:'#000'
        }
    }
});
export default function DTRRectificationOBOFT(){
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [isLoading,setIsLoading] = useState(true);
    const [openDialog,setOpenDialog] = useState(false)
    const [officeData,setOfficeData] = useState([])
    const [data,setData] = useState([]);
    const [mainSelectedOffice,setMainSelectedOffice] = useState(null);
    const [mainSelectedYear,setMainSelectedYear] = useState('');
    const [mainSelectedEmp,setMainSelectedEmp] = useState({
        emp_no:'',
        created_at:'',
        date_from:'',
        date_to: '',
        dept_title: '',
        emp_fname:'',
        emp_lname: '',
        emp_mname: '',
        position_name: '',
        days_details:[],
        approved_by:'',
        approved_position:''
    });
    const [loadingSearch,setLoadingSearch] = useState(false)
    
    useEffect(()=>{
        var logs = {
            action:'ACCESS DTR RECTIFICATION OB - OFT',
            action_dtl:'ACCESS DTR RECTIFICATION OB - OFT MODULE',
            module:'DTR RECTIFICATION OB - OFT'
        }
        auditLogs(logs)
        checkPermission(31)
        .then((response)=>{
            if(response.data){
                getOffices()
                .then(res=>{
                    setOfficeData (res.data)
                    setIsLoading(false)
                }).catch(err=>{
                    console.log(err)
                })
                
            }else{
                navigate('/hris')
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])
    const handleClickOpenDialog = () => {
        setOpenDialog(true);
      };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const mainCustomStyles = {
        rows: {
            style: {
                // minHeight: '72px', // override the row height
                // '&:hover':{
                //     cursor:'pointer',
                // }
                '&:hover':{
                    cursor:'pointer'
                }
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
    const columns = [
        {
            name:'Employee Number',
            selector:row=>row.emp_no
        },
        {
            name:'Employee Name',
            selector:row=>row.emp_fname+' '+row.emp_mname.charAt(0)+'. '+row.emp_lname
        },
        {
            name:'Office/Designation',
            selector:row=>row.position_name
        },
        {
            name:'From',
            selector:row=>row.date_from
        },
        {
            name:'To',
            selector:row=>row.date_to
        },
        {
            name:'Action',
            selector:row=><Box sx={{p:1}}><Tooltip title='Delete'><IconButton size='small' color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>deleteAction(row)}><DeleteOutlineOutlinedIcon/></IconButton></Tooltip></Box>
        },
    ]
    const deleteAction = (row) =>{
        console.log(row)
        Swal.fire({
            icon:'warning',
            title: 'Confirm delete ?',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Deleting data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2 = {
                    key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                    ob_ot_no:row.ob_ot_no,
                }
                deleteOBScheduleAPI(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        var data3 = {
                            id:row.hris_ob_ot_id,
                            year:mainSelectedYear,
                            // dept_code:mainSelectedOffice.dept_code,
                            date_from:row.date_from,
                            date_to:row.date_to,
                            days_details:row.days_details,
                            dept_code:row.dept_code,
                            emp_no:row.emp_no
                        }
                        deleteOBInserted(data3)
                        .then(res=>{
                            if(res.data.status === 200){
                                setData(res.data.data)
                                Swal.fire({
                                    icon:'success',
                                    title:res.data.message,
                                    html:'Please click the process button to e-GAPS, to reflect the changes on DTR.'
                                })
                            }else{
                                Swal.fire({
                                    icon:'error',
                                    title:res.data.message
                                })
                            }
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
    const tableData = {
        data,
        columns
    }
    useEffect(()=>{
        setMainSelectedEmp({
            emp_no:'',
            created_at:'',
            date_from:'',
            date_to: '',
            dept_title: '',
            emp_fname:'',
            emp_lname: '',
            emp_mname: '',
            position_name: '',
            days_details:[],
            approved_by:'',
            approved_position:''
        })
    },[data])
    const submitSearch = (event)=>{
        event.preventDefault();
        if(mainSelectedOffice === null){
            toast.warning('Please select office name !', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined}
            )
        }else{
            setLoadingSearch(true)

            var data2 = {
                year:mainSelectedYear,
                dept_code:mainSelectedOffice.dept_code
            }
            // console.log(data2)
    
            // console.log(data2)
            getOBRectificationDetail(data2)
            .then(res=>{
                // console.log(res.data.length)
                setData(res.data)
                setLoadingSearch(false)
    
                if(res.data.length === 0){
                    toast.warning('No data found !', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                })
                }
    
            }).catch(err=>{
                setLoadingSearch(false)
                toast.error(err.message)
                console.log(err)
            })
        }
        
    }
    const mainRowSelect = (row)=>{
        setMainSelectedEmp(row)
    }
    return (
    <>
        {isLoading
            ?
                <Box sx={{margin:'5px 20px 20px 20px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Skeleton variant='rounded' height={60} animation='wave'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Skeleton variant='circular' height={40} width={40} animation='wave'/>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid item container spacing={1}>
                                <Grid item xs={5}>
                                    <Skeleton variant='rounded' height={50} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={5}>
                                    <Skeleton variant='rounded' height={50} animation='wave' sx={{borderRadius:'3px'}}/>

                                </Grid>
                                <Grid item xs={2}>
                                    <Skeleton variant='rounded' height={50} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid item container spacing={4}>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Skeleton variant='rounded' height={5} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant='rounded' height={'30vh'} animation='wave' sx={{borderRadius:'3px'}}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        
                    </Grid>
                </Box>
            :
            <Fade in={!isLoading}>
                <Box sx={{margin:'0 20px 20px 20px'}}>
                    <Grid container>
                        {/* <ToastContainer/> */}
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loadingSearch}
                            // onClick={handleClose}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <CircularProgress color="inherit" />
                            <Typography>Loading Data. Please wait...</Typography>
                            </Box>
                        </Backdrop>
                        <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                                <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                    <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                                    {/* <StickyNote2 fontSize='large'/> */}
                                    &nbsp;
                                    DTR Rectification - OB / OFT
                                </Typography>

                                </Box>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mb:1}}>
                            <IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick = {handleClickOpenDialog}><AddOutlinedIcon/> </IconButton>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Box sx={{width:matches?'100%':'99%'}}>
                                <form onSubmit={submitSearch}>

                                <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-around'}}>

                                <TextField label='Year' fullWidth required value ={mainSelectedYear} onChange={(value)=>setMainSelectedYear(value.target.value)}/> &nbsp;
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-dept"
                                    options={officeData}
                                    sx={{mt:matches?1:0}}
                                    // sx={{minWidth:matches?'100%':300}}
                                    value = {mainSelectedOffice}
                                    getOptionLabel={(option) => option.dept_title}
                                    onChange={(event,newValue) => {
                                        setMainSelectedOffice(newValue);
                                        }}
                                    renderInput={(params) => <TextField {...params} label="Office" required/>}
                                />
                                &nbsp;
                                <Button variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button>
                                </Box>
                                </form>
                                <DataTableExtensions
                                    {...tableData}
                                    export={false}
                                    print={false}
                                >
                                <DataTable
                                    data={data}
                                    columns={columns}
                                    highlightOnHover

                                    pagination
                                    paginationPerPage={5}
                                    paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                    paginationComponentOptions={{
                                        rowsPerPageText: 'Records per page:',
                                        rangeSeparatorText: 'out of',
                                    }}
                                    customStyles={mainCustomStyles}
                                    fixedHeader
                                    fixedHeaderScrollHeight="300px"
                                    onRowClicked={mainRowSelect}
                                />
                                </DataTableExtensions>
                                
                            </Box>
                            </Grid>
                            <ThemeProvider theme={CUSTOMTHEME}>
                                <Grid item xs={12} md={6} lg={6} sx={{p:1,border:'solid 1px #c9c9c9',borderRadius:'5px'}}>
                                    <Grid container spacing={1} sx={{width:'100%'}}>
                                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                                            <TextField label='Employee Number' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.emp_no} InputProps={{readOnly: true}} sx={{fontSize:'.8rem'}} size='small' color='info'/>
                                            &nbsp;
                                            <TextField label='Employee Name' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.emp_lname ? mainSelectedEmp.emp_lname +', '+mainSelectedEmp.emp_fname+' '+mainSelectedEmp.emp_mname.charAt(0)+'.':''} InputProps={{readOnly: true}} size='small'/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label='Office' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.dept_title} InputProps={{readOnly: true}} size='small'/>
                                        </Grid>
                                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                                            <TextField label='Position' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.position_name} InputProps={{readOnly: true}} size='small'/>
                                            &nbsp;
                                            <TextField label='Date Filed' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.created_at !== '' ? moment(mainSelectedEmp.created_at).format('MMMM DD,YYYY'):''} InputProps={{readOnly: true}} size='small'/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label='Covered Period' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.date_from ? moment(mainSelectedEmp.date_from).format('MM-DD-YYYY')+' - '+moment(mainSelectedEmp.date_to).format('MM-DD-YYYY') :''}InputProps={{readOnly: true}} size='small'/>

                                        </Grid>
                                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                                            <TextField label='Approved By' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.approved_by} InputProps={{readOnly: true}} size='small'/>
                                            &nbsp;
                                            <TextField label='Position' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={mainSelectedEmp.approved_position} InputProps={{readOnly: true}} size='small'/>
                                        </Grid>
                                        
                                        <Grid item xs={12}>
                                        <Typography sx={{color:'black',textAlign:'center',fontWeight:'bold'}}>Daily O.B. schedule detail </Typography>

                                        <Box sx={{mt:1,maxHeight:'40vh',overflow:'scroll'}}>
                                        <table className='table table-bordered table-striped'>
                                            <thead style={{textAlign:'center',fontSize:'.8rem',verticalAlign:'middle',position:'sticky',top:0,background:'white'}}>
                                                <tr>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Day</th>
                                                    <th scope="col">AM <br/>In</th>
                                                    <th scope="col">AM <br/>Out</th>
                                                    <th scope="col">PM <br/>In</th>
                                                    <th scope="col">PM <br/>Out</th>
                                                    <th scope="col">Break <br/> (hrs.)</th>
                                                    <th scope="col">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    mainSelectedEmp.days_details.length !==0
                                                    ?
                                                    JSON.parse(mainSelectedEmp.days_details).map((data,index)=>
                                                    <tr key ={index}>
                                                        <td>{data.date}</td>
                                                        <td>{moment(data.date).format('dddd')}</td>
                                                        <td>{data.time_in}</td>
                                                        <td>{data.break_out}</td>
                                                        <td>{data.break_in}</td>
                                                        <td>{data.time_out}</td>
                                                        <td>1.00</td>
                                                        <td>{data.remarks}</td>
                                                    </tr>
                                                    )
                                                    :
                                                    ''
                                                }
                                            </tbody>
                                        </table>   
                                    </Box>
                                    </Grid>

                                </Grid>
                            </Grid>
                            </ThemeProvider>
                    </Grid>
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
                            Adding OB / OFT Rectification
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                            Close
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <AddOB/>
                    </Dialog>
                </Box>
            </Fade>
        }
    </>
    )
}