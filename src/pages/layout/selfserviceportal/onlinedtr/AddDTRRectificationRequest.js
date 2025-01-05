import React, { useEffect,useState } from 'react';
import { Container, Grid, TextField, Typography,Box,Button, TableContainer,Table, TableRow,TableHead,TableCell,TableFooter,TableBody, FormControl,InputLabel,Select,MenuItem, Paper,Tooltip,Autocomplete,IconButton } from '@mui/material';
import DatePicker from 'react-multi-date-picker';
// import TimePicker from "react-multi-date-picker/plugins/time_picker";
//icon
import InputIcon from 'react-multi-date-picker/components/input_icon';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import CachedIcon from '@mui/icons-material/Cached';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import Swal from 'sweetalert2';
import { AttachFile } from '@mui/icons-material';
import { blue, green, red, yellow } from '@mui/material/colors'
import { checkMaximumMissedLogs, getLogAdjustmentData, getLogsAdjustmentAPI } from './DTRRequest';
import { toast } from 'react-toastify';
import { convertTo64 } from './convertfile/ConvertFile';
import { api_url } from '../../../../request/APIRequestURL';
import PreviewIcon from '@mui/icons-material/Preview';
import PreviewFileModal from '../../custommodal/PreviewFileModal';
import LargeModal from '../../custommodal/LargeModal';
import { FilePanZoom } from '../../customstring/CustomString';
const Input = styled('input')({
    display: 'none',
});

export default function AddDTRRectificationRequest(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [adjustmentLogsData,setAdjustmentLogsData] = React.useState([])
    useEffect(()=>{
        var t_data = {
            api_url:api_url+'/getAdjType/b9e1f8a0553623f1:639a3e:17f68ea536b'
        }
        getLogsAdjustmentAPI(t_data)
        .then(response=>{
            const data = response.data.response
            var new_data = [];
            data.forEach(el=>{
                new_data.push({
                    'label':el.atype_desc,
                    'atype_code':el.atype_code,
                    'atype_desc':el.atype_desc,
                    // 'type_code':el.type_code
                })
            })
            setAdjustmentLogsData(new_data)
        }).catch(error=>{
            console.log(error)
        })
    },[])
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.info.dark,
          color: theme.palette.common.white,
          fontSize: matches?11:15,
    
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: matches?10:12,
        },
      }));
      const [data,setData] = React.useState([{
        'date':'',
        'date_err':false,
        'nature':'',
        'reason':null,
        'rectified_time':'',
        'file':[]
    }])
    const setDate = (index,value) => {
        let data2 = [...data];
        /**
        * Check if reach maximum missed logs Permanent/Casual 3 per month , COS/JO 3 per half month
        */
        /**
         * Check if selected date
         */
        if(data2[index].reason){
            if(value){
                if(data2[index].reason.atype_desc.toUpperCase().includes('MISSED')){
                    var data3 = {
                        date:value.format('YYYY-MM-DD'),
                        day:parseInt(value.format('DD')),
                        month:parseInt(value.format('MM')),
                        monthname:value.format('MMMM'),
                        year:parseInt(value.format('YYYY')),
                        from:new Date(parseInt(value.format('YYYY')),parseInt(value.format('MM'))-1,1),
                        to:new Date(parseInt(value.format('YYYY')),parseInt(value.format('MM')),0),

                    }
                    console.log(data3)
                    checkMaximumMissedLogs(data3)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 500){
                            toast.warning(res.data.message)
                            data2[index].date = "";
                            data2[index].date_err = true;
                            setData(data2)
                        }else{
                            data2[index].date = value.format('YYYY-MM-DD');
                            data2[index].date_err = false;
                            setData(data2)
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    data2[index].date = value.format('YYYY-MM-DD');
                    data2[index].date_err = false;
                    setData(data2)
                }
            }
        }else{
            data2[index].date = value.format('YYYY-MM-DD');
            data2[index].date_err = false;
            setData(data2)
        }
        
    }
    const setNature = (index,value) => {
        let data2 = [...data];
        data2[index].nature = value;
        setData(data2)
    }
    const setReason = (index,value) => {
        let data2 = [...data];
        /**
        * Check if reach maximum missed logs Permanent/Casual 3 per month , COS/JO 3 per half month
        */
        /**
         * Check if selected date
         */
        console.log(data2[index].date)
        console.log(value)
        if(data2[index].date){
            if(value){
                if(value.atype_desc.toUpperCase().includes('MISSED')){
                    var data3 = {
                        date:data2[index].date,
                        day:parseInt(moment(data2[index].date).format('DD')),
                        month:parseInt(moment(data2[index].date).format('MM')),
                        monthname:moment(data2[index].date).format('MMMM'),
                        year:parseInt(moment(data2[index].date).format('YYYY')),
                        from:new Date(parseInt(moment(data2[index].date).format('YYYY')),parseInt(moment(data2[index].date).format('MM'))-1,1),
                        to:new Date(parseInt(moment(data2[index].date).format('YYYY')),parseInt(moment(data2[index].date).format('MM')),0),

                    }
                    console.log(data3)
                    checkMaximumMissedLogs(data3)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 500){
                            toast.warning(res.data.message)
                            data2[index].reason = null;
                            data2[index].date_err = true;
                            setData(data2)
                        }else{
                            data2[index].reason = value;
                            data2[index].date_err = false;

                            setData(data2)
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    data2[index].reason = value;
                    data2[index].date_err = false;

                    setData(data2)
                }
            }
        }else{
            data2[index].reason = value;
            data2[index].date_err = false;
            setData(data2)
        }
        
    }
    const setSpecifyTime = (index,value) => {
        let data2 = [...data];
        data2[index].rectified_time = value;
        setData(data2)
    }
    const handleFile = async (index,e) =>{
        var len = e.target.files.length;
        var i = 0;
        var t_data = [...data];
        var files = [...t_data[index].file];
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
                //     fileUpload.push({
                //         filename:file,
                //         data:fileReader.result
                //     })
                //     // setFileUpload(fileReader.result)
                //     // setsingleFile(fileReader.result)
                // }
            }else{
                // setFileUpload('')
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Please upload PDF or Image file.'
                })
            }
        }
        // setFileUpload(files)
        t_data[index].file = files;
        setData(t_data)
        console.log(files)
        // var file = e.target.files[0].name;
        // var extension = file.split('.').pop();
        // let data2 = [...data];
        // if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
        //     // setCOCFile(event.target.files[0])
        //     // let files = e.target.files;
        //     var t_filename = file.split('.');
        //     var f_filename;
        //     if(t_filename[0].length>10){
        //         f_filename = t_filename[0].substring(0,10)+'...'+t_filename[1];
        //     }else{
        //         f_filename = file;
        //     }
        //     convertTo64()
        //     let fileReader = new FileReader();
        //     fileReader.readAsDataURL(e.target.files[0]);
            
        //     fileReader.onload = (event) => {
        //         // data2[index].file = fileReader.result;
        //         data2[index].file.push({
        //             data:fileReader.result,
        //             filename:f_filename
        //         })
        //         setData(data2)
        //         // setsingleFile(fileReader.result)
        //     }
        // }else{
        //     // data2[index].file = '';
        //     data2[index].file.push({
        //         data:'',
        //         filename:''
        //     })
        //     setData(data2)
        //     Swal.fire({
        //         icon:'warning',
        //         title:'Oops...',
        //         html:'Please upload PDF or Image file.'
        //     })
        // }
    }
    const [natureData,setNatureData] = React.useState(['Time In','Break Out','Break In','Time Out'])
    const [actionBtn,setActionBtn] = useState('')
    const addData = () =>{
        var data2 = [...data];
        var new_data =  {
            'date':'',
            'nature':'',
            'reason':null,
            'rectified_time':'',
            'file':[]
        }
        data2.push(new_data)
        
        setData(data2)
        setActionBtn('add')

    }
    const deleteData = (index) => {
        var data2 = [...data]
        data2.splice(index,1)
        setData(data2)
        setActionBtn('delete')
    }
    const saveData = () =>{
        // toast.warning('Already reached maximum of 3 missed logs, for the month of December');
        var has_empty = false;
        // console.log(data)
        data.forEach(element => {
            if(element.date === '' || element.nature === '' || element.reason === '' || element.reason === null || element.rectified_time === '' || element.file === ''){
                has_empty=true
            }
        });
        var duplicate = Object.values(data.reduce((c, v) => {
            let k = v.date +'-'+v.nature;
            c[k] = c[k] || [];
            c[k].push(v);
            return c;
          }, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
        if(has_empty || data.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please filled out all neccessary data',
                
            })
        }else{
            if(duplicate.length !==0){
                var tr = ""
                duplicate.forEach(el=>
                    tr+="<tr><td>"+el.date+"</td>"+"<td>"+el.nature+"</td></tr>"
                )
                Swal.fire({
                    icon:'warning',
                    title:'Duplicate values detected',
                    html:"<table class='table table-bordered'><thead><tr><th>Date</th><th>Nature</th></tr></thead><tbody>"+tr+"</tbody></table><span>Please review again your application.</span>"
                })
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Confirm submit request ?',
                    showCancelButton:true,
                    confirmButtonText:'Yes',
                    cancelButtonText:'No'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // setData([{
                        //     'date':'',
                        //     'nature':'',
                        //     'reason':'',
                        //     'rectified_time':'',
                        //     'file':''
                        // }])
                        var data2 = []
                        var is_file_empty = false;
                        var file_empty_date = [];
                        data.forEach(el=>{
                            if(el.file.length === 0){
                                is_file_empty = true;
                                file_empty_date.push({
                                    date:moment(el.date).format('MMMM DD, YYYY')
                                })
                            }
                        })
                        var tr = "";
                        file_empty_date.forEach(el=>
                            tr+="<tr><td>"+el.date+"</td></tr>"
                        )
                        if(is_file_empty){
                            Swal.fire({
                                icon:'error',
                                title:'Please upload file on the following date:',
                                html:"<table class='table table-bordered'><thead><tr><th>Date</th></tr></thead><tbody>"+tr+"</tbody></table>"
                            })
                        }else{
                            data.forEach(element => {
                                data2.push({
                                    'date':element.date,
                                    'nature':element.nature,
                                    'reason':element.reason.atype_desc,
                                    'adj_type':element.reason.atype_code,
                                    'rectified_time':element.rectified_time,
                                    'file':element.file
                                })

                            })
                            console.log('rec_data',data)
                            props.submitRectificationRequest(data2)
                            // props.handleClose()
                        }
                        

                    }
    
                })
            }
            
            
        }
        
    }
    useEffect(()=>{
        if(matches){
            // if(actionBtn === 'add'){
            //     var id = data.length-1
            //     scrollToDiv('div-id'+id)
            // }else{
            //     var id = data.length-1
            //     console.log(id)
            //     scrollToDiv('div-id'+id)
            // }
            var id = data.length-1
            scrollToDiv('div-id'+id)
            
        }

    },[data])
    const scrollToDiv = (id) => {
        const element = document.getElementById(id);
        console.log(element)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const removeFile = (index,key) => {
        let t_data = [...data];
        // console.log(t_data)
        var t_data_arr = t_data[index].file;
        console.log(t_data_arr[key])
        t_data[index].file.splice(key,1);
        // console.log(t_data_arr.splice(key,1));
        // console.log(t_data_arr)
        console.log(t_data);
        setData(t_data);
    }
    const [previewFile,setPreviewFile] = useState(false)
    const [previewFileImg,setPreviewFileImg] = useState(false)
    const [previewFileData,setPreviewFileData] = useState('');
    const [fileType,setFileType] = useState('')
    const handleClosePreviewFile = () =>{
        setPreviewFile(false)
        setPreviewFileImg(false)
        setFileType('')
    }
    const handlePreviewFile = (item) => {
        if(item.filename.includes('.pdf')){
            setFileType('pdf')
            setPreviewFile(true)
        }else{
            setFileType('img')
            setPreviewFileImg(true)
        }
        setPreviewFileData(item.data)
    }
    return(
        <Grid container spacing={1} sx={{p:0}}>
                <Grid item xs={12} sx={{mb:1}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Button variant='contained' onClick={addData} color='success' className='custom-roundbutton' size={matches?'small':'auto'} startIcon={<AddIcon/>}>Add Row</Button>
                    </Box>
                </Grid>
                
                {/* <Grid item xs={12}>
                    <small><strong>Note:</strong> Selected date must completely   </small>
                </Grid> */}
                <Grid item xs={12} sx={{maxHeight:matches?' 50vh':'auto',overflow:'scroll'}}>
                    {
                        matches
                        ?
                        data.map((data2,index)=>
                            <Paper key={index} sx={{p:1,mb:1}} id={'div-id'+index}>
                            <Box>
                                <Typography sx={{width: 'fit-content',background: blue[900],color: '#fff',padding: '0 10px',borderTopRightRadius: '15px',borderBottomRightRadius: '15px',mb:1}}># {index+1}</Typography>
                                <DatePicker
                                        value={data2.date}
                                        onChange = {(value)=>setDate(index,value)}
                                        maxDate={new Date()}
                                        containerStyle={{
                                            width:'100%',
                                            minWidth:'100px',
                                            height:data2.date_err?'40px':'55px',
                                        }}
                                        mapDays={({ date }) => {
                                            let props2 = {}
                                            let isWeekend = [0, 6].includes(date.weekDay.index)
                                            // let isDisabled = props.appliedDates.includes(moment(new Date(date)).format('YYYY-MM-DD'))

                                            if (isWeekend) props2.className = "highlight highlight-red"
                                            // if (isDisabled) props2.disabled = true
                                            return props2
                                        }}
                                        placeholder='Date'
                                    />
                            </Box>
                            <Box sx={{mt:1}}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="nature-select-filled-label">Nature</InputLabel>
                                    <Select
                                    labelId="nature-select-filled-label"
                                    id={"nature-select-filled-label"+index}
                                    value={data2.nature}
                                    label="Nature"
                                    onChange = {(value)=>setNature(index,value.target.value)}
                                    >
                                    {natureData.map((data3,key3)=>
                                        <MenuItem value={data3} key = {key3}>{data3}</MenuItem>
                                    )}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{mt:1}}>
                                <Autocomplete
                                    disablePortal
                                    id={"combo-box-adjustment"+index}
                                    options={adjustmentLogsData}
                                    getOptionLabel={(option) => option.atype_desc}
                                    // sx={{ width: 250}}
                                    value = {data2.reason}
                                    onChange={(event, newValue) => {
                                        setReason(index,newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Adjustment Type" />}
                                />
                            </Box>
                            <Box sx={{mt:1}}>
                                <TextField type='time' variant='outlined' size = 'large' label = "Time" fullWidth InputLabelProps={{shrink:true}} value = {data2.rectified_time} onChange = {(value)=>setSpecifyTime(index,value.target.value)} />
                            </Box>
                            <Box sx={{mt:1}}>
                                <Button variant='outlined' color='error' size='small' startIcon={<DeleteForeverIcon/>} onClick={()=> deleteData(index)} fullWidth sx={{ marginBottom:'5px','&:hover': { bgcolor: red[800], color: '#fff' }, flex: 1 ,display:data.length === 1 ? 'none':'auto'}}>Delete Row</Button>
                                <label htmlFor={"contained-button-file"+index} style={{width:'100%'}}>
                                    <Input accept="image/*,.pdf" id={"contained-button-file"+index} type="file" onChange = {(value)=>handleFile(index,value)}/>
                                    
                                    <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[800], color: '#fff' }, flex: 1}}> {data2.file.length ===0?<Tooltip title='No file uploaded'><WarningIcon size='small' color='error' fontSize='small'/></Tooltip>:''} <AttachFile fontSize='small'/>Upload File </Button>

                                </label>
                            </Box>
                            
                            </Paper>
                        )
                        :
                        <Paper>
                        <TableContainer sx={{maxHeight:matches?'40vh':'50vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Nature</StyledTableCell>
                                    <StyledTableCell>Reason</StyledTableCell>
                                    <StyledTableCell>Specify Rectified Time</StyledTableCell>
                                    <StyledTableCell align='center'>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                data.length ===0
                                ?
                                <TableRow>
                                <StyledTableCell colSpan={5} sx={{textAlign:'center'}}> No Data</StyledTableCell>
                                </TableRow>
                                :
                                data.map((data2,index)=>
                                <TableRow key = {index}>
                                    <StyledTableCell>
                                    {
                                        data2.date_err
                                        ?
                                        <small style={{color:red[800]}}>Maximum missed log reached !</small>
                                        :
                                        null
                                    }
                                    <DatePicker
                                        value={data2.date}
                                        onChange = {(value)=>setDate(index,value)}
                                        // render={<InputIcon/> }
                                        // render={(value, openCalendar) => {
                                        //     return (
                                        //     <button onClick={openCalendar} className = "custom-inclusive-dates">
                                        //         <InputIcon/>
                                        //     </button>
                                        //     )
                                        // }}
                                        maxDate={new Date()}
                                        containerStyle={{
                                            width:'100%',
                                            minWidth:'100px',
                                            height:data2.date_err?'40px':'55px',
                                        }}
                                        mapDays={({ date }) => {
                                            let props2 = {}
                                            let isWeekend = [0, 6].includes(date.weekDay.index)
                                            // let isDisabled = props.appliedDates.includes(moment(new Date(date)).format('YYYY-MM-DD'))

                                            if (isWeekend) props2.className = "highlight highlight-red"
                                            // if (isDisabled) props2.disabled = true
                                            return props2
                                        }}
                                        placeholder='Date'
                                    />
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120}}>
                                            <InputLabel id="nature-select-filled-label">Nature</InputLabel>
                                            <Select
                                            labelId="nature-select-filled-label"
                                            id={"nature-select-filled-label"+index}
                                            value={data2.nature}
                                            label="Nature"
                                            onChange = {(value)=>setNature(index,value.target.value)}
                                            >
                                            {natureData.map((data3,key3)=>
                                                <MenuItem value={data3} key = {key3}>{data3}</MenuItem>
                                            )}
                                            </Select>
                                        </FormControl>
                                    
                                    </StyledTableCell>

                                    <StyledTableCell>
                                    
                                    <Autocomplete
                                        disablePortal
                                        id={"combo-box-adjustment"+index}
                                        options={adjustmentLogsData}
                                        getOptionLabel={(option) => option.atype_desc}
                                        sx={{ width: 250}}
                                        value = {data2.reason}
                                        onChange={(event, newValue) => {
                                            setReason(index,newValue);
                                        }}
                                        // renderOption={(props, option) => (
                                        //     option.atype_desc
                                        // )}
                                        renderInput={(params) => <TextField {...params} label="Adjustment Type" />}
                                    />
                                
                                    </StyledTableCell>

                                    <StyledTableCell>
                                    <TextField type='time' variant='outlined' size = 'large' label = "Time" fullWidth InputLabelProps={{shrink:true}} value = {data2.rectified_time} onChange = {(value)=>setSpecifyTime(index,value.target.value)} />
                                    </StyledTableCell>

                                    <StyledTableCell>
                                    <Button variant='outlined' color='error' size='small' startIcon={<DeleteForeverIcon/>} onClick={()=> deleteData(index)} fullWidth sx={{ marginBottom:'5px','&:hover': { bgcolor: red[800], color: '#fff' }, flex: 1 ,display:data.length === 1 ? 'none':'auto'}}>Delete Row</Button>
                                    <label htmlFor={"contained-button-file"+index} style={{width:'100%'}}>
                                        <Input accept="image/*,.pdf" id={"contained-button-file"+index} type="file" onChange = {(value)=>handleFile(index,value)} multiple/>
                                        
                                        <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[800], color: '#fff' }, flex: 1}}> {data2.file.length ===0?<Tooltip title='No file uploaded'><WarningIcon size='small' color='error' fontSize='small'/></Tooltip>:''} <AttachFile fontSize='small'/>Upload File</Button>

                                    </label>
                                    {
                                        data2.file.map((row,key)=>
                                        <li key={key} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>{row.filename}
                                        <Tooltip title='Preview File'><IconButton color='info' onClick={()=>handlePreviewFile(row)}><PreviewIcon/></IconButton></Tooltip>
                                        <Tooltip title='Remove file'><IconButton onClick={()=>removeFile(index,key)}><DeleteIcon sx={{color:red[800],fontSize:'1rem'}}/></IconButton></Tooltip>
                                        
                                        </li>
                                        )
                                    }
                                    </StyledTableCell>
                                
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        </TableContainer>
                        </Paper>
                    }
                    
                </Grid>
                
                <Grid item xs={12}>
                    <Box sx={{}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Button color='success' variant='contained' onClick={saveData} size='small' className='custom-roundbutton'>Save</Button>
                            &nbsp;
                            <Button color='error' variant='contained' onClick={props.handleClose} size='small' className='custom-roundbutton'> Cancel</Button>
                        </Box>
                    </Box>
                </Grid>
                <PreviewFileModal open = {previewFile} close = {handleClosePreviewFile} file={previewFileData} fileType={fileType}>
                </PreviewFileModal>
                <LargeModal open = {previewFileImg} close = {()=>setPreviewFileImg(false)} title = 'Preview File'>
                    <FilePanZoom img={previewFileData}/>
                </LargeModal>
            </Grid>
    )
}