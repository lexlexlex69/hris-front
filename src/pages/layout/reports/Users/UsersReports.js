import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect,useState } from "react";
import { getLackingPDSInfo, usersReports } from "./UsersReportsRequest";
import SmallModal from "../../custommodal/SmallModal";
import FullModal from "../../custommodal/FullModal";
import Swal from "sweetalert2";
import { APILoading } from "../../apiresponse/APIResponse";
import EmpListTable from "./Modal/EmpListTable";
import { grey } from "@mui/material/colors";
import { formatExtName, formatMiddlename } from "../../customstring/CustomString";

export default function UsersReports(){
    const [hasAccountData,setHasAccountData] = useState([]);
    const [noAccountData,setNoAccountData] = useState([]);
    const [selectedDept,setSelectedDept] = useState('');
    const [empListData,setEmpListData] = useState([]);
    const generate = async () => {
        try{
            APILoading('info','Loading data','Please wait...')
            const res = await usersReports();
            setHasAccountData(res.data.has_account)
            setNoAccountData(res.data.no_account)
            Swal.close();
            console.log(res.data)
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
    }
    const handleViewEmpList = (row) => {
        console.log(row)
        setSelectedDept(row.short_name)
        setEmpListData(JSON.parse(row.details))
        setOpenEmpList(true)

    }
    const [openEmpList,setOpenEmpList] = useState(false);
    const handleCloseEmpList = () => {
        setOpenEmpList(false)
    }
    const formatTotal  = (row) => {
        var total = 0;
        row.forEach(el=>{
            total+=el.total
        });
        return total
    }
    const [openLackingPDSModal,setOpenLackingPDSModal] = useState(false)
    const [lackingPDSData,setLackingPDSData] = useState([])
    const generateIncompletePDS = async () =>{
        try{
            APILoading('info','Retrieving Info','Please wait...')
            const res = await getLackingPDSInfo()
            console.log(res.data)
            const result = Object.groupBy(res.data, ({ dept_code }) => dept_code);
            console.log(result)
            setLackingPDSData(res.data)
            Swal.close()
            setOpenLackingPDSModal(true)
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
    }
    const isEmpty = (obj) =>{
        var lacking = '';
        for (const [key, value] of Object.entries(obj)) {
            if(!value){
                if(key.toString() !== 'extname'){
                    lacking+=key+','
                }

            }
        }

        return lacking;
    }
    return(
        <Box sx={{m:2}}>
            <Grid container>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1,mb:1}}>
                    <Button variant='contained' onClick={generate}>
                        Generate
                    </Button>
                    <Button variant='contained' onClick={generateIncompletePDS}>
                        Incomplete PDS
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography>Has Account</Typography>
                    <Typography sx={{color:grey[600],fontSize:'.9rem',fontStyle:'italic'}}>Total:{formatTotal(hasAccountData)}</Typography>
                    <Paper>
                        <TableContainer sx={{maxHeight:'60vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Office/Dept
                                        </TableCell>
                                        <TableCell>
                                            Total
                                        </TableCell>
                                        <TableCell>
                                            Employee List
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        hasAccountData.map((item,key)=>
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {item.dept_title?item.dept_title:'Not Assigned'}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {item.total} */}
                                                    {JSON.parse(item.details).length}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="outlined" onClick={()=>handleViewEmpList(item)}>
                                                        View List
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} sx={{mt:2}}>
                    <Typography>No Account</Typography>
                    <Typography sx={{color:grey[600],fontSize:'.9rem',fontStyle:'italic'}}>Total:{formatTotal(noAccountData)}</Typography>
                    <Paper>
                        <TableContainer sx={{maxHeight:'60vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Office/Dept
                                        </TableCell>
                                        <TableCell>
                                            Total
                                        </TableCell>
                                        <TableCell>
                                            Employee List
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        noAccountData.map((item,key)=>
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {item.dept_title?item.dept_title:'Not Assigned'}
                                                </TableCell>
                                                <TableCell>
                                                    {JSON.parse(item.details).length}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="outlined" onClick={()=>handleViewEmpList(item)}>
                                                        View List
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    
                </Grid>
                <SmallModal open = {openEmpList} close = {handleCloseEmpList} title={`${selectedDept}'s Employee List`}>
                    <EmpListTable data = {empListData}/>
                </SmallModal>
                <FullModal open = {openLackingPDSModal} close = {()=>setOpenLackingPDSModal(false)} title='Employee Lacking PDS'>
                        <Box>
                            <Typography><small><em>Total Results: {lackingPDSData.length}</em></small></Typography>
                            <Paper>
                                <TableContainer sx={{maxHeight:'60vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell rowSpan={2}>
                                                    Name
                                                </TableCell>
                                                <TableCell>
                                                    Office
                                                </TableCell>
                                                <TableCell>
                                                    Lacking
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                lackingPDSData.map((item,key)=>
                                                    <TableRow key={key}>
                                                        <TableCell>
                                                            {`${item.lname}, ${item.fname} ${formatExtName(item.extname)} ${formatMiddlename(item.mname)}`}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.short_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                isEmpty(item)
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                </FullModal>
            </Grid>
        </Box>
    )
}