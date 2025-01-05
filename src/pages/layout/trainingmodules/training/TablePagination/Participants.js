import React,{useEffect, useRef, useState} from 'react';
import {Box,Typography,Button,IconButton,Dialog,AppBar,Toolbar,Tooltip,TextField,Grid,Checkbox,InputAdornment,Backdrop,CircularProgress } from '@mui/material';
// media query
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {TableHead} from '@mui/material';
import Paper from '@mui/material/Paper';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {green,orange,grey,blue,red, purple} from '@mui/material/colors';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {styled } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import DownloadIcon from '@mui/icons-material/Download';

import ReactToPrint,{useReactToPrint} from 'react-to-print';

import Swal from 'sweetalert2';
import { getAlreadyPostedPDS, getEvaluationStatus, getParticipantsRqmt, postTrainingToPDS, updateRemarks } from '../TrainingRequest';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import { getMyRqmt } from '../../traineedashboard/TraineeDashboardRequest';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { searchValueFunction } from '../../../searchtable/Search';
import { socket,enabledSocket } from '../../../../../request/SocketIO';
import ReactExport from "react-export-excel";
import {toast} from 'react-toastify';
import moment from 'moment';
import { APILoading, APIresult } from '../../../apiresponse/APIResponse';
import MediumModal from '../../../custommodal/MediumModal';
import { PrintParticipants } from './PrintParticipants';
import FullModal from '../../../custommodal/FullModal';
import DefaultRequirementsPreview from '../../traineedashboard/TabsComponent/CustomComponents/DefaultRequirementsPreview';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Participants(props){
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: matches?13:15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize:matches?11:13,
    },
  }));
  const [data,setData] = useState([])
  const [data1,setData1] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [updatedUsername,setUpdatedUsername] = useState();
  const [trainingDetailsID,setTrainingDetailsID] = useState()
  // useEffect(()=>{
  //   console.log(enabledSocket)

  //   if(enabledSocket){
  //     socket.on('connection');
  //     socket.on("update-training-rqmts-channel", function(message){
  //         // console.log(message)
  //         setOptRqmtData(message.data.data.data)
  //         setRqmtData2(JSON.parse(message.data.data.data.training_rqmt))
  //         // setUpdatedUsername(message.data.data.username)
  //         toast.info('New Requirements Update: '+message.data.data.username);
  //     });
  //   }
    
  // },[]) 
  // useEffect(()=>{
  //   if(updatedUsername){
  //     toast.info('New Requirements Update: '+updatedUsername);
  //   }
  // },[updatedUsername])
  useEffect(()=>{
    var temp = [];
    setTrainingDetailsID(props.rows[0].training_details_id)
    props.rows.forEach(element => {
        if(element.approved === 1){
            temp.push(element)
        }
    });
    var temp_sort = temp
    temp_sort.sort((a,b) => (a.lname > b.lname) ? 1 : ((b.lname > a.lname) ? -1 : 0))
    // return temp;
    setData(temp_sort)
    setData1(temp_sort)
  },[props.rows])
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [openRqmtDialog, setOpenRqmtDialog] = useState(false);
  const handleCloseRqmtDialog = () => {
    setOpenRqmtDialog(false);
  };
  const [optRqmtData,setOptRqmtData] = useState([])
  const [reqRqmtData,setReqRqmtData] = useState([])
  const [rqmtData2,setRqmtData2] = useState([])
  const [selectedTrainee,setSelectedTrainee] = useState([])
  const [loadingRqmt,setLoadingRqmt] = useState(false)
  const [evaluationData,setEvaluationData] = useState({
    'trainer_data':[],
    'evaluated_last_day':null
  })
  const handleRqmt = async(data)=>{
    setLoadingRqmt(true)
    setSelectedTrainee(data)
    var data2 = {
      id:data.training_shortlist_id,
    }
    await getEvaluationStatus(data2)
    .then(res=>{
      setEvaluationData(res.data)
      console.log(res.data)
    }).catch(err=>{
      setLoadingRqmt(false)
      console.log(err)
    })
    
    
    await getParticipantsRqmt(data2)
    .then(res=>{
      console.log(res.data)
      setOptRqmtData(res.data.opt_rqmt)
      setReqRqmtData(res.data.req_rqmt)
      setLoadingRqmt(false)
    }).catch(err=>{
      setLoadingRqmt(false)

      console.log(err)
    })
    setOpenRqmtDialog(true)
  }
  const viewFile = (id,rqmt)=>{
    viewFileAPI(id,rqmt);
  }
  const handleSetRemarks = (index,value)=>{
    // console.log(optRqmtData)
    var temp = [...optRqmtData]

    temp[index].remarks = value.target.value;
    temp[index].new_upload = null;
    setOptRqmtData(temp)
  }
  const handleSetReqRemarks = (index,value)=>{
    // console.log(optRqmtData)
    var temp = [...reqRqmtData]

    temp[index].remarks = value.target.value;
    temp[index].new_upload = null;
    setReqRqmtData(temp)
  }
  const handleCheck = (index)=>{
    // console.log(optRqmtData)
    var temp = [...optRqmtData]
    var check = temp[index].verified === null ? false:temp[index].verified


    temp[index].verified = !check;
    setOptRqmtData(temp)
  }
  const handleCheckReqRqmt = (index)=>{
    // console.log(optRqmtData)
    var temp = [...reqRqmtData]
    var check = temp[index].verified === null ? false:temp[index].verified


    temp[index].verified = !check;
    setReqRqmtData(temp)
  }
  const handleSave = ()=>{
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
            id:selectedTrainee.training_shortlist_id,
            opt_data:optRqmtData,
            req_data:reqRqmtData,
          }
          // console.log(data2)
          updateRemarks(data2)
          .then(res=>{
            console.log(res.data)
            if(res.data.status ===200){
              console.log(res.data)
              setOptRqmtData(res.data.data.opt_rqmt)
              setReqRqmtData(res.data.data.req_rqmt)
              Swal.fire({
                icon:'success',
                title:res.data.message,
                timer:1500,
                showConfirmButton:false
              })
            }else{
              Swal.fire({
                icon:'error',
                title:res.data.message,
              })
            }
          }).catch(err=>{
            Swal.close()
            console.log(err)
          })
      }
    })
    
  }
  const handleRefresh = async()=>{
  console.log('refresh')
    Swal.fire({
      icon:'info',
      title:'Reloading data',
      html:'Please wait...'
    })
    Swal.showLoading()
    var data2= {
      id:selectedTrainee.training_shortlist_id
    }
    await getParticipantsRqmt(data2)
    .then(res=>{
      setOptRqmtData(res.data.opt_rqmt)
      setReqRqmtData(res.data.req_rqmt)
      Swal.fire({
        icon:'success',
        timer:1000,
        showConfirmButton:false
      })
    }).catch(err=>{
      console.log(err)
    })
    // getMyRqmt(data2)
    // .then(res=>{
    //   setRqmtData2(JSON.parse(res.data.training_rqmt))
    //   Swal.fire({
    //     icon:'success',
    //     timer:1000,
    //     showConfirmButton:false
    //   })
    // }).catch(err=>{
    //     Swal.close()
    //     console.log(err)
    // })
  }
  const [searchValue,setSearchValue] = useState('');
  const handleSearch = (value)=>{
      setPage(0)
      setSearchValue(value.target.value)
      var item = ['fname','lname','position_name','short_name']
      var temp = searchValueFunction(data1,item,value.target.value);
      setData(temp)
  }
  const handleClearSearch = () =>{
      setSearchValue('')
      setData(data1)
  }
  const [tempData,setTempData] = useState([])
  const [allSelected,setAllSelected] = useState(true)
  const handlePostToPDS = () =>{
    /**
    Check if has selected trainee
     */
    var check = tempData.filter(el=>el.selected===true)
    if(check.length>0){
      APILoading('info','Posting training to employee PDS','Please wait...');
      var t_data = {
        list:check,
        id:trainingDetailsID
      }
      postTrainingToPDS(t_data)
      .then(res=>{
        console.log(res.data)
        APIresult(res)
        if(res.data.status === 200){
          handleCloseTraineeList()
        }
      }).catch(err=>{
        console.log(err)
      })
    }else{
      Swal.fire({
        icon:'warning',
        title:'Oops...',
        html:'Please select trainee !'
      })
    }
    
  }
  const [openTraineeList,setOpenTraineeList] = useState(false);
  const handleOpenTraineeList = () =>{
    var t_data = {
      id:trainingDetailsID
    }
    APILoading('info','Loading available data','Please wait...')
    getAlreadyPostedPDS(t_data)
    .then(res=>{
      console.log(data)
      const temp = data.filter(o=>res.data.data.some(i=>i.emp_id === o.emp_id))
      // var temp = [];
      console.log(temp)
      temp.forEach(el=>{
        el.selected = true
      })
      setTempData(temp)
      setOpenTraineeList(true)
      setAllSelected(true)
      Swal.close()
    })
    

  }
  const handleCloseTraineeList = () =>{
    setOpenTraineeList(false)
    setSearchVal('')
  }
  const handleSelect = (item) =>{
    var temp = [...tempData];
    temp.forEach(el=>{
      if(el.emp_id === item.emp_id){
        el.selected = !el.selected
      }
    })
    // temp[index].selected = !temp[index].selected
    setTempData(temp)
  }
  useEffect(()=>{
    if(allSelected){
      var temp = [...tempData];
      temp.forEach(el=>{
        el.selected = true;
      })
      setTempData(temp)
    }else{
      var temp = [...tempData];
      temp.forEach(el=>{
        el.selected = false;
      })
      setTempData(temp)
    }
  },[allSelected])
  const [searchVal,setSearchVal] = useState('');
  const filterData = tempData.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) | el.lname.toUpperCase().includes(searchVal.toUpperCase()))
  const printParticipants  = useReactToPrint({
      content: () => participantsPrintRef.current,
      documentTitle: 'Participants '

  });
  const participantsPrintRef = useRef()
  const [openViewTrainingApp,setOpenViewTrainingApp] = useState(false);
  const handleViewTrainingApp = () =>{
    setOpenViewTrainingApp(true)
  }
  return(
      <React.Fragment>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingRqmt}
        >
          <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <CircularProgress color="inherit" />
          <Typography>Loading Participant's Requirement Info</Typography>
          </Box>
        </Backdrop>
        <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',mb:1}}>
        <TextField label='Search Table' value = {searchValue} onChange={handleSearch} placeholder='Firstname, Lastname' InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
          }}/>
            {
              data.length === 0
              ?
              null
              :
              <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                {/* <Tooltip title='Print List'><IconButton className='custom-iconbutton' color='primary' sx={{mt:matches?1:0,float:matches?'right':'none','&:hover':{color:'#fff',background:blue[800]}}} onClick={printParticipants}><PrintOutlinedIcon/></IconButton></Tooltip> */}
                <ExcelFile element={<Tooltip title='Download List'><IconButton className='custom-iconbutton' color='primary' sx={{mt:matches?1:0,float:matches?'right':'none','&:hover':{color:'#fff',background:blue[800]}}}><DownloadIcon/></IconButton></Tooltip>} filename={`Approved Shortlist as of ${moment().format('MMMM DD YYYY hh_mm_ss a')}`}>
                        <ExcelSheet data={data} name="Participants">
                            <ExcelColumn label="Department" value="short_name"/>
                            <ExcelColumn label="First Name" value="fname"/>
                            <ExcelColumn label="Last Name" value="lname"/>
                            <ExcelColumn label="Position" value=" "/>
                        </ExcelSheet>
              </ExcelFile>
              <Tooltip title='Post training to PDS'><IconButton color='secondary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:purple[800]}}} onClick={handleOpenTraineeList}><DriveFolderUploadIcon/></IconButton></Tooltip>
              
              </Box>

            }
          
        </Box>
        <div style={{display:'none'}}>
            <PrintParticipants data = {data} ref={participantsPrintRef}/>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  Department
                </StyledTableCell>
                <StyledTableCell>
                  Name
                </StyledTableCell>
                <StyledTableCell>
                  Position
                </StyledTableCell>
                <StyledTableCell>
                  Employment Status
                </StyledTableCell>
                <StyledTableCell>
                  Status
                </StyledTableCell>
                <StyledTableCell align='center'>
                  Training Requirements
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data.length !==0
                ?
              (rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((row,key) => (
                <TableRow key={key}>
                  <StyledTableCell component="th" scope="row">
                    {row.short_name}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                  {row.lname}, {row.fname} {row.mname?row.mname.charAt(0):''}.
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.position_name}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.emp_status}
                  </StyledTableCell>
                  {
                    row.approved === 1
                    ?
                    <StyledTableCell component="th" scope="row" sx={{color:green[800]}}>
                      Approved
                    </StyledTableCell>
                    :
                    <StyledTableCell component="th" scope="row" sx={{color:grey[500]}}>
                    Pending
                    </StyledTableCell>
                  } 
                  <StyledTableCell component="th" scope="row" align='center'>
                    <Tooltip title='View Requirements Info'><IconButton disabled={row.approved === 1 ? false:true} onClick = {()=>handleRqmt(row)} className='custom-iconbutton'><RateReviewOutlinedIcon color='primary'/></IconButton></Tooltip>
                  </StyledTableCell>
                </TableRow>
              ))
                  :
                  <TableRow>
                    <StyledTableCell align='center' colSpan={6}>No Data</StyledTableCell>
                  </TableRow>
            }
    
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />

              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <MediumModal open = {openTraineeList} close = {handleCloseTraineeList} title= 'List of available trainee to be posted'>
            <Box sx={{p:1}}>
              <TextField label = 'Search' value = {searchVal} onChange={(val)=>setSearchVal(val.target.value)} placeholder='Firstname | Lastname' fullWidth sx={{mb:1}}/>

              <Paper>
                <TableContainer sx={{maxHeight:'60vh'}}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Name
                        </TableCell>
                        <TableCell align='center'>
                          Select<br/>
                          <Checkbox checked={allSelected} onChange={()=>setAllSelected(!allSelected)}/>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        filterData.map((item,key)=>
                          <TableRow key={key}>
                            <TableCell>
                              {item.lname}, {item.fname}
                            </TableCell>
                            <TableCell align='center'>
                              <Checkbox checked={item.selected} onChange={()=>handleSelect(item)}/>
                            </TableCell>
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              <Typography sx={{textAlign:'right',fontStyle:'italic',color:'#6b6b6b'}}>Total: {filterData.length}</Typography>
              
              <Box sx={{display:'flex',justifyContent:'flex-end',gap:1,mt:1}}>
                <Button variant='contained' color='success' className='custom-roundbutton' size='small' onClick={handlePostToPDS}>Save</Button>
                <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCloseTraineeList}>Cancel</Button>
              </Box>
            </Box>
        </MediumModal>

        <Dialog
              fullScreen
              open={openRqmtDialog}
              // onClose={handleCloseDialog}
              TransitionComponent={Transition}
          >
              <AppBar sx={{ position: 'sticky',top:0 }}>
              <Toolbar>
                  <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseRqmtDialog}
                  aria-label="close"
                  >
                  <CloseIcon />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Participant's Requirement Info
                  </Typography>
                  <Button autoFocus color="inherit" onClick={handleCloseRqmtDialog}>
                  close
                  </Button>
              </Toolbar>
              </AppBar>
              <Box sx={{m:2,pt:1}}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                    {/* <TextField label='Name' fullWidth defaultValue={optRqmtData.fname+' '+optRqmtData.lname} inputProps={{readOnly:true,style:{fontWeight:'bold'}}}/> */}
                    <TextField label='Name' fullWidth defaultValue={selectedTrainee.fname+' '+selectedTrainee.lname} inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        {/* <TextField label='Department' fullWidth defaultValue={optRqmtData.short_name} inputProps={{readOnly:true,style:{fontWeight:'bold'}}}/> */}
                        <TextField label='Department' fullWidth defaultValue={selectedTrainee.short_name} inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={12} sx={{mt:2}}>
                      <Typography sx={{fontWeight:'bold',pb:1}}>Requirement Details:</Typography>
                      <Paper>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                {
                                  reqRqmtData.map((row,key)=>
                                    <StyledTableCell align='center'>{row.training_app}</StyledTableCell>
                                  )
                                }
                                {
                                  optRqmtData.length !==0
                                  ?
                                  optRqmtData.map((data,key)=>
                                    <StyledTableCell key={key} align='center'>{data.rqmt_name}</StyledTableCell>
                                  )
                                  :
                                  null
                                  
                                }
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                {
                                  reqRqmtData.length !==0
                                  ?
                                  reqRqmtData.map((data,key)=>
                                  <TableCell key={key} align='center'>
                                  {/* <Tooltip title={data.file_id === null?'No File Uploaded':'View Uploaded File'}><span><IconButton disabled={data.file_id === null?true:false} sx={{color:data.new_upload?orange[800]:blue[800]}} onClick={()=>viewFile(data.file_id,data.training_app)} className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></span></Tooltip> */}
                                  {
                                    data.emp_id
                                    ?
                                    <>
                                    <Tooltip title={data.emp_id?'View Uploaded File':'No File Uploaded'}><span><IconButton disabled={data.emp_id?false:true} sx={{color:data.new_upload?orange[800]:blue[800]}} onClick={handleViewTrainingApp} className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></span></Tooltip>

                                  <FullModal open = {openViewTrainingApp} close = {()=>setOpenViewTrainingApp(false)}title={`Viewing ${data.name}'s ${data.type}`}>
                                    <DefaultRequirementsPreview reqData = {data}/>
                                  </FullModal>
                                  &nbsp;
                                  
                                  <Tooltip title={data.verified?'Verified':'Click to Certify Correct'}><Checkbox inputProps = {{ 'aria-label': 'controlled' }} icon={<VerifiedOutlinedIcon />} checkedIcon={<VerifiedRoundedIcon color='primary'/>} onChange = {()=>handleCheckReqRqmt(key)} checked = {data.verified} className='custom-iconbutton'/></Tooltip>
                                  <br/>
                                  <TextField label='Remarks' variant='standard' value={data.remarks === null ?'':data.remarks} onChange = {(value)=>handleSetReqRemarks(key,value)} sx={{mt:1}}/>
                                    </>
                                    :
                                    <Tooltip title='No File Uploaded'><span><IconButton className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></span></Tooltip>
                                  }
                                  
                                  
                                  </TableCell>
                                  )
                                  :
                                  null
                                }
                                {
                                  optRqmtData.length !==0
                                  ?
                                  optRqmtData.map((data,key)=>
                                  // <TableCell key={key} align='center'>{data.status.length===0?'N/A':data.status}<br/><IconButton disabled={data.file.length === 0?true:false}><VisibilityOutlinedIcon/></IconButton><br/>
                                  // <TextField label='Remarks' value={data.remarks}/>
                                  // </TableCell>
                                  <TableCell key={key} align='center'><Tooltip title={data.file_id === null?'No File Uploaded':'View Uploaded File'}><span><IconButton disabled={data.file_id === null?true:false} sx={{color:data.new_upload?orange[800]:blue[800]}} onClick={()=>viewFile(data.file_id,data.rqmt)} className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></span></Tooltip>
                                  &nbsp;
                                  <Tooltip title={data.verified?'Verified':'Click to Certify Correct'}><Checkbox inputProps = {{ 'aria-label': 'controlled' }} icon={<VerifiedOutlinedIcon />} checkedIcon={<VerifiedRoundedIcon color='primary'/>} onChange = {()=>handleCheck(key)} checked = {data.verified} className='custom-iconbutton'/></Tooltip>
                                  <br/>
                                  <TextField label='Remarks' variant='standard' value={data.remarks === null ?'':data.remarks} onChange = {(value)=>handleSetRemarks(key,value)} sx={{mt:1}}/>
                                  
                                  </TableCell>
                                  )
                                  :
                                  null
                                }
                              </TableRow>
                            </TableBody>
                            
                            {
                              optRqmtData.length>0 || reqRqmtData.length>0
                              ?
                              <TableFooter>
                                <TableRow>
                                  <TableCell colSpan={optRqmtData.length+1} align='right'>
                                    <Tooltip title='Reload Data'><IconButton onClick={handleRefresh} className='custom-iconbutton'><RefreshOutlinedIcon color='primary' sx={{fontSize:'30px'}}/></IconButton></Tooltip>
                                    &nbsp;
                                    <Tooltip title='Save Update'><IconButton onClick={handleSave} className='custom-iconbutton'><SaveAsOutlinedIcon color='success' sx={{fontSize:'30px'}}/></IconButton></Tooltip>
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                              :
                              null
                            }
                            
                          </Table>
                        </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sx={{mt:2}}>
                      <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                        <Box>
                          <Typography sx={{fontWeight:'bold'}}>Evaluation Details:</Typography>
                        </Box>
                        <Box sx={{pb:1}}>
                          <CheckCircleOutlineOutlinedIcon color='success'/> - Completed
                          &nbsp;
                          <CancelOutlinedIcon color='error'/> - Incomplete
                        </Box>
                      </Box>
                        <Paper>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>
                                    Speaker Name
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Date
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Topic
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Period
                                  </StyledTableCell>
                                  <StyledTableCell align='center'>
                                    Evaluated
                                  </StyledTableCell>
                                  <StyledTableCell align='center'>
                                    Last Day Evaluation
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {
                                  evaluationData.trainer_data.map((row,key)=>
                                    <TableRow key={key}>
                                        <StyledTableCell>
                                          {row.fname} {row.lname}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {moment(row.training_date).format('MMMM DD,YYYY')}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {row.topic}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {row.period}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                          {row.evaluated ? <Tooltip title='Already Evaluated'><span><IconButton sx={{color:green[800],fontWeight:'bold'}}><CheckCircleOutlineOutlinedIcon/></IconButton></span></Tooltip>:<span style={{color:red[800],fontWeight:'bold'}}><CancelOutlinedIcon/></span>}
                                        </StyledTableCell>
                                        {
                                          key===0
                                          ?
                                          <StyledTableCell rowSpan={evaluationData.trainer_data.length} align='center'>
                                            {evaluationData.evaluated_last_day.evaluated_last_day? <Tooltip title='Already Evaluated'><span><IconButton sx={{color:green[800],fontWeight:'bold'}}><CheckCircleOutlineOutlinedIcon/></IconButton></span></Tooltip>:<span style={{color:red[800],fontWeight:'bold'}}><CancelOutlinedIcon/></span>}
                                          </StyledTableCell>
                                          :
                                          null
                                        }
                                    </TableRow>
                                  )
                                }
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                    </Grid>
                  </Grid>
              </Box>

          </Dialog>
      </React.Fragment>

    )
}
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
      
    );
  }
  