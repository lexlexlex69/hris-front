import React,{useEffect, useState} from 'react';
import {Box,Grid,Paper,TableContainer,Table,TableRow,TableHead,TableBody,TablePagination,IconButton,Tooltip,Typography,Button,FormControl,FormControlLabel,Radio,RadioGroup,TextField,Stack,Skeleton,InputAdornment,Popover,InputLabel,MenuItem,Select  } from '@mui/material';
import { addTraineeEvaluation, getCompleteEvaluateTrainees, getEvaluateTrainees, getInCompleteEvaluateTrainees, notifyParticipants } from '../TraineeEvaluationRequest';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue,red} from '@mui/material/colors';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

//Icons
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CloseIcon from '@mui/icons-material/Close';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';

import Swal from 'sweetalert2';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import DefaultRequirementsPreviewDeptHead from '../../traineedashboard/TabsComponent/CustomComponents/DefaultRequirementsPreviewDeptHead';
import FullModal from '../../../custommodal/FullModal';
import { getMyRqmt } from '../../traineedashboard/TraineeDashboardRequest';
import { toast } from 'react-toastify';
const Input = styled('input')({
    display: 'none',
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      padding:5
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding:5
    },
  }));
export const InComplete = (props) => {
    const [data,setData] = useState([]);
    const [data1,setData1] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','ppt','pptx','xls','xlsx','doc','docx',
    ])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
    useEffect(()=>{
        let controller = new AbortController()
        getData(controller)
        return () => controller.abort()
    },[])
    const getData = async (controller) => {
        var data2 = {
            id:props.data.training_details_id,
            dept_code:props.data.dept_code,
            training_app:props.data.training_app
        }
        getInCompleteEvaluateTrainees(data2,{ signal: controller.signal })
        .then(res=>{
            var temp_data = [];
            res.data.forEach(el=>{
                el.file = '';
                el.remarks = '';
                el.training_sanction = '';
                el.comments = '';
                temp_data.push(el)
            })
            // console.log(temp_data)
            setData(temp_data)
            setData1(res.data)
            setShowLoading(false)
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleSetRemarks = (index,value)=>{
        var temp_data = [...data];
        // console.log(value.target.value)
        temp_data[index].remarks = value.target.value;
        temp_data[index].comments = '';
        temp_data[index].training_sanction = '';
        setData(temp_data);
    }
    const handleSetTrainingSanction = (index,value)=>{
        var temp_data = [...data];
        temp_data[index].training_sanction = value.target.value;
        setData(temp_data);
    }
    const handleSetComments = (index,value)=>{
        var temp_data = [...data];
        temp_data[index].comments = value.target.value;
        setData(temp_data);
    }
    const handleFile = (index,e)=>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        let data2 = [...data];
        if(fileExtensions.includes(extension.toLowerCase())){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                data2[index].file = fileReader.result;
                setData(data2)
                // setsingleFile(fileReader.result)
            }
        }else{
            data2[index].file = '';
            setData(data2)
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload Excel File.'
            })
        }
    }
    const handleSave = () =>{
        var temp_data = [...data];
        var temp_arr=[];
        temp_data.forEach(el=>{
            // if(el.file && el.remarks){
            //     temp_arr.push(el)
            // }
            if(el.remarks){
                temp_arr.push(el)
            }
        })
        if(temp_arr.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Please provide necessary information of evaluation.'
            })
        }else{
            Swal.fire({
                icon:'info',
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText:`Don't Save` 
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon:'info',
                        title:'Saving data',
                        html:'Please wait...',
                        allowEscapeKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading()
                    var data2 = {
                        data:temp_arr,
                        info:props.data
                    }
                    // Swal.close();
                    // console.log(data2)
                    addTraineeEvaluation(data2)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 200){
                            var temp_data = [];
                            res.data.data.forEach(el=>{
                                el.file = '';
                                el.remarks = '';
                                el.comments = '';
                                temp_data.push(el)
                            })
                            setData(temp_data)
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
            })
            
        }
    }
    const [searchValue,setSearchValue] = useState('')
    const handleSearch = (value)=>{
        setSearchValue(value.target.value)
        
        
    }
    useEffect(()=>{
        if(searchValue){
            let new_arr = data1.filter((el)=>{
                return el.fname.includes(searchValue.toUpperCase()) || el.lname.includes(searchValue.toUpperCase())
            })
            setData(new_arr)
        }else{
            setData(data1)
        }
    },[searchValue])
    const clearSearch = () =>{
        setSearchValue('')
        setData(data1)
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedFileDetails, setSelectedFileDetails] = useState([]);
    const [remarksDropDown,setRemarksDropDown] = useState(['Fully Implemented','Partially Implemented','Not Implemented'])
    const handleClick = (event,files) => {
        setSelectedFileDetails(JSON.parse(files))
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setSelectedFileDetails([])
        setAnchorEl(null);
    };
    const [notifyLoading,setNotifyLoading] = useState(false)
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const formatDescription = (string)=>{
        if(string.length >= 20){
            return string.substring(0,20)+'...'
        }else{
            return string;
        }
    }
    const handleNotify = async (row) => {
        setNotifyLoading(true)
        const id = toast.loading('Notifying participants')
        try{
            let t_data = {
                data:[{
                    emp_id:row.emp_id,
                    dept_code:row.dept_code,
                    training_details_id:row.training_details_id,
                    training_app:row.training_app
                }],
                training_details_id:props.data.training_details_id,
                dept_code:props.data.dept_code,
                training_name:props.data.training_name
            }
            const res = await notifyParticipants(t_data);
            if(res.data.status === 200){
                setData(res.data.data)
                setData1(res.data.data)
                toast.update(id,{
                    render:res.data.message,
                    type:'success',
                    isLoading:false,
                    autoClose:true
                })
            }else{
                toast.update(id,{
                    render:res.data.message,
                    type:'error',
                    isLoading:false,
                    autoClose:true
                })
            }
            setNotifyLoading(false)
        }catch(err){
            toast.update(id,{
                render:err,
                type:'error',
                isLoading:false,
                autoClose:true
            })
            setNotifyLoading(false)
        }
    }
    const handleNotifyAll = async () =>{
        let temp = data.filter(el=>el.notifications_id ===null);
        console.log(props)
        if(temp.length>0){
            setNotifyLoading(true)
            const id = toast.loading('Notifying participants')
            try{
                let t_data = {
                    data:temp,
                    training_details_id:props.data.training_details_id,
                    dept_code:props.data.dept_code,
                    training_name:props.data.training_name
                }
                console.log(t_data)
                const res = await notifyParticipants(t_data);
                if(res.data.status === 200){
                    setData(res.data.data)
                    setData1(res.data.data)
                    toast.update(id,{
                        render:res.data.message,
                        type:'success',
                        isLoading:false,
                        autoClose:true
                    })
                }else{
                    toast.update(id,{
                        render:res.data.message,
                        type:'error',
                        isLoading:false,
                        autoClose:true
                    })
                }
                setNotifyLoading(false)
            }catch(err){
                toast.update(id,{
                    render:err,
                    type:'error',
                    isLoading:false,
                    autoClose:true
                })
                setNotifyLoading(false)
            }
        }else{
            toast.error('Oops... All participants have been already notified !')
        }
        
    }
    return(
        <React.Fragment>
        {
            showLoading
            ?
            <Stack>
            <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                <Skeleton variant='rounded' height={40} width={90} animation='wave' sx={{borderRadius:'20px'}}/>
            </Box>
            <TableContainer sx={{maxHeight:'65vh'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Position</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4}>
                            <Skeleton variant='rounded' height={30} animation='wave'/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>
                            <Skeleton variant='rounded' height={30} animation='wave'/>
                            </TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell colSpan={4}>
                            <Skeleton variant='rounded' height={30} animation='wave'/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>
                            <Skeleton variant='rounded' height={30} animation='wave'/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            </Stack>
            :
            <Grid container spacing={1}>
                    {
                        data1.length ===0
                        ?
                        null
                        :
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <TextField label='Search' placeholder='Firstname | Lastname' value={searchValue} onChange = {handleSearch} InputProps={{
                                endAdornment: <InputAdornment position="end"><Tooltip title='Clear search/'><IconButton color='error' onClick={clearSearch}><ClearIcon/></IconButton></Tooltip></InputAdornment>,
                            }}/>
                            <Button variant='contained' startIcon={<NotificationAddIcon/>} onClick={handleNotifyAll}>Notify All</Button>
                        </Grid>
                    }
                    
                    <Grid item xs={12}>
                    <Paper>
                        <TableContainer sx={{maxHeight:'65vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell sx={{minWidth:200}}>Name</StyledTableCell>
                                        <StyledTableCell>Position</StyledTableCell>
                                        {/* <StyledTableCell sx={{minWidth:100}}>MOV's</StyledTableCell> */}
                                        <StyledTableCell sx={{minWidth:100}}>Status</StyledTableCell>
                                        <StyledTableCell sx={{width:300}} align='center'>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.length === 0
                                        ?
                                        <TableRow> <StyledTableCell colSpan={4} align='center'>No data</StyledTableCell></TableRow>
                                        :
                                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <StyledTableCell>{row.lname+', '+row.fname}</StyledTableCell>
                                                <StyledTableCell>{row.position_name}</StyledTableCell>
                                                

                                                <StyledTableCell>
                                                    {
                                                        row.is_final === null
                                                        ?
                                                        'No updates'
                                                        :
                                                        'Draft'

                                                    }                                                   
                                                    
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                        {
                                                            row.notifications_id === null
                                                            ?
                                                            <Button variant='outlined' sx={{'&:hover':{color:'#fff',background:blue[800]}}} startIcon={<NotificationAddIcon/>} onClick={()=>handleNotify(row)} disabled={notifyLoading}>Notify</Button>
                                                            :
                                                            <Button variant='outlined' sx={{'&:hover':{color:'#fff',background:blue[800]}}} startIcon={<NotificationAddIcon/>}  disabled>Notified</Button>
                                                        }
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            data.length ===0
                            ?
                            null
                            :
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        }
                        
                    </Paper>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                    >
                        <Box sx={{p:1,display:'flex',flexDirection:'column',gap:1}}>
                            {
                                selectedFileDetails.map((item,key)=>
                                    <Button key={key} variant='contained' onClick={()=>viewFileAPI(item.file_id)} fullWidth>{formatDescription(item.description)}</Button>
                                )
                            }
                        </Box>
                    </Popover>
                    </Grid>
            </Grid>
        }
        </React.Fragment>
    )
}