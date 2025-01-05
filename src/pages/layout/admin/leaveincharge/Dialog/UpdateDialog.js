import React,{useEffect, useState} from 'react';
import {Box,Grid,Autocomplete,TextField,Button,Tooltip,Modal, IconButton} from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomSearchEmployee from '../../../searchemployee/CustomSearchEmployee';

//Icons
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Swal from 'sweetalert2';
import { addHRApprovalAssigned } from '../LeaveInchargeRequest';
import { Delete } from '@mui/icons-material';

export default function UpdateDialog(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [empid,setEmpid] = useState('');
    const [empStatus,setEmpStatus] = useState([]);
    const [deptCode,setDeptCode] = useState([]);
    const [searchModal, setSearchModal] = useState(false);
    const [dtl,setdtl] = useState([])
    useEffect(()=>{
        console.log(JSON.parse(props.data.dtl))
        setdtl(JSON.parse(props.data.dtl))
        setEmpid(props.data.employee_id)
    },[props.data])
    const handleAddRow = () => {
        let temp = [...dtl];
        temp.push({
            emp_status:[],
            dept_code:null
        })
        setdtl(temp)
    
    }
    const searchModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        p: 2,
      };
    const handleSelect = (data)=> {
        console.log(data)
        setEmpid(data.id)
        setSearchModal(false)
        
    }
    const handleSave = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Saving data',
            html:'Please wait...'
        })
        Swal.showLoading();
        console.log(dtl);
        // var emp_status = '';
        // var dept_code = '';
        // empStatus.forEach(el=>{
        //     emp_status+=el.code+',';
        // })
        // deptCode.forEach(el=>{
        //     dept_code+=el.dept_code+',';
        // })
        // var t_data = {
        //     emp_id:empid,
        //     emp_status:emp_status,
        //     dept_code:dept_code
        // }
        let t_data = {
            emp_id:empid,
            dtl:dtl
        }
        addHRApprovalAssigned(t_data)
        .then(res=>{
            if(res.data.status=== 200){
                props.setHrApprovlAssignData(res.data.data)
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
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const handleSetEmpStatus = (item,key) => {
        let temp = [...dtl];
        temp[key].emp_status = item;
        setdtl(temp)
    }
    const handleSetDeptCode = (item,key) => {
        let temp = [...dtl];
        temp[key].dept_code = item;
        setdtl(temp)
    }
    const handleDelRow = (item,key) => {
        let temp = [...dtl];
        temp.splice(key,1);
        setdtl(temp)
    }
    return(
        <Box sx={{m:2}}>
            <form onSubmit={handleSave}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                    <TextField label ='Employee ID' fullWidth value = {empid} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} type='number' required read/>
                &nbsp;
                <Tooltip title = 'Search employee'><Button variant='outlined' onClick={()=>setSearchModal(true)}><SearchOutlinedIcon/></Button></Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <Button variant='contained' onClick={handleAddRow}>Add</Button>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',gap:1,flexDirection:'column'}}>
                    {
                        dtl.map((item,key)=>{
                            return (
                                <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-empstatus"
                                        value = {item.emp_status}
                                        options={props.empstatusData}
                                        isOptionEqualToValue={(option, value) => option.code === value.code}
                                        getOptionLabel={(option) => option.description}
                                        onChange={(event,newValue)=>{
                                            handleSetEmpStatus(newValue,key)
                                        }}
                                        size='small'
                                        renderInput={(params) => <TextField {...params} label="Assign Emp. Status" />}
                                        fullWidth
                                        multiple
                                        required
                                        disableCloseOnSelect
                                        sx={{
                                            // pt:1,
                                            // maxHeight:50,
                                            // overflow:'auto'
                                            
                                        }}

                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-empstatus"
                                        value = {item.dept_code}
                                        options={props.officesData}
                                        getOptionLabel={(option) => option.dept_title}
                                        onChange={(event,newValue)=>{
                                            handleSetDeptCode(newValue,key)
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Office/Department" />}
                                        fullWidth
                                        required
                                        size='small'

                                        // disableCloseOnSelect
                                    />
                                    <IconButton className='custom-iconbutton' color='error' size='small' onClick={()=>handleDelRow(item,key)}><Delete/></IconButton>
                                </Box>
                            )
                        })
                    }
                </Grid>
                {/* <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-empstatus"
                        value = {empStatus}
                        options={props.empstatusData}
                        getOptionLabel={(option) => option.description}
                        onChange={(event,newValue)=>{
                            setEmpStatus(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Assign Emp. Status" />}
                        multiple
                        fullWidth
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-empstatus"
                        value = {deptCode}
                        options={props.officesData}
                        getOptionLabel={(option) => option.dept_title}
                        onChange={(event,newValue)=>{
                            setDeptCode(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Office/Department" />}
                        multiple
                        fullWidth
                        required
                        disableCloseOnSelect
                    />
                </Grid> */}
                <Grid item xs={12} sx={{display:'flex',gap:1,justifyContent:'flex-end'}}>
                    <Button variant='contained' color='success' className='custom-roundbutton' type='submit'>Save</Button>
                    <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                </Grid>
            </Grid>
            </form>
            <Modal
                open={searchModal}
                onClose={()=> setSearchModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={searchModalStyle}>
                    <CustomSearchEmployee handleSelect = {handleSelect}/>
                </Box>
            </Modal>
        </Box>
    )
}