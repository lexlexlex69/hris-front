import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { addBugs,getAllBugsData } from './BugsRequest';
export default function BugsForm (props){
    const [concernData,setConcernData] = React.useState([])
    useEffect(()=>{
        getAllBugsData()
        .then(response=>{
            const data = response.data
            setConcernData(data)
        })
    },[])
    const [concern,setConcern] = React.useState('')
    const submitBugs = () =>{
        Swal.fire({
            icon:'info',
            title:'Submitting your concern...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()

        addBugs(concern)
        .then(response=>{
            const data = response.data
            if(data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:data.message,
                    html:"Your issues and concern has been received. We'll get back to you as soon as possible.",
                })
            }else{
                Swal.fire({
                    icon:'success',
                    title:data.message
                })
            }
        }).catch(error=>{
            Swal.close()
            console.log(error)
        })
        
        props.close()
    }
    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Box sx={{height:'20vh',overflowY:'scroll'}}>

                <table className='table table-bordered'>
                    <thead >
                        <tr>
                            <th>Issues and Concerns</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {concernData.map((data,key)=>
                            <tr key = {key}>
                                <td>{data.user_concern}</td>
                                <td>{data.dev_feedback}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </Box>
            </Grid>

            <br/>
            <Grid item xs={12}>
                <TextField type ='text' label ='Specify Concern' value = {concern} fullWidth onChange={(value)=>setConcern(value.target.value)} multiline maxRows={4}/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Button variant='outlined' onClick={submitBugs} disabled={concern.trim().length === 0 ?true:false}>SUBMIT</Button>
            </Grid>

        </Grid>
    )
}