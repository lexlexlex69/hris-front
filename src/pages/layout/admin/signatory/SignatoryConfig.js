import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
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
import { getAssignedSignatory, updateHighRankSignatory } from "./SignatoryRequests";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { APIError, APISuccess } from "../../customstring/CustomString";
import { APILoading } from "../../apiresponse/APIResponse";
export const SignatoryConfig = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [highRank,setHighRank] = useState([])
    const [editData,setEditData] = useState();
    useEffect(()=>{
        checkPermission(85)
        .then((response)=>{
            if(response.data){
                _init();
                setIsLoading(false)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
    },[])
    const _init = async () => {
        try{
            const res = await getAssignedSignatory()
            console.log(res.data)
            res.data.data.forEach(el => {
                el.editable = false
            });
            setHighRank(res.data.data)
        }catch(err){
            console.log(err)
        }
        
    }
    const handleEditHighRank = (item) => {
        let temp = [...highRank];
        let index = temp.findIndex(el=>el.assigned_signatory === item.assigned_signatory)
        temp[index].editable = !temp[index].editable;
        console.log(index)
        setHighRank(temp)
        setEditData(item)
    }
    const handleUpdateHighRank = async (item) => {
        console.log(item)
    }
    const handleEditData = (val,name) => {
        let temp = {...editData};
        temp[name] = val.target.value
        setEditData(temp)
    }
    const handleCancelEdit = (item)=>{
        setEditData({})
        let temp = [...highRank];
        let index = temp.findIndex(el=>el.assigned_signatory === item.assigned_signatory)
        temp[index].editable = !temp[index].editable;
        setHighRank(temp)

    }
    const handleSaveHighRank = async (item)=>{
        try{
            APILoading('info','Updating data','Please wait...')
            const res = await updateHighRankSignatory({data:editData});
            if(res.data.status === 200){
                APISuccess(res.data.message)

                let temp = [...res.data.data];
                let index = temp.findIndex(el=>el.assigned_signatory === item.assigned_signatory)
                temp[index].editable = false;
                setHighRank(temp)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)        
        }
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
                <Box sx={{margin:'0 20px 0 20px'}}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Name
                                                </TableCell>
                                                <TableCell>
                                                    Position
                                                </TableCell>
                                                <TableCell>
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                highRank.map((item)=>{
                                                    return (
                                                        <TableRow key ={item.assigned_signatory}>
                                                            <TableCell>
                                                                {
                                                                    item.editable
                                                                    ?
                                                                    <TextField value={editData.auth_name} onChange={(val)=>handleEditData(val,'auth_name')} size="small" fullWidth/>
                                                                    :
                                                                    item.auth_name
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.position}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {
                                                                    item.editable
                                                                    ?
                                                                    <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                                    <Tooltip title='Save'>
                                                                    <IconButton color="success" className = 'custom-iconbutton' onClick={()=>handleSaveHighRank(item)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title='Cancel'>
                                                                    <IconButton color="error" className = 'custom-iconbutton' onClick={()=>handleCancelEdit(item)}>
                                                                        <CloseIcon/>
                                                                    </IconButton>
                                                                    </Tooltip>

                                                                    </Box>
                                                                    :
                                                                    <Tooltip title='Edit'>
                                                                    <IconButton color="primary" className = 'custom-iconbutton' onClick={()=>handleEditHighRank(item)}>
                                                                        <EditIcon/>
                                                                    </IconButton>
                                                                    </Tooltip>

                                                                }
                                                                
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
                </Box>
        }
        </React.Fragment>
    )
}