import React,{useEffect, useState} from 'react';
import {Box,Grid,Paper,TableContainer,Table,TableRow,TableHead,TableBody,TablePagination,IconButton,Tooltip,Typography,Button,FormControl,FormControlLabel,Radio,RadioGroup,TextField,Stack,Skeleton,InputAdornment,Popover,InputLabel,MenuItem,Select  } from '@mui/material';
import { addTraineeEvaluation, getCompleteEvaluateTrainees, getEvaluateTrainees } from '../TraineeEvaluationRequest';
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
export const Complete = (props) => {
    const [data,setData] = useState([]);
    const [data1,setData1] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','ppt','pptx','xls','xlsx','doc','docx',
    ])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
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
    const getData = (controller) => {
        var data2 = {
            id:props.data.training_details_id,
            dept_code:props.data.dept_code,
            training_app:props.data.training_app
        }
        getCompleteEvaluateTrainees(data2, {signal:controller.signal})
        .then(res=>{
            var temp_data = [];
            res.data.data.forEach(el=>{
                el.file = '';
                el.remarks = '';
                el.training_sanction = '';
                el.comments = '';
                temp_data.push(el)
            })
            console.log(temp_data)
            setData(temp_data)
            setData1(res.data.data)
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

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const formatDescription = (string)=>{
        if(string.length >= 20){
            return string.substring(0,20)+'...'
        }else{
            return string;
        }
    }
    const [openPreviewLAPSAP,setOpenPreviewLAPSAP] = useState(false);
    const [reqData,setReqData] = useState([]);
    const [selectedIndex,setSelectedIndex] = useState()
    const handleOpenPreviewLAPSAP = async (row,index) =>{
        setSelectedIndex(index)
        const id = toast.loading('Retrieving LAP/SAP')


        let data2 = {
            id:row.training_shortlist_id
        }
        const res = await getMyRqmt(data2);
        console.log(res.data)

        if(res.data.req_rqmt.is_final){
            toast.update(id,{
                render:'LAP/SAP Loaded',
                type:'success',
                autoClose:true,
                isLoading:false

            })
            setRemarks(row.remarks)
            setComments(row.comments)
            setReqData(res.data.req_rqmt)

            setOpenPreviewLAPSAP(true)
            
        }else{
            toast.update(id,{
                render:'Updated LAP/SAP not found ! Please contact the participant.',
                type:'error',
                autoClose:true,
                isLoading:false
            })
        }
        
    }
    const handleClear = (index)=>{
        let temp = [...data];
        temp[index].remarks = '';
        setData(temp)
    }
    const [remarks,setRemarks] = useState('');
    const [comments,setComments] = useState('');
    const handleSaveRemarks = ()=>{
        var temp_data = [...data];
        // console.log(value.target.value)
        temp_data[selectedIndex].remarks = remarks;
        temp_data[selectedIndex].comments = comments;
        temp_data[selectedIndex].training_sanction = '';
        setData(temp_data);
        setOpenPreviewLAPSAP(false)
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
                            <StyledTableCell>Training Application</StyledTableCell>
                            <StyledTableCell>Remarks</StyledTableCell>
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
                            <Tooltip title ='Save Evaluation'>
                            <Button variant = 'contained' className='custom-roundbutton' color='success' startIcon={<SaveOutlinedIcon/>} onClick={handleSave}>Save</Button>
                            {/* <IconButton color='success' onClick={handleSave} className='custom-iconbutton'><SaveOutlinedIcon/></IconButton> */}
                            </Tooltip>
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
                                        <StyledTableCell sx={{minWidth:100}}>Training Application</StyledTableCell>
                                        <StyledTableCell sx={{width:300}}>Remarks</StyledTableCell>
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
                                                {/* <StyledTableCell>
                                                {
                                                    row.file_details
                                                    ?
                                                    <Tooltip title="View Uploaded MOV's"><span><IconButton color='info' className='custom-iconbutton' aria-describedby={id} onClick={(event)=>handleClick(event,row.file_details)} disabled={JSON.parse(row.file_details)?false:true}><AttachmentIcon/></IconButton></span></Tooltip>
                                                    :
                                                    <span style={{color:red[800]}}>No MOV's uploaded</span>
                                                }
                                                
                                                </StyledTableCell> */}

                                                <StyledTableCell>
                                                    {/* <label htmlFor={"contained-file"+key} style={{width:'100%'}}>
                                                    <Input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx," id={"contained-file"+key} type="file" onChange ={(value)=>handleFile(key,value)}/>
                                                    <Tooltip title={'Update '+row.training_app} component="span"><Button color='primary' fullWidth startIcon={row.file?<><CheckCircleOutlinedIcon sx={{color:green[800]}}/> <FileUploadOutlinedIcon/></>:<FileUploadOutlinedIcon/>} variant='outlined'><Typography>{row.training_app}</Typography></Button></Tooltip>
                                                </label> */}
                                                    <Button variant='outlined' onClick={()=>handleOpenPreviewLAPSAP(row,key)}
                                                    sx={{'&:hover':{color:'#fff',background:blue[800]}}} startIcon={<ContentPasteSearchIcon/>} disabled={row.trainee_evaluation_id?true:false}>Review LAP/SAP</Button>
                                                    
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {
                                                    row.trainee_evaluation_id
                                                    ?
                                                    row.evaluation_remarks
                                                    :
                                                    <>
                                                    <FormControl sx={{width:'100%'}} size='small'>
                                                
                                                        <InputLabel id="remarks-label">Remarks</InputLabel>
                                                            <Select
                                                                labelId="remarks-label"
                                                                id="remarks-label"
                                                                value={row.remarks}
                                                                label="Remarks"
                                                                onChange={(value)=>handleSetRemarks(key,value)}
                                                                >
                                                                {
                                                                    remarksDropDown.map((item,key2)=>
                                                                        <MenuItem value={item} key={key2}>{item}</MenuItem>
                                                                    )
                                                                }
                                                            </Select>
                                                        {
                                                            row.remarks === 'Not Implemented'
                                                            ?
                                                            <Box>
                                                            {/* <TextField color='error' label = 'Sanction Date' value={row.training_sanction} type='date' InputLabelProps={{shrink:true}} onChange = {(value)=>handleSetTrainingSanction(key,value)} fullWidth/> */}
                                                            <TextField label='Comments' fullWidth sx={{mt:1}} value={row.comments} onChange = {(value)=>handleSetComments(key,value)} />
                                                            </Box>
                                                            :
                                                            null
                                                        }
                                                        {
                                                            row.remarks === 'Partially Implemented'
                                                            ?
                                                            <Box>
                                                            <TextField label='Comments' fullWidth sx={{mt:1}} value={row.comments} onChange = {(value)=>handleSetComments(key,value)}/>
                                                            </Box>
                                                            :
                                                            null
                                                        }
                                                        </FormControl>
                                                        {
                                                            row.remarks
                                                            ?
                                                            <Button variant='outlined' size='small' color='error' startIcon={<CloseIcon/>} fullWidth onClick={()=>handleClear(key)} sx={{mt:1}}>Clear Remarks</Button>
                                                            :
                                                            ''
                                                        }
                                                    </>

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
                    <FullModal open = {openPreviewLAPSAP} close = {()=>setOpenPreviewLAPSAP(false)} title='Preview LAP/SAP'>
                        <Box sx={{maxHeight:'80vh',overflowY:'scroll'}}>
                        <DefaultRequirementsPreviewDeptHead reqData={reqData}/>
                        <Box sx={{display:'flex',justifyContent:'flex-end',gap:1,flexDirection:'row',alignItems:'center'}}>
                            <FormControl
                                sx={{width:300}}
                                size='small'>
                                <InputLabel id="remarks-label">Remarks</InputLabel>
                                <Select
                                    labelId="remarks-label"
                                    id="remarks-label"
                                    value={remarks}
                                    label="Remarks"
                                    onChange={(value)=>setRemarks(value.target.value)}
                                    >
                                    {
                                        remarksDropDown.map((item,key2)=>
                                            <MenuItem value={item} key={key2}>{item}</MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                            {
                                remarks === 'Not Implemented'
                                ?
                                <Box>
                                {/* <TextField color='error' label = 'Sanction Date' value={row.training_sanction} type='date' InputLabelProps={{shrink:true}} onChange = {(value)=>handleSetTrainingSanction(key,value)} fullWidth/> */}
                                <TextField label='Comments' fullWidth value={comments} onChange = {(value)=>setComments(value.target.value)}size=' small' />
                                </Box>
                                :
                                null
                            }
                            {
                                remarks === 'Partially Implemented'
                                ?
                                <Box>
                                <TextField label='Comments' fullWidth value={comments} onChange = {(value)=>setComments(value.target.value)} size='small'/>
                                </Box>
                                :
                                null
                            }
                            <Button className='custom-roundbutton'variant='contained' color='success' onClick={handleSaveRemarks}>
                            Save
                            </Button>
                        </Box>
                        </Box>

                    </FullModal>
            </Grid>
        }
        </React.Fragment>
    )
}