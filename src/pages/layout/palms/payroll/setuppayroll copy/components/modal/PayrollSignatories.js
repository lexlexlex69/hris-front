import { Box, Fade, Grid, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { updatePayrollSignatories } from '../../SetupPayrollRequests';
import { APIError, APISuccess } from '../../../../../customstring/CustomString';
import { APILoading } from '../../../../../apiresponse/APIResponse';
export const PayrollSignatories = ({signatories,setSignatories,close}) =>{
    const [data,setData] = useState(signatories)
    const [updateAcc,setUpdateAcc] = useState(false)
    const [updateTreas,setUpdateTreas] = useState(false)
    const [updateCMO,setUpdateCMO] = useState(false)
    const handSave = async (type) => {
        try{
            APILoading('info','Updating Signatories','Please wait...');
            const res = await updatePayrollSignatories({data:data,type:type})
            if(res.data.status === 200){
                APISuccess(res.data.message);
            }else{
                APIError(res.data.message);
            }
            switch(type){
                case 'acc':
                    setUpdateAcc(false)
                break;
                case 'treas':
                    setUpdateTreas(false)
                break;
                case 'cmo':
                    setUpdateCMO(false)
                break;
            }
        }catch(err){
            APIError(err)
        }
    }
    return(
        <Box>
        <Grid container spacing={1} sx={{p:1,maxHeight:'65vh',overflow:'auto'}}>
            <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'column',gap:1,border:'solid 1px #bdbdbd',borderRadius:'5px',p:1}}>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Typography sx={{color:grey[700],fontWeight:'bold'}}>Accounting</Typography>
                        <Box>
                            {
                                updateAcc
                                ?
                                <Fade in>
                                <Box sx={{display:'flex',gap:1}}>
                                <Tooltip title='Save'><IconButton color='info' className='custom-iconbutton' onClick={()=>handSave('acc')}><SaveIcon/></IconButton></Tooltip>
                                <Tooltip title='Cancel'><IconButton color='error' className='custom-iconbutton' onClick={()=>setUpdateAcc(prev=>!prev)}><CloseIcon/></IconButton></Tooltip>
                                </Box>
                                </Fade>
                                :
                                <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick={()=>setUpdateAcc(prev=>!prev)}><EditIcon/></IconButton></Tooltip>

                            }
                            
                        </Box>
                    </Box>
                    <TextField label='Name' fullWidth size='small' value={data.accounting_name} onChange={(val)=>setData({...data,accounting_name:val.target.value})} disabled={updateAcc?false:true}/>
                    <TextField label='Position' fullWidth size='small' value={data.accounting_position} onChange={(val)=>setData({...data,accounting_position:val.target.value})}  disabled={updateAcc?false:true}/>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'column',gap:1,border:'solid 1px #bdbdbd',borderRadius:'5px',p:1}}>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Typography sx={{color:grey[700],fontWeight:'bold'}}>Treasury</Typography>
                        <Box>
                            {
                                updateTreas
                                ?
                                <Fade in>
                                <Box sx={{display:'flex',gap:1}}>
                                <Tooltip title='Save'><IconButton color='info' className='custom-iconbutton' onClick={()=>handSave('treas')}><SaveIcon/></IconButton></Tooltip>
                                <Tooltip title='Cancel'><IconButton color='error' className='custom-iconbutton' onClick={()=>setUpdateTreas(prev=>!prev)}><CloseIcon/></IconButton></Tooltip>
                                </Box>
                                </Fade>
                                :
                                <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick={()=>setUpdateTreas(prev=>!prev)}><EditIcon/></IconButton></Tooltip>

                            }
                            
                        </Box>
                    </Box>
                    <TextField label='Name' fullWidth size='small' value={data.treasury_name} onChange={(val)=>setData({...data,treasury_name:val.target.value})} disabled={updateTreas?false:true}/>
                    <TextField label='Position' fullWidth size='small' value={data.treasury_position} onChange={(val)=>setData({...data,treasury_position:val.target.value})}  disabled={updateTreas?false:true}/>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'column',gap:1,border:'solid 1px #bdbdbd',borderRadius:'5px',p:1}}>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Typography sx={{color:grey[700],fontWeight:'bold'}}>CMO</Typography>
                        <Box>
                            {
                                updateCMO
                                ?
                                <Fade in>
                                <Box sx={{display:'flex',gap:1}}>
                                <Tooltip title='Save'><IconButton color='info' className='custom-iconbutton' onClick={()=>handSave('cmo')}><SaveIcon/></IconButton></Tooltip>
                                <Tooltip title='Cancel'><IconButton color='error' className='custom-iconbutton' onClick={()=>setUpdateCMO(prev=>!prev)}><CloseIcon/></IconButton></Tooltip>
                                </Box>
                                </Fade>
                                :
                                <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick={()=>setUpdateCMO(prev=>!prev)}><EditIcon/></IconButton></Tooltip>

                            }
                            
                        </Box>
                    </Box>
                    <TextField label='Name' fullWidth size='small' value={data.cmo_name} onChange={(val)=>setData({...data,cmo_name:val.target.value})} disabled={updateCMO?false:true}/>
                    <TextField label='Position' fullWidth size='small' value={data.cmo_position} onChange={(val)=>setData({...data,cmo_position:val.target.value})}  disabled={updateCMO?false:true}/>
                </Box>
            </Grid>
        </Grid>
        </Box>
    );
}