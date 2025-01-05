import { Autocomplete, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import SmallModal from '../../../../../custommodal/SmallModal';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { postPaySetup } from '../../SetupPayrollRequests';
import moment from 'moment';
import { APIError, APISuccess } from '../../../../../customstring/CustomString';
import { APILoading } from '../../../../../apiresponse/APIResponse';
export const PayrollSetup = ({tabValue,payType,clerk,payAllowance,close}) => {
    const [selectedPayType,setSelectedPayType] = useState(null);
    const [tempSelAllowance,setTempSelAllowance] = useState([]);
    const [selAllowance,setSelAllowance] = useState([]);
    const [openAddAllowance,setOpenAddAllowance] = useState(false)
    const [tempData,setTempData] = useState({
        pay_type:null,
        p_from:'',
        p_to:'',
        w_day:0,
        d_15:11,
        d_30:11,
        title:'',
        clerk:null
    });
    useEffect(()=>{
        console.log(tabValue)
        console.log(payAllowance)
        switch(tabValue){
            //regular
            case 0: case 1:
                //set default allowance
                let temp = payAllowance.filter(el=>el.earn_code === 'PERA');
                setSelAllowance(temp)

            break;
        }
    },[])
    const handleSelectPayType = (e,newVal) => {
        setTempData({...tempData,
            pay_type:newVal
        })
        console.log(newVal)
        // setSelectedPayType(newVal);
    }
    const handleSelectClerk = (e,newVal) => {
        console.log(newVal)
        setTempData({...tempData,
            clerk:newVal
        })
        // setSelectedPayType(newVal);
    }
    useEffect(()=>{
        setTempData({
            ...tempData,
            w_day:parseFloat(tempData.d_15)+parseFloat(tempData.d_30)
        })
    },[tempData.d_15,tempData.d_30])
    const handleOpenAllowance = () => {
        // console.log(selAllowance)
        setTempSelAllowance(selAllowance)
        setOpenAddAllowance(true)
    }
    const handleAddAllowance = () => {
        setSelAllowance(tempSelAllowance)
        setOpenAddAllowance(false)

    }
    const handleDelAllowance = (item) => {
        let temp = [...selAllowance];
        let index = selAllowance.findIndex(el=>el.earn_code === item.earn_code);
        temp.splice(index,1);
        setSelAllowance(temp)
    }
    const handleSave = async () => {
        try{
            APILoading('info','Saving data','Please wait...')
            let cat;
            switch(tabValue){
                //regular
                case 0:
                    cat = 1;
                break;
                //casual
                case 1:
                    cat = 2;
                break;
                //COS
                case 2:
                    cat = 3;
                break;
                case 3:
                    cat = 5;
                break;
                case 4:
                    cat = 4;
                break;
            }
            let t_data = {
                category:cat,
                pay_clerk:tempData.clerk.clerk_code,
                date_one:moment(tempData.p_from).format('MM/DD/YYYY'),
                date_two:moment(tempData.p_to).format('MM/DD/YYYY'),
                p_from:moment(tempData.p_from).format('YYYY-MM-DD'),
                p_to:moment(tempData.p_to).format('YYYY-MM-DD'),
                days_one:tempData.d_15,
                days_two:tempData.d_30,
                pay_type:tempData.pay_type.tran_type,
                title:tempData.title,
                year:moment(tempData.p_from).format('YYYY'),
                month:moment(tempData.p_from).format('MM'),
                key:'b9e1f8a0553623f1:639a3e:17f68ea536b'
            }
            console.log(t_data)
            const res = await postPaySetup(t_data);
            if(res.data.status === 200){
                APISuccess(res.data.message)
            }else{
                APIError(res.data.message)
            }
            console.log(res.data)
        }catch(err){
            APIError(err)
        }
        
    }
    return (
        <Grid container spacing={2} sx={{p:1}}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={payType}
                    getOptionLabel={(option) => option.tran_type_desc}
                    isOptionEqualToValue={(option, value) => option.tran_type === value.tran_type }
                    // sx={{ width: 300 }}
                    fullWidth
                    size="small"
                    value = {tempData.pay_type}
                    onChange={handleSelectPayType}
                    renderInput={(params) => <TextField {...params} label="Payroll Type" required variant='standard'/>}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField label='Period From' type='date' size='small' InputLabelProps={{shrink:true}} value={tempData.p_from} onChange={(val)=>setTempData({...tempData,p_from:val.target.value})} fullWidth variant='standard'/>
            </Grid>
            <Grid item xs={6}>
                <TextField label='Period To' type='date' size='small' InputLabelProps={{shrink:true}} value={tempData.p_to} onChange={(val)=>setTempData({...tempData,p_to:val.target.value})} fullWidth variant='standard'/>
            </Grid>
            <Grid item xs={4}>
                <TextField label='No. of Days 1-15' type='number' size='small' value={tempData.d_15} InputLabelProps={{shrink:true}} onChange={(val)=>setTempData({...tempData,d_15:val.target.value})} fullWidth variant='standard'/>
            </Grid>
            <Grid item xs={4}>
                <TextField label='No. of Days 16-30' type='number' size='small' value={tempData.d_30} InputLabelProps={{shrink:true}} onChange={(val)=>setTempData({...tempData,d_30:val.target.value})} fullWidth variant='standard'/>
            </Grid>
            <Grid item xs={4}>
                <TextField label='Working Day/s' size='small' value={tempData.w_day} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant='standard'/>
            </Grid>
            <Grid item xs={12}>
                <TextField label='Title' size='small' value={tempData.title} onChange={(val)=>setTempData({...tempData,title:val.target.value})} fullWidth variant='standard'/>
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-clerk"
                    options={clerk}
                    getOptionLabel={(option) => option.clerk_name}
                    isOptionEqualToValue={(option, value) => option.clerk_code === value.clerk_code}
                    // sx={{ width: 300 }}
                    fullWidth
                    size="small"
                    value = {tempData.clerk}
                    onChange={handleSelectClerk}
                    renderInput={(params) => <TextField {...params} label="Pay Clerk" required variant='standard'/>}
                    />
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{fontSize:'.7rem',textAlign:'right',fontStyle:'italic'}}>Allowances included in this Payroll Transaction</Typography>
                <Paper>
                    <TableContainer sx={{maxHeight:'20vh'}}>
                        <Table>
                            <TableBody>
                                {
                                    selAllowance.map((item)=>{
                                        return(
                                            <TableRow key = {item.earn_code}>
                                                <TableCell>
                                                    {item.earn_desc}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title='Delete'>
                                                    <IconButton size='small' className='custom-iconbutton' color='error' onClick={()=>handleDelAllowance(item)}><DeleteIcon/></IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                            <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Button size='small' variant='outlined' className='custom-roundbutton' onClick={handleOpenAllowance} startIcon={<AddIcon/>}>Add</Button>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Paper>
            
            </Grid>
            <Grid item xs={12} sx={{display:'flex',gap:1,justifyContent:'flex-end'}}>
                <Button className='custom-roundbutton' variant='contained' color='success' onClick={handleSave}>Save</Button>
                <Button className='custom-roundbutton' variant='contained' color='error' onClick={close}>Cancel</Button>
            
            </Grid>
            <SmallModal open = {openAddAllowance} close = {()=>setOpenAddAllowance(false)} title='Choose Allowance'>
                <Grid container sx={{p:1}} spacing={3}>
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-desc"
                            options={payAllowance}
                            getOptionLabel={(option) => option.earn_desc}
                            isOptionEqualToValue={(option, value) => option.earn_code === value.earn_code }
                            // sx={{ width: 300 }}
                            fullWidth
                            size="small"
                            multiple
                            value = {tempSelAllowance}
                            onChange={(e,newVal)=>setTempSelAllowance(newVal)}
                            renderInput={(params) => <TextField {...params} label="Description" required variant='standard'/>}
                            // disableCloseOnSelect
                        />
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button onClick={handleAddAllowance} variant='contained' className='custom-roundbutton' color='success'>Save It</Button>
                        <Button onClick={()=>setOpenAddAllowance(false)} variant='contained' color='error' className='custom-roundbutton'>Cancel</Button>
                    </Grid>
                </Grid>
                
            </SmallModal>
        </Grid>
    )
}