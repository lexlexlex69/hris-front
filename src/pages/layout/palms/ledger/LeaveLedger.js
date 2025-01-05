import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect,useState } from "react";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {blue,red,green,orange} from '@mui/material/colors'
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";
import DashboardLoading from "../../loader/DashboardLoading";
import { getAllOffices, getEmpLedger, getRegCasEmpListPerOffices } from "./LeaveLedgerRequests";
import { EmpList } from "./components/EmpList";
import { DisplayEmpLedger } from "./components/DisplayEmpLedger";
import { APILoading } from "../../apiresponse/APIResponse";
import Swal from "sweetalert2";

export const LeaveLedger = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [officeData,setOfficeData] = useState([]);
    const [empList,setEmpList] = useState([])
    const [selectedEmp,setSelectedEmp] = useState()
    const [balance,setBalance] = useState({vl_bal:0,sl_bal:0})
    useEffect(()=>{
        checkPermission(84)
        .then((response)=>{
            if(response.data){
                _getOffices();
                setIsLoading(false)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
    },[])
    const _getOffices = async () => {
        const res = await getAllOffices()
        console.log(res.data)
        setOfficeData(res.data)
    }
    const [selectedDept,setSelectedDept] = useState(null)
    const [ledger,setLedger] = useState([])
    const handleSetDept = async (e,item) => {
        setSelectedDept(item)
        if(item){
            //fetch emp list based on dept code
            const res = await getRegCasEmpListPerOffices({dept_code:item.dept_code})
            console.log(res.data)
            setEmpList(res.data)
        }else{
            setEmpList([])
        }
    }
    const handleSelectEmp = async (item) => {
        try{
            APILoading('info','Loading ledger data','Please wait...')
            const res = await getEmpLedger({emp_no:item.id_no,emp_id:item.id})
            setLedger(res.data.data)

            if(res.data.balance){
                setBalance(res.data.balance)
            }else{
                setBalance({vl_bal:0,sl_bal:0})
            }
            setSelectedEmp(item)
            Swal.close();
        }catch(err){
            console.log(err)
        }
        
    }
    return (
        <React.Fragment>
        {
                isLoading
                ?
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                <DashboardLoading actionButtons={1}/>
                </Box>
                :
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                    <Grid container spacing={1}>
                       <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-dept"
                                options={officeData}
                                value={selectedDept}
                                getOptionLabel={(option) => option.dept_title}
                                onChange={handleSetDept}
                                isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code}

                                renderInput={(params) => <TextField {...params} label="Office/Department" />}
                                size="small"
                            />
                       </Grid>
                       <Grid item xs={3}>
                            <EmpList empList = {empList} handleSelectEmp={handleSelectEmp}/>
                       </Grid>
                       <Grid item xs={9}>
                            <DisplayEmpLedger ledger = {ledger} setLedger = {setLedger} selectedEmp = {selectedEmp} balance={balance} setBalance = {setBalance} empList = {empList}/>
                       </Grid>
                    </Grid>
                </Box>
        }
        </React.Fragment>
    )
}