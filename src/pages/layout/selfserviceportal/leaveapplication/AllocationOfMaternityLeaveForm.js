import React, { useEffect, useRef } from 'react';
import {Container,Grid, Typography,Box,Tooltip,IconButton} from '@mui/material';
import moment from 'moment';
import PrintIcon from '@mui/icons-material/Print';
import { PrintAllocationOfMaternityLeaveForm } from './Print/PrintAllocationOfMaternityLeaveForm';
import ReactToPrint,{useReactToPrint} from 'react-to-print';

export const AllocationOfMaternityLeaveForm = React.forwardRef((props,ref)=>{
    const printRef = useRef();
    const handlePrint  = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Notice of Allocation of Maternity Leave '+props.info.benefit_fullname.toUpperCase()

    });
    return(
        <div  ref ={ref}  id = "preview">
        <Container>
            <Grid container>
                <Grid item xs= {12} sx={{position:'sticky',top:-6,background:'#fff',zIndex:10,display:'flex',justifyContent:'flex-end'}}>
                    <Tooltip title='Print Maternity Allocation Form' ><IconButton color='primary' onClick={handlePrint}><PrintIcon/></IconButton></Tooltip>
                </Grid>
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
                        <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.position_name}</Typography>
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
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.paddress}</Typography>

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
                            <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.contact_details}</Typography>
                        
                    </Grid>
                    <Grid item xs = {5} sx={{height:'35px',borderBottom:'solid 1px'}}>
                    </Grid>
                    <Grid item xs = {12} sx={{padding:'10px'}}>
                        <Typography sx={{fontSize:'10px',textIndent:'30px'}}>I am allocating <strong><span style = {{borderBottom:'solid 1px'}}>&nbsp;{props.info.allocation_number_days}&nbsp;</span></strong> days (7 days max.) of my 105-day maternity leave to Mr./Ms. <strong><span style = {{borderBottom:'solid 1px'}}>&nbsp;{props.info.benefit_fullname.toUpperCase()}&nbsp;</span></strong>,
                        which benefit is granted under Republic Act No. 11210 or the 105-Day Expanded Maternity Law. Attached is the proof of our
                        relationship.
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx={{padding:'10px'}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                            <strong>____________<u>{props.info.lname}, {props.info.fname}, {props.info.mname}</u>__________</strong><br/>
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
                     <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.benefit_fullname}</Typography>
                    </Grid>
                    <Grid item xs = {5} sx={{height:'35px',borderBottom:'solid 1px'}}>
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.benefit_position}</Typography>
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
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.benefit_home_address}</Typography>
                    </Grid>

                    <Grid item xs = {5} sx={{height:'35px'}}>
                    <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.benefit_agency_address}</Typography>
                    </Grid>

                    <Grid item xs = {7} sx={{borderRight:'solid 1px',borderBottom:'solid 1px',background:'#ECEFF1'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'5px'}}>
                                CONTACT DETAILS <em>(Phone number and e-mail address)</em>
                            </Typography>
                    </Grid>
                    <Grid item xs = {5} >
                        
                    </Grid>
                    <Grid item xs = {7} sx={{height:'35px',borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                        <Typography sx={{fontSize:'10px', padding:'5px 0 0 5px',fontWeight:'600'}}>{props.info.benefit_contact_details}</Typography>
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
                                <input className='ex' type = "checkbox" defaultChecked = {props.info.benefit_relationship === "Childs father" ? true:false} readOnly/> Child’s father
                            </Typography>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" defaultChecked = {props.info.benefit_relationship === 'Alternate caregiver' ? true:false} readOnly/> Alternate caregiver
                            </Typography>
                            <Typography sx={{fontSize:'10px', paddingLeft:'24px'}}>
                                <input type = "checkbox" defaultChecked = {props.info.benefit_relationship === 'Alternate caregiver' ?props.info.benefit_relationship_details === "Relative within fourth degree of consanguinity" ? true:false:false} readOnly/> Relative within fourth degree of consanguinity<br/>
                                <em>(Specify: {props.info.benefit_relationship_details === "Relative within fourth degree of consanguinity" ? <u>{props.info.benefit_relationship_details_specify}</u>:'______________________'})</em>


                            </Typography>
                            <Typography sx={{fontSize:'10px', paddingLeft:'24px'}}>
                                <input type = "checkbox" defaultChecked = {props.info.benefit_relationship === 'Alternate caregiver' ?props.info.benefit_relationship === "Current partner sharing the same household" ? true:false :false} readOnly/> Current partner sharing the same household
                            </Typography>
                            </Grid>
                        </Box>

                    </Grid>
                    
                    <Grid item xs = {7} sx={{borderBottom:'solid 1px',padding:'15px'}}>
                        <Typography sx={{fontSize:'10px',textIndent:'30px'}}>
                            <em>I accept the allocated <strong><span style = {{borderBottom:'solid 1px'}}>&nbsp;{props.info.allocation_number_days}&nbsp;</span></strong> days of the 105-day maternity leave from the abovementioned female employee and I/we submit the attached proof of our relationship. It is understood that the allocated maternity leave is for the care of our/her newborn child.</em>

                        </Typography>
                        <Grid item xs = {12} sx={{padding:'10px'}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                            <div style={{position:'relative'}}>
                            <Typography sx={{fontSize:'10px',textAlign:'center'}}>
                                <img src={props.benefitsignatureimage} style={{position: 'absolute',
    height: '50px',top:'-15px',left:'50px'}}/>
                            <strong>____________<u>{props.info.benefit_fullname.toUpperCase()}</u>__________</strong><br/>
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
                                <input type = "checkbox" defaultChecked = {props.info.benefit_proof_relationship === "Childs Birth Certificate" ? true:false} readOnly/> Child’s Birth Certificate
                            </Typography> 
                    </Grid>
                    <Grid item xs = {3} sx={{borderRight:'solid 1px',padding:'10px 0 0 0',height:'60px'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" defaultChecked = {props.info.benefit_proof_relationship === "Marriage Certificate" ? true:false} readOnly/> Marriage Certificate
                            </Typography> 
                    </Grid>
                    <Grid item xs = {3} sx={{borderRight:'solid 1px',padding:'10px 0 0 0',height:'60px'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" defaultChecked = {props.info.benefit_proof_relationship === "Barangay Certificate" ? true:false} readOnly/> Barangay Certificate
                            </Typography> 
                    </Grid>
                    <Grid item xs = {3} sx={{height:'60px',padding:'10px 0 0 0'}}>
                            <Typography sx={{fontSize:'10px', paddingLeft:'10px'}}>
                                <input type = "checkbox" defaultChecked = {props.info.benefit_proof_relationship === "Other bona fide document/s that can prove filial relationship" ? true:false} readOnly/> Other bona fide document/s that can prove filial relationship
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
        <div style = {{display:'none'}}>
            <PrintAllocationOfMaternityLeaveForm ref={printRef} info={props.info}/>
        </div>
        </div>

    )
})
export default AllocationOfMaternityLeaveForm
