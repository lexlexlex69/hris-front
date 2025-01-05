import { Box, Grid, TextField,Button,Modal,Typography,FormControl, Tooltip } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import React, { useEffect, useRef,useState } from 'react';
import { addCOCEarned, searchEmployeeCOC } from '../COCRequest';
import Swal from 'sweetalert2';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PrintIcon from '@mui/icons-material/Print';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalculateIcon from '@mui/icons-material/Calculate';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { searchEmployee } from '../COCRequest';
import { PrintForm } from '../PrintForm';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { toast } from 'react-toastify';
import {orange,blue} from '@mui/material/colors';
import ComputeEarned from '../ComputeEarned';

export default function AddCOCForm(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [monthData,setMonthData] = useState([])
    const [selectedMonth,setSelectedMonth] = useState('')
    const [currYear,setCurryear] = useState('')
    useEffect(()=>{
        var date = new Date();
        var t_year = moment(date,'YYYY-MM-DD').format('YYYY');
        var t_month = moment(moment(date,'YYYY-MM-DD').format('YYYY-MM-DD'),'YYYY-MM-DD').subtract(1,'months').date(1)

        setDateEarned(t_month)
    },[])
    const [empid,setEmpid] = React.useState('')
    const [hours,setHours] = React.useState(0)
    const [usedHours,setUsedHours] = React.useState(0)
    const [dateEarned,setDateEarned] = React.useState('')
    const [searchModal,setSearchModal] = React.useState(false)
    const [computeModal,setComputeModal] = React.useState(false)
    const [searchData,setSearchData] = React.useState('')
    const [resultData,setResultData] = React.useState([])
    const [disable,setDisable] = React.useState(false)
    const [earnedInfo,setEarnedInfo] = useState({
        'beginning_balance':'',
        'month_name':'',
        'year':'',
        'remaining_coc':'',
        'date_of_cto':'',
        'earned':'',
        'period':'',
        'used_coc':''
    })
    const [employeeInfo,setEmployeeInfo] = useState({
        data:{
            fname:'',
            mname:'',
            lname:''
        },
        ledger:[],
        balance:0
    })

    const searchModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    const computeModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    const submit = () => {
        Swal.fire({
            icon:'question',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Adding Data',
                    html:'Please wait..'

                })
                Swal.showLoading();
                var expiration = moment(dateEarned).add(1,'y');
                var t_expiration = moment(expiration).endOf('month')
                console.log(moment(t_expiration).format('YYYY-MM-DD'))
                var t_info = {...employeeInfo}
                t_info.ledger.push(earnedInfo)
                var t_data = {
                    coc_emp_id:empid,
                    coc_year:earnedInfo.year,
                    coc_earned:earnedInfo.beginning_balance,
                    coc_remaining_coc:earnedInfo.remaining_coc,
                    coc_month_name:moment(dateEarned).format('MMMM').toUpperCase(),
                    date_earned:moment(dateEarned).format('YYYY-MM-DD'),
                    coc_expiration:customExpiration?moment(dateExpiration).endOf('month').format('YYYY-MM-DD'):moment(t_expiration).format('YYYY-MM-DD'),
                    data:t_info.ledger,
                    coc_name:employeeInfo.data.fname+' '+(employeeInfo.data.mname?employeeInfo.data.mname.charAt(0)+'. ':'')+employeeInfo.data.lname,
                    coc_position:employeeInfo.data.position_name,
                    used:usedHours
                }
                console.log(t_data)
                addCOCEarned(t_data)
                .then(respo=>{
                    const data =respo.data;
                    if(data.status === 200){
                        Swal.fire({
                            icon:'success',
                            title:data.message
                        })
                        // props.insertNewData(data.data)
                        props.close()
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:data.message
                        })
                    }
                }).catch(err=>{
                    Swal.close();
                    console.log(err)
                })
            }
          })
        
    }
    const submitSearch = (event)=>{
        event.preventDefault();
        var t_data = {
            search_val:searchData,
            month_name:(moment(dateEarned).format('MMMM')).toUpperCase(),
            year:moment(dateEarned).format('YYYY'),
        }
        searchEmployeeCOC(t_data)
        .then(respo=>{
            const data = respo.data
            console.log(data)
            if(data.status ===500){
                toast.error('Employee is either not found or already earned!')            
            }else{
                setResultData(data)
            }

            // console.log(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const selectRow = (data) =>{
        console.log(data)
        setEmpid(data.data.id)
        setSearchModal(false)
        setEmployeeInfo(data)
        if(parseInt(data.balance)>=120){
            setDisable(true)
        }else{
            setDisable(false)
        }
    }
    const handleSetDateEarned = (value)=>{
        setDateEarned(value.target.value)
        
    }
    const printRef = useRef();
    const reactToPrintPayCOC  = useReactToPrint({
        content: () => printRef.current,
        documentTitle:'COC'
    });
    const [printCount,setPrintCount] = useState(0)
    const handlePrint = ()=>{
        if(employeeInfo.data.fname.length === 0 || hours.length === 0 || dateEarned.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please input value on required fields.'
            })
        }else{
            reactToPrintPayCOC();
        }
    }
    const handleCheckHours = (value)=>{
        if(value.target.value >40){
            toast.warning('Maximum of 40 hrs can be earned per month');
            setHours(40)
        }else{
            var t_total = parseFloat(value.target.value)+parseFloat(employeeInfo.balance)
            if(t_total>120){
                var t_set = 120-parseFloat(employeeInfo.balance)
                toast.warning('Maximum of 120 hrs can be earned');
                setHours(t_set)
            }else{
                var remaining_coc;
                if(employeeInfo.ledger.length !==0){
                    remaining_coc = parseFloat(employeeInfo.balance)+parseFloat(hours);
                }else{
                    remaining_coc = hours;
                }
                var temp  = {
                    'beginning_balance':hours,
                    'month_name':moment(dateEarned).format('MMMM'),
                    'year':moment(dateEarned).format('YYYY'),
                    'remaining_coc':remaining_coc,
                    'date_of_cto':'',
                    'earned':'',
                    'period':'',
                    'used_coc':''
                }
                setEarnedInfo(temp)
                setHours(value.target.value)
            }
        }
    }
    const [customExpiration,setCustomExpiration] = useState(false);
    const [dateExpiration,setDateExpiration] = useState('');
    const handleCustomExpiration = ()=>{
        setCustomExpiration(!customExpiration)
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                <Typography sx={{background: blue[900],padding: '5px 10px', borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px',color: '#fff'}}><CalendarMonthIcon/>&nbsp;{moment(dateEarned).format('MMMM')} {moment(dateEarned).format('YYYY')}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                <TextField type = 'text' label='Employee Name' fullWidth value = {employeeInfo.data.fname+' '+employeeInfo.data.lname} inputProps={{readOnly:true}}/>

                <Tooltip title='Search Employee'>
                <Button variant='outlined'onClick={()=>setSearchModal(true)}><SearchOutlinedIcon /></Button>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <TextField type = 'text' label='COC Balance' fullWidth value = {(employeeInfo.balance).toFixed(3)} inputProps={{readOnly:true}}/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                <TextField type = 'number' label='No. of hours earned' fullWidth value = {hours} onChange = {(value)=>setHours(value.target.value)} required inputProps={{min:'1',max:'40'}} onBlur={handleCheckHours}/>
                {/* <Button variant='outlined' onClick={()=>setComputeModal(true)}>
                <CalculateIcon/>
                </Button> */}
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                <TextField type = 'number' label='Used' fullWidth value = {usedHours} onChange = {(value)=>setUsedHours(value.target.value)} required inputProps={{min:'1'}}/>
            </Grid>
            <Grid item xs={12}>
                <TextField type = 'month' label='Month' fullWidth InputLabelProps={{shrink:true}} value = {dateEarned} onChange = {handleSetDateEarned} required/>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel control={<Checkbox checked={customExpiration} onChange={handleCustomExpiration}/>} label="Custom Expiration" />
                {
                    customExpiration
                    ?
                    <TextField type = 'month' label='Month Expiration' fullWidth InputLabelProps={{shrink:true}} value = {dateExpiration} onChange = {(val)=>setDateExpiration(val.target.value)} required/>
                    :
                    null
                }
            </Grid>
            {/* <Grid item xs={12}>
                <Tooltip title='Print COC form'><span><Button fullWidth variant='outlined' onClick={handlePrint} disabled={disable}><PrintIcon/></Button></span></Tooltip>
            
            </Grid> */}
            <Grid item xs={12}>
                <Button variant='outlined' sx={{float:'right'}} size='small' onClick = {submit} disabled={disable || hours?false:true}>SUBMIT</Button>
            </Grid>

            <Modal
                open={searchModal}
                onClose={()=> setSearchModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={searchModalStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setSearchModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Searching Employee
                    </Typography>
                    <Box sx={{m:4}}>
                    <form onSubmit={submitSearch}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField label='e.g. lastname,firstname' fullWidth required value = {searchData} onChange = {(value)=>setSearchData(value.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='outlined' size='small' sx={{float:'right'}}type = 'submit'>Search</Button>
                            </Grid>
                        </Grid>
                    </form>
                    {resultData.length !==0
                    ?
                    <Box sx={{mt:2}}>
                    <small style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',fontSize:'12px'}}><em>* click row to select <strong>Employee ID</strong></em></small>
                    <Box sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                    <table className='table table-bordered table-hover' style={{marginTop:'5px'}}>
                        <thead style={{position:'sticky',top:'-3px',background:'#fff'}}>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                resultData.map((data,key)=>
                                <tr key = {key} onClick = {()=>selectRow(data)} style={{cursor:'pointer'}}>
                                    <td>{data.data.id}</td>
                                    <td>{data.data.fname +' '+data.data.lname}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </Box>
                    </Box>
                    :
                    ''
                    }
                    </Box>



                </Box>
            </Modal>
            <Modal
                open={computeModal}
                onClose={()=> setComputeModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={computeModalStyle}>
                    <ComputeEarned/>
                </Box>
            </Modal>
            <div style={{display:'none'}}>
                <PrintForm ref={printRef} employeeInfo={employeeInfo} dateEarned={dateEarned} hours ={hours} earnedInfo = {earnedInfo}/>
            </div>
        </Grid>
    )
}