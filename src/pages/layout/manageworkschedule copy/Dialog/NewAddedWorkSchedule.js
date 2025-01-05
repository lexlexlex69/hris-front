import { Grid, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Tooltip, IconButton,Modal,TextField,Button } from '@mui/material';
import React,{useState} from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PeopleIcon from '@mui/icons-material/People';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue,red,green } from '@mui/material/colors';
import { approvedAddedWorkSched, disapprovedNewlyAddedWorkSched, postWorkSchedAPI } from '../WorkScheduleRequest';
import Swal from 'sweetalert2';
import moment from 'moment';
import { el } from 'date-fns/locale';
import { api_url } from '../../../../request/APIRequestURL';

export default function NewAddedWorkSchedule(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [empListModal,setEmpListModal] = useState(false)
    const [empListModalName,setEmpListModalName] = useState('')
    const [empListData,setEmpListData] = useState([])
    const [openDisapproved, setOpenDisapproved] = React.useState(false);
    const [reason,setReason] = useState('');
    const [selectedIDS,setSelectedIDS] = useState([]);

    const handleOpenDisapproved = () => setOpenDisapproved(true);
    const handleCloseDisapproved = () => setOpenDisapproved(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:'10px',
        boxShadow: 24,
        p:2,
    };
    const empListStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':'70vw',
        minHeight:450,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    const handleViewEmplist = (row)=>{
        console.log(row)
        setEmpListData(JSON.parse(row.emp_details))
        setEmpListModalName(row.short_name)
        setEmpListModal(true)
    }
    const formatDetails = (row)=>{
        return (
            <div style={{display:'flex',alignItems:'center'}}>
            
            <Box>
            <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>Working Days</Typography>
            <ul>
                {JSON.parse(row.working_days).map((row,key)=>
                    <li key={key}>{row.day} <small style={{color:blue[800]}}><em>({row.whrs_desc})</em></small></li>
                )}
            </ul>
            <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>Rest Days</Typography>
            <ul>
                {JSON.parse(row.rest_days).map((row,key)=>
                    <li key={key}>{row.day}</li>
                )}
            </ul>
            </Box>
            <Box>
            <Tooltip title='Show list of employee'><IconButton color='primary' className='custom-iconbutton' onClick={()=>handleViewEmplist(row)}><FormatListBulletedIcon/></IconButton></Tooltip>
            </Box>
            </div>
            
        )
    }
    const handleApproved = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'info',
            title:'Approving work schedule',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var t_data = {
            dept_code:row.dept_code,
            year:row.year,
            template_id:row.template_id
        }
        
        let days = JSON.parse(row.working_days)
        /**
            * Get day names
            */
        let temp_d_name = [];
        days.forEach(el=>{
            temp_d_name.push(el.day);
        })
        let sched_days = [];
        let rest_days = [];
       
        let t_monthly_sched = [];
        var m = moment();
        
        let t_sched_month = []
        
        // console.log(t_sched_month)
        /**
        Limit only 35 whrs-code per month
        */
        var t_sched_month2 = [];
         /**
        Check if specific months
         */
        if(JSON.parse(row.months).length >0){
            JSON.parse(row.months).forEach((el,i)=>{
                let start_date = new Date(row.year,moment().month(el).format('M')-1,1);
                let end_date = new Date(row.year,moment().month(el).format('M'),0);

               

                while(moment(start_date,'MM-DD-YYYY').format('YYYY-MM') <= moment(end_date,'MM-DD-YYYY').format('YYYY-MM')){
                    if(temp_d_name.includes(moment(start_date,'MM-DD-YYYY').format('dddd'))){
                        for(var i = 0 ;i<days.length ;i++){
                            if(days[i].day === moment(start_date,'MM-DD-YYYY').format('dddd')){
                                var sched_data = {
                                    whrs_code:days[i].whrs_code,
                                    date1:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                    date2:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                }
                                sched_days.push(sched_data)
                            } 
                        }
                    }else{
                        var t_week = '';
                        var index = start_date.getDay()
                        for(var l=0;l<7;l++){
                            if(l===0){
                                if(l=== index){
                                    t_week+='1'+';';
                                }else{
                                    t_week+='0'+';';
                                }
                            }else{
                                if(l===6){
                                    if(l=== index){
                                        t_week+='1';
                                    }else{
                                        t_week+='0';
                                    }
                                }else{
                                    if(l=== index){
                                        t_week+='1'+';';
                                    }else{
                                        t_week+='0'+';';
                                    }
                                }
                            }
                            
                        }
                        // console.log(moment(start_date).format('MM-DD-YYYY'))
                        // console.log(t_week)
                        var res_sched_data = {
                            date1:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                            date2:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                            month:moment(start_date,'MM-DD-YYYY').format('M'),
                            year:row.year,
                            rest_day:t_week
                        }   
                        rest_days.push(res_sched_data)

                    }
                    start_date.setDate(start_date.getDate()+1)
                }

                var t_start_date = new Date(row.year,moment().month(el).format('M')-1,1);
                var t_end_date = new Date(row.year,moment().month(el).format('M'),0);
                var t_sched_list = '';

                t_monthly_sched.push(moment().month(el).format('M'))
                
                /**
                * Loop all days every month
                */
                
                if(t_start_date.getDay()>0){
                    /**
                    Get days from previous month
                    */
                    if(i===0){
                        // console.log(new Date(row.year-1,i,0));
                        var t_count = 0;
                        var t_start_end = new Date(moment(new Date(row.year,moment().month(el).format('M')-1,0)).subtract('days',t_start_date.getDay()-1));
                        // console.log(t_start_end)
                        for(t_count;t_count<t_start_date.getDay();t_count++){
                            if(temp_d_name.includes(moment(t_start_end,'MM-DD-YYYY').format('dddd'))){
                                for(var k = 0 ;k<days.length ;k++){
                                    if(days[k].day === moment(t_start_end,'MM-DD-YYYY').format('dddd')){
                                        t_sched_list+=days[k].whrs_code+';'
                                    }
                                }
                            }else{
                                t_sched_list+=0+';'
                            }
                            t_start_end.setDate(t_start_end.getDate()+1)

                        }
                        // console.log(new Date(row.year,i,0));
                    }else{
                        var t_count = 0;
                        var t_start_end = new Date(moment(new Date(row.year,moment().month(el).format('M'),0)).subtract('days',t_start_date.getDay()-1));
                        for(t_count;t_count<t_start_date.getDay();t_count++){
                            if(temp_d_name.includes(moment(t_start_end,'MM-DD-YYYY').format('dddd'))){
                                
                                for(var k = 0 ;k<days.length ;k++){
                                    if(days[k].day === moment(t_start_end,'MM-DD-YYYY').format('dddd')){
                                        t_sched_list+=days[k].whrs_code+';'
                                    }
                                }

                            }else{
                                t_sched_list+=0+';'


                            }
                            t_start_end.setDate(t_start_end.getDate()+1)
                        }
                    }

                }
                while(moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD') <= moment(t_end_date,'MM-DD-YYYY').format('YYYY-MM-DD')){
                    
                    if(moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD') === moment(t_end_date,'MM-DD-YYYY').format('YYYY-MM-DD')){
                        if(temp_d_name.includes(moment(t_start_date,'MM-DD-YYYY').format('dddd'))){
                            for(var x = 0 ;x<days.length ;x++){
                                if(days[x].day === moment(t_start_date,'MM-DD-YYYY').format('dddd')){
                                    t_sched_list+=days[x].whrs_code
                                }
                            }
                        }else{
                            t_sched_list+=0
                        }
                    }else{
                        if(temp_d_name.includes(moment(t_start_date,'MM-DD-YYYY').format('dddd'))){
                            for(var x = 0 ;x<days.length ;x++){
                                if(days[x].day === moment(t_start_date,'MM-DD-YYYY').format('dddd')){
                                    
                                    t_sched_list+=days[x].whrs_code+';'
                                }
                            }
                        }else{
                            t_sched_list+=0+';'


                        }
                    }
                    
                    t_start_date.setDate(t_start_date.getDate()+1)
                }

                t_sched_month.push({
                    'whrs_code':t_sched_list,
                    "sched_month": moment().month(el).format('M'),
                    "sched_year": row.year
                })
            })
        }else{
            let start_date = new Date(row.year,0,1);
            let end_date = new Date(row.year,12,1);
            while(parseInt(moment(start_date,'MM-DD-YYYY').format('YYYY')) <= row.year){
                if(temp_d_name.includes(moment(start_date,'MM-DD-YYYY').format('dddd'))){
                    for(var i = 0 ;i<days.length ;i++){
                        if(days[i].day === moment(start_date,'MM-DD-YYYY').format('dddd')){
                            var sched_data = {
                                whrs_code:days[i].whrs_code,
                                date1:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                date2:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                            }
                            sched_days.push(sched_data)
                        } 
                    }
                }else{
                    var t_week = '';
                    var index = start_date.getDay()
                    for(var l=0;l<7;l++){
                        if(l===0){
                            if(l=== index){
                                t_week+='1'+';';
                            }else{
                                t_week+='0'+';';
                            }
                        }else{
                            if(l===6){
                                if(l=== index){
                                    t_week+='1';
                                }else{
                                    t_week+='0';
                                }
                            }else{
                                if(l=== index){
                                    t_week+='1'+';';
                                }else{
                                    t_week+='0'+';';
                                }
                            }
                        }
                        
                    }
                    // console.log(moment(start_date).format('MM-DD-YYYY'))
                    // console.log(t_week)
                    var res_sched_data = {
                        date1:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                        date2:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                        month:moment(start_date,'MM-DD-YYYY').format('M'),
                        year:row.year,
                        rest_day:t_week
                    }   
                    rest_days.push(res_sched_data)

                }
                start_date.setDate(start_date.getDate()+1)
                // console.log(moment(start_date,'MM-DD-YYYY').format('dddd'))
                
            }
            for (var i = 0; i < 12; i++) {
                t_monthly_sched.push(m.months(i).format('M'))
                // console.log(new Date(row.year,i,1).getDay())
                /**
                * Loop all days every month
                */
                
                var t_sched_list = '';
                var t_start_date = new Date(row.year,i,1);
                var t_end_date = new Date(row.year,i+1,0);
                // for(var j = 0 ; j<t_start_date.getDay();j++){
                //     t_sched_list+='0;'
                // }
                if(t_start_date.getDay()>0){
                    /**
                    Get days from previous month
                    */
                    if(i===0){
                        // console.log(new Date(row.year-1,i,0));
                        var t_count = 0;
                        var t_start_end = new Date(moment(new Date(row.year,i-1,0)).subtract('days',t_start_date.getDay()-1));
                        // console.log(t_start_end)
                        for(t_count;t_count<t_start_date.getDay();t_count++){
                            if(temp_d_name.includes(moment(t_start_end,'MM-DD-YYYY').format('dddd'))){
                                for(var k = 0 ;k<days.length ;k++){
                                    if(days[k].day === moment(t_start_end,'MM-DD-YYYY').format('dddd')){
                                        t_sched_list+=days[k].whrs_code+';'
                                    }
                                }
                            }else{
                                t_sched_list+=0+';'
                            }
                            t_start_end.setDate(t_start_end.getDate()+1)

                        }
                        // console.log(new Date(row.year,i,0));
                    }else{
                        var t_count = 0;
                        var t_start_end = new Date(moment(new Date(row.year,i,0)).subtract('days',t_start_date.getDay()-1));
                        // console.log(t_start_date.getDay())
                        // console.log(new Date(row.year,i,0))
                        // console.log(t_start_end)
                        for(t_count;t_count<t_start_date.getDay();t_count++){
                            if(temp_d_name.includes(moment(t_start_end,'MM-DD-YYYY').format('dddd'))){
                                
                                for(var k = 0 ;k<days.length ;k++){
                                    if(days[k].day === moment(t_start_end,'MM-DD-YYYY').format('dddd')){
                                        t_sched_list+=days[k].whrs_code+';'
                                    }
                                }

                            }else{
                                t_sched_list+=0+';'


                            }
                            t_start_end.setDate(t_start_end.getDate()+1)

                            // console.log(moment(t_start_end).format('MM-DD-YYYY'))
                        }
                        // console.log(new Date(row.year,i,0));
                    }

                }
                // console.log(t_start_date.getDay())

                // console.log(m.months(i).format('M'))
                // console.log(t_sched_list)
                // console.log(t_end_date)
                while(moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD') <= moment(t_end_date,'MM-DD-YYYY').format('YYYY-MM-DD')){
                    
                    if(moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD') === moment(t_end_date,'MM-DD-YYYY').format('YYYY-MM-DD')){
                        if(temp_d_name.includes(moment(t_start_date,'MM-DD-YYYY').format('dddd'))){
                            for(var x = 0 ;x<days.length ;x++){
                                if(days[x].day === moment(t_start_date,'MM-DD-YYYY').format('dddd')){
                                    // var sched_data = {
                                    //     whrs_code:days[i].whrs_code,
                                    //     date1:moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                    //     date2:moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                    // }
                                    // sched_days.push(sched_data)
                                    t_sched_list+=days[x].whrs_code
                                }
                            }
                        }else{
                            t_sched_list+=0
                        }
                    }else{
                        if(temp_d_name.includes(moment(t_start_date,'MM-DD-YYYY').format('dddd'))){
                            for(var x = 0 ;x<days.length ;x++){
                                if(days[x].day === moment(t_start_date,'MM-DD-YYYY').format('dddd')){
                                    // var sched_data = {
                                    //     whrs_code:days[i].whrs_code,
                                    //     date1:moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                    //     date2:moment(t_start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                    // }
                                    // sched_days.push(sched_data)
                                    t_sched_list+=days[x].whrs_code+';'
                                }
                            }
                        }else{
                            t_sched_list+=0+';'


                        }
                    }
                    
                    // console.log(moment(t_start_date).format('MM-DD-YYYY'))
                    t_start_date.setDate(t_start_date.getDate()+1)
                    // console.log(moment(start_date,'MM-DD-YYYY').format('dddd'))
                }

                t_sched_month.push({
                    'whrs_code':t_sched_list,
                    "sched_month": m.months(i).format('M'),
                    "sched_year": row.year
                })
            }
        }
        
       
        t_sched_month.forEach(sched=>{
            var t_arr = sched.whrs_code.split(';');
            /**
            Get dates to complete the 35
            */
            // console.log(sched.sched_month)
            // console.log(t_arr.length)
            if(t_arr.length<35){
                var t_missing = 35-t_arr.length;
                var t_t_sched_list = sched.whrs_code+';';

            }else{
                var t_missing = 0;
                var t_t_t_sched_list = '';
                t_arr.splice(35,t_arr.length)
                // console.log(t_arr)
                t_arr.forEach((el,key)=>{
                    if(key === t_arr.length-1){
                        t_t_t_sched_list+=el;
                    }else{
                        t_t_t_sched_list+=el+';'
                    }
                    // t_t_t_sched_list+=el;
                    // console.log(el)
                })
                var t_t_sched_list = t_t_t_sched_list;

            }
            if(t_missing>0){
                var t_start_missing = 0;
                var t_start_missing_date = new Date(sched.sched_year,sched.sched_month,1);
                for(t_start_missing;t_start_missing<t_missing;t_start_missing++){
                    if(t_start_missing === t_missing-1){
                        if(temp_d_name.includes(moment(t_start_missing_date,'MM-DD-YYYY').format('dddd'))){
                            for(var k = 0 ;k<days.length ;k++){
                                if(days[k].day === moment(t_start_missing_date,'MM-DD-YYYY').format('dddd')){
                                    t_t_sched_list+=days[k].whrs_code
                                }
                            }

                        }else{
                            t_t_sched_list+=0

                        }
                    }else{
                        if(temp_d_name.includes(moment(t_start_missing_date,'MM-DD-YYYY').format('dddd'))){
                            for(var k = 0 ;k<days.length ;k++){
                                if(days[k].day === moment(t_start_missing_date,'MM-DD-YYYY').format('dddd')){
                                    t_t_sched_list+=days[k].whrs_code+';'
                                }
                            }

                        }else{
                            t_t_sched_list+=0+';'

                        }
                    }
                    
                    // console.log(moment(t_start_missing_date).format('MM-DD-YYYY'))
                    t_start_missing_date.setDate(t_start_missing_date.getDate()+1)

                    // console.log(moment(t_start_end).format('MM-DD-YYYY'))
                }
            }
            
            // console.log(t_t_sched_list)
            // console.log(sched.sched_month);
            // console.log(t_t_sched_list)
            t_sched_month2.push({
                'whrs_code':t_t_sched_list,
                "sched_month": sched.sched_month,
                "sched_year": sched.sched_year
            })
        })
        /**
        Get rest days
         */
        
        t_sched_month2.forEach(sched=>{
             var t_arr = sched.whrs_code.split(';');
            //  console.log(sched.sched_month)
            //  console.log(t_arr.length)
        })
        // console.log(t_sched_month2)


        let fin_sched_days = [];
        let selectedEmployees = JSON.parse(row.emp_details);
        let sched_month = []
        let sched_month_rest_days = []
        selectedEmployees.forEach(el => {
            sched_days.forEach(el2=>{
                var d = {
                    emp_no:el.emp_no,
                    whrs_code:el2.whrs_code,
                    date1:el2.date1,
                    date2:el2.date2,
                }
                fin_sched_days.push(d)
            })
            t_sched_month2.forEach(el3=>{
                sched_month.push({
                    emp_no:el.emp_no,
                    sched_month:el3.sched_month,
                    sched_year:el3.sched_year,
                    whrs_code:el3.whrs_code,
                })
            })
            rest_days.forEach(el3=>{
                sched_month_rest_days.push({
                    emp_no:el.emp_no,
                    date1:el3.date1,
                    date2:el3.date2,
                    month:el3.month,
                    year:el3.year,
                    rest_day:el3.rest_day
                })
            })
        });
        console.log(sched_month_rest_days)
        var emp_list = []
        selectedEmployees.forEach(el=>{
            emp_list.push(el.emp_no)
        })
        var d2 = {
            'data':fin_sched_days,
            'key':'b9e1f8a0553623f1:639a3e:17f68ea536b',
            'year':row.year,
            'emp_list':emp_list,
            'sched_month':sched_month,
            'rest_days':sched_month_rest_days,
            api_url:api_url,
            updated_data:row.updated_data,
            removed_data:row.removed_data,
            type:1
        }
        // Swal.close();
        console.log(d2)
        postWorkSchedAPI(d2)
            .then(res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    approvedAddedWorkSched(t_data)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 200){
                            props.setNewAddWorkScheduleData(res.data.data)

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
                        console.log(err)
                        Swal.close();
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
        }).catch(err=>{
            console.log('here')
            window.open(api_url)
                Swal.fire({
                    icon:'error',
                    title:err
            })
        })
        
        
    }
    const handleDisApproved = (row,type)=>{
        console.log(row);
        //1 - all , 0 - specific
        handleOpenDisapproved()
        var ids = [];
        if(type === 0){
            ids.push(row.work_sched_id)
            setSelectedIDS(ids)
        }else{
            JSON.parse(row.emp_details).forEach(el=>{
                ids.push(el.work_sched_id)
            })
            setSelectedIDS(ids)
        }
        
    }
    const handleSubmitDisapproved = (e)=>{
        e.preventDefault();
        var t_data = {
            ids:selectedIDS,
            reason:reason
        }
        console.log(t_data)
        disapprovedNewlyAddedWorkSched(t_data)
        .then(res=>{
            if(res.data.status === 200){
                handleCloseDisapproved()
                setSelectedIDS([])
                setReason('')
                setEmpListModal(false)
                props.setNewAddWorkScheduleData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })

            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <Box sx={{m:2}}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper>
                    <TableContainer sx={{maxHeight:'80vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                    Office/Department
                                    </TableCell>
                                    <TableCell>
                                    Schedule Details
                                    </TableCell>
                                    <TableCell>
                                    Year
                                    </TableCell>
                                    <TableCell>
                                    Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.data.map((row,key)=>
                                        <TableRow index={key}>
                                            <TableCell>{row.dept_title}</TableCell>
                                            <TableCell>{formatDetails(row)}</TableCell>
                                            <TableCell>{row.year}</TableCell>
                                            <TableCell>
                                            <Tooltip title='Approved'><IconButton color='success' className='custom-iconbutton' onClick = {()=>handleApproved(row)}><ThumbUpIcon/></IconButton></Tooltip>
                                            &nbsp;
                                            <Tooltip title='Disapproved'><IconButton color='error' className='custom-iconbutton' onClick={()=>handleDisApproved(row,1)}><ThumbDownIcon/></IconButton></Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Paper>
                    <Modal
                        open={empListModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box sx={empListStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setEmpListModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            {empListModalName+"'s"} Employee List
                            </Typography>
                            <Box sx={{mt:1,p:1}}>
                                <Paper>
                                    <Box sx = {{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                    <IconButton><PeopleIcon/></IconButton>
                                    <Typography>{empListData.length}</Typography>
                                    
                                    </Box>

                                    <TableContainer sx={{maxHeight:'60vh'}}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        Employment Status
                                                    </TableCell>
                                                    <TableCell>
                                                        Employee Position
                                                    </TableCell>
                                                    <TableCell>
                                                        Actions
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {empListData.map((row,key)=>
                                                    <TableRow key={key} hover>
                                                        <TableCell>
                                                            {row.emp_lname}, {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+'.':''}
                                                            
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.emp_status}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.position_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title='Disapproved'><IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDisApproved(row,0)}><ThumbDownIcon/></IconButton></Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>

                            </Box>
                        </Box>

                    </Modal>
                    <Modal
                        open={openDisapproved}
                        onClose={handleCloseDisapproved}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        <form onSubmit={handleSubmitDisapproved}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:1}}>
                                Please specify reason for disapproval
                            </Typography>
                            <TextField label='Reason' value = {reason} onChange={(val)=>setReason(val.target.value)} fullWidth required/>
                            <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                                <Button color='success' variant='contained' className='custom-roundbutton' size='small' type='submit'>Submit</Button>
                                &nbsp;
                                <Button color='error' variant='contained' className='custom-roundbutton'  size='small' onClick={handleCloseDisapproved}>Cancel</Button>
                            </Box>
                        </form>
                        </Box>
                    </Modal>
                </Grid>
            </Grid>
        </Box>
    )
}