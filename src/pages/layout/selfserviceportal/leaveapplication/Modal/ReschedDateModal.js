import { Grid, Typography,Box,FormControl,InputLabel,Select,MenuItem, IconButton, Tooltip, Button,TextField } from "@mui/material";
import { blue } from "@mui/material/colors";
import moment from "moment";
import React,{useEffect, useState} from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Swal from "sweetalert2";
export default function ReschedDateModal(props){
    const [data,setData] = useState([])
    const [reason,setReason] = useState('')
    useEffect(()=>{
        setData(props.data)
    },[])
   
    const handleRemoveDate = (index) =>{
        var temp = [...data];
        temp.splice(index,1);
        console.log(temp)
        setData(temp)
    }
    const handleNewDate = (val,index) =>{
        /**
        Check if date is greater than to current leave date
         */
        
        var temp = [...data];
        if(moment(temp[index].date).format('YYYY-MM-DD') < moment(val.target.value).format('YYYY-MM-DD')){
            temp[index].new_date = val.target.value;
            setData(temp)
        }else{
            Swal.fire({
                icon:'warning',
                title:'Please a select date beyond '+moment(temp[index].date).format('MMMM DD, YYYY')
            })
        }
        
    }
    const handleSave = (e) =>{
        e.preventDefault();
        console.log(data)
        // props.close();
        props.handleSave(data,reason)
    }
    const handleSetReason = (val)=>{
        setReason(val.target.value)
    }
    return(
        <form onSubmit={handleSave}>
        <Grid container>
            <Grid item xs={12}>
                <TextField label='Reason' sx={{mb:1,mt:1}} value={reason} onChange={handleSetReason} fullWidth required/>
                {
                    data.length>0
                    ?
                    data.map((item,key)=>
                    <Box sx={{background:'#ebebeb',mb:1,p:1}}>
                        <Typography key={key} sx={{display:'flex',justifyContent:'space-between',alignItems:'center', mb:1}}>
                        <span style={{color:blue[800],fontWeight:'bold'}}>{moment(item.date).format('MMMM DD, YYYY')} {item.period === 'NONE' ? '':'('+item.period+')'}</span>
                        <Tooltip title='Remove date from selection'><IconButton color='error' onClick={()=>handleRemoveDate(key)}><RemoveIcon/></IconButton></Tooltip>
                    </Typography>
                    <TextField label='New Date' type='date' fullWidth InputLabelProps={{shrink:true}} value = {item.new_date} onChange = {(val)=>handleNewDate(val,key)} required  />
                    </Box>
                    )

                    :
                    null
                }
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant="contained" color="success" className="custom-roundbutton" size="small" type="submit">Submit request</Button>
                <Button variant="contained" color="error" className="custom-roundbutton" size="small" onClick={props.close}>Cancel</Button>
            </Grid>
        </Grid>
        </form>
    )
}