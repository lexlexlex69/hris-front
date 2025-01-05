import { Box, Typography,Fade,Grid, TextField, Paper, TableContainer, TableHead, TableRow, TableCell, Table, TableBody, InputAdornment, Tooltip, IconButton, Modal, Button, Checkbox } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DashboardLoading from "../../../../loader/DashboardLoading";
import { auditLogs } from "../../../../auditlogs/Request";
import { checkPermission } from "../../../../permissionrequest/permissionRequest";
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ModuleHeaderText from "../../../../moduleheadertext/ModuleHeaderText";
import { getDTREmplist, getMultipleEmpDTR, manualProcessDTR } from ".././ViewEmpDTRRequest";
import {blue} from '@mui/material/colors';
//Icons
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';
import { api_url } from "../../../../../../request/APIRequestURL";
import Swal from "sweetalert2";
import { getDTR, getEmpDTR, getEmployeeInfo, getEmployeeInfoDTR } from "../../DTRRequest";
import DTRForm from "../../DTRForm";
import moment from "moment";
import { toast } from "react-toastify";
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import DTRFormPrint from "../../DTRFormPrint";
import { formatDatePeriod, formatExtName, formatMiddlename } from "../../../../customstring/CustomString";
import LargeModal from "../../../../custommodal/LargeModal";
import MediumModal from "../../../../custommodal/MediumModal";
import '../../DTR.css';
import { APILoading } from "../../../../apiresponse/APIResponse";

function Version1(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()

    const [isLoading,setIsLoading] = useState(true)
    const [officeName,setOfficeName] = useState('')
    const [emplistData,setEmplistData] = useState([])
    const [searchVal,setSearchVal] = useState('');
    const [dateFrom,setDateFrom] = useState('');
    const [dateTo,setDateTo] = useState('');
    const [employeeInfo,setEmployeeInfo] = React.useState([])
    const [signatory,setSignatory] = React.useState([])
    const [officeHead,setOfficeHead] = useState('')
    const [alreadyAppliedRectification,setAlreadyAppliedRectification] = React.useState([]);
    const [officeHeadPos,setOfficeHeadPos] = useState({
        head_name:null,
        head_pos:null
    });
    const [selectedEmp,setSelectedEmp] = useState([])
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
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [footerFName,setFooterFName] = useState('');
    const [footerMName,setFooterMName] = useState('');
    const [footerLName,setFooterLName] = useState('');
    const [footerExtName,setFooterExtName] = useState('');
    const [timeStamp,setTimeStamp] = useState(new Date());
    const [defSignatory,setDefSignatory] = useState([])
    useEffect(()=>{
        var logs = {
            action:'ACCESS VIEW EMPLOYEE DTR',
            action_dtl:'ACCESS VIEW EMPLOYEE DTR MODULE',
            module:'DTR'
        }
        auditLogs(logs)
        checkPermission(67)
        .then((response)=>{
            if(!response.data){
                var logs = {
                    action:'ACCESS VIEW EMPLOYEE DTR',
                    action_dtl:'PERMISSION DENIED TO ACCESS VIEW EMPLOYEE DTR MODULE',
                    module:'DTR'
                }
                auditLogs(logs)
                navigate(`/${process.env.REACT_APP_HOST}`)
            }else{
                getEmployeeInfoDTR()
                .then(response=>{
                    const data = response.data
                    setFooterFName(data.info.fname)
                    setFooterMName(data.info.mname)
                    setFooterLName(data.info.lname)
                    setFooterExtName(data.info.extname)
                    setSignatory(data.signatory)
                    setOfficeHead(data.office_assign_info)
                    setEmployeeInfo(data.info)
                    setDefSignatory(data.def_signatory)
                    /**
                    Get all employee list
                    */
                    getDTREmplist()
                    .then(res=>{
                        if(res.data.length>0){
                            setOfficeName(res.data[0].short_name)
                        }
                        res.data.forEach(el=>{
                            el.selected = false
                        })
                        setEmplistData(res.data)
                        setIsLoading(false)
                    })
                }).catch(error=>{
                    console.log(error)
                })
                
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const filterData = emplistData.filter((el)=>{
        return el.fname.toUpperCase().includes(searchVal.toUpperCase())|| el.lname.toUpperCase().includes(searchVal.toUpperCase())
    })
    const [totalUndertimeHours,settotalUndertimeHours] = React.useState(0);
    const [totalUndertimeMinutes,settotalUndertimeMinutes] = React.useState(0);
    const [totalLateHours,settotalLateHours] = React.useState(0);
    const [totalLateMinutes,settotalLateMinutes] = React.useState(0);
    const [dtrdata,setdtrdata] = React.useState([])
    const printDTR = useRef();
    const printMultipleDTR = useRef();
    
    const [period, setPeriod] = React.useState('');
    const [rawLogs,setRawLogs] = useState([]);
    
    const handleViewDTR = (row)=>{
        console.log(row)
        if(!dateFrom || !dateTo){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please complete date period'
            })
        }else{
            setSelectedEmp(row)
            var t_data = {
                from:dateFrom,
                to:dateTo,
                emp_id:row.emp_no,
                employee_id:row.id,
                api_url:api_url,
                type:'viewing',
                name:row.fname+' '+row.mname+' '+row.lname
            }
            Swal.fire({
                icon:'info',
                title:'Retrieving DTR records',
                html:'Please wait...',
                showConfirmButton:false
            })
            Swal.showLoading()
            getDTR(t_data)
            .then(response=>{
                const result1 = response.data
                var days = [];
                setAlreadyAppliedRectification(result1.applied_days)
                setEmployeeInfo(result1.info)

                getEmpDTR(t_data)
                .then(respo=>{
                    const result = respo.data.data
                    console.log(result)
                    if(result.code === '301'){
                        Swal.fire({
                            icon:'error',
                            title:result.message
                        })
                    }else{
                        var undertime=0;
                        var late=0;
                        var work_hours;
                        var work_sched;
                        // setOfficeHeadPos(result.signatory)
                        setOfficeHeadPos(result.signatory?.head_name?result.signatory:signatory)


                        if(result.work_dtl.work_hrs.length ===0){
                            work_hours = ['8am-5pm']
                        }else{
                            work_hours = result.work_dtl.work_hrs
                        }
                        if(result.work_dtl.work_sched ===''){
                            work_sched = 'Monday-Friday'
                        }else{
                            /**
                            Manipulate days
                                */
                            /**
                            Store to array
                            */
                            var t_arr_sched = result.work_dtl.work_sched.split(';')
                            /**
                            Identify first the day of first day of the month
                                */
                            var t_range = moment(moment(dateFrom).startOf('day')).day();
                            t_arr_sched.splice(0,6);
                        
                            /**
                            Loop month date to get schedule days , zero value means restdays
                                */
                            var t_start_date = new Date(dateFrom)
                            var t_end_date = new Date(dateTo)
                            var t_date_index =0;
                            var t_date_days = [];
                            while(t_start_date<=t_end_date){
                                if(parseInt(t_arr_sched[t_date_index]) !== 0 && t_arr_sched[t_date_index]){
                                    t_date_days.push(moment(t_start_date).format('ddd'));
                                }
                                // console.log(moment(t_start_date).format('MM-DD-YYYY'))
                                t_start_date.setDate(t_start_date.getDate()+1)
                                t_date_index++
                            }
                            const unique_days = t_date_days.filter((item, index) =>
                                t_date_days.indexOf(item) === index
                            );
                        }
                    
                        result.data.response.forEach(element => {
                            late += parseInt(element.late_minutes)
                            undertime += parseInt(element.under_time)
                        
                            /**
                            get all sched
                                */

                        });
                        var total_undertime = undertime;
                        if(total_undertime>=1){
                            var undertime_hours = (total_undertime / 60);
                            var undertime_rhours = Math.floor(undertime_hours);
                            var undertime_minutes = (undertime_hours - undertime_rhours) * 60;
                            var undertime_rminutes = Math.round(undertime_minutes);
                            settotalUndertimeHours(undertime_rhours)
                            settotalUndertimeMinutes(undertime_rminutes)
                        }else{
                            settotalUndertimeHours(0)
                            settotalUndertimeMinutes(0)
                        }

                        var total_late = late;
                        if(total_late>=1){
                            var late_hours = (total_late / 60);
                            var late_rhours = Math.floor(late_hours);
                            var late_minutes = (late_hours - late_rhours) * 60;
                            var late_rminutes = Math.round(late_minutes);

                            settotalLateHours(late_rhours)
                            settotalLateMinutes(late_rminutes)
                        }else{
                            settotalLateHours(0)
                            settotalLateMinutes(0)
                        }
                        setdtrdata(result.data.response)
                        setRawLogs(result.raw_logs.logs)
                        setPeriod(formatDatePeriod(dateFrom,dateTo))
                        // setPeriod(moment(dateFrom).format('MMMM DD')+' - '+moment(dateTo).format('MMMM DD, YYYY'))

                        Swal.close()
                        handleOpen()
                    }
                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                    toast.error(err.message,)
                    // window.open(api_url2)
                    window.open(api_url)

                })
            }).catch(error=>{
                Swal.close()
                toast.error(error.message)
            })
            
        }
        
    }
    const reactToPrintDTR = useReactToPrint({
        content: () => printDTR.current,
        documentTitle:employeeInfo.lname+' DTR '+period
    })
    const reactToPrintMultipleDTR = useReactToPrint({
        content: () => printMultipleDTR.current,
        documentTitle:'DTR '+period
    })
   
    const beforePrint = () =>{
        setTimeStamp(new Date())
        var logs = {
            action:'PRINT DTR',
            action_dtl:'FROM = '+dateFrom+' | TO = '+dateTo+' NAME = '+employeeInfo.fullname,
            module:'DTR'
        }
        auditLogs(logs)
        reactToPrintDTR()
    }
    const beforeMultiplePrint = () =>{
        setTimeStamp(new Date())
        let names = '';
        multiplePrintData.forEach(el=>{
            names = names+el.fname+' '+formatMiddlename(el.mname)+' '+el.lname+' '+formatExtName(el.extname)+' |'
        })
        var logs = {
            action:'PRINT MULTIPLE DTR',
            action_dtl:'FROM = '+dateFrom+' | TO = '+dateTo+' NAMES = '+names,
            module:'DTR'
        }
        auditLogs(logs)
        reactToPrintMultipleDTR()
    }
    const handleSelectMultiDTR = (id)=>{
        const index = emplistData.findIndex(object => {
            return object.id === id;
        });
        let temp = [...emplistData];

        temp[index].selected = !temp[index].selected
        setEmplistData(temp)
    }
    const [multiplePrintData,setMultiplePrintData] = useState([])
    const [multiplePrintModal,setMultiplePrintModal] = useState(false)
    const handleMultiPrint = async () =>{
        const id = toast.loading('Retrieving DTR records. Please wait')
        try{
            let list = emplistData.filter(el=>el.selected);

            if(list.length>0){
                if(!dateFrom || !dateTo){
                    Swal.fire({
                        icon:'warning',
                        title:'Oops...',
                        html:'Please complete date period'
                    })
                }else{
                    let t_data = {
                        list:list,
                        from:dateFrom,
                        to:dateTo,
                        api_url:api_url
                    }
                    const res = await getMultipleEmpDTR(t_data)
                    // console.log(res.data)
                    if(res.data.length>0){
                        
                        setMultiplePrintData(res.data)
                        setMultiplePrintModal(true)
                        toast.update(id,{
                            type:'success',
                            render:'Successfully retrieved',
                            autoClose:true,
                            isLoading:false
                        })
                        
                    }else{
                        
                        Swal.fire({
                            icon:'error',
                            title:'Oops...',
                            html:'Data not found'
                        })
                    }
                }
            }else{
                toast.update(id,{
                    type:'warning',
                    render:'Please select an employee',
                    autoClose:true,
                    isLoading:false
                })
                // Swal.fire({
                //     icon:'warning',
                //     title:'Oops...',
                //     text:'Please select employee'
                // })
            }
        }catch(err){
            toast.update(id,{
                type:'error',
                render:err,
                autoClose:true,
                isLoading:false
            })
        }
        
    }
    const multipleDTR = (item)=>{
        let t_signatory = item.signatory?.head_name?item.signatory:signatory

        var undertime=0;
        var late=0;
        var work_hours;
        var work_sched;

        item.data.forEach(element => {
            late += parseInt(element.late_minutes)
            undertime += parseInt(element.under_time)
        });
        var total_undertime = undertime;
        if(total_undertime>=1){
            var undertime_hours = (total_undertime / 60);
            var undertime_rhours = Math.floor(undertime_hours);
            var undertime_minutes = (undertime_hours - undertime_rhours) * 60;
            var undertime_rminutes = Math.round(undertime_minutes);
            // settotalUndertimeHours(undertime_rhours)
            // settotalUndertimeMinutes(undertime_rminutes)
        }else{
            // settotalUndertimeHours(0)
            // settotalUndertimeMinutes(0)
        }

        var total_late = late;
        if(total_late>=1){
            var late_hours = (total_late / 60);
            var late_rhours = Math.floor(late_hours);
            var late_minutes = (late_hours - late_rhours) * 60;
            var late_rminutes = Math.round(late_minutes);

            // settotalLateHours(late_rhours)
            // settotalLateMinutes(late_rminutes)
        }else{
            // settotalLateHours(0)
            // settotalLateMinutes(0)
            var late_hours = 0;
            var late_rhours = 0;
            var late_minutes = 0;
            var late_rminutes = 0;
        }
        return (
            <DTRForm dtrdata = {item.data} rawLogs={item.raw_logs.logs} period={period} info = {item.info} totalUndertimeHours = {undertime_rhours} totalUndertimeMinutes={undertime_rminutes} totalLateHours={late_rhours} totalLateMinutes={late_rminutes} officeHead={t_signatory} type='viewing' alreadyAppliedRectification = {[]}/>
        )
    }
    const multipleDTRPrint = (item) =>{
        let t_signatory = item.signatory?.head_name?item.signatory:signatory

        var undertime=0;
        var late=0;
        var work_hours;
        var work_sched;

        item.data.forEach(element => {
            late += parseInt(element.late_minutes)
            undertime += parseInt(element.under_time)
        });
        var total_undertime = undertime;
        if(total_undertime>=1){
            var undertime_hours = (total_undertime / 60);
            var undertime_rhours = Math.floor(undertime_hours);
            var undertime_minutes = (undertime_hours - undertime_rhours) * 60;
            var undertime_rminutes = Math.round(undertime_minutes);
            // settotalUndertimeHours(undertime_rhours)
            // settotalUndertimeMinutes(undertime_rminutes)
        }else{
            // settotalUndertimeHours(0)
            // settotalUndertimeMinutes(0)
        }

        var total_late = late;
        if(total_late>=1){
            var late_hours = (total_late / 60);
            var late_rhours = Math.floor(late_hours);
            var late_minutes = (late_hours - late_rhours) * 60;
            var late_rminutes = Math.round(late_minutes);

            // settotalLateHours(late_rhours)
            // settotalLateMinutes(late_rminutes)
        }else{
            // settotalLateHours(0)
            // settotalLateMinutes(0)
            var late_hours = 0;
            var late_rhours = 0;
            var late_minutes = 0;
            var late_rminutes = 0;
        }
        return(
        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',margin:'20px'}}>
            <Grid item xs={6} sx={{margin:'0 10px'}}>
                <DTRFormPrint  dtrdata = {item.data} period={period} info = {item.info} totalUndertimeHours = {undertime_rhours} totalUndertimeMinutes={undertime_rminutes} totalLateHours={late_rhours} totalLateMinutes={late_rminutes} officeHead={t_signatory} type={1} fname = {footerFName} mname = {footerMName} lname = {footerLName} extname = {footerExtName} timeStamp = {timeStamp}/>
            </Grid>
            <Grid item xs={6} sx={{margin:'0 10px'}}>
                <DTRFormPrint  dtrdata = {item.data} period={period} info = {item.info} totalUndertimeHours = {undertime_rhours} totalUndertimeMinutes={undertime_rminutes} totalLateHours={late_rhours} totalLateMinutes={late_rminutes} officeHead={t_signatory} type={1} fname = {footerFName} mname = {footerMName} lname = {footerLName} extname = {footerExtName} timeStamp = {timeStamp}/>
            </Grid>
        </Grid>
        )

    }
    const handleProcessDTR = async (item) =>{
        if(dateFrom && dateTo){
            try{
                APILoading('info','Processing DTR','Please wait...');
                var t_data = {
                    from:dateFrom,
                    to:dateTo,
                    type:0,
                    emp_id:item.id
                }
                const res = await manualProcessDTR(t_data);
                if(res.data.status === 200){
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
            }catch(error){
                Swal.fire({
                    icon:'error',
                    title:error
                })
            }
            
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                text:'Please complete the date period'
            })
        }
        
    }
    return(
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {isLoading
            ?
            <DashboardLoading actionButtons={0}/>
            :
            <Fade in={!isLoading}>
                <Box sx={{margin:'0 10px 10px 10px'}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title={`Employee DTR (${officeName})`}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                        <Box>
                            <TextField label='Search' placeholder='Fistname | Lastname' value={searchVal} onChange = {(val)=>setSearchVal(val.target.value)} InputProps={{
                endAdornment: <InputAdornment position="end"><SearchIcon/></InputAdornment>,
            }}/>
                        </Box>
                        <Box sx={{display:'flex',gap:1}}>
                            <TextField type='date' label='From' value = {dateFrom} onChange={(val)=>setDateFrom(val.target.value)} InputLabelProps={{shrink:true}}/>
                            <TextField type='date' label='To' value = {dateTo} onChange={(val)=>setDateTo(val.target.value)} InputLabelProps={{shrink:true}}/>
                        </Box>
                        
                    </Grid>
                    <Grid item xs={12} sx={{mt:1}}>
                        <Paper>
                            <TableContainer sx={{maxHeight:'60vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Name
                                            </TableCell>
                                            <TableCell>
                                                Position
                                            </TableCell>
                                            <TableCell align="center">
                                                Select <br/>
                                                <Button variant="contained" className="custom-roundbutton" onClick={handleMultiPrint} startIcon={<PrintIcon/>}>Multiple Print</Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                Action
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            filterData.length>0
                                            ?
                                                filterData.map((item,key)=>
                                                    <TableRow key={key} hover>
                                                        <TableCell sx={{textTransform:'uppercase'}}>
                                                            {item.lname} {formatExtName(item.extname)}, {item.fname} {formatMiddlename(item.mname)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.position_name}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Checkbox checked = {item.selected} onChange={()=>handleSelectMultiDTR(item.id)}/>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="contained" className="custom-roundbutton" color="info" onClick={()=>handleViewDTR(item)}>View DTR</Button>
                                                            {/* <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                                <Tooltip title='View DTR'><IconButton color='primary' className="custom-iconbutton" onClick={()=>handleViewDTR(item)}><VisibilityIcon/></IconButton></Tooltip>
                                                                <Tooltip title='Process DTR'><IconButton color='primary' className="custom-iconbutton" onClick={()=>handleProcessDTR(item)}><UpdateIcon/></IconButton></Tooltip>
                                                            </Box> */}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            :
                                            <TableRow>
                                                <TableCell align='center' colSpan={3}>
                                                    No data...
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <Typography sx={{color:'#4e4e4e',fontStyle:'italic',textAlign:'right'}}>Total : {filterData.length}</Typography>
                    </Grid>
                    <MediumModal open = {open} close = {handleClose} title={`Viewing ${selectedEmp.fname} ${selectedEmp.lname}'s DTR`}>
                        <Box sx={{maxHeight:'70vh',overflowY:'scroll'}}>
                            <DTRForm dtrdata = {dtrdata} rawLogs={rawLogs} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} alreadyAppliedRectification = {alreadyAppliedRectification} officeHead={officeHeadPos} defSignatory = {defSignatory} type='viewing'/>
                        </Box>
                        <Box>
                            <Tooltip title='Print DTR'><Button variant='contained' fullWidth startIcon={<PrintIcon/>} onClick={beforePrint}>PRINT DTR</Button></Tooltip>
                        </Box>
                    </MediumModal>
                    {/* <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color:blue[600],fontWeight:600}}>
                            {`Viewing ${selectedEmp.fname} ${selectedEmp.lname}'s DTR`}
                        </Typography>
                        <Tooltip title='Close'><IconButton color='error' onClick={handleClose}><CloseIcon/></IconButton></Tooltip>
                        </Box>
                        <Box sx={{maxHeight:'70vh',overflowY:'scroll'}}>
                            <DTRForm dtrdata = {dtrdata} rawLogs={rawLogs} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} alreadyAppliedRectification = {alreadyAppliedRectification} officeHead={officeHeadPos} type='viewing'/>
                        </Box>
                        <Box>
                            <Tooltip title='Print DTR'><Button variant='contained' fullWidth startIcon={<PrintIcon/>} onClick={beforePrint}>PRINT DTR</Button></Tooltip>
                        </Box>
                        </Box>
                    </Modal> */}
                    <MediumModal open={multiplePrintModal} close = {()=>setMultiplePrintModal(false)} title='Multiple Printing Preview'>
                        <Box sx={{maxHeight:'80vh',overflowY:'scroll'}}>
                        {
                            multiplePrintData.map((item,key)=>
                                <Box key={key} sx={{mb:1}}>
                                {multipleDTR(item)}
                                <hr/>
                                </Box>
                            )
                        }
                        </Box>
                        <Box sx={{mt:1}}>
                        <Button variant="contained" startIcon={<PrintIcon/>} fullWidth onClick={beforeMultiplePrint}>Print DTR</Button>
                        </Box>
                    </MediumModal>
                    <div style={{display:'none'}}>
                        <div ref = {printDTR} style={{width:'100%',overflow:matches?'scroll':'auto'}} id = 'dtr-form'>
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',margin:'20px'}}>
                                <Grid item xs={6} sx={{margin:'0 10px'}}>
                                    <DTRFormPrint  dtrdata = {dtrdata} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} officeHead={officeHeadPos} type={1} fname = {footerFName} mname = {footerMName} lname = {footerLName} extname = {footerExtName} timeStamp = {timeStamp}/>
                                </Grid>
                                <Grid item xs={6} sx={{margin:'0 10px'}}>
                                    <DTRFormPrint  dtrdata = {dtrdata} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} officeHead={officeHeadPos} type={1} fname = {footerFName} mname = {footerMName} lname = {footerLName} extname = {footerExtName} timeStamp = {timeStamp}/>
                                </Grid>
                            </Grid>
                            
                        </div>
                    </div>
                    <div style={{display:'none'}}>
                        <div ref = {printMultipleDTR} style={{width:'100%',overflow:matches?'scroll':'auto'}} id = 'dtr-form'>
                        {
                            multiplePrintData.map((item,key)=>
                                <Box key={key} id='page-break'>
                                {
                                multipleDTRPrint(item)
                                }
                                </Box>
                            )
                        }
                        </div>
                    </div>
                </Box>
            </Fade>
            }
        </Box>
    )
}
export default React.memo(Version1)