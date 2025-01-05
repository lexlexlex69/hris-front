import { Box, Fade, Grid,Autocomplete,TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell   } from '@mui/material';
import React,{useEffect, useState} from 'react';
import {
    useNavigate
} from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { auditLogs } from '../../../auditlogs/Request';
import { toast } from 'react-toastify';
import { checkPermission } from '../../../permissionrequest/permissionRequest';
import DashboardLoading from '../../../loader/DashboardLoading';
import ModuleHeaderText from '../../../moduleheadertext/ModuleHeaderText';
import { getHRForApproval } from './HRApprovalRequest';
export default function HRApproval(){
     // navigate
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true);
    const [data,setData] = useState([]);
    const [data1,setData1] = useState([]);
    const [offices,setOffices] = useState([]);
    const [filterOffice,setFilterOffice] = useState(null);
    useEffect(()=>{
        var logs = {
            action:'ACCESS ONLINE LEAVE APPLICATION',
            action_dtl:'ACCESS ONLINE LEAVE APPLICATION MODULE',
            module:'ONLINE LEAVE'
        }
        auditLogs(logs)        //request to get the info of current employee login
        checkPermission(62)
        .then((response)=>{
            // console.log(response.data)
            if(response.data === 1){
                getHRForApproval()
                .then(res=>{
                    console.log(res.data)
                    setData(res.data)
                    setData1(res.data)
                    const uniqueOffice = Array.from(new Set(res.data.map(obj => obj.officeassign)));
                    setOffices(uniqueOffice)
                }).catch(err=>{
                    console.log(err)
                })
                setIsLoading(false)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch(err=>{
            toast.error(err)
        })
    },[])
    return(
    <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
        {
            isLoading
            ?
            <DashboardLoading actionButtons={1}/>
            :
            <Fade in>
                <Grid container>
                    <Grid item xs={12} sx={{margin:'0 0 10px 0'}}>
                        <ModuleHeaderText title = 'HR Leave Approval'/>
                    </Grid>
                    <Grid item xs={12} sx={{mt:1}}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={offices}
                            sx={{ width: 300 }}
                            value = {filterOffice}
                            onChange={(event, newValue) => {
                                setFilterOffice(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Filter Office" />}
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <TableContainer>    
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Name
                                            </TableCell>
                                            <TableCell>
                                                Leave Type
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </Paper>

                    </Grid>
                </Grid>
            </Fade>
        }
        
    </Box>
    )
}