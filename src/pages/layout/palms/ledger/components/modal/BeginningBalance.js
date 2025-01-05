import { Box, Grid, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { APIError, APISuccess, formatExtName, formatMiddlename, StyledTableCellLedger } from '../../../../customstring/CustomString';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { APILoading } from '../../../../apiresponse/APIResponse';
import { postBeginningBalance } from '../../LeaveLedgerRequests';
export const BeginningBalance = ({empList,setLedger,selectedEmpLedger,setBalance}) => {
    const [newEmpList,setNewEmpList] = useState([])
    const [empStatus,setEmpStatus] = useState('RE');
    const [selectedEmp,setSelectedEmp] = useState()
    useEffect(()=>{
        let temp = empList.filter(el=>el.emp_status === empStatus)
        setNewEmpList(temp)
    },[empList])
    const [searchVal,setSearchVal] = useState('');
    const filterData = newEmpList.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase()))
    useEffect(()=>{
        let temp = empList.filter(el=>el.emp_status === empStatus)
        setNewEmpList(temp)
    },[empStatus])
    const handleClickEdit = (item) => {
        let temp = [...newEmpList];
        let index = temp.findIndex(el=>el.id === item.id);
        temp[index].editable = true;
        setNewEmpList(temp)
        setSelectedEmp(item)
    }
    const handleChange = (val,name) =>{
        let temp = {...selectedEmp};
        setSelectedEmp({
            ...selectedEmp,
            [name]:val.target.value
        })
    }
    const handleClickCancel = (item) => {
        console.log(item)
        let temp = [...newEmpList];
        let index = temp.findIndex(el=>el.id === item.id);
        temp[index].editable = false;
        setNewEmpList(temp)
    }
    const handleClickSave = async () =>{
        try{
            APILoading('info','Posting Beginning Balance to Ledger','Please wait...')

            const res = await postBeginningBalance({data:selectedEmp});
            if(res.data.status === 200){
                APISuccess(res.data.message)
                let temp = [...newEmpList];
                let index = temp.findIndex(el=>el.id === selectedEmp.id);
                temp[index].vl_bal = selectedEmp.vl_bal;
                temp[index].sl_bal = selectedEmp.sl_bal;
                temp[index].as_of = selectedEmp.as_of;
                temp[index].editable = false;
                setNewEmpList(temp)
                //check if has selected employee and match the current updated beginning balance
                if(selectedEmpLedger){
                    if(selectedEmp.id === selectedEmpLedger.id){
                        setBalance(res.data.balance)
                        setLedger(res.data.data)
                    }
                }
                
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    return (
        <Grid container spacing = {1}>
            <Grid item xs={12}>
                <Box sx={{display:'flex',justifyContent:'space-between'}}>
                <TextField label = 'Search' value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} size='small'/>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={empStatus}
                        onChange={(val)=>setEmpStatus(val.target.value)}
                        size='small'
                    >
                        <FormControlLabel value="RE" control={<Radio />} label="Permanent" />
                        <FormControlLabel value="CS" control={<Radio />} label="Casual"/>
                    </RadioGroup>
                    </FormControl>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'80dvh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCellLedger>
                                        Name
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger>
                                        VL
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger>
                                        SL
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger>
                                        As of
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger>
                                    </StyledTableCellLedger>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    filterData.map((item)=>{
                                        return (
                                            <TableRow key = {item.id} hover>
                                                <StyledTableCellLedger>
                                                    {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                </StyledTableCellLedger>
                                                <StyledTableCellLedger>
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField value = {selectedEmp.vl_bal} onChange={(val)=>handleChange(val,'vl_bal')} size='small'/>
                                                        :
                                                        item.vl_bal
                                                    }
                                                </StyledTableCellLedger>
                                                <StyledTableCellLedger>
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField value = {selectedEmp.sl_bal} onChange={(val)=>handleChange(val,'sl_bal')} size='small'/>
                                                        :
                                                        item.sl_bal
                                                    }
                                                </StyledTableCellLedger>
                                                <StyledTableCellLedger>
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type ='date' value = {selectedEmp.as_of} onChange={(val)=>handleChange(val,'as_of')} size='small'/>
                                                        :
                                                        item.as_of?moment(item.as_of).format('MMM. DD, YYYY'):''
                                                    }
                                                </StyledTableCellLedger>
                                                <StyledTableCellLedger>
                                                    {
                                                        item.editable
                                                        ?
                                                        <Box sx={{display:'flex',gap:1}}>
                                                        <Tooltip title='Save and Post to Ledger'>
                                                        <IconButton color='success' className='custom-iconbutton' onClick={()=>handleClickSave(item)}><SaveIcon/></IconButton>
                                                        </Tooltip>
                                                        <IconButton color='error' className='custom-iconbutton' onClick={()=>handleClickCancel(item)}><CloseIcon/></IconButton>

                                                        </Box>
                                                        :
                                                        <IconButton color='info' className='custom-iconbutton' onClick={()=>handleClickEdit(item)}><EditIcon/></IconButton>

                                                    }

                                                </StyledTableCellLedger>
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
    )
}