import { Autocomplete, Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { memo, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from "react-toastify";
import { addMFO } from "../APCRRequest";

const AddModal = (props,ref) => {
    const [data,setData] = useState({
        code:'',
        description:'',
        sector:'',
        offices:[],
        timeFrame:'',
        year:''
    })
    // const [code,setCode] = useState('');
    // const [description,setDescription] = useState('');
    // const [sector,setSector] = useState('');
    // const [offices,setOffices] = useState([]);
    // const [timeFrame,setTimeFrame] = useState('');
    // const [year,setYear] = useState('');
    const handleSetData = (name,val)=>{
        setData({
            ...data,
            [name]:val
        })
    }
    const [loadingSave,setLoadingSave] = useState(false)
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoadingSave(true)
        /**
         * 
         Check if offices was selected
         */
        if(data.offices.length>0){
            const id = toast.loading('Saving data')

            try{
                var t_data = {
                    code:data.code,
                    description:data.description,
                    sector:data.sector,
                    offices:data.offices,
                    timeFrame:data.timeFrame,
                    year:data.year.$y
                }
                const res = await addMFO(t_data)

                if(res.data.status === 200){
                    setLoadingSave(false)
                    toast.update(id,{
                        render:res.data.message,
                        type:'success',
                        autoClose:true,
                        isLoading:false
                    })
                    props.setData(res.data.data)
                    props.close()
                }else{
                    setLoadingSave(false)
                    toast.update(id,{
                        render:res.data.message,
                        type:'error',
                        autoClose:true,
                        isLoading:false
                    })
                }
                
            }catch(err){
                setLoadingSave(false)
                // console.log(err)
                // console.log(err.message)
                toast.update(id,{
                    render:err.message,
                    type:'error',
                    autoClose:true,
                    isLoading:false
                })
            }
            

            
        }else{
            toast.warning('Please select offices')
            setLoadingSave(false)
        }
        
        // props.submit(data)
    }
    return (
        <Box sx={{m:1}}>
            <form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={12} sx={{pt:1,pb:1,display:'flex',flexDirection:'column',gap:2,maxHeight:'60vh',overflowY:'scroll'}}>
                    <TextField label='MFO /  MFO CODE' value = {data.code} onChange={(val)=>handleSetData('code',val.target.value)} fullWidth required/>                       
                    <TextField label='MFO DESCRIPTION (Activity name, Description)' value = {data.description} onChange={(val)=>handleSetData('description',val.target.value)} fullWidth required/>                       
                    <TextField label='SECTOR' value = {data.sector} onChange={(val)=>handleSetData('sector',val.target.value)} fullWidth required/>                       
                    <Autocomplete
                        fullWidth
                        disablePortal
                        id="offices"
                        options={props.officesData}
                        getOptionLabel={(option) => option.dept_title}
                        value = {data.offices}
                        onChange={(event,newValue) => {
                            // setOffices(newValue);
                            handleSetData('offices',newValue)
                            }}
                        renderInput={(params) => <TextField {...params} label="Offices"/>}
                        multiple
                        required
                        // disabled={loadingAdjst}
                    />   
                    <TextField label='TIME FRAME' value = {data.timeframe} onChange={(val)=>handleSetData('timeframe',val.target.value)} fullWidth required/>                
                    {/* <TextField label='YEAR' type = 'year' value = {data.year} onChange={(val)=>handleSetData('year',val.target.value)} fullWidth/> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        views={['year']}
                        label="Year"
                        minDate={new Date()}
                        // maxDate={new Date('2023-06-01')}
                        value={data.year}
                        onChange={(val)=>handleSetData('year',val)}
                        renderInput={(params) => <TextField {...params} required/>}
                    />
                    </LocalizationProvider>
                    
                </Grid>
                <Grid item xs={12} sx={{mt:1,display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant="contained" className="custom-roundbutton" color='success' type="submit" disabled={loadingSave}>Submit</Button>   
                    <Button variant="contained" className="custom-roundbutton" color='error' onClick={props.close}>Cancel</Button>   
                </Grid>
            </Grid>
            </form>
        </Box>
    )
}
export default memo(AddModal)