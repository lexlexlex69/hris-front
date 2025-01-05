import React,{useEffect, useState} from "react";
import {Box, Grid, TextField, Typography,FormControl,FormLabel,RadioGroup,FormControlLabel,Radio,Checkbox,Button} from '@mui/material';
import {blue} from '@mui/material/colors'
import { viewFilesUsingPathOnly } from "../pds/customFunctions/CustomFunctions";
import { getSurveyQuestions, postDTRLeaveSurvey } from "./SurveyRequest";
import Swal from "sweetalert2";
export default function DTRLeaveSurvey(props){
    const [question1,setQuestion1] = useState(0);
    const [question2,setQuestion2] = useState(0);
    const [question3,setQuestion3] = useState(0);
    const [question4,setQuestion4] = useState(0);
    const [question5,setQuestion5] = useState(0);
    const [question6,setQuestion6] = useState(0);
    const [question7,setQuestion7] = useState('');
    const [isCertify,setIsCertify] = useState(false);
    const [isReadNotice,setIsReadNotice] = useState(false);

    const [loadingQuestions,setLoadingQuestions] = useState(true);

    const [surveyName,setSurveyName] = useState('');
    const [surveyQuestions,setSurveyQuestions] = useState([]);
    const [surveyID,setSurveyID] = useState(1)
    useEffect(()=>{
        var t_data = {
            id:surveyID
        }
        getSurveyQuestions(t_data)
        .then(res=>{
            // res.data.questions.forEach(el=>{
            //     el.value = 0;
            // })
            console.log(res.data)
            
            setSurveyName(res.data.survey_name)
            setSurveyQuestions(res.data.questions)
            setLoadingQuestions(false)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleViewPrivacyNotice = () => {
        var url = '/api/master-files/privacy/viewPrivacyFile';
        var path = 'privacyNotice//63f5ae2310d72_Feb_22_2023_01_54_43.pdf';
        viewFilesUsingPathOnly(path,url)
    }
    
    const handleSave = (e) =>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Submitting survey',
            html:'Please wait...',
            showConfirmButton:false
        })
        Swal.showLoading()
        // var t_data = {
        //     question1:question1,
        //     question2:question2,
        //     question3:question3,
        //     question4:question4,
        //     question5:question5,
        //     question6:question6,
        //     question7:question7
        // }
        var t_data = {
            data:surveyQuestions,
            survey_id:surveyID
        }
        postDTRLeaveSurvey(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status===200){
                props.handleCloseSurvey()
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:3000,
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
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const handleSetValue = (index,val) => {
        var temp = [...surveyQuestions]
        temp[index].value = val
        setSurveyQuestions(temp)
    }
    return (
        <>
            {
                loadingQuestions
                ?
                <Typography sx={{textAlign:'center'}}>Loading survey. Please wait... </Typography>
                :
                <form onSubmit={handleSave}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {/* <Typography sx={{fontSize:'1.1rem',fontWeight:'bold',color:blue[800]}}>FEEDBACK ON DTR &amp; LEAVE (HRIS)</Typography> */}
                            <Typography sx={{fontSize:'1.1rem',fontWeight:'bold',color:blue[800]}}>{surveyName}</Typography>
                        
                        </Grid>
                        {
                            surveyQuestions.map((item,key)=>
                                item.type === 'radio'
                                ?
                                <Grid item xs={12} key={key}>
                                    <FormControl sx={{width:'100%'}}>
                                    <FormLabel id="demo-radio-buttons-group-label">{item.item_no} {item.question}</FormLabel>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                        <Typography>Poor</Typography>
                                        <RadioGroup
                                            aria-labelledby={"demo-radio-buttons-group-label"+item.item_no}
                                            name={"radio-buttons-group"+item.item_no}
                                            row
                                            sx={{display:'flex',gap:3}}
                                            value = {item.value}
                                            onChange = {(val)=>handleSetValue(key,val.target.value)}
                                        >
                                            <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={1} control={<Radio />} label="1" required = {item.is_required}/>
                                            <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={2} control={<Radio />} label="2" required = {item.is_required}/>
                                            <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={3} control={<Radio />} label="3" required = {item.is_required}/>
                                            <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={4} control={<Radio />} label="4" required = {item.is_required}/>
                                            <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={5} control={<Radio />} label="5" required = {item.is_required}/>
                                        </RadioGroup>
                                        <Typography>Outstanding</Typography>

                                    </Box>
                                </FormControl>
                                </Grid>
                                :
                                <Grid item xs={12}  key={key}>
                                    <Typography>{item.item_no} {item.question}</Typography>
                                    <TextField type='text' fullWidth value = {item.value} onChange = {(val)=>handleSetValue(key,val.target.value)} required = {item.is_required} placeholder={item.is_required?
                                    'Required':'Optional'}/>
                                </Grid>
                            )
                        }
                        {/* <Grid item xs={12} sx={{mt:2}}>
                            <FormControl sx={{width:'100%'}}>
                                <FormLabel id="demo-radio-buttons-group-label">1. System capture all the required processes in DTR and Leave Application? (Functionality of the System).</FormLabel>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                    <Typography>Poor</Typography>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group1-label"
                                        name="radio-buttons-group1"
                                        row
                                        sx={{display:'flex',gap:3}}
                                        value = {question1}
                                        onChange = {(val)=>setQuestion1(val.target.value)}
                                    >
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={1} control={<Radio />} label="1" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={2} control={<Radio />} label="2" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={3} control={<Radio />} label="3" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={4} control={<Radio />} label="4" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={5} control={<Radio />} label="5" required/>
                                    </RadioGroup>
                                    <Typography>Outstanding</Typography>

                                </Box>

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl sx={{width:'100%'}}>
                                <FormLabel id="demo-radio-buttons-group-label">2. System easy to navigate/use all the functions in the system? (Usability of the User Interface).</FormLabel>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                    <Typography>Poor</Typography>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group2-label"
                                        name="radio-buttons-group2"
                                        row
                                        sx={{display:'flex',gap:3}}
                                        value = {question2}
                                        onChange = {(val)=>setQuestion2(val.target.value)}
                                    >
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={1} control={<Radio />} label="1" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={2} control={<Radio />} label="2" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={3} control={<Radio />} label="3" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={4} control={<Radio />} label="4" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={5} control={<Radio />} label="5" required/>
                                    </RadioGroup>
                                    <Typography>Outstanding</Typography>

                                </Box>

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl sx={{width:'100%'}}>
                                <FormLabel id="demo-radio-buttons-group-label">3. System accessible 24/7 without any downtime?(Reliability of the System (Server Side)).</FormLabel>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                    <Typography>Poor</Typography>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group3-label"
                                        name="radio-buttons-group3"
                                        row
                                        sx={{display:'flex',gap:3}}
                                        value = {question3}
                                        onChange = {(val)=>setQuestion3(val.target.value)}
                                    >
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={1} control={<Radio />} label="1" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={2} control={<Radio />} label="2" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={3} control={<Radio />} label="3" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={4} control={<Radio />} label="4" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={5} control={<Radio />} label="5" required/>
                                    </RadioGroup>
                                    <Typography>Outstanding</Typography>

                                </Box>

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl sx={{width:'100%'}}>
                                <FormLabel id="demo-radio-buttons-group-label">4. System free from technical issues, bugs or glitches?(Technical issues, bugs, glitches encountered).</FormLabel>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                    <Typography>Poor</Typography>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group4-label"
                                        name="radio-buttons-group4"
                                        row
                                        sx={{display:'flex',gap:3}}
                                        value = {question4}
                                        onChange = {(val)=>setQuestion4(val.target.value)}
                                    >
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={1} control={<Radio />} label="1" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={2} control={<Radio />} label="2" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={3} control={<Radio />} label="3" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={4} control={<Radio />} label="4" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={5} control={<Radio />} label="5" required/>
                                    </RadioGroup>
                                    <Typography>Outstanding</Typography>

                                </Box>

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl sx={{width:'100%'}}>
                                <FormLabel id="demo-radio-buttons-group-label">5. Technical support available in 24/7 operations?(Availability of technical support).</FormLabel>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                    <Typography>Poor</Typography>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons5-group-label"
                                        name="radio-buttons-group5"
                                        row
                                        sx={{display:'flex',gap:3}}
                                        value = {question5}
                                        onChange = {(val)=>setQuestion5(val.target.value)}
                                    >
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={1} control={<Radio />} label="1" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={2} control={<Radio />} label="2" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={3} control={<Radio />} label="3" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={4} control={<Radio />} label="4" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={5} control={<Radio />} label="5" required/>
                                    </RadioGroup>
                                    <Typography>Outstanding</Typography>

                                </Box>

                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl sx={{width:'100%'}}>
                                <FormLabel id="demo-radio-buttons-group-label">6. How happy you are while using an online DTR and Leave Management?(Overall rating on the System Usage).</FormLabel>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                    <Typography>Poor</Typography>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        
                                        name="radio-buttons-group"
                                        row
                                        sx={{display:'flex',gap:3}}
                                        value = {question6}
                                        onChange = {(val)=>setQuestion6(val.target.value)}
                                    >
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={1} control={<Radio />} label="1" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={2} control={<Radio />} label="2" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={3} control={<Radio />} label="3" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={4} control={<Radio />} label="4" required/>
                                        <FormControlLabel sx = {{display:'flex',flexDirection:'column-reverse'}} value={5} control={<Radio />} label="5" required/>
                                    </RadioGroup>
                                    <Typography>Outstanding</Typography>

                                </Box>

                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>7. Do you have any suggestions or recommendation to further improve our services? (Comments and Recommendation on the overall usage).</Typography>
                            <TextField type='text' fullWidth value = {question7} onChange={(val)=>setQuestion7(val.target.value)}/>
                        </Grid> */}
                        <Grid item xs={12}>
                            <FormControlLabel  control={<Checkbox checked = {isCertify} onChange = {()=>setIsCertify(!isCertify)}/>} label="I hereby certify that the data provided in this survey are true and correct based on my actualexperience while using the system." />
                            <Box>
                                <FormControlLabel control={<Checkbox checked = {isReadNotice} onChange = {()=>setIsReadNotice(!isReadNotice)}/>} label="I agree to send my information to City Human Resource Management Office and use it according to their Privacy Notice"/>
                                <Button onClick={handleViewPrivacyNotice}>Read Privacy Notice</Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                            <Button variant="contained" color='primary' type="submit" disabled = {isCertify && isReadNotice ? false:true}>Submit</Button>
                            <Button variant="contained" color='error' onClick={props.close}>Cancel</Button>
                        </Grid>
                    </Grid>
                    </form>
            }
        </>
        
    )
}