import React,{useState,useEffect} from 'react';
import {Box,Grid,Fade,Autocomplete,TextField,CircularProgress,Typography,Backdrop,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TableFooter,Paper,IconButton,Tooltip } from '@mui/material';
import DashboardLoading from '../../../loader/DashboardLoading';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../../permissionrequest/permissionRequest';
import ModuleHeaderText from '../../../moduleheadertext/ModuleHeaderText';
import { executeForfeiture, getOffices, getOfficesLeaveDtl } from '../LeaveApplicationRequest';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//icons
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import moment from 'moment';
export default function Forfeiture(){
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        // fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        // fontSize: 13,
        },
    }));
    const [isLoading,setIsLoading] = useState(true)
    const [fetchLoading,setFetchLoading] = useState(false)
    const [officeData,setOfficeData] = useState([]);
    const [selectedOffice,setSelectedOffice] = useState(null);
    const [data,setData] = useState([]);
    useEffect(()=>{
        checkPermission(50)
        .then((response)=>{
            setIsLoading(false)
            if(response.data){
                getOffices()
                .then(res=>{
                    console.log(res.data)
                    setOfficeData(res.data)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[]) 
    const handleSelectOffice = async(data)=>{
        console.log(data)
        setSelectedOffice(data)
        if(data){
            setFetchLoading(true)
            var t_data = {
                dept_code:data.dept_code
            }
            await getOfficesLeaveDtl(t_data)
            .then(res=>{
                console.log(res.data)
                setData(res.data)
                setFetchLoading(false)
                if(res.data.length ===0){
                    toast.error('No data found or office may have already executed the forfeiture.')
                }

            }).catch(err=>{
                console.log(err)
            })
        }else{
            setData([])
        }
        
    }
    const handleForfeiture = ()=>{
        if(data.length ===0){
            Swal.fire({
                icon:'error',
                title:'Oops...',
                html:'Empty data'
            })
        }else{
            Swal.fire({
                icon:'info',
                title:'Executing FL forfeiture to '+selectedOffice.short_name,
                html:'Please wait...'
            })
            Swal.showLoading();
            var t_data  = {
                data:data,
                dept_code:selectedOffice.dept_code
            }
            executeForfeiture(t_data)
            .then(res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    setData(res.data.data)
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close();
                console.log(err)
            })
        }

    }
    const formatforfeit = (row)=>{
        var to_forfeit;
        if(row.total>= 5){
            to_forfeit = 0;
        }else{
            to_forfeit = 5-row.total;
        }

        if(to_forfeit !==0){
            if(row.vl_bal<10){
                to_forfeit = 0;
            }else{
                var t_deduct = row.vl_bal-9;
                if(t_deduct < to_forfeit){
                    to_forfeit = t_deduct;
                }
            }
        }
        return parseInt(to_forfeit);
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading/>
                :
                <Fade in>
                    <Grid container>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={fetchLoading}
                            // onClick={loadingFilter}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <Typography>Loading data</Typography>
                                <CircularProgress color="inherit" />

                            </Box>
                        </Backdrop>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='FL Forfeiture'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Autocomplete
                                disablePortal
                                id="offices-box"
                                options={officeData}
                                getOptionLabel={(option) => option.dept_title}
                                sx={{width:300}}
                                // isOptionEqualToValue={(option, value) => option.perm_menu_id === value.perm_menu_id}
                                value={selectedOffice}
                                onChange={(event, newValue) => {
                                    handleSelectOffice(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Office Name *"/>
                                )}
                            />
                        </Grid>
                        {
                            data.length === 0
                            ?
                            null
                            :
                            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1,nb:1}}>
                                <Tooltip title='Execute forfeiture'><IconButton sx={{color:red[800],'&:hover':{color:'#fff',background:red[800]}}}className='custom-iconbutton' onClick={handleForfeiture}><PersonRemoveIcon/></IconButton></Tooltip>
                            </Grid>
                        }
                        
                        <Grid item xs={12} sx={{mt:1}}>
                            <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>VL Balance</StyledTableCell>
                                            <StyledTableCell>Total Applied (VL/FL) {moment(new Date(),'MM-DD-YYYY').format('YYYY')}</StyledTableCell>
                                            <StyledTableCell>To forfeit</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data.length ===0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={3} align='center'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                            :
                                            data.map((row,key)=>
                                                <TableRow hover key={key}>
                                                    <TableCell>
                                                        {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+'.':''} {row.emp_lname} 
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.vl_bal}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.total}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            formatforfeit(row)
                                                        }
                                                    </TableCell>

                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
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