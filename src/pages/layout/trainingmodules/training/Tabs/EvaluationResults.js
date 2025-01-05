import React,{useEffect, useState,useRef} from 'react';
import {Grid,Paper,TableContainer,Table,TableHead,TableCell,TableBody,TableRow,Box, TableFooter, Typography,Fade,Tooltip,IconButton, Badge} from '@mui/material';
import {blue,green,grey,orange, red} from '@mui/material/colors';
import { getEvaluationResults, getEvaluationResultsPerSpeaker } from '../TrainingRequest';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import CircleIcon from '@mui/icons-material/Circle';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import { DownloadTableExcel } from 'react-export-table-to-excel';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CommentIcon from '@mui/icons-material/Comment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SmsIcon from '@mui/icons-material/Sms';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
    //   backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: 13,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
    [`&.${tableCellClasses.footer}`]: {
        fontSize: 11,
      },
  }));
export default function EvaluationResults(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoadingData,setIsLoadingData] = useState(true);
    const [resultsData,setResultsData] = useState([]);
    const [resultsData2,setResultsData2] = useState([]);
    const [commSuggestionData, setCommSuggestionData] = useState([]);
    const [comms1, setComms1] = useState([]);
    const [comms2, setComms2] = useState([]);
    const [comms3, setComms3] = useState([]);
    const [comms4, setComms4] = useState([]);
    const [speakerData,setSpeakerData] = useState([]);
    const [resultsDataPerSpeaker,setResultsDataPerSpeaker] = useState([]);
    const [resultsDataLastDay,setResultsDataLastDay] = useState([]);
    const [allTotal,setAllTotal] = useState(0);
    const [filterData,setFilterData] = useState(['All','Per Speaker']);
    const [filter,setFilter] = useState('All');
    const [totalPerQuestion,setTotalPerQuestion] = useState({
        'TopicQ1':0,
        'TopicQ2':0,
        'TopicQ3':0,
        'TopicQ4':0,
        'Resource1':0,
        'Resource2':0,
        'Resource3':0,
        'Resource4':0,
        'Resource4':0,
        'Participants1':0,
        'Participants2':0,
        'Participants3':0,
        'Management1':0,
        'Management2':0,
        'Management3':0,
        'OverAllImpression':0,
    });
    const handleChangeFilter = (event) => {
        // setTotalPerQuestion({
        //     'TopicQ1':0,
        //     'TopicQ2':0,
        //     'TopicQ3':0,
        //     'TopicQ4':0,
        //     'Resource1':0,
        //     'Resource2':0,
        //     'Resource3':0,
        //     'Resource4':0,
        //     'Resource4':0,
        //     'Participants1':0,
        //     'Participants2':0,
        //     'Participants3':0,
        //     'Management1':0,
        //     'Management2':0,
        //     'Management3':0,
        //     'OverAllImpression':0,
        // })
        setIsLoadingData(true)
        // if(event.target.value === 'All'){
        //     var data2 = {
        //         id:props.selectedTrainingID
        //     }
        //     getEvaluationResults(data2)
        //     .then(res=>{
        //         console.log(res.data)
        //         setResultsData(res.data)
        //         if(res.data.length !== 0){
        //             let temp = {...totalPerQuestion};
        //             let temp_alltotal = 0;
        //             res.data.forEach(el => {
        //                 JSON.parse(el.evaluation_details).forEach(el2=>{
        //                     if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 1){
        //                         temp.TopicQ1+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 2){
        //                         temp.TopicQ2+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 3){
        //                         temp.TopicQ3+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 4){
        //                         temp.TopicQ4+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 1){
        //                         temp.Resource1+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 2){
        //                         temp.Resource2+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 3){
        //                         temp.Resource3+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 4){
        //                         temp.Resource4+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'PARTICIPANTS' && el2.question_no === 1){
        //                         temp.Participants1+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'PARTICIPANTS' && el2.question_no === 2){
        //                         temp.Participants2+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'PARTICIPANTS' && el2.question_no === 3){
        //                         temp.Participants3+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'MANAGEMENT' && el2.question_no === 1){
        //                         temp.Management1+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'MANAGEMENT' && el2.question_no === 2){
        //                         temp.Management2+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'MANAGEMENT' && el2.question_no === 3){
        //                         temp.Management3+=el2.rate;
        //                     }
        //                     if(el2.evaluation_cat === 'OVERALL IMPRESSION' && el2.question_no === 1){
        //                         temp.OverAllImpression+=el2.rate;
        //                     }
    
        //                 })
        //             temp_alltotal+=parseInt(el.total);
                        
        //             });
        //             setTotalPerQuestion(temp);
        //             setAllTotal(temp_alltotal);
        //         }
                
        //         setIsLoadingData(false)
        //     }).catch(err=>{
        //         console.log(err)
        //     })
        // }else{
        //     var data2 = {
        //         id:props.selectedTrainingID
        //     }
        //     getEvaluationResultsPerSpeaker(data2)
        //     .then(res=>{
        //         console.log(res.data)
        //         setResultsDataPerSpeaker(res.data.per_speaker) 
        //         setResultsDataLastDay(res.data.last_day)
        //         setIsLoadingData(false)

        //     }).catch(err=>{
        //         console.log(err)
        //     })
        // }
        setFilter(event.target.value);
      };
    useEffect(()=>{
        var data2 = {
            id:props.selectedTrainingID
        }
        getEvaluationResults(data2)
        .then(res=>{
            console.log(res.data)
            setSpeakerData(res.data.speakers)
            setResultsData(res.data.data)
            setResultsData2(res.data.data2)
            setCommSuggestionData(res.data.comments_suggestion)
            setComms1(res.data.comments1)
            setComms2(res.data.comments2)
            setComms3(res.data.comments3)
            setComms4(res.data.comments4)
            // if(res.data.length !== 0){
            //     let temp = {...totalPerQuestion};
            //     let temp_alltotal = 0;
            //     res.data.forEach(el => {
            //         JSON.parse(el.evaluation_details).forEach(el2=>{
            //             if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 1){
            //                 temp.TopicQ1+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 2){
            //                 temp.TopicQ2+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 3){
            //                 temp.TopicQ3+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'TOPIC' && el2.question_no === 4){
            //                 temp.TopicQ4+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 1){
            //                 temp.Resource1+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 2){
            //                 temp.Resource2+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 3){
            //                 temp.Resource3+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'RESOURCE PERSON/S' && el2.question_no === 4){
            //                 temp.Resource4+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'PARTICIPANTS' && el2.question_no === 1){
            //                 temp.Participants1+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'PARTICIPANTS' && el2.question_no === 2){
            //                 temp.Participants2+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'PARTICIPANTS' && el2.question_no === 3){
            //                 temp.Participants3+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'MANAGEMENT' && el2.question_no === 1){
            //                 temp.Management1+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'MANAGEMENT' && el2.question_no === 2){
            //                 temp.Management2+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'MANAGEMENT' && el2.question_no === 3){
            //                 temp.Management3+=el2.rate;
            //             }
            //             if(el2.evaluation_cat === 'OVERALL IMPRESSION' && el2.question_no === 1){
            //                 temp.OverAllImpression+=el2.rate;
            //             }

            //         })
            //     temp_alltotal+=parseInt(el.total);
                    
            //     });
            //     setTotalPerQuestion(temp);
            //     setAllTotal(temp_alltotal);
            // }
            
            setIsLoadingData(false)
        }).catch(err=>{
            console.log(err)
        })
    },[props.selectedTrainingID])
    const [trainingRateData,setTrainingRateData] = useState([]) 

    const formatRate = (data,cat,q_no,trainer_data) =>{
        var total = 0;
        data.forEach(el=>{
            if(el.evaluation_cat === cat && el.question_no === q_no && el.fname === trainer_data.fname && el.lname === trainer_data.lname){
                total+=el.rate
            }
        })
        return total;
    }
    const formatTotalPerQuestion = (data,cat,q_no) =>{
        var total = 0;
        data.forEach(el=>{
            JSON.parse(el.evaluation_details).forEach(el2=>{
                if(el2.evaluation_cat === cat && el2.question_no === q_no){
                    total+=el2.rate;
                }
            })
        })
        return total;
    }
    const formatTotalPerParticipants = (data) =>{
        var total = 0;
        data.forEach(el=>{
            total+=el.rate
        })
        return total;
    }
    const formatAllTotalPerQuestion = (data)=>{
        var total = 0;
        data.forEach(el=>{
            JSON.parse(el.evaluation_details).forEach(el2=>{
                total+=el2.rate;
            })
        })
        return total;
    }
    const formatTotalAverage = (data) =>{
        let total = 0;
        let count = 0;
        data.forEach(el => {
            JSON.parse(el.evaluation_details).forEach(el2=>{
                if(el2.evaluation_cat === 'TOPIC' || el2.evaluation_cat === 'RESOURCE PERSON/S' || el2.evaluation_cat === 'PARTICIPANTS' || el2.evaluation_cat === 'MANAGEMENT'){
                    total+=el2.rate;
                    count++;
                }
            })
        });
        return (total/count).toFixed(2);
        // return count;
    }
    const formatTopicResourceAverage = (data) =>{
        let total = 0;
        let count = 0;
        data.forEach(el => {
            JSON.parse(el.evaluation_details).forEach(el2=>{
                if(el2.evaluation_cat === 'TOPIC' || el2.evaluation_cat === 'RESOURCE PERSON/S'){
                    total+=el2.rate;
                    count++;
                }
            })
        });
        return (total/count).toFixed(2);
    }
    const formatTotalImpression = (data) =>{
        let total = 0;
        let count = 0;
        data.forEach(el => {
            JSON.parse(el.evaluation_details).forEach(el2=>{
                if(el2.evaluation_cat === 'OVERALL IMPRESSION'){
                    total+=el2.rate;
                    count++;
                }
            })
        });
        return (total/count).toFixed(2);
    }
    const tableRef = useRef('');
    const formatTotal = (row) => {
        // var total_respondent = JSON.parse(row.evaluation_details).length;
        var data = JSON.parse(row.evaluation_details);
        var total_rate = 0;
        // var rate_number = 0;
        data.forEach(el=>{
            JSON.parse(el.details).forEach(el2=>{
                total_rate+=parseInt(el2.rate);
                // rate_number++;
            })
        })
        var total = 0;
        if(total_rate){
            return total_rate;
        }else{
            return 0;
        }
    }
    const formatAverage = (row) => {
        // var total_respondent = JSON.parse(row.evaluation_details).length;
        var data = JSON.parse(row.evaluation_details);
        var total_rate = 0;
        var rate_number = 0;
        data.forEach(el=>{
            JSON.parse(el.details).forEach(el2=>{
                total_rate+=parseInt(el2.rate);
                rate_number++;
            })
        })
        if(total_rate){
            return (total_rate/rate_number).toFixed(2);
        }else{
            return 0;
        }
    }
    return(
        <Fade in>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="filter-simple-select-label">Filter</InputLabel>
                        <Select
                        labelId="filter-simple-select-label"
                        id="filter-simple-select"
                        value={filter}
                        label="Filter"
                        onChange={handleChangeFilter}
                        >
                        {
                            filterData.map((row,key)=>
                            <MenuItem value={row} key={key}>{row}</MenuItem>
                            )
                        }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} className ='flex-row-flex-end'>
                    {
                        resultsData.length===0
                        ?
                        null
                        :
                            filter === 'All'
                            ?
                            <DownloadTableExcel
                                filename={props.selectedTrainingName+"- Evaluation Results"}
                                sheet="Evaluation"
                                currentTableRef={tableRef.current}
                                disabled={resultsData.length===0 ? true:false}
                                style={{cursor:'d'}}
                            >

                            <Tooltip title='Download evaluation results'><span><IconButton color='primary' className='custom-iconbutton'><DownloadIcon/></IconButton></span></Tooltip>
                            </DownloadTableExcel>
                            :
                            null
                            
                    }
                    
                    <div style={{display:'none'}}>
                        <table ref={tableRef}>
                                    <thead>
                                    <tr>
                                        <td/>
                                        {
                                            speakerData.map((row,key)=>
                                            <React.Fragment key={key}>
                                                <td colSpan={4} align='center'>TOPIC<br/>
                                                    {row.fname} {row.lname}
                                                </td>
                                                <td colSpan={4} align='center'>RESOURCE PERSON/S <br/>
                                                    {row.fname} {row.lname}
                                                </td>
                                                
                                            </React.Fragment>
                                            )
                                        }
                                        <td colSpan={3} align='center'>
                                            Participants
                                        </td>
                                        <td colSpan={3} align='center'>
                                            Management
                                        </td>
                                        <td rowSpan={2} align='center'>
                                            Overall Impression
                                        </td>
                                    </tr>
                                    
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td/>
                                        {
                                            speakerData.map((row,key)=>
                                            <React.Fragment key={key}>
                                                <td align='center'>
                                                    Q1
                                                </td>
                                                <td align='center'>
                                                    Q2
                                                </td>
                                                <td align='center'>
                                                    Q3
                                                </td>
                                                <td align='center'>
                                                    Q4
                                                </td>
                                                <td align='center'>
                                                    Q1
                                                </td>
                                                <td align='center'>
                                                    Q2
                                                </td>
                                                <td align='center'>
                                                    Q3
                                                </td>
                                                <td align='center'>
                                                    Q4
                                                </td>
                                            </React.Fragment>
                                            )
                                        }
                                        <td align='center'>
                                            Q1
                                        </td>
                                        <td align='center'>
                                            Q2
                                        </td>
                                        <td align='center'>
                                            Q3
                                        </td>
                                        <td align='center'>
                                            Q1
                                        </td>
                                        <td align='center'>
                                            Q2
                                        </td>
                                        <td align='center'>
                                            Q3
                                        </td>
                                    </tr>
                                    {
                                        resultsData.map((row,key)=>
                                            <tr key = {key}>
                                            <td align='center'>{key+1}</td>
                                            {
                                                speakerData.map((row2,key2)=>
                                                <React.Fragment key = {key2}>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'TOPIC',1,row2)}
                                                </td>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'TOPIC',2,row2)}
                                                </td>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'TOPIC',3,row2)}
                                                </td>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'TOPIC',4,row2)}
                                                </td>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',1,row2)}
                                                </td>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',2,row2)}
                                                </td>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',3,row2)}
                                                </td>
                                                <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',4,row2)}
                                                </td>
                                                </React.Fragment>
                                                )
                                            }
                                            <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'PARTICIPANTS',1,{fname:null,lname:null})}
                                            </td>
                                            <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'PARTICIPANTS',2,{fname:null,lname:null})}
                                            </td>
                                            <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'PARTICIPANTS',3,{fname:null,lname:null})}
                                            </td>
                                            <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'MANAGEMENT',1,{fname:null,lname:null})}
                                            </td>
                                            <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'MANAGEMENT',2,{fname:null,lname:null})}
                                            </td>
                                            <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'MANAGEMENT',3,{fname:null,lname:null})}
                                            </td>
                                            <td align='center'>
                                                    {formatRate(JSON.parse(row.evaluation_details),'OVERALL IMPRESSION',1,{fname:null,lname:null})}
                                            </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td align='center' colSpan={4}>
                                            <span style={{fontWeight:'bold'}}>Total Average</span> <br/>
                                            <span style={{color:blue[800]}}>{formatTotalAverage(resultsData)}</span>
                                            </td>
                                            <td align='center'>Description</td>
                                            <td align='center' colSpan={4}>
                                            <span style={{fontWeight:'bold'}}>Overall Impression</span> <br/>
                                            <span style={{color:blue[800]}}>{formatTotalImpression(resultsData)}</span>
                                            </td>
                                            <td align='center'>Overall Impression</td>
                                            <td align='center' colSpan={4}>
                                            <span style={{fontWeight:'bold'}}>Topic and Speakers</span> <br/>
                                            <span style={{color:blue[800]}}>{formatTopicResourceAverage(resultsData)}</span>
                                            </td>
                                            <td align='center'>Topic and Speakers</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={(speakerData.length*8)+8}>
                                                1. What are the new learning/s you get from the training?
                                            </td>
                                        </tr>
                                        {
                                            comms1.map((row,key)=>
                                            <tr key={key}>
                                                <td colSpan={(speakerData.length*8)+8}><CircleIcon fontSize='5px'/> {row.details}</td>
                                            </tr>
                                            )
                                        }

                                        <tr>
                                            <td colSpan={(speakerData.length*8)+8}>
                                                2. What are the important ideas that you consider helpful and applicable to your current function?
                                            </td>
                                        </tr>
                                        {
                                            comms2.map((row,key)=>
                                            <tr key={key}>
                                                <td colSpan={(speakerData.length*8)+8}><CircleIcon fontSize='5px'/> {row.details}</td>
                                            </tr>
                                            )
                                        }

                                        <tr>
                                            <td colSpan={(speakerData.length*8)+8}>
                                                3. What are the facilitating factors that contributed to your learning experience?
                                            </td>
                                        </tr>
                                        {
                                            comms3.map((row,key)=>
                                            <tr key={key}>
                                                <td colSpan={(speakerData.length*8)+8}><CircleIcon fontSize='5px'/> {row.details}</td>
                                            </tr>
                                            )
                                        }

                                        <tr>
                                            <td colSpan={(speakerData.length*8)+8}>
                                                4. What are the hindering factors affecting the conduct of this activity?
                                            </td>
                                        </tr>
                                        {
                                            comms4.map((row,key)=>
                                            <tr key={key}>
                                                <td colSpan={(speakerData.length*8)+8}><CircleIcon fontSize='5px'/> {row.details}</td>
                                            </tr>
                                            )
                                        }

                                        <tr>
                                            <td colSpan={(speakerData.length*8)+8}>
                                                5. Other comments, if any.
                                            </td>
                                        </tr>
                                        {
                                            commSuggestionData.map((row,key)=>
                                            <tr key={key}>
                                                <td colSpan={(speakerData.length*8)+8}><CircleIcon fontSize='5px'/> {row.details}</td>
                                            </tr>
                                            )
                                        }
                                        
                                    </tfoot>
                            </table>
                    </div>
                </Grid>
                    
                    {
                        filter === 'All'
                        ?
                        resultsData.length ===0
                        ?
                        <Stack sx={{ width: '100%' }}>
                            <Alert severity="info">No data.</Alert>
                        </Stack>
                        :
                        <Grid item xs={12} sx={{display:'block'}}>

                        <React.Fragment>
                        <Paper>
                            <TableContainer>
                            <Table>
                                <TableHead>
                                <TableRow sx={{background:blue[800]}}>
                                    <StyledTableCell/>
                                    {
                                        speakerData.map((row,key)=>
                                        <React.Fragment key={key}>
                                            <StyledTableCell align='center' colSpan={4}>TOPIC<br/>
                                                {row.fname} {row.lname}
                                            </StyledTableCell>
                                            <StyledTableCell align='center' colSpan={4} sx={{color:'#fff'}}>RESOURCE PERSON/S <br/>
                                                {row.fname} {row.lname}
                                            </StyledTableCell>
                                            
                                        </React.Fragment>
                                        )
                                    }
                                    <StyledTableCell align='center' colSpan={3} sx={{color:'#fff'}}>
                                        Participants
                                    </StyledTableCell>
                                    <StyledTableCell align='center' colSpan={3} sx={{color:'#fff'}}>
                                        Management
                                    </StyledTableCell>
                                    <StyledTableCell align='center' rowSpan={2} sx={{color:'#fff'}}>
                                        Overall Impression
                                    </StyledTableCell>
                                </TableRow>
                                
                                </TableHead>
                                <TableBody>
                                <TableRow sx={{color:blue[700]}}>
                                    <StyledTableCell/>
                                    {
                                        speakerData.map((row,key)=>
                                        <React.Fragment key={key}>
                                            <StyledTableCell align='center'>
                                                Q1
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Q2
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Q3
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Q4
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Q1
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Q2
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Q3
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Q4
                                            </StyledTableCell>
                                        </React.Fragment>
                                        )
                                    }
                                    <StyledTableCell align='center'>
                                        Q1
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        Q2
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        Q3
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        Q1
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        Q2
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        Q3
                                    </StyledTableCell>
                                </TableRow>
                                {
                                    resultsData.map((row,key)=>
                                        <TableRow key = {key} hover>
                                        <StyledTableCell sx={{background:grey[200]}}>{key+1}</StyledTableCell>
                                        {
                                            speakerData.map((row2,key2)=>
                                            <React.Fragment key = {key2}>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'TOPIC',1,row2)}
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'TOPIC',2,row2)}
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'TOPIC',3,row2)}
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'TOPIC',4,row2)}
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',1,row2)}
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',2,row2)}
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',3,row2)}
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'RESOURCE PERSON/S',4,row2)}
                                            </StyledTableCell>
                                            </React.Fragment>
                                            )
                                        }
                                        <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'PARTICIPANTS',1,{fname:null,lname:null})}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'PARTICIPANTS',2,{fname:null,lname:null})}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'PARTICIPANTS',3,{fname:null,lname:null})}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'MANAGEMENT',1,{fname:null,lname:null})}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'MANAGEMENT',2,{fname:null,lname:null})}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'MANAGEMENT',3,{fname:null,lname:null})}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                                {formatRate(JSON.parse(row.evaluation_details),'OVERALL IMPRESSION',1,{fname:null,lname:null})}
                                        </StyledTableCell>
                                        </TableRow>
                                    )
                                }
                                </TableBody>
                                </Table>
                                
                            </TableContainer>
                        
                        </Paper>
                        <Paper>
                            <Table>
                            <TableFooter>
                                <TableRow>
                                    <StyledTableCell align='center'>
                                    <span style={{fontWeight:'bold'}}>Total Average</span> <br/>
                                    <span style={{color:blue[800]}}>{formatTotalAverage(resultsData)}</span>
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>Description</StyledTableCell>
                                    <StyledTableCell align='center'>
                                    <span style={{fontWeight:'bold'}}>Overall Impression</span> <br/>
                                    <span style={{color:blue[800]}}>{formatTotalImpression(resultsData)}</span>
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>Overall Impression</StyledTableCell>
                                    <StyledTableCell align='center'>
                                    <span style={{fontWeight:'bold'}}>Topic and Speakers</span> <br/>
                                    <span style={{color:blue[800]}}>{formatTopicResourceAverage(resultsData)}</span>
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>Topic and Speakers</StyledTableCell>
                                </TableRow>

                                {/* <TableRow>
                                    <StyledTableCell colSpan={6} sx={{fontWeight:'italic'}}>
                                        5. Other comments, if any.
                                    </StyledTableCell>
                                </TableRow>
                                {
                                    commSuggestionData.map((row,key)=>
                                    <TableRow key={key}>
                                        <StyledTableCell colSpan={(speakerData.length*8)+8}><CircleIcon fontSize='5px'/> {row.details}</StyledTableCell>
                                    </TableRow>
                                    )
                                } */}
                                
                            </TableFooter>
                            </Table>
                            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',borderBottom: 'solid 1px #0086cd',borderBottomLeftRadius: '15px',marginTop: '10px',marginBottom: '10px',boxShadow:'3px 5px 10px #0086cd'}}>
                            
                            <IconButton color='info'><QuestionAnswerIcon sx={{fontSize:'30px'}}/></IconButton>
                            <Typography sx={{fontWeight:600,fontFamily:'Lato'}}>Comments and Reactions</Typography>

                            </Box>

                            <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <Typography sx={{fontWeight:'lighter'}}>1. What are the new learning/s you get from the training?
                                &nbsp;
                                {
                                    comms1.length>0
                                    ?
                                    <Badge badgeContent={comms1.length} color="primary">
                                    <SmsIcon color="action" />
                                    </Badge>
                                    :
                                    null
                                }
                                </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        comms1.map((row,key)=>
                                            <Typography key={key} sx={{color:'#4d4d4d'}}> <CommentIcon fontSize='1px' sx={{color:'#7c7c7c'}}/> {row.details}</Typography>
                                        )
                                    }
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                                >
                                <Typography>2. What are the important ideas that you consider helpful and applicable to your current function?
                                &nbsp;
                                {
                                    comms2.length>0
                                    ?
                                    <Badge badgeContent={comms1.length} color="primary">
                                    <SmsIcon color="action" />
                                    </Badge>
                                    :
                                    null
                                }
                                </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        comms2.map((row,key)=>
                                            <Typography key={key} sx={{color:'#4d4d4d'}}> <CommentIcon fontSize='1px' sx={{color:'#7c7c7c'}}/> {row.details}</Typography>
                                        )
                                    }
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                                >
                                <Typography>3. What are the facilitating factors that contributed to your learning experience?
                                &nbsp;
                                {
                                    comms3.length>0
                                    ?
                                    <Badge badgeContent={comms1.length} color="primary">
                                    <SmsIcon color="action" />
                                    </Badge>
                                    :
                                    null
                                }
                                </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        comms3.map((row,key)=>
                                            <Typography key={key} sx={{color:'#4d4d4d'}}> <CommentIcon fontSize='1px' sx={{color:'#7c7c7c'}}/> {row.details}</Typography>
                                        )
                                    }
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel4a-content"
                                id="panel4a-header"
                                >
                                <Typography>4. What are the hindering factors affecting the conduct of this activity?
                                &nbsp;
                                {
                                    comms4.length>0
                                    ?
                                    <Badge badgeContent={comms1.length} color="primary">
                                    <SmsIcon color="action" />
                                    </Badge>
                                    :
                                    null
                                }
                                </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        comms4.map((row,key)=>
                                            <Typography key={key} sx={{color:'#4d4d4d'}}> <CommentIcon fontSize='1px' sx={{color:'#7c7c7c'}}/> {row.details}</Typography>
                                        )
                                    }
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel5a-content"
                                id="panel5a-header"
                                >
                                <Typography>5. Other comments, if any.
                                &nbsp;
                                {
                                    commSuggestionData.length>0
                                    ?
                                    <Badge badgeContent={comms1.length} color="primary">
                                    <SmsIcon color="action" />
                                    </Badge>
                                    :
                                    null
                                }
                                </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        commSuggestionData.map((row,key)=>
                                            <Typography key={key} sx={{color:'#4d4d4d'}}> <CommentIcon fontSize='1px' sx={{color:'#7c7c7c'}}/> {row.details}</Typography>
                                        )
                                    }
                                </AccordionDetails>
                            </Accordion>
                            </Box>
                        </Paper>
                        </React.Fragment>
                        </Grid>

                        :
                        resultsData2.map((row,key)=>
                        <Grid item xs={12} key = {key} sx={{mb:1}}>
                        <Box sx={{background:blue[900],color:'#fff',p:1,width:matches?'100%':300,mb:1,borderTopRightRadius:'20px',borderBottomRightRadius:'20px'}}>
                            <Typography sx={{fontSize:'1.1rem'}}>Name : <strong>{row.fname} {row.lname}</strong></Typography>
                            <Typography sx={{fontSize:'.9rem'}}>Topic : {row.topic}</Typography>
                            <Typography sx={{fontSize:'.9rem'}}>Period : {row.period}</Typography>
                        </Box>
                        <Paper>
                        <TableContainer sx={{maxHeight:'60vh'}}>
                            <Table>
                                <TableHead sx={{position:'sticky',top:0}}>
                                    <TableRow sx={{background:blue[800]}}>
                                        <StyledTableCell rowSpan={2} sx={{width:80}} align='center'>No.</StyledTableCell>
                                        <StyledTableCell colSpan={4} align='center' sx={{background:blue[700]}}>Topic</StyledTableCell>
                                        <StyledTableCell colSpan={4} align='center' sx={{background:blue[700]}}>Resource Person/s</StyledTableCell>
                                    </TableRow>
                                    <TableRow sx={{background:blue[500]}}>
                                        <StyledTableCell align='center'>Q1</StyledTableCell>
                                        <StyledTableCell align='center'>Q2</StyledTableCell>
                                        <StyledTableCell align='center'>Q3</StyledTableCell>
                                        <StyledTableCell align='center'>Q4</StyledTableCell>
                                        <StyledTableCell align='center'>Q1</StyledTableCell>
                                        <StyledTableCell align='center'>Q2</StyledTableCell>
                                        <StyledTableCell align='center'>Q3</StyledTableCell>
                                        <StyledTableCell align='center'>Q4</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        JSON.parse(row.evaluation_details).map((row2,key2)=>
                                            <TableRow key = {key2} hover>
                                                <StyledTableCell align='center'>{key2+1}</StyledTableCell>

                                                {
                                                    JSON.parse(row2.details).map((row3,key3)=>
                                                    <StyledTableCell key = {key3} align='center'>{row3.rate}</StyledTableCell>
                                                    )

                                                }
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter sx={{position:'sticky',insetBlockEnd:0}}>
                                    <TableRow sx={{background:grey[100]}}>
                                        <StyledTableCell/>
                                        <StyledTableCell colSpan={4} align='center'>
                                        <span style={{fontWeight:'bold'}}>Total</span> <br/>
                                        <span style={{color:blue[800]}}>{formatTotal(row)}</span>
                                        </StyledTableCell>
                                        <StyledTableCell colSpan={4} align='center'>
                                        <span style={{fontWeight:'bold'}}>Average</span> <br/>
                                        <span style={{color:blue[800]}}>{formatAverage(row)}</span>
                                        </StyledTableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        </Paper>
                        <hr/>
                        </Grid>

                    )

                        }
                    
            </Grid>
        </Fade>
    )
}