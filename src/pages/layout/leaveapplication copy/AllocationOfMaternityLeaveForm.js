import React, { useEffect } from 'react';
import {Container,Grid, Typography,Box} from '@mui/material';
import moment from 'moment';
import { Translate } from '@mui/icons-material';
export const AllocationOfMaternityLeaveForm = React.forwardRef((props,ref)=>{
    return(
        <div  ref ={ref}  id = "preview">
        <Container>
            <Grid container>
                <Grid item xs = {12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{fontSize:'10px',fontWeight:'600'}}>
                        <em>
                            CS Form No. 6a <br/>
                            Series of 2020
                        </em>
                    </Typography>
                    <Typography sx={{fontWeight:'bold'}}>
                        ANNEX B
                    </Typography>
                </Grid>
                <Grid item xs = {12} sx={{textAlign:'center'}}>
                    <Typography sx={{fontSize:'15px',fontWeight:'600'}}>
                        NOTICE OF ALLOCATION OF MATERNITY LEAVE
                    </Typography>
                </Grid>
                <Grid item xs = {12} sx={{marginTop:'15px', borderTop:'solid 2px'}}>
                </Grid>
                <Grid item xs = {12}>
                    <Typography sx={{fontSize:'13px',fontWeight:'600'}}>
                        I. FOR FEMALE EMPLOYEE
                    </Typography>
                </Grid>
                <Grid container sx = {{marginTop:'10px',display:'flex',flexDirection:'row' ,border:'solid 1px'}}>

                    <Grid item xs = {7}sx={{borderRight:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                NAME  <em>(Last Name, First Name, Name Extension, if any, and Middle Name)</em>
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{background:'#ECEFF1',borderBottom:'solid 1px'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                POSITION
                            </Typography>
                    </Grid>
                    <Grid item xs = {7} sx={{height:'35px',borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                        <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.lname}, {props.info.fname}, {props.info.mname}</Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{height:'35px',borderBottom:'solid 1px'}}>
                        <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.designation}</Typography>
                    </Grid>
                    <Grid item xs = {7} sx={{borderRight:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                HOME ADDRESS
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                AGENCY and ADDRESS
                            </Typography>
                    </Grid>
                    <Grid item xs = {7} sx={{borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.homeaddress}</Typography>

                    </Grid>
                    <Grid item xs = {5} sx={{height:'35px'}}>
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>City Government of Butuan, J. Rosales Ave., Butuan City</Typography>
                    </Grid>
                    <Grid item xs = {7} sx={{borderRight:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                CONTACT DETAILS <em>(Phone number and e-mail address)</em>
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} >
                    </Grid>
                    <Grid item xs = {7} sx={{height:'35px',borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                            {/* <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.employeeContactDetails}</Typography> */}
                            <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.cpno} -{props.info.emailadd}</Typography>
                        
                    </Grid>
                    <Grid item xs = {5} sx={{height:'35px',borderBottom:'solid 1px'}}>
                    </Grid>
                    <Grid item xs = {12} sx={{padding:'10px'}}>
                        <Typography sx={{fontSize:'10px',textIndent:'30px'}}>I am allocating <strong><span style = {{borderBottom:'solid 1px'}}>&nbsp;{props.allocate_days}&nbsp;</span></strong> days (7 days max.) of my 105-day maternity leave to Mr./Ms. <strong><span style = {{borderBottom:'solid 1px'}}>&nbsp;{props.allocatePersonFullname}&nbsp;</span></strong>,
                        which benefit is granted under Republic Act No. 11210 or the 105-Day Expanded Maternity Law. Attached is the proof of our
                        relationship.
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx={{padding:'10px'}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                            <strong>____________<u>{props.info.fullname}</u>__________</strong><br/>
                                SIGNATURE OVER PRINTED NAME
                            </Typography>
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                            <strong>_____<u>{moment(new Date()).format('MM-DD-YYYY')}</u>____</strong><br/>
                                DATE
                            </Typography>
                        </Box>
                       
                    </Grid>
                    
                </Grid>
                <Grid item xs = {12} sx={{marginTop:'15px', borderTop:'solid 2px'}}>
                </Grid>
                <Grid item xs = {12}>
                    <Typography sx={{fontSize:'13px',fontWeight:'600'}}>
                        II. FOR CHILD’S FATHER/ALTERNATE CAREGIVER
                    </Typography>
                </Grid>
                <Grid container sx = {{marginTop:'15px',display:'flex',flexDirection:'row' ,border:'solid 1px'}}>

                    <Grid item xs = {7}sx={{borderRight:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                NAME  <em>(Last Name, First Name, Name Extension, if any, and Middle Name)</em>
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{background:'#ECEFF1',borderBottom:'solid 1px'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                POSITION
                            </Typography>
                    </Grid>
                    <Grid item xs = {7} sx={{height:'35px',borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                     <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.allocatePersonFullname}</Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{height:'35px',borderBottom:'solid 1px'}}>
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.allocatePersonPosition}</Typography>
                    </Grid>
                    <Grid item xs = {7} sx={{borderRight:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                HOME ADDRESS
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px',paddingLeft:'5px'}}>
                                AGENCY and ADDRESS
                            </Typography>
                    </Grid>

                    <Grid item xs = {7} sx={{borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.allocatePersonHomeAddress}</Typography>
                    </Grid>

                    <Grid item xs = {5} sx={{height:'35px'}}>
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.allocatePersonAgencyAddress}</Typography>
                    </Grid>

                    <Grid item xs = {7} sx={{borderRight:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                CONTACT DETAILS <em>(Phone number and e-mail address)</em>
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} >
                        
                    </Grid>
                    <Grid item xs = {7} sx={{height:'35px',borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                        <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.allocatePersonAgencyAddress}</Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{height:'35px',borderBottom:'solid 1px'}}>
                    </Grid>
                    <Grid item xs = {5} sx={{borderBottom:'solid 1px',borderRight:'solid 1px'}}>
                        <Box sx={{display:'flex',flexDirection:'column'}}>
                            <Grid item xs = {12} sx={{background:'#ECEFF1',borderBottom:'solid 1px'}}>
                            <Typography sx={{fontSize:'10px', padding:'5px 10px 5px 10px'}}>
                                RELATIONSHIP TO THE FEMALE EMPLOYEE <br/>
                                <em>(Please mark the box with "x")</em>
                            </Typography>
                            </Grid>
                            <Grid item xs = {12}>
                            <Typography sx={{fontSize:'10px', padding:'5px 10px 0 10px'}}>
                                <input className='ex' type = "checkbox" checked = {props.maternityRelationship === "Childs father" ? true:false}/> Child’s father
                            </Typography>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" checked = {props.maternityRelationship === 'Alternate caregiver' ? true:false}/> Alternate caregiver
                            </Typography>
                            <Typography sx={{fontSize:'10px', paddingLeft:'24px'}}>
                                <input type = "checkbox" checked = {props.maternityRelationship === 'Alternate caregiver' ?props.maternityRelationshipDetails === "Relative within fourth degree of consanguinity" ? true:false:false}/> Relative within fourth degree of consanguinity<br/>
                                <em>(Specify: {props.maternityRelationshipDetails === "Relative within fourth degree of consanguinity" ? <u>{props.maternityRelationshipSpecifyDetails}</u>:'______________________'})</em>


                            </Typography>
                            <Typography sx={{fontSize:'10px', paddingLeft:'24px'}}>
                                <input type = "checkbox" checked = {props.maternityRelationship === 'Alternate caregiver' ?props.maternityRelationshipDetails === "Current partner sharing the same household" ? true:false :false}/> Current partner sharing the same household
                            </Typography>
                            </Grid>
                        </Box>

                    </Grid>
                    
                    <Grid item xs = {7} sx={{borderBottom:'solid 1px',padding:'15px'}}>
                        <Typography sx={{fontSize:'10px',textIndent:'30px'}}>
                            <em>I accept the allocated <strong><span style = {{borderBottom:'solid 1px'}}>&nbsp;{props.allocate_days}&nbsp;</span></strong> days of the 105-day maternity leave from the abovementioned female employee and I/we submit the attached proof of our relationship. It is understood that the allocated maternity leave is for the care of our/her newborn child.</em>

                        </Typography>
                        <Grid item xs = {12} sx={{padding:'10px'}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                            <div style={{position:'relative'}}>
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                                <img src={props.benefitsignatureimage} style={{position: 'absolute',
    height: '50px',top:'-15px',left:'50px'}}/>
                            <strong>____________<u>{props.benefitsignature}</u>__________</strong><br/>
                                SIGNATURE OVER PRINTED NAME
                            </Typography>
                            </div>
                           
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                            <strong>_____<u>{moment(new Date()).format('MM-DD-YYYY')}</u>____</strong><br/>
                                DATE
                            </Typography>
                        </Box>

                       
                    </Grid>
                    </Grid>
                   
                </Grid>
                <Grid item xs = {12} sx={{marginTop:'15px', borderTop:'solid 2px'}}>
                </Grid>
                <Grid container sx = {{marginTop:'15px',display:'flex',flexDirection:'row' ,border:'solid 1px'}}>
                    <Grid item xs = {12} sx={{borderBottom:'solid 1px',background:'#ECEFF1',textAlign:'center'}}>
                            <Typography sx={{fontSize:'10px'}}>
                                PROOF OF RELATIONSHIP<br/>
                                <em>(Please mark the box with “x” and attach a photocopy of the document)</em>
                            </Typography>
                    </Grid>
                    <Grid item xs = {3} sx={{borderRight:'solid 1px',padding:'10px 0 0 0',height:'60px'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" checked = {props.maternityRelationshipProof === "Childs Birth Certificate" ? true:false}/> Child’s Birth Certificate
                            </Typography> 
                    </Grid>
                    <Grid item xs = {3} sx={{borderRight:'solid 1px',padding:'10px 0 0 0',height:'60px'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" checked = {props.maternityRelationshipProof === "Marriage Certificate" ? true:false}/> Marriage Certificate
                            </Typography> 
                    </Grid>
                    <Grid item xs = {3} sx={{borderRight:'solid 1px',padding:'10px 0 0 0',height:'60px'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" checked = {props.maternityRelationshipProof === "Barangay Certificate" ? true:false}/> Barangay Certificate
                            </Typography> 
                    </Grid>
                    <Grid item xs = {3} sx={{height:'60px',padding:'10px 0 0 0'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" checked = {props.maternityRelationshipProof === "Other bona fide document/s that can prove filial relationship" ? true:false}/> Other bona fide document/s that can prove filial relationship
                            </Typography> 
                    </Grid>
                </Grid>
                <Grid item xs = {12} sx={{marginTop:'15px', borderTop:'solid 2px'}}>
                </Grid>
                <Grid item xs = {12}>
                    <Typography sx={{fontSize:'13px',fontWeight:'600'}}>
                    III. FOR THE HRMO AND THE HEAD OF OFFICE/AUTHORIZED OFFICIAL
                    </Typography>
                </Grid>
                <Grid container sx = {{marginTop:'15px',display:'flex',flexDirection:'row' ,border:'solid 1px'}}>
                    <Grid item xs = {6} sx={{padding:'10px',borderRight:'solid 1px'}}>
                        <Typography sx={{fontSize:'10px',textIndent:'30px'}}>
                                <em>I certify that Ms. <strong><span style = {{borderBottom:'solid 1px'}}>&nbsp;{props.info.fullname}&nbsp;</span></strong> has a maternity leave balance of days. Furthermore, I have reviewed and evaluated the attached supporting document/s and find the herein allocation of maternity leave in order.</em>
                        </Typography>
                        <Grid item xs = {12} sx={{padding:'10px'}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                            ___________________________________<br/>
                                SIGNATURE OVER PRINTED NAME<br/>
                                HRMO
                            </Typography>
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                                ________________<br/>
                                DATE
                            </Typography>
                        </Box>
                       
                    </Grid>
                    </Grid>
                    <Grid item xs = {6} sx={{borderRight:'solid 1px'}}>
                        <Box sx= {{display:'flex',flexDirection:'column'}}>
                            <Grid item xs = {12} sx={{textAlign:'center', background:'#ECEFF1',borderBottom:'solid 1px'}}>
                            <Typography sx={{fontSize:'10px'}}>
                                APPROVED:
                            </Typography>
                            </Grid>
                            <Grid item xs = {12}>
                                <br/>
                            <Typography sx={{textAlign:'center',fontSize:'10px'}}>
                                _____________________________________<br/>
                                SIGNATURE OVER PRINTED NAME <br/>
                                Head of Office/Authorized Official<br/><br/>

                                ___________________<br/>
                                DATE
                            </Typography>
                            </Grid>
                        </Box>
                        
                    </Grid>
                    <Grid item xs = {12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', padding:'0 0 0 5px'}}>
                                AGENCY, ADDRESS and CONTACT DETAILS
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{height:'40px'}}>
                    </Grid>
                </Grid>
                
            </Grid>
        </Container>
        </div>

    )
})
export default AllocationOfMaternityLeaveForm
