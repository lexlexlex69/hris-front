import { Box, Grid, Typography } from '@mui/material';
import React,{useEffect, useState} from 'react';
import LetterHead2 from '../../forms/letterhead/LetterHead2';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormFooter from '../../forms/footer/FormFooter';
import { autoCapitalizeFirstLetter } from '../../customstring/CustomString';
import moment from 'moment';

export const PreviewCTOApplicationForm2 = React.forwardRef((props,ref)=>{
    useEffect(()=>{
        console.log(props)
    },[])
    const theme = createTheme({
        typography: {
            fontFamily: 'cambria',

        }
    });
    const formatPos = (val)=>{
        if(val){
            if(val.includes('(')){
                var t_arr = val.split('(');
                return <span>{t_arr[0]} <br/> ({t_arr[1]}</span>;
            }else{
                return val;
            }
        }else{
            return val;
        }
        
    }
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
    const formatExtName2 = (val)=>{
        var ext_names = ['JR.','JR','SR','SR.','I','II','III','IV','V','VI','VII','VIII'];
        if(val){
            if(ext_names.includes(val.toUpperCase())){
                return ' '+val;
            }else{
                return null
            }
        }
        return null
        
    }
    const formatOffice = (val)=>{
        return <Typography sx={{lineHeight:1}}>{autoCapitalizeFirstLetter(val)}</Typography>

        // var val = val+'tst'
        // if(val.length>=38){
        //     return <Typography sx={{width:'100%',fontSize:13}}>{autoCapitalizeFirstLetter(val)}</Typography>

        // }else{
             
        // }
    }
    return(
        <div ref={ref} id = "cto-preview">
            {
                props.type === 'verification'
                ?
                <Box sx={{ml:2,mr:2}}>
                <Grid container>
                    <LetterHead2 fontSize={14}/>
                    <ThemeProvider theme={theme}>
                        <Grid item xs={12}>
                            <Typography sx={{textAlign:'center',lineHeight:1}}>
                                <strong>TIME OFFSET APPLICATION</strong> <br/>
                                <em>(for Non-Government Service Personnel)</em>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{border:'solid 1px',mt:1}}>
                            {/* 1st row */}
                            <Grid item container xs={12}>
                                <Grid item xs={8} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Name</Typography>
                                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                                        <Grid item xs={4}>
                                            <Typography><em>Last Name</em></Typography>
                                            <Typography>{props.info.lname}</Typography>

                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography><em>First Name</em></Typography>
                                            <Typography>{props.info.fname} {formatExtName(props.info.extname)}</Typography>

                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography><em>Middle Name</em></Typography>
                                            <Typography>{props.info.mname}</Typography>

                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4} sx={{pl:1,pr:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Position Title</Typography>
                                    <Typography sx={{lineHeight:1}}>{props.info.designation}</Typography>
                                </Grid>
                            </Grid>
                            {/* end of 1st row */}

                            {/* 2nd row */}
                            <Grid item container xs={12} sx={{borderTop:'solid 1px'}}>
                                <Grid item xs={5} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Office/Department</Typography>
                                    <Typography>{formatOffice(props.info.officeassign)}</Typography>
                                </Grid>
                                <Grid item xs={7} sx={{pl:1,pr:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Date of Filing</Typography>
                                    <Typography>{moment().format('MMMM DD,YYYY')}</Typography>
                                </Grid>
                            
                            </Grid>
                            {/* end of 2nd row */}

                            {/* 3rd row */}
                            <Grid item xs={12} sx={{borderTop:'solid 1px'}}>
                                <Typography sx={{fontWeight:'bold',textAlign:'center'}}>DETAILS OF APPLICATION</Typography>
                            </Grid>
                            {/* end of 3rd row */}


                            {/* 4th row */}
                            <Grid item container xs={12} sx={{borderTop:'solid 1px'}}>
                                <Grid item xs={5} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Number of Hours Applied for:</Typography>
                                    <Typography>{props.hours?props.hours:null} HOURS</Typography>
                                </Grid>
                                <Grid item xs={7} sx={{pl:1,pr:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Inclusive Date/s:</Typography>
                                    <Typography>{props.dates?props.dates:null}</Typography>
                                </Grid>
                            
                            </Grid>
                            {/* end of 4th row */}

                            {/* 5th row */}
                            <Grid item container xs={12} sx={{borderTop:'solid 1px'}}>
                                <Grid item xs={5} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Requested by:</Typography>
                                    <Typography sx={{textAlign:'center',pt:3,lineHeight:1}}>
                                    <u><strong>{props.info.fname} {props.info.mname?props.info.mname.charAt(0)+'.':' '} {props.info.lname} {formatExtName2(props.info.extname)}</strong></u> <br/>
                                    {formatPos(props.info.designation)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} sx={{pl:1,pr:1,mb:1}}>
                                    <Typography sx={{fontWeight:'bold'}}>Recommending Approval:</Typography>
                                    <Typography sx={{textAlign:'center',pt:3,lineHeight:1}}>
                                    <u><strong>{props.deptHead.office_head}</strong></u> <br/>
                                    {formatPos(props.deptHead.office_head_pos)}
                                    </Typography>
                                </Grid>
                            
                            </Grid>
                            {/* end of 5th row */}

                            {/* 6th row */}
                            <Grid item xs={12} sx={{borderTop:'solid 1px'}}>
                                <Typography sx={{fontWeight:'bold',textAlign:'center'}}>DETAILS OF ACTION ON APPLICATION</Typography>
                            </Grid>
                            {/* end of 6th row */}

                            {/* 7th row */}
                            <Grid item container xs={12} sx={{borderTop:'solid 1px',pl:1,pr:1}}>
                                <Grid item container xs={6} sx={{display:'flex',flexDirection:'column'}}> 
                                    <Typography sx={{fontWeight:'bold'}}>Certificate of Earned Time Off (ETO)</Typography>
                                    <Box sx={{display:'flex',flexDirection:'row',}}>
                                        <Grid item xs={6}>
                                        <Typography>ETO Balance:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{pl:1,width:'100%',borderBottom:'solid 1px'}}>{props.availableCOC?props.availableCOC:null}</Typography>
                                        </Grid>
                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',mt:-3}}>
                                        <Grid item xs={6}>
                                            <Typography>Less this application:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{pl:1,width:'100%',borderBottom:'solid 1px'}}>{props.hours?props.hours:null}</Typography>
                                        </Grid>

                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',mt:-3}}>
                                        <Grid item xs={6}>
                                        <Typography>Remaining Balance:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{pl:1,width:'100%',borderBottom:'solid 1px'}}>{props.hours?(props.availableCOC-props.hours).toFixed(3):null}</Typography>
                                        </Grid>

                                    </Box>

                                    <Box>
                                        <Typography sx={{textAlign:'center',pt:3,lineHeight:1}}>
                                        <u><strong>{props.aoInfo.office_ao}</strong></u> <br/>
                                        {formatPos(props.aoInfo.office_ao_assign)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            
                            </Grid>
                            {/* end of 7th row */}
                            
                            {/* 8th row */}
                            <Grid item container xs={12} sx={{pl:1,pr:1,display:'flex',flexDirection:'row-reverse'}}>
                                <Grid item container xs={6} sx={{display:'flex',flexDirection:'column'}}>
                                    <label>
                                        <input type = 'checkbox'/>   Approval
                                    </label>
                                    <label>
                                        <input type = 'checkbox'/>   Disapproval due to
                                    </label>
                                    <span style={{marginTop:10,borderBottom:'solid 1px',width:'100%'}}></span>
                                    <span style={{marginTop:20,borderBottom:'solid 1px',width:'100%'}}></span>
                                </Grid>
                            </Grid>
                            
                            {/* end of 8th row */}
                            
                            {/* 9th row */}
                            <Grid item xs={12} sx={{mt:7,mb:1}}>
                                <Typography sx={{textAlign:'center',lineHeight:1}}>
                                <strong style={{textTransform:'uppercase'}}>{props.authInfo?props.authInfo[0].auth_name:null}</strong> <br/>
                                City Mayor
                                </Typography>
                            </Grid>
                            {/* end of 9th row */}

                            {/* 10th row */}
                            {/* <Grid item xs={12} sx={{borderTop:'solid 1px'}}>
                                <Typography>
                                    Instructions:
                                </Typography>
                                <ol>
                                    <li><Typography>This form shall be accomplished at least in two (2) copies.</Typography></li>
                                    
                                    <li><Typography>The Time Offset (TO) may be availed in blocks of four (4) or eight (8) hours or equivalent of half day or full day for those with different work schedule.</Typography></li>
                                    
                                    <li><Typography>The personnel may use the TO continuously up to a maximum five (5) consecutive days per single availment, or on staggered basis within six (6) months.</Typography></li>
                                    
                                    <li><Typography>The personnel must first obtain approval from the Department Head regarding the schedule of availment of TO.</Typography></li>
                                </ol>

                            </Grid> */}
                            <Grid item xs={12} sx={{borderTop:'solid 1px'}}>
                            <Typography>
                                Instructions:
                            </Typography>
                            <ol style={{fontFamily:'cambria',fontSize:'14px'}}>
                                <ol style={{fontFamily:'cambria',fontSize:'14px'}}>
                                    <li>This form shall be accomplished at least in two (2) copies.</li>
                                    <li>The Time Offset (TO) may be availed in blocks of four (4) or eight (8) hours or equivalent of half day or full day for those with different work schedule.</li>
                                    <li>The personnel may use the TO continuously up to a maximum five (5) consecutive days per single availment, or on staggered basis within six (6) months.</li>
                                    <li>The personnel must first obtain approval from the Department Head regarding the schedule of availment of TO.</li>
                                </ol>
                            </ol>
                        </Grid>
                            {/* end of 10th row */}

                            
                        </Grid>
                    </ThemeProvider>
                    {/* Footer */}
                    <FormFooter font = {12} version='CGB.F.073.REV00' phone = '(085) 817-5598' email='cmo.butuan@gmail.com' website='http://www.butuan.gov.ph'/>

                </Grid>
            </Box>
                :
                
                <Box sx={{ml:2,mr:2}}>
                <Grid container>
                        <LetterHead2 fontSize={14}/>
                        <ThemeProvider theme={theme}>
                            <Grid item xs={12}>
                                <Typography sx={{textAlign:'center',lineHeight:1}}>
                                    <strong>TIME OFFSET APPLICATION</strong> <br/>
                                    <em>(for Non-Government Service Personnel)</em>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{border:'solid 1px',mt:1}}>
                                {/* 1st row */}
                                <Grid item container xs={12}>
                                    <Grid item xs={8} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Name</Typography>
                                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                                            <Grid item xs={4}>
                                                <Typography><em>Last Name</em></Typography>
                                                <Typography>{props.info.lname}</Typography>

                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography><em>First Name</em></Typography>
                                                <Typography>{props.info.fname} {formatExtName(props.info.extname)}</Typography>

                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography><em>Middle Name</em></Typography>
                                                <Typography>{props.info.mname}</Typography>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4} sx={{pl:1,pr:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Position Title</Typography>
                                        <Typography>{props.info.designation}</Typography>
                                    </Grid>
                                </Grid>
                                {/* end of 1st row */}

                                {/* 2nd row */}
                                <Grid item container xs={12} sx={{borderTop:'solid 1px'}}>
                                    <Grid item xs={5} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Office/Department</Typography>
                                        <Typography>{formatOffice(props.info.officeassign)}</Typography>
                                    </Grid>
                                    <Grid item xs={7} sx={{pl:1,pr:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Date of Filing</Typography>
                                        <Typography>{moment(props.dateOfFiling).format('MMMM DD,YYYY')}</Typography>
                                    </Grid>
                                
                                </Grid>
                                {/* end of 2nd row */}

                                {/* 3rd row */}
                                <Grid item xs={12} sx={{borderTop:'solid 1px'}}>
                                    <Typography sx={{fontWeight:'bold',textAlign:'center'}}>DETAILS OF APPLICATION</Typography>
                                </Grid>
                                {/* end of 3rd row */}


                                {/* 4th row */}
                                <Grid item container xs={12} sx={{borderTop:'solid 1px'}}>
                                    <Grid item xs={5} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Number of Hours Applied for:</Typography>
                                        <Typography>{props.hours?props.hours:null} HOURS</Typography>
                                    </Grid>
                                    <Grid item xs={7} sx={{pl:1,pr:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Inclusive Date/s:</Typography>
                                        <Typography>{props.dates?props.dates:null}</Typography>
                                    </Grid>
                                
                                </Grid>
                                {/* end of 4th row */}

                                {/* 5th row */}
                                <Grid item container xs={12} sx={{borderTop:'solid 1px'}}>
                                    <Grid item xs={5} sx={{borderRight:'solid 1px',pl:1,pr:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Requested by:</Typography>
                                        <Typography sx={{textAlign:'center',pt:3,lineHeight:1}}>
                                        <u><strong>{props.info.fname} {props.info.mname?props.info.mname.charAt(0)+'.':' '} {props.info.lname} {formatExtName2(props.info.extname)}</strong></u> <br/>
                                        {formatPos(props.info.designation)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={7} sx={{pl:1,pr:1,mb:1}}>
                                        <Typography sx={{fontWeight:'bold'}}>Recommending Approval:</Typography>
                                        <Typography sx={{textAlign:'center',pt:3,lineHeight:1}}>
                                        <u><strong>{props.deptHead.office_head}</strong></u> <br/>
                                        {formatPos(props.deptHead.office_head_pos)}
                                        </Typography>
                                    </Grid>
                                
                                </Grid>
                                {/* end of 5th row */}

                                {/* 6th row */}
                                <Grid item xs={12} sx={{borderTop:'solid 1px'}}>
                                    <Typography sx={{fontWeight:'bold',textAlign:'center'}}>DETAILS OF ACTION ON APPLICATION</Typography>
                                </Grid>
                                {/* end of 6th row */}

                                {/* 7th row */}
                                <Grid item container xs={12} sx={{borderTop:'solid 1px',pl:1,pr:1}}>
                                    <Grid item container xs={6} sx={{display:'flex',flexDirection:'column'}}> 
                                        <Typography sx={{fontWeight:'bold'}}>Certificate of Earned Time Off (ETO)</Typography>
                                        <Box sx={{display:'flex',flexDirection:'row',}}>
                                            <Grid item xs={6}>
                                            <Typography>ETO Balance:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography sx={{pl:1,width:'100%',borderBottom:'solid 1px'}}>{props.availableCOC?props.availableCOC.toFixed(3):null}</Typography>
                                            </Grid>
                                        </Box>
                                        <Box sx={{display:'flex',flexDirection:'row',mt:-3}}>
                                            <Grid item xs={6}>
                                                <Typography>Less this application:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography sx={{pl:1,width:'100%',borderBottom:'solid 1px'}}>{props.hours?props.hours:null}</Typography>
                                            </Grid>

                                        </Box>
                                        <Box sx={{display:'flex',flexDirection:'row',mt:-3}}>
                                            <Grid item xs={6}>
                                            <Typography>Remaining Balance:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography sx={{pl:1,width:'100%',borderBottom:'solid 1px'}}>{props.hours?(props.availableCOC-props.hours).toFixed(3):null}</Typography>
                                            </Grid>

                                        </Box>

                                        <Box>
                                            <Typography sx={{textAlign:'center',pt:3,lineHeight:1}}>
                                            <u><strong>{props.aoInfo.office_ao}</strong></u> <br/>
                                            {formatPos(props.aoInfo.office_ao_assign)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                
                                </Grid>
                                {/* end of 7th row */}
                                
                                {/* 8th row */}
                                <Grid item container xs={12} sx={{pl:1,pr:1,display:'flex',flexDirection:'row-reverse'}}>
                                    <Grid item container xs={6} sx={{display:'flex',flexDirection:'column'}}>
                                        <label>
                                            <input type = 'checkbox'/>   Approval
                                        </label>
                                        <label>
                                            <input type = 'checkbox'/>   Disapproval due to
                                        </label>
                                        <span style={{marginTop:10,borderBottom:'solid 1px',width:'100%'}}></span>
                                        <span style={{marginTop:20,borderBottom:'solid 1px',width:'100%'}}></span>
                                    </Grid>
                                </Grid>
                                
                                {/* end of 8th row */}
                                
                                {/* 9th row */}
                                <Grid item xs={12} sx={{mt:7,mb:1}}>
                                    <Typography sx={{textAlign:'center',lineHeight:1}}>
                                    <strong style={{textTransform:'uppercase'}}>{props.authInfo?props.authInfo[0].auth_name:null}</strong> <br/>
                                    City Mayor
                                    </Typography>
                                </Grid>
                                {/* end of 9th row */}

                                {/* 10th row */}
                                <Grid item xs={12} sx={{borderTop:'solid 1px'}}>
                                    <Typography sx={{pl:2}}>
                                        Instructions:
                                    </Typography>
                                    <ol style={{fontFamily:'cambria',fontSize:'14px'}}>
                                        <li>This form shall be accomplished at least in two (2) copies.</li>
                                        <li>The Time Offset (TO) may be availed in blocks of four (4) or eight (8) hours or equivalent of half day or full day for those with different work schedule.</li>
                                        <li>The personnel may use the TO continuously up to a maximum five (5) consecutive days per single availment, or on staggered basis within six (6) months.</li>
                                        <li>The personnel must first obtain approval from the Department Head regarding the schedule of availment of TO.</li>
                                    </ol>
                                </Grid>
                                {/* end of 10th row */}

                                
                            </Grid>
                        </ThemeProvider>
                        {/* Footer */}
                        <FormFooter font = {12} version='CGB.F.073.REV00' phone = '(085) 817-5598' email='cmo.butuan@gmail.com' website='http://www.butuan.gov.ph'/>

                    </Grid>
                
            </Box>
            }
        
        </div>
    )
})

export default PreviewCTOApplicationForm2