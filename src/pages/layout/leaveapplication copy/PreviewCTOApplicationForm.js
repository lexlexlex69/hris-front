import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography,Checkbox,FormGroup,FormControlLabel } from '@mui/material';
import Logo from '../../.././assets/img/bl.png'
import moment from 'moment';
export const PreviewCTOApplicationForm = React.forwardRef((props,ref)=>{
    const formatNumber = (x) => {
        // return x;
        if(x<=0 || x === null || x === ''){
            return '-';
        }else{
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    return(
        <div ref ={ref} id = "coc-preview">
        <Grid container sx={{border:'solid 2px'}}>
            <Grid item xs={2} sx = {{borderRight:'solid 1px',textAlign:'center',padding:'20px 0 10px 0'}}>
                <Typography sx={{fontSize:'12px'}}>
                    CHRMO Form No.<br/>
                    CGB-0012018
                </Typography>
            </Grid>
            <Grid item xs={5} sx = {{borderRight:'solid 1px',textAlign:'center',padding:'20px 0 10px 0'}}>
                <Typography sx = {{fontWeight:'bold',fontSize:'13px'}} >
                    APPLICATION FOR AVAILMENT OF<br/>
                    COMPENSATORY TIME-OFF (CTO)
                </Typography>
            </Grid>
            <Grid item xs={5} sx = {{textAlign:'center',padding:'10px 0 10px 0'}}>
                <Grid container>
                    <Grid item xs={3}>
                        <img src={Logo} alt="" width={50} height={50} />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography sx = {{fontSize:'13px'}}>
                        Republic of the Philippines<br/>
                        CITY GOVERNMENT OF BUTUAN <br/>
                        J. Rosales Ave., Doongan, Butuan City
                    </Typography>
                    </Grid>
                </Grid>
               
            </Grid>
            <Grid item xs={7} sx = {{borderTop:'solid 1px',borderRight:'solid 1px',padding:'10px',fontSize:'12px'}}>
                <span style={{fontWeight:'bold',fontSize:'12px'}}>Name of Employee:  </span>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                     <span>(Last) </span> <span>(First)</span>(Middle)
                </Box>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <span style={{fontWeight:'bold'}}>{props.info.lname} </span>
                    <span style={{fontWeight:'bold'}}>{props.info.fname}</span>
                    <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                </Box>
            </Grid>
            <Grid item xs={5} sx = {{borderTop:'solid 1px',padding:'10px'}}>
                <Typography sx={{fontWeight:'bold',fontSize:'12px',marginTop:'18px'}}>
                    Position:
                </Typography>
                <Typography sx={{fontWeight:'bold',fontSize:'12px'}}>
                    {props.info.designation}
                </Typography>
            </Grid>
            <Grid item xs={4} sx = {{borderTop:'solid 1px',padding:'10px'}}>
                <Typography sx={{fontWeight:'bold',fontSize:'12px'}}>
                    Office/Department:
                </Typography>
                <Typography sx={{fontWeight:'bold',fontSize:'12px'}}>
                    {props.info.officedepartment}
                </Typography>
            </Grid>
            <Grid item xs={4} sx = {{borderTop:'solid 1px',borderRight:'solid 1px',padding:'10px'}}>
                <Typography sx={{fontWeight:'bold',fontSize:'12px'}}>
                    Monthly Salary:
                </Typography>
                <Typography sx={{fontWeight:'bold',fontSize:'12px'}}>
                    &#8369; {props.info.monthly_salary?formatNumber((props.info.monthly_salary/12).toFixed(2)):'N/A'}.00
                </Typography>
            </Grid>
            <Grid item xs={4} sx = {{borderTop:'solid 1px',padding:'10px'}}>
                <Typography sx={{fontWeight:'bold',fontSize:'12px'}}>
                    Date of Filing:
                </Typography>
                <Typography sx={{fontWeight:'bold',fontSize:'12px'}}>
                    {moment(props.date_of_filing).format('MMMM DD, YYYY')}
                </Typography>
            </Grid>
            <Grid item xs={12} sx = {{borderTop:'solid 1px',borderBottom:'solid 1px',textAlign:'center'}}>
                <Typography sx={{fontWeight:'bold',fontSize:'13px'}}>
                    DETAILS OF APPLICATION
                </Typography>
            </Grid>
            <Grid item xs={7} sx={{borderRight:'solid 1px',textAlign:'center',padding:'10px'}}>
                <Typography sx ={{fontWeight:'bold',fontSize:'12px'}}>
                    Number of Hours Applied For
                </Typography>
                <Typography sx ={{fontWeight:'bold',fontSize:'12px'}}>
                    {props.CTOHours}.00 HOURS
                </Typography>
            </Grid>
            <Grid item xs={5} sx={{textAlign:'center',padding:'10px'}}>
                <Typography sx ={{fontWeight:'bold',fontSize:'12px'}}>
                    Inclusive Date/s
                </Typography>
                <Typography sx ={{fontWeight:'bold',fontSize:'12px'}}>
                    {props.cto_dates}
                </Typography>
            </Grid>
            <Grid item xs={7} sx={{borderTop:'solid 1px',borderRight:'solid 1px',padding:'10px'}}>
                <Typography sx={{fontSize:'12px'}}>
                    Requested by:
                </Typography>
                <br/>
                <br/>
                <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                        <span style = {{fontWeight:'bold'}}><u>{props.info.fullname}</u></span><br/>
                        Applicant
                    </Typography>
            </Grid>
            <Grid item xs={5} sx={{borderTop:'solid 1px',padding:'10px'}}>
                <Typography sx={{fontSize:'12px'}}>
                    Recommending Approval by:
                </Typography>
                <br/>
                <br/>
                <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                        <span style = {{fontWeight:'bold'}}><u>{props.office_head?props.office_head.office_head.toUpperCase():''}</u></span><br/>
                        {props.office_head?props.office_head.office_head_pos:''}
                    </Typography>
            </Grid>
            
            <Grid item xs={12} sx = {{borderTop:'solid 1px',borderBottom:'solid 1px',textAlign:'center'}}>
                <Typography sx={{fontWeight:'bold',fontSize:'13px'}}>
                    DETAILS OF ACTION OF APPLICATION
                </Typography>
            </Grid>
            <Grid item xs={7} sx = {{padding:'10px',borderRight:'solid 1px'}}>
                <Typography sx ={{fontWeight:'bold',textAlign:'center',fontSize:'12px'}}>
                        CERTIFICATION OF COMPENSATORY OVERTIME CREDITS (COC)
                </Typography>
                <br/>
                <Typography sx={{fontSize:'12px'}}>
                       As of <span style ={{fontWeight:'bold',borderBottom:'solid 2px'}}>&nbsp;&nbsp;&nbsp;&nbsp;{moment(new Date()).format('MMMM YYYY')}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </Typography>
                <br/>
                <br/>
                <Grid container>
                    <Grid item xs={6}>
                        {/* {JSON.stringify(props.pendinginfo)} */}
                    <Typography sx={{fontSize:'12px'}}>
                        Number of Hours Earned:
                    </Typography>
                    <Typography sx={{fontSize:'12px'}}>
                        Used COC's:
                    </Typography>
                    <Typography sx={{fontSize:'12px'}}>
                        Remaining COC's: 
                    </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{fontSize:'12px'}}>
                    <u style ={{fontWeight:'bold'}}>___
                    {props.pendinginfo
                    ?
                    props.pendinginfo.status === 'FOR RECOMMENDATION' || props.pendinginfo.status === 'FOR APPROVAL' || props.pendinginfo.status === 'FOR REVIEW'
                        ?
                        props.pendinginfo.bal_before_process
                        :props.coc
                    :
                    props.balance
                    }
                    .00 HOURS___</u><br/>
                    <u style ={{fontWeight:'bold'}}>___{props.CTOHours}.00 HOURS___</u><br/>
                    <u style ={{fontWeight:'bold'}}>___
                    {props.pendinginfo
                    ?
                    props.pendinginfo.status === 'FOR RECOMMENDATION' || props.pendinginfo.status === 'FOR APPROVAL' || props.pendinginfo.status === 'FOR REVIEW'
                        ?
                        props.pendinginfo.bal_after_process
                        :props.coc-props.CTOHours
                    :
                    props.balance-props.CTOHours
                    }.00 HOURS___</u>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                        <span style = {{fontWeight:'bold'}}><u>{props.cto_info[0].cto_hr_name}</u></span><br/>
                        ({props.cto_info[0].cto_hr_name_pos})
                        
                    </Typography>
                
            </Grid>
            <Grid item xs={5} sx = {{padding:'10px' }}>
                    <Typography style = {{fontWeight:'bold',fontSize:'12px'}}>
                        Approval
                    </Typography>
                    <label style = {{fontSize:'12px'}}>
                        <input type="checkbox" checked = {props.approval === 1? true:false} readOnly/> &nbsp; Approval
                    </label>
                    <br/>
                    <label style = {{fontSize:'12px'}}>
                        <input type="checkbox" checked = {props.approval === 2? true:false} readOnly/> &nbsp; Disapproval due to
                    </label>
                    ___________<u>{props.approval === 2? props.disapproval:''}</u>________
                    <br/>
                    <br/>
                    <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                        {
                            props.auth_info.length !==0
                            ?
                            <>
                            <span style = {{fontWeight:'bold'}}>{props.auth_info[0].auth_name.toUpperCase()}</span><br/>
                            </>
                            :
                            ''
                        }
                        City Mayor/Authorized Representative
                    </Typography>
                    <br/>

                    <Typography sx={{fontSize:'12px'}}>
                        FOR THE MAYOR:
                    </Typography>
                    <br/>
                    <br/>
                    <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                        <span style = {{fontWeight:'bold'}}>{props.cto_info[0].cto_cmo_name}</span><br/>
                        {props.cto_info[0].cto_cmo_name_pos}<br/> <br/>
                        Date: ___________________________
                    </Typography>
            </Grid>
            <Grid item xs={12} sx = {{borderTop:'solid 1px',padding:'10px'}}>
                <Typography sx={{fontSize:'12px'}}>
                    Instructions:
                </Typography>
                <ol style={{fontSize:'12px'}}>
                    <li>This form shall be accomplished in two (2) copies.</li>
                    <li>The CTO may be availed of in blocks of four (4) or eight (8) hours.</li>
                    <li>The employee may use the CTO continuously up to maximum five (5) consecutive days per single availment, or on staggerd basis within the year.</li>
                    <li>The employee must first obtain approval from the head of office regarding the schedule of availment of CTO.</li>
                    <li>Attach approved Certificate of COC Earned (prescribed form under Joint CSC-DBM Circular No. 2, serires of 2004) for validation purposes.</li>
                </ol>
            </Grid>
        </Grid>
        </div>
    )
})