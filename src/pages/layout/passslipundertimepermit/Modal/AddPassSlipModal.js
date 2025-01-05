import { Grid, TextField, Typography,FormGroup ,FormControlLabel ,Radio,RadioGroup, Button } from '@mui/material';
import React from 'react';
import moment from 'moment';
import { addPassSlip } from '../PassSlipUndertimeRequest';
import Swal from 'sweetalert2';
export default function AddPassSlipModal(props){
    const [date,setDate] = React.useState(new Date())
    const [departureTime,setDepartureTime] = React.useState('')
    const [returnTime,setReturnTime] = React.useState('')
    const [purposeType,setPurposeType] = React.useState('PERSONAL')
    const [destination,setDestination] = React.useState('')
    const [purpose,setPurpose] = React.useState('')
    const submitData = (event)=>{
        event.preventDefault();
        var data2 = {
            date:moment(date).format('YYYY-MM-DD'),
            departure_time:departureTime,
            return_time:returnTime,
            purpose_type:purposeType,
            destination:destination,
            purpose:purpose
        }
        Swal.fire({
            icon:'info',
            title:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        addPassSlip(data2)
        .then(res=>{
            const result = res.data
            
            if(result.status === 200){
                props.onAddPassSlip()
                props.close()
                Swal.fire({
                    icon:'success',
                    title:result.message,
                    showConfirmButton:false,
                    timer:1500
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:result.message
                })
            }
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })

    }
    const handleTimeOfDeparture= (value)=>{
        if(returnTime.length ===0){
            setDepartureTime(value.target.value)
        }else if(value.target.value >= returnTime){
            Swal.fire({
                icon:'warning',
                title:'Value must less than return time'
            })
        }else{
            setDepartureTime(value.target.value)
        }
    }
    const handleTimeOfReturn = (value)=>{
        if(value.target.value <= departureTime){
            Swal.fire({
                icon:'warning',
                title:'Value must greater than departure time'
            })
        }else{
            setReturnTime(value.target.value)
        }
    }
    return(
        <form onSubmit={submitData}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>Date: <strong>{moment(date).format('MMMM DD, YYYY')}</strong></Typography>
                    {/* <TextField type='date' label='Date' fullWidth InputLabelProps={{shrink:true}} defaultValue={moment(new Date).format('YYYY-MM-DD')} disabled/> */}
                    <hr/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type='time' label='Time of Departure' fullWidth InputLabelProps={{shrink:true}} required value = {departureTime} onChange = {handleTimeOfDeparture} InputProps={{inputProps:{min:moment(new Date()).format('H:m')}}}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type='time' label='Expected Time of Return' fullWidth InputLabelProps={{shrink:true}} required value = {returnTime} onChange = {handleTimeOfReturn}/>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{textTransform:'uppercase'}}>Designation and Purpose of outside business</Typography>
                    <RadioGroup
                        aria-labelledby="purpose-type-radio-buttons-group-label"
                        defaultValue="personal"
                        name="purpose-type-radio-buttons-group-label"
                        sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}
                        required
                        value={purposeType}
                        onChange={(value)=>setPurposeType(value.target.value)}
                    >
                        <FormControlLabel value="PERSONAL" control={<Radio />} label="Personal" />
                        <FormControlLabel value="OFFICIAL" control={<Radio />} label="Official" />
                    </RadioGroup>

                </Grid>
                <Grid item xs={12}>
                    <TextField type='text' label='Destination' fullWidth required value = {destination} onChange = {(value)=>setDestination(value.target.value)}/>

                </Grid>
                <Grid item xs={12}>
                    <TextField type='text' label='Purpose' fullWidth required value = {purpose} onChange = {(value)=>setPurpose(value.target.value)}/>

                </Grid>
                <Grid item xs={12}>
                    <hr/>
                    <Button variant='contained' color='success' sx={{float:'right'}} type='submit'>submit </Button>

                </Grid>
            </Grid>
        </form>
    )
}