import { Box, Grid, TextField,Button,Modal,Typography,FormControl, Tooltip } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import React, { useEffect, useRef,useState } from 'react';
import { addCOCEarned, getCOCEarned, searchEmployeeCOC, updateCOCEarned } from '../COCRequest';
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
import { APIError, APISuccess, APIWarning, truncateToDecimals, truncateToDecimalsCOC } from '../../customstring/CustomString';
import { APILoading } from '../../apiresponse/APIResponse';

export default function UpdateCOC(props){
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
    const [dateEarned,setDateEarned] = React.useState('')
    const [searchModal,setSearchModal] = React.useState(false)
    const [searchData,setSearchData] = React.useState('')
    const [resultData,setResultData] = React.useState([])
    
    const [employeeInfo,setEmployeeInfo] = useState({
        fname:'',
        mname:'',
        lname:''
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
    
    const submitSearch = async (event)=>{
        event.preventDefault();
        var t_data = {
            search_val:searchData
        }
        const res = await getCOCEarned(t_data)
        if(res.data.data.length>0){
            setResultData(res.data.data)
        }else{
            APIError('No result found !')
        }
        console.log(res.data)
        console.log(t_data);
        
    }
    const selectRow = (data) =>{
        if(data.dtl){
            setEmpid(data.id)
            setSearchModal(false)
            setEmployeeInfo(data)
        }else{
            APIWarning('No history of COC earning found !')
        }
        
    }
    useEffect(()=>{
        if(employeeInfo.fname){
            let tot = 0;
            JSON.parse(employeeInfo.dtl).forEach(el=>{
                tot += el.earned - el.used;
            })
            setHours(truncateToDecimalsCOC(tot))
        }
    },[employeeInfo])
    const handleChangeRow = (item,name,val)=>{
        let temp = JSON.parse(employeeInfo.dtl)
        let temp2 = [...temp];
        let index = temp2.findIndex(el=>el.id === item.id)
        temp2[index][name] = val.target.value;
        setEmployeeInfo({
            ...employeeInfo,
            dtl:JSON.stringify(temp2)
        })
        console.log(index)

    }
    const submit = async () => {
        try{
            APILoading('info','Updating COC Balance','Please wait...')
            let t_data = {
                data:JSON.parse(employeeInfo.dtl)
            }
            console.log(t_data)
            const res = await updateCOCEarned(t_data)
            if(res.data.status === 200){
                APISuccess(res.data.message)
                setEmployeeInfo({
                    ...employeeInfo,
                    fname:'',
                    mname:'',
                    lname:'',
                    dtl:'[]',
                })
                setHours(0)
                setResultData([])
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
        console.log(employeeInfo)
    }
    return(
        <Grid container spacing={2} sx={{pt:1}}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                <TextField type = 'text' label='Employee Name' fullWidth value = {employeeInfo?.fname+' '+employeeInfo?.lname} inputProps={{readOnly:true}}/>

                <Tooltip title='Search Employee'>
                <Button variant='outlined'onClick={()=>setSearchModal(true)}><SearchOutlinedIcon /></Button>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{background:blue[700],p:1,color:'#fff'}}>Balance: {hours} hrs.</Typography>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',gap:2,flexDirection:'column',maxHeight:'60dvh',overflow:'auto'}}>
            {
                employeeInfo.fname
                ?
                JSON.parse(employeeInfo.dtl).map((item)=>{
                    return (
                        <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                        <TextField label='Month (Expiration)' size='small' value={moment(item.expiration).format('MMMM YYYY')} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}}/>
                        <TextField label='Earned' size='small' value={item.earned} onChange={(val)=>handleChangeRow(item,'earned',val)}/>
                        <TextField label='Used' color='error' size='small' value={item.used} onChange={(val)=>handleChangeRow(item,'used',val)}/>
                        </Box>

                    )
                })
                :
                null
            }
            </Grid>
            <Grid item xs={12}>
                <Button variant='outlined' sx={{float:'right'}} size='small' onClick = {submit}>SUBMIT</Button>
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
                                resultData.map((item,key)=>
                                <tr key = {item.id} onClick = {()=>selectRow(item)} style={{cursor:'pointer'}}>
                                    <td>{item.id}</td>
                                    <td>{item.fname +' '+item.lname}</td>
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
        </Grid>
    )
}