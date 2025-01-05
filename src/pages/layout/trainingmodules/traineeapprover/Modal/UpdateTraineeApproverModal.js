import React,{useEffect, useState} from 'react';
import {Grid,TextField,Button,Modal,Typography,Box,Autocomplete, Tooltip} from '@mui/material';
//icons
import SearchIcon from '@mui/icons-material/Search';
import SearchEmployee from './SearchEmployee';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { addTraineeApprover, getAllOfficeList, updateTraineeApprover } from '../TraineeApproverRequest';
import Swal from 'sweetalert2';
import DataTableLoader from '../../../loader/DataTableLoader';
export default function UpdateTraineeApproverModal(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [empID,setEmpID] = useState('');
    const [officeListData,setOfficeListData] = useState([])
    const [selectedOffice,setSelectedOffice] = useState(null)
    const [loadingData,setLoadingData] = useState(true)
    useEffect(()=>{
        setEmpID(props.data.emp_no)
        getAllOfficeList()
        .then(res=>{
            // console.log(res.data)
            res.data.forEach(el => {
                if(el.dept_code === props.data.dept_code){
                    setSelectedOffice(el)
                }
            });
            setOfficeListData(res.data)
            setLoadingData(false)

        })
    },[])
    const handleSubmitUpdate = (event) =>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var data2 = {
            data:props.data,
            dept_code:selectedOffice.dept_code,
            short_name:selectedOffice.short_name,
        }
        updateTraineeApprover(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                props.close()
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
            Swal.close()
            console.log(err)
        })
    }
    return(
        <React.Fragment>
        {
            loadingData
            ?
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <DataTableLoader/>
                <Typography>Loading data. Please wait...</Typography>
            </Box>
            :
            <form onSubmit={handleSubmitUpdate}>
                <Grid container spacing={2} sx={{pt:1}}>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                        <TextField label= 'Employee ID' value={empID} type='number' onChange={(value)=>setEmpID(value.target.value)} fullWidth required inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-dept"
                            options={officeListData}
                            sx={{minWidth:300}}
                            value = {selectedOffice}
                            getOptionLabel={(option) => option.dept_title}
                            onChange={(event,newValue) => {
                                setSelectedOffice(newValue);
                                }}
                            renderInput={(params) => <TextField {...params} label="Office/Department" required/>}
                            
                            />
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Tooltip title='Save'><Button variant='contained' color='success' className='custom-roundbutton' type='submit'>Save</Button></Tooltip> &nbsp;
                        <Tooltip title='Cancel'><Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button></Tooltip>
                    </Grid>
                    
                </Grid>
            </form>
        }
        </React.Fragment>

    )
}