import React,{useState} from "react";
import {Paper,Typography,Box,Grid,Alert, Tooltip, IconButton} from '@mui/material';
import {createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,green,red,grey} from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import './CardStyle.css';

//Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CardHeaderText from "./CardHeaderText";

export default function LeaveBalances(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box sx={{margin:matches?0:'0 20px 0 20px',mt:1,mb:1}}>
            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{p:1}}>
                    <Box>
                        <CardHeaderText color={blue[800]} title='Leave Balance'/>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}} id='card-div'>
                        <div style={{overflowX:'auto',width:'100%'}}>
                        <table id='card-table'>
                            <thead>
                                <tr>
                                    <th>
                                        Type of Leave
                                    </th>
                                    <th>
                                        Balance
                                    </th>
                                    <th>
                                        On Process
                                    </th>
                                    <th>
                                        Available
                                    </th>
                                </tr>
                                
                            </thead>
                            <tbody>
                                <tr className="hover-row">
                                    <td className="orange">
                                        Vacation Leave
                                    </td>
                                    <td>
                                        {(props.balanceData[0].vl_bal).toFixed(3)}
                                    </td>
                                    <td>
                                        {props.onProcess.vl}
                                    </td>
                                    <td  className="green">
                                        {
                                            props.balanceData[0].vl_bal>=props.onProcess.vl
                                            ?
                                            (props.balanceData[0].vl_bal-props.onProcess.vl).toFixed(3)
                                            :
                                            props.balanceData[0].vl_bal.toFixed(3)
                                        }
                                        {/* {(props.balanceData[0].vl_bal-props.onProcess.vl).toFixed(3)} */}
                                    </td>
                                </tr>
                                <tr className="hover-row">
                                    <td className="orange">
                                        Sick Leave
                                    </td>
                                    <td>
                                        {(props.balanceData[0].sl_bal).toFixed(3)}
                                    </td>
                                    <td>
                                        {props.onProcess.sl}
                                    </td>
                                    <td  className="green">
                                        {
                                            props.balanceData[0].sl_bal>=props.onProcess.sl
                                            ?
                                            (props.balanceData[0].sl_bal-props.onProcess.sl).toFixed(3)
                                            :
                                            props.balanceData[0].sl_bal.toFixed(3)
                                        }
                                    </td>
                                </tr>
                                <tr className="hover-row">
                                    <td className="orange">
                                        Compensatory Overtime Credits
                                        <Tooltip title='View COC earned info'><IconButton color='info' size='small' onClick={props.handleViewCOCInfo}><InfoOutlinedIcon/></IconButton></Tooltip>
                                    </td>
                                    <td>
                                        {(parseFloat(props.availableCOC-props.totalForReview)+parseFloat(props.onProcess.coc)).toFixed(3)}
                                    </td>
                                    <td>
                                        {props.onProcess.coc}
                                    </td>
                                    <td  className="green">
                                        {parseFloat(props.availableCOC-props.totalForReview).toFixed(3)}
                                    </td>
                                </tr>
                                <tr className="hover-row">
                                    <td className="orange">
                                        Special Privilege Leave
                                    </td>
                                    <td>
                                        {props.availableSPL}
                                    </td>
                                    <td>
                                        {props.onprocessSPL}
                                    </td>
                                    <td  className="green">
                                        {
                                            props.availableSPL>=props.onprocessSPL
                                            ?
                                            props.availableSPL-props.onprocessSPL
                                            :
                                            0
                                        }
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4}>
                                        <Alert severity="info"><Typography sx={{fontFamily:'latoreg',fontStyle:'italic',fontSize:'.8rem',textAlign:'justify'}}>The Leave credits indicated above are subject for further adjustment upon subsequent review of other pertinent records, if warranted.</Typography></Alert>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        </div>
                    </Box>
                </Paper>
                </Grid>
            </Grid>
        </Box>
        
    )
}