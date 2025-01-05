import React , {useEffect, useState} from 'react';
import {Grid,TextField,Typography,Paper,Box,Chip,Button,IconButton,InputAdornment,FormControl,InputLabel,MenuItem,Select} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {blue,red,green, pink} from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CustomComponent from '../Component/CustomComponent';
import { postTrainer } from '../TrainerRequest';
import Swal from 'sweetalert2';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function Add(props){
    const [value, setValue] = useState(null);
    const [profileInfo, setProfileInfo] = useState({
        type:'',
        company:'',
        fname:'',
        mname:'',
        lname:'',
        dob:'',
        sex:'',
        nationality:'',
        c_details:''
    });
    const [permAdd, setPermAdd] = useState('');
    const [permPhone, setPermPhone] = useState('');
    const [permBPhone, setPermBPhone] = useState('');
    const [permFax, setPermFax] = useState('');
    const [permBFax, setPermBFax] = useState('');
    const [permMobile, setPermMobile] = useState('');
    const [permEmail, setPermEmail] = useState('');
    const [currAdd, setCurrAdd] = useState('');
    const [currPhone, setCurrPhone] = useState('');
    const [currBPhone, setCurrBPhone] = useState('');
    const [currFax, setCurrFax] = useState('');
    const [currBFax, setCurrBFax] = useState('');
    const [currMobile, setCurrMobile] = useState('');
    const [currEmail, setCurrEmail] = useState('');
    const [sameAsPerm,setSameAsPerm] = useState(false)
    const [refName,setRefName] = useState('');
    const [metaTags, setMetaTags] = useState([]);
    const [newMetaTagsValue, setNewMetaTagsValue] = useState({
        meta_name:''
    });
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        meta_name: ''
    });
    const [refInfo,setRefInfo] = useState({
        name:'',
        position:'',
        company:'',
        phone:'',
        email:''
    })
    const handleSetProfileInfo = (name,value) => {
        setProfileInfo({
            ...profileInfo,
            [name]:value
        })
    }
    const handleSetRefInfo = (name,value) => {
        setRefInfo({
            ...refInfo,
            [name]:value
        })
    }
    const handleSameAsPerm = () => {
        setCurrAdd(permAdd);
        setCurrPhone(permPhone);
        setCurrBPhone(permBPhone);
        setCurrFax(permFax);
        setCurrBFax(permBFax);
        setCurrMobile(permMobile);
        setCurrEmail(permEmail);
        setSameAsPerm(!sameAsPerm);
    }
    const [acadQ,setAcadQ] = useState([{
        'value':''
    }])
    const [profAff,setProfAff] = useState([{
        'value':''
    }])
    const [trainingAtt,setTrainingAtt] = useState([{
        'value':''
    }])
    const [profExp,setProfExp] = useState([{
        'value':''
    }])
    const [techExpertise,setTechExpertise] = useState([{
        'value':''
    }])
    const addAcadQ = () =>{
        let temp = [...acadQ];
        temp.push({
            'value':''
        })
        setAcadQ(temp)
    }
    const deleteAcadQ = (index)=>{
        var temp = [...acadQ]
        temp.splice(index,1)
        setAcadQ(temp)
    }
    const setAcadQValue = (index,value) => {
        let temp = [...acadQ];
        temp[index].value = value;
        setAcadQ(temp)
    }
    const addProfAff = () =>{
        let temp = [...profAff];
        temp.push({
            'value':''
        })
        setProfAff(temp)
    }
    const deleteProfAff = (index)=>{
        var temp = [...profAff]
        temp.splice(index,1)
        setProfAff(temp)
    }
    const setProfAffValue = (index,value) => {
        let temp = [...profAff];
        temp[index].value = value;
        setProfAff(temp)
    }
    const addTrainingAtt = () =>{
        let temp = [...trainingAtt];
        temp.push({
            'value':''
        })
        setTrainingAtt(temp)
    }
    const deleteTrainingAtt = (index)=>{
        var temp = [...trainingAtt]
        temp.splice(index,1)
        setTrainingAtt(temp)
    }
    const setTrainingAttValue = (index,value) => {
        let temp = [...trainingAtt];
        temp[index].value = value;
        setTrainingAtt(temp)
    }
    const addProfExp = () =>{
        let temp = [...profExp];
        temp.push({
            'value':''
        })
        setProfExp(temp)
    }
    const deleteProfExp = (index)=>{
        var temp = [...profExp]
        temp.splice(index,1)
        setProfExp(temp)
    }
    const setProfExpValue = (index,value) => {
        let temp = [...profExp];
        temp[index].value = value;
        setProfExp(temp)
    }
    const addTechExpertise = () =>{
        let temp = [...techExpertise];
        temp.push({
            'value':''
        })
        setTechExpertise(temp)
    }
    const deleteTechExpertise = (index)=>{
        var temp = [...techExpertise]
        temp.splice(index,1)
        setTechExpertise(temp)
    }
    const setTechExpertiseValue = (index,value) => {
        let temp = [...techExpertise];
        temp[index].value = value;
        setTechExpertise(temp)
    }
    const submit = (e) =>{
        e.preventDefault();
        var temp_meta_tags= ''
        metaTags.forEach((el,key)=>{
            if(key+1 !== metaTags.length){
                temp_meta_tags+=el.meta_name_temp+','
            }else{
                temp_meta_tags+=el.meta_name_temp
            }
        })
        if(isExternal){
            var data = {
                external:true,
                address:externalInfo.address,
                name:externalInfo.name,
                number:externalInfo.number,
                email:externalInfo.email,
                meta_tags:temp_meta_tags

            }
        }else{
            var data = {
                profile_info:profileInfo,
                acad_qualif:acadQ,
                prof_aff:profAff,
                training_att:trainingAtt,
                prof_exp:profExp,
                tech_expertise:techExpertise,
                ref_info:refInfo,
                perm_add:permAdd,
                perm_phone:permPhone,
                perm_b_phone:permBPhone,
                perm_fax:permFax,
                perm_b_fax:permBFax,
                perm_mobile:permMobile,
                perm_email:permEmail,
                curr_add:currAdd,
                curr_phone:currPhone,
                curr_b_phone:currBPhone,
                curr_fax:currFax,
                curr_b_fax:currBFax,
                curr_mobile:currMobile,
                curr_email:currEmail,
                meta_tags:temp_meta_tags
            }
        }
        
        // console.log(data)
        Swal.fire({
            icon:'info',
            title:'Saving data',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false,
            showConfirmButton:false,

        })
        Swal.showLoading()
        postTrainer(data)
        .then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                props.setData(res.data.data);
                props.setData1(res.data.data);
                props.close();
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
            console.log(err)
        })
    }
    const [externalInfo,setExternalInfo] = useState({
        'address':'',
        'name':'',
        'number':'',
        'email':''
    })
    const handleExternalChange = (val,name)=>{
        setExternalInfo({
            ...externalInfo,
            [name]:val.target.value

        })
    }
    const [isExternal,setIsExternal] = useState(false);

    return (
        <form onSubmit={submit}>
        <Grid container spacing={1}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <FormControlLabel control={<Checkbox checked={isExternal} onChange={()=>setIsExternal(!isExternal)}/>} label="External" />
            </Grid>
            
            {
                isExternal
                ?
                <>
                <Grid item xs={12}>
                    <Typography sx={{fontWeight:'bold',background: '#1565c0',color: '#fff',padding: '10px',position: 'relative',bottom: '-2px'}}>Profile Form</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Affiliation' value={externalInfo.name} onChange={(val)=>handleExternalChange(val,'name')} required fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Address' value={externalInfo.address} onChange={(val)=>handleExternalChange(val,'address')} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Contact Number' value={externalInfo.number} onChange={(val)=>handleExternalChange(val,'number')} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type='email' label='Email Address' value={externalInfo.email} onChange={(val)=>handleExternalChange(val,'email')} fullWidth/>
                </Grid>
                </>
                :
                <>
                    <Grid item xs={12}>
                        <Typography sx={{fontWeight:'bold',background: '#1565c0',color: '#fff',padding: '10px',position: 'relative',bottom: '-2px'}}>Profile Form</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box component={Paper}  sx={{p:1}}>
                        <Grid item container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label ='Affiliation' value = {profileInfo.company} onChange={(value)=>handleSetProfileInfo('company',value.target.value)} required fullWidth/>
                            {/* <FormControl fullWidth>
                                <InputLabel id="type-select-label">Type *</InputLabel>
                                <Select
                                labelId="type-select-label"
                                id="type-select"
                                value={profileInfo.type}
                                label="Type *"
                                onChange={(value)=>handleSetProfileInfo('type',value.target.value)}
                                required
                                >
                                <MenuItem value={0}>Individual</MenuItem>
                                <MenuItem value={1}>Company</MenuItem>
                                </Select>
                            </FormControl> */}

                        </Grid>
                        {/* {
                        profileInfo.type === 1
                        ?
                            <Grid item xs={12}>
                                <TextField label = 'Company Name' fullWidth value = {profileInfo.company} onChange = {(value) => handleSetProfileInfo('company',value.target.value)} required/>
                            </Grid>
                        :
                        null 
                        } */}
                        
                        <Grid item xs={12}>
                            <TextField label='First Name' fullWidth value = {profileInfo.fname} onChange = {(value) => handleSetProfileInfo('fname',value.target.value)} required/>
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField label='Middle Initial' fullWidth value = {profileInfo.mname} onChange = {(value) => handleSetProfileInfo('mname',value.target.value)}/>
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField label='Last Name' fullWidth value = {profileInfo.lname} onChange = {(value) => handleSetProfileInfo('lname',value.target.value)} required/>
                        </Grid>
                        <Grid item  xs={12}>
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date of Birth"
                                inputFormat="MM/DD/YYYY"
                                value = {profileInfo.dob}
                                onChange = {(value) => handleSetProfileInfo('dob',value)}
                                renderInput={(params) => <TextField {...params} fullWidth required/>}
                            />
                        </LocalizationProvider> */}
                            <TextField type = 'date' label='Date of Birth' fullWidth value = {profileInfo.dob} onChange = {(value) => handleSetProfileInfo('dob',value.target.value)} required InputLabelProps={{shrink:true}}/>

                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="sex-select-label">Sex *</InputLabel>
                                <Select
                                labelId="sex-select-label"
                                id="sex-select"
                                value={profileInfo.sex}
                                label="Sex *"
                                onChange={(value)=>handleSetProfileInfo('sex',value.target.value)}
                                required
                                >
                                <MenuItem value='MALE'>MALE</MenuItem>
                                <MenuItem value='FEMALE'>FEMALE</MenuItem>
                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid item  xs={12}>
                            <TextField label='Nationality' fullWidth value = {profileInfo.nationality} onChange = {(value) => handleSetProfileInfo('nationality',value.target.value)} required/>
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField label='Contact Details' fullWidth value = {profileInfo.c_details} onChange = {(value) => handleSetProfileInfo('c_details',value.target.value)}/>
                        </Grid>
                        </Grid>
                        </Box>
                    </Grid>
                    
                <Grid item xs={12}>
                    <Typography sx={{fontWeight:'bold',background: '#1565c0',color: '#fff',padding: '10px',position: 'relative',bottom: '-20px'}}>Address</Typography>
                </Grid>
                    <Grid item xs={12} sx={{mt:2}}>
                        <Box component={Paper}  sx={{p:1}}>
                            <Grid item container spacing={1}>
                                
                                <Grid item xs={12}>
                                    <TextField label='Permanent Address' variant='standard' fullWidth value = {permAdd} onChange = {(value) => setPermAdd(value.target.value)} required/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Phone' variant='standard' fullWidth value = {permPhone} onChange = {(value) => setPermPhone(value.target.value)}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Business Phone' variant='standard' fullWidth value = {permBPhone} onChange = {(value) => setPermBPhone(value.target.value)}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Fax' variant='standard' fullWidth value = {permFax} onChange = {(value) => setPermFax(value.target.value)}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Business Fax' variant='standard' fullWidth value = {permBFax} onChange = {(value) => setPermBFax(value.target.value)}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Mobile' variant='standard' fullWidth value = {permMobile} onChange = {(value) => setPermMobile(value.target.value)} required/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField type='email' label='Email' variant='standard' fullWidth value = {permEmail} onChange = {(value) => setPermEmail(value.target.value)} required/>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        sameAsPerm
                                        ?
                                        <TextField label='Current Address' variant='standard' fullWidth value = {currAdd} onChange = {(value) => setCurrAdd(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                                        :
                                        <TextField label='Current Address' variant='standard' fullWidth value = {currAdd} onChange = {(value) => setCurrAdd(value.target.value)} required/>
                                    }
                                
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        sameAsPerm
                                        ?
                                        <TextField label='Phone' variant='standard' fullWidth value = {currPhone} onChange = {(value) => setCurrPhone(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                                        :
                                        <TextField label='Phone' variant='standard' fullWidth value = {currPhone} onChange = {(value) => setCurrPhone(value.target.value)}/>
                                    }
                                    
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        sameAsPerm
                                        ?
                                        <TextField label='Business Phone' variant='standard' fullWidth value = {currBPhone} onChange = {(value) => setCurrBPhone(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                                        :
                                        <TextField label='Business Phone' variant='standard' fullWidth value = {currBPhone} onChange = {(value) => setCurrBPhone(value.target.value)}/>
                                    }
                                    
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        sameAsPerm
                                        ?
                                        <TextField label='Fax' variant='standard' fullWidth value = {currFax} onChange = {(value) => setCurrFax(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                                        :
                                        <TextField label='Fax' variant='standard' fullWidth value = {currFax} onChange = {(value) => setCurrFax(value.target.value)}/>
                                    }
                                    
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        sameAsPerm
                                        ?
                                        <TextField label='Business Fax' variant='standard' fullWidth value = {currBFax} onChange = {(value) => setCurrBFax(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                                        :
                                        <TextField label='Business Fax' variant='standard' fullWidth value = {currBFax} onChange = {(value) => setCurrBFax(value.target.value)}/>
                                    }
                                    
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        sameAsPerm
                                        ?
                                        <TextField label='Mobile' variant='standard' fullWidth value = {currMobile} onChange = {(value) => setCurrMobile(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                                        :
                                        <TextField label='Mobile' variant='standard' fullWidth value = {currMobile} onChange = {(value) => setCurrMobile(value.target.value)} required/>
                                    }
                                    
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        sameAsPerm
                                        ?
                                        <TextField type='email' label='Email' variant='standard' fullWidth value = {currEmail} onChange = {(value) => setCurrEmail(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}}/>
                                        :
                                        <TextField type='email' label='Email' variant='standard' fullWidth value = {currEmail} onChange = {(value) => setCurrEmail(value.target.value)} required/>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel control={<Checkbox checked={sameAsPerm} onChange = {handleSameAsPerm}/>} label="same as permanent address" />
                                </Grid>
                                
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{mt:2}}>
                        <Box component={Paper}  sx={{p:1}}>
                            <Grid item container spacing={2}>
                                <CustomComponent name = 'Academic Qualification' data = {acadQ} addData = {addAcadQ} deleteData = {deleteAcadQ} setDataValue = {setAcadQValue} required = {true} courseData = {props.courseData}/>

                                <CustomComponent name = 'Professional Affiliation' data = {profAff} addData = {addProfAff} deleteData = {deleteProfAff} setDataValue = {setProfAffValue} required = {false}/>

                                <CustomComponent name = 'Trainings Attended (recent 5 years)' data = {trainingAtt} addData = {addTrainingAtt} deleteData = {deleteTrainingAtt} setDataValue = {setTrainingAttValue} required = {true}/>

                                <CustomComponent name = 'Professional Experience' data = {profExp} addData = {addProfExp} deleteData = {deleteProfExp} setDataValue = {setProfExpValue} required = {false}/>

                                <CustomComponent name = 'Technical Field of Expertise' data = {techExpertise} addData = {addTechExpertise} deleteData = {deleteTechExpertise} setDataValue = {setTechExpertiseValue} required = {true}/>
                            </Grid>

                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography sx={{fontWeight:'bold',background: '#1565c0',color: '#fff',padding: '10px',position: 'relative',bottom: '-20px'}}>References</Typography>
                </Grid>
                    <Grid item xs={12} sx={{mt:2}}>
                        <Box component={Paper}  sx={{p:1}}>
                            <Grid item container spacing={2}>
                                <Grid item xs={12}>
                                <TextField label='Name' fullWidth value = {refInfo.name} onChange = {(value) => handleSetRefInfo('name',value.target.value)} required/>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField label='Position' fullWidth value = {refInfo.position} onChange = {(value) => handleSetRefInfo('position',value.target.value)} required/>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField label='Company' fullWidth value = {refInfo.company} onChange = {(value) => handleSetRefInfo('company',value.target.value)} required/>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField label='Work Phone' fullWidth value = {refInfo.phone} onChange = {(value) => handleSetRefInfo('phone',value.target.value)} required/>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField type='email' label='Email' fullWidth value = {refInfo.email} onChange = {(value) => handleSetRefInfo('email',value.target.value)} required/>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    
                </>
            }
            <Grid item xs={12} sx={{mt:2}}>
                <Autocomplete
                    value={metaTags}
                    onChange={(event, newValue) => {

                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                        toggleOpen(true);
                        });
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
                            meta_name: newValue.inputValue
                        });
                    } else {
                        setMetaTags(newValue);
                    }
                    }}
                    filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                        meta_name_temp: params.inputValue,
                        meta_name: `Add "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                    }}
                    id="rqmt-dialog-demo"
                    options={props.metaTagsData}
                    getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.meta_name_temp;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => <li {...props}>{option.meta_name}</li>}
                    fullWidth
                    multiple
                    renderInput={(params) => <TextField {...params} label="Meta Tags"/>}
                    required
                    disableCloseOnSelect
                />
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Button variant='contained' color='success' type='submit'>save</Button>
            </Grid>
            
        </Grid>
        </form>
    )
}