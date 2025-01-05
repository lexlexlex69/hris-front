import { Box, Button, Chip, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect,useState } from "react";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {blue,red,green,orange} from '@mui/material/colors'
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from "../../loader/DashboardLoading";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { toast } from "react-toastify";
import { deleteDTRConfig, getAllOffices, getDTRConfigList } from "./DTRMgtConfigRequests";
//Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import SmallModal from "../../custommodal/SmallModal";
import { Add } from "./components/Add";
import { APIError, APISuccess, formatMiddlename } from "../../customstring/CustomString";
import { Update } from "./components/Update";
import Swal from "sweetalert2";
import { APILoading } from "../../apiresponse/APIResponse";
export const DTRMgtConfig = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [officesData,setOfficesData] = useState([])
    const [data,setData] = useState([])
    useEffect(()=>{
        checkPermission(81)
        .then((response)=>{
            if(response.data){
                _init();
                const getOffices = async()=>{
                    const res = await getAllOffices();
                    setOfficesData(res.data.data)
                }
                getOffices();
                setIsLoading(false)
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
    },[])
    const _init = async () =>{
        const res = await getDTRConfigList()
        console.log(res.data)
        setData(res.data.data)
    }
    const [openAdd,setOpenAdd] = useState(false)
    const [openUpdate,setOpenUpdate] = useState(false)
    const [selectedUpdate,setSelectedUpdate] = useState({})
    const handleUpdate = (row) => {
        setSelectedUpdate(row)
        setOpenUpdate(true)
    }
    const handleDelete = async (item) =>{
        console.log(item)
        Swal.fire({
            icon:'question',
            title:'Confirm delete ?',
            text:'Action can not be reverted',
            showCancelButton:true,
            confirmButtonText:'Yes'
        }).then(async res=>{
            if(res.isConfirmed){
                try{
                    APILoading('info','Deleting data','Please wait...')
                    let t_data = {
                        id:item.dtr_mgt_config_id
                    }
                    const res = await deleteDTRConfig(t_data);
                    if(res.data.status === 200){
                        setData(res.data.data);
                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                }catch(err){
                    APIError(err)
                }
                
            }
        })
    }
    return (
        <React.Fragment>
        {
                isLoading
                ?
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                <DashboardLoading actionButtons={1}/>
                </Box>
                :
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title = 'DTR Management Config'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Button startIcon={<AddIcon/>} variant="contained" onClick = {()=>setOpenAdd(true)} className="custom-roundbutton" color="success">Add</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer sx={{maxHeight:'60vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Employee Name
                                                </TableCell>
                                                <TableCell>
                                                    Office/s
                                                </TableCell>
                                                <TableCell>
                                                    Access
                                                </TableCell>
                                                <TableCell>
                                                    
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.map((item)=>{
                                                    return(
                                                        <TableRow key = {item.dtr_mgt_config_id}>
                                                            <TableCell sx={{textTransform:'uppercase'}}>
                                                                {`${item.fname} ${formatMiddlename(item.mname)} ${item.lname}`}
                                                            </TableCell>
                                                            <TableCell>
                                                                <ul style={{maxHeight:'10vh',overflow:'auto'}}>
                                                                {
                                                                    JSON.parse(item.offices).map((office)=>{
                                                                        return(
                                                                            <li key={office.dept_code}>{office.dept_title}</li>
                                                                        )
                                                                    })
                                                                }
                                                                </ul>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={1}>
                                                                    {
                                                                        JSON.parse(item.actions).map((action)=>{
                                                                            return(
                                                                                <Chip label={action} key={action}/>
                                                                            )
                                                                        })
                                                                    }
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{display:'flex',gap:1,justifyContent:'center',flexWrap:'wrap'}}>
                                                                    <Button variant="contained" startIcon={<EditIcon/>} color='info' className="custom-roundbutton" onClick={()=>handleUpdate(item)}>Update</Button>
                                                                    <Button variant="contained" startIcon={<DeleteIcon/>} color='error' className="custom-roundbutton" onClick={()=>handleDelete(item)}>Delete</Button>
                                                                </Box>
                                                                
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                    
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                    {/* Add Modal */}
                    <SmallModal open = {openAdd} close = {()=>setOpenAdd(false)} title='Adding new data'>
                        <Add offices = {officesData} updateData={setData} close = {()=>setOpenAdd(false)}/>
                    </SmallModal>
                    <SmallModal open = {openUpdate} close = {()=>setOpenUpdate(false)} title = 'Updating info'>
                        <Update offices = {officesData} updateData={setData} selectedUpdate = {selectedUpdate} close={()=>setOpenUpdate(false)}/>
                    </SmallModal>
                    {/* End Add Modal */}
                </Box>
        }
        </React.Fragment>
    )
}