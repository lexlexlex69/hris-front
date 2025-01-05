import React, { useEffect } from 'react'
import './Preview.css';
import moment from 'moment';
import { Grid, Typography,Box} from '@mui/material';
import Logo from '../../.././assets/img/bl.png'
export const PreviewLeaveApplicationForm = React.forwardRef((props,ref)=>{
    const date = moment(new Date()).format('MMMM DD,YYYY')
    const formatCreditAvailableDecimal = (leaveBalance,appliedDays) => {
        let tens = [10,100,1000,10000,100000];
        let b1 = leaveBalance.toString().split('.');
        let b1_max = 0;
        if(b1.length===2){
            b1_max=b1[1].length
        }
        let tens_mult = tens[b1_max-1];
        let b1_fin = Math.floor(leaveBalance*tens_mult);
        let b2 = appliedDays*tens_mult;
        if(appliedDays>leaveBalance){
            let b1_fin2 = Math.floor(leaveBalance) * tens_mult;
            let comp = (b1_fin - b1_fin2 ) / tens_mult
            return comp;
        }else{
            let comp = (b1_fin - b2 ) / tens_mult
            return comp;
        }
    }
    useEffect(()=>{
        console.log(props.office_head)
    },[])
    const formatNumber = (x) => {
        // return x;
        if(x<=0 || x === null || x === ''){
            return '-';
        }else{
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    return(
        <div ref={ref} id="preview" style={{position:'relative'}}>
            {
                props.previewType === 'applicant'
                ?
                <>
                 <div style = {{position:'absolute'}}>
                    <em><h5 style={{fontSize:'9px',fontWeight:'bold'}}>Civil Service Form No. 6 <br/>
                    Revised 2020</h5></em>
                    </div>
                    <div style = {{position:'absolute',margin:'0 0 0 140px'}}>
                        <img src={Logo} alt="" width={70} height={70} />
                    </div>
                    <div className='center'>
                        <h5 className='font-header'>Republic of the Philippines<br/>
                        City Government of Butuan<br/>
                        J. Rosales Ave., Butuan City</h5>
                    </div>
                    <div className='center'>
                        <h3 style = {{fontSize:'19px',fontWeight:'bold'}}>APPLICATION FOR LEAVE</h3>
                    </div>
                    <div className='print'>
                    <Grid container sx={{border:'solid 1px'}}>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px'}}>
                            <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                <h5 style={{fontSize:'12px'}}>
                                    1. OFFICE/DEPARTMENT  <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.officeassign}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    2. NAME :
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (LAST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.lname}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (FIRST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.fname}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (MIDDLE) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                                </h5>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px',borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    3. DATE OF FILING &nbsp;
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{date}</span>
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    4. POSITION &nbsp;
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{props.info.designation}</span>
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    5. SALARY &nbsp;
                                    {props.info.monthly_salary
                                    ?
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>&#8369; {formatNumber((props.info.monthly_salary/12).toFixed(2))}</span>
                                    :
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>N/A</span>
                                        
                                    }
                                    
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                6. DETAILS OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx = {{fontSize:'12px'}}>
                                6.A TYPE OF LEAVE TO BE AVAILED OF
                            </Typography>
                            {props.data.map((data,key)=>
                                <div  key = {key}>
                                    {data.leave_type_id === 15 || data.leave_type_id === 14
                                    ?
                                    ''
                                    :
                                    <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === data.leave_type_id  ? true:false} readOnly/>&nbsp;{data.leave_type_name} <small className='label-desc'>{data.leave_desc}</small>
                                    </label>
                                    }
                                    
                                </div>
                                )}
                                <br/>
                            <Grid item xs={10}>
                                <Typography sx = {{fontSize:'12px'}}>
                                    <em>Others:</em>
                                </Typography>
                                <Typography sx = {{paddingLeft:'10px',fontWeight:'bold',fontSize:'12px',borderBottom:'solid 1px',marginBottom:'10px',paddingBottom:'5px'}}>
                                    {
                                    props.leaveType === 15
                                    ?
                                    props.specifyDetails
                                    :
                                    ''
                                    }
                                </Typography>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={5} sx ={{borderTop:'solid 1px',padding:'0 10px 0 10px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.B DETAILS OF LEAVE </Typography>
                                <em className='info-header'>In case of Vacation/Special Privilege Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11 || props.leaveDetails === 17?true:false :false} readOnly/> &nbsp;Within the Philippines &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11 || props.leaveDetails === 17
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                            <span>_____________________</span>
                                        :
                                        <span>_____________________</span>
                                    :
                                    <span>_____________________</span>
                                    }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12 || props.leaveDetails === 18?true:false :false} readOnly/> &nbsp;Abroad (Specify) &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12 || props.leaveDetails === 18
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                            <span>_________________________</span>
                                        :
                                        <span>_________________________</span>
                                    :
                                    <span>_________________________</span>


                                }
                                </label>
                                <br/>
                                
                                <em className='info-header'>In case of Sick Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 5?true:false :false} readOnly/> &nbsp;In Hospital (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 5
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                            <span>_________________</span>
                                        :
                                        <span>_________________</span>
                                    :
                                    <span>_________________</span>


                                }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 6?true:false :false} readOnly/> &nbsp;Out Patient (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 6
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                        <span>________________<br/>____________________________________________</span>
                                        :
                                        <span>________________<br/>____________________________________________</span>
                                    :
                                    <span>________________<br/>____________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Special Leave Benefits for Women:</em><br/>
                                <label className='label'>
                                    (Specify Illness) {
                                    props.leaveType === 11
                                    ?
                                        props.specifyDetails !== ''
                                        ?
                                        <u>_____{props.specifyDetails}_____</u>
                                        :
                                        <span>____________________________________________</span>
                                    :
                                    <span>____________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Study Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 8 ? props.leaveDetails === 7?true:false :false} readOnly/> &nbsp;Completion of Master's Degree
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox"  checked = {props.leaveType === 8 ? props.leaveDetails === 8?true:false :false} readOnly/> &nbsp;BAR/Board Examination Review
                                </label>
                                <br/>

                                <em className='info-header'>Other purpose:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 9?true:false :false} readOnly/> &nbsp;Monetization of Leave Credits
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 10?true:false :false} readOnly/> &nbsp;Terminal Leave
                                </label>
                        </Grid>
                        <Grid item xs = {7} sx={{borderTop:'solid 1px',borderRight:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    6.C NUMBER OF WORKING DAYS APPLIED FOR
                                </Typography>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.leaveType === 4 ? props.maternity_days : props.applied_days} {props.applied_days>1?' days':' day'}</strong>
                                    </Typography>
                                </Grid>
                                
                                <br/>
                                <h5 className='info-header'>INCLUSIVE DATES</h5>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.inclusiveDates}</strong>
                                    </Typography>
                                </Grid>
                                
                        </Grid>
                        <Grid item xs = {5} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.D COMMUTATION</Typography>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Not Requested'?true:false} readOnly/> &nbsp;Not Requested
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Requested'?true:false} readOnly/> &nbsp;Requested
                                </label>
                                <br/>
                                <div className='center'>
                                    <span style={{fontSize:'9px'}}>______________<u><strong>{props.info.fullname}</strong></u>___________________</span>
                                    <br/>
                                    <span className='info-header'>Signature of Applicant</span>
                                </div>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                7. DETAILS OF ACTION OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.A CERTIFICATION OF LEAVE CREDITS
                            </Typography>
                            <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                                As of <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{moment(new Date()).format('MMMM YYYY')}</span>
                            </Typography>
                            <table style={{border: '1px solid',width:'100%',fontSize:'9px'}}>
                                    <thead>
                                        <tr >
                                        <th>
                                        
                                        </th>
                                        <th style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Vacation Leave
                                        </th>
                                        <th  style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Sick Leave
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Total Earned</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                                {
                                                props.leaveType === 15
                                                ?
                                                props.availableVL
                                                :
                                                props.leaveType ===1 || props.leaveType ===2
                                                ?
                                                props.balance
                                                :
                                                props.availableVL
                                                }
                                                </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                props.availableSL
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.balance
                                                :
                                                props.availableSL
                                                }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Less this Application</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?   
                                                    props.leaveDetails === 9
                                                    ?
                                                    props.totalVL
                                                    :
                                                    props.availableVL
                                                :
                                                props.leaveType === 1 || props.leaveType === 2
                                                ?   
                                                    props.applied_days>Math.floor(props.balance) ? Math.floor(props.balance):props.applied_days
                                                :
                                                ''
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.leaveType === 15
                                            ?
                                                props.leaveDetails === 9
                                                ?
                                                props.totalSL
                                                :
                                                props.availableSL
                                            :
                                            props.leaveType === 3
                                            ?
                                                props.applied_days-props.slAutoWithoutPay>props.balance ? props.balance:props.applied_days-props.slAutoWithoutPay
                                            :
                                            ''
                                            }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Balance</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                    props.leaveDetails === 9
                                                    ?
                                                    formatCreditAvailableDecimal(props.availableVL,Math.floor(props.totalVL))
                                                    :
                                                    props.availableVL-props.availableVL
                                                :
                                                props.leaveType === 1 || props.leaveType === 2
                                                ?
                                                    props.applied_days>props.balance
                                                    ?
                                                    formatCreditAvailableDecimal(props.balance,Math.floor(props.balance))
                                                    :
                                                    formatCreditAvailableDecimal(props.balance,props.applied_days)
                                                :
                                                ''
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                    props.leaveDetails === 9
                                                    ?
                                                    formatCreditAvailableDecimal(props.availableSL,Math.floor(props.totalSL))
                                                    :
                                                    props.availableSL-props.availableSL
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.applied_days-props.slAutoWithoutPay>props.balance
                                                    ?
                                                    formatCreditAvailableDecimal(props.balance,Math.floor(props.balance))
                                                    :
                                                    formatCreditAvailableDecimal(props.balance,(props.applied_days-props.slAutoWithoutPay))
                                                :
                                                ''
                                            }
                                            </td>
                                        </tr>
                                    </tbody>
                                    
                                </table>
                                <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_ao.office_ao?props.office_ao.office_ao.toUpperCase():''}</u></h5>
                                <h5 className='center' style ={{fontSize:'9px'}}>{props.office_ao.office_ao_assign} <br/>
                                _______________________________________________________ <br/>
                                <strong>(Authorized Officer)</strong>
                                </h5>
                        </Grid>
                        <Grid item xs={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.B RECOMMENDATION
                            </Typography>
                            <label className='label'>
                                    <input type = "checkbox" checked = {props.info.status === 'FOR APPROVAL'? true:false} readOnly/> &nbsp;For Approval
                            </label>
                            <br/>
                            <label className='label'>
                                <input type = "checkbox" checked = {props.info.status === 'DISAPPROVED' ? true:false} readOnly/> &nbsp;For Disapproval due to
                            
                            </label>
                            <p style = {{paddingLeft:'15px',lineHeight:'15px'}}>
                            _________________________<br/>
                            _________________________<br/>
                            _________________________<br/>
                            </p>
                            <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_head.office_head?props.office_head.office_head.toUpperCase():''}</u></h5>
                            <h5 className='center' style ={{fontSize:'9px'}}>{props.office_head.office_head_pos} <br/>
                            ___________________________________________________________<br/>
                            <strong>(Authorized Officer)</strong>
                            </h5>

                        </Grid>

                        <Grid item xs={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.C APPROVED FOR:
                                </Typography>
                                <Grid item xs = {12}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                
                                {
                                    props.leaveType === 4
                                    ?
                                    <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                :'center'}}>{props.maternity_days}</p>
                                    :
                                        props.leaveType === 1 || props.leaveType === 2
                                        ?
                                            props.applied_days > props.balance
                                            ?
                                                props.balance === 0
                                                ?
                                                <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                :'center'}}></p>
                                                :
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{Math.floor(props.balance)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                            :'center'}}>{props.applied_days}</p>
                                        :
                                            props.leaveType === 3
                                            ?
                                                props.applied_days - props.slAutoWithoutPay > props.balance
                                                ?
                                                    props.balance === 0
                                                    ?
                                                    <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                    :'center'}}></p>
                                                    :
                                                    <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                    :'center'}}>{Math.floor(props.balance)}</p>
                                                :
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{props.applied_days-props.slAutoWithoutPay}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                        :'center'}}>{props.applied_days}</p>
                                    }

                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;days with pay</p>
                                </Grid>
                                </Box>

                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                {
                                    props.leaveType === 1 || props.leaveType === 2
                                    ?
                                    props.applied_days > props.balance
                                        ?
                                        <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{props.applied_days-Math.floor(props.balance)}</p>
                                        :
                                        <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                    :
                                        props.leaveType === 3
                                        ?
                                            props.slTotalWithoutPay !== 0
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                    :'center'}}>{props.slTotalWithoutPay}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                        :
                                    <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                }

                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;days without pay</p>
                                </Grid>
                                </Box>
                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'5px',textAlign:'center'}}></p>

                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;others (Specify)</p>
                                </Grid>
                                </Box>

                                </Grid>

                        </Grid>
                        <Grid item xs={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.D DISAPPROVED DUE TO: <br/>
                                </Typography>
                                <p style={{lineHeight:'15px',paddingLeft:'15px'}}>
                                ________________________________<br/>
                                ________________________________<br/>
                                ________________________________</p>
                        </Grid>
                        <Grid item xs={12}>
                                <Typography sx={{textAlign:'center',fontSize:'12px',fontWeight:'600'}}>
                                {
                                    props.auth_info.length !==0
                                    ?
                                    <>
                                    <u>{props.auth_info[0].auth_name.toUpperCase()}</u><br/>
                                        {props.auth_info[0].auth_pos}
                                    </>
                                    :
                                    ''
                                }
                               
                                </Typography>
                        </Grid>
                    </Grid>
                    </div>   
                </>
                :
                <>
                 <div style = {{position:'absolute'}}>
                    <em><h5 style={{fontSize:'9px',fontWeight:'bold'}}>Civil Service Form No. 6 <br/>
                    Revised 2020</h5></em>
                    </div>
                    <div style = {{position:'absolute',margin:'0 0 0 140px'}}>
                        <img src={Logo} alt="" width={70} height={70} />
                    </div>
                    <div className='center'>
                        <h5 className='font-header'>Republic of the Philippines<br/>
                        City Government of Butuan<br/>
                        J. Rosales Ave., Butuan City</h5>
                    </div>
                    <div className='center'>
                        <h3 style = {{fontSize:'19px',fontWeight:'bold'}}>APPLICATION FOR LEAVE</h3>
                    </div>
                    <div className='print'>
                    <Grid container sx={{border:'solid 1px'}}>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px'}}>
                            <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                <h5 style={{fontSize:'12px'}}>
                                    1. OFFICE/DEPARTMENT  <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.officeassign}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    2. NAME :
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (LAST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.lname}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (FIRST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.fname}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (MIDDLE) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                                </h5>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px',borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    3. DATE OF FILING &nbsp;
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{date}</span>
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    4. POSITION &nbsp;
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{props.info.designation}</span>
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    5. SALARY &nbsp;
                                    {props.info.monthly_salary
                                    ?
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>&#8369; {formatNumber((props.info.monthly_salary/12).toFixed(2))}</span>
                                    :
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>N/A</span>
                                        
                                    }
                                    
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                6. DETAILS OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx = {{fontSize:'12px'}}>
                                6.A TYPE OF LEAVE TO BE AVAILED OF
                            </Typography>
                            {props.data.map((data,key)=>
                                <div  key = {key}>
                                    {data.leave_type_id === 15 || data.leave_type_id === 14
                                    ?
                                    ''
                                    :
                                    <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === data.leave_type_id  ? true:false} readOnly/>&nbsp;{data.leave_type_name} <small className='label-desc'>{data.leave_desc}</small>
                                    </label>
                                    }
                                    
                                </div>
                                )}
                                <br/>
                            <Grid item xs={10}>
                                <Typography sx = {{fontSize:'12px'}}>
                                    <em>Others:</em>
                                </Typography>
                                <Typography sx = {{paddingLeft:'10px',fontWeight:'bold',fontSize:'12px',borderBottom:'solid 1px',marginBottom:'10px'}}>
                                    {
                                    props.leaveType === 15
                                    ?
                                    props.specifyDetails
                                    :
                                    ''
                                    }
                                </Typography>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={5} sx ={{borderTop:'solid 1px',padding:'0 10px 0 10px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.B DETAILS OF LEAVE </Typography>
                                <em className='info-header'>In case of Vacation/Special Privilege Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11?true:false :false} readOnly/> &nbsp;Within the Philippines &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                            <span>_____________________</span>
                                        :
                                        <span>_____________________</span>
                                    :
                                    <span>_____________________</span>
                                    }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12?true:false :false} readOnly/> &nbsp;Abroad (Specify) &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                            <span>_________________________</span>
                                        :
                                        <span>_________________________</span>
                                    :
                                    <span>_________________________</span>


                                }
                                </label>
                                <br/>
                                
                                <em className='info-header'>In case of Sick Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 5?true:false :false} readOnly/> &nbsp;In Hospital (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 5
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                            <span>_________________</span>
                                        :
                                        <span>_________________</span>
                                    :
                                    <span>_________________</span>


                                }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 6?true:false :false} readOnly/> &nbsp;Out Patient (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 6
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_____{props.specifyDetails}_____</u>
                                            :
                                        <span>________________<br/>____________________________________________</span>
                                        :
                                        <span>________________<br/>____________________________________________</span>
                                    :
                                    <span>________________<br/>____________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Special Leave Benefits for Women:</em><br/>
                                <label className='label'>
                                    (Specify Illness) {
                                    props.leaveType === 11
                                    ?
                                        props.specifyDetails !== ''
                                        ?
                                        <u>_____{props.specifyDetails}_____</u>
                                        :
                                        <span>____________________________________________</span>
                                    :
                                    <span>____________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Study Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 8 ? props.leaveDetails === 7?true:false :false} readOnly/> &nbsp;Completion of Master's Degree
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox"  checked = {props.leaveType === 8 ? props.leaveDetails === 8?true:false :false} readOnly/> &nbsp;BAR/Board Examination Review
                                </label>
                                <br/>

                                <em className='info-header'>Other purpose:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 9?true:false :false} readOnly/> &nbsp;Monetization of Leave Credits
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 10?true:false :false} readOnly/> &nbsp;Terminal Leave
                                </label>
                        </Grid>
                        <Grid item xs = {7} sx={{borderTop:'solid 1px',borderRight:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    6.C NUMBER OF WORKING DAYS APPLIED FOR
                                </Typography>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.leaveType === 4 ? props.maternity_days : props.applied_days} {props.applied_days>1?' days':' day'}</strong>
                                    </Typography>
                                </Grid>
                                
                                <br/>
                                <h5 className='info-header'>INCLUSIVE DATES</h5>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.inclusiveDates}</strong>
                                    </Typography>
                                </Grid>
                                
                        </Grid>
                        <Grid item xs = {5} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.D COMMUTATION</Typography>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Not Requested'?true:false} readOnly/> &nbsp;Not Requested
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Requested'?true:false} readOnly/> &nbsp;Requested
                                </label>
                                <br/>
                                <div className='center'>
                                    <span style={{fontSize:'9px'}}>______________<u><strong>{props.info.fullname}</strong></u>___________________</span>
                                    <br/>
                                    <span className='info-header'>Signature of Applicant</span>
                                </div>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                7. DETAILS OF ACTION OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.A CERTIFICATION OF LEAVE CREDITS
                            </Typography>
                            <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                                As of <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{moment(new Date()).format('MMMM YYYY')}</span>
                            </Typography>
                            <table style={{border: '1px solid',width:'100%',fontSize:'9px'}}>
                                    <thead>
                                        <tr >
                                        <th>
                                        
                                        </th>
                                        <th style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Vacation Leave
                                        </th>
                                        <th  style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Sick Leave
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Total Earned</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                                {
                                                props.pendinginfo.leave_type_id === 15
                                                ?
                                                props.pendinginfo.vl_before_review
                                                :
                                                props.leaveType ===1 || props.leaveType ===2
                                                ?
                                                    props.pendinginfo.bal_before_process
                                                :
                                                    props.vl
                                                }
                                                </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.pendinginfo.leave_type_id === 15
                                                ?
                                                props.pendinginfo.sl_before_review
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.pendinginfo.bal_before_process
                                                :
                                                props.sl
                                                }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Less this Application</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            props.pendinginfo.others_vl
                                            :
                                            props.leaveType === 1 || props.leaveType === 2
                                            ?   
                                                props.pendinginfo.days_with_pay
                                            :
                                            ''
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            props.pendinginfo.others_sl
                                            :
                                            props.leaveType === 3
                                            ?
                                                props.pendinginfo.days_with_pay
                                            :
                                            ''
                                            }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Balance</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            props.pendinginfo.vl_after_review
                                            :
                                            props.leaveType === 1 || props.leaveType === 2
                                            ?
                                                props.pendinginfo.bal_after_process
                                            :
                                            ''
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            props.pendinginfo.sl_after_review
                                            :
                                            props.leaveType === 3
                                            ?
                                                props.pendinginfo.bal_after_process
                                            :
                                            ''
                                            }
                                            </td>
                                        </tr>
                                    </tbody>
                                    
                                </table>
                                {/* {props.signatory.map((data,key)=>
                                    data.location === '7.A'
                                    ?
                                    <div key = {key}>
                                    <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{data.assign_name}</u></h5>
                                    <h5 className='center' style ={{fontSize:'9px'}}>{data.assign_position} <br/>
                                    _________________________________________________________________________________________________ <br/>
                                    <strong>(Authorized Officer)</strong>
                                    </h5>
                                    </div>
                                    :
                                    ''
                                )} */}
                                <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_ao.office_ao?props.office_ao.office_ao.toUpperCase():''}</u></h5>
                                <h5 className='center' style ={{fontSize:'9px'}}>{props.office_ao.office_ao_assign} <br/>
                                _______________________________________________________ <br/>
                                <strong>(Authorized Officer)</strong>
                                </h5>
                        </Grid>
                        <Grid item xs={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.B RECOMMENDATION
                            </Typography>
                            <label className='label'>
                                    <input type = "checkbox" checked = {props.pendinginfo.status === 'FOR APPROVAL' || props.pendinginfo.status === 'APPROVED' ? true:false} readOnly/> &nbsp;For Approval
                            </label>
                            <br/>
                            <label className='label'>
                                <input type = "checkbox" checked = {props.pendinginfo.status === 'DISAPPROVED' && props.pendinginfo.disapproved_type === 'OFFICE HEAD'? true:false} readOnly/> &nbsp;For Disapproval due to
                            
                            </label>
                            {
                                props.pendinginfo.status === 'DISAPPROVED' && props.pendinginfo.disapproved_type === 'OFFICE HEAD'
                                ?
                                <Typography sx={{fontSize:'10px',borderBottom:'solid 1px'}}>{props.pendinginfo.remarks}</Typography>
                                :
                                <>
                                <p style = {{paddingLeft:'15px',lineHeight:'15px'}}>
                                _________________________<br/>
                                _________________________<br/>
                                _________________________<br/>
                                </p>
                                </>
                            }
                            {/* {props.signatory.map((data,key)=>
                                data.location === '7.B'
                                ?
                                <div key = {key}>
                                <h5 className='info-text center' style ={{margin:'23px 0 0 0'}}><u>{data.assign_name}</u></h5>
                                <h5 className='center' style ={{fontSize:'9px'}}>{data.assign_position} <br/>
                                _______________________________________________________ <br/>
                                    <strong>(Authorized Officer)</strong>
                                </h5>
                                </div>
                                :
                                ''
                            )} */}
                            <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_head.office_head?props.office_head.office_head.toUpperCase():''}</u></h5>
                            <h5 className='center' style ={{fontSize:'9px'}}>{props.office_head.office_head_pos} <br/>
                            ___________________________________________________________<br/>
                            <strong>(Authorized Officer)</strong>
                            </h5>

                        </Grid>

                        <Grid item xs={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.C APPROVED FOR:
                                </Typography>
                                <Grid item xs = {12}>
                                    <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <Grid item xs = {3}>
                                        {
                                            props.pendinginfo.days_with_pay
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                        :'center'}}>{props.pendinginfo.days_with_pay}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                        }
                                        </Grid>
                                        <Grid item xs = {9}>
                                        <p className='info-header'>&nbsp;days with pay</p>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                    <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <Grid item xs = {3}>
                                        {
                                            props.pendinginfo.days_without_pay
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                        :'center'}}>{props.pendinginfo.days_without_pay}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                        }
                                        </Grid>
                                        <Grid item xs = {9}>
                                        <p className='info-header'>&nbsp;days without pay</p>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                    <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <Grid item xs = {3}>
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'5px',textAlign:'center'}}></p>
                                        </Grid>
                                        <Grid item xs = {9}>
                                        <p className='info-header'>&nbsp;others (Specify)</p>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* <p style={{lineHeight:'15px'}}>
                                <span className='info-header' >______<u>
                                    {
                                    props.pendinginfo.days_with_pay
                                    ?
                                    props.pendinginfo.days_with_pay
                                    :
                                    ''
                                    }</u>________ days with pay</span><br/>
                                <span className='info-header'>______<u>
                                    {
                                    props.pendinginfo.days_without_pay
                                    ?
                                    props.pendinginfo.days_without_pay
                                    :
                                    ''
                                    }</u>________ days without pay</span><br/>
                                <span className='info-header'>________________ others (Specify)</span>
                                </p> */}
                        </Grid>
                        <Grid item xs={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.D DISAPPROVED DUE TO:
                                </Typography>
                                {
                                props.pendinginfo.status === 'DISAPPROVED' && props.pendinginfo.disapproved_type === 'CMO'
                                ?
                                <Typography sx={{fontSize:'10px',borderBottom:'solid 1px'}}>{props.pendinginfo.remarks}</Typography>
                                :
                                <p style={{lineHeight:'15px',paddingLeft:'15px'}}>
                                {props.pendinginfo.disapproved_type==='CMO'
                                ?
                                <>
                                <u style={{width:'100%'}}>{props.pendinginfo.remarks}</u> <br/>
                                </>
                                :
                                <>
                                ________________________________<br/>
                                </>
                                }
                                ________________________________<br/>
                                ________________________________
                                </p>
                            }
                                
                        </Grid>
                        <Grid item xs={12}>
                                <Typography sx={{textAlign:'center',fontSize:'12px',fontWeight:'600'}}>
                                {
                                    props.auth_info.length !==0
                                    ?
                                    <>
                                    <u>{props.auth_info[0].auth_name.toUpperCase()}</u><br/>
                                        {props.auth_info[0].auth_pos}
                                    </>
                                    :
                                    ''
                                }
                                </Typography>
                        </Grid>
                    </Grid>
                    </div>   
                </>
            }
           
            
            <div className='print leave-form-back' style={{display:props.is_preview?'none':'block'}}>
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{border:'solid 1px',textAlign:'center'}}>
                    <Typography sx={{fontSize:'14px',fontWeight:'600'}}>INSTRUCTIONS AND REQUIREMENTS</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} sx={{marginTop:'10px'}}>
                    <Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>Application for any type of leave shall be made on this Form and <u><strong>to be accomplished at least in duplicate</strong></u> with documentary requirements, as follows:</Typography>
                    <Typography sx={{paddingTop:'10px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>1. Vacation leave*</strong>
                    </Typography>
                    <Typography sx={{paddingLeft:'15px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        It shall be filed five (5) days in advance, whenever possible, of the effective date of such leave. Vacation leave within in the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from money and work accountabilities.
                    </Typography>

                    <Typography sx={{paddingTop:'10px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>2. Mandatory/Forced leave</strong>
                    </Typography>
                    <Typography sx={{paddingLeft:'15px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                    Annual five-day vacation leave shall be forfeited if not taken during the year. In case the scheduled leave has been cancelled in the exigency of the service by the head of agency, it shall no longer be deducted from the accumulated vacation leave. Availment of one (1) day or more Vacation Leave (VL) shall be considered for complying the mandatory/forced leave subject to the conditions under Section 25, Rule XVI of the Omnibus Rules Implementing E.O. No. 292.
                    </Typography>
                        
                    <Box sx={{marginTop:'-5px',marginBottom:'-10px'}}>
                    <Typography sx={{paddingTop:'10px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>3. Sick leave*</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        It shall be filed immediately upon employee's return from such leave.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        If filed in advance or exceeding five (5) days, application shall be accompanied by a <u>medical certificate</u>. In case medical consultation was not availed of, an <u>affidavit</u> should be executed by an applicant.
                        </Typography>
                        </li>
                    </ul>
                    </Box>
                    
                    <Box sx={{marginTop:'-10px',marginBottom:'-10px'}}>
                    <Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>4. Maternity leave* – 105 days</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Proof of pregnancy e.g. ultrasound, doctor’s certificate on the expected date of delivery.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Accomplished Notice of Allocation of Maternity Leave Credits (CS Form No. 6a), if needed.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Seconded female employees shall enjoy maternity leave with full pay in the recipient agency.
                        </Typography>
                        </li>
                    </ul>
                    </Box>
                    <Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>5. Paternity leave – 7 days</strong>
                    </Typography>
                    <Typography sx={{paddingLeft:'15px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                    Proof of child’s delivery e.g. birth certificate, medical certificate and marriage contract.
                    </Typography>

                    <Typography sx={{paddingTop:'10px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>6. Special Privilege leave – 3 days</strong>
                    </Typography>
                    <Typography sx={{paddingLeft:'15px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                    It shall be filed/approved for at least one (1) week prior to availment, except on emergency cases. Special privilege leave within the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from money and work accountabilities.
                    </Typography>

                    <Typography sx={{paddingTop:'10px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>7. Solo Parent leave – 7 days</strong>
                    </Typography>
                    <Typography sx={{paddingLeft:'15px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                    It shall be filed in advance or whenever possible five (5) days before going on such leave with updated Solo Parent Identification Card.
                    </Typography>
                    
                    <Box sx={{marginTop:'-5px',marginBottom:'-10px'}}>
                    <Typography sx={{paddingTop:'10px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>8. Study leave* – up to 6 months</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Shall meet the agency’s internal requirements, if any;
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Contract between the agency head or authorized representative and the employee concerned.
                        </Typography>
                        </li>
                    </ul>
                    </Box>
                    <Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>9.  VAWC leave – 10 days</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        It shall be filed in advance or immediately upon the woman employee’s return from such leave.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        It shall be accompanied by any of the following supporting documents:<br/>
                        a. Barangay Protection Order (BPO) obtained from the barangay;<br/>
                        b. Temporary/Permanent Protection Order (TPO/PPO) obtained from the court;<br/>
                        c. If the protection order is not yet issued by the barangay or the court, a certification issued by the Punong Barangay/Kagawad or Prosecutor or the Clerk of Court that the application for the BPO,
                        </Typography>
                        </li>
                    </ul>

                    
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} sx={{marginTop:'10px'}}>
                    <Typography sx={{paddingLeft:'30px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>TPO or PPO has been filed with the said office shall be sufficient to support the application for the ten-day leave; or
                    </Typography>
                    <span style={{position:'absolute',fontSize:'9px',paddingRight:'30px',textAlign:'justify',paddingLeft:'15px'}}>d. </span>

                    <Typography sx={{fontSize:'9px',paddingLeft:'30px',paddingRight:'30px',textAlign:'justify'}}>
                    <span>In the absence of the BPO/TPO/PPO or the certification, a police report specifying the details of the occurrence of violence on the victim and a medical certificate may be considered, at the discretion of the immediate supervisor of the woman employee concerned.</span>
                    </Typography>
                    <Typography sx={{paddingLeft:'30px',fontSize:'9px',textAlign:'justify'}}>
                   
                    </Typography>
                    
                    <Box sx={{marginTop:'-5px',marginBottom:'-10px'}}>
                    <Typography sx={{paddingTop:'10px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>10. Rehabilitation leave* – up to 6 months</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Application shall be made within one (1) week from the time of the accident except when a longer period is warranted.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Letter request supported by relevant reports such as the police report, if any,
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Medical certificate on the nature of the injuries, the course of treatment involved, and the need to undergo rest, recuperation, and rehabilitation, as the case may be.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Written concurrence of a government physician should be obtained relative to the recommendation for rehabilitation if the attending physician is a private practitioner, particularly on the duration of the period of rehabilitation.
                        </Typography>
                        </li>
                    </ul>
                    </Box>
                    <Box sx={{marginTop:'-5px',marginBottom:'-10px'}}>
                    <Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>11. Special leave benefits for women* – up to 2 months</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        The application may be filed in advance, that is, at least five (5) days prior to the scheduled date of the gynecological surgery that will be undergone by the employee. In case of emergency, the application for special leave shall be filed immediately upon employee’s return but during confinement the agency shall be notified of said surgery.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        The application shall be accompanied by a medical certificate filled out by the proper medical authorities, e.g. the attending surgeon accompanied by a clinical summary reflecting the gynecological disorder which shall be addressed or was addressed by the said surgery; the histopathological report; the operative technique used for the surgery; the duration of the surgery including the peri-operative period (period of confinement around surgery); as well as the employees estimated period of recuperation for the same.
                        </Typography>
                        </li>
                    </ul>
                    </Box>
                    <Box sx={{marginTop:'-5px',marginBottom:'-10px'}}>
                    <Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>12. Special Emergency (Calamity) leave – up to 5 days</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        The special emergency leave can be applied for a maximum of five (5) straight working days or staggered basis within thirty (30) days from the actual occurrence of the natural calamity/disaster. Said privilege shall be enjoyed once a year, not in every instance of calamity or disaster.
                        </Typography>
                        </li>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        The head of office shall take full responsibility for the grant of special emergency leave and verification of the employee’s eligibility to be granted thereof. Said verification shall include: validation of place of residence based on latest available records of the affected employee; verification that the place of residence is covered in the declaration of calamity area by the proper government agency; and such other proofs as may be necessary.
                        </Typography>
                        </li>
                    </ul>
                    </Box>
                    <Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>13. Monetization of leave credits</strong>
                    </Typography>
                    <Typography sx={{paddingLeft:'20px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                    Application for monetization of fifty percent (50%) or more of the accumulated leave credits shall be accompanied by letter request to the head of the agency stating the valid and justifiable reasons.
                    </Typography>

                    <Typography sx={{marginTop:'8px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>14. Terminal leave*</strong>
                    </Typography>
                    <Typography sx={{paddingLeft:'20px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                    Proof of employee’s resignation or retirement or separation from the service.
                    </Typography>

                    <Typography sx={{marginTop:'8px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        <strong>15. Adoption Leave</strong>
                    </Typography>
                    <ul style={{lineHeight:'1px'}}>
                        <li><Typography sx={{paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                        Application for adoption leave shall be filed with an authenticated copy of the Pre-Adoptive Placement Authority issued by the Department of Social Welfare and Development (DSWD).
                        </Typography>
                        </li>
                    </ul>
                       
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{marginTop:'10px',borderTop:'solid 1px'}}>
                    <Typography sx={{paddingTop:'5px',paddingRight:'30px',fontSize:'9px',textAlign:'justify'}}>
                    * For leave of absence for thirty (30) calendar days or more and terminal leave, application shall be accompanied by a <u>clearance from money, property and work-related accountabilities </u>pursuant to CSC Memorandum Circular No. 2, s. 1985).
                    </Typography>
                </Grid>
            </Grid>
            </div>

        </div>
    )
})
export default PreviewLeaveApplicationForm