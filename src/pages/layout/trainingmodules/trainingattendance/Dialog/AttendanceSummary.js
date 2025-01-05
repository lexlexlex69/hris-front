import React,{useEffect, useState,useRef} from 'react';
import {Box,Stack,Skeleton,Grid,Typography,Paper,Autocomplete,TextField,Button,Select,FormControl,InputLabel,MenuItem,TableContainer,Table,TableRow,TableHead,TableBody,Checkbox,IconButton,Dialog,Tooltip,Fade} from '@mui/material'
import { getAttendanceSummary } from '../TrainingAttendanceRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue} from '@mui/material/colors';
import DataTableLoader from '../../../loader/DataTableLoader';
import moment from 'moment';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import ReactExport from "react-export-excel";
import DownloadIcon from '@mui/icons-material/Download';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
        paddingTop:1,
        paddingBottom:1,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      paddingTop:'5px',
        paddingBottom:'5px',
    },
  }));
export default function AttendanceSummary(props){
    const [showLoading,setShowLoading] = useState(true);
    const [data,setData] = useState([])
    const [days,setDays] = useState([])
    const tableRef = useRef('');

    useEffect(()=>{
        var data2 = {
            id:props.data.training_details_id
        }
        getAttendanceSummary(data2)
        .then(res=>{
            var f_date = new Date(res.data.date_period.period_from)
            var t_date = new Date(res.data.date_period.period_to)
            var d_arr=[];
            while(moment(f_date,'MM-DD-YYYY').format('MM-DD-YYYY') <= moment(t_date,'MM-DD-YYYY').format('MM-DD-YYYY')){
                d_arr.push(moment(f_date,'YYYY-MM-DD').format('YYYY-MM-DD'))
                f_date.setDate(f_date.getDate()+1);
                
            }
            setDays(d_arr);
            
            // setData(res.data)
            var sort_data = res.data.data
            sort_data.sort((a,b) => (a.lname > b.lname) ? 1 : ((b.lname > a.lname) ? -1 : 0))
            setData(sort_data)
            setShowLoading(false)
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[props.data])
    return(
        <Fade in>
            <Box>
                {
                    data.length === 0
                    ?
                    null
                    :
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mb:1}}>
                    <DownloadTableExcel
                        filename="Attendance Summary"
                        sheet="Attendance"
                        currentTableRef={tableRef.current}
                    >

                    <Tooltip title='Download Attendance Summary'><IconButton color='primary' className='custom-iconbutton   '><DownloadIcon/></IconButton></Tooltip>

                    </DownloadTableExcel>
                    </Box>

                }
                
                <div style={{display:'none'}}>
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th rowSpan={2}>Name</th>
                            <th rowSpan={2}>Department</th>
                            <th rowSpan={2}>Position</th>
                            {
                                days.map((row,key)=>
                                <th key={key} align='center' colSpan={2}>Day {key+1}<br/>{moment(row,'YYYY-MM-DD').format('MMMM DD,YYYY')}</th>

                                )
                            }
                        </tr>
                        <tr>
                            {
                                days.map((row,key)=>
                                <React.Fragment key={key}>
                                <td align='center'>AM</td>
                                <td align='center'>PM</td>
                                </React.Fragment>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                        data.map((row,key)=>
                            <tr key ={key}>
                                <td>{row.lname}, {row.fname}</td>
                                <td>{row.short_name}</td>
                                <td>{row.position_name}</td>
                                {
                                    days.map((row2,key2)=>
                                        <React.Fragment key = {key2}>
                                        <td align='center'>
                                            {
                                                JSON.parse(row.emp_info).map((row3,key3)=>
                                                row2 === row3.date && row3.period.search('AM') !== -1
                                                ?
                                                <React.Fragment key={key3}><small>{row3.period.replace('AM-','').replace('PM-','')}</small><br/></React.Fragment>
                                                :
                                                null

                                                )
                                            }
                                        </td>
                                        <td align='center'>
                                            {
                                                JSON.parse(row.emp_info).map((row3,key3)=>
                                                row2 === row3.date && row3.period.search('PM') !== -1
                                                ?
                                                <React.Fragment key={key3}><small>{row3.period.replace('PM-','').replace('AM-','')}</small><br/></React.Fragment>
                                                :
                                                null
                                                )
                                            }
                                        </td>
                                        </React.Fragment>

                                    )
                                    
                                }
                            </tr>
                        )
                        }
                    </tbody>
                </table>
                </div>
                
            <Paper>
                <TableContainer sx={{maxHeight:'70vh'}}>
                    <Table>
                        <TableHead sx={{position:'sticky',top:0}}>
                            <TableRow>
                                <StyledTableCell rowSpan={2}>Name</StyledTableCell>
                                <StyledTableCell rowSpan={2}>Department</StyledTableCell>
                                <StyledTableCell rowSpan={2}>Position</StyledTableCell>
                                {
                                    days.map((row,key)=>
                                    <StyledTableCell key={key} align='center' colSpan={2}>Day {key+1}<br/>{moment(row,'YYYY-MM-DD').format('MMMM DD,YYYY')}</StyledTableCell>
                                    )
                                }
                            </TableRow>
                            <TableRow>
                                {
                                    days.map((row,key)=>
                                    <React.Fragment key={key}>
                                    <StyledTableCell align='center'>AM</StyledTableCell>
                                    <StyledTableCell align='center'>PM</StyledTableCell>
                                    </React.Fragment>
                                    )
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                showLoading
                                ?
                                <TableRow>
                                    <StyledTableCell align='center' colSpan={7}><DataTableLoader/></StyledTableCell>
                                </TableRow>
                                :
                                data.length === 0
                                ?
                                <TableRow>
                                    <StyledTableCell align='center' colSpan={7}>No Data</StyledTableCell>
                                </TableRow>
                                :
                                data.map((row,key)=>
                                    <TableRow hover sx={{padding:'-10px'}} key ={key}>
                                        <StyledTableCell>{row.lname}, {row.fname}</StyledTableCell>
                                        <StyledTableCell>{row.short_name}</StyledTableCell>
                                        <StyledTableCell>{row.position_name}</StyledTableCell>
                                        {
                                            days.map((row2,key2)=>
                                                <React.Fragment key={key2}>
                                                <StyledTableCell align='center'>
                                                    {
                                                        JSON.parse(row.emp_info).map((row3,key3)=>
                                                        row2 === row3.date && row3.period.search('AM') !== -1
                                                        ?
                                                        <StyledTableCell align='center' sx={{border:'none'}} key={key3}><small>{row3.period.replace('AM-','').replace('PM-','')}</small><br/><CheckCircleOutlinedIcon sx={{color:green[800]}}/></StyledTableCell>
                                                        // <StyledTableCell>{row3.period}<br/>{row3.date}</StyledTableCell>
                                                        :
                                                        // 
                                                        null

                                                        )
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {
                                                        JSON.parse(row.emp_info).map((row3,key3)=>
                                                        row2 === row3.date && row3.period.search('PM') !== -1
                                                        ?
                                                        <StyledTableCell align='center' sx={{border:'none'}} key={key3}><small>{row3.period.replace('PM-','').replace('AM-','')}</small><br/><CheckCircleOutlinedIcon sx={{color:green[800]}}/></StyledTableCell>

                                                        // <StyledTableCell>{row3.period}<br/>{row3.date}</StyledTableCell>
                                                        :
                                                        null
                                                        )
                                                    }
                                                </StyledTableCell>
                                                </React.Fragment>

                                            )
                                            
                                        }
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            
            
            </Box>
        </Fade>
    )
}