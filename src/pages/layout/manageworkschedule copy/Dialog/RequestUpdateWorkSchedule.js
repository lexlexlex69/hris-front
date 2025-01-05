import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography,Checkbox,Fade,Box, IconButton,Modal, TextField, Button } from '@mui/material';
import React,{useState} from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import moment from 'moment';
import { approvedRequestUpdateSchedData } from '../../manageworkscheduledept/WorkScheduleRequest';
import Swal from 'sweetalert2';
import { disapprovedRequestedUpdateWorkSched, updateRequestedWorkSchedAPI } from '../WorkScheduleRequest';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function RequestUpdateWorkSchedule(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
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
    const formatDetails = (row) =>{
        if(row.action === 'UPDATE'){
            var t_update1 = JSON.parse(row.updated_sched)
            var t_update2 = JSON.parse(row.updated_sched_old)
            return <Box sx={{display:'flex',flexDirection:'row'}}>
                <Box sx={{p:1}}>
                <small>Old</small>
                {t_update2.map((r,key)=>
                    <div  key={key}>
                    <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                    <li>{r.whrs_desc}</li>
                    </div>
                )}
                </Box>
                <Box sx={{p:1}}>
                <small>New</small>
                {t_update1.map((r,key)=>
                    <div  key={key}>
                    <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                    <li>{r.whrs_desc}</li>
                    </div>
                )}
                </Box>
            </Box>
        }
        if(row.action === 'REMOVE'){
            if(row.removed_type === 0){
                var t_remove = JSON.parse(row.removed_sched)
                return <Box sx={{display:'flex',flexDirection:'row'}}>
                    <Box sx={{p:1}}>
                    <small>To Remove</small>
                    {t_remove.map((r,key)=>
                        <div  key={key}>
                        <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                        </div>
                    )}
                    </Box>
                </Box>
            }
            if(row.removed_type === 1){
                var t_remove = JSON.parse(row.removed_sched)
                return <Box sx={{display:'flex',flexDirection:'row'}}>
                    <Box sx={{p:1}}>
                    <small>Remove updated sched and restore default template sched</small>
                    {t_remove.map((r,key)=>
                        <div  key={key}>
                        <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                        </div>
                    )}
                    </Box>
                </Box>
            }
            if(row.removed_type === 2){
                var t_remove = JSON.parse(row.removed_sched)
                return <Box sx={{display:'flex',flexDirection:'row'}}>
                    <Box sx={{p:1}}>
                    <small>Restore default template sched</small>
                    {t_remove.map((r,key)=>
                        <div  key={key}>
                        <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                        </div>
                    )}
                    </Box>
                </Box>
            }
            
        }
        
    }
    const handleApproved = (row)=>{
        console.log(row)

        Swal.fire({
            icon:'info',
            title:'Approving request',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_week = '';

        if(row.action === 'UPDATE'){
            var t_date = new Date();
        }else{
            var t_date = JSON.parse(row.removed_sched)[0].date;
            /**
            * Set rest day
            */
            var index = new Date(t_date).getDay()
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
        }
        
        var t_data = {
            id:row.work_sched_id,
            emp_no:row.emp_no,
            request_id:row.work_sched_request_id,
            data:row.updated_sched,
            removed_sched:row.removed_sched,
            action:row.action,
            date:t_date,
            month:moment(t_date).format('M'),
            year:moment(t_date).format('YYYY'),
            rest_day:t_week,
            rem_type:row.removed_type,
            working_days:JSON.parse(row.working_days),
            rest_days:JSON.parse(row.rest_days),
        }
        console.log(t_data)
        updateRequestedWorkSchedAPI(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                approvedRequestUpdateSchedData(t_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        props.setReqUpdateData(res.data.data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showCloseButton:false
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
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            console.log(err)
        })
        
    }
    const [reason,setReason] = useState('');
    const [selectedID,setSelectedID] = useState('');
    const [openDisapproved, setOpenDisapproved] = React.useState(false);
    const handleOpenDisapproved = () => setOpenDisapproved(true);
    const handleCloseDisapproved = () => setOpenDisapproved(false);
    const handleDisApproved = (row)=>{
        setSelectedID(row.work_sched_request_id)
        setOpenDisapproved(true)
    }
    const handleSubmitDisapproved = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Disapproving request',
            html:'Please wait...'
        })
        Swal.showLoading();
        var t_data = {
            reason:reason,
            id:selectedID
        }
        disapprovedRequestedUpdateWorkSched(t_data)
        .then(res=>{
            setOpenDisapproved(true)
            if(res.data.status === 200){
                props.setReqUpdateData(res.data.data)
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
        })
        console.log(t_data)
    }
    return (
        <Grid container sx={{p:1}}>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'80vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Office
                                    </TableCell>
                                    <TableCell>
                                        Details
                                    </TableCell>
                                    <TableCell>
                                        Reason
                                    </TableCell>
                                    <TableCell>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.data.length>0
                                    ?
                                    props.data.map((row,key)=>
                                        <TableRow hover key={key}>
                                            <TableCell>
                                                {row.emp_lname}, {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+',':''}
                                            </TableCell>
                                            <TableCell>
                                                {row.dept_title}
                                            </TableCell>
                                            <TableCell>
                                                {formatDetails(row)}
                                            </TableCell>
                                            <TableCell>
                                                {row.reason}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title='Approved request'><IconButton color='success' className='custom-iconbutton' onClick={()=>handleApproved(row)}><ThumbUpIcon/></IconButton></Tooltip>
                                                &nbsp;
                                                <Tooltip title='Approved request'><IconButton color='error' className='custom-iconbutton' onClick={()=>handleDisApproved(row)}><ThumbDownIcon/></IconButton></Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    :
                                    <TableRow>
                                        <TableCell colSpan={5} align='center'>
                                            No request as of the moment...
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
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
    )
}