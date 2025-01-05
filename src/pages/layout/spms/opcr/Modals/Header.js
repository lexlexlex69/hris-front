import { Box, Button, Grid, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect,useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { getMandate, updateHeader } from "../OPCRRequest";
import { toast } from "react-toastify";
import { green } from "@mui/material/colors";
import MediumModal from "../../../custommodal/MediumModal";
export const Header = (props) =>{
    const [isLoading,setIsLoading] = useState(true)
    useEffect(()=>{
        setHeader(props.headerData)
    },[])
    // useEffect(()=>{
    //     async function _init(){
    //         const res = await toast.promise(getMandate(),
    //             {
    //                 pending: 'Loading Header',
    //                 success: 'Header Loaded',
    //                 error: 'Failed to load Header'
    //             }
    //         )

    //     }
    //     _init();
    // },[])
    const [header,setHeader] = useState({
        mandate:'',
        vision:'',
        mission:'',
        org_outcome:''
    })
    const [type,setType] = useState('')
    const [openUpdate,setOpenUpdate] = useState(false)
    const [isLoadingSubmit,setIsLoadingSubmit] = useState(false)

    const handleSetData = (name,val)=>{
        setHeader({
            ...header,
            [name]:val
        })
    }
    const handleOpenUpdate = (type)=>{
        setType(type)
        setOpenUpdate(true)
    }
    const getType = () =>{
        switch(type){
            case 'Mandate':
                return(
                    <TextField label='Mandate' value = {header.mandate} onChange={(val)=>handleSetData('mandate',val.target.value)} type='text' multiline maxRows={5} required fullWidth/>
                )
            break;
            case 'Vision':
                return(
                <TextField label='Vision' value = {header.vision} onChange={(val)=>handleSetData('vision',val.target.value)} type='text' multiline maxRows={5} required fullWidth/>
                )
            break;
            case 'Mission':
                return(
                <TextField label='Vision' value = {header.mission} onChange={(val)=>handleSetData('mission',val.target.value)} type='text' multiline maxRows={5} required fullWidth/>
                )
            case 'Org. Outcome':
                return(
                <TextField label='Vision' value = {header.org_outcome} onChange={(val)=>handleSetData('org_outcome',val.target.value)} type='text' multiline maxRows={5} required fullWidth/>
                )
            break;

        }
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoadingSubmit(true)
        let t_data = {
            type:type,
            data:header
        }
        try{
            const res = await toast.promise(updateHeader(t_data),{
                pending: `Updating ${type}`,
                success: 'Successfully updated',
                error: 'Failed to update'
            })
            props.setHeaderData(res.data.data);
            setOpenUpdate(false)
            setIsLoadingSubmit(false)
        }catch(err){
            toast.error(err)
            setIsLoadingSubmit(false)
        }
    }
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
    }
    return(
        <Box sx={{maxHeight:'80vh',overflowY:'scroll'}} id='spms-opcr'>
            <Grid container spacing={1}>
                <Grid item xs={12} sx={{textAlign:'center',p:1}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:1}}>
                        <Typography sx={{fontWeight:'bold'}}>Mandate</Typography>
                        <Tooltip title='Update Mandate'><IconButton className="custom-iconbutton" size="small" color="success" sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleOpenUpdate('Mandate')}><EditIcon fontSize='small'/></IconButton></Tooltip>
                    </Box>
                    <Paper sx={{p:1}}>
                    <p className="text">{props.headerData.mandate}</p>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{textAlign:'center',p:1}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:1}}>
                        <Typography sx={{fontWeight:'bold'}}>Vision</Typography>
                        <Tooltip title='Update Vision'><IconButton className="custom-iconbutton" size="small" color="success" sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleOpenUpdate('Vision')}><EditIcon fontSize='small'/></IconButton></Tooltip>
                    </Box>
                    <Paper sx={{p:1}}>
                    <p className="text">{props.headerData.vision}</p>
                    </Paper>

                </Grid>
                <Grid item xs={12} sx={{textAlign:'center',p:1}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:1}}>
                        <Typography sx={{fontWeight:'bold'}}>Mission</Typography>
                        <Tooltip title='Update Mission'><IconButton className="custom-iconbutton" size="small" color="success" sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleOpenUpdate('Mission')}><EditIcon fontSize='small'/></IconButton></Tooltip>
                    </Box>
                    <Paper sx={{p:1}}>
                    <p className="text">{props.headerData.mission}</p>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{textAlign:'center',p:1}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:1}}>
                        <Typography sx={{fontWeight:'bold'}}>Organization Outcome</Typography>
                        <Tooltip title='Update Organization Outcome'><IconButton className="custom-iconbutton" size="small" color="success" sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleOpenUpdate('Org. Outcome')}><EditIcon fontSize='small'/></IconButton></Tooltip>
                    </Box>
                    <Paper sx={{p:1}}>
                    <p className="text">{props.headerData.org_outcome}</p>
                    </Paper>
                </Grid>
                <MediumModal open = {openUpdate} close = {handleCloseUpdate} title={`Updating ${type}`}>

                    <Box sx={{m:1}}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    {getType()}
                                </Grid>
                                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                                    <Button variant='contained' className='custom-roundbutton' color="success" type="submit" disabled={isLoadingSubmit} size="small">Save</Button>
                                    <Button variant='contained' className='custom-roundbutton' color="error" onClick={handleCloseUpdate} size="small">Cancel</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </MediumModal>
            </Grid>
        </Box>
    )
}