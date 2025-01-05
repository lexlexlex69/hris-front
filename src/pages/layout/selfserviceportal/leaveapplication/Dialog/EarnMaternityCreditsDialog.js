import { Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip,Modal,Box,Typography } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { getExtendedMaternityInfo } from '../LeaveApplicationRequest';
import { green,red,blue } from '@mui/material/colors';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import EarnExtendedMaternityLeaveFillout from '../Modal/EarnExtendedMaternityLeaveFillout';
export default function EarnMaternityCreditsDialog(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    /**
     * Modal style
     */
     const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? '100%':900,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        p: 2,
      };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        },
    }));
    const [data,setData] = useState([])
    useEffect(()=>{
        getExtendedMaternityInfo()
        .then(res=>{
            console.log(res.data)
            setData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const [openAllocation,setOpenAllocation] = useState(false)
    const [employeeInfo,setEmployeeInfo] = useState([])
    const handleSetEmployeeInfo = (data)=>{
        setEmployeeInfo(data)
        setOpenAllocation(true)
    }
    return(
        <Grid container>
            <Grid item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Benefactor
                                </TableCell>
                                <TableCell>
                                    Days Allocated
                                </TableCell>
                                <TableCell>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((row,key)=>
                                    <TableRow key={key}>
                                        <TableCell>
                                            {row.fname} {row.lname}
                                        </TableCell>
                                        <TableCell>
                                            {row.allocation_number_days}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title='Fillout form'><IconButton color='primary' onClick={()=>handleSetEmployeeInfo(row)}><AddCircleIcon/></IconButton></Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Modal
                open={openAllocation}
                onClose={()=> setOpenAllocation(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                    NOTICE OF ALLOCATION OF MATERNITY LEAVE FORM
                </Typography>
                <Box sx ={{maxHeight:'70vh',overflowY:'scroll',padding:'5px'}}>
                    <Grid container spacing={2}>
                        <EarnExtendedMaternityLeaveFillout onClose = {()=> setOpenAllocation(false)} employeeInfo = {employeeInfo} setData = {setData} close = {()=> setOpenAllocation(false)} mainClose = {props.mainClose}/>
                    </Grid>
                </Box>
                </Box>
            </Modal>
        </Grid>
    )
}