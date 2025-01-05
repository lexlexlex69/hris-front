import React,{useState} from 'react';
import {Grid, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Typography,TableBody,Tooltip,IconButton,Button,Modal,Box, TextField,InputAdornment, Checkbox} from '@mui/material';
import moment from 'moment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { newPreViewFileAPI, preViewFileAPI, viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SearchIcon from '@mui/icons-material/Search';
import { approvedBatchOBRectificationRequest, approvedOBRectificationRequest, disapprovedOBRectificationRequest, postOBScheduleAPI, updateOBInserted } from '../DTRRequest';
import Swal from 'sweetalert2';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { api_url } from '../../../../../request/APIRequestURL';
import LargeModal from '../../../custommodal/LargeModal';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { FilePanZoom } from '../../../customstring/CustomString';
import MediumModal from '../../../custommodal/MediumModal';
import PreviewFileModal from '../../../custommodal/PreviewFileModal';
export default function OBRectificationRequest(props){
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
        boxShadow: 24,
        // p: 4,
        borderRadius:1
    };

    const formatDaysDetails = (row)=>{
        var t_data = JSON.parse(row);
        return(
            
            t_data.map((row,key)=>
            <ul key={key}>
                <span><strong>{moment(row.date).format('MMMM DD, YYYY')}</strong></span>
                {row.time_in && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.time_in).format('hh:mm a')} - {row.remarks}</li>}
                
                {row.break_out && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.break_out).format('hh:mm a')} - {row.remarks}</li>}

                {row.break_in && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.break_in).format('hh:mm a')} - {row.remarks}</li>}

                {row.time_out && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.time_out).format('hh:mm a')} - {row.remarks}</li>}
            </ul>
            
            )

        )
    }
    const [openDisapprovedModal,setOpenDisapprovedModal] = useState(false)
    const [disapprovalReason,setDisapprovalReason] = useState('')
    const [openPreviewFile,setOpenPreviewFile] = useState(false);
    const [openPreviewFilePDF,setOpenPreviewFilePDF] = useState(false);
    const [previewFileData,setPreviewFileData] = useState('');
    const [fileType,setFileType] = useState('');

    const handleViewFile = async (id)=>{
        const file = await newPreViewFileAPI(id)
        // console.log(file.url)
        if(file.type.includes('pdf')){
            setFileType('pdf')
            setOpenPreviewFilePDF(true)
        }else{
            setFileType('img')
            setOpenPreviewFile(true)
        }
        setPreviewFileData(file.url)
        // setOpenPreviewFile(true)
    }
    const handleApproved = (row)=>{
        Swal.fire({
            icon:'info',
            title:'Confirm submit for approval ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
        }).then((result)=>{
            if(result.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Approving request',
                    html:'Please wait...'
                })
                Swal.showLoading()
                var t_data = {
                    id:row.hris_ob_ot_id,
                    emp_no:row.emp_no,
                    dept_code:row.dept_code,
                    days_details:JSON.parse(row.days_details),
                    date_from:row.date_from,
                    date_to:row.date_to,
                    date_filed:moment(row.created_at).format('YYYY-MM-DD'),
                    encode_time:moment(row.created_at).format('H:mm'),
                    // encoder:res.data.data.approved_by,
                    // encoder_position:res.data.data.approved_position,
                    api_url:api_url+'/postOBRectification',
                    remarks:row.ob_oft_remarks
                } 
                approvedOBRectificationRequest(t_data)
                .then(res=>{
                    if(res.data.status === 200){
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:2000
                        })
                        props.setPendingData(res.data.pending)
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:'Oops...',
                            html:res.data.message
                        })
                    }
                    console.log(res.data)
                    // if(res.data.status === 200){
                    //     console.log(res.data)
                    //     var data2 = {
                    //         emp_no:row.emp_no,
                    //         dept_code:row.dept_code,
                    //         days_details:JSON.parse(row.days_details),
                    //         date_from:row.date_from,
                    //         date_to:row.date_to,
                    //         date_filed:moment(row.created_at).format('YYYY-MM-DD'),
                    //         encode_time:moment(row.created_at).format('H:mm'),
                    //         encoder:res.data.data.approved_by,
                    //         encoder_position:res.data.data.approved_position,
                    //         api_url:api_url+'/postOBRectification',
                    //         remarks:row.ob_oft_remarks
                    //     }
                    //     console.log(data2)
                    //     // let id = res.data.id;
                    //     // data2.encoder = res.data.encoder;
                    //     // data2.encoder_position = res.data.position;
                    //     postOBScheduleAPI(data2)
                    //     .then(res=>{
                    //         console.log(res.data)
                    //         if(res.data.status === 200){
                    //             var data3 = {
                    //                 ob_ot_no:res.data.ob_ot_no,
                    //                 id:row.hris_ob_ot_id,
                    //                 type:true
                    //             }
                    //             updateOBInserted(data3)
                    //             .then(res=>{
                    //                 console.log(res)
                    //                 if(res.data.status === 200){
                    //                     props.setPendingData(res.data.data)

                    //                     Swal.fire({
                    //                         icon:'success',
                    //                         title:res.data.message,
                    //                         timer:1500,
                    //                         showConfirmButton:false
                    //                     })
                    //                 }else{
                    //                     Swal.fire({
                    //                         icon:'error',
                    //                         title:res.data.message
                    //                     })
                    //                 }
                    //             }).catch(err=>{
                    //                 console.log(err)
                    //             })
                                
                    //         }else{
                    //             /**
                    //             * Rollback data that have been save to table hris_ob_ot_rectification
                    //             */
                    //             var data3 = {
                    //                 ob_ot_no:res.data.ob_ot_no,
                    //                 id:row.hris_ob_ot_id,
                    //                 type:false
                    //             }
                    //             updateOBInserted(data3)
                    //             .then(res=>{
                    //                 console.log(res)
                    //                 if(res.data.status === 200){
                    //                     props.setPendingData(res.data.data)
                    //                     Swal.fire({
                    //                         icon:'success',
                    //                         title:res.data.message,
                    //                         timer:1500,
                    //                         showConfirmButton:false
                    //                     })
                    //                 }else{
                    //                     Swal.fire({
                    //                         icon:'error',
                    //                         title:res.data.message
                    //                     })
                    //                 }
                    //             }).catch(err=>{
                    //                 console.log(err)
                    //             })
                    //             Swal.fire({
                    //                 icon:'error',
                    //                 title:res.data.message
                    //             })
                    //         }
                    //     }).catch(err=>{
                    //         Swal.close();
                    //         console.log(err)
                    //     })
                    // }else{
                    //     Swal.fire({
                    //         icon:'error',
                    //         title:res.data.message
                    //     })
                    // }
                }).catch(err=>{
                    /**
                    * Rollback data that have been save to table hris_ob_ot_rectification
                    */
                    var data3 = {
                        type:false
                    }
                    updateOBInserted(data3)
                    .then(res=>{
                        console.log(res)
                        if(res.data.status === 200){
                            props.setPendingData(res.data.data)
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
                    // Swal.fire({
                    //     icon:'error',
                    //     title:err
                    // })
                    console.log(err)
                })
                
            }        

        })}
    const [selectedID,setSelectedID] = useState('')

    const handleDisapproved = (row)=>{
        setSelectedID(row.hris_ob_ot_id)
        setOpenDisapprovedModal(true)
    }
    const submitDisapproval = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Submitting',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            reason:disapprovalReason,
            id:selectedID
        }
        disapprovedOBRectificationRequest(t_data)
        .then(res=>{
            if(res.data.status === 200){
                setOpenDisapprovedModal(false)
                props.setPendingData(res.data.data)
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
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
            Swal.close()
        })

    }
    const [searchVal,setSearchVal] = useState('')
    const filterData = props.data.filter((el)=>{
        return el.fname.toUpperCase().trim().includes(searchVal.toUpperCase().trim()) || el.lname.toUpperCase().trim().includes(searchVal.toUpperCase().trim()) || el.dept_title
        ?.toUpperCase().trim().includes(searchVal.toUpperCase().trim())
    })
    const handleSelect = (item) => {
        console.log(item)
        let temp = [...props.data]
        let index = temp.findIndex(el=>el.hris_ob_ot_id === item.hris_ob_ot_id)
        console.log(index);
        temp[index].selected = !temp[index].selected;
        props.setPendingData(temp)
    }
    const handleBatchApproved = async ()=>{
        let selected = props.data.filter(el=>el.selected)
        var t_data = {
            data:selected,
            api_url:api_url+'/postBatchOBRectification'
        }
        selected.forEach(el=>{
            el.date_filed = moment(el.created_at).format('YYYY-MM-DD')
            el.encode_time = moment(el.created_at).format('H:mm')
        })
        const res = await approvedBatchOBRectificationRequest(t_data)
        console.log(res.data)
    }
    return(
        <Grid container sx={{p:2}}>
            <Grid item xs={12}>
                <TextField label='Search' placeholder='Fistname | Lastname | Office/Department' value={searchVal} onChange = {(val)=>setSearchVal(val.target.value)} InputProps={{
                endAdornment: <InputAdornment position="end"><SearchIcon/></InputAdornment>,
            }}/>
                <Paper>
                    <TableContainer sx={{maxHeight:'70vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>
                                        Select
                                        <Tooltip title='Batch Approved'><IconButton color='success' onClick={handleBatchApproved}><ThumbUpIcon/></IconButton></Tooltip>
                                    </TableCell> */}
                                    <TableCell>
                                        Employee Name
                                    </TableCell>
                                    <TableCell>
                                        Office
                                    </TableCell>
                                    <TableCell sx={{width:200}}>
                                        Details
                                    </TableCell>
                                    <TableCell>
                                        Remarks
                                    </TableCell>
                                    <TableCell>
                                        File Attachment
                                    </TableCell>
                                    <TableCell>
                                        Date Filed
                                    </TableCell>
                                    <TableCell>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    filterData.length>0
                                    ?
                                        filterData.map((row,key)=>
                                            <TableRow key={key} hover>
                                                {/* <TableCell>
                                                    <Checkbox checked = {row.selected} onChange={()=>handleSelect(row)}/>
                                                </TableCell> */}
                                                <TableCell sx={{textTransform:'uppercase'}}>
                                                    {row.fname} {row.mname?row.mname.charAt(0)+'.':' '} {row.lname}
                                                </TableCell>
                                                <TableCell>
                                                    {row.dept_title}
                                                </TableCell>
                                                <TableCell sx={{width:200}}>
                                                    <Box sx={{maxHeight:140,overflow:'auto'}}>
                                                    {formatDaysDetails(row.days_details)}

                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {row.ob_oft_remarks}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{display:'flex',gap:1}}>
                                                    {
                                                        JSON.parse(row.file_id).map((row2,key2)=>
                                                            <Tooltip title='View supporting docs' key = {key2}><IconButton color='info' className='custom-iconbutton' onClick={()=>handleViewFile(row2)}><AttachmentIcon/></IconButton></Tooltip>
                                                        )
                                                    }
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {moment(row.created_at).format('MMMM DD, YYYY hh:m a')}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{display:'flex',gap:1}}>
                                                    
                                                    <Tooltip title='Approved'><IconButton color='success' className='custom-iconbutton' onClick={()=>handleApproved(row)}><ThumbUpIcon/></IconButton></Tooltip>
                                                    <Tooltip title='Disapproved'><IconButton color='error' className='custom-iconbutton' onClick={()=>handleDisapproved(row)}><ThumbDownIcon/></IconButton></Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    :
                                    <TableRow>
                                        <TableCell align='center' colSpan={7}>
                                            No request as of the moment...
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Modal
                open={openDisapprovedModal}
                onClose={()=>setOpenDisapprovedModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit = {submitDisapproval}>
                    <Grid container sx={{p:2}} spacing={2}>
                        <Grid item xs={12}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign:'center'}}>
                            Disapproval remarks
                        </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Remarks' fullWidth required value={disapprovalReason} onChange = {(val)=>setDisapprovalReason(val.target.value)}/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Button color ='success' variant='contained' className='custom-roundbutton' type='submit'>Submit</Button>
                            &nbsp;
                            <Button color ='error' variant='contained' className='custom-roundbutton' onClick={()=>setOpenDisapprovedModal(false)}>Cancel</Button>
                        </Grid>
                    </Grid>
                    </form>
                </Box>
            </Modal>
            <LargeModal open = {openPreviewFile} close = {()=>setOpenPreviewFile(false)} title = 'Preview File'>
                <FilePanZoom img={previewFileData}/>
            </LargeModal>
             <PreviewFileModal open = {openPreviewFilePDF} close = {()=>setOpenPreviewFilePDF(false)} file={previewFileData} fileType={fileType}>
            </PreviewFileModal>
        </Grid>
    )
}