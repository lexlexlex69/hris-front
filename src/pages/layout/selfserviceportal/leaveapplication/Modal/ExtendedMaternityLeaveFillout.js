import React,{useRef,useEffect} from 'react'
import { useReactToPrint } from 'react-to-print';
import { Grid,Typography,TextField,FormControl,FormLabel,RadioGroup,FormControlLabel,Radio,Tooltip,Button } from '@mui/material';
import moment from 'moment';
import Swal from 'sweetalert2';
import AllocationOfMaternityLeaveForm from '../AllocationOfMaternityLeaveForm';

//icon
import PrintIcon from '@mui/icons-material/Print';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { addExtendedMaternityBeneficiaryInfo } from '../LeaveApplicationRequest';
export default function ExtendedMaternityLeaveFillout(props){
     // media query
     const theme = useTheme();
     const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const printMaternityAllocationLeaveRef = useRef();
    
    
    /**
     * state for selected inclusive dates for maternity leave
     */
    const [selectedInclusiveMaternityDates, setInclusiveMaternityDates] = React.useState('');
    const [selectedInclusiveMaternityDatesRange, setInclusiveMaternityDatesRange] = React.useState([]);

    const [appliedAllocationOfMaternityLeave,setappliedAllocationOfMaternityLeave] = React.useState(false)
    const [allocationMaternityLeaveDays,setallocationMaternityLeaveDays] = React.useState(1)
    const [maternityRelationProofFile,setMaternityRelationProofFile] = React.useState('');
    useEffect(()=>{
        console.log(props.employeeInfo)

        setallocationMaternityLeaveDays(props.employeeInfo.allocation_number_days)
        // setemployeeContactDetails(props.allocationInfo.employee_contact_details)
        // setallocatePersonFullname(props.allocationInfo.fullname)
        // setallocatePersonPosition(props.allocationInfo.position)
        // setallocatePersonHomeAddress(props.allocationInfo.home_address)
        // setallocatePersonContactDetails(props.allocationInfo.contact_details)
        // setallocatePersonAgencyAddress(props.allocationInfo.agency_address)
        // setmaternityRelationship(props.allocationInfo.relationship_to_employee)
        // setmaternityRelationshipDetails(props.allocationInfo.relationship_to_employee_details)
        // setmaternityRelationshipSpecifyDetails(props.allocationInfo.relationship_to_employee_details_specify)
        // setmaternityRelationshipProof(props.allocationInfo.relationship_to_employee_proof)
        // setMaternityRelationProofFile(props.allocationInfo.relationship_to_employee_proof_file)
        // setbenefitsignatureimage(props.allocationInfo.esignature)
    },[])
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
    const handleBenefitSignatureImage = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setbenefitsignatureimage(fileReader.result)
            }
        }else{
            setbenefitsignatureimage('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const [employeeContactDetails,setemployeeContactDetails] = React.useState('');
    const [allocatePersonFullname,setallocatePersonFullname] = React.useState('');
    const [allocatePersonPosition,setallocatePersonPosition] = React.useState('');
    const [allocatePersonHomeAddress,setallocatePersonHomeAddress] = React.useState('');
    const [allocatePersonAgencyAddress,setallocatePersonAgencyAddress] = React.useState('');
    const [allocatePersonContactDetails,setallocatePersonContactDetails] = React.useState('');
    const [maternityRelationship,setmaternityRelationship] = React.useState('');
    const [maternityRelationshipProof,setmaternityRelationshipProof] = React.useState('');
    const [maternityRelationshipDetails,setmaternityRelationshipDetails] = React.useState('');
    const [maternityRelationshipSpecifyDetails,setmaternityRelationshipSpecifyDetails] = React.useState('');
    const [benefitsignatureimage,setbenefitsignatureimage] = React.useState('');
    const [benefitsignature,setbenefitsignature] = React.useState('');
    const handleSetRelationshipFemaleEmployee = (value) =>{
        setmaternityRelationship(value.target.value)
    }
    const handleOnBlurBenefitFullname = () => {
        var benefit_sig = allocatePersonFullname.split(',');
        var temp;
        if(benefit_sig.length === 3){
            temp = benefit_sig[1].trim()+' '+benefit_sig[2].trim().charAt(0)+'. '+ benefit_sig[0].trim()
        }else if(benefit_sig.length === 4){
            temp = benefit_sig[1].trim()+' '+benefit_sig[3].trim().charAt(0)+'. '+ benefit_sig[0].trim()+' '+benefit_sig[2].trim()
        }else{
            Swal.fire({
                icon:'info',
                title:'Oops...',
                html:'Please follow the format of name.'
            })
        }
        setbenefitsignature(temp.toUpperCase())
    }
    const printAllocationMaternityLeave = useReactToPrint({
        content: () => printMaternityAllocationLeaveRef.current,
        documentTitle:'Notice of allocation of maternity leave - '+props.employeeInfo.lname
    });
    
    const handleSave = () =>{
        var data = {
            allocation_id:props.employeeInfo.allocation_id,
            // employee_contact_details:employeeContactDetails,
            // allocated_days:allocationMaternityLeaveDays,
            fullname:allocatePersonFullname,
            position:allocatePersonPosition,
            home_address:allocatePersonHomeAddress,
            contact_details:allocatePersonContactDetails,
            agency_address:allocatePersonAgencyAddress,
            relationship_to_employee:maternityRelationship,
            relationship_to_employee_details:maternityRelationship==="Childs father"?'':maternityRelationshipDetails,
            relationship_to_employee_details_specify:maternityRelationship==="Childs father"?'':maternityRelationshipSpecifyDetails,
            relationship_to_employee_proof:maternityRelationshipProof,
            relationship_to_employee_proof_file:maternityRelationProofFile,
            // esignature:benefitsignatureimage
        }
        console.log(data)
        addExtendedMaternityBeneficiaryInfo(data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                props.setData(res.data.data)
                props.close();
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            console.log(err)
        })
        // props.save(data)
        // props.onClose();
    }
    return(
        <>
        <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography sx={{background:'#011f51',color:'#fff',padding:'10px'}}>I. FOR FEMALE EMPLOYEE</Typography>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ="Contact Details (Phone number and e-mail address) *" variant="outlined" fullWidth value = {employeeContactDetails} onChange = {(value)=>setemployeeContactDetails(value.target.value)}/>
            </Grid> */}
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ="Name" variant="outlined" fullWidth
                defaultValue={props.employeeInfo.lname+', '+props.employeeInfo.fname} InputProps={{inputProps:{readOnly:true}}}/>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ="No. of days to be allocated" variant="outlined" fullWidth type="number"
                defaultValue={props.employeeInfo.allocation_number_days} InputProps={{inputProps:{readOnly:true}}}/>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <br/>
                <Typography sx={{background:'#011f51',color:'#fff',padding:'10px'}}>II. FOR CHILD'S FATHER/ALTERNATE CAREGIVER</Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Tooltip title="Please follow the format Last Name, First Name, Name Extension, Middle Name">
                {/* <TextField label = "NAME (Last Name, First Name, Name Extension, if any, and Middle Name *" value = {allocatePersonFullname} onChange = {(value)=>setallocatePersonFullname(value.target.value)} variant="outlined" fullWidth placeholder='e.g. De la Cruz, Juan, Jr., Lopez' onBlur={handleOnBlurBenefitFullname}/> */}
                <TextField label = "NAME (Last Name, First Name, Name Extension, if any, and Middle Name *" value = {allocatePersonFullname} onChange = {(value)=>setallocatePersonFullname(value.target.value)} variant="outlined" fullWidth placeholder='e.g. De la Cruz, Juan, Jr., Lopez'/>
                </Tooltip>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                {benefitsignatureimage
                ?
                <>
                <img src={benefitsignatureimage} height ={50} width={50}/>
                </>
                :
                ''
                }
                
                <Tooltip title={'Please upload e-signature image file'} placement='top'>
                <TextField type = "file" label="Child'S Father/Alternate Caregiver e-signature *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleBenefitSignatureImage} InputProps={{ inputProps: { accept:'image/*'} }}/>
                </Tooltip>
            </Grid> */}
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ='POSITION *' value = {allocatePersonPosition} onChange = {(value)=>setallocatePersonPosition(value.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ='HOME ADDRESS *' value = {allocatePersonHomeAddress} onChange = {(value)=>setallocatePersonHomeAddress(value.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ='CONTACT DETAILS (Phone number and e-mail address) *' value = {allocatePersonContactDetails} onChange = {(value)=>setallocatePersonContactDetails(value.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ='AGENCY / EMPLOYER and ADDRESS *' value = {allocatePersonAgencyAddress} onChange = {(value)=>setallocatePersonAgencyAddress(value.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <br/>
                <FormControl fullWidth>
                <FormLabel id="relationship-female-employee" sx={{padding: '10px',background: '#1e50a5',color: '#fff'}}>RELATIONSHIP TO THE FEMALE EMPLOYEE *</FormLabel>
                <RadioGroup
                    aria-labelledby="relationship-female-employee"
                    name="relationship-female-employee"
                    value={maternityRelationship}
                    onChange={handleSetRelationshipFemaleEmployee}
                >
                    <FormControlLabel value="Childs father" control={<Radio />} label="Child's father" />
                    <FormControlLabel value="Alternate caregiver" control={<Radio />} label="Alternate caregiver" />
                    {maternityRelationship === "Alternate caregiver"
                    ?
                    <RadioGroup
                        aria-labelledby="relationship-female-employee-details"
                        name="relationship-female-employee-details"
                        sx={{marginLeft:'28px'}}
                        value = {maternityRelationshipDetails}
                        onChange = {(value)=>setmaternityRelationshipDetails(value.target.value)}
                    >
                    <FormControlLabel value="Relative within fourth degree of consanguinity" control={<Radio />} label="Relative within fourth degree of consanguinity" />
                    <TextField variant='filled' label='Specify' disabled = {maternityRelationshipDetails === "Relative within fourth degree of consanguinity" ? false:true} value = {maternityRelationshipSpecifyDetails} onChange={(value)=>setmaternityRelationshipSpecifyDetails(value.target.value)} fullWidth/>
                    <FormControlLabel value="Current partner sharing the same household" control={<Radio />} label="Current partner sharing the same household" />
                    </RadioGroup>
                    :
                    ''}
                    
                </RadioGroup>
                </FormControl>
                
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
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
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                {/* <Button variant = 'outlined' fullWidth startIcon={<PrintIcon/>} onClick = {printAllocationMaternityLeave}disabled = {
                        allocatePersonFullname.length ===0 ||
                        allocatePersonPosition.length ===0 ||
                        allocatePersonHomeAddress.length ===0 ||
                        allocatePersonContactDetails.length ===0 ||
                        allocatePersonAgencyAddress.length ===0 ||
                        maternityRelationship.length ===0 ||
                        maternityRelationshipProof.length ===0
                        ?
                        true
                        :
                        false
                    }> PRINT</Button> */}
                {/* <ReactToPrint
                    trigger={() => <Button fullWidth variant='outlined' >PRINT</Button>}
                    content={() => printMaternityAllocationLeaveRef.current}
                    documentTitle={'Notice of Allocation of Maternity Leave'+employeeInfo.lname}
                /> */}
            </Grid>
            <Grid item xs={12} sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-end'}}>
                    <Button variant = "contained" color='success' onClick={handleSave} disabled = {
                        allocatePersonFullname.length ===0 ||
                        allocatePersonPosition.length ===0 ||
                        allocatePersonHomeAddress.length ===0 ||
                        allocatePersonContactDetails.length ===0 ||
                        allocatePersonAgencyAddress.length ===0 ||
                        maternityRelationship.length ===0 ||
                        maternityRelationshipProof.length ===0 ||
                        maternityRelationProofFile.length ===0
                        ?
                        true
                        :
                        false
                    } sx={{width:matches?'100%':'auto'}}>Save</Button>
                    &nbsp;
                    <Button variant = "contained" color='error' onClick = {props.onClose} sx={{width:matches?'100%':'auto'}}>Cancel</Button>
            </Grid>
            <div style={{display:'none'}}>
                <AllocationOfMaternityLeaveForm ref={printMaternityAllocationLeaveRef} info = {props.employeeInfo} employeeContactDetails = {employeeContactDetails}
                maternityRelationship = {maternityRelationship} maternityRelationshipDetails={maternityRelationshipDetails} maternityRelationshipSpecifyDetails = {maternityRelationshipSpecifyDetails} maternityRelationshipProof = {maternityRelationshipProof} allocate_days ={allocationMaternityLeaveDays} allocatePersonFullname = {allocatePersonFullname} allocatePersonPosition = {allocatePersonPosition} allocatePersonHomeAddress = {allocatePersonHomeAddress} allocatePersonAgencyAddress = {allocatePersonAgencyAddress} allocatePersonContactDetails = {allocatePersonContactDetails} benefitsignature = {benefitsignature} benefitsignatureimage = {benefitsignatureimage}/>
            </div>
            </>
    )
}