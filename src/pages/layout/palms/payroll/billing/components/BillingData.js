import { Grid, Paper,Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Fade, TextField, IconButton, Tooltip, TablePagination, Stack, Skeleton, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteEmpBilling, getBillingData } from "../BillingRequest";
import moment from "moment";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { blue, grey } from "@mui/material/colors";
import { ManualAdd } from "./ManualAdd";
import { APIError, autoCapitalizeFirstLetter, formatExtName, formatMiddlename } from "../../../../customstring/CustomString";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
//Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

import { ManualAddSelected } from "./ManualAddSelected";
import SmallModal from "../../../../custommodal/SmallModal";
import { UpdateBilling } from "./UpdateBilling";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";
import PaginationOutlined from "../../../../custompagination/PaginationOutlined";
import { toast } from "react-toastify";
import FullModal from "../../../../custommodal/FullModal";
export const BillingData = ({loanType})=>{
    const [year,setYear] = useState(moment().format('YYYY'))
    const [data,setData] = useState([])
    const [selectedData,setSelectedData] = useState([]);
    const [selectedDataManual,setSelectedDataManual] = useState([]);
    const [openManualAdd,setOpenManualAdd] = useState(false)
    const [type,setType] = useState(0)
    const [openUpdate,setOpenUpdate] = useState(false)
    const [selectedUpdateData,setSelectedUpdateData] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingData,setLoadingData] = useState(false)
    useEffect(()=>{
        _init();
    },[]);
    const _init = async () => {
        setLoadingData(true)
        const res = await getBillingData({search:searchVal,year:year,page:page+1,per_page:rowsPerPage});
        setData(res.data.data.data)
        if(res.data.data.data.length>0){
            setSelectedData(res.data.data[0])
            setTotalRecords(res.data.data.total)
        }
        setLoadingData(false)

    }
    const _refresh = async () => {
        APILoading('info','Refreshing data','Please wait...')
        const res = await getBillingData({search:searchVal,year:year,page:page+1,per_page:rowsPerPage});
        console.log(res.data)
        setData(res.data.data.data)
        if(res.data.data.data.length>0){
            setSelectedData(res.data.data[0])
        }
        setSearchVal('')
        Swal.close()
    }
    const handleSelect = (row)=>{
        setSelectedData(row) 
    }
    const handleOpenManualAdd = (row)=>{
        setSelectedDataManual(row)
        setOpenManualAdd(true)
        setType(1)
        console.log(row)
    }
    const [searchVal,setSearchVal] = useState('')
    const filter = data.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase()))
    const handleClearSearch = async () =>{
        setSearchVal('')
        setLoadingData(true)

        setPage(0);
        const res = await getBillingData({search:'',year:year,page:1,per_page:rowsPerPage});
        setData(res.data.data.data)
        setLoadingData(false)
        setTotalRecords(res.data.data.total)

    }
    useEffect(()=>{
        setSelectedData({})
    },[searchVal])
    const handleOpenUpdate = (row)=>{
        console.log(row)
        setSelectedUpdateData(row)
        setOpenUpdate(true)

    }
    const handleCloseUpdate = ()=>{
        setOpenUpdate(false)
    }
    const handleDelete = async (row)=>{
        Swal.fire({
            icon:'question',
            title:'Confirm delete ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(async res=>{
            if(res.isConfirmed){
                APILoading('info','Deleting data','Please wait...')
                const res = await deleteEmpBilling({
                    id:row.emp_billing_id,
                    emp_no:row.emp_no
                })
                if(res.data.status === 200){
                    let temp = {...selectedData};
                    temp.details = JSON.stringify(JSON.parse(temp.details).filter(el=>el.emp_billing_id !== row.emp_billing_id))
                    setSelectedData(temp)
                    // let new_arr;
                    for(let item of Object.keys(data)) {
                        if(data[item].id === row.emp_id) {
                            data[item].details = JSON.stringify(res.data.data)
                            // new_arr = data[item];
                            // setSelectedData(data[item])
                            // console.log(data[item])
                        }
                    }
                    // setSelectedData(new_arr)

                     Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1000
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
                console.log(res.data)
            }
        })
        
    }
    

    const handleChangePage = async (event, newPage) => {
        setLoadingData(true)

        setPage(newPage);
        const res = await getBillingData({search:searchVal,year:year,page:newPage+1,per_page:rowsPerPage});
        setData(res.data.data.data)
        setLoadingData(false)


    };

    const handleChangeRowsPerPage = async (event) => {
        setLoadingData(true)
        setRowsPerPage(event.target.value);
        const res = await getBillingData({search:searchVal,search:searchVal,year:year,page:page+1,per_page:event.target.value});
        setData(res.data.data.data)
        setLoadingData(false)
        setPage(0);
    };
    const [loadingSearch,setLoadingSearch] = useState(false)
    const handleSearch = async(e) =>{
        e.preventDefault();
        setLoadingSearch(true)
        try{
            const res = await getBillingData({search:searchVal,year:year,page:page+1,per_page:rowsPerPage});
            setData(res.data.data.data)
            setPage(0);
            setLoadingSearch(false)
            setTotalRecords(res.data.data.total)

            if(res.data.data.data.length>0){
                toast.success('Successfully loaded')
            }else{
                toast.warning('No result found')
            }
        }catch(err){
            APIError(err)
            setLoadingSearch(false)

        }
        

    }
    return (
        <Grid container spacing={1}>

            <Grid item xs={12}>
                <ManualAdd loanType={loanType} refresh = {_refresh}/>
            </Grid>
            <Grid item xs={12}>
                <ManualAddSelected loanType={loanType} openManualAdd = {openManualAdd} setOpenManualAdd = {setOpenManualAdd} selectedData = {selectedDataManual} setSelectedData={setSelectedData} data = {data} setData = {setData}/>
            </Grid>
            <Grid item xs={12}>
            <Paper sx={{p:1}}>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography sx={{ml:1,color:blue[800],fontWeight:'bold'}}>List of Employee with Billing</Typography>
                    <span style={{color:grey[600],fontSize:'.9rem'}}><em>Total Records: {totalRecords}</em></span>
                    </Box>
                    <form onSubmit={handleSearch}>

                    <TextField value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} fullWidth sx={{mb:1}} placeholder="Firstname or Lastname" InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                        endAdornment:<InputAdornment position="end">
                        <Box sx={{display:'flex'}}>
                        <Tooltip title='Submit Search'><IconButton color='primary' disabled={loadingSearch} type="submit">
                            {
                                loadingSearch
                                ?
                                <CircularProgress/>
                                :
                                <SendIcon/>
                            }
                        
                        </IconButton></Tooltip>
                        <Tooltip title='Clear Search'><IconButton color='error' onClick={handleClearSearch}><CancelIcon/></IconButton></Tooltip>
                        </Box>
                        </InputAdornment>
                    }}/>
                    </form>

                    {
                        loadingData
                        ?
                        <Stack gap={1}>
                            <Skeleton variant="rectangular" height={40}/>
                            <Skeleton variant="rectangular" height={40}/>
                            <Skeleton variant="rectangular" height={40}/>
                            <Skeleton variant="rectangular" height={40}/>
                            <Skeleton variant="rectangular" height={40}/>
                        </Stack>
                        :
                        <List sx={{maxHeight:'50vh',overflowY:'scroll'}}>
                        {
                            data.map((item,key)=>{
                                return(
                                    <ListItem disablePadding key = {key}
                                        secondaryAction={
                                            <Tooltip title='Add Billing'>
                                                <IconButton edge="end" aria-label="add" color="success" onClick={()=>handleOpenManualAdd(item)}>
                                                <AddCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    >
                                        <ListItemButton onClick={()=>handleSelect(item)}>
                                        {/* <ListItemIcon> */}
                                            {/* <AddCircleIcon /> */}
                                        {/* </ListItemIcon> */}
                                        <ListItemText primary={`${autoCapitalizeFirstLetter(item.lname)}, ${autoCapitalizeFirstLetter(item.fname)} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })
                        }
                        
                    </List>
                    }
                    
                    <TablePagination
                        component='div'
                        count = {totalRecords}
                        page = {page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    </Grid>
                    <Grid item xs={8}>
                        <Fade in>
                        <TableContainer sx={{maxHeight:'60vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Loan Name
                                        </TableCell>
                                        <TableCell>
                                            Monthly Amortization
                                        </TableCell>
                                        <TableCell>
                                            Period From
                                        </TableCell>
                                        <TableCell>
                                            Period To
                                        </TableCell>
                                        <TableCell>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        selectedData?.details
                                        ?
                                        JSON.parse(selectedData?.details).map((item,key)=>{
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell>
                                                        {item.loan_abbr}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.amount}
                                                    </TableCell>
                                                    <TableCell>
                                                        {`${moment(item.period_from,'YYYY-MM-DD').format('MMM DD,YYYY')}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {`${moment(item.period_to,'YYYY-MM-DD').format('MMM DD,YYYY')}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{display:'flex',gap:1}}>
                                                        <Tooltip title='Edit'><IconButton color='success' className="custom-iconbutton" onClick={()=>handleOpenUpdate(item)}><EditIcon/></IconButton></Tooltip>
                                                        <Tooltip title='Delete'><IconButton color='error' className="custom-iconbutton" onClick={()=>handleDelete(item)}><DeleteIcon/></IconButton></Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                        :
                                        null
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </Fade>
                    </Grid>
                    <SmallModal open = {openUpdate} close = {handleCloseUpdate} title='Updating Billing'>
                        <UpdateBilling mainData = {data} selectedUpdateData = {selectedUpdateData} setSelectedData = {setSelectedData}  loanType = {loanType} close = {handleCloseUpdate} type='main'/>
                    </SmallModal>
                    
                </Grid>

            </Paper>
            </Grid>
        </Grid>
    )
}