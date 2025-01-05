import React,{useRef,useEffect,useState} from 'react'
import { useReactToPrint } from 'react-to-print';
import { Grid,Typography,TextField,FormControl,FormLabel,RadioGroup,FormControlLabel,Radio,Tooltip,Button,Box, IconButton,Modal,InputAdornment } from '@mui/material';
import moment from 'moment';
import Swal from 'sweetalert2';
// import AllocationOfMaternityLeaveForm from './AllocationOfMaternityLeaveForm';

//icon
import PrintIcon from '@mui/icons-material/Print';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { addFromOutsiderMaternityAllocation, searchEmployee } from '../LeaveApplicationRequest';
export default function EarnMaternityCreditsOutsideBenefactorDialog(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const searchModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    
    /**
     * state for selected inclusive dates for maternity leave
     */
    const [selectedInclusiveMaternityDates, setInclusiveMaternityDates] = React.useState('');
    const [selectedInclusiveMaternityDatesRange, setInclusiveMaternityDatesRange] = React.useState([]);

    const [appliedAllocationOfMaternityLeave,setappliedAllocationOfMaternityLeave] = React.useState(false)
    const [allocationMaternityLeaveDays,setallocationMaternityLeaveDays] = React.useState(1)
    const [maternityRelationProofFile,setMaternityRelationProofFile] = React.useState('');
    const [maternityStartDate,setMaternityStartDate] = useState('');
    const [maternityEndDate,setMaternityEndDate] = useState('');
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
    const [employeeInfo,setEmployeeInfo] = useState({
        fname:'',
        mname:'',
        lname:'',
        extname:'',
        position:'',
        contact_details:'',
        home_address:'',
        agency_and_address:'',
    })
    const [beneficiaryInfo,setBeneficiaryInfo] = useState({
        emp_no:'',
        fname:'',
        mname:'',
        lname:'',
        extname:'',
        position:'',
        contact_details:'',
        home_address:'',
        agency_and_address:'LGU Butuan, J. Rosales Ave. Doongan, Butuan City',
    })
    const [searchModal, setSearchModal] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [resultData, setResultData] = useState([]);

    const handleSetRelationshipFemaleEmployee = (value) =>{
        setmaternityRelationship(value.target.value)
    }
   
    const handleAllocationMaternityLeave = (value) =>{
        if(value.target.value <1){
            setallocationMaternityLeaveDays(1)
        }else{
            setallocationMaternityLeaveDays(value.target.value)
        }
    }
    
    const handleSave = async (event) =>{
        event.preventDefault();
        var data = {
            employee_info:employeeInfo,
            maternity_start_date:maternityStartDate,
            maternity_end_date:maternityEndDate,
            allocated_days:allocationMaternityLeaveDays,
            beneficiary_info:beneficiaryInfo,
            relationship_to_employee:maternityRelationship,
            relationship_to_employee_details:maternityRelationshipDetails,
            relationship_to_employee_details_specify:maternityRelationshipSpecifyDetails,
            relationship_to_employee_proof:maternityRelationshipProof,
            relationship_to_employee_proof_file:maternityRelationProofFile,
        }
        console.log(data)
        await addFromOutsiderMaternityAllocation(data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.close()
                props.setOutsiderData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleSetBenefactorInfo = (data)=>{
        var temp = {...employeeInfo};
        temp[data.target.id] = data.target.value
        setEmployeeInfo(temp)
    }
    const handleSetBeneficiaryInfo = (data)=>{
        var temp = {...beneficiaryInfo};
        temp[data.target.id] = data.target.value
        setBeneficiaryInfo(temp)
    }
    const submitSearch = (event)=>{
        event.preventDefault();
        searchEmployee(searchData)
        .then(respo=>{
            const data = respo.data
            setResultData(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const selectRow = (data) =>{
        console.log(data)
        var temp = {...beneficiaryInfo};
        temp.emp_no = data.id;
        temp.fname = data.fname;
        temp.mname = data.mname;
        temp.lname = data.lname;
        temp.extname = data.extname;
        temp.position = data.position_name;
        temp.contact_details = data.cpno +' '+data.emailadd;
        temp.home_address = data.paddress;
        setBeneficiaryInfo(temp)

        // setEmpid(data.id)
        setSearchModal(false)
    }
    const handleMaternityStartDate = (val)=>{
        setMaternityStartDate(val.target.value);
        console.log(val.target.value);
        var end_date = moment(val.target.value).add(104, 'days').calendar();
        console.log(moment(end_date).format('YYYY-MM-DD'))
        setMaternityEndDate(moment(end_date).format('YYYY-MM-DD'))
    }
    return(
        <>
        <form onSubmit={handleSave}>
        <Grid container sx={{pt:2,pb:2,pl:matches?2:10,pr:matches?2:10}} spacing={1}>
            <Grid item xs={6} sx={{mb:1}}>
                <TextField type='date' label='Maternity start date' fullWidth InputLabelProps={{shrink:true}} value ={maternityStartDate} onChange={handleMaternityStartDate} required/>
            </Grid>
            <Grid item xs={6} sx={{mb:1}}>
                <TextField type='date' label='Maternity end date (auto generated)' fullWidth InputLabelProps={{shrink:true}}inputProps={{readOnly:true}} value ={maternityEndDate} onChange={(value)=>setMaternityEndDate(value.target.value)}/>
            </Grid>
            <Grid item xs={12} sx={{mb:1}}>
                <Typography sx={{background:'#011f51',color:'#fff',padding:'10px'}}>I. FOR FEMALE EMPLOYEE</Typography>
            </Grid>
            <Grid item xs={12} sx={{mb:1}}>
                <Grid item container spacing={1} >
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='First Name' fullWidth id ='fname' value = {employeeInfo.fname} onChange = {handleSetBenefactorInfo} required/>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='Middle Name' fullWidth id ='mname' value = {employeeInfo.mname} onChange = {handleSetBenefactorInfo}/>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='Last Name' fullWidth id ='lname' value = {employeeInfo.lname} onChange = {handleSetBenefactorInfo} required/>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='Extension Name' fullWidth id ='extname' value = {employeeInfo.extname} onChange = {handleSetBenefactorInfo}/>
                    </Grid>
                </Grid>

            </Grid>
            <Grid item xs={12} sx={{mb:1}}>
                <Grid item container spacing={1} >
                    <Grid item xs={6}>
                        <TextField label='Position' fullWidth id ='position' value = {employeeInfo.position} onChange = {handleSetBenefactorInfo} required/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label='Contact Details (Phone number and e-mail address)' fullWidth id ='contact_details' value = {employeeInfo.contact_details} onChange = {handleSetBenefactorInfo} required/>
                    </Grid>
                   
                </Grid>

            </Grid>

            <Grid item xs={12} sx={{mb:1}}>
                <Grid item container spacing={1} >
                    <Grid item xs={6}>
                        <TextField label='Home Address' fullWidth id ='home_address' value = {employeeInfo.home_address} onChange = {handleSetBenefactorInfo} required/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label='Agency and Address' fullWidth id ='agency_and_address' value = {employeeInfo.agency_and_address} onChange = {handleSetBenefactorInfo} required/>
                    </Grid>
                   
                </Grid>

            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label ="No. of days to be allocated" variant="outlined" fullWidth type="number"
                InputProps={{ inputProps: { min: "1", max:"7"} }} value = {allocationMaternityLeaveDays} onChange = {handleAllocationMaternityLeave} required/>
            </Grid>
            <Grid item xs={12} sx={{mt:1}}>
                <Typography sx={{background:'#011f51',color:'#fff',padding:'10px'}}>II. FOR CHILD'S FATHER/ALTERNATE CAREGIVER</Typography>
            </Grid>
            <Grid xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                <Tooltip title='Search Employee'><IconButton color='primary' onClick={()=>setSearchModal(true)}><SearchIcon/></IconButton></Tooltip>
            </Grid>
            <Grid item xs={12} sx={{mb:1}}>
                <Grid item container spacing={1} >
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='First Name' fullWidth id ='fname' value = {beneficiaryInfo.fname} onChange = {handleSetBeneficiaryInfo} required inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='Middle Name' fullWidth id ='mname' value = {beneficiaryInfo.mname} onChange = {handleSetBeneficiaryInfo} inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='Last Name' fullWidth id ='lname' value = {beneficiaryInfo.lname} onChange = {handleSetBeneficiaryInfo} required inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                        <TextField label='Extension Name' fullWidth id ='extname' value = {beneficiaryInfo.extname} onChange = {handleSetBeneficiaryInfo} inputProps={{readOnly:true}}/>
                    </Grid>
                </Grid>

            </Grid>
           
            <Grid item xs={12} sx={{mb:1}}>
                <Grid item container spacing={1} >
                    <Grid item xs={6}>
                        <TextField label='Position' fullWidth id ='position' value = {beneficiaryInfo.position} onChange = {handleSetBeneficiaryInfo} required inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label='Contact Details (Phone number and e-mail address)' fullWidth id ='contact_details' value = {beneficiaryInfo.contact_details} onChange = {handleSetBeneficiaryInfo} required/>
                    </Grid>
                   
                </Grid>
            </Grid>

            <Grid item xs={12} sx={{mb:1}}>
                <Grid item container spacing={1} >
                    <Grid item xs={6}>
                        <TextField label='Home Address' fullWidth id ='home_address' value = {beneficiaryInfo.home_address} onChange = {handleSetBeneficiaryInfo} required inputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label='Agency and Address' fullWidth id ='agency_and_address' value = {beneficiaryInfo.agency_and_address} onChange = {handleSetBeneficiaryInfo} required inputProps={{readOnly:true}}/>
                    </Grid>
                   
                </Grid>

            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
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
            </Grid> */}
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
                    <FormControlLabel value="Childs father" control={<Radio required/>} label="Child's father" />
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
                    <FormControlLabel value="Childs Birth Certificate" control={<Radio required/>} label="Child's Birth Certificate" />
                    <FormControlLabel value="Marriage Certificate" control={<Radio />} label="Marriage Certificate" />
                    <FormControlLabel value="Barangay Certificate" control={<Radio />} label="Barangay Certificate" />
                    <FormControlLabel value="Other bona fide document/s that can prove filial relationship" control={<Radio />} label="Other bona fide document/s that can prove filial relationship" />
                </RadioGroup>
                </FormControl>
                <br/>
                <br/>
                <Tooltip title={'Please upload '+maternityRelationshipProof+' PDF/Image file'} placement='top'>
                <TextField type = "file" label="Proof of relationship " fullWidth InputLabelProps={{shrink:true}} onChange = {handleMaternityRelationProofFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} disabled={maternityRelationshipProof.length !== 0 ?false:true}required/>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-end'}}>
                    <Button variant = "contained" color='success' type='submit' sx={{width:matches?'100%':'auto'}}disabled = {beneficiaryInfo.emp_no.length ===0?true:false} className='custom-roundbutton'>Save</Button>
                    &nbsp;
                    <Button variant = "contained" color='error' onClick = {props.onClose} sx={{width:matches?'100%':'auto'}} className='custom-roundbutton'>Cancel</Button>
            </Grid>
            {/* <div style={{display:'none'}}>
                <AllocationOfMaternityLeaveForm ref={printMaternityAllocationLeaveRef} info = {props.employeeInfo} employeeContactDetails = {employeeContactDetails}
                maternityRelationship = {maternityRelationship} maternityRelationshipDetails={maternityRelationshipDetails} maternityRelationshipSpecifyDetails = {maternityRelationshipSpecifyDetails} maternityRelationshipProof = {maternityRelationshipProof} allocate_days ={allocationMaternityLeaveDays} allocatePersonFullname = {allocatePersonFullname} allocatePersonPosition = {allocatePersonPosition} allocatePersonHomeAddress = {allocatePersonHomeAddress} allocatePersonAgencyAddress = {allocatePersonAgencyAddress} allocatePersonContactDetails = {allocatePersonContactDetails} benefitsignature = {benefitsignature} benefitsignatureimage = {benefitsignatureimage}/>
            </div> */}
            </Grid>
        </form>
        <Modal
            open={searchModal}
            onClose={()=> setSearchModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={searchModalStyle}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setSearchModal(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Searching Employee
                </Typography>
                <Box sx={{m:2}}>
                <form onSubmit={submitSearch}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField label='e.g. lastname,firstname' fullWidth required value = {searchData} onChange = {(value)=>setSearchData(value.target.value)} InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <AccountCircle />
                                </InputAdornment>
                            ),
                            }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant='outlined' size='small' sx={{float:'right'}}type = 'submit'>Search</Button>
                        </Grid>
                    </Grid>
                </form>
                {resultData.length !==0
                ?
                <Box sx={{mt:2}}>
                <small style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',fontSize:'12px'}}><em>* click row to select <strong>Employee ID</strong></em></small>
                <Box sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                <table className='table table-bordered table-hover' style={{marginTop:'5px'}}>
                    <thead style={{position:'sticky',top:'-3px',background:'#fff'}}>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultData.map((data,key)=>
                            <tr key = {key} onClick = {()=>selectRow(data)} style={{cursor:'pointer'}}>
                                <td>{data.id}</td>
                                <td>{data.fname +' '+data.lname}</td>
                                <td>{data.position_name}</td>
                                <td><span style={{color:data.has_account==='Has Account' ?'green':'red'}}>{data.has_account}</span></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </Box>
                </Box>
                :
                ''
                }
                </Box>



            </Box>
        </Modal>
        </>
    )
}