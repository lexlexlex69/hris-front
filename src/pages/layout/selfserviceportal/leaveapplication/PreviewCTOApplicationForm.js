import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography,Checkbox,FormGroup,FormControlLabel } from '@mui/material';
import Logo from '../../../.././assets/img/bl.png'
import LogoFooter from '../../../.././assets/img/bbb.png'
import moment from 'moment';
import { blue, grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LetterHead2 from '../../forms/letterhead/LetterHead2';
import FormFooter from '../../forms/footer/FormFooter';
export const PreviewCTOApplicationForm = React.forwardRef((props,ref)=>{
    // useEffect(()=>{
    //     console.log(props)
    // },[])
    const theme = createTheme({
        typography: {
            fontFamily: 'cambria',
        }
    });

    const themeRow = createTheme({
        typography: {
            fontFamily: 'cambria',
            fontSize:12
        }
    });

    const themeheader = createTheme({
        typography: {
            fontFamily: 'cambria'
        }
    });
    const themeFooter = createTheme({
        typography: {
            // fontFamily: 'cambria',
            color:blue[900],
            fontSize:12
        }
    });
    const formatNumber = (x) => {
        // return x;
        if(x<=0 || x === null || x === ''){
            return '-';
        }else{
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
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
    return(
        <div ref ={ref} id = "coc-preview">
        
        <Grid container>
            {/* <ThemeProvider theme={themeheader}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1,ml:1,mr:1,position:'relative'}}>
                <img src={Logo} alt="" width={90} height={90} />
                <Box sx={{color:blue[900],width:'100%'}}>
                    <Typography sx={{lineHeight:'20px'}}>
                        Republic of the Philippines <br/>
                        <strong>GOVERNMENT OF BUTUAN</strong> <br/>
                        City Hall Building, J.P. Rosales Ave., Doongan, Butuan City
                    </Typography>
                    <Box sx={{width:'95%',height:'5px',background:blue[900],position:'absolute',left:'20px',zIndex:'-1'}}></Box>
                    <Box sx={{width:'95%',height:'10px',background:blue[800],position:'absolute',left:'20px',bottom:'16px',zIndex:'-1'}}></Box>
                </Box>
            </Grid>
            </ThemeProvider> */}
            <LetterHead2 fontSize={14}/>
            <ThemeProvider theme={theme}>
            <Grid item xs={12}>
                <Typography sx={{textAlign: 'center',fontSize: '1.3rem',textTransform: 'uppercase',fontWeight: 'bold'}}>Application for availment of compensatory time-off (CTO)</Typography>
            </Grid>
            <Grid item xs={12} >
                <Grid item container sx={{border:'solid 1px'}}>
                <ThemeProvider theme={themeRow}>
                    {/* First Row */}
                    <Grid item xs={3} sx={{borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>OFFICE/DEPARTMENT</Typography>
                            <Typography sx={{textAlign:'center'}}>{props.info.officedepartment}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{borderRight:'solid 1px',borderBottom:'solid 1px'}}>
                        <Box>
                            <Box sx={{display:'flex',justifyContent:'space-around'}}>
                                <Box sx={{textAlign:'center'}}>
                                    <Typography sx={{fontWeight:'600'}}>NAME (Last)</Typography>
                                    <Typography>{props.info.lname}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{fontWeight:'600'}}>(First)</Typography>
                                    <Typography>{props.info.fname}{formatExtName(props.info.extname)}</Typography>

                                </Box>
                                <Box>
                                    <Typography sx={{fontWeight:'600'}}>(Middle)</Typography>
                                    <Typography>{props.info.mname}</Typography>

                                </Box>
                            </Box>
                            
                        </Box>
                    </Grid>
                    <Grid item xs={3} sx={{borderBottom:'solid 1px'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>APPOINTMENT STATUS</Typography>
                            <Typography sx={{textAlign:'center'}}>{props.info.description}</Typography>
                        </Box>
                    </Grid>
                    {/* End of First Row */}

                    {/* Second Row */}
                    <Grid item xs={3} sx={{borderBottom:'solid 1px',borderRight:'solid 1px'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>DATE OF FILING</Typography>
                            {
                                props.pendinginfo
                                ?
                                <Typography sx={{textAlign:'center'}}>{moment(props.pendinginfo.date_of_filing).format('MMMM DD,YYYY')}</Typography>

                                :
                                <Typography sx={{textAlign:'center'}}>{moment().format('MMMM DD,YYYY')}</Typography>


                            }
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{borderBottom:'solid 1px',borderRight:'solid 1px'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>POSITION</Typography>
                            <Typography sx={{textAlign:'center',lineHeight:1}}>{props.info.designation}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} sx={{borderBottom:'solid 1px'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>SALARY</Typography>
                            <Typography sx={{textAlign:'center'}}>&#8369; {props.info.monthly_salary?formatNumber((props.info.monthly_salary/12).toFixed(2)):'N/A'}</Typography>
                        </Box>
                    </Grid>
                    {/* End of Second Row */}
                    
                </ThemeProvider>
                    {/* Third Row */}

                    <Grid item xs={12} sx={{borderBottom:'solid 1px'}}>
                        <Box sx={{background:blue[200],textAlign:'center'}}>
                            <Typography sx={{fontWeight:'bold'}}>DETAILS OF APPLICATION</Typography>
                        </Box>
                    </Grid>
                    {/* End of Third Row */}

                    <ThemeProvider theme={themeRow}>
                    {/* Fourth Row */}

                    <Grid item xs={6} sx={{borderBottom:'solid 1px',borderRight:'solid 1px'}}>
                        <Box sx={{pl:1,textAlign:'center'}}>
                            <Typography sx={{fontWeight:'600'}}>NUMBER OF HOURS APPLIED FOR</Typography>
                            <Typography sx={{textAlign:'center'}}>{props.CTOHours}.00 HOURS</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{borderBottom:'solid 1px'}}>
                        <Box sx={{pl:1,textAlign:'center'}}>
                            <Typography sx={{fontWeight:'600'}}>INCLUSIVE DATE/S</Typography>
                            <Typography sx={{textAlign:'center'}}>{props.cto_dates}</Typography>
                        </Box>
                    </Grid>
                    {/* End of Fourth Row */}

                    {/* Fifth Row */}

                    <Grid item xs={6} sx={{borderBottom:'solid 1px',borderRight:'solid 1px',pb:1}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>REQUESTED BY:</Typography>
                            <Box sx={{lineHeight:0,textAlign:'center',mt:5}}>
                            <Typography sx={{fontWeight:'bold'}}><u>&nbsp;{props.info.fname} {props.info.mname?props.info.mname.charAt(0)+'. ':' '}{props.info.lname}{formatExtName(props.info.extname)}&nbsp;</u></Typography>
                            <Typography sx={{lineHeight:1}}>{formatPos(props.info.designation)}</Typography>
                            
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{borderBottom:'solid 1px'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>RECOMMENDING APPROVAL BY:</Typography>
                            <Box sx={{textAlign:'center',lineHeight:0,mt:3}}>
                            <Typography sx={{fontWeight:'bold'}}><u>&nbsp;
                            {
                                props.office_head
                                ?
                                    props.office_head.office_head
                                    ?
                                    props.office_head.office_head.toUpperCase()
                                    :
                                    ''
                                :''
                                }&nbsp;</u></Typography>
                            <Typography sx={{lineHeight:1}}>
                            {props.office_head?formatPos(props.office_head.office_head_pos):''}</Typography>
                            </Box>
                            <Typography sx={{mt:1}}>Date:
                            <u>
                            {
                                props.pendinginfo
                                ?
                                    props.pendinginfo.recommendation_at
                                    ?
                                    moment(props.pendinginfo.recommendation_at).format('MMMM DD, YYYY')
                                    :
                                    null
                                :null}
                            </u>
                            </Typography>
                        </Box>
                    </Grid>
                    {/* End of Fifth Row */}
                    </ThemeProvider>
                    {/* Sixth Row */}

                    <Grid item xs={12} sx={{borderBottom:'solid 1px'}}>
                        <Box sx={{background:blue[200],textAlign:'center'}}>
                            <Typography sx={{fontWeight:'bold'}}>DETAILS OF ACTION OF APPLICATION</Typography>
                        </Box>
                    </Grid>
                    {/* End of ThiSixthrd Row */}

                    <ThemeProvider theme={themeRow}>
                    {/* Seventh Row */}

                    <Grid item xs={6} sx={{borderBottom:'solid 1px',borderRight:'solid 1px',position:'relative'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>CERTIFICATION OF COMPENSATORY OVERTIME CREDITS (COC)</Typography>
                            <Typography sx={{mt:1,textAlign:'center'}}>as of _____<u>{moment().subtract(1,'months').format('MMMM YYYY')}</u>______</Typography>
                            <Box sx={{display:'flex',justifyContent:'center',mt:1}}>
                            <table className='coc-table'>
                                <thead>
                                    <tr>
                                        <td>

                                        </td>
                                        <td>
                                            <span></span>COC ( Number of Hours)
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Earned
                                        </td>
                                        <td align='right' style={{paddingRight:'50px'}}>
                                            {props.pendinginfo
                                                ?
                                                // props.pendinginfo.status === 'FOR RECOMMENDATION' || props.pendinginfo.status === 'FOR APPROVAL' || props.pendinginfo.status === 'FOR REVIEW'
                                                //     ?
                                                //     parseFloat(props.pendinginfo.bal_before_process).toFixed(3)
                                                //     :
                                                //     parseFloat(props.coc).toFixed(3)
                                                parseFloat(props.pendinginfo.bal_before_process).toFixed(3)
                                                :
                                                parseFloat(props.balance).toFixed(3)
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Used
                                        </td>
                                        <td align='right' style={{paddingRight:'50px'}}>
                                            {props.CTOHours?props.CTOHours.toFixed(3):''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Balance
                                        </td>
                                        <td align='right' style={{paddingRight:'50px'}}>
                                            {props.pendinginfo
                                            ?
                                            // props.pendinginfo.status === 'FOR RECOMMENDATION' || props.pendinginfo.status === 'FOR APPROVAL' || props.pendinginfo.status === 'FOR REVIEW'
                                            //     ?
                                            //     parseFloat(props.pendinginfo.bal_after_process).toFixed(3)
                                            //     :
                                            //     parseFloat(props.coc-props.CTOHours).toFixed(3)
                                            parseFloat(props.pendinginfo.bal_after_process).toFixed(3)
                                            :
                                            parseFloat(props.balance-props.CTOHours).toFixed(3)
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </Box>
                            <Box sx={{mt:4,textAlign:'center'}}>
                                <Typography sx={{fontWeight:'bold'}}><u>{props.office_ao?props.office_ao.office_ao?props.office_ao.office_ao.toUpperCase():'':''}</u></Typography>
                                <Typography sx={{lineHeight:1}}>{props.office_ao?formatPos(props.office_ao.office_ao_assign):''}</Typography>
                            </Box>
                            <Box sx={{pl:1,mt:3}}>
                                <Typography sx={{position:'absolute',bottom:0}}>Date:
                                <u>
                                {
                                    props.pendinginfo
                                    ?
                                        props.pendinginfo.reviewed_at
                                        ?
                                        moment(props.pendinginfo.reviewed_at).format('MMMM DD, YYYY')
                                        :
                                        null
                                    :null}
                                </u></Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{borderBottom:'solid 1px',pb:1,position:'relative'}}>
                        <Box sx={{pl:1}}>
                            <Typography sx={{fontWeight:'600'}}>RECOMMENDATION</Typography>
                            <Box sx={{pl:5}}>
                            <label style={{mt:1,mb:1}}>
                                <input type='checkbox' checked = {props.pendinginfo?props.pendinginfo.status === 'FOR APPROVAL'|| props.pendinginfo.status === 'APPROVED'? true:false:false} readOnly/> Approval
                            </label><br/>
                            <label style={{mt:1,mb:1}}>
                                <input type='checkbox' checked = {props.pendinginfo?props.pendinginfo.status === 'DISAPPROVED'? true:false:false} readOnly/> Disapproval due to
                            </label>
                            <span style={{paddingLeft:'15px'}}>_____________________________________________</span><br/>
                            <span style={{paddingLeft:'15px'}}>_____________________________________________</span>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex',justifyContent:'center',mt:4}}>
                            <Box sx={{lineHeight:0,textAlign:'center'}}>
                            <Typography sx={{borderTop:'solid 1px',fontWeight:'bold',textTransform:'uppercase',lineHeight:1}}>{props.auth_info[0]&&props.auth_info[0].auth_name}</Typography><br/>
                            <Typography>City Mayor/Authorized Representative</Typography>
                            </Box>

                        </Box>
                        <Box sx={{pl:1,mt:2,mb:1}}>
                            <Typography>For the City Mayor:</Typography>
                        </Box>
                         <Box sx={{textAlign:'center'}}>
                            {/* <Typography sx={{lineHeight:1}}>
                            <strong>ATTY. JOSEPH IAN B. SABADO</strong><br/>
                            City Administrator
                            </Typography> */}
                            <Typography sx={{lineHeight:1}}>
                            <strong>ATTY. NOEL EPHRAIM R. ANTIGUA</strong><br/>
                            Assistant City Administrator
                            </Typography>
                        </Box>
                        <Box sx={{pl:1,mt:1}}>
                        <Typography sx={{position:'absolute',bottom:0}}>Date:
                        <u>
                        {
                            props.pendinginfo
                            ?
                                props.pendinginfo.approved_at
                                ?
                                moment(props.pendinginfo.approved_at).format('MMMM DD, YYYY')
                                :
                                null
                            :null}
                        </u>
                        </Typography>
                        
                        </Box>

                    </Grid>
                    {/* End of Seventh Row */}


                    {/* End of Eight Row */}
                    <Grid item xs={12} sx={{pl:1}}>
                        <Typography>
                            Instructions:
                        </Typography>
                        <ol style={{fontFamily:'cambria',fontSize:'14px'}}>
                            <li>This form shall be accomplished in two (2) original copies.</li>
                            <li>The CTO may be availed of in blocks of four (4) or eight (8) hours.</li>
                            <li>The employee may use the CTO continuously up to maximum five (5) consecutive days per single availment, or on staggerd basis within the year.</li>
                            <li>The employee must first obtain approval from the head of office regarding the schedule of availment of CTO.</li>
                            <li>Attach approved Certificate of COC Earned (prescribed form under Joint CSC-DBM Circular No. 2, serires of 2004) for validation purposes.</li>
                        </ol>
                    </Grid>
                    {/* End of Eight Row */}
                    </ThemeProvider>
                    
                </Grid>
            
            </Grid>
            </ThemeProvider>
            {/* <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Typography sx={{fontFamily:'cambria',fontSize:11,fontWeight:'bold'}}>CGB.F.081.REV00</Typography>
            </Grid> */}
            {/* Footer */}
            <FormFooter font = {12} version='CGB.F.081.REV00' phone = '(085) 817-5598' email='cmo.butuan@gmail.com' website='http://www.butuan.gov.ph'/>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
            <small style={{color:grey[600],fontSize:'.5rem',float:'right',fontStyle:'italic'}}>* Printed from HRIS - {moment().format('MMMM DD, YYYY hh:mm a')}</small>
            </Grid>

            {/* <ThemeProvider theme={themeFooter}>
            <Grid item xs={12} sx={{pb:1,display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'solid 5px '+blue[700]}}>
                <Box>
                    <Typography>Phone: &nbsp;&nbsp;&nbsp;&nbsp;(085) 817-5598</Typography>
                    <Typography>Email: &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:blue[900]}}> cmo.butuan@gmail.com</span></Typography>
                    <Typography>Website: &nbsp;http://www.butuan.gov.ph</Typography>
                </Box>
                <Box>
                    <img src={LogoFooter} height={40} width={'100%'}/>
                </Box>
                
            </Grid>
            </ThemeProvider> */}
            {/* End of Footer */}
        </Grid>
        </div>
    )
})