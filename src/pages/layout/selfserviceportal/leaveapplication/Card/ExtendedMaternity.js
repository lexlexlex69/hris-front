import React,{useEffect, useState} from "react";
import {Paper,Typography,Box,Grid,SpeedDial,SpeedDialAction, Tooltip, IconButton, Stack, Skeleton, Fade} from '@mui/material';
import {createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,green,red,grey, orange} from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import './CardStyle.css';
import moment from "moment";
//Icons
import PrintIcon from '@mui/icons-material/Print';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachmentIcon from '@mui/icons-material/Attachment';

import PaginationOutlined from "../../../custompagination/PaginationOutlined";
import PaginateCard from "./PaginateCard";
import CardHeaderText from "./CardHeaderText";

export default function ExtendedMaternity(props,ref){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(()=>{
        console.log(props)
    },[])
    const [page,setPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(5)
    const handleChagePage = (e,page) =>{
        setPage(page)
    }
    return (
        <Box sx={{margin:matches?0:'0 20px 0 20px',mt:1,mb:1}}>
            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{p:1}}>
                    <Box>
                        <CardHeaderText color={red[500]} title='Extended Maternity Application'/>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}} id='card-div'>
                        <div style={{overflowX:'auto'}}>
                        <table id='card-table'>
                            <thead>
                                <tr>
                                    <th>
                                        Benefactor
                                    </th>
                                    <th>
                                        Allocated Days
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                </tr>
                                
                            </thead>
                            <tbody>
                               {
                                props.data.slice((page-1)*rowsPerPage,(page-1)*rowsPerPage+rowsPerPage).map((item,key)=>
                                    
                                    <Fade in key={key}>
                                    <tr>
                                        <td>
                                            {item.fname}
                                        </td>
                                        <td>
                                            {item.allocation_number_days}
                                        </td>
                                        <td>
                                            {item.status}
                                        </td>

                                    </tr>
                                    </Fade>
                                )
                               }
                            </tbody>
                        </table>
                        </div>
                    </Box>
                </Paper>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                    <PaginateCard data = {props.data} page={page} rowsPerPage={rowsPerPage} handleChagePage = {handleChagePage}/>
                </Grid>
                </Grid>
            </Grid>
        </Box>
        
    )
}