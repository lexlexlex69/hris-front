import React,{useEffect, useState} from 'react';
import { Grid,Box,Skeleton,Paper,Fade,Typography,Button, TextField,Autocomplete,FormGroup,FormControlLabel,Checkbox,Tooltip, breadcrumbsClasses,IconButton } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { blue, green, red, yellow } from '@mui/material/colors';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getOffices, getOfficeEmployee, getEmployeeSchedule, postOBRectification, postOBScheduleAPI,updateOBInserted } from '../../DTRRequest';
import { ThemeProvider , createTheme } from '@mui/material/styles';
import moment from 'moment';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import Swal from 'sweetalert2';
import {useNavigate}from "react-router-dom";
import { toast } from 'react-toastify';
import { checkDTRExistAPI, getDTREmplist } from '.././Request';
import { api_url } from '../../../../../../request/APIRequestURL';
import { convertTo64 } from '../../convertfile/ConvertFile';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});
const CUSTOMTHEME = createTheme({
    typography: {
        allVariants:{
            // fontSize: '.9rem',
            color:blue[800]
        }
    }
});
export default function RequestOB({props,ref}){
    const navigate = useNavigate()
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [officeData,setOfficeData] = useState([])
    const [selectedOffice, setSelectedOffice] = React.useState(null);
    const [data,setData] = useState([]);
    const [selectedEmp,setSelectedEmp] = useState('');
    const [empNo,setEmpNo] = useState('');
    const [empName,setEmpName] = useState('');
    const [empOffice,setEmpOffice] = useState('');
    const [empPos,setEmpPos] = useState('');
    const [coveredDateFrom,setCoveredDateFrom] = useState('');
    const [coveredDateTo,setCoveredDateTo] = useState('');
    const [empDateFiled,setEmpDateFiled] = useState(moment(new Date()).format('MM-DD-YYYY'));
    const [scheduleDate,setScheduleDate] = useState([]);
    const [coveredDays,setCoveredDays] = useState([]);
    const [appliedDays,setAppliedDays] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [openDialog,setOpenDialog] = useState(false);
    const [remarks,setRemarks] = useState('');
    useEffect(()=>{
        getDTREmplist()
        .then(res=>{
            setData(res.data)
            console.log(res.data)
            setIsLoading(false)
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])

    const customStyles = {
        rows: {
            style: {
                // minHeight: '72px', // override the row height
                '&:hover':{
                    cursor:'pointer',
                }
            },
        },
        headCells: {
            style: {
                // paddingLeft: '10px', // override the cell padding for head cells
                // paddingRight: '10px',
                background:blue[600],
                borderTopLeftRadius:'20px',
                color:'white',
                fontSize:'1rem',
            },
        },
        cells: {
            style: {
                paddingLeft: '10px', // override the cell padding for data cells
                paddingRight: '10px',
                '&:hover':{
                    color:blue[800],
                    fontWeight:'bold'
                }
            },
        },
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
            name:'Employee Name',
            selector:row=>row.lname +', '+row.fname+' '+ (row.mname?row.mname.charAt(0)+'.':'')
        }
    ]
    const tableData = {
        columns,
        data
    }
    const selectRow = (row)=>{
        if(selectedEmp.emp_no === row.emp_no){
            console.log('already selected')
        }else{
            var data2 = {
                emp_no:row.emp_no
            }
            getEmployeeSchedule(data2)
            .then(res=>{
                console.log(res.data)
                if(res.data.schedule.length === 0){
                    Swal.fire({
                        icon:'error',
                        title:"The selected employee's work schedule was not set"
                    })
                    setScheduleDate([])
                }else{
                    setScheduleDate(res.data.schedule)
                    setAppliedDays(res.data.applied)
                }
            }).catch(err=>{
                console.log(err)
            })
            setSelectedEmp(row)
            setEmpNo(row.emp_no)
            setEmpName(row.fname+' '+(row.mname?row.mname.charAt(0)+'. ':' ')+row.lname)
            setEmpOffice(row.dept_title)
            setEmpPos(row.position_name)
        }
        setCoveredDateFrom('')
        setCoveredDateTo('')
        setCoveredDays([])
        
    }
    const handleSetDateFrom = (value)=>{
        if(coveredDateTo.length !==0){
            if(value.target.value>coveredDateTo){
                Swal.fire({
                    icon:'warning',
                    title:'Date should be less than or equal to Date To. Please select other date',
                })
            }else{
                setCoveredDateFrom(value.target.value);
                /**
                 * Loop to get Schedule date
                 */

                 var sched = JSON.parse(scheduleDate[0].working_days);
                 var start_date = new Date(value.target.value);
                 var end_date = new Date(coveredDateTo);

                 // console.log(moment(start_date).format('MM-DD-YYYY'))
                 // console.log(moment(end_date).format('MM-DD-YYYY'))
                 var temp_date = [];
                 var rem_sched = JSON.parse(scheduleDate[0].removed_sched)
                 var updated_sched = JSON.parse(scheduleDate[0].updated_sched)
                 while(moment(start_date).format('MM-DD-YYYY') <= moment(end_date).format('MM-DD-YYYY')){
                     var arr;
                     var update_exist = false;
                     var remove_exist = false;
                     /**
                      * Check updated sched
                      */
                     
                     for(var y = 0 ; y<rem_sched.length ; y++){
                         if(moment(start_date).format('YYYY-MM-DD') === moment(new Date(rem_sched[y].date)).format('YYYY-MM-DD')){
                             remove_exist = true;
                         }
                     }
                     if(!remove_exist){
                         for(var x = 0 ; x<updated_sched.length ; x++){
                             if(moment(start_date).format('YYYY-MM-DD') === moment(new Date(updated_sched[x].date)).format('YYYY-MM-DD')){
                                 arr = {
                                    date:moment(start_date).format('YYYY-MM-DD'),
                                    time_in:updated_sched[x].time_in,
                                    time_out:updated_sched[x].time_out,
                                    break_in:updated_sched[x].break_in,
                                    break_out:updated_sched[x].break_out,
                                    time_in_details:updated_sched[x].time_in,
                                    time_out_details:updated_sched[x].time_out,
                                    break_in_details:updated_sched[x].break_in,
                                    break_out_details:updated_sched[x].break_out,
                                    remarks:''
                                }
                                update_exist = true;
                                break;
                             }
                         }
                         if(update_exist){
                             temp_date.push(arr);
                         }else{
                             for(var i = 0 ; i<sched.length ; i++){
                                 if(moment(start_date).format('dddd') === sched[i].day){
                                     arr = {
                                        date:moment(start_date).format('YYYY-MM-DD'),
                                        time_in:sched[i].time_in,
                                        time_out:sched[i].time_out,
                                        break_in:sched[i].break_in,
                                        break_out:sched[i].break_out,
                                        time_in_details:sched[i].time_in,
                                        time_out_details:sched[i].time_out,
                                        break_in_details:sched[i].break_in,
                                        break_out_details:sched[i].break_out,
                                        remarks:''
                                    }
                                    temp_date.push(arr);
                                    break;
                                 }
                             }
                         }
                     }
 
                     start_date.setDate(start_date.getDate()+1);
                 }
                 setCoveredDays(temp_date)
            }
        }else{
            setCoveredDateFrom(value.target.value);
        }
    }
    const handleSetDateTo = (value) => {
        setCoveredDateTo(value.target.value);
        /**
         * Loop to get Schedule date
         */
        setTimeout(async function() {
            var t_date = Date.parse(value.target.value);
            if(isNaN(t_date) === false){
                var t_check_data = {
                    api_url:api_url+'/checkDTRExistAPI',
                    emp_no:selectedEmp.emp_no,
                    from:moment(coveredDateFrom).format('YYYY-MM-DD'),
                    to:moment(value.target.value).format('YYYY-MM-DD')
                }
                // console.log(t_check_data)
                const exist_data = await checkDTRExistAPI(t_check_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.code === '301'){
                        return [];
                    }else{
                        if(res.data){
                            return res.data.data.response
                        }else{
                            return [];
                        }
                    }
                    
                }).catch(err=>{
                    console.log(err)
                })
                var sched = JSON.parse(scheduleDate[0].working_days);
                var start_date = new Date(coveredDateFrom);
                var end_date = new Date(value.target.value);
                // console.log(moment(start_date).format('MM-DD-YYYY'))
                // console.log(moment(end_date).format('MM-DD-YYYY'))
                var temp_date = [];
                var rem_sched = JSON.parse(scheduleDate[0].removed_sched)
                var updated_sched = JSON.parse(scheduleDate[0].updated_sched)
                console.log(exist_data)
                while(moment(start_date).format('MM-DD-YYYY') <= moment(end_date).format('MM-DD-YYYY')){
                    var arr;
                    var update_exist = false;
                    var remove_exist = false;
                    /**
                    * Check updated sched
                    */
                    
                    for(var y = 0 ; y<rem_sched.length ; y++){
                        if(moment(start_date).format('YYYY-MM-DD') === moment(new Date(rem_sched[y].date)).format('YYYY-MM-DD')){
                            remove_exist = true;
                        }
                    }
                    /**
                    Check if has record on dtr
                        */
                    var t_arr = exist_data.filter((el)=>{
                        return el.work_date === moment(start_date).format('YYYY-MM-DD')
                    })
                    var time_in_disabled = false;
                    var break_out_disabled = false;
                    var break_in_disabled = false;
                    var time_out_disabled = false;
                    var time_in_rec = '';
                    var break_out_rec = '';
                    var break_in_rec = '';
                    var time_out_rec = '';
                    console.log(t_arr)
                    // if(t_arr.length>0){
                    //     var t_half_break_arr = t_arr[0].half_break.split(';');
                    //     if(t_arr[0].time_in.trim()){
                    //         time_in_disabled = true
                    //         time_in_rec = t_arr[0].time_in 
                    //     }
                    //     if(t_half_break_arr[0].trim()){
                    //         break_out_disabled = true
                    //         var is_valid_time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(t_half_break_arr[0], 'H:mm').format('H:mm'));
                    //         if(is_valid_time){
                    //             break_out_rec = moment(t_half_break_arr[0], 'HH::mm').format('HH:mma')
                    //         }else{
                    //             break_out_rec = t_half_break_arr[0]
                    //         }
                    //     }
                    //     if(t_half_break_arr[1].trim()){
                    //         break_in_disabled = true
                    //         var is_valid_time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(t_half_break_arr[1], 'H:mm').format('H:mm'));
                    //         if(is_valid_time){
                    //             break_in_rec = moment(t_half_break_arr[1], 'HH::mm').format('HH:mma')
                    //         }else{
                    //             break_in_rec = t_half_break_arr[1]
                    //         }
                    //     }
                        
                    //     console.log(t_arr[0].time_out)
                    //     if(t_arr[0].time_out.trim()){
                    //         time_out_disabled = true
                    //         var is_valid_time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(t_arr[0].time_out, 'H:mm').format('H:mm'));
                    //         if(is_valid_time){
                    //             time_out_rec = moment(t_arr[0].time_out, 'HH::mm').format('HH:mma')
                    //         }else{
                    //             time_out_rec = t_arr[0].time_out
                    //         }
                    //     }
                    // }
                    if(t_arr.length>0){
                        var t_half_break_arr = t_arr[0].half_break.split(';');
                        if(t_arr[0].time_in.trim()){
                            time_in_disabled = true
                            var is_valid_time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(t_arr[0].time_in.trim(), 'H:mma').format('H:mm'));
                            if(is_valid_time){
                                time_in_rec = moment(t_arr[0].time_in.trim(), 'HH::mma').format('hh:mma')
                            }else{
                                time_in_rec = t_arr[0].time_in.trim()
                            }
                        }
                        if(t_half_break_arr[0].trim()){
                            break_out_disabled = true
                            var is_valid_time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(t_half_break_arr[0], 'H:mma').format('H:mm'));
                            if(is_valid_time){
                                break_out_rec = moment(t_half_break_arr[0], 'HH::mma').format('hh:mma')
                            }else{
                                break_out_rec = t_half_break_arr[0]
                            }
                        }
                        if(t_half_break_arr[1].trim()){
                            break_in_disabled = true
                            var is_valid_time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(t_half_break_arr[1], 'H:mma').format('H:mm'));
                            if(is_valid_time){
                                break_in_rec = moment(t_half_break_arr[1], 'HH::mma').format('hh:mma')
                            }else{
                                break_in_rec = t_half_break_arr[1]
                            }
                        }
                        if(t_arr[0].time_out.trim()){
                            time_out_disabled = true
                            var is_valid_time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(t_arr[0].time_out, 'H:mma').format('H:mm'));
                            if(is_valid_time){
                                time_out_rec = moment(t_arr[0].time_out, 'HH::mma').format('hh:mma')
                            }else{
                                time_out_rec = t_arr[0].time_out
                            }
                        }
                    }
                    

                    if(!remove_exist){
                        for(var x = 0 ; x<updated_sched.length ; x++){
                            if(moment(start_date).format('YYYY-MM-DD') === moment(new Date(updated_sched[x].date)).format('YYYY-MM-DD')){
                                
                                arr = {
                                    date:moment(start_date).format('YYYY-MM-DD'),
                                    time_in:updated_sched[x].time_in,
                                    time_out:updated_sched[x].time_out,
                                    break_in:updated_sched[x].break_in,
                                    break_out:updated_sched[x].break_out,
                                    time_in_details:updated_sched[x].time_in,
                                    time_out_details:updated_sched[x].time_out,
                                    break_in_details:updated_sched[x].break_in,
                                    break_out_details:updated_sched[x].break_out,
                                    remarks:'',
                                    time_in_disabled:time_in_disabled,
                                    time_in_rec:time_in_rec,
                                    break_out_disabled:break_out_disabled,
                                    break_out_rec:break_out_rec,
                                    break_in_disabled:break_in_disabled,
                                    break_in_rec:break_in_rec,
                                    time_out_disabled:time_out_disabled,
                                    time_out_rec:time_out_rec,
                                }
                                update_exist = true;
                                break;
                            }
                        }
                        if(update_exist){
                            temp_date.push(arr);
                        }else{
                            console.log('here')
                            for(var i = 0 ; i<sched.length ; i++){
                                if(moment(start_date).format('dddd') === sched[i].day){
                                console.log(sched[i])
                                    arr = {
                                        date:moment(start_date).format('YYYY-MM-DD'),
                                        time_in:sched[i].time_in,
                                        time_out:sched[i].time_out,
                                        break_in:sched[i].break_in,
                                        break_out:sched[i].break_out,
                                        time_in_details:sched[i].time_in,
                                        time_out_details:sched[i].time_out,
                                        break_in_details:sched[i].break_in,
                                        break_out_details:sched[i].break_out,
                                        remarks:'',
                                        time_in_disabled:time_in_disabled,
                                        time_in_rec:time_in_rec,
                                        break_out_disabled:break_out_disabled,
                                        break_out_rec:break_out_rec,
                                        break_in_disabled:break_in_disabled,
                                        break_in_rec:break_in_rec,
                                        time_out_disabled:time_out_disabled,
                                        time_out_rec:time_out_rec,
                                    }
                                    temp_date.push(arr);
                                    break;
                                }
                            }
                        }
                    }

                    start_date.setDate(start_date.getDate()+1);
                }
                console.log(temp_date)
                setCoveredDays(temp_date)
            }
            
        }, 2000);
        
    }
    const setUpdateTime = (index,value,type) => {
        var temp_data = [...coveredDays];
        switch(type){
            case 'time_in':
                temp_data[index].time_in = value.target.value;
                break;
            case 'break_out':
                temp_data[index].break_out = value.target.value;
                break;
            case 'break_in':
                temp_data[index].break_in = value.target.value;
                break;
            case 'time_out':
                temp_data[index].time_out = value.target.value;
                break;
        }
        setCoveredDays(temp_data)
    }
    const setUpdateRemarks = (index,value)=>{
        var temp_data = [...coveredDays];
        temp_data[index].remarks = value.target.value;
        setCoveredDays(temp_data)

    }
    const handleRemove = (index) =>{
        var temp_data = [...coveredDays];
        // console.log(index)
        // console.log(temp_data.length-1)
        // console.log(temp_data[0].date)
        if(temp_data.length !== 1){
            if((temp_data.length-1) === index){
                setCoveredDateTo(moment(new Date(temp_data[index-1].date)).format('YYYY-MM-DD'))
            }
            if(index === 0){
                setCoveredDateFrom(moment(new Date(temp_data[0].date)).format('YYYY-MM-DD'))
            }
        }
        temp_data.splice(index,1)
        setCoveredDays(temp_data)

    }
    const handleSave = () =>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
          }).then((result) => {
            if (result.isConfirmed) {
                var temp_covered_days = [];
                var arr;
                /**
                 * Set all empty remarks with 'OFT'
                 */
                coveredDays.forEach(element => {
                    /**
                    Check if all time has record
                     */
                    var t_count_rec = 0;
                    if(element.time_in_disabled){
                        t_count_rec++
                    }
                    if(element.time_out_disabled){
                        t_count_rec++
                    }
                    if(element.break_out_disabled){
                        t_count_rec++
                    }
                    if(element.break_in_disabled){
                        t_count_rec++
                    }
                    if(t_count_rec !== 4){
                        if(element.remarks === ''){
                            arr = {
                                date:moment(element.date).format('YYYY-MM-DD'),
                                time_in:element.time_in_disabled?'':element.time_in,
                                time_out:element.time_out_disabled?'':element.time_out,
                                break_in:element.break_in_disabled?'':element.break_in,
                                break_out:element.break_out_disabled?'':element.break_out,
                                time_in_details:element.time_out_details,
                                time_out_details:element.time_out_details,
                                break_in_details:element.break_in_details,
                                break_out_details:element.break_out_details,
                                remarks:'OFT',
                            }
                        }else{
                            arr = {
                                date:moment(element.date).format('YYYY-MM-DD'),
                                time_in:element.time_in_disabled?'':element.time_in,
                                time_out:element.time_out_disabled?'':element.time_out,
                                break_in:element.break_in_disabled?'':element.break_in,
                                break_out:element.break_out_disabled?'':element.break_out,
                                time_in_details:element.time_out_details,
                                time_out_details:element.time_out_details,
                                break_in_details:element.break_in_details,
                                break_out_details:element.break_out_details,
                                remarks:element.remarks
                            }
                        }
                        temp_covered_days.push(arr);
                    }
                    
                });
                if(temp_covered_days.length === 0){
                    Swal.fire({
                        icon:'error',
                        title:'Oops...',
                        html:"Can't request OB if work date in DTR has already a records"
                    })
                }else{
                    var data2 = {
                        emp_no:selectedEmp.emp_no,
                        dept_code:selectedEmp.dept_code,
                        days_details:temp_covered_days,
                        date_from:coveredDateFrom,
                        date_to:coveredDateTo,
                        date_filed:moment(new Date()).format('YYYY-MM-DD'),
                        encode_time:moment(new Date()).format('H:mm'),
                        // file:
                        remarks:remarks,
                        file:fileUpload

                    }

                    console.log(data2)
                    Swal.fire({
                        icon:'info',
                        title:'Saving data',
                        html:'Please wait...',
                        allowEscapeKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading();
                    postOBRectification(data2)
                    .then(res=>{
                        /**
                         * Successfully added
                         */
                        if(res.data.status === 200){
                            setCoveredDateFrom('')
                            setCoveredDateTo('')
                            setCoveredDays([])
                            props.setPendingData(res.data.pending)
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
                        Swal.close();
                        console.log(err)
                    })
                }
                
            }
          })
        
    }
    const handleCancel = () => {
        setCoveredDateFrom('')
        setCoveredDateTo('')
        setCoveredDays([])
    }
    const handleCloseDialog = ()=>{
        setOpenDialog(false)
    }
    const checkIsApplied = (data,type,index) =>{
        let has_exist = false;
        let has_record = false;
        let remarks;
        let time_rec='';
        appliedDays.forEach(el=>{
            // console.log(JSON.parse(el.days_details))
            // JSON.parse(el.days_details).forEach(el2=>{
                
            // })
            let temp_days_dtl = JSON.parse(el.days_details)

            for(var i = 0 ; i<temp_days_dtl.length;i++){
                if(moment(data.date,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(temp_days_dtl[i].date,'YYYY-MM-DD').format('YYYY-MM-DD')){
                    // el2[type] === null;
                    switch(type){
                        case 'time_in':
                            if(temp_days_dtl[i].time_in !== null){
                                has_exist = true;
                                remarks = temp_days_dtl[i].remarks;
                            }
                            break;
                        case 'time_out':
                            if(temp_days_dtl[i].time_out !== null){
                                has_exist = true;
                                remarks = temp_days_dtl[i].remarks;
                            }
                            break;
                        case 'break_in':
                            if(temp_days_dtl[i].break_in !== null){
                                has_exist = true;
                                remarks = temp_days_dtl[i].remarks;
                            }
                            break;
                        case 'break_out':
                            if(temp_days_dtl[i].break_out !== null){
                                has_exist = true;
                                remarks = temp_days_dtl[i].remarks;
                            }
                            break;
                    }
                    break;
                }
            }
            
        })
        switch(type){
            case 'time_in':
                if(data.time_in_disabled){
                    has_record = true;
                    time_rec = data.time_in_rec
                }
                break;
            case 'break_out':
                if(data.break_out_disabled){
                    has_record = true;
                    time_rec = data.break_out_rec
                }
                break;
            case 'break_in':
                if(data.break_in_disabled){
                    has_record = true;
                    time_rec = data.break_in_rec
                }
                break;
            case 'time_out':
                if(data.time_out_disabled){
                    has_record = true;
                    time_rec = data.time_out_rec
                }
                break;

        }
        if(has_record){
            return <input type="text" defaultValue={time_rec} style={{width:'100%'}} readOnly/>
        }else if(has_exist){
            return <input type="text" defaultValue={remarks} style={{width:'100%'}} readOnly/>
        }else{
            console.log(data[type])
            if(data[type] === '24:00'){
                return <input type="time" value = '00:00' onChange = {(value)=>setUpdateTime(index,value,type)} style={{width:'100%'}}/>

            }else{
                return <input type="time" value = {data[type]} onChange = {(value)=>setUpdateTime(index,value,type)} style={{width:'100%'}}/>

            }
        }

    }
    const [singleFile,setsingleFile] = useState('');
    const handleSingleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setsingleFile(fileReader.result)
            }
        }else{
            setsingleFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const [fileUpload,setFileUpload] = useState([])
    const handleFile = async (e) =>{
        var len = e.target.files.length;
        var i = 0;
        var files = [...fileUpload];
        for(i;i<len;i++){
            var file = e.target.files[i].name;
            var extension = file.split('.').pop();
            if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
                var t_filename = file.split('.');
                var f_filename;
                if(t_filename[0].length>10){
                    f_filename = t_filename[0].substring(0,10)+'...'+t_filename[1];
                }else{
                    f_filename = file;
                }
                files.push({
                    data:await convertTo64(e.target.files[i]),
                    filename:f_filename
                });
            }else{
                // setFileUpload('')
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Please upload PDF or Image file.'
                })
            }
        }
        setFileUpload(files)
        console.log(files)
    }
    const handleRemoveFile = (index)=>{
        var t_file = [...fileUpload];
        t_file.splice(index,1);
        setFileUpload(t_file)
    }
    return (
        <Grid container sx={{p:2}}>
            <Grid item xs={12} md={3} lg={3} >
                <Box sx={{width:matches?'100%':'98%'}}>
                <DataTableExtensions
                    {...tableData}
                    export={false}
                    print={false}
                    filterPlaceholder='Search Employee'
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
                    fixedHeader
                    fixedHeaderScrollHeight="300px"
                    onRowClicked={selectRow}
                    customStyles={customStyles}
                />
                </DataTableExtensions>
                </Box>

            </Grid>
            <ThemeProvider theme={CUSTOMTHEME}>
            <Grid item xs={12} md={9} lg={9} sx={{p:1,border:'solid 1px #c9c9c9',borderRadius:'5px',pointerEvents:selectedEmp.length !==0 ?'auto':'none'}}>
                <Grid container spacing={1} sx={{width:'100%'}}>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={12}>
                            <TextField label='Employee Number' InputLabelProps={{shrink:true}} fullWidth variant='standard'value={empNo} InputProps={{readOnly: true}}/>
                        </Grid>
                        &nbsp;
                        <Grid item xs={12}>
                        <TextField label='Employee Name' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={empName}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField label='Office' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={empOffice} InputProps={{readOnly: true}}/>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField label='Position' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={empPos} InputProps={{readOnly: true}}/>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField label='Date Filed' InputLabelProps={{shrink:true}} fullWidth variant='standard' defaultValue={empDateFiled} InputProps={{readOnly:true}}/>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography sx={{fontSize:'.8rem'}}>Covered Period</Typography>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                        <TextField type='date' label='From' InputLabelProps={{shrink:true}} fullWidth variant='standard' onChange={handleSetDateFrom} value={coveredDateFrom} disabled={scheduleDate.length ===0 ?true:false}/>
                        &nbsp;
                        <TextField type='date' label='To' InputLabelProps={{shrink:true}} fullWidth variant='standard' onChange={handleSetDateTo} value={coveredDateTo} disabled={scheduleDate.length ===0 ?true:false}/>
                        </Box>

                    </Grid>
                    <Grid item xs={12}>
                    <TextField label='Remarks' InputLabelProps={{shrink:true}} fullWidth variant='standard' value={remarks} onChange={(val)=>setRemarks(val.target.value)}/>
                    </Grid>

                    <Grid item xs={12} sx ={{overflowX:'scroll',overflowY:'scroll'}}>
                        {
                            coveredDays.length !==0
                            ?
                            <>
                            <Typography sx={{color:'black',textAlign:'center',fontWeight:'bold'}}>Daily O.B. schedule detail </Typography>
                            <table className='table table-bordered table-striped' style={{fontSize:'.7rem'}}>
                                <thead style={{textAlign:'center',verticalAlign:'middle'}}>
                                    <tr>
                                        <th>Date</th>
                                        <th>Day</th>
                                        <th>AM <br/> In</th>
                                        <th>AM <br/> Out</th>
                                        <th>PM <br/> In</th>
                                        <th>PM <br/> Out</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coveredDays.map((data,index)=>
                                        <tr key = {index}>
                                            <td>{moment(data.date).format('MM-DD-YYYY')}</td>
                                            <td>{moment(data.date).format('dddd')}</td>
                                            <td>{checkIsApplied(data,'time_in',index)}</td>
                                            <td>{checkIsApplied(data,'break_out',index)}</td>
                                            <td>{checkIsApplied(data,'break_in',index)}</td>
                                            <td>{checkIsApplied(data,'time_out',index)}</td>
                                            <td><input type="text" value = {data.remarks} onChange = {(value)=>setUpdateRemarks(index,value)} style={{width:'100%'}}/></td>
                                            {/* <td><input type="time" value = {data.break_out} onChange = {(value)=>setUpdateTime(index,value,'break_out')} style={{width:'100%'}}/>
                                                </td>
                                            <td><input type="time" value = {data.break_in} onChange = {(value)=>setUpdateTime(index,value,'break_in')} style={{width:'100%'}}/></td>
                                            <td><input type="time" value = {data.time_out} onChange = {(value)=>setUpdateTime(index,value,'time_out')} style={{width:'100%'}}/></td>
                                            <td><input type="text" value = {data.remarks} onChange = {(value)=>setUpdateRemarks(index,value)} style={{width:'100%'}}/></td> */}
                                            <td><Tooltip title='Delete'><Button variant='outlined' size='small' color='error' sx={{'&:hover':{color:'white',background:red[800]}}}fullWidth onClick={()=>handleRemove(index)}><DeleteOutlineOutlinedIcon/></Button></Tooltip></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            </>
                            :
                            ''
                        }
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex',flexDirectionL:'row',justifyContent:'flex-end',alignItems:'center',gap:1}}>
                        {/* <TextField type='file' label='Supporting Document' InputLabelProps={{shrink:true}} onChange={handleSingleFile} InputProps={{ inputProps: { accept:'image/*,.pdf'}}}/>
                        &nbsp; */}
                        <Box>
    
                        <label htmlFor={"contained-button-file"} style={{width:'100%'}} required>
                        <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)} multiple/>
                        
                        <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' }, flex: 1}}> {fileUpload.length ===0?<Tooltip title='No file uploaded'><WarningAmberOutlinedIcon size='small' color='error'/></Tooltip>:''} <AttachFileOutlinedIcon fontSize='small'/>Upload File </Button>
                        </label>
                        {
                            fileUpload.length>0
                            ?
                            <Grid item container sx={{display:'flex',justifyContent:'space-between'}}>
                            {
                                fileUpload.map((row,key)=>
                                <Grid item xs={6} lg={4} sx={{border:'solid 1px #e9e9e9',borderRadius:'20px',pl:1}}>
                                <small style={{display:'flex',justifyContent:'space-between',alignItems:'center', fontSize:'.7rem'}} key={key}>{row.filename} <Tooltip title='Remove file'><IconButton onClick={()=>handleRemoveFile(key)}><DeleteIcon color='error' sx={{fontSize:'15px'}}/></IconButton></Tooltip></small>
                                </Grid>
                                
                            )}
                            </Grid>
                            :
                            null
                        }
                        </Box>
                        <Button variant='outlined' startIcon = {<SaveOutlinedIcon/>} color='success' sx={{'&:hover':{color:'white',background:green[800]}}} disabled={coveredDays.length === 0 || coveredDateFrom.length === 0 || coveredDateTo.length ===0 || fileUpload.length === 0 ?true:false} onClick={handleSave}>Save</Button>
                        <Button variant='outlined' onClick = {handleCancel} startIcon={<BackspaceOutlinedIcon/>}color='error' sx={{'&:hover':{color:'white',background:red[800]}}}>Clear Period</Button>
                    </Grid>

                </Grid>
            </Grid>
            </ThemeProvider>
        </Grid>
        
    )
}