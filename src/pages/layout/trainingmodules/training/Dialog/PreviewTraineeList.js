import React,{useEffect,useRef,useState} from 'react';
import {Grid,Typography,Table,TableHead,TableContainer,TablePagination,TableRow,TableBody,TableFooter,IconButton,Checkbox,Modal,TextField,Box,Button,Tooltip,FormGroup,FormControlLabel} from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { preViewFileAPI, viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import axios from 'axios';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green,orange} from '@mui/material/colors'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  export default function PreviewTraineeList(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?13:15,
        padding:10
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?12:14,
        padding:10
        },
    }));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 345:600,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    const [selectedIds,setSelectedIds] = useState('');
    const [isSelectAll,setIsSelectAll] = useState(false);
    const [finalData,setFinalData] = useState([]);
    const [fileName,setFileName] = useState('');
    const [saveModal,setSaveModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    useEffect(()=>{
        setSelectedIds(props.traineeNames)
        console.log(props)
    },[props.traineeNames])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleSelect = (id)=>{
        var temp = [...selectedIds];
        if(temp.includes(id)){
            var index = temp.indexOf(id);
            if(index>-1){
                temp.splice(index,1);
                setSelectedIds(temp)
            }
        }else{
            temp.push(id);
            setSelectedIds(temp)
        }
    }
    const handleSelectedAll = () =>{
        setIsSelectAll(!isSelectAll)
    }
    useEffect(()=>{
        if(isSelectAll){
            var temp = [];
            props.traineeNames.forEach(el => {
                temp.push(el.emp_id);
            });
            setSelectedIds(temp)
        }else{
            if(props.traineeNames.length === selectedIds.length){
                setSelectedIds([])
            }
        }
    },[isSelectAll])
    const buttonRef = useRef();
    const [isClick,setIsClick] = useState(0);
    const downloadList = () => {
        var temp = [];
            props.traineeNames.forEach(el=>{
                if(selectedIds.includes(el.emp_id)){
                    temp.push(el)
                }
            })
            setFinalData(temp)
            setSaveModal(true);
    }
    useEffect(()=>{
        if(isClick>0){
            if (buttonRef.current !== null) {
                buttonRef.current.click();
            }
        }
    },[isClick])
    const handleSaveFile = (event) =>{
        event.preventDefault();
        // setIsClick(isClick+1);
        if (buttonRef.current !== null) {
            setSaveModal(false)
            buttonRef.current.click();
        }
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                <Grid item xs={6} sx={{display:'flex',alignContent:'center'}}>
                    <FormGroup row sx={{ml:1}}>
                        <FormControlLabel control={<CheckCircleIcon color='success'/>} label=" Complete" />
                        <FormControlLabel control={<CancelIcon color='error'/>} label=" Incomplete" />
                    </FormGroup>
                </Grid>
                <Grid item xs={6} sx={{display:'flex',justifyContent:'flex-end'}}>
                    {
                        selectedIds.length === 0
                        ?
                        <React.Fragment>
                        <Tooltip title='Please select first a list'><span><IconButton  color='primary' disabled className='custom-iconbutton'><FileDownloadIcon/></IconButton></span></Tooltip>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <ExcelFile element={<IconButton ref={buttonRef}></IconButton>} filename={fileName}>
                                    <ExcelSheet data={finalData} name="Participants">
                                        <ExcelColumn label="First Name" value="fname"/>
                                        <ExcelColumn label="Middle Name" value="mname"/>
                                        <ExcelColumn label="Last Name" value="lname"/>
                                    </ExcelSheet>
                            </ExcelFile>
                            <Tooltip title='Download selected list'><span><IconButton onClick={downloadList} color='primary' className='custom-iconbutton'><FileDownloadIcon/></IconButton></span></Tooltip>
                            
                        </React.Fragment>
                    }
                    
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align='center'>Requirements</StyledTableCell>
                                <StyledTableCell align='center'>Evaluation</StyledTableCell>
                                {
                                    props.traineeNames.length === 0
                                    ?
                                    <StyledTableCell align='center'>Select</StyledTableCell>
                                    :
                                    <StyledTableCell align='center'>Select <br/><Checkbox checked = {isSelectAll} onChange = {handleSelectedAll} sx={{color:'#fff','&.Mui-checked': {color: '#fff'}}} checkedIcon={<RemoveOutlinedIcon/>}/></StyledTableCell>

                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.traineeNames.length === 0
                                ?
                                <TableRow>
                                    <StyledTableCell colSpan={4} align='center'>No Data</StyledTableCell>
                                </TableRow>
                                :
                                props.traineeNames.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                    <TableRow key={key} hover>
                                        <StyledTableCell>{row.lname}, {row.fname} </StyledTableCell>
                                        <StyledTableCell align='center'>
                                        {
                                            row.total_req_submitted === row.total_rqmts
                                            ?
                                            <CheckCircleIcon color='success'/>
                                            :
                                            <CancelIcon color='error'/>
                                        }
                                        {/* {props.compRqmt.includes(row.emp_id) ? <CheckCircleIcon color='success'/>:<CancelIcon color='error'/>} */}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                        {
                                            row.total_speaker === parseInt(row.total_speaker_evaluated) && row.evaluated_last_day
                                            ?
                                            <CheckCircleIcon color='success'/>
                                            :
                                            <CancelIcon color='error'/>
                                        }
                                        {/* {props.compEvaluation.includes(row.emp_id) ? <CheckCircleIcon color='success'/>:<CancelIcon color='error'/>} */}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                        <Checkbox checked={selectedIds.includes(row.emp_id) ? true:false} onChange = {()=>handleSelect(row.emp_id)}/>
                                        </StyledTableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 100]}
                                    colSpan={4}
                                    count={props.traineeNames.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                
            </Grid>
            <Modal
                open={saveModal}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* <CancelOutlinedIcon/> */}
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setSaveModal(false)}/>
                    <form onSubmit={handleSaveFile}>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Saving File
                    </Typography>
                    <Box sx={{mt:2,pt:1,pl:matches?2:4,pr:matches?2:4,pb:2,maxHeight:'70vh',overflowY:'scroll'}}>
                        <TextField label='File Name' value = {fileName} onChange = {(value)=>setFileName(value.target.value)} fullWidth required/>
                        <Button variant='contained' sx={{float:'right',mt:1}} type='submit'>Save</Button>
                    </Box>
                    </form>
                </Box>
            </Modal>
        </Grid>
    )
}