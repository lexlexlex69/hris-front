import React,{useEffect, useState} from 'react';
import {Typography,Box,Button, Tooltip, IconButton,Modal, Grid, TextField} from '@mui/material'
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PrintIcon from '@mui/icons-material/Print';
// media query
import { useTheme } from '@mui/material/styles';
import {green,blue,red} from '@mui/material/colors'
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
import UpdateIcon from '@mui/icons-material/Update';
import LargeModal from '../../custommodal/LargeModal';
import { PrintSchedule } from '../Print/PrintSchedule';
import { APILoading } from '../../apiresponse/APIResponse';
import { APIError, APISuccess } from '../../customstring/CustomString';
import { deletePendingSchedule } from '../WorkScheduleRequest';
export default function HasSchedule(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [selectedHasScheduleEmployees,setSelectedHasScheduleEmployees] = useState([])
    const [isRequestUpdate,setIsRequestUpdate] = useState(false);
    const [hasLocked,setHasLocked] = useState(false);
    useEffect(()=>{
        setData(props.data)
        console.log(props.data)
        var t_has_locked = false;
        props.data.forEach(el => {
            if(el.is_locked){
                t_has_locked = true;
            }
        });
        console.log(t_has_locked);
        setHasLocked(t_has_locked)
    },[props.data])
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
    };
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname === null ?'':row.emp_mname.charAt(0)+'.')
        },
        {
            name:'Template Name',
            selector:row=><span style={{color:'#0077dd',fontWeight:'bold'}}><em>{row.template_name}</em></span>
        }
    ]
    const tableData = {
        data,
        columns
    }
    const hasScheduleHandleChange = ({ selectedRows }) => {
        setSelectedHasScheduleEmployees(selectedRows)
    };
    const rowDisabledCriteria  = (row)=>{
        if(row.is_locked){
            if(isRequestUpdate){
                return false;
            }else{
                return true;
            }
        }else{
            if(!isRequestUpdate){
                return false;
            }else{
                return true;
            }
        }
        // return row.is_locked && !isRequestUpdate;
    }
    const handleRequestUpdate = () =>{
        setIsRequestUpdate(!isRequestUpdate)
    }
    const handleDelete = async () =>{
        handleOpen()
        

    }
    const handleDefaultDelete = async () => {
        APILoading('info','Deleting data','Please wait...')

        try{
            let t_data = {
                data:selectedHasScheduleEmployees,
                year:props.filterYear
            }

            const res = await deletePendingSchedule(t_data);
            if(res.data.status  === 200){
                props.setToggledClearHasScheduleRows(!props.toggledClearHasScheduleRows)
                props.setHasScheduledata(res.data.has_schedule)
                props.setData(res.data.no_schedule)
                APISuccess(res.data.message)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    const [open, setOpen] = React.useState(false);
    const [deleteReason, setDeleteReason] = React.useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmitDelete = (e)=>{
        e.preventDefault()
        props.deleteAction(selectedHasScheduleEmployees,deleteReason)
        handleClose()
    }
    const [openPrint,setOpenPrint] = useState(false)
    const handlePrint = () => {
        console.log(selectedHasScheduleEmployees)
        setOpenPrint(true)
    }
    return(
        <Box>
        <DataTableExtensions
            {...tableData}
            export={false}
            print={false}
        >
            <DataTable
            title = {
                props.filterYear
                ?
                // (
                //     matches
                //     ?
                //     <Typography sx={{background: '#198754',
                //     // textAlign: 'center',
                //     color: '#fff',
                //     padding: '10px'}}> With Schedule</Typography>
                //     :
                //     <Box sx={{display:'flex',justifyContent:'space-between',background:green[800],alignItems:'center',p:1}}>
                //     <Typography sx={{color: '#fff'}}> With Schedule</Typography>
                //     <Box>
                //     {
                //         isRequestUpdate
                //         ?
                //         <Tooltip title='Cancel'><CloseOutlinedIcon sx={{color:red[800],background:'#fff',borderRadius:'50%','&:hover':{cursor:'pointer'}}} onClick={handleRequestUpdate}/></Tooltip>
                //         :
                //         <Tooltip title='Schedule locked ? Click her to request delete/update'><IconButton sx={{background:'#fff',color:green[800],'&:hover':{background:'#fff'}}} size='small' onClick={handleRequestUpdate}><UpdateIcon/></IconButton></Tooltip>
                //     }
                    
                //     </Box>
                //     </Box>
                    
                //     )
                 <Box sx={{display:'flex',justifyContent:'space-between',background:green[800],alignItems:'center',p:1}}>
                    <Typography sx={{color: '#fff'}}> With Schedule</Typography>
                    <Box>
                    {
                        isRequestUpdate
                        ?
                        <Tooltip title='Cancel'><CloseOutlinedIcon sx={{color:red[800],background:'#fff',borderRadius:'50%','&:hover':{cursor:'pointer'}}} onClick={handleRequestUpdate}/></Tooltip>
                        :
                        hasLocked
                        ?
                        <Tooltip title='Schedule locked ? Click her to request delete/update'><IconButton sx={{background:'#fff',color:green[800],'&:hover':{background:'#fff'}}} size='small' onClick={handleRequestUpdate}><UpdateIcon/></IconButton></Tooltip>
                        :
                        null
                    }
                    
                    </Box>
                </Box>
                :
                ''
                
            }
            data = {data}
            columns = {columns}
            onSelectedRowsChange = {hasScheduleHandleChange}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
                rowsPerPageText: 'Records per page:',
                rangeSeparatorText: 'out of',
            }}
            pagination
            highlightOnHover
            selectableRows
            contextActions={
                (
                    <Box sx={{display:'flex',justifyContent:'space-between',gap:1}}>
                       {
                        isRequestUpdate
                            ?
                            <Tooltip title ='Delete employee work sched'><IconButton className='custom-iconbutton' color='error' size='small' onClick={handleDelete}>
                            <DeleteOutlineOutlinedIcon/></IconButton></Tooltip>
                            :
                            <Tooltip title ='Delete employee work sched'><IconButton className='custom-iconbutton' color='error' size='small' onClick={handleDefaultDelete}>
                            <DeleteOutlineOutlinedIcon/></IconButton></Tooltip>
                        }
                        
                        <Tooltip title = 'Update selected employee work sched'><IconButton sx={{'&:hover':{color:'white',background:green[800]}}} className='custom-iconbutton' color='success'  size='small' disabled={selectedHasScheduleEmployees.length > 1 ?true:false} onClick={()=>props.updateAction(selectedHasScheduleEmployees,isRequestUpdate)}>
                        <EditOutlinedIcon/></IconButton></Tooltip>
                        <Tooltip title='Print Schedule' className='custom-iconbutton' color='info'  size='small' onClick={handlePrint}><IconButton><PrintIcon/></IconButton></Tooltip>
                        
                    </Box>
                    )
            }
            // subHeaderComponent={
            //     (<div>
            //         <Button>Test</Button>
            //     </div>)
            // }
            clearSelectedRows={props.toggledClearHasScheduleRows}
            selectableRowDisabled={rowDisabledCriteria}
        />
        </DataTableExtensions>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <form onSubmit = {handleSubmitDelete}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Please specify reason for deletion
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField type='text' label='Reason' value={deleteReason} onChange = {(val)=>setDeleteReason(val.target.value)} fullWidth/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                    <Button type = 'submit' className='custom-roundbutton' variant='contained' color='success' size='small'>Submit</Button>
                    &nbsp;
                    <Button onClick={handleClose} className='custom-roundbutton' variant='contained' color='error' size='small'>Cancel</Button>
                </Grid>
            </Grid>
            </form>
            
            </Box>
        </Modal>
        <LargeModal open = {openPrint} close = {()=>setOpenPrint(false)} title='Printing Work Schedule'>
            <PrintSchedule list = {selectedHasScheduleEmployees} close = {()=>setOpenPrint(false)}/>
        </LargeModal>
        </Box>
        
    )
}