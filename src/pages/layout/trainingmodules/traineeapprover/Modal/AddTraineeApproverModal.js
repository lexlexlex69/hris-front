import React,{useEffect, useState} from 'react';
import {Grid,TextField,Button,Modal,Typography,Box,Autocomplete, Tooltip} from '@mui/material';
//icons
import SearchIcon from '@mui/icons-material/Search';
import SearchEmployee from './SearchEmployee';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { addTraineeApprover, getAllOfficeList } from '../TraineeApproverRequest';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
export default function AddTraineeApproverModal(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [openSearchModal,setOpenSearchModal] = useState(false);
    const [empID,setEmpID] = useState('');
    const [officeListData,setOfficeListData] = useState([])
    const [selectedOffice,setSelectedOffice] = useState(null);
    const [disableSave,setDisableSave] = useState(true)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:matches?350:450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
    };
    useEffect(()=>{
        getAllOfficeList()
        .then(res=>{
            // console.log(res.data)
            setOfficeListData(res.data)
        })
    },[])
    const handleSearchModal = () =>{
        setOpenSearchModal(true)
    }
    const handleSubmit = (event) =>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Adding new data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var data2 = {
            emp_id:empID,
            dept_code:selectedOffice.dept_code,
            short_name:selectedOffice.short_name,
        }
        addTraineeApprover(data2)
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
    const handleSelectSearch = (val) =>{
        setEmpID(val)
        handleCheckEmpID()
    }
    const handleSetEmpID = (value)=>{
        setEmpID(value.target.value)
        handleCheckEmpID()
    }
    const handleCheckEmpID = ()=>{
          var t_id = props.data.filter((el)=>{
            return el.emp_no === parseInt(empID)
        })
        if(t_id.length!==0){
            toast.warning('Employee number already assign to other office. Please select other employee.')
            setDisableSave(true)
        }else{
            setDisableSave(false)
        }
    }
    return(
        <React.Fragment>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{pt:1}}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                <TextField label= 'Employee ID' value={empID} type='number' onChange={handleSetEmpID} onBlur={handleCheckEmpID} fullWidth required InputProps={{readOnly:true}}/>
                <Tooltip title='Click to Search Employee'><Button variant='outlined' onClick = {handleSearchModal}><SearchIcon/></Button></Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-dept"
                    options={officeListData}
                    // sx={{minWidth:300}}
                    value = {selectedOffice}
                    getOptionLabel={(option) => option.dept_title}
                    onChange={(event,newValue) => {
                        setSelectedOffice(newValue);
                        }}
                    renderInput={(params) => <TextField {...params} label="Office/Department" required/>}
                    fullWidth
                    />
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Tooltip title='Save'><Button variant='contained' color='success' className='custom-roundbutton' type='submit' disabled={disableSave}>Save</Button></Tooltip> &nbsp;
                <Tooltip title='Cancel'><Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button></Tooltip>
            </Grid>
            
        </Grid>
        </form>
        <Modal
            open={openSearchModal}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/* <CancelOutlinedIcon/> */}
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenSearchModal(false)}/>

                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Searching Employee
                </Typography>
                <SearchEmployee setEmpID = {handleSelectSearch} close={()=> setOpenSearchModal(false)} data = {props.data}/>
            </Box>
        </Modal>
        </React.Fragment>

    )
}