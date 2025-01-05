import React, { useEffect, useState } from 'react';

import { StyledTableCell, APISuccess, APIError, formatName } from '../../../../customstring/CustomString';
import { deleteEncoder, getEncoderApprover } from '../../WorkSchedConfigRequests';
import { APILoading } from '../../../../apiresponse/APIResponse';
import Swal from 'sweetalert2';
import { UpdateWorkSchedUser } from '../modal/UpdateWorkSchedUser';
import SmallModal from '../../../../custommodal/SmallModal';
import { Grid,Table,TableContainer,TableHead,TableRow,TableBody,Paper,Button, TextField} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const Encoder = ({encoder,setEncoder})=>{
    const [selectedType,setSelectedType] = useState('')
    const [selectedUpdate,setSelectedUpdate] = useState([])
    const [openUpdate,setOpenUpdate] = useState(false)
    const [anchorEl, setAnchorEl] = useState([]);
    const [searchVal,setSearchVal] = useState('');
    const handleDeleteEncoder = (item,e)=>{
        Swal.fire({
            icon:'question',
            title:'Confirm delete encoder?',
            text:'Action can not be reverted',
            showCancelButton:true,
            confirmButtonText:'Yes'
        }).then(async res=>{
            if(res.isConfirmed){
                try{
                    APILoading('info','Deleting Encoder','Please wait...')
                    const res = await deleteEncoder({id:item.emp_sched_encoder_id})
                    if(res.data.status === 200){
                        setEncoder(res.data.data)
                        APISuccess(res.data.message);
                    }else{
                        APIError(res.data.message)
                    }
                }catch(err){
                    APIError(err)
                }
                handleClose(item.id,e)

            }
        })
    }
    const handleUpdateData = (item,type,e)=>{
        setSelectedType(type)
        setSelectedUpdate(item)
        setOpenUpdate(true)
        handleClose(item.id,e)
    }
    const handleClick = (id,event) => {
        let temp = [...anchorEl];
        temp[id] = event.currentTarget
        setAnchorEl(temp);
    };
    const handleClose = (id,event) => {
        let temp = [...anchorEl];
        temp[id] = null
        setAnchorEl(temp);
        // setAnchorEl([]);
    };
    const filterData = encoder.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase()) || el.dept_title.toUpperCase().includes(searchVal.toUpperCase()))
    return (
        <Grid item xs={12}>
            {/* <Typography sx={{fontWeight:'bold',borderLeft:'solid 3px',color:blue[900],pl:1,mb:1}}>Encoder</Typography> */}
            <TextField label = 'Search' value = {searchVal} onChange={(val)=>setSearchVal(val.target.value)} fullWidth sx={{mb:1}}/>
            <Paper>
                <TableContainer sx={{maxHeight:'50dvh'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Department</StyledTableCell>
                                <StyledTableCell>Division</StyledTableCell>
                                <StyledTableCell align="center">
                                {/* Action */}
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filterData.length>0
                                ?
                                    filterData.map((item)=>{
                                        return (
                                            <TableRow key = {item.id}>
                                                <StyledTableCell sx={{textTransform:'uppercase'}}>{formatName(item.fname,item.mname,item.lname,item.extname,1)}</StyledTableCell>
                                                <StyledTableCell>{item.dept_title}</StyledTableCell>
                                                <StyledTableCell>{item.div_name}</StyledTableCell>
                                                <StyledTableCell sx={{display:'flex',justifyContent:'center',gap:1}}>
                                                {/* <Tooltip title = 'Update Encoder'><Button startIcon={<EditIcon/>} color="info" variant="contained" onClick={()=>handleUpdateData(item,'ENCODER')} className="custom-roundbutton">Update</Button></Tooltip>
                                                <Tooltip title = 'Delete Encoder'><Button startIcon={<DeleteIcon/>} color="error" variant="contained" onClick={()=>handleDeleteEncoder(item)} className="custom-roundbutton">Delete</Button></Tooltip> */}
                                                <Button
                                                    id={item.id}
                                                    aria-controls={Boolean(item.id)}
                                                    aria-haspopup="true"
                                                    aria-expanded={Boolean(item.id)}
                                                    onClick={(e)=>handleClick(item.id,e)}
                                                    variant="contained"
                                                    color="secondary"
                                                    endIcon={<ArrowDropDownIcon/>}
                                                    // size="small"
                                                    className="custom-roundbutton"

                                                >
                                                    Actions
                                                </Button>
                                                <Menu
                                                    id={item.id}
                                                    anchorEl={anchorEl[item.id]}
                                                    open={Boolean(anchorEl[item.id])}
                                                    onClose={(e)=>handleClose(item.id,e)}
                                                    MenuListProps={{
                                                    'aria-labelledby': `basic-button-${item.id}`,
                                                    }}
                                                >
                                                    
                                                    <MenuItem onClick={(e)=>handleUpdateData(item,'ENCODER',e)} size='small'>
                                                        <ListItemIcon color="success">
                                                            <EditIcon color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText>Update</ListItemText>
                                                    </MenuItem>
                                                    <MenuItem onClick={(e)=>handleDeleteEncoder(item,e)} size='small' disabled={item.is_lock?true:false}>
                                                        <ListItemIcon>
                                                            <DeleteIcon color="error" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText>Delete</ListItemText>
                                                    </MenuItem>
                                                </Menu>
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    })
                                :
                                <TableRow>
                                    <StyledTableCell align="center" colSpan={3}>No Data</StyledTableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        <SmallModal open = {openUpdate} close = {()=>setOpenUpdate(false)} title='Updating data'>
            <UpdateWorkSchedUser close = {()=>setOpenUpdate(false)} updateEncoder = {setEncoder} type = {selectedType} selectedUpdate = {selectedUpdate}/>
        </SmallModal>
        </Grid>
    )
}