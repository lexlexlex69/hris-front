import React,{useEffect, useRef, useState} from 'react'
import {Paper,TableContainer,Table,TableHead,TableRow,TableBody,TablePagination,Box,TextField,InputAdornment,Tooltip,IconButton,Typography,TableFooter,Modal,Button, Grid,RadioGroup,FormControlLabel,Radio,Checkbox } from '@mui/material'

import moment from 'moment';
import { searchValueFunction } from '../../searchtable/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors';

//Icons
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import ReactToPrint,{useReactToPrint} from 'react-to-print';

import { viewFileAPI } from '../../../../viewfile/ViewFileRequest';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LetterHead from '../../forms/letterhead/LetterHead';
import NominationForm from '../../forms/nominationform/NominationForm';
import PrintNominationModal from '../Modal/PrintNominationModal';
import { el } from 'date-fns/locale';
import SmallModal from '../../custommodal/SmallModal';
import RequestReplacement from '../Modal/RequestReplacement';
import Swal from 'sweetalert2';
export default function ApprovedDatatable(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?12:15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?10:13,
        },
    }));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 816,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:'5px',
        pt: 2,
        px: 4,
        pb: 3,
    };
    const preferenceStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:'5px',
        pt: 2,
        px: 2,
        pb: 3,
    };
    const [openPreviewPrint, setOpenPreviewPrint] = React.useState(false);
    const handleOpenPrint = () => {
        setOpenPreviewPrint(true);
    };
    const handleClosePrint = () => {
        setOpenPreviewPrint(false);
        localStorage.removeItem('notify_nomination_form')

    };
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [data,setData] = useState([]);
    const [tempData,setTempData] = useState([]);
    useEffect(()=>{
        console.log(props.data)
        let temp = props.data
        temp.forEach(el=>{
            el.preferences = 3;
        })
        setData(props.data)
        setTempData(props.data)
    },[props.data])
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setPage(0)
        setSearchValue(value.target.value)
        var item = ['fname','lname']
        var temp = searchValueFunction(props.data,item,value.target.value);
        setData(temp)
    }
    const handleClearSearch = () =>{
        setSearchValue('')
        setData(props.data)
    }
    const viewFile = (id,name)=>{
        viewFileAPI(id,name)
    }
    const printNominationRef = useRef();
    const beforeNominationFormPrint = () => {
        if(!localStorage.getItem('notify_nomination_form')){
            Swal.fire({
                icon:'info',
                title:'Please print on a long bondpaper (8.5 x 13 in)',
                confirmButtonText:"Ok, I've got it",
                showCancelButton:true,
                cancelButtonText:'Cancel Print'
            }).then(res=>{
                if(res.isConfirmed){
                    localStorage.setItem('notify_nomination_form', true);
                    reactToPrintNominationForm()
                }
            })
        }else{
            reactToPrintNominationForm()
        }
    }
    const reactToPrintNominationForm  = useReactToPrint({
        content: () => printNominationRef.current,
        documentTitle:'Nomination Form'
    });
    const [openFoodPreference,setOpenFoodPreference] = useState(false)
    const handleChangePreference = (index,val)=>{
       
        let temp = [...tempData];
        temp[index].preferences = val.target.value;
        setTempData(temp)
    }
    const handleSavePreference = ()=>{
        // setData(tempData)
        setOpenFoodPreference(false)

    }
    const handleCancelPreference = () =>{
        setOpenFoodPreference(false)

    }
    const [openReplacementModal,setOpenReplacementModal] = useState(false);
    const closeReplacementModal = () => {
        setOpenReplacementModal(false)
    }
    const [selectedForReplacement,setSelectedForReplacement] = useState();
    const handleSelectReplacement = () =>{
        // setSelectedForReplacement(row.training_shortlist_id)
        setOpenReplacementModal(true)
    }
    const [selected,setSelected] = useState([]);
    const handleSelectForReplacement = (id) =>{
        var index = selected.indexOf(id)
        if(index === -1){
            /**
            Insert data
             */
            var temp = [...selected];
            temp.push(id)
            setSelected(temp)
        }else{
            var temp = [...selected];
            temp.splice(index,1);
            setSelected(temp)
        }
    }
    const handleUpdateFoodPref = () =>{
        if(selected.length>0){
            console.log(selected)
            var temp = tempData.filter(el=>{
                return selected.includes(el.training_shortlist_id)
            })
            console.log(temp)
            setTempData(temp)
            setOpenFoodPreference(true)
        }else{
            setTempData(props.data)
            setOpenFoodPreference(true)
        }
    }
    return(
        <>
        <TableContainer>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <TextField label='Search Table' sx={{m:1}} value = {searchValue} onChange={handleSearch} placeholder='Firstname, Lastname' InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
          }}/>
          <Box sx={{display:'flex',alignItems:'center',gap:1}}>
          {
            props.selectedTraining
            ?
                moment(props.selectedTraining.training_details[0].nom_approval_deadline).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD') || props.selectedTraining.training_details[0].approved
                ?
                null
                :
                <Tooltip title='Update Approved Trainee'><span><IconButton sx={{float:'right'}} onClick ={props.handleUpdateTrainee}  className='custom-iconbutton'><EditOutlinedIcon color='success'/></IconButton></span></Tooltip>
            
            :
            null
          }
          {
            props.selectedTraining.training_details[0].file_id
            ?
            <Tooltip title='View submitted memo'><IconButton className='custom-iconbutton' color='secondary' onClick={()=>viewFile(props.selectedTraining.training_details[0].file_id,'Response memo')}><AttachmentIcon/></IconButton></Tooltip>
            :
            null
          }
          <Tooltip title='Replace trainee'><IconButton color='info' className='custom-iconbutton' sx={{background:'#fff','&:hover':{color:'#fff',background:blue[600]}}} onClick={handleSelectReplacement} disabled={selected.length>0?false:true}><SwapHorizIcon/></IconButton></Tooltip>

          <Tooltip title = 'Print Nomination Form'><IconButton color='primary' className='custom-iconbutton' onClick={handleOpenPrint}><PrintIcon/></IconButton></Tooltip>
          </Box>

          
            </Box>
            <Table>
            <TableHead>
                <TableRow>
                    <StyledTableCell>
                        Name
                    </StyledTableCell>
                    <StyledTableCell>
                        Position
                    </StyledTableCell>
                    <StyledTableCell>
                        Employment Status
                    </StyledTableCell>
                    <StyledTableCell>
                        Approval Status
                    </StyledTableCell>
                    <StyledTableCell>
                        Evaluation Rate
                    </StyledTableCell>
                    <StyledTableCell>
                        HRDC Remarks
                    </StyledTableCell>
                    <StyledTableCell>
                        Select
                    </StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
                    <TableRow key={key} sx={{background:data.hrdc_approved?green[200]:data.approved?green[800]:'auto'}}>
                        <StyledTableCell>
                            {data.lname}, {data.fname}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.position_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.description}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.approval_status}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.rate}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.hrdc_remarks}
                        </StyledTableCell>
                        <StyledTableCell>
                            <Checkbox checked={selected.includes(data.training_shortlist_id)} onChange = {()=>handleSelectForReplacement(data.training_shortlist_id)} disabled={!data.hrdc_remarks?true:props.replaceData.includes(data.training_shortlist_id)?true:data.hrdc_remarks === 'UNSELECTED' ? true:selected.includes(data.training_shortlist_id) || selected.length < props.unapprovedReservedTrainee.length ? false:true}/>
                        </StyledTableCell>
                    </TableRow>
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={6}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableCell>
                </TableRow>
            </TableFooter>
            </Table>
        </TableContainer>
        <SmallModal open = {openReplacementModal} close = {closeReplacementModal} title='Trainee replacement'>
                <RequestReplacement data = {props.selectedTraining} selectedForReplacement={selectedForReplacement} selected = {selected} close = {closeReplacementModal}/>
        </SmallModal>
        <Modal
            open={openPreviewPrint}
            onClose={handleClosePrint}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{...style,maxHeight:'80vh',overflowY:'scroll'}}>
                <Box sx={{position:'sticky',top:0,background:'#fff',zIndex:100,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'baseline',mb:1}}>
                    <Box>
                    <h4 id="child-modal-title">Preview Nomination Form</h4>
                    <Box sx={{display:'flex',gap:1}}>
                        <Button onClick={beforeNominationFormPrint} variant='contained' color = 'primary' startIcon={<PrintIcon/>}>Print</Button>
                        <Button variant='contained' color='info' startIcon={<FastfoodIcon/>} onClick={handleUpdateFoodPref}>
                            Update food preference
                        </Button>
                        </Box>
                    </Box>
                    
                    <IconButton onClick={handleClosePrint} color='error'><CloseIcon/></IconButton>
                    
                </Box>
                <PrintNominationModal ref = {printNominationRef} data = {data} selectedTraining = {props.selectedTraining} deptHead={props.deptHead} selected ={selected}/>
            </Box>
        </Modal>
        <Modal
            open={openFoodPreference}
            onClose={()=>setOpenFoodPreference(false)}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{...preferenceStyle}}>
                <Typography>Updating food preference</Typography>
                <TableContainer sx={{maxHeight:'70vh',overflowY:'scroll'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Preference
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                             {
                                tempData.map((item,key)=>
                                   <TableRow key={key}>
                                        <TableCell>{item.fname}</TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                aria-labelledby={`preferences-${item.key}`}
                                                name={`preferences-${item.key}`}
                                                value = {item.preferences}
                                                onChange={(val)=>handleChangePreference(key,val)}
                                                
                                            >
                                                <FormControlLabel value={1} control={<Radio size="small"/>} label="NON-PORK/CHICKEN"/>
                                                <FormControlLabel value={2} control={<Radio size="small"/>} label="VEGAN DIET" />
                                                <FormControlLabel value={3} control={<Radio size="small"/>} label="PORK/CHICKEN" />
                                            </RadioGroup>
                                        </TableCell>
                                   </TableRow> 
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
               <Box sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                <Button variant='contained' color='success' className='custom-roundbutton' size='small' onClick = {handleSavePreference}>Save</Button>
                <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCancelPreference}>Cancel</Button>
               </Box>
            </Box>
        </Modal>

        </>
    )
}