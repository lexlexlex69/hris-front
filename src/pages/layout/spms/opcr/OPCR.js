import React,{useState,useEffect} from "react";
import { Box,Button,ButtonGroup,Divider,Fade,Grid,IconButton,List,Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { checkPermission } from "../../permissionrequest/permissionRequest";
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from "../../loader/DashboardLoading";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import LargeModal from "../../custommodal/LargeModal";
import { Header } from "./Modals/Header";
import { toast } from "react-toastify";
import { getHeader, getOPCR, lookUpAPCR } from "./OPCRRequest";
import './OPCR.css';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue, grey, orange, red, yellow } from "@mui/material/colors";
//Icons
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { LookUpAPCR } from "./Modals/LookUpAPCR";
import SmallModal from "../../custommodal/SmallModal";
import moment from "moment";
import { StrategicPriority } from "./Table/StrategicPriority";
import { Details } from "./Table/Details";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[500],
    color: theme.palette.common.white,
    fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    },
}));
const cellTheme = createTheme({
  typography: {
    fontSize: 11,
  },
});
export const OPCR = ()=>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    useEffect(async ()=>{
        try{
            const res = await checkPermission(72)
            if(res.data){
                const opcr = await getOPCR();
                console.log(opcr.data.data)
                setData(opcr.data.data)
                setIsLoading(false)

                let c_y = parseInt(moment().format('YYYY'));
                let y = [];
                let i = 0;
                for(i;i<3;i++){
                    y.push(c_y);
                    c_y--;
                }
                setYear(y)

            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }catch(err){
            console.log(err)
        }
        
    },[])
    const [openMandate,setOpenMandate] = useState(false)
    const [headerData,setHeaderData] = useState({
        mandate:'',
        vision:'',
        mission:'',
        org_outcome:''
    })
    const handleOpenMandate = async () =>{
        const res = await toast.promise(getHeader(),
            {
                pending: 'Loading Header',
                success: 'Successfully loaded',
                error: 'Failed to load Header'
            }
        )
        if(res.data){
            setHeaderData(res.data)
        }
        setOpenMandate(true)
    }
    const handleCloseMandate = () =>{
        setOpenMandate(false)
    }
    const [openLookUpAPCR,setOpenLookUpAPCR] = useState(false)
    const [lookUpAPCRData,setLookUpAPCRData] = useState([])
    const [strategicPriorityData,setStrategicPriorityData] = useState([])
    const [coreFunctionsData,setCoreFunctionsData] = useState([])
    const [year,setYear] = useState([])
    const [filterYear,setFilterYear] = useState(parseInt(moment().format('YYYY')))
    const handleCloseLookUpAPCR = () => {
        setOpenLookUpAPCR(false)
    }
    const handleLookUpAPCR = async () => {
        const id = toast.loading('Loading APCR')
        try{
            const res = await lookUpAPCR();
            if(res.data.data.length>0){
                setLookUpAPCRData(res.data.data)
                toast.update(id,{
                    render:'Successfully loaded',
                    type:'success',
                    isLoading:false,
                    autoClose:true
                })
                setOpenLookUpAPCR(true)

            }else{
                toast.update(id,{
                    render:'No available APCR for your office as of the moment',
                    type:'error',
                    isLoading:false,
                    autoClose:true
                })
            }
        }catch(err){
            toast.update(id,{
                render:err.message,
                type:'error',
                isLoading:false,
                autoClose:true
            })
        }
    }
    const formatType = (row,type)=>{
        let data = JSON.parse(row.details).filter(el=>el.type===type);
        console.log(data);
    }
    const [openAddType,setOpenAddType] = useState(false)
    const [type,setType] = useState('');
    const [text,setText] = useState('')
    const handleAddNew = (type) => {
        setType(type)
        setOpenAddType(true)
        
    }
    const handleCloseAddType = () =>{
        setOpenAddType(false)
        setText('')
    }
    const handleAddNewType = (e) =>{
        e.preventDefault();
        if(text){
            let temp;
            switch(type){
                case 1:
                    temp = [...strategicPriorityData];
                    temp.push({
                        mfo:text,
                        details:[]
                    })
                    setStrategicPriorityData(temp)
                    handleCloseAddType()
                    break;
                case 2:
                    temp = [...coreFunctionsData];
                    temp.push({
                        mfo:text,
                        details:[]
                    })
                    setCoreFunctionsData(temp)
                    handleCloseAddType()
                    break;

            }
        }else{
            toast.warning('Please input a value')
        }
    }
    const formatTextType = (type)=>{
        switch(type){
            case 1:
                return 'Strategic Priority';
                break;
            case 2:
                return 'Core Function';
                break;
            case 3:
                return 'Support Function';
                break;
        }
    }
    const handleAddNewDtl = (e) =>{
        e.preventDefault()
        if(text){
            let temp;
            switch(type){
                case 1:
                    temp = [...strategicPriorityData];
                    temp[addTypeDtlIndex].details.push({
                        details_title:text,
                        // details_sort:temp.length+1
                    })
                    setStrategicPriorityData(temp)
                    handleCloseAddTypeDtl()
                    break;
                case 2:
                    temp = [...coreFunctionsData];
                    temp[addTypeDtlIndex].details.push({
                        details_title:text,
                        // details_sort:temp.length+1
                    })
                    setCoreFunctionsData(temp)
                    handleCloseAddTypeDtl()
                    break;
            }
            
        }else{
            toast.warning('Please input a value')
        }
        
    }
    const [openAddTypeDtl,setOpenAddTypeDtl] = useState(false);
    const [addTypeDtlIndex,setAddTypeDtlIndex] = useState('');
    const handleOpenAddTypeDtl = (index,t)=>{
        setType(t)
        setAddTypeDtlIndex(index)
        setOpenAddTypeDtl(true)
    }
    const handleCloseAddTypeDtl = () =>{
        setText('')
        setAddTypeDtlIndex('')
        setOpenAddTypeDtl(false)
    }
    const handleRemoveType = (index,t) =>{
        let temp;
        switch(t){
            case 1:
                temp = [...strategicPriorityData];
                temp.splice(index,1)
                setStrategicPriorityData(temp)
                break;
            case 2:
                temp = [...coreFunctionsData];
                temp.splice(index,1)
                setCoreFunctionsData(temp)
                break;
        }
        
    }
    const handleRemoveTypeDtl = (index,index2,t) =>{
        let temp;
        let temp2;
        switch(t){
            case 1:
                temp = [...strategicPriorityData];

                temp2 = [...temp[index].details];
                temp2.splice(index2,1)
                temp[index].details = temp2;
                setStrategicPriorityData(temp)
                break;
            case 2:
                temp = [...coreFunctionsData];

                temp2 = [...temp[index].details];
                temp2.splice(index2,1)
                temp[index].details = temp2;
                setCoreFunctionsData(temp)
                break;
        }
        
    }

    

    const handleSetFilterYear = (e) => {
        setFilterYear(e.target.value)
    }
    const filterData = data.filter(el=>el.year===filterYear);

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    const handleMove = (type,index,index2,t)=>{
        const source  = index2;
        let destination;
        let result;
        if(type==='down'){
            destination = index2+1;
        }else{
            destination = index2-1;
        }
        switch(t){
            case 1:
                result = [...strategicPriorityData]
                var [removed] = result[index].details.splice(source, 1);
                result[index].details.splice(destination, 0, removed);

                setStrategicPriorityData(result)
                break;
            case 2:
                result = [...coreFunctionsData]
                var [removed] = result[index].details.splice(source, 1);
                result[index].details.splice(destination, 0, removed);

                setCoreFunctionsData(result)
                break;
        }
        
    }
    return (
        <Box sx={{margin:'0 10px'}} id='spms-opcr'>
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
                            <ModuleHeaderText title='OPCR'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Button variant="contained" color='primary' className="custom-roundbutton" onClick={handleOpenMandate}>Header</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color = 'info' startIcon={<FindInPageIcon/>} onClick={handleLookUpAPCR}>Lookup APCR</Button>
                        </Grid>
                        <Grid item xs={12} sx={{mt:1}}>
                            <FormControl sx={{width:200}}>
                                <InputLabel id="year-label">Filter Year</InputLabel>
                                <Select
                                labelId="year-label"
                                id="year-label"
                                value={filterYear}
                                label="Filter Year"
                                onChange={handleSetFilterYear}
                                >
                                {
                                    year.map((item,key)=>
                                        <MenuItem value={item} key={key}>{item}</MenuItem>
                                    )
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{mt:1}}>
                            {
                                filterData.map((data,key)=>
                                    <React.Fragment key={key}>
                                        <Typography sx={{color:grey[800],fontSize:'1.1rem'}}><strong>MFO Code:</strong> {data.mfo_code}</Typography>
                                        <Paper>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell colSpan={3}>
                                                                MFO/PAP
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                Success Indicators <br/>
                                                                (Tartgets+Measures)
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Alloted Budget
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                Timeline <br/>
                                                                (Per Quarter)
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                Divisions/Individual<br/>
                                                                Accountable
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                Actual Accomplishment
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <ThemeProvider theme={cellTheme}>
                                                    <TableBody>
                                                        <TableRow sx={{background:yellow[800]}}>
                                                            <StyledTableCell colSpan={8}>
                                                                <Box sx={{display:'flex',justifyContent:'row',gap:1,alignItems:'center'}}>
                                                                    <Typography sx={{fontWeight:'bold'}}>Strategic Priority </Typography>
                                                                    <Tooltip title='Adding new strategic priority'><IconButton sx={{color:'#fff'}} onClick={()=>handleAddNew(1)}><AddBoxIcon/></IconButton></Tooltip>
                                                                </Box>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                            <Details data = {strategicPriorityData} handleRemoveType = {handleRemoveType} handleOpenAddTypeDtl = {handleOpenAddTypeDtl} handleRemoveTypeDtl= {handleRemoveTypeDtl} handleMove={handleMove} t={1}/>

                                                        <TableRow sx={{background:yellow[800]}}>
                                                            <StyledTableCell colSpan={8}>
                                                                <Box sx={{display:'flex',justifyContent:'row',gap:1,alignItems:'center'}}>
                                                                    <Typography sx={{fontWeight:'bold'}}>Core Functions </Typography>
                                                                    <Tooltip title='Adding new core functions priority'><IconButton sx={{color:'#fff'}} onClick={()=>handleAddNew(2)}><AddBoxIcon/></IconButton></Tooltip>
                                                                </Box>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                            <Details data = {coreFunctionsData} handleRemoveType = {handleRemoveType} handleOpenAddTypeDtl = {handleOpenAddTypeDtl} handleRemoveTypeDtl= {handleRemoveTypeDtl} handleMove={handleMove} t={2}/>

                                                    </TableBody>
                                                    </ThemeProvider>

                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                    </React.Fragment>
                                )
                            }
                        </Grid>
                        <Grid item xs={12}>
                            
                        </Grid>
                        <SmallModal open = {openAddType} close = {()=>setOpenAddType(false)} title={`Adding new ${formatTextType(type)}`}>
                            <Box sx={{m:1}}>
                                <form onSubmit={handleAddNewType}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        {/* <TextField label ={`${formatTextType(type)}`} value={text} onChange={(val)=>setText(val.target.value)} fullWidth required/> */}
                                        <TextField label ='Title' value={text} onChange={(val)=>setText(val.target.value)} fullWidth required/>
                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                        <Button variant="contained" color='success' className="custom-roundbutton" type="submit">Save</Button>
                                    </Grid>
                                </Grid>
                                </form>
                            </Box>
                        </SmallModal>
                        <SmallModal open={openAddTypeDtl} close = {handleCloseAddTypeDtl} title='Adding new data'>
                            <Box sx={{m:1}}>
                                <form onSubmit={handleAddNewDtl}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <TextField label ='Title' value={text} onChange={(val)=>setText(val.target.value)} fullWidth required/>
                                        </Grid>
                                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                            <Button variant="contained" color='success' className="custom-roundbutton" type='submit'>Save</Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </SmallModal>
                        <LargeModal open={openMandate} close = {handleCloseMandate} title='Mandate, Vision, Mission and Organizational Outcome'>
                            <Header headerData = {headerData} setHeaderData={setHeaderData}/>
                        </LargeModal>
                        <LargeModal open={openLookUpAPCR} close = {handleCloseLookUpAPCR} title='APCR LookUp'>
                            <LookUpAPCR data = {lookUpAPCRData} setLookUpAPCRData = {setLookUpAPCRData}/>
                        </LargeModal>
                        
                    </Grid>
                </Fade>
            }
            
        </Box>
    )
}