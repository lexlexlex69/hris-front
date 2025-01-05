import React,{useEffect, useState} from 'react';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Fade, Grid, Box, TextField, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Typography } from '@mui/material';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { execute, masqueradeUser, searchEmpMasquerade } from './Request';
import Swal from 'sweetalert2';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
export default function Masquerade(){
    // navigate
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [searchText,setSearchText] = useState('')
    const [searchData,setSearchData] = useState([])
    useEffect(()=>{
        checkPermission(60)
        .then(res=>{
            if(res.data === 1){
                setIsLoading(false)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const proceed = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Searching user',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            text:searchText
        }
        searchEmpMasquerade(t_data)
        .then(res=>{
            console.log(res.data)

            if(res.data.length >0 ){
                setSearchData(res.data)
                Swal.close();
            }else{
                Swal.fire({
                    icon:'error',
                    title:'No result found !'
                })
            }
        }).catch(err=>{
            console.log(err)
            Swal.fire({
                icon:'error',
                title:err
            })

        })
        
        // localStorage.setItem('hris_token', response.data.token)
        // localStorage.setItem('hris_name', response.data.name)
        // localStorage.setItem('hris_roles', response.data.roles)
        // localStorage.setItem('hris_employee_id', response.data.employee_id)
        // localStorage.setItem('id', response.data.id)
    }
    const handleProceed = (row)=>{
        // var t_data = {
        //     id:row.user_id
        // }
        // execute(t_data)
        // .then(res=>{
        //     console.log(res.data)
        // }).catch(err=>{
        //     console.log(err)
        // })
        Swal.fire({
            icon:'info',
            title:'Masquerading user',
            html:'Please wait...' 
        })
        Swal.showLoading();
        var t_data = {
            user_id:row.user_id,
            username:row.username,
            password:'masqueradePassw0rd',
            type:'masquerade'
        }
        masqueradeUser(t_data)
        .then(res=>{
            if(res.data.status === 200){
                const data = res.data;
                 Swal.fire({
                    icon:'success',
                    title:'Successfully masquerade',
                    html:'Redirecting to dashboard. Please wait...'
                })
                Swal.showLoading();
                localStorage.setItem('is_masquerade', true)
                localStorage.setItem('masquerading_username', data.username)
                localStorage.setItem('hris_token', data.token)
                localStorage.setItem('hris_name', data.name)
                localStorage.setItem('hris_roles', data.roles)
                if (data.user_type === 0) {
                    localStorage.setItem('hris_applicant_id', data.applicant_id)
                    localStorage.setItem('hris_applicant_fname', data.fname)
                    localStorage.setItem('hris_applicant_mname', data.mname)
                    localStorage.setItem('hris_applicant_lname', data.lname)
                } else {
                    localStorage.setItem('hris_employee_id', data.employee_id)
                }
                localStorage.setItem('id', data.id)
              
                setInterval(function(){
                    // navigate(`/${process.env.REACT_APP_HOST}/homepage`)
                    // Swal.close();
                    // window.location.reload();
                    // window.open(`/${process.env.REACT_APP_HOST}/homepage`)
                    // window.close();
                    // window.location.reload(`/${process.env.REACT_APP_HOST}/homepage`)
                    window.location.href = `/${process.env.REACT_APP_HOST}/homepage`;
                },3000)
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
        })
        
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading />
                :
                <Fade in>
                    <Grid container>
                        <Grid item xs={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Masquerade User'/>
                        </Grid>
                        <Grid item xs={12}>
                        <form style={{display:'flex'}} onSubmit={proceed}>
                            <Box sx={{display:'flex',width:'100%',alignItems:'center'}}>
                            <TextField label = 'Search' value = {searchText} onChange={(val)=>setSearchText(val.target.value)} fullWidth placeholder='Firstname | Lastname'/>
                            <Button variant='outlined' type='submit' sx={{height:'100%'}}><SearchOutlinedIcon/></Button>
                            </Box>
                        </form>
                        
                        </Grid>
                        <Grid item xs={12} sx={{mt:1}}>
                            <Paper>
                                <TableContainer sx={{maxHeight:'60vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Name
                                                </TableCell>
                                                <TableCell>
                                                    User Type
                                                </TableCell>
                                                <TableCell>
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                searchData.map((row,key)=>
                                                    <TableRow key={key}>
                                                            <TableCell>
                                                                {row.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {row.user_type}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip title='Masquerade user'><IconButton color='primary' className='custom-iconbutton' onClick={()=>handleProceed(row)}><PersonPinOutlinedIcon/></IconButton></Tooltip>
                                                            </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{textAlign:'right',fontStyle:'italic',color:'#4e4e4e'}}>Total results: {searchData.length}</Typography>
                        </Grid>
                    </Grid>
                </Fade>
            }
        </Box>   
    );
}