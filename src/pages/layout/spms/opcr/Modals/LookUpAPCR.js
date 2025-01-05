import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue, grey } from "@mui/material/colors";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { addOPCR } from "../OPCRRequest";
import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[500],
    color: theme.palette.common.white,
    fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    },
}));
export const LookUpAPCR = (props) => {
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
    const addToOPCR = async (row) =>{
        const id = toast.loading('Adding to OPCR')
        try{
            let t_data = {
                apcr_id:row.apcr_id,
                mfo_code:row.mfo_code,
                year:row.year
            }
            const res = await addOPCR(t_data)
            if(res.data.status === 200){
                toast.update(id,{
                    render:res.data.message,
                    type:'success',
                    autoClose:true,
                    isLoading:false
                })
                props.setLookUpAPCRData(res.data.data)
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
                render:err.message,
                type:'error',
                autoClose:true,
                isLoading:false
            })
        }
        
    }
    return(
        <Box>
            <Grid container>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="right">
                                            MFO Code
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            MFO Description (Activity Name, Description)
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
                                        props.data.map((item,key)=>
                                            <TableRow key={key} hover>
                                                <StyledTableCell>
                                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                                    <IconButton color="primary" onClick={()=>addToOPCR(item)}><AddBoxIcon/></IconButton> {item.mfo_code}
                                                </Box>
                                                </StyledTableCell>
                                                <StyledTableCell>{item.mfo_desc}</StyledTableCell>
                                                <StyledTableCell>{item.sectors}</StyledTableCell>
                                                <StyledTableCell>{formatOffices(item.offices)}</StyledTableCell>
                                                <StyledTableCell>{item.time_frame}</StyledTableCell>
                                                <StyledTableCell>{item.year}</StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    )
}