import React,{useState,useEffect} from 'react';
import {Box,Grid,Fade,Autocomplete,TextField,CircularProgress,Typography,Backdrop,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TableFooter,Paper,IconButton,Tooltip,Checkbox,Modal,InputLabel,FormControl,Select,MenuItem } from '@mui/material';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../permissionrequest/permissionRequest';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
import DashboardLoading from '../loader/DashboardLoading';
import { getAllOffices, getEmpList } from './EmployeePaySlipRequest';

//icons
import PrintIcon from '@mui/icons-material/Print';
export default function EmployeePaySlip(){
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [fetchLoading,setFetchLoading] = useState(false)
    const [data2,setData2] = useState([]);
    const [data1,setData1] = useState([]);
    const [data,setData] = useState([]);
    const [officeData,setOfficeData] = useState([]);
    const [selectedOffice,setSelectedOffice] = useState(null);
    const [empStatus,setEmpStatus] = useState(['Regular','Casual','Contractual']);
    const [selectedEmpStatus,setSelectedEmpStatus] = useState('');

    useEffect(()=>{
        console.log('here')
        checkPermission(50)
        .then((response)=>{
            setIsLoading(false)
            if(response.data){
                getAllOffices()
                .then(res=>{
                    console.log(res.data)
                    setOfficeData(res.data)
                }).catch(err=>{
                    console.log(err)
                })
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const handleSelectOffice = async(data)=>{
        console.log(data)
        setSelectedOffice(data)
        if(data){
            console.log(data)
            var t_data = {
                dept_code:data.dept_code
            }
            getEmpList(t_data)
            .then(res=>{
                console.log(res.data)
                setData(res.data)
                setData1(res.data)
                setData2(res.data)
                setSelectedEmpStatus('')
                setSearchVal('')
            }).catch(err=>{
                console.log(err)
            })
        }else{
            setData([])
            setData1([])
            setData2([])
            setSearchVal('')
            setSearchVal('')

        }
        
    }
    const [searchVal,setSearchVal] = useState('');
    const handleChangeSearch = (val)=>{
        setSearchVal(val.target.value)
        if(val.target.value === ''){
            setData(data1);
        }else{
            var new_arr = data1.filter((el)=>{
                return el.emp_fname.includes(val.target.value.toUpperCase()) ||  el.emp_lname.includes(val.target.value.toUpperCase())
            })
            setData(new_arr)
        }
    }
    const handleSelectEmpStatus = (val)=>{
        setSelectedEmpStatus(val.target.value)
        setSearchVal('');

        if(val.target.value === ''){
            setData(data1);
        }else{
            var t_emp_status;
            if(val.target.value === 'Regular'){
                t_emp_status = 'RE';
                var new_arr = data2.filter((el)=>{
                    return el.emp_status.includes(t_emp_status);
                })
                setData(new_arr);
                setData1(new_arr);

            }else if(val.target.value === 'Casual'){
                t_emp_status = 'CS';
                var new_arr = data2.filter((el)=>{
                    return el.emp_status.includes(t_emp_status);
                })
                setData(new_arr);
                setData1(new_arr);
            }else{
                t_emp_status = 'ELSE';
                var new_arr = data2.filter((el)=>{
                    return !el.emp_status.includes('RE') && !el.emp_status.includes('CS');
                })
                setData(new_arr);
                setData1(new_arr);
            }
            
        }
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading/>
                :
                <Fade in>
                    <Grid container>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={fetchLoading}
                            // onClick={loadingFilter}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <Typography>Loading data</Typography>
                                <CircularProgress color="inherit" />

                            </Box>
                        </Backdrop>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Employee Payslip'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                            <Autocomplete
                                disablePortal
                                id="offices-box"
                                options={officeData}
                                getOptionLabel={(option) => option.dept_title}
                                sx={{width:300}}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={selectedOffice}
                                onChange={(event, newValue) => {
                                    handleSelectOffice(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Office Name *"/>
                                )}
                            />
                        </Grid>
                        {
                            data1.length !==0
                            ?
                            <Grid xs={12} sx={{display:'flex',justifyContent:'space-between',mt:1}}>
                                <TextField label = 'Search' value = {searchVal} onChange = {handleChangeSearch}/>

                                <FormControl sx={{width:200}}>
                                    <InputLabel id="empstatus-select-label">Emp Status</InputLabel>
                                    <Select
                                    labelId="empstatus-select-label"
                                    id="empstatus-select-label"
                                    value={selectedEmpStatus}
                                    label="Emp Status"
                                    onChange={handleSelectEmpStatus}
                                    >
                                    {
                                        empStatus.map((row,key)=>
                                        <MenuItem value={row}>{row}</MenuItem>

                                        )
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>
                            :
                            null
                        }
                        
                        <Grid xs={12}>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Name
                                            </TableCell>
                                            <TableCell>
                                                Select
                                            </TableCell>
                                            <TableCell>
                                                
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        data.length !==0
                                        ?
                                        data.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <TableCell>
                                                        {row.emp_lname}, {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+'.':''}
                                                </TableCell>
                                                <TableCell>
                                                    <PrintIcon/>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip><PrintIcon/></Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                        :
                                        <TableRow>
                                                <TableCell>
                                                        No data
                                                </TableCell>

                                            </TableRow>
                                    }
                                    </TableBody>

                                </Table>
                            </TableContainer>
                            <Typography>Total result: {data.length}</Typography>
                        </Grid>
                    </Grid>
                </Fade>
    }
    </Box>
    )
}