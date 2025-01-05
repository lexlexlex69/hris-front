import React , {useEffect, useState} from 'react';
import {Grid,TextField,Typography,Paper,Box,Chip,Button,IconButton,InputAdornment,FormControl,InputLabel,MenuItem,Select, Tooltip, setRef} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {blue,red,green} from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CustomComponent from '../Component/CustomComponent';
import { postTrainer, postUpdateAcadQ, postUpdateAddress, postUpdateMetaTags, postUpdateProfAff, postUpdateProfExp, postUpdateReferences, postUpdateTechExpertise, postUpdateTrainer, postUpdateTrainerProfileForm, postUpdateTrainingAtt } from '../TrainerRequest';
import Swal from 'sweetalert2';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { APILoading } from '../../../apiresponse/APIResponse';
const filter = createFilterOptions();

export default function Update(props){
    const [value, setValue] = useState(null);
    const [profileInfo, setProfileInfo] = useState({
        type:props.data.trainer_type,
        is_internal:props.data.is_internal,
        company:props.data.company_name??'',
        fname:props.data.fname??'',
        mname:props.data.mname??'',
        lname:props.data.lname??'',
        dob:props.data.birth_date??'',
        sex:props.data.sex??'',
        nationality:props.data.nationality??'',
        c_details:props.data.contact_details??''
    });
    const [permAdd, setPermAdd] = useState(props.data.perm_address??'');
    const [permPhone, setPermPhone] = useState(props.data.perm_phone??'');
    const [permBPhone, setPermBPhone] = useState(props.data.perm_b_phone??'');
    const [permFax, setPermFax] = useState(props.data.perm_fax??'');
    const [permBFax, setPermBFax] = useState(props.data.perm_b_fax??'');
    const [permMobile, setPermMobile] = useState(props.data.perm_mobile??'');
    const [permEmail, setPermEmail] = useState(props.data.perm_email??'');
    const [currAdd, setCurrAdd] = useState(props.data.curr_address??'');
    const [currPhone, setCurrPhone] = useState(props.data.curr_phone??'');
    const [currBPhone, setCurrBPhone] = useState(props.data.curr_b_phone??'');
    const [currFax, setCurrFax] = useState(props.data.curr_fax??'');
    const [currBFax, setCurrBFax] = useState(props.data.curr_b_fax??'');
    const [currMobile, setCurrMobile] = useState(props.data.curr_mobile??'');
    const [currEmail, setCurrEmail] = useState(props.data.curr_email??'');
    const [sameAsPerm,setSameAsPerm] = useState(false)
    const [metaTags, setMetaTags] = useState([]);
    const [newMetaTagsValue, setNewMetaTagsValue] = useState({
        meta_name:''
    });
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        meta_name: ''
    });
    const [refInfo,setRefInfo] = useState({
        name:props.data.ref_name??'',
        position:props.data.ref_position??'',
        company:props.data.ref_company??'',
        phone:props.data.ref_work_phone??'',
        email:props.data.ref_email??''
    })
    const [acadQ,setAcadQ] = useState([])

    const [updateProfileForm,setUpdateProfileForm] = useState(false);
    const [updateAddress,setUpdateAddress] = useState(false);
    const [updateAcadQ,setUpdateAcadQ] = useState(false);
    const [updateProfAff,setUpdateProfAff] = useState(false);
    const [updateTrainingAtt,setUpdateTrainingAtt] = useState(false);
    const [updateProfExp,setUpdateProfExp] = useState(false);
    const [updateTechExpertise,setUpdateTechExpertise] = useState(false);
    const [updateReferences,setUpdateReferences] = useState(false);
    useEffect(()=>{
        var temp = props.data.meta_tags.split(',');
        setMetaTags(temp);
        console.log(props.data)
        setAcadQ(props.data.acad?JSON.parse(props.data.acad):[{
            'acad_qualif_id':'',
            'acad_qualif_name':'',
            'trainer_id':''
        }])
        setProfAff(props.data.prof_aff?JSON.parse(props.data.prof_aff):[{
            'prof_aff_id':'',
            'prof_aff_name':'',
            'trainer_id':''
        }])
        setTrainingAtt(props.data.trainings?JSON.parse(props.data.trainings):[{
            'training_id':'',
            'training_name':'',
            'trainer_id':''
        }])
        setProfExp(props.data.prof_exp?JSON.parse(props.data.prof_exp):[{
            'prof_exp_id':'',
            'prof_exp_name':'',
            'trainer_id':''
        }])
        setTechExpertise(props.data.expertise?JSON.parse(props.data.expertise):[{
            'expertise_id':'',
            'expertise_name':'',
            'trainer_id':''
        }])
    },[props.data])
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
    const [profAff,setProfAff] = useState([])
    const [trainingAtt,setTrainingAtt] = useState([])
    const [profExp,setProfExp] = useState([])
    const [techExpertise,setTechExpertise] = useState([])
    const addAcadQ = () =>{
        let temp = [...acadQ];
        temp.push({
            'acad_qualif_id':'',
            'acad_qualif_name':'',
            'trainer_id':''
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
        temp[index].acad_qualif_name = value;
        setAcadQ(temp)
    }
    const addProfAff = () =>{
        let temp = [...profAff];
        temp.push({
            'prof_aff_id':'',
            'prof_aff_name':'',
            'trainer_id':''
        })
        setProfAff(temp)
    }
    const addTrainingAtt = () =>{
        let temp = [...trainingAtt];
        temp.push({
            'training_id':'',
            'training_name':'',
            'trainer_id':''
        })
        setTrainingAtt(temp)
    }
    const addProfExp = () =>{
        let temp = [...profExp];
        temp.push({
            'prof_exp_id':'',
            'prof_exp_name':'',
            'trainer_id':''
        })
        setProfExp(temp)
    }
    const addTechExpertise = () =>{
        let temp = [...techExpertise];
        temp.push({
            'expertise_id':'',
            'expertise_name':'',
            'trainer_id':''
        })
        setTechExpertise(temp)
    }
    const deleteProfAff = (index)=>{
        var temp = [...profAff]
        temp.splice(index,1)
        setProfAff(temp)
    }
    const setProfAffValue = (index,value) => {
        let temp = [...profAff];
        temp[index].prof_aff_name = value;
        setProfAff(temp)
    }
    const setTrainingAttValue = (index,value) => {
        let temp = [...trainingAtt];
        temp[index].training_name = value;
        setTrainingAtt(temp)
    }
    const setProfExpValue = (index,value) => {
        let temp = [...profExp];
        temp[index].prof_exp_name = value;
        setProfExp(temp)
    }
    const setTechExpertiseValue = (index,value) => {
        let temp = [...techExpertise];
        temp[index].expertise_name = value;
        setTechExpertise(temp)
    }
    const deleteTrainingAtt = (index)=>{
        var temp = [...trainingAtt]
        temp.splice(index,1)
        setTrainingAtt(temp)
    }
    
    const deleteProfExp = (index)=>{
        var temp = [...profExp]
        temp.splice(index,1)
        setProfExp(temp)
    }
    
    
    const deleteTechExpertise = (index)=>{
        var temp = [...techExpertise]
        temp.splice(index,1)
        setTechExpertise(temp)
    }
    
    const submit = (e) =>{
        e.preventDefault();
        var temp_meta_tags= ''
        metaTags.forEach((el,key)=>{
            if(key+1 !== metaTags.length){
                temp_meta_tags+=el.meta_name+','
            }else{
                temp_meta_tags+=el.meta_name
            }
        })
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
        console.log(data)
        return 0;
        Swal.fire({
            icon:'info',
            title:'Saving data',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false,
            showConfirmButton:false,

        })
        Swal.showLoading()
        postUpdateTrainer(data)
        .then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                props.setData(res.data.data);
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
    const cancelUpdateProfileForm = ()=>{
        console.log(props.data)
        setProfileInfo({
            type:props.data.trainer_type,
            company:props.data.company_name??'',
            fname:props.data.fname,
            mname:props.data.mname,
            lname:props.data.lname,
            dob:props.data.birth_date,
            sex:props.data.sex,
            nationality:props.data.nationality,
            c_details:props.data.contact_details
        })
        setUpdateProfileForm(false)
    }
    const submitUpdateProfileForm = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Saving profile form updates',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        // console.log(profileInfo)
        var data2 = {
            trainer_id:props.data.trainer_id,
            info:profileInfo
        }
        postUpdateTrainerProfileForm(data2)
        .then(res=>{
            // console.log(res.data)
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                setUpdateProfileForm(false)
            }else{
                Swal.fire({
                    icon:'info',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
            }
            props.setData(res.data.data)
            res.data.data.forEach(el=>{
                if(el.trainer_id === props.data.trainer_id){
                    props.setSelectedUpdateData(el)
                }
            })

        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
            console.log(err)
        })
    }
    const cancelUpdateAddress = () =>{
        setPermAdd(props.data.perm_address);
        setPermPhone(props.data.perm_phone);
        setPermBPhone(props.data.perm_b_phone);
        setPermFax(props.data.perm_fax);
        setPermBFax(props.data.perm_b_fax);
        setPermMobile(props.data.perm_mobile);
        setPermEmail(props.data.perm_email);
        setCurrAdd(props.data.curr_address);
        setCurrPhone(props.data.curr_phone);
        setCurrBPhone(props.data.curr_b_phone);
        setCurrFax(props.data.curr_fax);
        setCurrBFax(props.data.curr_b_fax);
        setCurrMobile(props.data.curr_mobile);
        setCurrEmail(props.data.curr_email);
        setSameAsPerm(false)
        setUpdateAddress(false)
    }
    const cancelUpdateAcadQ = ()=>{
        setAcadQ(props.data.acad?JSON.parse(props.data.acad):[{
            'acad_qualif_id':'',
            'acad_qualif_name':'',
            'trainer_id':''
        }])
        setUpdateAcadQ(false)
    }
    const cancelUpdateProfAff = () =>{
        setProfAff(props.data.prof_aff?JSON.parse(props.data.prof_aff):[{
            'prof_aff_id':'',
            'prof_aff_name':'',
            'trainer_id':''
        }])
        setUpdateProfAff(false)
    }
    const cancelUpdateTrainingAtt = () =>{
        setTrainingAtt(props.data.trainings?JSON.parse(props.data.trainings):[{
            'training_id':'',
            'training_name':'',
            'trainer_id':''
        }])
        setUpdateTrainingAtt(false)
    }
    const cancelUpdateProfExp = () =>{
        setProfExp(props.data.prof_exp?JSON.parse(props.data.prof_exp):[{
            'prof_exp_id':'',
            'prof_exp_name':'',
            'trainer_id':''
        }])
        setUpdateProfExp(false)
    }
    const cancelUpdateTechExpertise = () =>{
        setTechExpertise(props.data.expertise?JSON.parse(props.data.expertise):[{
            'expertise_id':'',
            'expertise_name':'',
            'trainer_id':''
        }])
        setUpdateTechExpertise(false)
    }
    const cancelUpdateReferences = () =>{
        setRefInfo({
            name:props.data.ref_name??'',
            position:props.data.ref_position??'',
            company:props.data.ref_company??'',
            phone:props.data.ref_work_phone??'',
            email:props.data.ref_email??''
        })
        setUpdateReferences(false)
        
    }
    const saveUpdateAddress = (event)=>{
        event.preventDefault()
        var data2 = {
            permEmail:permEmail,
            permAdd:permAdd,
            permPhone:permPhone,
            permBPhone:permBPhone,
            permFax:permFax,
            permBFax:permBFax,
            permMobile:permMobile,
            currEmail:currEmail,
            currAdd:currAdd,
            currPhone:currPhone,
            currBPhone:currBPhone,
            currFax:currFax,
            currBFax:currBFax,
            currMobile:currMobile,
            currEmail:currEmail,
            trainer_id:props.data.trainer_id
        }
        postUpdateAddress(data2)
        .then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                setUpdateAddress(false)
            }else{
                Swal.fire({
                    icon:'info',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
            }
            props.setData(res.data.data)
            res.data.data.forEach(el=>{
                if(el.trainer_id === props.data.trainer_id){
                    props.setSelectedUpdateData(el)
                }
            })
        }).catch(err=>{
            console.log(err)
        })
        console.log(data2)
    }
    const submitUpdateAcadQ = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating Academic Qualification',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var data2 = {
            trainer_id:props.data.trainer_id,
            data:acadQ
        }
        postUpdateAcadQ(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                afterUpdate(res.data.data)
                setUpdateAcadQ(false)
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
            Swal.close()
            console.log(err)
        })
        console.log(data2)
    }
    const submitUpdateProfAff = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating Professional Affiliation',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var data2 = {
            trainer_id:props.data.trainer_id,
            data:profAff
        }
        postUpdateProfAff(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                afterUpdate(res.data.data)
                setUpdateProfAff(false)
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
            Swal.close()
            console.log(err)
        })
        console.log(data2)
    }
    const submitUpdateTrainingAtt = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating Trainings Attended',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var data2 = {
            trainer_id:props.data.trainer_id,
            data:trainingAtt
        }
        postUpdateTrainingAtt(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                afterUpdate(res.data.data)
                setUpdateTrainingAtt(false)
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
            Swal.close();
            console.log(err)
        })
        console.log(data2)
    }
    const submitUpdateProfExp = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating Professional Experience',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var data2 = {
            trainer_id:props.data.trainer_id,
            data:profExp
        }
        postUpdateProfExp(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                afterUpdate(res.data.data)
                setUpdateProfExp(false)
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
            Swal.close();
            console.log(err)
        })
        console.log(data2)
    }
    const submitUpdateTechExpertise = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating Technical Expertise',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var data2 = {
            trainer_id:props.data.trainer_id,
            data:techExpertise
        }
        postUpdateTechExpertise(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                afterUpdate(res.data.data)
                setUpdateTechExpertise(false)
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
            Swal.close();
            console.log(err)
        })
        console.log(data2)
    }
    const submitUpdateReferences = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating References',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var data2 = {
            trainer_id:props.data.trainer_id,
            data:refInfo
        }
        postUpdateReferences(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                afterUpdate(res.data.data)
                setUpdateReferences(false)
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
            Swal.close();
            console.log(err)
        })
    }
    const afterUpdate = (data) => {
        var i=0;
        var len=data.length; 
        for(var i = 0; i<len;i++){
            if(data[i].trainer_id === props.data.trainer_id){
                props.setSelectedUpdateData(data[i]);
                break;
            }
        }
    }
    const handleUpdateMetaTags = ()=>{
        APILoading('info','Updating Meta Tags','Please wait...')
        var t_m_tags = [];
        metaTags.forEach(el=>{
            if(el.meta_name){
                t_m_tags.push(el.meta_name_temp)
            }else{
                t_m_tags.push(el)
            }
        })
        var data2 = {
            trainer_id:props.data.trainer_id,
            meta_tags:t_m_tags
        }
        postUpdateMetaTags(data2)
        .then(res=>{
            if(res.data.status === 200){
                props.setData(res.data.data)
                afterUpdate(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            console.log(err)
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    return (
        <Grid container spacing={1}>
            <form onSubmit={submitUpdateProfileForm}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',background: '#1565c0',color: '#fff',padding: '10px',position: 'relative',mb:1}}>
                <Typography sx={{fontWeight:'bold'}}>Profile Form</Typography>
                {
                    updateProfileForm
                    ?
                    null
                    :
                    <Tooltip title='Update Profile Form'><EditIcon sx={{'&:hover':{color:green[200],cursor:'pointer'}}} onClick={()=>setUpdateProfileForm(true)}/></Tooltip>

                }
            </Grid>
            <Grid item xs={12}>
                <Box component={Paper}  sx={{p:1}}>
                <Grid item container spacing={2}>
                <Grid item xs={12}>
                    <TextField label ='Affiliation' value = {profileInfo.company} onChange={(value)=>handleSetProfileInfo('company',value.target.value)} required fullWidth disabled={updateProfileForm?false:true}/>
                    {/* <FormControl fullWidth>
                        <InputLabel id="type-select-label">Affiliation *</InputLabel>
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
                {
                   profileInfo.type === 1
                   ?
                    <Grid item xs={12}>
                        <TextField label = 'Company Name' fullWidth value = {profileInfo.company} onChange = {(value) => handleSetProfileInfo('company',value.target.value)} required disabled={updateProfileForm?false:true}/>
                    </Grid>
                   :
                   null 
                }
                
                <Grid item xs={12}>
                    <TextField label='First Name' fullWidth value = {profileInfo.fname} onChange = {(value) => handleSetProfileInfo('fname',value.target.value)} required = {profileInfo.is_internal?true:false} disabled={updateProfileForm?false:true}/>
                </Grid>
                <Grid item  xs={12}>
                    <TextField label='Middle Initial' fullWidth value = {profileInfo.mname} onChange = {(value) => handleSetProfileInfo('mname',value.target.value)} disabled={updateProfileForm?false:true}/>
                </Grid>
                <Grid item  xs={12}>
                    <TextField label='Last Name' fullWidth value = {profileInfo.lname} onChange = {(value) => handleSetProfileInfo('lname',value.target.value)} required = {profileInfo.is_internal?true:false} disabled={updateProfileForm?false:true}/>
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
                    <TextField type = 'date' label='Date of Birth' fullWidth value = {profileInfo.dob} onChange = {(value) => handleSetProfileInfo('dob',value.target.value)} required = {profileInfo.is_internal?true:false} InputLabelProps={{shrink:true}} disabled={updateProfileForm?false:true}/>
                    
                </Grid>
                <Grid item xs={12} sx={{p:1}}>
                    <FormControl fullWidth>
                        <InputLabel id="sex-select-label">Sex *</InputLabel>
                        <Select
                        labelId="sex-select-label"
                        id="sex-select"
                        value={profileInfo.sex}
                        label="Sex *"
                        onChange={(value)=>handleSetProfileInfo('sex',value.target.value)}
                        required = {profileInfo.is_internal?true:false}
                        disabled={updateProfileForm?false:true}
                        >
                        <MenuItem value='MALE'>MALE</MenuItem>
                        <MenuItem value='FEMALE'>FEMALE</MenuItem>
                        </Select>
                    </FormControl>

                </Grid>
                <Grid item  xs={12}>
                    <TextField label='Nationality' fullWidth value = {profileInfo.nationality} onChange = {(value) => handleSetProfileInfo('nationality',value.target.value)} required = {profileInfo.is_internal?true:false} disabled={updateProfileForm?false:true}/>
                </Grid>
                <Grid item  xs={12}>
                    <TextField label='Contact Details' fullWidth value = {profileInfo.c_details} onChange = {(value) => handleSetProfileInfo('c_details',value.target.value)} disabled={updateProfileForm?false:true}/>
                </Grid>
                    {
                        updateProfileForm
                        ?
                        <Grid item xs={12}>
                                <Button variant='contained' className='custom-roundbutton' type='submit' color='success'>Save</Button> &nbsp;
                                <Button variant='contained' className='custom-roundbutton' onClick={cancelUpdateProfileForm} color='error'>Cancel</Button>
                        </Grid>
                        :
                        null
                    }
                </Grid>
                </Box>
            </Grid>
        </form>
        <form onSubmit={saveUpdateAddress}>
        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',background: '#1565c0',color: '#fff',padding: '10px',mt:1}}>
            <Typography sx={{fontWeight:'bold'}}>Address</Typography>
            {
                    updateAddress
                    ?
                    null
                    :
                    <Tooltip title='Update Address'><EditIcon sx={{'&:hover':{color:green[200],cursor:'pointer'}}} onClick={()=>setUpdateAddress(true)}/></Tooltip>

            }
        </Grid>
            <Grid item xs={12}>
                <Box component={Paper}  sx={{p:1}}>
                    <Grid item container spacing={1}>
                        <Grid item xs={12}>
                            <TextField label='Permanent Address' variant='standard' fullWidth value = {permAdd} onChange = {(value) => setPermAdd(value.target.value)} required disabled={updateAddress?false:true}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='Phone' variant='standard' fullWidth value = {permPhone} onChange = {(value) => setPermPhone(value.target.value)} disabled={updateAddress?false:true}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='Business Phone' variant='standard' fullWidth value = {permBPhone} onChange = {(value) => setPermBPhone(value.target.value)} disabled={updateAddress?false:true}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='Fax' variant='standard' fullWidth value = {permFax} onChange = {(value) => setPermFax(value.target.value)} disabled={updateAddress?false:true}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='Business Fax' variant='standard' fullWidth value = {permBFax} onChange = {(value) => setPermBFax(value.target.value)} disabled={updateAddress?false:true}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='Mobile' variant='standard' fullWidth value = {permMobile} onChange = {(value) => setPermMobile(value.target.value)} required disabled={updateAddress?false:true}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField type='email' label='Email' variant='standard' fullWidth value = {permEmail} onChange = {(value) => setPermEmail(value.target.value)} required disabled={updateAddress?false:true}/>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                sameAsPerm
                                ?
                                <TextField label='Current Address' variant='standard' fullWidth value = {currAdd} onChange = {(value) => setCurrAdd(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} disabled={updateAddress?false:true}/>
                                :
                                <TextField label='Current Address' variant='standard' fullWidth value = {currAdd} onChange = {(value) => setCurrAdd(value.target.value)} required disabled={updateAddress?false:true}/>
                            }
                           
                        </Grid>
                        <Grid item xs={6}>
                            {
                                sameAsPerm
                                ?
                                <TextField label='Phone' variant='standard' fullWidth value = {currPhone} onChange = {(value) => setCurrPhone(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} disabled={updateAddress?false:true}/>
                                :
                                <TextField label='Phone' variant='standard' fullWidth value = {currPhone} onChange = {(value) => setCurrPhone(value.target.value)} disabled={updateAddress?false:true}/>
                            }
                            
                        </Grid>
                        <Grid item xs={6}>
                            {
                                sameAsPerm
                                ?
                                <TextField label='Business Phone' variant='standard' fullWidth value = {currBPhone} onChange = {(value) => setCurrBPhone(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} disabled={updateAddress?false:true}/>
                                :
                                <TextField label='Business Phone' variant='standard' fullWidth value = {currBPhone} onChange = {(value) => setCurrBPhone(value.target.value)} disabled={updateAddress?false:true}/>
                            }
                            
                        </Grid>
                        <Grid item xs={6}>
                            {
                                sameAsPerm
                                ?
                                <TextField label='Fax' variant='standard' fullWidth value = {currFax} onChange = {(value) => setCurrFax(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} disabled={updateAddress?false:true}/>
                                :
                                <TextField label='Fax' variant='standard' fullWidth value = {currFax} onChange = {(value) => setCurrFax(value.target.value)} disabled={updateAddress?false:true}/>
                            }
                            
                        </Grid>
                        <Grid item xs={6}>
                            {
                                sameAsPerm
                                ?
                                <TextField label='Business Fax' variant='standard' fullWidth value = {currBFax} onChange = {(value) => setCurrBFax(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} disabled={updateAddress?false:true}/>
                                :
                                <TextField label='Business Fax' variant='standard' fullWidth value = {currBFax} onChange = {(value) => setCurrBFax(value.target.value)} disabled={updateAddress?false:true}/>
                            }
                            
                        </Grid>
                        <Grid item xs={6}>
                            {
                                sameAsPerm
                                ?
                                <TextField label='Mobile' variant='standard' fullWidth value = {currMobile} onChange = {(value) => setCurrMobile(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} disabled={updateAddress?false:true}/>
                                :
                                <TextField label='Mobile' variant='standard' fullWidth value = {currMobile} onChange = {(value) => setCurrMobile(value.target.value)} required disabled={updateAddress?false:true}/>
                            }
                            
                        </Grid>
                        <Grid item xs={6}>
                            {
                                sameAsPerm
                                ?
                                <TextField type='email' label='Email' variant='standard' fullWidth value = {currEmail} onChange = {(value) => setCurrEmail(value.target.value)} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} disabled={updateAddress?false:true}/>
                                :
                                <TextField type='email' label='Email' variant='standard' fullWidth value = {currEmail} onChange = {(value) => setCurrEmail(value.target.value)} required disabled={updateAddress?false:true}/>
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel control={<Checkbox checked={sameAsPerm} onChange = {handleSameAsPerm}/>} label="same as permanent address" disabled={updateAddress?false:true}/>
                        </Grid>
                        {
                            updateAddress
                            ?
                            <Grid item xs={12}>
                                <Button variant='contained' className='custom-roundbutton' color='success' type='submit'>Save</Button> &nbsp;
                                <Button variant='contained' className='custom-roundbutton' color='error' onClick={cancelUpdateAddress}>Cancel</Button>
                            </Grid>
                            :
                            null
                        }
                        
                    </Grid>
                </Box>
            </Grid>
            </form>
            <form style={{width:'100%'}} onSubmit = {submitUpdateAcadQ}>
            <Grid item xs={12} sx={{mt:2}}>
                <Box component={Paper}  sx={{p:1}}>
                    <Grid item container spacing={2}>
                       
                        <Grid item xs={12}>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <Typography sx={{color:'#ff6a00',fontWeight:'bold'}}>Academic Qualification *</Typography>
                            {
                                updateAcadQ
                                ?
                                null
                                :
                                <Tooltip title='Update Academic Qualification'><IconButton color='success' onClick={()=>setUpdateAcadQ(true)}><EditIcon/></IconButton></Tooltip>

                            }
                            
                            </Box>
                            <Grid item container spacing={1}>
                            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                <IconButton color='success' onClick={addAcadQ} disabled={updateAcadQ?false:true}>
                                <AddOutlinedIcon sx={{border:'solid 1px',borderRadius:'50%'}}/>
                                </IconButton>
                            </Grid>
                            {
                                acadQ.map((data,index)=>
                                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}} key = {index}>
                                
                                <TextField  value = {data.acad_qualif_name} label ={'#'+(index+1)} fullWidth onChange = {(value) => setAcadQValue(index,value.target.value)} required disabled={updateAcadQ?false:true}
                                />
                                {
                                    acadQ.length === 1
                                    ?
                                    ''
                                    :
                                    <Button color='error' variant='outlined' onClick = {()=>deleteAcadQ(index)}disabled={updateAcadQ?false:true}><ClearIcon/></Button>
                                }
                                <br/>
                                </Grid>
                    
                                )
                            }
                            {
                                updateAcadQ
                                ?
                                <Grid item xs={12}>
                                    <Button variant='contained' color='success' className='custom-roundbutton' type='submit' size='small'>Save</Button> &nbsp;
                                    <Button variant='contained' color='error' className='custom-roundbutton' onClick={cancelUpdateAcadQ} size='small'>Cancel</Button>
                                </Grid>
                                :
                                null
                            }
                            </Grid>
                        </Grid>
                    </Grid>

                </Box>
            </Grid>
            </form>
            <form style={{width:'100%'}} onSubmit = {submitUpdateProfAff}>
            <Grid item xs={12} sx={{mt:2}}>
                <Paper sx={{p:1}}>
                <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography sx={{color:'#ff6a00',fontWeight:'bold'}}>Professional Affiliation</Typography>
                {
                    updateProfAff
                    ?
                    null
                    :
                    <Tooltip title='Update Academic Qualification'><IconButton color='success' onClick={()=>setUpdateProfAff(true)}><EditIcon/></IconButton></Tooltip>

                }
                </Box>
                
                <Grid item container spacing={1}>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <IconButton color='success' onClick={addProfAff} disabled={updateProfAff?false:true}>
                    <AddOutlinedIcon sx={{border:'solid 1px',borderRadius:'50%'}}/>
                    </IconButton>
                    </Grid>
                {
                    profAff.map((data,index)=>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}} key = {index}>
                    
                    <TextField  value = {data.prof_aff_name} label ={'#'+(index+1)} fullWidth onChange = {(value) => setProfAffValue(index,value.target.value)} disabled={updateProfAff?false:true}
                    />
                    {/* {
                        profAff.length === 1
                        ?
                        ''
                        :
                        <Button color='error' variant='outlined' onClick = {()=>deleteProfAff(index)} disabled={updateProfAff?false:true}><ClearIcon/></Button>
                    } */}
                    <Button color='error' variant='outlined' onClick = {()=>deleteProfAff(index)} disabled={updateProfAff?false:true}><ClearIcon/></Button>
                    <br/>
                    </Grid>
        
                    )
                }
                {
                    updateProfAff
                    ?
                    <Grid item xs={12}>
                        <Button variant='contained' color='success' className='custom-roundbutton' type='submit' size='small'>Save</Button>
                        &nbsp;
                        <Button variant='contained' color='error' className='custom-roundbutton' onClick={cancelUpdateProfAff} size='small'>Cancel</Button>
                    </Grid>
                    :
                    null
                }
                </Grid>
            </Grid>
                </Paper>
                
            </Grid>
            </form>
            <form style={{width:'100%'}} onSubmit = {submitUpdateTrainingAtt}>
            <Grid item xs={12} sx={{mt:2}}>
                <Paper sx={{p:1}}>
                <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography sx={{color:'#ff6a00',fontWeight:'bold'}}>Trainings Attended *</Typography>
                {
                    updateTrainingAtt
                    ?
                    null
                    :
                    <Tooltip title='Update Academic Qualification'><IconButton color='success' onClick={()=>setUpdateTrainingAtt(true)}><EditIcon/></IconButton></Tooltip>

                }
                </Box>
                
                <Grid item container spacing={1}>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <IconButton color='success' onClick={addTrainingAtt} disabled={updateTrainingAtt?false:true}>
                    <AddOutlinedIcon sx={{border:'solid 1px',borderRadius:'50%'}}/>
                    </IconButton>
                    </Grid>
                {
                    trainingAtt.map((data,index)=>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}} key = {index}>
                    
                    <TextField  value = {data.training_name} label ={'#'+(index+1)} fullWidth onChange = {(value) => setTrainingAttValue(index,value.target.value)} disabled={updateTrainingAtt?false:true}
                    required/>
                    {
                        trainingAtt.length === 1
                        ?
                        ''
                        :
                        <Button color='error' variant='outlined' onClick = {()=>deleteTrainingAtt(index)} disabled={updateTrainingAtt?false:true}><ClearIcon/></Button>
                    }
                    <br/>
                    </Grid>
        
                    )
                }
                {
                    updateTrainingAtt
                    ?
                    <Grid item xs={12}>
                        <Button variant='contained' color='success' className='custom-roundbutton' type='submit' size='small'>Save</Button>
                        &nbsp;
                        <Button variant='contained' color='error' className='custom-roundbutton' onClick={cancelUpdateTrainingAtt} size='small'>Cancel</Button>
                    </Grid>
                    :
                    null
                }
                </Grid>
            </Grid>
                </Paper>
                
            </Grid>
            </form>
            <form style={{width:'100%'}} onSubmit = {submitUpdateProfExp}>
            <Grid item xs={12} sx={{mt:2}}>
                <Paper sx={{p:1}}>
                <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography sx={{color:'#ff6a00',fontWeight:'bold'}}>Professional Experience</Typography>
                {
                    updateProfExp
                    ?
                    null
                    :
                    <Tooltip title='Update Academic Qualification'><IconButton color='success' onClick={()=>setUpdateProfExp(true)}><EditIcon/></IconButton></Tooltip>

                }
                </Box>
                
                <Grid item container spacing={1}>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <IconButton color='success' onClick={addProfExp} disabled={updateProfExp?false:true}>
                    <AddOutlinedIcon sx={{border:'solid 1px',borderRadius:'50%'}}/>
                    </IconButton>
                    </Grid>
                {
                    profExp.map((data,index)=>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}} key = {index}>
                    
                    <TextField  value = {data.prof_exp_name} label ={'#'+(index+1)} fullWidth onChange = {(value) => setProfExpValue(index,value.target.value)} disabled={updateProfExp?false:true}
                    />
                    {/* {
                        profExp.length === 1
                        ?
                        ''
                        :
                        <Button color='error' variant='outlined' onClick = {()=>deleteProfExp(index)} disabled={updateProfExp?false:true}><ClearIcon/></Button>
                    } */}
                    <Button color='error' variant='outlined' onClick = {()=>deleteProfExp(index)} disabled={updateProfExp?false:true}><ClearIcon/></Button>
                    <br/>
                    </Grid>
        
                    )
                }
                {
                    updateProfExp
                    ?
                    <Grid item xs={12}>
                        <Button variant='contained' color='success' className='custom-roundbutton' type='submit' size='small'>Save</Button>
                        &nbsp;
                        <Button variant='contained' color='error' className='custom-roundbutton' onClick={cancelUpdateProfExp} size='small'>Cancel</Button>
                    </Grid>
                    :
                    null
                }
                </Grid>
            </Grid>
                </Paper>
                
            </Grid>
            </form>
            <form style={{width:'100%'}} onSubmit = {submitUpdateTechExpertise}>
            <Grid item xs={12} sx={{mt:2}}>
                <Paper sx={{p:1}}>
                <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography sx={{color:'#ff6a00',fontWeight:'bold'}}>Technical Field of Expertise *</Typography>
                {
                    updateTechExpertise
                    ?
                    null
                    :
                    <Tooltip title='Update Academic Qualification'><IconButton color='success' onClick={()=>setUpdateTechExpertise(true)}><EditIcon/></IconButton></Tooltip>

                }
                </Box>
                
                <Grid item container spacing={1}>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <IconButton color='success' onClick={addTechExpertise} disabled={updateTechExpertise?false:true}>
                    <AddOutlinedIcon sx={{border:'solid 1px',borderRadius:'50%'}}/>
                    </IconButton>
                    </Grid>
                {
                    techExpertise.map((data,index)=>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}} key = {index}>
                    
                    <TextField  value = {data.expertise_name} label ={'#'+(index+1)} fullWidth onChange = {(value) => setTechExpertiseValue(index,value.target.value)} disabled={updateTechExpertise?false:true}
                    required/>
                    {
                        techExpertise.length === 1
                        ?
                        ''
                        :
                        <Button color='error' variant='outlined' onClick = {()=>deleteTechExpertise(index)} disabled={updateTechExpertise?false:true}><ClearIcon/></Button>
                    }
                    {/* <Button color='error' variant='outlined' onClick = {()=>deleteTechExpertise(index)} disabled={updateTechExpertise?false:true}><ClearIcon/></Button> */}
                    <br/>
                    </Grid>
        
                    )
                }
                {
                    updateTechExpertise
                    ?
                    <Grid item xs={12}>
                        <Button variant='contained' color='success' className='custom-roundbutton' type='submit' size='small'>Save</Button>
                        &nbsp;
                        <Button variant='contained' color='error' className='custom-roundbutton' onClick={cancelUpdateTechExpertise} size='small'>Cancel</Button>
                    </Grid>
                    :
                    null
                }
                </Grid>
                </Grid>
                </Paper>
            </Grid>
            </form>
            {/* <form>
            <Grid item xs={12} sx={{mt:2}}>
                <Box component={Paper}  sx={{p:1}}>
                    <Grid item container spacing={2}>
                        <CustomComponent name = 'Trainings Attended (recent 5 years)' data = {trainingAtt} addData = {addTrainingAtt} deleteData = {deleteTrainingAtt} setDataValue = {setTrainingAttValue} required = {true}/>
                    </Grid>

                </Box>
            </Grid>
            </form>
            <form>
            <Grid item xs={12} sx={{mt:2}}>
                <Box component={Paper}  sx={{p:1}}>
                    <Grid item container spacing={2}>
                        <CustomComponent name = 'Professional Experience' data = {profExp} addData = {addProfExp} deleteData = {deleteProfExp} setDataValue = {setProfExpValue} required = {false}/>
                    </Grid>

                </Box>
            </Grid>
            </form>
            <form>
            <Grid item xs={12} sx={{mt:2}}>
                <Box component={Paper}  sx={{p:1}}>
                    <Grid item container spacing={2}>
                        <CustomComponent name = 'Technical Field of Expertise' data = {techExpertise} addData = {addTechExpertise} deleteData = {deleteTechExpertise} setDataValue = {setTechExpertiseValue} required = {true}/>
                    </Grid>

                </Box>
            </Grid>
            </form> */}
            <form onSubmit={submitUpdateReferences}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',background: '#1565c0',color: '#fff',padding: '10px',mt:2}}>
                <Typography sx={{fontWeight:'bold'}}>References</Typography>
                {
                    updateReferences
                    ?
                    null
                    :
                    <Tooltip title='Update References'><EditIcon sx={{'&:hover':{color:green[200],cursor:'pointer'}}} onClick={()=>setUpdateReferences(true)}/></Tooltip>

                }
            </Grid>
            <Grid item xs={12}>
                <Box component={Paper} sx={{p:1}}>
                    <Grid item sx= {12} container spacing={2}>
                        <Grid item xs={12}>
                        <TextField label='Name' fullWidth value = {refInfo.name} onChange = {(value) => handleSetRefInfo('name',value.target.value)} required disabled={updateReferences?false:true}/>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField label='Position' fullWidth value = {refInfo.position} onChange = {(value) => handleSetRefInfo('position',value.target.value)} required disabled={updateReferences?false:true}/>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField label='Company' fullWidth value = {refInfo.company} onChange = {(value) => handleSetRefInfo('company',value.target.value)} required disabled={updateReferences?false:true}/>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField label='Work Phone' fullWidth value = {refInfo.phone} onChange = {(value) => handleSetRefInfo('phone',value.target.value)} required disabled={updateReferences?false:true}/>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField type='email' label='Email' fullWidth value = {refInfo.email} onChange = {(value) => handleSetRefInfo('email',value.target.value)} required disabled={updateReferences?false:true}/>
                        </Grid>
                        {
                            updateReferences
                            ?
                            <Grid item xs={12}>
                                <Button variant='contained' color='success' className='custom-roundbutton' type='submit' size='small'>Save</Button>
                                &nbsp;
                                <Button variant='contained' color='error' className='custom-roundbutton' onClick={cancelUpdateReferences} size='small'>Cancel</Button>
                            </Grid>
                            :
                            null
                        }
                    </Grid>
                </Box>
            </Grid>
            
            </form>
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
                <Button variant='contained' color='success' onClick={handleUpdateMetaTags}>Update Meta Tags</Button>
            </Grid>
            
        </Grid>
    )
}