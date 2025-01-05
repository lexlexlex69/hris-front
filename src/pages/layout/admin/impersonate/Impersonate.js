import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React,{useState} from 'react';
import './Impersonate.css';
import LoginIcon from '@mui/icons-material/Login';
import { impersonateLogin } from './ImpersonateRequest';
import Swal from 'sweetalert2';
import {
    useNavigate
} from "react-router-dom";
export default function Impersonate(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate()

    const handleSetUsername = (e) => {
        setUsername(e.target.value)
    }
    const handleSetPassword = (e) => {
        setPassword(e.target.value)
    }
    const handleLogin = (e) => {
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Checking information',
            html:'Please wait...' 
        })
        Swal.showLoading();
        var t_data = {
            username:username,
            password:password
        }
        impersonateLogin(t_data)
        .then(res=>{
            if(res.data.status === 200){
                const data = res.data;
                 Swal.fire({
                    icon:'success',
                    title:'Information verified',
                    html:'Redirecting to dashboard. Please wait...' 
                })
                Swal.showLoading();
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
        <form onSubmit={handleLogin} id='impersonate-div'>
            <Box sx={{m:2,display:'flex',justifyContent:'center'}}>
                <Box sx={{display:'flex',flexDirection:'column',gap:1,width:300}}>
                    <Typography sx={{textAlign:'center',background:blue[900],color:'#fff',p:2}}>Impersonate User</Typography>
                    <TextField label='Username' type='text' value={username} onChange={handleSetUsername} required/>
                    <TextField label='Password' type='password' value={password} onChange={handleSetPassword} required/>
                    <Button variant='contained' startIcon={<LoginIcon/>} type='submit'>LOGIN</Button>
                </Box>
            </Box>
        </form>
    )
}