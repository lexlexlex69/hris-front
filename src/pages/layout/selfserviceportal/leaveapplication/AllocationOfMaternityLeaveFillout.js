import React,{useRef,useEffect,useState} from 'react'
import { useReactToPrint } from 'react-to-print';
import { Grid,Typography,TextField,FormControl,FormLabel,RadioGroup,FormControlLabel,Radio,Tooltip,Button, IconButton,Checkbox } from '@mui/material';
import moment from 'moment';
import Swal from 'sweetalert2';
import AllocationOfMaternityLeaveForm from './AllocationOfMaternityLeaveForm';
//icon
import PrintIcon from '@mui/icons-material/Print';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EditIcon from '@mui/icons-material/Edit';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { verifyMaternityBeneficiary } from './LeaveApplicationRequest';
import { toast } from 'react-toastify';
export default function AllocationOfMaternityLeaveFillout(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const printMaternityAllocationLeaveRef = useRef();
    
    
    /**
     * state for selected inclusive dates for maternity leave
     */
    const [allocationMaternityLeaveDays,setallocationMaternityLeaveDays] = React.useState(1)
    const [maternityRelationProofFile,setMaternityRelationProofFile] = React.useState('');
    const [maternityRelationshipProof,setmaternityRelationshipProof] = React.useState('');
    
    const [fname,setFname] = useState('');
    const [mname,setMname] = useState('');
    const [lname,setLname] = useState('');
    
    const handleMaternityRelationProofFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setMaternityRelationProofFile(fileReader.result)
            }
        }else{
            setMaternityRelationProofFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const handleAllocationMaternityLeave = (value) =>{
        if(value.target.value >7){
            setallocationMaternityLeaveDays(7)
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Maximum of 7 days only.'
            })
        }else if(value.target.value <1){
            setallocationMaternityLeaveDays(1)
        }else{
            setallocationMaternityLeaveDays(value.target.value)
        }
    }
    useEffect(()=>{
        setallocationMaternityLeaveDays(props.allocationInfo.allocated_days)
        setSameAgency(props.allocationInfo.same_agency)
        setFname(props.allocationInfo.fname)
        setMname(props.allocationInfo.mname)
        setLname(props.allocationInfo.lname)
        setSelectedEmpID(props.allocationInfo.emp_no)
    },[props.allocationInfo])
    const handleSave = () =>{
        var data = {
            same_agency:sameAgency,
            emp_no:selectedEmpID,
            allocated_days:allocationMaternityLeaveDays,
            fname:fname,
            mname:mname,
            lname:lname,
        }
        props.save(data)
        props.onClose();
    }
    
    const [lockInfo,setLockInfo] = useState(false);
    const [sameAgency,setSameAgency] = useState(true);
    const [selectedEmpID,setSelectedEmpID] = useState();

    const handleVerifyInfo = ()=>{
        console.log(fname.current)
        var data = {
            fname:fname,
            mname:mname,
            lname:lname,
        }
        verifyMaternityBeneficiary(data)
        .then(res=>{
            console.log(res.data)
            if(res.data.length === 0){
                toast.error('Employee not found !')
            }else{
                toast.success('Information Verified !')

                setLockInfo(true)
                setSelectedEmpID(res.data)
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleSetSameAgency = ()=>{
        setSameAgency(!sameAgency)
    }
    useEffect(()=>{
        if(sameAgency){
            setLockInfo(false)
        }else{
            setLockInfo(true)
        }
    },[sameAgency])
    return(
        <>
        <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography sx={{background:'#011f51',color:'#fff',padding:'10px'}}>I. FOR FEMALE EMPLOYEE</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ="No. of days to be allocated" variant="outlined" fullWidth type="number"
                InputProps={{ inputProps: { min: "1", max: "7"} }} value = {allocationMaternityLeaveDays} onChange = {handleAllocationMaternityLeave}/>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel control={<Checkbox checked={sameAgency} onChange={handleSetSameAgency} />} label="Same Agency" />
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{background:'#011f51',color:'#fff',padding:'10px'}}>CHILD'S FATHER/ALTERNATE CAREGIVER INFO</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField label='Firstname' fullWidth required value={fname} onChange = {(value)=>setFname(value.target.value)} disabled = {lockInfo}/>
            </Grid>
            <Grid item xs={12}>
                <TextField label='Middlename' fullWidth required value={mname} onChange = {(value)=>setMname(value.target.value)} disabled = {lockInfo}/>
            </Grid>
            <Grid item xs={12}>
                <TextField label='Lastname' fullWidth required value={lname} onChange = {(value)=>setLname(value.target.value)} disabled = {lockInfo}/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                {
                    lockInfo && sameAgency
                    ?
                    <Tooltip title='Change info'><IconButton color='success' className='custom-iconbutton' onClick={()=>setLockInfo(false)}><EditIcon/></IconButton></Tooltip>
                    :
                    null
                }
                &nbsp;
               <Tooltip title='Click to verify info'><IconButton color='primary' className='custom-iconbutton' onClick ={handleVerifyInfo} disabled = {lockInfo || fname.length === 0 || mname.length === 0 || lname.length === 0}><HowToRegIcon/></IconButton></Tooltip> 
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                <br/>
                <FormControl fullWidth>
                <FormLabel id="relationship-female-employee-proof" sx={{padding: '10px',background: '#1e50a5',color: '#fff'}}>PROOF OF RELATIONSHIP *</FormLabel>
                <RadioGroup
                    aria-labelledby="relationship-female-employee-proof"
                    name="relationship-female-employee-proof"
                    value={maternityRelationshipProof}
                    onChange={(value)=>setmaternityRelationshipProof(value.target.value)}
                >
                    <FormControlLabel value="Childs Birth Certificate" control={<Radio />} label="Child's Birth Certificate" />
                    <FormControlLabel value="Marriage Certificate" control={<Radio />} label="Marriage Certificate" />
                    <FormControlLabel value="Barangay Certificate" control={<Radio />} label="Barangay Certificate" />
                    <FormControlLabel value="Other bona fide document/s that can prove filial relationship" control={<Radio />} label="Other bona fide document/s that can prove filial relationship" />
                </RadioGroup>
                </FormControl>
                <br/>
                <br/>
                <Tooltip title={'Please upload '+maternityRelationshipProof+' PDF/Image file'} placement='top'>
                <TextField type = "file" label="Proof of relationship *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleMaternityRelationProofFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} disabled={maternityRelationshipProof.length !== 0 ?false:true}/>
                </Tooltip>
            </Grid> */}
            <Grid item xs={12} sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-end'}}>
                    <Button variant = "contained" color='success' onClick={handleSave} disabled = {
                        allocationMaternityLeaveDays.length !==0
                        ?
                            sameAgency
                            ?
                                lockInfo
                                ?
                                false
                                :
                                true
                            :
                            false
                        :
                        true
                    } sx={{width:matches?'100%':'auto'}}>Save</Button>
                    &nbsp;
                    <Button variant = "contained" color='error' onClick = {props.onClose} sx={{width:matches?'100%':'auto'}}>Cancel</Button>
            </Grid>
            </>
    )
}