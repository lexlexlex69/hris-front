import React,{useState} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { Grid,Typography,Box } from '@mui/material';
import LogoFooter from '../../../.././assets/img/bbb.png'
import moment from 'moment';
import { autoCapitalizeFirstLetter } from '../../customstring/CustomString';
//Icons
import CheckIcon from '@mui/icons-material/Check';

export default function NominationForm(props){
    const themeBody = createTheme({
        typography: {
            // fontFamily: 'cambria',
            fontSize:10
        }
    });
    const formatExtName = (val)=>{
        var ext_names = ['JR.','JR','SR','SR.','I','II','III','IV','V','VI','VII','VIII'];
        if(val){
            if(ext_names.includes(val.toUpperCase())){
                return ', '+val;
            }else{
                return null
            }
        }
        return null
        
    }
    const formatPos = (val)=>{
        if(val){
            if(val.length>=50){
                return <Typography sx={{width:'100%',fontSize:10,borderBottom:'solid 1px'}}>{val}</Typography>

            }else{
                return <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{val}</Typography>
                
            }
        }else{
            return <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{val}</Typography>
        }
    }
    const formatOffice = (val)=>{
        if(val){
            if(val.length>=40){
                return <Typography sx={{width:'100%',fontSize:10,borderBottom:'solid 1px'}}>{autoCapitalizeFirstLetter(val)}</Typography>

            }else{
                return <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{autoCapitalizeFirstLetter(val)}</Typography>
            }
        }else{
            return <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{autoCapitalizeFirstLetter(val)}</Typography>
        }
        
    }
    const foodPreferences = ()=>{
        switch(props.preferences){
            case 1:
            case "1":
            return (
                <>
                <Typography><CheckIcon sx={{borderBottom:'solid 1px'}}/> NON-PORK/CHICKEN</Typography>
                <Typography>___ VEGAN DIET</Typography>
                <Typography>___ PORK/CHICKEN</Typography>
                </>
            )
            break;
            case 2:
            case "2":
            return (
                <>

                <Typography>___ NON-PORK/CHICKEN</Typography>
                <Typography><CheckIcon sx={{borderBottom:'solid 1px'}}/> VEGAN DIET</Typography>
                <Typography>___ PORK/CHICKEN</Typography>
                </>
            )
            break;
            case 3:
            case "3":
            return (
                <>
                <Typography>___ NON-PORK/CHICKEN</Typography>
                <Typography>___ VEGAN DIET</Typography>
                <Typography><CheckIcon sx={{borderBottom:'solid 1px'}}/> PORK/CHICKEN</Typography>
                </>
            )
            break;
            default:
             return (
                <>
                <Typography>___ NON-PORK/CHICKEN</Typography>
                <Typography>___ VEGAN DIET</Typography>
                <Typography><CheckIcon sx={{borderBottom:'solid 1px'}}/> PORK/CHICKEN</Typography>
                </>
            )
            break;


        }
    }
    return(
        <React.Fragment>
                <Grid container spacing={1}>
                <Grid item xs={12} sx={{textAlign:'center'}}>
                    <Typography sx={{fontWeight:600,fontSize:15}}>NOMINATION FORM</Typography>
                    <Typography sx={{fontSize:12,textDecoration:'underline'}}>(Kindly fill in all information needed)</Typography>
                </Grid>
                <ThemeProvider theme={themeBody}>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Typography sx={{width:'178px',fontWeight:600}}>TITLE OF THE TRAINING:</Typography>
                        <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>
                            {props.trainingDetails.training_name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Grid item xs={4} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600}}>DATE:</Typography>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>
                            {
                                props.trainingDetails.period_from === props.trainingDetails.period_to
                                ?
                                moment(props.trainingDetails.period_from).format('MMMM DD, YYYY')
                                :
                                moment(props.trainingDetails.period_from).format('MMMM DD-')+''+moment(props.trainingDetails.period_to).format('DD, YYYY')
                            }
                            </Typography>
                        </Grid>
                        <Grid item xs={8} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600}}>Venue:</Typography>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>
                                {props.trainingDetails.venue}
                            </Typography>
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Grid item xs={3}>
                        <Typography sx={{fontWeight:600,fontSize:11}}>NAME OF THE PARTICIPANT:</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{textAlign:'center'}}>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{props.data.lname}</Typography>
                            <Typography sx={{fontWeight:600,fontStyle:'italic'}}>(Surname)</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{textAlign:'center'}}>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{props.data.fname}{formatExtName(props.data.extname)}</Typography>
                            <Typography sx={{fontWeight:600,fontStyle:'italic'}}>(Given/First Name)</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{textAlign:'center'}}>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{props.data.mname}</Typography>
                            <Typography sx={{fontWeight:600,fontStyle:'italic'}}>(Middle Name)</Typography>
                        </Grid>
                    
                    </Grid>
                    
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Typography sx={{width:'77px',fontWeight:600}}>NICKNAME:</Typography>
                        <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>
                            
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Grid item xs={7} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600,width:'60px'}}>POSITION:</Typography>
                            {formatPos(props.data.position_name)}
                        </Grid>
                        <Grid item xs={5} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600,width:'314px'}}>EMPLOYMENT STATUS:</Typography>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{props.data.description}</Typography>
                        </Grid>
                    
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Grid item xs={7} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600,width:'125px'}}>OFFICE/DEPARTMENT:</Typography>
                            {formatOffice(props.data.dept_title)}
                        </Grid>
                        <Grid item xs={5} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600,width:'333px'}}>NO. OF YEARS IN SERVICE:</Typography>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}></Typography>
                        </Grid>
                    
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Grid item xs={7} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600,width:'140px'}}>MOBILE NUMBER:</Typography>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{props.data.cpno}</Typography>
                        </Grid>
                        <Grid item xs={5} sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Typography sx={{fontWeight:600,width:'154px'}}>EMAIL ADDRESS:</Typography>
                            <Typography sx={{width:'100%',borderBottom:'solid 1px'}}>{props.data.emailadd}</Typography>
                        </Grid>
                    
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:6}}>
                            <Box sx={{textAlign:'center'}}>
                                <Typography sx={{fontWeight:'bold',textDecoration:'underline',textTransform:'uppercase'}}>&nbsp;&nbsp;
                                {props.deptHead.office_division_assign}
                                &nbsp;&nbsp;
                                </Typography>
                                <Typography sx={{textAlign:'center'}}>
                                <strong>Department Head</strong> <br/>
                                (Signature over printed name)
                                
                                </Typography>
                            </Box>
                            
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{fontStyle:'italic',fontWeight:600,color:blue[900]}}>Food preference for internal trainings only or if applicable:</Typography>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                            {
                                foodPreferences()
                            }
                        </Box>
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Box>
                            {/* <Typography sx={{fontSize:10}}>Phone  : <span>(085) 341-7424</span></Typography> */}
                            <Typography sx={{fontSize:10}}>Phone  : </Typography>
                            <Typography sx={{fontSize:10}}>Email  : <span style={{color:blue[800]}}>chrmo@butuan.gov.ph</span></Typography>
                            <Typography sx={{fontSize:10}}>Website: <span style={{color:blue[800]}}>:http://www.butuan.gov.ph</span></Typography>
                        </Box>
                        <Box>
                            <img src={LogoFooter} height={40}/>
                            <Typography sx={{fontSize:10,lineHeight:1}}>
                            CGB.F.041.REV01 <br/>
                            05/18/2023
                            </Typography>
                        </Box>
                    
                    </Grid>
                </ThemeProvider>
                </Grid>

        </React.Fragment>
    )
}