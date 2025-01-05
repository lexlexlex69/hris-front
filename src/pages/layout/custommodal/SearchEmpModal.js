import { Modal,Box,Typography,Tooltip,IconButton, Grid, TextField, Button, Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody } from "@mui/material";
import React, { useState } from "react";
import { styled } from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//Icons
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import { blue } from "@mui/material/colors";
import { searchEmployee } from "./CustomModalRequests";
import { formatExtName, formatMiddlename } from "../customstring/CustomString";

export default function SearchEmpModal({open,close,title,updateSelect,type,children}){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchVal,setSearchVal] = useState('')
    const [searchResultsData,setSearchResultsData] = useState([])
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'99%':500,
        bgcolor: 'background.paper',
        // border: '2px solid #fff'
        boxShadow: 24,
        // p: 2,
    };
    const handleSearch = async (e)=>{
        e.preventDefault();
        var t_data = {
            data:searchVal
        }
        const res = await searchEmployee(t_data);
        console.log(res)
        setSearchResultsData(res.data)
    }
    const handleSelect = (row) => {
        close();
        if(type === 1){
            updateSelect(row)
        }else{
            updateSelect(row.id)
        }
    }
    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',background:blue[800],p:1}}>
                    <Typography id="modal-modal-title" sx={{color:'#fff'}} variant="h6">
                    {title}
                    </Typography>
                    <Tooltip title='Close'><IconButton color='error' size="small" onClick={close} sx={{background:'#fff','&:hover':{background:'#e5e5e5'}}}><CloseIcon fontSize="small"/></IconButton></Tooltip>
                </Box>
                <Box sx={{p:1}}>
                    <form onSubmit = {handleSearch}>
                    <Grid container>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                            <TextField label ='Employee Name' fullWidth value = {searchVal} onChange={(val)=>setSearchVal(val.target.value)} required/>
                            <Button variant="outlined" startIcon={<SearchIcon/>} type="submit">Search</Button>
                        </Grid>
                    </Grid>
                    </form>
                    {
                        searchResultsData.length>0
                        ?
                        <Grid container sx={{mt:1}}>
                            <Grid item xs={12}>
                                <Paper>
                                <TableContainer sx={{maxHeight:'70vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Employee ID
                                                </TableCell>
                                                <TableCell>
                                                    Name
                                                </TableCell>
                                                <TableCell>
                                                    Department
                                                </TableCell>
                                                <TableCell>
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                searchResultsData.map((item,key)=>{
                                                    return (
                                                        <TableRow key = {key}>
                                                            <TableCell>{item.id}</TableCell>
                                                            <TableCell>{item.fname} {formatMiddlename(item.mname)} {item.lname} {formatExtName(item.extname)}</TableCell>
                                                            <TableCell>{item.dept_title}</TableCell>
                                                            <TableCell><Button variant="outlined" color='primary' onClick={()=>handleSelect(item)}>Select</Button></TableCell>

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
                        :
                        <Typography sx={{textAlign:'center',mt:1}}>No Results Found</Typography>
                    }
                    {children}
                </Box>
                
            </Box>
        </Modal>
    )
}