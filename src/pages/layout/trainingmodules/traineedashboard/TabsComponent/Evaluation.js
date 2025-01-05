import React,{useEffect, useState} from 'react';
import {Grid,Fade,Box,TableContainer,Table,TableRow,TableHead,TableBody,Paper,IconButton,Tooltip,Typography,Button} from '@mui/material';
import DataTableLoader from '../../../loader/DataTableLoader';
import { getMyEvaluation } from '../TraineeDashboardRequest';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue} from '@mui/material/colors';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Evaluate from '../Dialog/Evaluate';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import LastDayEvaluate from '../Dialog/LastDayEvaluate';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TableLoading from '../../../loader/TableLoading';
import moment from 'moment';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function Evaluation(props){
    const [data,setData] = useState([])
    const [toEvaluate,setToEvaluate] = useState([]);
    const [openEvaluationDialog,setOpenEvaluationDialog] = useState(false)
    const [openLastEvaluationDialog,setOpenLastEvaluationDialog] = useState(false)
    const [selectedToEvaluate,setSelectedToEvaluate] = useState([])
    const [lastEvaluationData,setLastEvaluationData] = useState([])
    const [evaluatedLastDay,setEvaluatedLastDay] = useState(false)
    const [lastDayEvaluation,setLastDayEvaluation] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(true)
    useState(()=>{
        var data2 = {
            training_details_id:props.data.training_details_id,
            training_shortlist_id:props.data.training_shortlist_id
        }
        getMyEvaluation(data2)
        .then(res=>{
            console.log(res.data)
            setData(res.data.trainer_data)
            // setToEvaluate(res.data.to_evaluate)
            setEvaluatedLastDay(res.data.evaluated_last_day)
            setLastDayEvaluation(res.data.last_day_evaluation)
            setIsLoadingData(false)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleOpenEvaluationDialog = (data)=>{
        setSelectedToEvaluate(data)
        setOpenEvaluationDialog(true)

    }
    const handleCloseEvaluationDialog = ()=>{
        setOpenEvaluationDialog(false)
    }
    const handleUpdateData = (data)=>{
        // console.log(data)
        setOpenEvaluationDialog(false)
        setOpenLastEvaluationDialog(false)
        setData(data.trainer_data)
        setToEvaluate(data.to_evaluate)
        setEvaluatedLastDay(data.evaluated_last_day)
    }
    const handleOpenLastEvaluationDialog = (data)=>{
        console.log(data)
        setLastEvaluationData(data)
        setOpenLastEvaluationDialog(true)
    }
    const handleCloseLastEvaluationDialog = ()=>{
        setOpenLastEvaluationDialog(false)
    }
    return(
        <React.Fragment>
            {
                isLoadingData
                ?
                <TableLoading/>
                :
                <Fade in>
                    <Box>
                    <Alert severity="info" sx={{mb:1}}>One of the requirements to get a training certificate is to evaluate all the speakers.</Alert>

                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            Date
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Speaker Name
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Period
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Topic
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Action
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Last Day Evaluation
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <StyledTableCell>
                                                    {moment(row.training_date).format('MMMM DD, YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell>{row.fname} {row.mname?row.mname.charAt(0)+'.':null} {row.lname}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {row.period}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {row.topic}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {
                                                        row.enabled_evaluation
                                                        ?
                                                            row.evaluated
                                                            ?
                                                            <Tooltip title='Already evaluated'><span><Button color='primary'><TaskAltOutlinedIcon/>&nbsp; Done</Button></span></Tooltip>
                                                            :
                                                            <Tooltip title='Evaluate Speaker'><span><IconButton color='primary' disabled ={row.evaluated?true:false} onClick={()=>handleOpenEvaluationDialog(row)} className='custom-iconbutton'><FactCheckOutlinedIcon/></IconButton></span></Tooltip>
                                                        :
                                                        <Tooltip title='Evaluation not enabled'><span><IconButton color='primary' disabled className='custom-iconbutton'><FactCheckOutlinedIcon/></IconButton></span></Tooltip>
                                                    }
                                                   
                                                </StyledTableCell>
                                                
                                                {
                                                    key == 0 && !evaluatedLastDay && lastDayEvaluation
                                                    ?
                                                    <StyledTableCell rowSpan={data.length} align='center'>
                                                        <Tooltip title='Evaluate'><span><IconButton color='primary' onClick={()=>handleOpenLastEvaluationDialog(row)}><FactCheckOutlinedIcon/></IconButton></span></Tooltip>
                                                    </StyledTableCell>
                                                    :
                                                        key == 0 && evaluatedLastDay
                                                        ?
                                                        <StyledTableCell rowSpan={data.length} align='center'>
                                                        <Tooltip title='Already evaluated'><span><Button color='primary'><TaskAltOutlinedIcon/>&nbsp; Done</Button></span></Tooltip>
                                                        </StyledTableCell>
                                                        :
                                                        null
                                                }
                                            </TableRow>
                                        )
                                    }
                                    {/* {
                                        data.map((row,key)=>
                                            <TableRow key={key}>
                                                <StyledTableCell>
                                                    {row.fname} {row.lname}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {
                                                        row.evaluated
                                                        ?
                                                        <Tooltip title='Already evaluated'><span><IconButton color='primary'><TaskAltOutlinedIcon/></IconButton></span></Tooltip>
                                                        :
                                                        <Tooltip title='Evaluate Speaker'><span><IconButton color='primary' disabled ={row.evaluated?true:toEvaluate.includes(row.trainer_id)?false:true}onClick={()=>handleOpenEvaluationDialog(row)} className='custom-iconbutton'><FactCheckOutlinedIcon/></IconButton></span></Tooltip>
                                                    }
                                                   
                                                </StyledTableCell>
                                                {
                                                    key == 0 && !evaluatedLastDay && lastDayEvaluation
                                                    ?
                                                    <StyledTableCell rowSpan={data.length} align='center'>
                                                        <Tooltip title='Evaluate'><span><IconButton color='primary' onClick={()=>handleOpenLastEvaluationDialog(row)}><FactCheckOutlinedIcon/></IconButton></span></Tooltip>
                                                    </StyledTableCell>
                                                    :
                                                        key == 0 && evaluatedLastDay
                                                        ?
                                                        <StyledTableCell rowSpan={data.length} align='center'>
                                                        <Tooltip title='Already evaluated'><span><IconButton color='primary'><TaskAltOutlinedIcon/></IconButton></span></Tooltip>
                                                        </StyledTableCell>
                                                        :
                                                        null
                                                }
                                                
                                            </TableRow>
                                        )
                                    } */}
                                </TableBody>
                            </Table>
                        </TableContainer>
                <Dialog
                    fullScreen
                    open={openEvaluationDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseEvaluationDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Evaluating a Speaker
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseEvaluationDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Evaluate data={selectedToEvaluate} handleUpdateData={handleUpdateData}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={openLastEvaluationDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseLastEvaluationDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Last Day Evaluation
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseLastEvaluationDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <LastDayEvaluate data={props.data} handleUpdateData={handleUpdateData}/>
                    </Box>

                    </Dialog>
                    </Paper>
                </Box>
                </Fade>
            }
        </React.Fragment>
    )
}