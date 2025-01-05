import React,{useEffect, useState} from 'react';
import { Grid,Box,Skeleton,Paper,Fade,Typography,Button, TextField,Autocomplete,FormGroup,FormControlLabel,Checkbox,Tooltip, breadcrumbsClasses } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { blue, green, red, yellow } from '@mui/material/colors';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getOffices, getOfficeEmployee, getEmployeeSchedule, postOBRectification, postOBScheduleAPI,updateOBInserted } from '.././DTRRequest';
import { ThemeProvider , createTheme } from '@mui/material/styles';
import moment from 'moment';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Swal from 'sweetalert2';

const CUSTOMTHEME = createTheme({
    typography: {
        allVariants:{
            // fontSize: '.9rem',
            color:blue[800]
        }
    }
});
export default function AddOB(props){
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
    useEffect(()=>{
        getOffices()
        .then(res=>{
            setOfficeData (res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])

    const handleChangeOffice = (value) => {
        if(value !==null){
            var data2 = {
                dept_code:value.dept_code
            }
            getOfficeEmployee(data2)
            .then(res=>{
                console.log(res.data)
                setData(res.data)
            }).catch(err=>{
                console.log(err)
            })
            setSelectedOffice(value);

        }else{
            setSelectedOffice(null);

        }

    };
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
            selector:row=>row.emp_lname +', '+row.emp_fname+' '+ row.emp_mname.charAt(0)+'. '
        }
    ]
    const tableData = {
        data,
        columns
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
                if(res.data.length === 0){
                    Swal.fire({
                        icon:'error',
                        title:'Selected Employee has no schedule'
                    })
                }else{
                    setScheduleDate(res.data.schedule)
                    setAppliedDays(res.data.applied)
                }
            }).catch(err=>{
                console.log(err)
            })
            setSelectedEmp(row)
            setEmpNo(row.emp_no)
            setEmpName(row.emp_fname+' '+row.emp_mname.charAt(0)+'. '+row.emp_lname)
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

        var sched = JSON.parse(scheduleDate[0].working_days);
        console.log(sched)
        var start_date = new Date(coveredDateFrom);
        var end_date = new Date(value.target.value);
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
        console.log(temp_date)
        setCoveredDays(temp_date)
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
                    if(element.remarks === ''){
                        arr = {
                            date:moment(element.date).format('YYYY-MM-DD'),
                            time_in:element.time_in,
                            time_out:element.time_out,
                            break_in:element.break_in,
                            break_out:element.break_out,
                            time_in_details:element.time_out_details,
                            time_out_details:element.time_out_details,
                            break_in_details:element.break_in_details,
                            break_out_details:element.break_out_details,
                            remarks:'OFT'
                        }
                    }else{
                        arr = {
                            date:moment(element.date).format('YYYY-MM-DD'),
                            time_in:element.time_in,
                            time_out:element.time_out,
                            break_in:element.break_in,
                            break_out:element.break_out,
                            time_in_details:element.time_out_details,
                            time_out_details:element.time_out_details,
                            break_in_details:element.break_in_details,
                            break_out_details:element.break_out_details,
                            remarks:element.remarks
                        }
                    }
                    temp_covered_days.push(arr);
                });
                var data2 = {
                    emp_no:selectedEmp.emp_no,
                    dept_code:selectedEmp.dept_code,
                    days_details:temp_covered_days,
                    date_from:coveredDateFrom,
                    date_to:coveredDateTo,
                    date_filed:moment(new Date()).format('YYYY-MM-DD'),
                    encode_time:moment(new Date()).format('H:mm'),
                }
                // console.log(data2)
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
                        let id = res.data.id;
                        data2.encoder = res.data.encoder;
                        data2.encoder_position = res.data.position;
                        postOBScheduleAPI(data2)
                        .then(res=>{
                            if(res.data.status === 200){
                                var data3 = {
                                    ob_ot_no:res.data.ob_ot_no,
                                    id:id
                                }
                                updateOBInserted(data3)
                                .then(res=>{
                                    console.log(res)
                                }).catch(err=>{
                                    console.log(err)
                                })
                                setCoveredDateFrom('')
                                setCoveredDateTo('')
                                setCoveredDays([])
                                Swal.fire({
                                    icon:'success',
                                    title:res.data.message,
                                    timer:1500,
                                    showConfirmButton:false
                                })
                            }else{
                                /**
                                 * Rollbacl data that have been save to table hris_ob_ot_rectification
                                 */
                                Swal.fire({
                                    icon:'error',
                                    title:res.data.message
                                })
                            }
                        }).catch(err=>{
                            Swal.close();
                            console.log(err)
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
    const handleCancel = () => {
        setCoveredDateFrom('')
        setCoveredDateTo('')
        setCoveredDays([])
    }
    const checkIsApplied = (data,type,index) =>{
        let has_exist = false;
        let remarks;
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
        if(has_exist){
            return <input type="text" defaultValue={remarks} style={{width:'100%'}} readOnly/>
        }else{
            return <input type="time" value = {data[type]} onChange = {(value)=>setUpdateTime(index,value,type)} style={{width:'100%'}}/>
        }

    }
    return (
        <Grid container sx={{p:2}}>
        <Grid item xs={12} md={3} lg={3} >
            <Box sx={{width:matches?'100%':'98%'}}>
            <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-around'}}>
            <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-dept"
                options={officeData}
                sx={{mt:matches?1:0}}
                // sx={{minWidth:matches?'100%':300}}
                value = {selectedOffice}
                getOptionLabel={(option) => option.dept_title}
                onChange={(event,newValue) => {
                    handleChangeOffice(newValue);
                    }}
                renderInput={(params) => <TextField {...params} label="Office"/>}
            />
            </Box>
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
                <TextField type='date' label='From' InputLabelProps={{shrink:true}} fullWidth variant='standard' onChange={handleSetDateFrom} value={coveredDateFrom}/>
                &nbsp;
                <TextField type='date' label='To' InputLabelProps={{shrink:true}} fullWidth variant='standard' onChange={handleSetDateTo} value={coveredDateTo}/>
                </Box>

                </Grid>
                <Grid item xs={12}>
                <TextField label='Remarks' InputLabelProps={{shrink:true}} fullWidth variant='standard'/>
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
                <Grid item xs={12} sx={{display:'flex',flexDirectionL:'row',justifyContent:'flex-end'}}>
                    <Button variant='outlined' startIcon = {<SaveOutlinedIcon/>} color='success' sx={{'&:hover':{color:'white',background:green[800]}}} disabled={coveredDays.length === 0 || coveredDateFrom.length === 0 || coveredDateTo.length ===0 ?true:false} onClick={handleSave}>Save</Button> &nbsp;
                    <Button variant='outlined' onClick = {handleCancel} startIcon={<BackspaceOutlinedIcon/>}color='error' sx={{'&:hover':{color:'white',background:red[800]}}}>Clear Period</Button>
                </Grid>

            </Grid>
        </Grid>
        </ThemeProvider>
        </Grid>
    )
}