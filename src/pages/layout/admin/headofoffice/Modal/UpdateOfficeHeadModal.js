import { Button, Grid, TextField,Box,Modal,Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import SearchEmployee from '../SearchEmployee';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { autoCapitalizeFirstLetter } from '../../../customstring/CustomString';
import { updateHeadOfOffice } from '../HeadOfOfficeConfigRequest';
import Swal from 'sweetalert2';
import SmallModal from '../../../custommodal/SmallModal';
import Alert from '@mui/material/Alert';
export default function UpdateOfficeHeadModal(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const searchModalStyle = {
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
    const [name,setName] = React.useState('');
    const [position,setPosition] = React.useState('');
    const [office,setOffice] = React.useState('');
    const [searchModal,setSearchModal] = React.useState(false);
    const [empid,setEmpid] = useState(0);
    const [id,setID] = useState(0);
    useEffect(()=>{
        setID(props.info.head_office_designation_id)
        setName(props.info.office_division_assign)
        setPosition(props.info.position)
        setEmpid(props.info.employee_id)
    },[])
    const handleSave = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'question',
            title:'Confirm update ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Proceed to updating',
                    html:'Please wait...'
                })
                Swal.showLoading()
                var t_data = {
                    id:id,
                    emp_id:empid,
                    name:name,
                    position:position
                }
                updateHeadOfOffice(t_data)
                .then(res=>{
                    if(res.data.status === 200){
                        props.close();
                        props.setOfficeHeadData(res.data.data)
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
                })
                .catch(err=>{
                    console.log(err)
                    Swal.fire({
                        icon:'error',
                        title:err
                    })
                })
            }
        })
        
    }
    const handleSearchData = (data)=>{
        setEmpid(data.id);
        setName(autoCapitalizeFirstLetter(data.fname+' '+(data.mname?data.mname.charAt(0)+'. ':' '+' ')+data.lname));
        setPosition(data.position_name)

    }
    return(
        <React.Fragment>
            <form onSubmit = {handleSave}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info"><small>Please search the employee first when replacing a new office head, to be able to get the employee's ID</small></Alert>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',flexDirection:'row'}}>
                        <TextField label = 'Employee ID' fullWidth value = {empid} InputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                        <Button variant='outlined' onClick={()=> setSearchModal(true)}><SearchIcon/></Button>
                    </Box>

                </Grid>
                <Grid item xs={12}>
                    <TextField label='Office Head Name' value = {name} onChange={(val)=>setName(val.target.value)} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Position Name' value = {position} onChange={(val)=>setPosition(val.target.value)} InputLabelProps={{shrink:true}} fullWidth/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Button variant='contained' className='custom-roundbutton' color='success' type='submit'>Save</Button>
                </Grid>
            </Grid>
            </form>
            <SmallModal open = {searchModal} close = {()=> setSearchModal(false)} title='Searching Employee'>
                <Box sx={{m:1}}>
                    <SearchEmployee close = {()=> setSearchModal(false)} handleSearchData = {handleSearchData}/>
                </Box>
            </SmallModal>
            {/* <Modal
                open={searchModal}
                onClose={()=> setSearchModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={searchModalStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setSearchModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Searching Employee
                    </Typography>
                    <SearchEmployee close = {()=> setSearchModal(false)} handleSearchData = {handleSearchData}/>

                </Box>
            </Modal> */}
        </React.Fragment>

    )
}