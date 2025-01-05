import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { formatExtName, formatMiddlename } from '../../../customstring/CustomString';
import FullModal from '../../../custommodal/FullModal';
import DefaultRequirementsPreviewDeptHead from '../../traineedashboard/TabsComponent/CustomComponents/DefaultRequirementsPreviewDeptHead';

export const Reviewed = ({data}) => {
    const [openView,setOpenView] = useState(false)
    const [reqData,setReqData] = useState([])
    const handleView = (item)=>{
        console.log(item)
        setReqData(item)
        setOpenView(true)
    }
    return (
        <Box>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Action
                                </TableCell>
                                <TableCell align='center'>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((item)=>{
                                    return(
                                        <TableRow key = {item.trainee_training_app_req_id}>
                                            <TableCell>{`${item.fname} ${formatMiddlename(item.mname)} ${item.lname} ${formatExtName(item.extname)}`}</TableCell>
                                            <TableCell>
                                            {
                                                item.dept_approved
                                                ?
                                                <span style={{color:'green'}}>APPROVED ({moment(item.dept_approved_at,'YYYY-MM-DD HH:mm:ss').format('MMMM DD, YYYY hh:mm a')})</span>
                                                :
                                                <span style={{color:'red'}}>DISAPPROVED ({item.remarks})</span>
                                            }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" onClick={()=>handleView(item)}>Preview</Button>
                                            </TableCell>
                                        
                                        </TableRow>
                                    )
                                    
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <FullModal open = {openView} close = {()=>setOpenView(false)} title='Viewing LAP/SAP'>
                    <DefaultRequirementsPreviewDeptHead reqData = {reqData}/>
                </FullModal>
            </Paper>
        </Box>
    )
}