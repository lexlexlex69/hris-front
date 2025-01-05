import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import LetterHead from "../../forms/letterhead/LetterHead";
import LetterHead2 from "../../forms/letterhead/LetterHead2";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from "moment";
import { formatDeptName, formatPositionName, truncateToDecimalsCOC } from "../../customstring/CustomString";
import FormFooter from "../../forms/footer/FormFooter";
export default function PrintFormCOC2(props){
    useEffect(()=>{
        console.log(props)
    },[])
    const themeHeader = createTheme({
        typography: {
            fontFamily: 'cambria',
        }
    });
    return(
        <Box sx={{m:2,display:'flex',justifyContent:'center'}}>
            <Box sx={{width:'8.3in'}}>
                <LetterHead2/>
                <ThemeProvider theme={themeHeader}>
                <Grid container sx={{mt:5}}>
                    <Grid item xs={12}>
                        <Typography sx={{textAlign:'center'}}><span style={{fontSize:'1.3rem',fontWeight:'bold'}}>CERTIFICATE OF EARNED TIME OFF (CETO)</span><br/>
                        <span style={{fontSize:'1.1rem',fontStyle:'italic'}}>(for Non-Government Service Personnel)</span>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',mt:5}}>
                        <Grid item xs={5} sx={{display:'flex',justifyContent:'flex-end',pt:1}}>
                            <Typography>This is is to certify that Mr./Ms.</Typography>
                        </Grid>
                        <Grid item xs={7} sx={{pl:1,textAlign:'center',position:'relative'}}>
                            <Typography sx={{borderBottom:'solid 1px #000',fontWeight:'bold'}}>{props.employeeInfo.data.lname}, {props.employeeInfo.data.fname}, {props.employeeInfo.data.mname?props.employeeInfo.data.mname.charAt(0)+'.':''}
                            </Typography>
                            <Typography sx={{fontSize:'.7rem',fontStyle:'italic'}}>
                                (Name of Personnel LAST, FIRST, MI)
                            </Typography>
                            <span style={{position:'absolute',right:'-5px',top:'8px'}}>,</span>
                        </Grid>
                        
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',mt:1}}>
                        <Grid item xs={5} sx={{textAlign:'center'}}>
                            <Typography sx={{borderBottom:'solid 1px #000',lineHeight:props.employeeInfo.data.position_name?props.employeeInfo.data.position_name.length>48?1:'auto':'auto',fontWeight:'bold'}}>
                            {formatPositionName(props.employeeInfo.data.position_name)}
                            </Typography>
                            <Typography sx={{fontSize:'.7rem',fontStyle:'italic'}}>
                                (Position Title)
                            </Typography>
                        </Grid>
                        <Grid item xs={1} sx={{pt:1,pl:1,pr:1}}>
                            <Typography>
                            of the
                            </Typography>
                        </Grid>
                        <Grid item xs={5} sx={{textAlign:'center'}}>
                            <Typography sx={{borderBottom:'solid 1px #000',lineHeight:props.employeeInfo.data.dept.length>48?1:'auto',fontWeight:'bold'}}>
                            {formatDeptName(props.employeeInfo.data.dept)}
                            </Typography>
                            <Typography sx={{fontSize:'.7rem',fontStyle:'italic'}}>
                                (Office)
                            </Typography>
                        </Grid>
                        <Grid item xs={1} sx={{pt:1,pl:1,pr:1}}>
                            <Typography sx={{textAlign:'right'}}>
                            is
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',mt:1}}>
                        <Grid item xs={1.5} sx={{pt:1,pl:1,pr:1}}>
                            <Typography>
                            entitled to
                            </Typography>
                        </Grid>
                        <Grid item xs={1.5} sx={{textAlign:'center'}}>
                            <Typography sx={{borderBottom:'solid 1px #000',fontWeight:'bold'}}>
                            {truncateToDecimalsCOC(props.hours)}
                            </Typography>
                            <Typography sx={{fontSize:'.7rem',fontStyle:'italic'}}>
                                (No. of Hours)
                            </Typography>
                        </Grid>
                        <Grid item xs={5} sx={{pt:1,pl:1,pr:1}}>
                            <Typography>
                            hours of Earned Time Off for the period of 
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign:'center'}}>
                            <Typography sx={{borderBottom:'solid 1px #000',fontWeight:'bold'}}>
                            {(moment(props.date).format('MMMM YYYY')).toUpperCase()}
                            </Typography>
                            <Typography sx={{fontSize:'.7rem',fontStyle:'italic'}}>
                                (Month and Year)
                            </Typography>
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',mt:1}}>
                        <Grid item xs={1.5} sx={{pt:1,pl:1,pr:1}}>
                            <Typography>
                            valid until 
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign:'center'}}>
                            <Typography sx={{borderBottom:'solid 1px #000',fontWeight:'bold'}}>
                            {(moment(props.date).add('months',6).format('MMMM YYYY')).toUpperCase()}
                            </Typography>
                            <Typography sx={{fontSize:'.7rem',fontStyle:'italic'}}>
                                (Month and Year)
                            </Typography>
                        </Grid>
                        <Grid item xs={1.5} sx={{pt:1,pl:1,pr:1}}>
                            <Typography>
                            .
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{mt:10,textAlign:'center'}} >
                        <Typography>Certified by: <br/><br/>
                        ___________________________________
                        </Typography>
                        <Typography sx={{mt:5}}>
                            <strong>Reviewed by:</strong>
                        </Typography>

                        <Typography sx={{mt:5}}>
                            <u><strong>{props.deptHeadInfo.head_name}</strong></u><br/>
                            {props.deptHeadInfo.head_pos}
                        </Typography>

                        <Typography sx={{mt:5}}>
                            <strong>Approved by:</strong>
                        </Typography>


                        <Typography sx={{mt:5}}>
                            <u><strong>ENGR. RONNIE VICENTE C. LAGNADA</strong></u><br/>
                            City Mayor
                        </Typography>


                    </Grid>
                    <Grid item xs={12}>
                        <FormFooter font = {12} version='CGB.F.071.REV00' phone = '(085) 817-5598' email='cmo.butuan@gmail.com' website='http://www.butuan.gov.ph'/>
                    </Grid>
                </Grid>
                </ThemeProvider>
            </Box>
        </Box>
    )   
}