import React,{useState,useEffect} from 'react';
import {Grid,Typography,FormControl,InputLabel,Select,MenuItem,TextField,Tooltip,Button,IconButton, Modal,Box} from '@mui/material';
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import InputIcon from "react-multi-date-picker/components/input_icon"
import moment from 'moment';
import { addLeaveApplication, getAllHolidays, getCTOAlreadyAppliedHours, getCurrentMonthCOC, getWorkSchedule } from '../LeaveApplicationRequest';
import {red,blue} from '@mui/material/colors'
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { convertTo64 } from '../../onlinedtr/convertfile/ConvertFile';
import { styled } from '@mui/material/styles';

//icons
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import LetterHead from '../../../forms/letterhead/LetterHead';
import LetterHead2 from '../../../forms/letterhead/LetterHead2';
import PreviewCTOApplicationForm2 from '../PreviewCTOApplicationForm2';
import LargeModal from '../../../custommodal/LargeModal';

var momentBusinessDays = require("moment-business-days");
const Input = styled('input')({
    display: 'none',
});
export default function AddCTO(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 816,
        bgcolor: 'background.paper',
        border: '2px solid #ff',
        boxShadow: 24,
        borderRadius:1,
        p: 2,
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [currentMonth,setCurrentMonth] = useState(new DateObject())
    const [CTOHoursDropdown,setCTOHoursDropdown] = useState([])
    const [CTOHours,setCTOHours] = useState('')
    const [currentMonthCTO,setCurrentMonthCTO] = useState('');
    const [totalMonthHours,setTotalMonthHours] = useState('')
    const [ctoFilingPeriod,setctoFilingPeriod] = useState(0);
    const [minCTODate,setMinCTODate] = useState('')
    const [maxCTODate,setMaxCTODate] = useState('')
    const [alreadyAppliedDays,setAlreadyAppliedDays] = React.useState([]);
    const [alreadyAppliedDaysPeriod,setAlreadyAppliedDaysPeriod] = React.useState([]);
    
    const [selectedCTOInclusiveDates, setCTOInclusiveDates] = useState([]);
    const [tempSelectedCTOInclusiveDates, setTempSelectedCTOInclusiveDates] = useState([]);
    const [tempSelectedSPLInclusiveDates, setTempSelectedSPLInclusiveDates] = useState([]);
    const [ctodatestext,setctodatestext] = useState('');
    const [workScheduleData,setWorkScheduleData] = React.useState([])
    const [workScheduleDataLoaded,setWorkScheduleDataLoaded] = React.useState(false)
    const [cocFile,setCOCFile] = useState('');
    const [balance,setBalance] = useState(0)
    const [holidays,setHolidays] = useState([])

    useEffect(()=>{ 
        console.log(props)
        setAlreadyAppliedDays(props.alreadyAppliedDays)
        setAlreadyAppliedDaysPeriod(props.alreadyAppliedDaysPeriod)
        getWorkSchedule()
        .then(res=>{
            // console.log(res.data)
            if(res.data.length !==0){
                var template_days = []
                var schedule_data = [];
                
                /**
                 * Loop work schedule data per year
                 */
                res.data.new.forEach(el3=>{
                    /**
                     * Get the removed date
                     */
                    var removed = JSON.parse(el3.removed_sched)
    
                    /**
                     * Initialized temp remove array
                     */
                    var rem_arr = []
    
                    /**
                     * Loop removed sched data and push into temp array. Using this will easily lookup data using "includes" function
                     */
                    removed.forEach(rem =>{
                        rem_arr.push(moment(rem.date).format('MM-DD-YYYY'))
                    })
    
                    /**
                     * Loop template days data and push into temp array. Using this will easily lookup data using "includes" function
                     */
                    JSON.parse(el3.working_days).forEach(el=>{
                        template_days.push(el.day)
                    })
    
                    /**
                     * Initialized year based on current loop
                     */
                    var year  = el3.year;
    
                    /**
                     * Get all months
                     */
                    moment.months().forEach(element => {
                        var schedule = [];
                        /**
                         * Convert month to new Date
                         */
                        var month_start = moment().month(element)
                        var month = moment(month_start).format('MM')-1;
    
                        /**
                         * Initialized start date of month to loop
                         */
                        var from_period = new Date(year, month, 1);
    
                        /**
                         * Loop days for current month
                         */
                        while (moment(from_period).format('MMMM') === element) {
                            /**
                             * Check if month day exist in template days
                             */
                            if(template_days.includes(moment(from_period).format('dddd'))){
                                /**
                                 * If month day exist in template days get the template details
                                 */
                                JSON.parse(el3.working_days).forEach(el2=>{
                                    /**
                                     * Check if template days inludes in removed date,if not removed push data to array
                                     */
                                    if(el2.day === moment(from_period).format('dddd') && !rem_arr.includes(moment(from_period).format('MM-DD-YYYY'))){
                                        schedule.push({
                                            'day':moment(from_period).format('D'),
                                            'whrs_code':el2.whrs_code,
                                            'whrs_desc':el2.whrs_desc,
                                        });
                                    }
                                    
                                })
                            }
                            /**
                             * Increment loop contidtion
                             */
                            from_period.setDate(from_period.getDate() + 1);
                        }
                        /**
                         * After looping days in every month, push data into array
                         */
                        schedule_data.push({
                            month:parseInt(moment(month_start).format('M')),
                            year:year,
                            details:schedule
                        })    
                    });
                })
                    
                setWorkScheduleData(schedule_data)
                console.log(schedule_data)
                setWorkScheduleDataLoaded(true)
            }else{
                toast.error('No Work schedule found, please contact HR admin')
            }

        }).catch(err=>{
            console.log(err)
        })
        /**
        Gel all active coc credits, current month
        */
        var t_data = {
            date:moment().endOf('month').format('YYYY-MM-DD')
        }
        getCurrentMonthCOC(t_data)
        .then(res=>{
            setBalance(res.data)
        })
        getAllHolidays()
        .then(res=>{
            console.log(res.data)
            setHolidays(res.data.response)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleCurrentMonth = (date) => {
        setCurrentMonth(date)
    }
    useEffect(()=>{
        // loop for CTO dropdown hours based on available balance
        // let coc = balance;
        // let result = [];

        // /**
        //  * Check if has already applied 40 hrs based on month year calendar
        //  */
        //  getCTOAlreadyAppliedHours(currentMonth.format('MM-YYYY'))
        //  .then(response=>{
        //      var data;
        //      setTotalMonthHours(response.data.total)
        //      data = response.data.total

        //      /**
        //       * Check if current month hours is greater than 40
        //       */
        //      if(data>=40){
        //          /**
        //           * Can't applied CTO
        //           */
        //          setCTOHoursDropdown([])
        //      }else{
        //          if(data === 0){
        //              //if available COC is greater than or equal to 40 limit only 5 days equals to 40 HRS per application
        //              if(coc>=40){
        //                 var x=0;
        //                 var start = data;
        //                 for(var i = 4 ; x < 10 ;){
        //                     if(i>coc){
        //                         break;
        //                     }else{
        //                         result.push(i)
        //                         i = i +4;
        //                         x++;
        //                     }
                        
        //                 }
        //                 setCTOHoursDropdown(result)
        //              }else{
        //                 var total=0;
        //                 for(var i = 4 ; i <= coc;){
        //                     if(i>coc){
        //                         break;
        //                     }else{
        //                         result.push(i)
        //                         total = i+data;
        //                         i = i +4;
        //                         if(total>=40){
        //                             break;
        //                         }
        //                     }
                        
        //                 }
        //                 setCTOHoursDropdown(result)
        //              }
                     
        //          }else{
        //              //limit only remaining CTO hours per month
        //              var total=0;
        //              for(var i = 4 ; i <= coc;){
        //                  if(i>coc){
        //                      break;
        //                  }else{
        //                      result.push(i)
        //                      total = i+data;
        //                      i = i +4;
        //                      if(total>=40){
        //                          break;
        //                      }
        //                  }
                     
        //              }
        //              setCTOHoursDropdown(result)
        //          }
                 
        //      }
        //      setCurrentMonthCTO(data)
        //      setCTOInclusiveDates([])
        //      setCTOHours('')
        //     })
        //     .catch(error=>{
        //         console.log(error)
        //     })
        // var year = parseInt(currentMonth.format('YYYY'));
        // var month = parseInt(currentMonth.format('MM')-1);
      
        // console.log(parseInt(moment().format('M')))
        // console.log(parseInt(moment().format('YYYY')))
        // console.log(month+1)
        // console.log(year)
        // // var minCTODate = new Date(year,month,1)
        // if(parseInt(currentMonth.format('MM')) === parseInt(moment().format('M')) && year === parseInt(moment().format('YYYY'))){
        //     var minCTODate = new Date()
        // }else{
        //     var minCTODate = new Date(year,month,1)
        // }
        // var maxCTODate = new Date(year,month+1,0)
        // // setMinCTODate(new Date())
        // setMinCTODate(minCTODate)
        // setMaxCTODate(maxCTODate)
        /**
        Gel all active coc credits, current month
            */
        var year = currentMonth.format('YYYY');
        var month = currentMonth.format('MM')-1;
        var t_data = {
            date:moment(new Date(year,month+1,0)).format('YYYY-MM-DD')
        }
        console.log(t_data)
        getCurrentMonthCOC(t_data)
        .then(res=>{
            console.log(res.data)
            setBalance(res.data)

            let coc = res.data;
            let result = [];
            let minDate = new Date();
            let endDate;
            let start = 0;
            let fin_minDate;
            while(start<=ctoFilingPeriod){
                endDate = minDate;
                if(moment(endDate).isBusinessDay()){
                    console.log(moment(endDate).format('MM-DD-YYYY'))
                    start++;
                }
                if(start !== ctoFilingPeriod){
                    endDate.setDate(endDate.getDate()+1)
                }
            }
            // console.log(endDate)
            setMinCTODate(moment(new Date(year,month,1)).format('YYYY-MM-DD'))
            // setMinCTODate(endDate)
            var maxCTODate = new Date(year,month+1,0)
            // var d = new Date(, month + 1, 0);
            // setMinCTODate(minCTODate)
            setMaxCTODate(maxCTODate)

            var data =0;
            setTotalMonthHours(res.data)
            //limit only remaining CTO hours per month
            var total=0;
            for(var i = 4 ; i <= coc;){
                if(i>coc){
                    break;
                }else{
                    result.push(i)
                    total = i+data;
                    i = i +4;
                    if(total>=40){
                        break;
                    }
                }
            
            }
            setCTOHoursDropdown(result)
            setCurrentMonthCTO(data)
            setCTOInclusiveDates([])
            setCTOHours('')

        })
        
    },[currentMonth])
    const handleSetCTOHours = (value) =>{
        setCTOHours(value.target.value)
        setTempSelectedCTOInclusiveDates([])
    }
    const CTOHoursToDays = (data) =>{
        var days = data/8;
        return <em style={{color:red[800]}}><small>&nbsp;({days} {days<=1?'day':'days'})</small></em>;
    }
     /**
     * handler for updating the handleSetCTOInclusiveDates state
     */
     const handleSetCTOInclusiveDates = (value) => {
        setCTOInclusiveDates(value)
    }
    const handleSortCTOInclusiveDates = () => {
        var sorted = selectedCTOInclusiveDates.sort()
        var sortedTemp = selectedCTOInclusiveDates.sort()

        var days = Math.round(CTOHours/8);
        if(selectedCTOInclusiveDates.length > days){
            for (var i = selectedCTOInclusiveDates.length -1; i >= days; i--)
            sortedTemp.splice(i, 1);
        }
        var newTemp = [];
        sortedTemp.forEach(el=> {
            var t = {
                date:el,
                period:''
            };
            newTemp.push(t)
        })
        setTempSelectedCTOInclusiveDates(newTemp)
        var temp = [];
        var temp2 = [];
        for(var i = 0; i <sorted.length ; i++){
            //check if increment equals to sorted length
            if(i+1 !== sorted.length){
                // check if same month and year
                if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                    // check if consecutive dates
                    if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                        temp2.push(sorted[i].toDate())
                    }else{
                        temp2.push(sorted[i].toDate())
                        temp.push(temp2)
                        temp2 = []
                    }
                }else{
                    temp2.push(sorted[i].toDate())
                    temp.push(temp2)
                    temp2 = []
                }
            }else{
                temp2.push(sorted[i].toDate())
                temp.push(temp2)
            }
        }
        // console.log(temp)
        // setFinalSortedInclusiveDates(temp)
        var inclusiveDates = '';
        for(var x = 0 ; x<temp.length; x++){
            if(x+1 !== temp.length){
                if(temp[x].length !==1){
                    if(x ===0 ){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                            inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                            inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD YYYY, ')
                        }
                    }else{
                        // check if next and before array month and year is equal to current data
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                        moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format(',DD-')
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')
                        }else{
                            //check if before array month and year is equal to current data
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                            }
                        }
                    }
                }else{
                    if(x ===0){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                        }else{
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                        }
                    }else{
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                            }
                        }else{
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                            }
                        }
                    }
                    
                }
            }else{
                if(temp.length !== 1){
                    if(temp[x].length !== 1){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format(',DD-')
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                        }
                    }else{
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD,YYYY')
                        }else{
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY')
                        }
                    }
                }else{
                    if(temp[x].length !== 1){
                        inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                    }else{
                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD, YYYY')
                    }
                }
            }
        }
        // console.log(inclusiveDates)
        setctodatestext(inclusiveDates)
    }
    const handlePeriodChange = (data,key) => {
        // tempSelectedCTOInclusiveDates[key].period = data
        var temp = [...tempSelectedCTOInclusiveDates];
        temp[key].period = data;

        if(data === ''){
            for(var i = 0; i <temp.length ; i++){ 
                temp[i].disabled = false;
            }
        }else{
            for(var i = 0; i <temp.length ; i++){
                if(i === key){
                    temp[i].disabled = false;
                }else{
                    temp[i].disabled = true;
                }
            }
        }
        setTempSelectedCTOInclusiveDates(temp);

        var cto_dates = '';
        for (var i = 0 ; i <temp.length ; i++){
            var period = '';
            if(tempSelectedCTOInclusiveDates[i].period.length !==0){
                period = '-'+tempSelectedCTOInclusiveDates[i].period;
            }else{
                period = tempSelectedCTOInclusiveDates[i].period;
            }

            if(i === tempSelectedCTOInclusiveDates.length - 1){
                cto_dates += moment(tempSelectedCTOInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period;

            }else{
                cto_dates += moment(tempSelectedCTOInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period+', ';

            }

        }
        setctodatestext(cto_dates)
    }
    const handleCOCFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'||extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setCOCFile(fileReader.result)
            }
        }else{
            setCOCFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload a PDF or Image file.'
            })
        }
        
    }
    const handleSave = () => {
        var has_period = false;
        var format_date =[];
        if(CTOHours%8){
            for(var c = 0; c<tempSelectedCTOInclusiveDates.length ; c++){
                if(tempSelectedCTOInclusiveDates[c].period !== ''){
                    has_period = true;
                }
            }
        }else{
            has_period = true;

        }
        tempSelectedCTOInclusiveDates.forEach(el=>
            format_date.push({
                date:moment(el.date.toDate()).format('MM-DD-YYYY'),
                period:el.period.length === 0 ?'NONE':el.period
            })
        )
        if(CTOHours.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Oops..',
                html:'Please select no. of hours to apply.'
            })
        }else if(tempSelectedCTOInclusiveDates.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Oops..',
                html:'Please select Inclusive dates.'
            })
        }else if(!has_period){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please select a date period (AM,PM). This is required if inclusive dates has half-day.'
            })
        }else{
            if(multipleFileUpload.length === 0){
                Swal.fire({
                    icon:'warning',
                    title:'Oops..',
                    html:'Please upload Certificate of COC.'
                })
            }else{
                let days = CTOHours/8;
                var data = {
                    leave_type_id:23,
                    days_hours_applied:CTOHours ,
                    inclusive_dates:format_date,
                    days_with_pay:days,
                    days_without_pay:0,
                    balance:balance,
                    inclusive_dates_text:ctodatestext,
                    commutation:'',
                    coc_file:multipleFileUpload,
                    bal_as_of:moment().format('MMMM YYYY')
                }
                Swal.fire({
                    icon:'info',
                    title:'Saving data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                addLeaveApplication(data)
                .then((response)=>{
                    const data = response.data;
                    console.log(data)
                    if(data.status === 'success'){
                        // Swal.close()
                        setMultipleFileUpload([])
                        props.handleUpdateData();

                        Swal.fire({
                            icon:'success',
                            title:data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })

                    }else{
                        Swal.close()
                        toast.error(response.data.message)
                    }
                }).catch((error)=>{
                    Swal.close()
                    toast.error(error)
                    console.log(error)
                })
            }
        }
    }
    const [multipleFileUpload,setMultipleFileUpload] = useState([])
    const handleFile = async (e) =>{
        var len = e.target.files.length;
        var i = 0;
        var files = [...multipleFileUpload];
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
                // // setCOCFile(event.target.files[0])
                // // let files = e.target.files;
                
                // let fileReader = new FileReader();
                // fileReader.readAsDataURL(e.target.files[i]);
                
                // fileReader.onload = (event) => {
                //     multipleFileUpload.push({
                //         filename:file,
                //         data:fileReader.result
                //     })
                //     // setMultipleFileUpload(fileReader.result)
                //     // setsingleFile(fileReader.result)
                // }
            }else{
                // setMultipleFileUpload('')
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Please upload PDF or Image file.'
                })
            }
        }
        setMultipleFileUpload(files)
    }
    const handleRemoveFile = (index)=>{
        var t_file = [...multipleFileUpload];
        t_file.splice(index,1);
        setMultipleFileUpload(t_file)
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12} sx = {{textAlign:'center'}} >
            <Typography sx={{background:blue[900],color:'#fff',padding:'10px 15px',boxShadow: '3px 5px 10px #08449d'}}
            >
            <span>AVAILABLE BALANCE: <strong>{balance.toFixed(3)} HOURS </strong></span>
            </Typography>
            </Grid>
            <Grid item xs={12} sx={{mt:1}}>
                <Typography sx={{color:'#353232',fontSize:'.8em'}}>Select Month to Apply *</Typography>
                <DatePicker
                    onlyMonthPicker
                    value = {currentMonth}
                    onChange={handleCurrentMonth}
                    containerStyle={{
                        width: "100%"
                    }}
                    render={<InputIcon/>}

                    // render={(value, openCalendar) => {
                    //     return (
                    //     <button onClick={openCalendar} className = "custom-inclusive-dates">
                    //         <InputIcon/>
                    //     </button>
                        
                    //     )
                    // }}
                    minDate = {new Date()}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl fullWidth>
                <InputLabel id="cto-hours-select-label">No. of Hours to Apply</InputLabel>
                <Select
                    labelId="cto-hours-select-label"
                    id="cto-hours-select"
                    value={CTOHours}
                    label="No. of Hours to Apply"
                    // onChange={handleChange}
                    onChange={handleSetCTOHours}
                    // onBlur ={(val)=>checkCTOHours(val.target.value)}
                >
                    {CTOHoursDropdown.map((data,key)=>
                        <MenuItem key = {key} value ={data}>{data} {CTOHoursToDays(data)}</MenuItem>
                    )}
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                <DatePicker
                    value = {selectedCTOInclusiveDates}
                    onChange = {handleSetCTOInclusiveDates}
                    multiple
                    plugins={[
                    <DatePanel />
                    ]}
                    // minDate={minCTODate}
                    minDate = {moment(currentMonth).format('MM') === moment().format('MM') && moment(currentMonth).format('YYYY') ===  moment().format('YYYY') ? moment().add(1,'days').format('YYYY-MM-DD'):minCTODate}
                    maxDate={maxCTODate}
                    currentDate={currentMonth}
                    render={<InputIcon/>}
                    // render={(value, openCalendar) => {
                    //     return (
                    //     <button onClick={openCalendar} className = "custom-inclusive-dates">
                    //         <InputIcon/>
                    //     </button>
                        
                    //     )
                    // }}
                 
                    containerStyle={{
                        width: "100%"
                    }}
                    mapDays={({ date }) => {
                    //     let props = {}
                    //     let isWeekend = [0, 6].includes(date.weekDay.index)
                    //     let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                    //     // if (isWeekend) props.className = "disabled-date"
                    //     if (isWeekend) props.className = "highlight highlight-red"

                    //     var days = Math.round(CTOHours/8);
                       
                    //     let temp;
                    //     let hasSched;

                    //     workScheduleData.forEach(el=>{
                    //         if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                    //             temp=el.details;
                    //         }
                    //     })
                    //     if(temp){
                    //         temp.forEach(el2=>{
                    //             if(el2.day ===moment(new Date(date)).format('D')){
                    //                 hasSched = true
                    //             }
                    //         })
                    //     }else{
                    //         hasSched = false;
                    //     }
                    //     if(selectedCTOInclusiveDates.length>=5){
                    //         props.disabled = true;
                    //     }else{
                    //         if(selectedCTOInclusiveDates.length>=days){
                    //             props.disabled = true;
                    //         }
                    //     }
                    //     if(isDisabled) props.disabled=true;
                    //     if(!hasSched) props.disabled=true;
                     
                    //     return props
                    // }}
                    // onClose = {handleSortCTOInclusiveDates}
                    let props = {}
                        let isWeekend = [0, 6].includes(date.weekDay.index)
                        let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                        // if (isWeekend) props.className = "disabled-date"
                        if (isWeekend) props.className = "highlight highlight-red"

                        var days = Math.round(CTOHours/8);
                        // if(CTOHoursDropdown.length ===0){
                        //     props.disabled = true;
                        // }else{
                            
                        // }
                        let isHoliday = false;
                        let holiday_desc;
                        holidays.forEach(hol=>{
                            let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                            let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                            let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                            if(target_date >=date_1 && target_date <= date_2){
                                isHoliday = true;
                                holiday_desc = hol.holiday_desc
                            }

                        })
                        if (isHoliday){
                            props.className = "highlight highlight-red holiday"
                            props.title=holiday_desc
                        }
                        let temp;
                        let hasSched;

                        workScheduleData.forEach(el=>{
                            if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                temp=el.details;
                            }
                        })
                        if(temp){
                            temp.forEach(el2=>{
                                if(el2.day ===moment(new Date(date)).format('D')){
                                    hasSched = true
                                }
                            })
                        }else{
                            hasSched = false;
                        }
                        if(selectedCTOInclusiveDates.length>=5){
                            props.disabled = true;
                        }else{
                            if(selectedCTOInclusiveDates.length>=days){
                                props.disabled = true;
                            }
                        }
                        if(isDisabled) props.disabled=true;
                        if(!hasSched) props.disabled=true;
                        
                        // for(var i = 0 ;i<alreadyAppliedDays.length;i++){
                        //     if(moment(new Date(date)).format('MM-DD-YYYY') === alreadyAppliedDays[i]){
                        //         props.disabled = true;
                        //     }
                        // }
                        
                        return props
                    }}
                    onClose = {handleSortCTOInclusiveDates}
                    // disabled = {CTOHours !== '0' ? false:true}
                />
                </Grid>
                {/* <Grid item xs={12}>
                    <small style={{fontSize:'10px',float:'right'}}><em>*maximum of 40 hours per month</em></small>
                    <table className='table' style = {{fontSize:'12px'}}>
                        <thead style={{background:'#1976d2',color:'#fff',border:'solid 2px #fff'}}>
                            <tr>
                                <th>Selected Month</th>
                                <th>Already Applied</th>
                                <th>Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{currentMonth.format('MMMM YYYY')}</td>
                                <td>{totalMonthHours}</td>
                                <td>{40-totalMonthHours}</td>
                            </tr>
                            
                        </tbody>
                        
                    </table>
                </Grid> */}
                {
                    tempSelectedCTOInclusiveDates.length !==0
                    ?
                        CTOHours%8
                        ?
                            tempSelectedCTOInclusiveDates.map((data,key)=>
                            <Grid item xs={12} sm={12} md = {12} lg ={12}
                                key = {key}>
                                {
                                    key === 0
                                    ?
                                    <Typography sx={{color:'#353232',fontSize:'.8em',marginBottom:'7px'}}>Select date period *</Typography>
                                    :
                                    ''
                                }
                                <FormControl fullWidth disabled = {data.disabled ? true:false}>
                                <InputLabel id="demo-simple-select-label"> {moment(data.date.toDate()).format('MMMM DD, YYYY')} Period</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.period}
                                    label={moment(data.date.toDate()).format('MMMM DD, YYYY')+" Period"}
                                    onChange={(value) => handlePeriodChange(value.target.value,key)}
                                >
                                    <MenuItem value='AM'>AM</MenuItem>
                                    <MenuItem value='PM'>PM</MenuItem>
                                    <MenuItem value=''>NONE</MenuItem>
                                </Select>
                                </FormControl>
                            </Grid>

                            )
                        :
                        ''
                        
                    :
                    ''
                    
                }
                
                {ctodatestext.length !==0
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Inclusive Dates Selected' fullWidth  value = {ctodatestext} InputLabelProps={{ shrink: true }} readOnly />
                        </Grid>
                        :
                        ''
                }
                {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Tooltip title="Please upload a PDF / Image File" placement='top'>
                    <TextField type = "file" label="Certificate of COC *" fullWidth InputLabelProps={{shrink:true}} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }}onChange = {handleCOCFile} disabled={CTOHoursDropdown.length ===0 ||                                                                                                              CTOHours === '0' || selectedCTOInclusiveDates.length === 0 ?  true:false}/>
                    </Tooltip>
                </Grid> */}
                <Grid item xs={12}>
                    <Typography sx={{fontSize:'.8rem'}}>CETO *</Typography>
                    <label htmlFor={"contained-button-file"} style={{width:'100%'}} required>
                    <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)} multiple/>
                    
                    <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' }, flex: 1 ,height:55}}> {multipleFileUpload.length ===0?<Tooltip title='No file uploaded'><WarningAmberOutlinedIcon size='small' color='error'/></Tooltip>:''} <AttachFileOutlinedIcon fontSize='small'/>Upload File </Button>
                    </label>
                    {
                        multipleFileUpload.length>0
                        ?
                        <Grid item container sx={{display:'flex',justifyContent:'space-between'}}>
                        {
                            multipleFileUpload.map((row,key)=>
                            <Grid item xs={6} lg={4} sx={{border:'solid 1px #e9e9e9',borderRadius:'20px',pl:1}}>
                            <small style={{display:'flex',justifyContent:'space-between',alignItems:'center', fontSize:'.7rem'}} key={key}>{row.filename} <Tooltip title='Remove file'><IconButton onClick={()=>handleRemoveFile(key)}><DeleteIcon color='error' sx={{fontSize:'15px'}}/></IconButton></Tooltip></small>
                            </Grid>
                            
                        )}
                        </Grid>
                        :
                        null
                    }
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='outlined' fullWidth onClick={handleOpen} disabled={CTOHours === 0 || ctodatestext.length === 0 ? true:false}>Preview Form</Button>
                    </Grid>
                <Grid item xs = {12} sx={{display:'flex',justifyContent:'flex-end'}}>
                    <Button variant='contained' color='success' onClick={handleSave} className='custom-roundbutton'>Save</Button>
                </Grid>
                <LargeModal open={open} close={handleClose} title='Preview TO Application'>
                    <Box sx={{maxHeight:'80vh',overflowY:'scroll',mb:1,pb:1}}>
                        <PreviewCTOApplicationForm2 info = {props.empInfo.info} authInfo = {props.empInfo.auth_info} aoInfo ={props.empInfo.office_ao_info} deptHead = {props.empInfo.office_assign_info} hours={CTOHours} dates={ctodatestext} availableCOC  = {props.availableCOC}/>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Button variant='contained' color='primary' onClick={handleClose}>Ok</Button>
                    </Box>
                </LargeModal>
                {/* <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Preview Application
                        </Typography>
                        <Box sx={{maxHeight:'80vh',overflowY:'scroll',mb:1,pb:1}}>
                            <PreviewCTOApplicationForm2 info = {props.empInfo.info} authInfo = {props.empInfo.auth_info} aoInfo ={props.empInfo.office_ao_info} deptHead = {props.empInfo.office_assign_info} hours={CTOHours} dates={ctodatestext} availableCOC  = {props.availableCOC}/>
                        </Box>
                        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Button variant='contained' color='primary' onClick={handleClose}>Ok</Button>
                        </Box>
                    </Box>
                </Modal> */}
        </Grid>
    )
}