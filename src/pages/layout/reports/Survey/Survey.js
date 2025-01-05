import React, { useEffect, useRef, useState } from "react";
import {Box,Grid,Fade,Autocomplete,TextField,CircularProgress,Typography,Backdrop,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TableFooter,Paper,IconButton,Tooltip,Checkbox,Modal, Button,Dialog ,AppBar , Toolbar,Menu,MenuItem  } from '@mui/material';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { checkPermission } from "../../permissionrequest/permissionRequest";
import DashboardLoading from "../../loader/DashboardLoading";
import { getSurveyList, getSurveyResponses } from "./SurveyRequest";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { DownloadTableExcel } from 'react-export-table-to-excel';


//Icons
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

import SmallModal from "../../custommodal/SmallModal";
import { formatDeptWithChar } from "../../customstring/CustomString";
import Swal from "sweetalert2";

export default function SurveyReports(){
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const textTheme = createTheme ({
        typography: {
            // fontFamily:'Times New Roman',
            fontSize:12,

        }
    })
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[600],
        color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
        // fontSize: 12,
        paddingTop:5,
        paddingBottom:5,
        },
        [`&.${tableCellClasses.footer}`]: {
        // fontSize: 12,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor: orange[900],
        color:'#fff'
        },
    }));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        // p: 2,
    };
    const [isLoading,setIsLoading] = useState(true)
    const [surveyData,setSurveyData] = useState([])
    const [selectedSurvey,setSelectedSurvey] = useState(null)
    const [totalRespondent,setTotalRespondent] = useState(0)
    const [total,setTotal] = useState(0)
    const [totalAverage,setTotalAverage] = useState(0)
    const [resultsData,setResultsData] = useState([])
    const [resultsTextData,setResultsTextData] = useState([])
    const [open, setOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState([]);
    const [deptArrData, setDeptArrData] = useState([]);
    const handleOpen = (row) => {
        setOpen(true)
        setSelectedInfo(row)
    };
    const handleClose = () => setOpen(false);
    useEffect(()=>{
        checkPermission(69)
        .then((response)=>{
            // setIsLoading(false)
            if(response.data){
                getSurveyList()
                .then(res=>{
                    // console.log(res.data)
                    setSurveyData(res.data.data)
                    setIsLoading(false)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        })
    },[])
    const handleSetSurvey = (event, newVal) => {
        setSelectedSurvey(newVal)
    }
    const [loading,setLoading] = useState(false)
    const handleSubmit = (e) =>{
        e.preventDefault();
        if(selectedSurvey){
            setLoading(true)
            var t_data = {
                id:selectedSurvey.survey_id
            }
            getSurveyResponses(t_data)
            .then(res=>{
                var total_responses = res.data.data.length;
                var total_respondent_value = 0;
                var total_value = 0;
                var total_average = 0;
                var questions = [];
                res.data.results.forEach(el=>{
                        total_respondent_value+=el.total_respondent;
                        total_value+=el.total;
                })
                total_average = total_value/total_respondent_value
                setTotalRespondent(total_respondent_value)
                setTotal(total_value)
                setTotalAverage(total_average)
                setResultsData(res.data.results)
                setResultsTextData(res.data.results_text)
                setDeptArrData(res.data.dept)
                setLoading(false)

            }).catch(err=>{
                console.log(err)
            })
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please select survey'
            })
        }
        
    }
    const tableRef = useRef('');
    const formatTotalRespondentPerDeptData = (item,item2)=>{
        var itemResponses = JSON.parse(item.responses);
        var totalRespondent = 0;
        /**
        Populate data based on dept code
         */
        var total = 0;
        itemResponses.forEach(el=>{
            if(el.dept_code === item2.dept_code){
                totalRespondent++;
                total+=parseFloat(el.value)
            }
        })
        return totalRespondent;
    }
    const formatTotalPerDeptData = (item,item2) =>{
        var itemResponses = JSON.parse(item.responses);
        var totalRespondent = 0;
        /**
        Populate data based on dept code
         */
        var total = 0;
        itemResponses.forEach(el=>{
            if(el.dept_code === item2.dept_code){
                totalRespondent++;
                total+=parseFloat(el.value)
            }
        })
        return total;
    }
    const formatTotalAveragePerDeptData = (item,item2) =>{
        var itemResponses = JSON.parse(item.responses);
        var totalRespondent = 0;
        /**
        Populate data based on dept code
         */
        var total = 0;
        itemResponses.forEach(el=>{
            if(el.dept_code === item2.dept_code){
                totalRespondent++;
                total+=parseFloat(el.value)
            }
        })
        return (total/totalRespondent).toFixed(2);
    }
    const formatTotalData = (item2) =>{
        var total = 0;

        resultsData.forEach(el=>{
            var itemResponses = JSON.parse(el.responses);
            /**
            Populate data based on dept code
            */
            itemResponses.forEach(el2=>{
                if(el2.dept_code === item2.dept_code){
                    total+=parseFloat(el2.value)
                }
            })
            
        })
        return total;
    }
    const formatTotalAverageData= (item2) =>{
        var total = 0;
        var totalRespondent = 0;

        resultsData.forEach(el=>{
            var itemResponses = JSON.parse(el.responses);
            /**
            Populate data based on dept code
            */
            itemResponses.forEach(el2=>{
                if(el2.dept_code === item2.dept_code){
                    totalRespondent++;
                    total+=parseFloat(el2.value)
                }
            })
            
        })
        return (total/totalRespondent).toFixed(2);
    }
    return (
         <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading/>
                :
                <Fade in>
                    <Grid container>
                        <Grid item xs={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Survey Reports'/>
                        </Grid>
                        <form style={{width:'100%'}} onSubmit={handleSubmit}>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-survey"
                                value = {selectedSurvey}
                                onChange = {handleSetSurvey}
                                options={surveyData}
                                getOptionLabel={(option) => option.survey_name}
                                isOptionEqualToValue={(option, value) => option.survey_id === value.survey_id}
                                renderInput={(params) => <TextField {...params} label="Survey" />}
                                fullWidth
                            />
                            <Button variant="contained" type='submit'>Generate</Button>
                        </Grid>
                        </form>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                            onClick={()=>setLoading(false)}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                <CircularProgress color="inherit" />
                                <Typography>Loading results. Please wait...</Typography>
                            </Box>
                        </Backdrop>
                        <Grid item xs={12} sx={{mt:1}}>
                            {
                                resultsData.length>0
                                ?   
                                    <Box>
                                    <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                                    <DownloadTableExcel
                                        filename='Survey Results'
                                        sheet="Results"
                                        currentTableRef={tableRef.current}
                                        disabled={resultsData.length===0 ? true:false}
                                        style={{cursor:'d'}}
                                    >

                                    <Tooltip title='Download as excel file'><IconButton color='info' className="custom-iconbutton" sx={{'&:hover':{background:blue[700],color:'#fff'}}}><DownloadIcon/></IconButton></Tooltip>
                                    </DownloadTableExcel>
                                    
                                    </Box>
                                    <Paper>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>
                                                            Item No.
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <QuestionAnswerIcon fontSize='small'/> Question
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            Total Respondent
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            Total Rate
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            Average
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        resultsData.map((item,key)=>
                                                            <TableRow key={key} hover>
                                                                <StyledTableCell>
                                                                    {item.item_no} <Tooltip title='view item info'><IconButton color='info' onClick={()=>handleOpen(item)}><InfoOutlinedIcon fontSize="small"/></IconButton></Tooltip>
                                                                </StyledTableCell>
                                                                <StyledTableCell>
                                                                    {item.question}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="right">
                                                                    {item.total_respondent}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="right">
                                                                    {item.total}
                                                                </StyledTableCell>
                                                                 <StyledTableCell align="right">
                                                                    {(item.total/item.total_respondent).toFixed(2)}
                                                                </StyledTableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow >
                                                        <StyledTableCell align="right" colSpan={5}>
                                                            Total Average : {totalAverage.toFixed(2)}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>
                                        <SmallModal open={open} close = {handleClose} title={`Respondent of item no. ${selectedInfo.item_no}`}>
                                                <Box>
                                                    {
                                                        selectedInfo.responses
                                                        ?
                                                        <Paper>
                                                            <TableContainer sx={{maxHeight:'70vh'}}>
                                                                <Table stickyHeader>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <StyledTableCell>
                                                                                Employee ID
                                                                            </StyledTableCell>
                                                                            {/* <StyledTableCell>
                                                                                Name
                                                                            </StyledTableCell> */}
                                                                            <StyledTableCell>
                                                                                Rate
                                                                            </StyledTableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {
                                                                            JSON.parse(selectedInfo.responses).map((item,key)=>
                                                                                <TableRow key={key} hover>
                                                                                    <StyledTableCell>
                                                                                        {item.employee_id}
                                                                                    </StyledTableCell>
                                                                                     {/* <StyledTableCell>
                                                                                        {item.name}
                                                                                    </StyledTableCell> */}
                                                                                    <StyledTableCell>
                                                                                        {item.value}
                                                                                    </StyledTableCell>
                                                                                </TableRow>
                                                                            )
                                                                        }
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Paper>
                                                        :
                                                        ''
                                                    }
                                                </Box>
                                        </SmallModal>
                                        {/* <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={style}>
                                                <Box sx={{background:blue[800],p:1,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                                    <Typography variant="h6" sx={{color:'#fff'}}>
                                                        Respondent of item no. {selectedInfo.item_no}
                                                    </Typography>
                                                    <Tooltip title='Close'><IconButton color='error' size="small" sx={{background:'#fff','&:hover':{background:'#e5e5e5'}}} onClick={handleClose}><CloseIcon/></IconButton></Tooltip>
                                                </Box>
                                                <Box sx={{p:1}}>
                                                    {
                                                        selectedInfo.responses
                                                        ?
                                                        <Paper>
                                                            <TableContainer sx={{maxHeight:'70vh'}}>
                                                                <Table stickyHeader>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <StyledTableCell>
                                                                                Employee ID
                                                                            </StyledTableCell>
                                                                            <StyledTableCell>
                                                                                Rate
                                                                            </StyledTableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {
                                                                            JSON.parse(selectedInfo.responses).map((item,key)=>
                                                                                <TableRow key={key} hover>
                                                                                    <StyledTableCell>
                                                                                        {item.employee_id}
                                                                                    </StyledTableCell>
                                                                                    <StyledTableCell>
                                                                                        {item.value}
                                                                                    </StyledTableCell>
                                                                                </TableRow>
                                                                            )
                                                                        }
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Paper>
                                                        :
                                                        ''
                                                    }
                                                   
                                                </Box>
                                            </Box>
                                        </Modal> */}
                                    </Paper>
                                    <ThemeProvider theme={textTheme}>
                                        <Paper sx={{mt:2,p:1}}>
                                            <Typography variant="h5"><QuestionAnswerIcon fontSize="large" /> Other questions:</Typography>
                                            {
                                                resultsTextData.map((item,key)=>
                                                    <Box key={key} sx={{maxHeight:'50vh',overflowY:'scroll'}}>
                                                        <Typography sx={{fontWeight:'bold'}}>{item.item_no}. {item.question}</Typography>
                                                        <ul>
                                                            {
                                                                JSON.parse(item.responses).map((item2,key2)=>
                                                                    item2.value
                                                                    ?
                                                                    <li key={key2}><span style={{color:'#c5c55'}}>{item2.value}</span></li>
                                                                    :
                                                                    null
                                                                    
                                                                )
                                                            }
                                                        </ul>
                                                    </Box>
                                                )
                                            }
                                        </Paper>
                                    </ThemeProvider>
                                    <Paper>
                                        <Typography>Respondent per Office:</Typography>
                                        <TableContainer sx={{maxHeight:'70vh'}}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>
                                                            Item No.
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <QuestionAnswerIcon fontSize='small'/> Question
                                                        </StyledTableCell>
                                                        {
                                                            deptArrData.map((item,key)=>
                                                                <StyledTableCell key={key} colSpan={3} align="center">
                                                                    {item.short_name} <br/>
                                                                    {formatDeptWithChar(item.dept_title)}
                                                                </StyledTableCell>
                                                            )
                                                        }
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                        </TableCell>
                                                        {
                                                            deptArrData.map((item,key)=>
                                                                <React.Fragment key={key}>
                                                                <TableCell>
                                                                    Total Respondent
                                                                </TableCell>
                                                                <TableCell>
                                                                    Total Rate
                                                                </TableCell>
                                                                <TableCell>
                                                                    Average
                                                                </TableCell>
                                                                </React.Fragment>
                                                            )
                                                        }
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        resultsData.map((item,key)=>
                                                            <TableRow key={key} hover>
                                                                <StyledTableCell>
                                                                    {item.item_no}
                                                                    {/* <Tooltip title='view item info'><IconButton color='info' onClick={()=>handleOpen(item)}><InfoOutlinedIcon fontSize="small"/></IconButton></Tooltip> */}
                                                                </StyledTableCell>
                                                                <StyledTableCell>
                                                                    {item.question}
                                                                </StyledTableCell>
                                                                {
                                                                    deptArrData.map((item2,key2)=>
                                                                        <React.Fragment key={key}>
                                                                        <StyledTableCell>
                                                                            {formatTotalRespondentPerDeptData(item,item2)}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {formatTotalPerDeptData(item,item2)}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {formatTotalAveragePerDeptData(item,item2)}
                                                                        </StyledTableCell>
                                                                        </React.Fragment>
                                                                    )
                                                                }
                                                            </TableRow>
                                                        )
                                                    }
                                                    {/* <TableRow>
                                                        <StyledTableCell colSpan={2} align="right">
                                                            Total
                                                        </StyledTableCell>
                                                        {
                                                            deptArrData.map((item2,key2)=>
                                                                <StyledTableCell key={key2}>
                                                                    {formatTotalData(item2)}
                                                                </StyledTableCell>
                                                            )
                                                        }
                                                    </TableRow> */}
                                                    {/* <TableRow>
                                                        <StyledTableCell colSpan={2} align="right">
                                                            Average
                                                        </StyledTableCell>
                                                        {
                                                            deptArrData.map((item2,key2)=>
                                                                <StyledTableCell key={key2}>
                                                                    {formatTotalAverageData(item2)}
                                                                </StyledTableCell>
                                                            )
                                                        }
                                                    </TableRow> */}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow >
                                                        <StyledTableCell align="right" colSpan={(deptArrData.length*3)+2}>
                                                            Total Average : {totalAverage.toFixed(2)}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>
                                    </Paper>

                                    {/* Table Excel to download */}
                                    <div style={{display:'none'}}>
                                        <table ref={tableRef}>
                                            <thead>
                                                <tr>
                                                    <td>
                                                        Question
                                                    </td>
                                                    <td>
                                                        Total Respondent
                                                    </td>
                                                    <td>
                                                        Total Rate
                                                    </td>
                                                    <td>
                                                        Average
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    resultsData.map((item,key)=>
                                                        <tr key={key}>
                                                            <td>
                                                                {item.question}
                                                            </td>
                                                            <td align="right">
                                                                {item.total_respondent}
                                                            </td>
                                                            <td align="right">
                                                                {item.total}
                                                            </td>
                                                            <td align="right">
                                                                {(item.total/item.total_respondent).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td align="right" colSpan={4}>
                                                        Total Average : {totalAverage.toFixed(2)}
                                                    </td>
                                                </tr>
                                                {
                                                    resultsTextData.map((item,key)=>
                                                        <tr key={key}>
                                                            <td sx={{fontWeight:'bold'}}>{item.question}</td>
                                                            <td>
                                                            <ul>
                                                                {
                                                                    JSON.parse(item.responses).map((item2,key2)=>
                                                                        item2.value
                                                                        ?
                                                                        <li key={key2}><span style={{color:'#c5c55'}}>{item2.value}</span></li>
                                                                        :
                                                                        null
                                                                        
                                                                    )
                                                                }
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tfoot>
                                        </table>
                                    </div>
                                    </Box>
                                :
                                ''
                            }
                        </Grid>
                    </Grid>
                </Fade>
        }
        </Box>
    )
}