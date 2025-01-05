import { Box, Button, Fade, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { checkPermission } from "../../permissionrequest/permissionRequest";
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from "../../loader/DashboardLoading";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";

//Icons
import AddIcon from '@mui/icons-material/Add';
import LargeModal from "../../custommodal/LargeModal";
import AddModal from "./Modals/AddModal";
import { getAllMFO, getAllOffices } from "./APCRRequest";
import MediumModal from "../../custommodal/MediumModal";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue } from "@mui/material/colors";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 14,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        },
    }));

export default function APCR(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [officesData,setOfficesData] = useState([])
    
    useEffect(async ()=>{
        try{
            const res = await checkPermission(71)
            if(res.data){
                const offices = await getAllOffices()
                setOfficesData(offices.data)

                const resData = await getAllMFO()
                console.log(resData)
                setData(resData.data)
                setIsLoading(false)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }catch(err){
            console.log(err)
        }
        
    },[])
    const [openAddModal,setOpenAddModal] = useState(false);
    const handleOpenAddModal = () => setOpenAddModal(true)
    const handleCloseAddModal = () => setOpenAddModal(false)
    const handleSubmitAdd = useCallback((item) => {
        console.log(item)
        setData((t)=>[...t,item])
    },[data])
    const formatOffices = (item) =>{
        var temp = '';
        JSON.parse(item).forEach((el,key)=>{
            if(key===0){
                temp+=el.short_name;
            }else{
                temp+=', '+el.short_name;
            }
        })
        return temp;
    }
    return (
        <Box sx={{margin:'0 10px'}}>
            {
                isLoading
                ?
                    <Box>
                        <DashboardLoading />
                    </Box>
                :
                <Fade in>
                    <Grid container spacing={1}>
                        <Grid item xs={12} >
                            <ModuleHeaderText title='APCR'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Button variant="contained" color="success" className="custom-roundbutton" onClick={handleOpenAddModal} startIcon={<AddIcon/>}>Add</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    Code
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Description
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Sector
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Offices
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Time Frame
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Year
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.length>0
                                                ?
                                                data.map((item,key)=>
                                                <TableRow key={key}>
                                                    <StyledTableCell>{item.mfo_code}</StyledTableCell>
                                                    <StyledTableCell>{item.mfo_desc}</StyledTableCell>
                                                    <StyledTableCell>{item.sectors}</StyledTableCell>
                                                    <StyledTableCell>{formatOffices(item.offices)}</StyledTableCell>
                                                    <StyledTableCell>{item.time_frame}</StyledTableCell>
                                                    <StyledTableCell>{item.year}</StyledTableCell>

                                                </TableRow>
                                                )
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center">No Data</TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                            
                        </Grid>

                        {/* <Grid item xs={12}>
                            <Typography>Create new MFO for APCR</Typography>

                            <Box>
                                <TextField label='MFO /  MFO CODE'/>                       
                                <TextField label='MFO DESCRIPTION (Activity name, Description'/>                       
                                <TextField label='SECTOR'/>                       
                                <TextField label='OFFICES'/>                
                                <TextField label='TIME FRAME'/>                
                                <TextField label='YEAR'/>
                                <Button>Submit</Button>              
                            </Box>
                        </Grid> */}
                        
                        <MediumModal open={openAddModal} close={handleCloseAddModal} title='Creating new MFO'>
                            <AddModal officesData = {officesData} setData={setData} close = {handleCloseAddModal}/>
                        </MediumModal>
                    </Grid>
                </Fade>
            }
            
        </Box>
    )
}