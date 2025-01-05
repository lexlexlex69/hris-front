import { Box, Button, CircularProgress, Grid, IconButton, Skeleton, Stack, TextField, Typography,InputAdornment, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteVenue, getAllTrainingVenueList } from "../TrainingRequest";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RoomIcon from '@mui/icons-material/Room';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { green, red } from "@mui/material/colors";
import SmallModal from "../../../custommodal/SmallModal";
import AddVenue from "./components/AddVenue";
import Swal from "sweetalert2";
import { APILoading } from "../../../apiresponse/APIResponse";
import UpdateVenue from "./components/UpdateVenue";

export const TrainingVenue = () =>{
    const [data,setData] = useState([])
    const [isLoadingData,setIsLoadingData] = useState(true)
    useEffect(()=>{
        _init();
    },[])
    const _init = async () => {
        const res = await getAllTrainingVenueList();
        setData(res.data)
        setIsLoadingData(false)
    }
    const [searchValue,setSearchValue] = useState('');
    const filterData  = data.filter(el=>el.venue_name.toUpperCase().includes(searchValue.toUpperCase()));
    const [open,setOpen] = useState(false)
    const handleDelete = async (row) => {
        try{
            APILoading('info','Deleting venue','Please wait...')
            let t_data = {
                id:row.training_venue_list_id
            }
            const res = await deleteVenue(t_data)
            if(res.data.status === 200){
                setData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }catch(error){
            Swal.fire({
                icon:'error',
                title:error
            })
        }
    }
    const [openUpdate,setOpenUpdate] = useState(false);
    const [updateData,setUpdateData] = useState([]);
    const handleUpdate = (row) => {
        setUpdateData(row)
        setOpenUpdate(true)
        console.log(row)
    }
    return (
        <Box>
            <Grid container spacing = {1}>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                    <TextField label = 'Search Venue' InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <SearchIcon />
                                    </InputAdornment>
                                ),
                                }} value = {searchValue} onChange={(val)=>setSearchValue(val.target.value)} fullWidth/>
                    <Tooltip title='Add new Venue'><IconButton className="custom-iconbutton" color="success" sx={{'&:hover':{background:green[800],color:'#fff'}}} onClick={()=>setOpen(true)}><AddIcon/></IconButton></Tooltip>
                    
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{maxHeight:'70vh',overflowY:'scroll'}}>
                    {
                        isLoadingData ?
                        (
                        <Box sx={{display:'flex',justifyContent:'center'}}>
                        <CircularProgress/>
                        </Box>
                        )
                        :
                        data && data.length> 0 ?
                        (
                            <List>
                                {filterData.map((item,key)=>{
                                    return(
                                        <ListItem disablePadding key={key} secondaryAction={
                                            <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                                            {/* <Button edge="end" variant="outlined" color='success' aria-label="update" startIcon={<EditIcon />} size="small" sx={{'&:hover':{background:green[800],color:'#fff'}}} onClick={()=>handleUpdate(item)}>
                                            
                                            Update
                                            </Button> */}
                                            <Button edge="end" variant="outlined" color='error' aria-label="delete" startIcon={<DeleteIcon />} size="small" sx={{'&:hover':{background:red[800],color:'#fff'}}} onClick={()=>handleDelete(item)}>
                                            
                                            Delete
                                            </Button>
                                            </Box>
                                        }>
                                            <ListItemButton>
                                                
                                            <ListItemIcon>
                                            <RoomIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary={item.venue_name} secondary={item.venue_location}/>
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })}
                                <SmallModal open = {open} close = {()=>setOpen(false)} title='Adding new Venue'>
                                <Box sx={{m:1}}>
                                    <AddVenue setData = {setData} close = {()=>setOpen(false)}/>
                                </Box>
                                </SmallModal>
                                <SmallModal open = {openUpdate} close = {()=>setOpenUpdate(false)} title='Updating venue'>
                                <Box sx={{m:1}}>
                                    <UpdateVenue data = {updateData} setData = {setData}/>
                                </Box>
                                </SmallModal>
                            </List>
                        )
                        :
                        <Typography sx={{textAlign:'center'}}>No data...</Typography>
                    }
                    
                </Grid>
            </Grid>
        </Box>
    )
}