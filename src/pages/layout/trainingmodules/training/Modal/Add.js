import React,{useEffect, useState} from 'react';
import {Grid,InputLabel ,MenuItem ,FormControl,Select,Button,TextField} from '@mui/material';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import { getAllTrainingName, getMetaTagsData, getTrainerByMetaTags, getTrainingRqmt, getTrainingType } from '../TrainingRequest';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();
export default function Add(props){
    const [trainingName, setTrainingName] = useState('');
    const [trainer, setTrainer] = useState([]);
    const [trainingType, setTrainingType] = useState('');
    const [trainingApplication, setTrainingApplication] = useState('');
    const [trainingTypeLD, setTrainingTypeLD] = useState('');
    const [conductedBy, setConductedBy] = useState('');
    const [trainingTypeLDData, setTrainingTypeLDData] = useState([]);
    const [category, setCategory] = useState('');
    const [rqmt, setRqmt] = useState([]);
    const [metaTags, setMetaTags] = useState([]);
    const [trnData,setTrnData] = useState([])
    const [trainerData,setTrainerData] = useState([])
    const [rqmtData,setRqmtData] = useState([])
    const [open, toggleOpen] = useState(false);
    const [metaTagsData, setMetaTagsData] = useState([]);
    const [newMetaTagsValue, setNewMetaTagsValue] = useState({
        meta_name:''
    });
    const handleClose = () => {
        setDialogValue({
          rqmt_name: ''
        });
    
        toggleOpen(false);
    };
    
    const [dialogValue, setDialogValue] = useState({
        rqmt_name: ''
    });
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(dialogValue)
        var temp = [...rqmtData]
        temp.push({rqmt_name:dialogValue.rqmt_name})
        setRqmtData(temp);
        setRqmt(dialogValue.rqmt_name);
        handleClose();
    };
    useEffect(()=>{
        getAllTrainingName()
        .then(res=>{
            setTrnData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        getTrainingRqmt()
        .then(res=>{
            console.log(res.data)
            setRqmtData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        getMetaTagsData()
        .then(res=>{
            res.data.push({
                meta_name:'All',
                meta_tags_desc:null,
                meta_name_temp:'All'
            })
            setMetaTagsData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        getTrainingType()
        .then(res=>{
            setTrainingTypeLDData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleSetTName = (event) => {
        var data2 = {
            meta_tags:event.target.value.meta_tags
        }
        getTrainerByMetaTags(data2)
        .then(res=>{
            if(res.data.length === 0){
                setTrainer([])
                setTrainerData([])
            }else{
                setTrainer([])
                setTrainerData(res.data)
            }
        }).catch(err=>{
            console.log(err)
        })
        console.log(event.target.value)
        setTrainingName(event.target.value);
        setTrainingTypeLD(event.target.value.type);
    };
    
    const handleSetCategory = (event) => {
        setCategory(event.target.value);
        setTrainingApplication('')
    };
    const handleSetTType = (event) => {
        if(event.target.value === 'Invitational'){
            setConductedBy('')
            // setTrainingApplication('REAP')
        }else{
            // setTrainingApplication('LAP/SAP')
            setConductedBy('City Government of Butuan')
        }
        setTrainingType(event.target.value);
    };
    const handleSetTApplication = (event) => {
        setTrainingApplication(event.target.value);
    };
    const handleSetTrainer= (event) => {
        setTrainer(event.target.value);
    };
    const handleSetRqmt = (event) => {
        setRqmt(event.target.value);
    };
    const submit = (event) =>{
        event.preventDefault()
        var data2 = {
            meta_tags:'*',
            // meta_tags:metaTags,
            category:category,
            training_type:trainingType,
            training_app:trainingApplication,
            training_name:trainingName,
            trainer:trainer,
            rqmt:rqmt,
            training_ld:trainingTypeLD,
            conducted_by:conductedBy
        }
        console.log(data2)
        props.handleDialogOpen(data2)
    }
    return(
        <form onSubmit={submit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{mt:1}}>
                    <FormControl fullWidth>
                        <InputLabel id="cat-select-label">Training/Scholarship *</InputLabel>
                        <Select
                        labelId="cat-select-label"
                        id="cat-select-label"
                        value={category}
                        label="Training/Scholarship *"
                        onChange={handleSetCategory}
                        required
                        >
                        <MenuItem value = 'Training'>Training</MenuItem>
                        <MenuItem value= 'Scholarship'>Scholarship</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {
                    category.length !==0
                    ?
                        category === 'Training'
                        ?
                        <>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="type-select-label">Training Type *</InputLabel>
                                <Select
                                labelId="type-select-label"
                                id="type-select-label"
                                value={trainingType}
                                label="Training Type *"
                                onChange={handleSetTType}
                                required
                                >
                                <MenuItem value='In House'>In House</MenuItem>
                                <MenuItem value='Invitational'>Invitational</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            trainingType === 'Invitational'
                            ?
                            <Grid item xs={12}>
                            <TextField label = 'Conducted/Sponsored by' type='text' value = {conductedBy} onChange = {(value)=>setConductedBy(value.target.value)} fullWidth required/>
                            </Grid>
                            :
                            null

                        }
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="application-select-label">Training Application *</InputLabel>
                                <Select
                                labelId="application-select-label"
                                id="application-select-label"
                                value={trainingApplication}
                                label="Training Application *"
                                onChange={handleSetTApplication}
                                required
                                >
                                <MenuItem value='LAP/SAP'>LAP/SAP</MenuItem>
                                <MenuItem value='REAP'>REAP</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="name-select-label">Training Name *</InputLabel>
                                <Select
                                labelId="name-select-label"
                                id="name-select-label"
                                value={trainingName}
                                label="Training Name *"
                                onChange={handleSetTName}
                                required
                                >
                                {
                                    trnData.map((data,key)=>
                                    <MenuItem value={data} key = {key}>{data.training_name} &nbsp;<small>{`${data.training_desc?'('+data.training_desc+')':''}`}</small></MenuItem>
                                    )
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {/* <FormControl fullWidth>
                                <InputLabel id="name-select-label">Type of LD/Training *</InputLabel>
                                <Select
                                labelId="name-select-label"
                                id="name-select-label"
                                value={trainingTypeLD}
                                label="Type of LD/Training *"
                                onChange={(value)=>setTrainingTypeLD(value.target.value)}
                                required
                                >
                                {
                                    trainingTypeLDData.map((data,key)=>
                                    <MenuItem value={data} key = {key}>{data.type_name}</MenuItem>
                                    )
                                }
                                </Select>
                            </FormControl> */}
                            <TextField label ='Type of LD/Training' value = {trainingTypeLD} disabled fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                id="trainer-box"
                                options={trainerData}
                                getOptionLabel={(option) => option.lname+', '+option.fname}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Trainer *"/>}
                                disableCloseOnSelect
                                multiple
                                value={trainer}
                                onChange={(event,newValue)=>{
                                    setTrainer(newValue)
                                }}
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                id="rqmt-box"
                                options={rqmtData}
                                getOptionLabel={(option) => option.rqmt_name}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Requirements *"/>}
                                disableCloseOnSelect
                                multiple
                                value={rqmt}
                                onChange={(event,newValue)=>{
                                    setRqmt(newValue)
                                }}
                                required
                            />
                            {/* <Autocomplete
                                value={rqmt}
                                onChange={(event, newValue) => {
                                    setRqmt(newValue);
                                // if (typeof newValue === 'string') {
                                //     // timeout to avoid instant validation of the dialog's form.
                                //     setTimeout(() => {
                                //     toggleOpen(true);
                                //     setDialogValue({
                                //         rqmt_temp: newValue
                                //     });
                                //     });
                                // } else if (newValue && newValue.inputValue) {
                                //     toggleOpen(true);
                                //     setDialogValue({
                                //         rqmt_temp: newValue.inputValue
                                //     });
                                // } else {
                                //     setRqmt(newValue);
                                // }
                                }}
                                // filterOptions={(options, params) => {
                                // const filtered = filter(options, params);

                                // if (params.inputValue !== '') {
                                //     filtered.push({
                                //     rqmt_temp: params.inputValue,
                                //     rqmt_name: `Add "${params.inputValue}"`,
                                //     });
                                // }

                                // return filtered;
                                // }}
                                // id="rqmt-dialog-demo"
                                // options={rqmtData}
                                // getOptionLabel={(option) => {
                                // // e.g value selected with enter, right from the input
                                // if (typeof option === 'string') {
                                //     return option;
                                // }
                                // if (option.inputValue) {
                                //     return option.inputValue;
                                // }
                                // return option.rqmt_temp;
                                // }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                renderOption={(props, option) => <li {...props}>{option.rqmt_name}</li>}
                                fullWidth
                                multiple
                                renderInput={(params) => <TextField {...params} label="Requirements"/>}
                                required
                                disableCloseOnSelect
                            /> */}
                            {/* <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Add a new requirements</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                    Please input new requirements name
                                    </DialogContentText>
                                    <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    value={dialogValue.rqmt_name}
                                    onChange={(event) =>
                                        setDialogValue({
                                        ...dialogValue,
                                        rqmt_name: event.target.value,
                                        })
                                    }
                                    label="title"
                                    type="text"
                                    variant="standard"
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={handleSubmit}>Add</Button>
                                </DialogActions>
                            </Dialog> */}
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Autocomplete
                                value={metaTags}
                                onChange={(event, newValue) => {

                                if (typeof newValue === 'string') {
                                    // timeout to avoid instant validation of the dialog's form.
                                    setTimeout(() => {
                                    toggleOpen(true);
                                    setDialogValue({
                                        meta_name: newValue
                                    });
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
                                options={metaTagsData}
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
                                renderInput={(params) => <TextField {...params} label="Meta Tags *"/>}
                                required
                                disableCloseOnSelect
                            />
                        </Grid> */}
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mt:2}}>
                            <Button variant ='contained' color='primary' type='submit' disabled={trainer.length === 0? true:false} className='custom-roundbutton'>
                                Generate shortlist <CallMadeOutlinedIcon fontSize='small'/>
                            </Button>
                        </Grid>
                        </>
                        :
                        <>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="application-select-label">Training Application *</InputLabel>
                                <Select
                                labelId="application-select-label"
                                id="application-select-label"
                                value={trainingApplication}
                                label="Training Application *"
                                onChange={handleSetTApplication}
                                required
                                >
                                <MenuItem value='REAP'>REAP</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="name-select-label">Training Name *</InputLabel>
                                <Select
                                labelId="name-select-label"
                                id="name-select-label"
                                value={trainingName}
                                label="Training Name *"
                                onChange={handleSetTName}
                                required
                                >
                                {
                                    trnData.map((data,key)=>
                                    <MenuItem value={data} key = {key}>{data.training_name} &nbsp;<small>({data.training_desc})</small></MenuItem>
                                    )
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                id="trainer-box"
                                options={trainerData}
                                getOptionLabel={(option) => option.lname+', '+option.fname}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Trainer *"/>}
                                disableCloseOnSelect
                                multiple
                                value={trainer}
                                onChange={(event,newValue)=>{
                                    setTrainer(newValue)
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* <Autocomplete
                                value={rqmt}
                                onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    // timeout to avoid instant validation of the dialog's form.
                                    setTimeout(() => {
                                    toggleOpen(true);
                                    setDialogValue({
                                        rqmt_temp: newValue
                                    });
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    toggleOpen(true);
                                    setDialogValue({
                                        rqmt_temp: newValue.inputValue
                                    });
                                } else {
                                    setRqmt(newValue);
                                }
                                }}
                                filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== '') {
                                    filtered.push({
                                    rqmt_temp: params.inputValue,
                                    rqmt_name: `Add "${params.inputValue}"`,
                                    });
                                }

                                return filtered;
                                }}
                                id="rqmt-dialog-demo"
                                options={rqmtData}
                                getOptionLabel={(option) => {
                                // e.g value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                return option.rqmt_temp;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                renderOption={(props, option) => <li {...props}>{option.rqmt_name}</li>}
                                fullWidth
                                multiple
                                renderInput={(params) => <TextField {...params} label="Requirements"/>}
                                required
                                disableCloseOnSelect
                            /> */}
                            <Autocomplete
                                disablePortal
                                id="rqmt-box"
                                options={rqmtData}
                                getOptionLabel={(option) => option.rqmt_name}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Requirements *"/>}
                                disableCloseOnSelect
                                multiple
                                value={rqmt}
                                onChange={(event,newValue)=>{
                                    setRqmt(newValue)
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                value={metaTags}
                                onChange={(event, newValue) => {

                                if (typeof newValue === 'string') {
                                    // timeout to avoid instant validation of the dialog's form.
                                    setTimeout(() => {
                                    toggleOpen(true);
                                    setDialogValue({
                                        meta_name: newValue
                                    });
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
                                options={metaTagsData}
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
                                renderInput={(params) => <TextField {...params} label="Meta Tags *"/>}
                                required
                                disableCloseOnSelect
                            />
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mt:2}}>
                            <Button variant ='contained' color='primary' type='submit' disabled={trainer.length || metaTags.length ===0 ? true:false} className='custom-roundbutton'>
                                Generate shortlist <CallMadeOutlinedIcon fontSize='small'/>
                            </Button>
                        </Grid>
                        </>
                    :
                    ''
                }
                
                {/* <Grid xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mt:2}}>
                    <Button variant ='contained' color='success' type='submit'>
                        Save
                    </Button>
                    &nbsp;
                    <Button variant ='contained' color='error' onClick={handleClose}>
                        Cancel
                    </Button>
                </Grid> */}
            </Grid>
            </form>
    )
}