import { Box,Grid,CircularProgress,TextField,InputAdornment, IconButton, Tooltip, Button  } from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteTrainingName, getAllTrainingName } from "../TrainingRequest";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SmallModal from "../../../custommodal/SmallModal";
import AddTraining from "./AddTraining";
import DeleteIcon from '@mui/icons-material/Delete';
import { green, red } from "@mui/material/colors";
import { toast } from "react-toastify";

export default function ExistingTrainingName(props){
    const [existingTrainingData,setExistingTrainingData] = useState([]);
    const [loading,setLoading] = useState(true)
    useEffect( async()=>{
        const res  = await getAllTrainingName()
        setExistingTrainingData(res.data)
        setLoading(false)

    },[])
    const [searchVal,setSearchVal] = useState('')
    const filterData = existingTrainingData.filter(el=>el.training_name.toUpperCase().includes(searchVal.toUpperCase()))
    const [openAddTraining,setOpenAddTraining] = useState(false);
    const handleCloseAddTraining = () =>{
        setOpenAddTraining(false)
    }
    const handleDeleteTraining = async(row) =>{
        const id = toast.loading('Deleting Training from list');
        try{
            let t_data = {
                id:row.training_id
            }
            const res = await deleteTrainingName(t_data);
            if(res.data.status === 200){
                setExistingTrainingData(res.data.data)
                toast.update(id,{
                    render:res.data.message,
                    type:'success',
                    autoClose:true,
                    isLoading:false
                })
            }else{
                toast.update(id,{
                    render:res.data.message,
                    type:'error',
                    autoClose:true,
                    isLoading:false
                })
            }
        }catch(err){
            toast.update(id,{
                render:err,
                type:'error',
                autoClose:true,
                isLoading:false
            })
        }
    }
    return(
        <Box sx={{m:1}}>
            <Grid container>
                <Grid item xs={12}>
                    {
                        loading
                        ?
                        <Box sx={{display:'flex',justifyContent:'center'}}>
                        <CircularProgress/>
                        </Box>
                        :
                            existingTrainingData.length>0
                            ?
                            <Box>
                                <Box sx={{display:'flex',gap:1,alignItems:'center',mb:1}}>
                                <TextField label = 'Seach training' InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <SearchIcon />
                                    </InputAdornment>
                                ),
                                }} value = {searchVal} onChange={(val)=>setSearchVal(val.target.value)} placeholder="Training Name" fullWidth />

                                <Tooltip title='Add new training'><IconButton className="custom-iconbutton" color='success' onClick={()=>setOpenAddTraining(true)} sx={{'&:hover':{background:green[800],color:'#fff'}}}><AddIcon/></IconButton></Tooltip>


                                <SmallModal open={openAddTraining} close ={handleCloseAddTraining} title='Adding New Training'>
                                    <AddTraining metaTagsData = {props.metaTagsData} close = {handleCloseAddTraining} setExistingTrainingData={setExistingTrainingData}/>
                                </SmallModal>
                                </Box>
                                
                                <List sx={{maxHeight:'60vh',overflowY:'scroll',mt:1}}>
                                {
                                    
                                    filterData.map((item,key)=>
                                        <ListItem disablePadding key={key} secondaryAction={
                                            <Tooltip title='Delete Training'><Button edge="end" variant="outlined" color='error' startIcon={<DeleteIcon/>} sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDeleteTraining(item)} size="small" >Delete</Button></Tooltip>
                                        }>
                                            <ListItemButton>
                                            <ListItemText primary={item.training_name} secondary={item.training_desc}/>
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                }
                                </List>
                            </Box>
                            :
                            <ListItem disablePadding>
                                <ListItemButton>
                                <ListItemText primary='No available training' />
                                </ListItemButton>
                            </ListItem>
                    }
                    
                </Grid>
            </Grid>
        </Box>
    )
}